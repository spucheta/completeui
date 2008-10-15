/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.collections');

/**
 * Creates a CacheNode object that maintains a value range.
 * @constructor
 * @class
 * nitobi.collections.CacheNode is a node in a nitobi.collections.CacheMap object.
 * It is characterised by references to a previous and next node 
 * as well as a high and low value.
 * @param {Number} low The low argument is the low end of the nitobi.collections.CacheNode range (inclusive)
 * @param {Number} high The high argument is the high end of the nitobi.collections.CacheNode range (inclusive)
 */
nitobi.collections.CacheNode = function(low,high)
{
	this.low = low;
	this.high = high;
	this.next = null;
	this.prev = null;
}

/**
 * Used to check to see if a value is in a given nitobi.collections.CacheNode.
 * @param {Number} val The value which is to be checked if exists in the nitobi.collections.CacheNode.
 */
nitobi.collections.CacheNode.prototype.isIn = function(val)
{
	return ((val >= this.low) && (val <= this.high));
}

/**
 * Merges this node with it's next neighbour if necessary.
 * ie. if this node is [0,10] and next is [11,20] or [4,20], 
 * we will make a [0,20] node.
 * @type {Boolean}
 */
nitobi.collections.CacheNode.prototype.mergeNext = function()
{
	var next = this.next;
	if (next!=null && next.low<=this.high+1)
	{
		this.high = Math.max(this.high,next.high);
		this.low  = Math.min(this.low, next.low );
		var nextNext = next.next;
		this.next = nextNext; // this.next.next may be null, that's fine.
		if (nextNext != null)
		{
			nextNext.prev = this;
		}
		next.clear();
		return true;
	}
	else {
		return false;
	}
}

/**
 * Sets both the next and previous pointers to null.
 */
// TODO: This might need to be checked - should be checked in unit tests
nitobi.collections.CacheNode.prototype.clear = function()
{
	this.next = null;
	this.prev = null;
}

/**
 * Serializes the node to string in the [low,high] format.
 * @type String
 */
nitobi.collections.CacheNode.prototype.toString = function()
{
	return "[" + this.low + "," + this.high + "]";
}
