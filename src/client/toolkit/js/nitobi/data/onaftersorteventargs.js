/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments for when the a Column is sorted.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Column} cell The Column object of the Column that was sorted.
 * @param {String} direction The direction of the sort. This is either "Asc" or "Desc".
 * @extends nitobi.grid.ColumnEventArgs
 */
nitobi.grid.OnAfterSortEventArgs = function(source, column, direction)
{
	nitobi.grid.OnAfterSortEventArgs.baseConstructor.call(this, source, column);
	this.direction = direction;
}

nitobi.lang.extend(nitobi.grid.OnAfterSortEventArgs, nitobi.grid.ColumnEventArgs);

/**
 * Returns the direction of the sort.
 * @return String
 */
nitobi.grid.OnAfterSortEventArgs.prototype.getDirection = function()
{
	return this.direction;
}