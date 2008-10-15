nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a OnAfterSortEventArgs object.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with sorting (e.g onaftersortevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" onaftersortevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of OnAfterSortEvent to be passed to our handler.
 * 	var direction = event.getDirection();
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Column} cell The Column object of the Column that was sorted.
 * @param {String} direction The direction of the sort. This is either "Asc" or "Desc".
 * @extends nitobi.grid.ColumnEventArgs
 */
nitobi.grid.OnAfterSortEventArgs = function(source, column, direction)
{
	nitobi.grid.OnAfterSortEventArgs.baseConstructor.call(this, source, column);
	/**
	 * @private
	 */
	this.direction = direction;
}

nitobi.lang.extend(nitobi.grid.OnAfterSortEventArgs, nitobi.grid.ColumnEventArgs);

/**
 * Returns the direction of the sort.  Either "Asc" or "Desc".
 * @type String
 */
nitobi.grid.OnAfterSortEventArgs.prototype.getDirection = function()
{
	return this.direction;
}