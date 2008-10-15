nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a OnCellBlurEventArgs object.
 * @class When you subscribe to Grid events through the declaration, you
 * can optionally pass information about the event to the function
 * registered to handle it.  You do this by using the eventArgs keyword.
 * Cell blur is fired when a Cell loses focus by another Cell gaining focus.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="html">
 * &lt;ntb:grid id="grid1" mode="livescrolling" oncellblurevent="clickHandler(eventArgs)"&gt;&lt;/ntb:grid&gt;
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
nitobi.grid.OnCellBlurEventArgs = function(source, cell)
{
	nitobi.grid.OnCellBlurEventArgs.baseConstructor.call(this, source, cell);
}

nitobi.lang.extend(nitobi.grid.OnCellBlurEventArgs, nitobi.grid.CellEventArgs);