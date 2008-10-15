/**
 * @constructor
 * @extends nitobi.grid.Column
 */
nitobi.grid.TextColumn = function(grid, column, surface)
{
	nitobi.grid.TextColumn.baseConstructor.call(this, grid, column, surface);
}

nitobi.lang.extend(nitobi.grid.TextColumn, nitobi.grid.Column);