/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.collections');

/**
 * nitobi.collections.CacheMap represents a doubly linked list of CacheNode objects.
 * It is used to keep track of ranges. The next and prev properties provide
 * access to the respective nodes in the linked list.
 * @constructor
 * @class
 */
nitobi.collections.CacheMap = function()
{
	this.tail = null;
	this.debug = new Array();
}

/**
 * Insert will create and insert a new CacheNode into the CacheMap at the appropriate position.
 * If the range specified by the low and high overlaps any existing CacheNodes those
 * nodes will be expanded and/or merged.
 * @param {Number} low The low argument is the low end of the range to insert (inclusive)
 * @param {Number} high The high argument is the high end of the range to insert (inclusive)
 */
nitobi.collections.CacheMap.prototype.insert = function(low,high)
{
	low = Number(low);
	high = Number(high);
	this.debug.push("insert("+low+","+high+")");
	var newNode = new nitobi.collections.CacheNode(low,high);
	if (this.head==null){
		this.debug.push("empty cache, adding first node");
		this.head = newNode;
		this.tail = newNode;
	}
	else
	{
		// Handle adding at beginning or end as special
		// case due to the fact that ranges are quite
		// often prepended or appended to the list.
		var n = this.head;
		// find the node that will come after the new one.
		while (n != null && low>n.high+1)
		{
			n = n.next;
		}
		if (n==null) {
			this.debug.push("appending node to end");
			this.tail.next = newNode;
			newNode.prev = this.tail;
			this.tail = newNode;
		}
		else
		{
			this.debug.push("inserting new node before " + n.toString());
			if (n.prev != null)
			{
				newNode.prev = n.prev;
				n.prev.next = newNode;
			}
			newNode.next = n;
			n.prev = newNode;

			while(newNode.mergeNext())
			{
			}

			if (newNode.prev==null)
			{
				this.head = newNode;
			}
			if (newNode.next==null)
			{
				this.tail = newNode;
			}
		}
	}
}

/**
 * Remove will remove a the specified range from the CacheMap.
 * If the range specified by the low and high arguments overlaps any existing CacheNodes those
 * nodes will be reduced in size or removed completely.
 * @param {Number} low The low argument is the low end of the range to remove (inclusive)
 * @param {Number} high The high argument is the high end of the range to remove (inclusive)
 */
nitobi.collections.CacheMap.prototype.remove = function(low, high)
{
	low = Number(low);
	high = Number(high);
	this.debug.push("insert("+low+","+high+")");
	if (this.head==null){
	}
	else
	{	
	    if (high < this.head.low || low > this.tail.high)
	        return;

		// Handle adding at beginning or end as special
		// case due to the fact that ranges are quite
		// often prepended or appended to the list.
		var start = this.head;

		while (start != null && low > start.high)
		{
			start = start.next;
		}

		if (start==null)
		{
			this.debug.push("the range was not found");
		}
		else
		{
			var end = start;
			var temp = null;

			while (end != null && high > end.high)
    		{
    		    if ((end.next != null && high < end.next.low) || end.next == null)
    		        break;
				temp = end.next;
				if (end != start)
			    {
					this.removeNode(end);
				}
				end = temp;
			}

            if (start != end)
            {
                if (high >= end.high)
                {
                    //    that means the entire end node is to be removed
                    this.removeNode(end);
                }

                if (low <= start.low)
                {
                    //    that means the entire start node is to be removed
                    this.removeNode(start);
                }
            }
            //    start and end are the same ...
            //    only thing left here is if we are removing the exact node
            else if (start.low >= low && start.high <= high)
            {
                this.removeNode(start);
                return;
            }
            //    otherwise we need to create a node cause we are removing a range
            //    that is smaller than the single node.
            else if (low > start.low && high < start.high)
            {
                var origLow = start.low;
                var origHigh = start.high;
                this.removeNode(start);
                this.insert(origLow, low-1);
                this.insert(high+1, origHigh);
                return;
            }

            if (end != null && high < end.high)
            {
                //    that means that the end node is not the start and it will have to made smaller
                end.low = high+1;
            }

            if (start != null && low > start.low)
            {
                //    that means we have to shorten the start range since low is somewhere in it
                start.high = low-1;
            }
		}
	}		
}

/**
 * The gaps method will return an array containing the gaps in the CacheMap 
 * that exist in the specified range.
 * @param {Number} low The low argument is the low end of the range to check for gaps in (inclusive)
 * @param {Number} high The high argument is the high end of the range to check for gaps in (inclusive)
 * @type Array
 */
nitobi.collections.CacheMap.prototype.gaps = function(low,high)
{
	// Could this search be executed faster in XPath???
	var g = new Array();
	var n = this.head;

	if (n==null || n.low>high || this.tail.high<low)
	{
		// our search range lies entirely outside our cache
		g.push(new nitobi.collections.Range(low,high));
		return g;
	}

	//	This loops through all the nodes in our cacheMap until
	//	a node high value is greater than the low end of our range

	//TODO: change this to a binary search???
	var minLow = 0;
	while (n != null && n.high < low) // shouldn't overlap???
	{
		minLow = n.high+1;
		n = n.next;
	}

	if (n!=null)
	{
		do
		{
			if (g.length == 0) // if this is the first gap.
			{
				if (low < n.low) {
//						g.push(new nitobi.collections.Range(low,Math.min(n.low-1,high)));
					g.push(new nitobi.collections.Range(Math.max(low,minLow),Math.min(n.low-1,high))); // Need to consider the case where the previous high overlaps the inserted range's low
				}
			}
			if (high > n.high)
			{
				if (n.next == null || n.next.low > high) // Need to consider the case where the inserted range's high overlaps the next range's low
				{
					g.push(new nitobi.collections.Range(n.high+1, high));
				}
				else
				{
					g.push(new nitobi.collections.Range(n.high+1, n.next.low-1));
				}
			}
			n = n.next;
		} while (n != null && n.high < high)
	}
	else
	{
		g.push(new nitobi.collections.Range(this.tail.high+1,high));
	}
	return g;
}

/**
 * The gaps method will return an array containing the gaps in the CacheMap 
 * that exist in the specified range.
 * @param {Number} low The low argument is the low end of the range to check for gaps in (inclusive)
 * @param {Number} high The high argument is the high end of the range to check for gaps in (inclusive)
 * @type Array
 */
nitobi.collections.CacheMap.prototype.ranges = function(low,high)
{
	// TODO: Could this search be executed faster in XPath???
	var g = new Array();
	var n = this.head;

	if (n==null || n.low>high || this.tail.high<low)
	{
		// our search range lies entirely outside our cache
		return g;
	}

	//	This loops through all the nodes in our cacheMap until
	//	a node high value is greater than the low end of our range

	//TODO: change this to a binary search???
	while (n != null && n.high < low) // shouldn't overlap???
	{
		minLow = n.high+1;
		n = n.next;
	}
	if (n!=null)
	{
		do
		{
			g.push(new nitobi.collections.Range(n.low,n.high));
			n = n.next; 
		} while (n != null && n.high < high)
	}
	return g;
}

/**
 * @private
 */
nitobi.collections.CacheMap.prototype.gapsString = function(low,high)
{
	var gs = this.gaps(low,high);
	var a = new Array();
	for (var i = 0; i < gs.length; i++) {
		a.push(gs[i].toString());
	}
	return a.join(",");
}

/**
 * @private
 */
nitobi.collections.CacheMap.prototype.removeNode = function(node)
{
	if (node.prev != null)
	{
		node.prev.next = node.next;
	}
	else
	{
		this.head = node.next;
	}

	if (node.next != null)
	{
		node.next.prev = node.prev;
	}
	else
	{
		this.tail = node.prev;
	}

	node = null;
}

/**
 * Returns the cache map as a comma separated string
 * @type String
 */
nitobi.collections.CacheMap.prototype.toString = function()
{
	var n = this.head;
	var s = new Array();
	while (n != null) {
		s.push(n.toString());
		n = n.next;			
	}

/*		var t = this.tail;
		var a = new Array();
		while (t != null) {
			a.push(t.toString());
			t = t.prev;			
		}
*/
	return s.join(",");// + ' :: ' + a.join(",");
}

/**
 * Empties the cache map.
 */
nitobi.collections.CacheMap.prototype.flush = function()
{
	var node = this.head;
	while(Boolean(node))
	{
		var next = node.next;
		delete(node);
		node = next;
	}
	this.head=null;
	this.tail=null;
}

/**
* Inserts a single entry into the map. If the entry exists within a
* range, then the ranges are updated. If the entry does not exist within
* any range, then the entry is added.
* @param {Number} index The index of the entry to add.
*/
nitobi.collections.CacheMap.prototype.insertIntoRange = function(index)
{
	var n = this.head;
	var inc = 0;
	while (n != null) 
	{
		if (index >= n.low && index <= n.high)
		{
			inc = 1;
			n.high += inc;
		}
		else
		{
			n.low += inc;
			n.high += inc;
		}
		n = n.next;
	}
	// Check to see if we found anything at all.
	if (inc == 0)
	{
		this.insert(index,index);
	}
}

/**
* Deletes a single entry from the map. If the range in which the 
* entry resides is of length == 1, then the whole entry is removed.
* All subsequent ranges are updated.
* @param {Number} index The index of the entry to delete.
*/
nitobi.collections.CacheMap.prototype.removeFromRange = function(index)
{
	var n = this.head;
	var inc = 0;
	while (n != null) 
	{
		if (index >= n.low && index <= n.high)
		{
			inc = -1;
			if (n.low == n.high)
			{
				this.remove(index,index);	
			}
			else
			{
				n.high += inc;
			}
		}
		else
		{
			n.low += inc;
			n.high += inc;
		}
		n = n.next;
	}
	ntbAssert(inc!=0,"Tried to remove something from a range where the range does not exist");
}