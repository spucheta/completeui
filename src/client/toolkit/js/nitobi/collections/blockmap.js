/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.collections");

/**
 * Creates a BlockMap object.
 * @class nitobi.collections.BlockMap is similar to {@link nitobi.collections.CacheMap} except that adjacent blocks
 * are not collapsed into a single block
 * @constructor
 * @extends nitobi.collections.CacheMap
 */
nitobi.collections.BlockMap = function() 
{
	this.head = null;
	this.tail = null;
	this.debug = new Array();
}

nitobi.lang.extend(nitobi.collections.BlockMap, nitobi.collections.CacheMap);

/**
 * Inserts a block into the blockmap.
 * @param {Number} low The low end of the block range.
 * @param {Number} high The high end of the block range.
 */
nitobi.collections.BlockMap.prototype.insert = function(low,high) 
{
	low = Number(low);
	high = Number(high);
	this.debug.push("insert("+low+","+high+")");
	if (this.head==null){
		var newNode = new nitobi.collections.CacheNode(low,high);
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
		// 1.              [44,46] 
		// 2.                      [54,66] 
		// 3.                           [64,76] 
		//    [10,10] [30,40] ^ [50,60]    ^
		// Slide right comparing the inserted low to each existing high until the inserted low is greater than the exisiting high
		// This will give you ...
		// Case 1:(Inserted low is in a node)    - the node that would contain the low - this will become the "nextNode" for the inserted node
		// Case 2:(Inserted low is in a gap)     - the node that would follow the gap  - this will become the "nextNode" for the inserted node
		// Case 3:(Inserted low higher than all) - NULL                                - Inserted node takes over as the new "tail"
		// Case 4:(No existing nodes-see above)  - NULL - impossible cuz head!=null    - Inserted node becomes the "head" (and "tail")
		while (n != null && low>n.high) 
		{
			n = n.next;
		}
		if (n==null) {
			var newNode = new nitobi.collections.CacheNode(low,high);
			this.debug.push("appending node to end");
			this.tail.next = newNode;
			newNode.prev = this.tail;
			this.tail = newNode;
		}
		else
		{
			this.debug.push("inserting new node into or before " + n.toString());
			// Case 1 or 2
			// Case 1:(Inserted low is in a node) 
			//         - the newNode will follow the insertion point node "n" (assuming its not completely contained)
			//         - the newNode's low is n.high+1
			//         - the newNode's high ... is min(newNode.high,next.low-1) ( high could overlap several blocks - chop at first one)
			// Case 2:(Inserted low is in a gap) 
			//         - the newNode will preceed the insertion point node "n"
			//         - the newNode's low is unchanged
			//         - the newNode's high ... is min(newNode.high,next.low-1) ( high could overlap several blocks - chop at first one)
			if (low<n.low || high>n.high) // inserting into a gap
			{
				if (low<n.low)
				{
					var newNode = new nitobi.collections.CacheNode(low,high);
					newNode.prev = n.prev;
					newNode.next = n;
					if (n.prev != null) {
						n.prev.next = newNode;
					}
					n.prev = newNode;
					newNode.high = Math.min(newNode.high,n.low-1);
				} else {
					var newNode = new nitobi.collections.CacheNode(n.high+1,high);
					newNode.prev = n;
					newNode.next = n.next;
					if (n.next!=null) {
						n.next.prev = newNode;
						newNode.high = Math.min(high,newNode.next.low-1);
					}
					n.next = newNode;
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
}


/**
 * Searches the blockmap for all blocks that intersect the specified range.
 * @param low {Number} The low end of the block range.
 * @param high {Number} The high end of the block range.
 */
nitobi.collections.BlockMap.prototype.blocks = function(low,high) 
{
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

// nitobi.collections.BlockMap.prototype.dispose = function() - Inherits from CacheMap
