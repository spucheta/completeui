nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments for when the a Column is resized.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {nitobi.grid.Column} column The Column object of the Column that was resized.
 * @extends nitobi.grid.ColumnEventArgs
 * @private
 */
nitobi.grid.OnBeforeColumnResizeEventArgs = function(source, column)
{
	nitobi.grid.OnBeforeColumnResizeEventArgs.baseConstructor.call(this, source, column);
}

nitobi.lang.extend(nitobi.grid.OnBeforeColumnResizeEventArgs, nitobi.grid.ColumnEventArgs);