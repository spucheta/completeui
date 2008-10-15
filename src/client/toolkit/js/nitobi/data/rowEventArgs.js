/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.grid');

/**
 * Base event arguments for Cell events.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Cell} cell The Cell object of the cell that received focus.
 */
nitobi.grid.RowEventArgs = function(source, row)
{
	/**
	 * @private
	 */
	this.grid = source;
	/**
	 * @private
	 */
	this.row = row;
	/**
	 * @private
	 */
	this.event = nitobi.html.Event;
}

/**
 * Gets the Grid that fired the event.
 * @return nitobi.grid.Grid
 */
nitobi.grid.RowEventArgs.prototype.getSource = function()
{
	return this.grid;
}
/**
 * Gets the Row on which the event was fired.
 * @return nitobi.grid.Cell
 */
nitobi.grid.RowEventArgs.prototype.getRow = function()
{
	return this.row;
}
/**
 * Gets the native browser Event object that is associated with the event. This may be null in some case.
 */
nitobi.grid.RowEventArgs.prototype.getEvent = function()
{
	return this.event;
}