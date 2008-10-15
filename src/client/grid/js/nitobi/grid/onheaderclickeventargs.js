nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments for when the user clicks on a column header.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Column} column The Column object of the Column to which the header belongs.
 * @extends nitobi.grid.ColumnEventArgs
 * @private
 */
nitobi.grid.OnHeaderClickEventArgs = function(source, column)
{
	nitobi.grid.OnHeaderClickEventArgs.baseConstructor.call(this, source, column);
}

nitobi.lang.extend(nitobi.grid.OnHeaderClickEventArgs, nitobi.grid.ColumnEventArgs);