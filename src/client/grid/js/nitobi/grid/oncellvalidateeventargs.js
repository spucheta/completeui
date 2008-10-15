nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a OnCellValidateEventArgs object.
 * @class This object may also be returned from the OnCellValidateEvent 
 * handler with new values for the newValue, displayValue and status 
 * properties. To invalidate the value you can return false from the function
 * set to handle the event.
 * <pre class="code">
 * &#102;unction validate(event)
 * {
 * 	if (event.getNewValue() &lt; event.getOldValue())
 * 	{
 * 		// By returning false, we revert the value of the cell back to the old value
 * 		return false;
 * 	}
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Cell} cell The Cell object of the cell that received focus. 
 * @param {String} newValue The value that the user has entered into the cell.
 * @param {String} oldValue The previous value that the was entered into the cell.
 * @extends nitobi.grid.CellEventArgs
 */
nitobi.grid.OnCellValidateEventArgs = function(source, cell, newValue, oldValue)
{
	nitobi.grid.OnCellValidateEventArgs.baseConstructor.call(this, source, cell);
	/**
	 * The previous value that the was entered into the cell.
	 * @private
	 */
	this.oldValue = oldValue;
	/**
	 * The value that the user has entered into the cell.
	 * @private
	 */
	this.newValue = newValue;
}

nitobi.lang.extend(nitobi.grid.OnCellValidateEventArgs, nitobi.grid.CellEventArgs);


/**
 * Returns the previous value that the was entered into the cell.
 * Is only available for oncellvalidateevent.
 * @example
 * &#102;unction validate(event)
 * {
 * 	if (event.getNewValue() &lt; event.getOldValue())
 * 	{
 * 		// By returning false, we revert the value of the cell back to the old value
 * 		return false;
 * 	}
 * }
 * @type String
 */
nitobi.grid.OnCellValidateEventArgs.prototype.getOldValue = function()
{
	return this.oldValue;
}

/**
 * Returns the value that the user has entered into the cell.
 * Is only available for oncellvalidateevent.
 * @example
 * &#102;unction validate(event)
 * {
 * 	if (event.getNewValue() &lt; event.getOldValue())
 * 	{
 * 		// By returning false, we revert the value of the cell back to the old value
 * 		return false;
 * 	}
 * }
 * @type String
 */
nitobi.grid.OnCellValidateEventArgs.prototype.getNewValue = function()
{
	return this.newValue;
}