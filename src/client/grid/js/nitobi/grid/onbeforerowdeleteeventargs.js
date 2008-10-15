nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments passed to handlers before a a Row is deleted.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Row} cell The Row object of the cell that was clicked.
 * @extends nitobi.grid.RowEventArgs
 * @private
 */
nitobi.grid.OnBeforeRowDeleteEventArgs = function(source, row)
{
	nitobi.grid.OnBeforeRowDeleteEventArgs.baseConstructor.call(this, source, row);
}

nitobi.lang.extend(nitobi.grid.OnBeforeRowDeleteEventArgs, nitobi.grid.RowEventArgs);