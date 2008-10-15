nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments passed to handlers for the Cell blur event. Cell blur is fired when a Cell
 * is loses focus by another Cell gaining the focus.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Row} row The Row object of the cell that received focus.
 * @extends nitobi.grid.CellEventArgs
 * @private
 */
nitobi.grid.OnRowBlurEventArgs = function(source, row)
{
	nitobi.grid.OnRowBlurEventArgs.baseConstructor.call(this, source, row);
}

nitobi.lang.extend(nitobi.grid.OnRowBlurEventArgs, nitobi.grid.RowEventArgs);