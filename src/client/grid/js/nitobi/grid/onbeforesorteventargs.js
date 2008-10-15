nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments for when the a Column is sorted.
 * @class Encapsulates event arguments that are passed to event handlers subscribed to
 * Grid events that deal with sorting (e.g onbeforesortevent).
 * <br/>
 * <pre class="code">
 * &lt;ntb:grid id="grid1" mode="livescrolling" onbeforesortevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre>
 * <p>
 * The handler function might look like this:
 * </p>
 * <pre class="code">
 * &#102;unction clickHandler(event)
 * {
 * 	// Note in the sample declaration above, we use the keyword 'eventArgs' to tell the Grid we'd like
 * 	// an instance of OnBeforeSortEvent to be passed to our handler.
 * 	var direction = event.getDirection();
 * }
 * </pre>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Column} cell The Column object of the Column that was sorted.
 * @param {String} direction The direction of the sort. This is either "Asc" or "Desc".
 * @extends nitobi.grid.ColumnEventArgs
 */
nitobi.grid.OnBeforeSortEventArgs = function(source, column, direction)
{
	nitobi.grid.OnBeforeSortEventArgs.baseConstructor.call(this, source, column);
	this.direction = direction;
}

nitobi.lang.extend(nitobi.grid.OnBeforeSortEventArgs, nitobi.grid.ColumnEventArgs);

/**
 * Returns the direction of the sort.
 * @return String
 */
nitobi.grid.OnBeforeSortEventArgs.prototype.getDirection = function()
{
	return this.direction;
}