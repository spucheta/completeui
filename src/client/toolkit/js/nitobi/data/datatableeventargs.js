/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.data');
if (false)
{
	/**
	 * @class
	 * @constructor
	 */
	nitobi.data = function(){};
}

/**
 * Base event arguments for events that occur on the data source events.
 * @class
 * @constructor
 * @param {nitobi.data.DataTable} source The object which is firing the event.
 */
nitobi.data.DataTableEventArgs = function(source)
{
	/**
	 * @private
	 */
	this.source = source;
	/**
	 * @private
	 */
	this.event = nitobi.html.Event;
}

/**
 * Gets the Grid that fired the event.
 * @return nitobi.grid.Grid
 */
nitobi.data.DataTableEventArgs.prototype.getSource = function()
{
	return this.source;
}
/**
 * Gets the native browser Event object that is associated with the event. This may be null in some case.
 */
nitobi.data.DataTableEventArgs.prototype.getEvent = function()
{
	return this.event;
}