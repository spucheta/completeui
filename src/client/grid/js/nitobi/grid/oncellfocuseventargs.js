nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a OnCellFocusEventArgs object.
 * @class Cell focus is fired when a Cell is either clicked on using the mouse or 
 * navigated to with the keyboard.
 * <p>When you subscribe to Grid events through the declaration, you
 * can optionally pass information about the event to the function
 * registered to handle it.  You do this by using the eventArgs keyword.
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="html">
 * &lt;ntb:grid id="grid1" mode="livescrolling" oncellfocusevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
 * </pre></code>
 * </div>
 * <p>
 * The handler function might look like this:
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction clickHandler(event)
 * {
 * 	var cell = event.getCell();
 * 	cell.getDomNode().style.backgroundColor = "red";
 * }
 * </code></pre>
 * </div>
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Cell} cell The Cell object of the cell that received focus.
 * @extends nitobi.grid.CellEventArgs
 * @private
 */
nitobi.grid.OnCellFocusEventArgs = function(source, cell)
{
	nitobi.grid.OnCellFocusEventArgs.baseConstructor.call(this, source, cell);
}

nitobi.lang.extend(nitobi.grid.OnCellFocusEventArgs, nitobi.grid.CellEventArgs);