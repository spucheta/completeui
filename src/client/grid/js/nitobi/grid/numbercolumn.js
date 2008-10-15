/**
 * @constructor
 * @extends nitobi.grid.Column
 */
nitobi.grid.NumberColumn = function(grid, column)
{
	nitobi.grid.NumberColumn.baseConstructor.call(this, grid, column);
}

nitobi.lang.extend(nitobi.grid.NumberColumn, nitobi.grid.Column);

var ntb_numberp = nitobi.grid.NumberColumn.prototype;
/**
 * Sets the alignment of the values in the cells of the number column.
 * @param {String} align The alignment to set.
 */
nitobi.grid.NumberColumn.prototype.setAlign=function(){this.xSET("Align",arguments);}
/**
 * Returns the alignment of the values in the cells of the number column.
 * @type String
 */
nitobi.grid.NumberColumn.prototype.getAlign=function(){return this.xGET("Align",arguments);}
/**
 * Sets the mask for the number column.
 * @param {String} mask The mask to apply.
 */
nitobi.grid.NumberColumn.prototype.setMask=function(){this.xSET("Mask",arguments);}
/**
 * Returns the mask used for the number column.
 * @type String
 */
nitobi.grid.NumberColumn.prototype.getMask=function(){return this.xGET("Mask",arguments);}
/**
 * Sets the mask used when the value of a cell in the number column is negative.
 * @param {String} mask The mask to apply.
 */
nitobi.grid.NumberColumn.prototype.setNegativeMask=function(){this.xSET("NegativeMask",arguments);}
/**
 * Returns the mask used when the value of a cell in the number column is negative.
 * @type String
 */
nitobi.grid.NumberColumn.prototype.getNegativeMask=function(){return this.xGET("NegativeMask",arguments);}
/**
 * Sets the character used to group numbers together for cells in the number column.
 * @param {String} sep The separator to use
 */
nitobi.grid.NumberColumn.prototype.setGroupingSeparator=function(){this.xSET("GroupingSeparator",arguments);}
/**
 * Returns the character used to group numbers together for cells in the number column.
 * @type String
 */
nitobi.grid.NumberColumn.prototype.getGroupingSeparator=function(){return this.xGET("GroupingSeparator",arguments);}
/**
 * Sets the character to use when separting decimal values from whole values.
 * @param {String} dec The separator to use.
 */
nitobi.grid.NumberColumn.prototype.setDecimalSeparator=function(){this.xSET("DecimalSeparator",arguments);}
/**
 * Returns the character to use when separting decimal values from whole values.
 * @type String
 */
nitobi.grid.NumberColumn.prototype.getDecimalSeparator=function(){return this.xGET("DecimalSeparator",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.setOnKeyDownEvent=function(){this.xSET("OnKeyDownEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.getOnKeyDownEvent=function(){return this.xGET("OnKeyDownEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.setOnKeyUpEvent=function(){this.xSET("OnKeyUpEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.getOnKeyUpEvent=function(){return this.xGET("OnKeyUpEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.setOnKeyPressEvent=function(){this.xSET("OnKeyPressEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.getOnKeyPressEvent=function(){return this.xGET("OnKeyPressEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.setOnChangeEvent=function(){this.xSET("OnChangeEvent",arguments);}
/**
 * @private
 */
nitobi.grid.NumberColumn.prototype.getOnChangeEvent=function(){return this.xGET("OnChangeEvent",arguments);}