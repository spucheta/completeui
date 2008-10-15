/**
 * Creates a TextColumn.
 * @constructor
 * @class A column type used by Grid to handle text columns.
 * @param {nitobi.grid.Grid} grid The Grid that this column belongs to.
 * @param {Number} column The index of the column (zero based).
 * @extends nitobi.grid.Column
 */
nitobi.grid.TextColumn = function(grid, column)
{
	nitobi.grid.TextColumn.baseConstructor.call(this, grid, column);
}

nitobi.lang.extend(nitobi.grid.TextColumn, nitobi.grid.Column);