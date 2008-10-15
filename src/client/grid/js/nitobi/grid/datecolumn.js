/**
 * Creates a DateColumn.
 * @class A column type used by the Nitobi Grid component to handle date input.
 * @constructor
 * @extends nitobi.grid.Column
 * @param {nitobi.grid.Grid} grid The grid that this column belongs to
 * @param {Number} column The index of the column (zero based)
 */
nitobi.grid.DateColumn = function(grid, column)
{
	//	Call the base constructor
	nitobi.grid.DateColumn.baseConstructor.call(this, grid, column);
}

nitobi.lang.extend(nitobi.grid.DateColumn, nitobi.grid.Column);

var ntb_datep = nitobi.grid.DateColumn.prototype;
/**
 * Sets the mask for the date column.
 * @param {String} value The value to use as the mask
 */
nitobi.grid.DateColumn.prototype.setMask=function(){this.xSET("Mask",arguments);}
/**
 * Returns the mask currently being used by the date column.
 * @type String
 */
nitobi.grid.DateColumn.prototype.getMask=function(){return this.xGET("Mask",arguments);}
/**
 * Sets whether or not to show a calendar when editing a cell in the date column.
 * @param {Boolean} value True to enable the calendar, false otherwise.
 */
nitobi.grid.DateColumn.prototype.setCalendarEnabled=function(){this.xSET("CalendarEnabled",arguments);}
/**
 * Returns true if the calendar is enabled, false otherwise.
 * @type Boolean
 */
nitobi.grid.DateColumn.prototype.isCalendarEnabled=function(){return nitobi.lang.toBool(this.xGET("CalendarEnabled",arguments), false);}