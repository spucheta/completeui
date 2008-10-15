nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a SelectionEventArgs object.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with selections (e.g onbeforecopyevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" onbeforecopyevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of SelectionEventArgs to be passed to our handler.
 * 	var grid = event.getSource();
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {String} data The data that was copied in HTML table format.
 * @param {Object} [coords] The top left and bottom right coords, which are nitobi.drawing.Point objects. {"top":POINT,"bottom":POINT}.
 */
nitobi.grid.SelectionEventArgs = function(source, data, coords)
{
	/**
	 * @private
	 */
	this.source = source;
	/**
	 * @private
	 */
	this.coords = coords
	/**
	 * @private
	 */
	this.data = data;
}

/**
 * Gets the Grid that fired the event.
 * @type nitobi.grid.Grid
 */
nitobi.grid.SelectionEventArgs.prototype.getSource = function()
{
	return this.source;
}

/**
 * Returns the coordinates associated with the Selection event.
 * @type Object
 */
nitobi.grid.SelectionEventArgs.prototype.getCoords = function()
{
	return this.coords;
}

/**
 * Returns the data associated with the Selection event.
 * @type String
 */
nitobi.grid.SelectionEventArgs.prototype.getData = function()
{
	return this.data;
}