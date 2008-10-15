nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a RowEventArgs object.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with rows (e.g onrowfocusevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" onrowfocusevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of CellEventArgs to be passed to our handler.
 * 	var row = event.getRow();
 * 	var cell = row.getCell(0);
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Row} row The Row object of the cell that received focus.
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
 * @type nitobi.grid.Grid
 */
nitobi.grid.RowEventArgs.prototype.getSource = function()
{
	return this.grid;
}
/**
 * Gets the Row on which the event was fired.
 * @type nitobi.grid.Cell
 */
nitobi.grid.RowEventArgs.prototype.getRow = function()
{
	return this.row;
}
/**
 * Gets the native browser Event object that is associated with the event. This may be null in some case.
 * @private
 */
nitobi.grid.RowEventArgs.prototype.getEvent = function()
{
	return this.event;
}