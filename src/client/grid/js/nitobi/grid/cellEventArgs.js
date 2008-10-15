nitobi.lang.defineNs('nitobi.grid');

/**
 * Creates a new CellEventArgs object.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with cells (e.g oncellclickevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" oncellclickevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of CellEventArgs to be passed to our handler.
 * 	var cell = event.getCell();
 * 	cell.getStyle().backgroundColor = "red";
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Cell} cell The Cell object of the cell that received focus.
 */
nitobi.grid.CellEventArgs = function(source, cell)
{
	nitobi.grid.CellEventArgs.baseConstructor.call(this, source);
	/**
	 * @private
	 */
	this.cell = cell;
}

nitobi.lang.extend(nitobi.grid.CellEventArgs, nitobi.base.EventArgs);

/**
 * Gets the Cell on which the event was fired.
 * @type nitobi.grid.Cell
 */
nitobi.grid.CellEventArgs.prototype.getCell = function()
{
	return this.cell;
}
