nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments passed to handlers after a Row is deleted.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Row} cell The Row object of the cell that was clicked.
 * @extends nitobi.grid.RowEventArgs
 * @private
 */
nitobi.grid.OnAfterRowDeleteEventArgs = function(source, row)
{
	nitobi.grid.OnAfterRowDeleteEventArgs.baseConstructor.call(this, source, row);
}

nitobi.lang.extend(nitobi.grid.OnAfterRowDeleteEventArgs, nitobi.grid.RowEventArgs);