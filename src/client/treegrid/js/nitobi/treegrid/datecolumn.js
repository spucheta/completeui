/**
 * @constructor
 * @extends nitobi.grid.Column
 */
nitobi.grid.DateColumn = function(grid, column, surface)
{
	//	Call the base constructor
	nitobi.grid.DateColumn.baseConstructor.call(this, grid, column, surface);
}

nitobi.lang.extend(nitobi.grid.DateColumn, nitobi.grid.Column);

var ntb_datep = nitobi.grid.DateColumn.prototype;
ntb_datep.setMask=function(){this.xSET("Mask",arguments);}
ntb_datep.getMask=function(){return this.xGET("Mask",arguments);}
ntb_datep.setCalendarEnabled=function(){this.xSET("CalendarEnabled",arguments);}
ntb_datep.isCalendarEnabled=function(){return nitobi.lang.toBool(this.xGET("CalendarEnabled",arguments), false);}