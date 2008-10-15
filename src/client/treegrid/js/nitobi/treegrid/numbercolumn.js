/**
 * @constructor
 * @extends nitobi.grid.Column
 */
nitobi.grid.NumberColumn = function(grid, column, surface)
{
	nitobi.grid.NumberColumn.baseConstructor.call(this, grid, column, surface);
}

nitobi.lang.extend(nitobi.grid.NumberColumn, nitobi.grid.Column);

var ntb_numberp = nitobi.grid.NumberColumn.prototype;
ntb_numberp.setAlign=function(){this.xSET("Align",arguments);}
ntb_numberp.getAlign=function(){return this.xGET("Align",arguments);}
ntb_numberp.setMask=function(){this.xSET("Mask",arguments);}
ntb_numberp.getMask=function(){return this.xGET("Mask",arguments);}
ntb_numberp.setNegativeMask=function(){this.xSET("NegativeMask",arguments);}
ntb_numberp.getNegativeMask=function(){return this.xGET("NegativeMask",arguments);}
ntb_numberp.setGroupingSeparator=function(){this.xSET("GroupingSeparator",arguments);}
ntb_numberp.getGroupingSeparator=function(){return this.xGET("GroupingSeparator",arguments);}
ntb_numberp.setDecimalSeparator=function(){this.xSET("DecimalSeparator",arguments);}
ntb_numberp.getDecimalSeparator=function(){return this.xGET("DecimalSeparator",arguments);}
ntb_numberp.setOnKeyDownEvent=function(){this.xSET("OnKeyDownEvent",arguments);}
ntb_numberp.getOnKeyDownEvent=function(){return this.xGET("OnKeyDownEvent",arguments);}
ntb_numberp.setOnKeyUpEvent=function(){this.xSET("OnKeyUpEvent",arguments);}
ntb_numberp.getOnKeyUpEvent=function(){return this.xGET("OnKeyUpEvent",arguments);}
ntb_numberp.setOnKeyPressEvent=function(){this.xSET("OnKeyPressEvent",arguments);}
ntb_numberp.getOnKeyPressEvent=function(){return this.xGET("OnKeyPressEvent",arguments);}
ntb_numberp.setOnChangeEvent=function(){this.xSET("OnChangeEvent",arguments);}
ntb_numberp.getOnChangeEvent=function(){return this.xGET("OnChangeEvent",arguments);}