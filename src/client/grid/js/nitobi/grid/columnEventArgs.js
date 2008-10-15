nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a ColumnEventArgs object.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with columns (e.g onheaderclickevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" onheaderclickevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of CellEventArgs to be passed to our handler.
 * 	var column = event.getColumn();
 * 	column.getDomNode().style.backgroundColor = "red";
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Cell} cell The Cell object of the cell that received focus.
 */
nitobi.grid.ColumnEventArgs = function(source, column)
{
	/**
	 * @private
	 */
	this.grid = source;
	/**
	 * @private
	 */
	this.column = column;
	/**
	 * @private
	 */
	this.event = nitobi.html.Event;
}

/**
 * Gets the Grid that fired the event.
 * @type nitobi.grid.Grid
 */
nitobi.grid.ColumnEventArgs.prototype.getSource = function()
{
	return this.grid;
}
/**
 * Gets the Cell on which the event was fired.
 * @type nitobi.grid.Cell
 */
nitobi.grid.ColumnEventArgs.prototype.getColumn = function()
{
	return this.column;
}
/**
 * Gets the native browser Event object that is associated with the event. 
 * This may be null in some cases.
 * @type nitobi.html.Event
 */
nitobi.grid.ColumnEventArgs.prototype.getEvent = function()
{
	return this.event;
}
/**
 * Returns the direction that the column has been sorted in ("Asc" or "Desc").  
 * Is only available for onbeforesortevent and onaftersortevent.
 * @type String
 */
nitobi.grid.ColumnEventArgs.prototype.getDirection = function()
{
}