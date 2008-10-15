/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.collections');

nitobi.collections.Range = function(low,high)
{
	this.low=low;
	this.high=high;
}

nitobi.collections.Range.prototype.isIn = function(val)
{
  	return ((val>=this.low) && (val<=this.high));
}

nitobi.collections.Range.prototype.toString = function()
{
  	return "[" + this.low + "," + this.high + "]";
}