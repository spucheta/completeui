/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.collections");

/**
 * Creates a CellSet object to manage a contiguous set of "cell" data.
 * @class nitobi.collections.CellSet is a contiguous set of cells. The endpoints can be specified in any fashion, 
 * but the set will be addressed from top left to botom right.
 * @constructor
 * @param {nitobi.grid.Grid} owner  The nitobi.grid.Grid object on whose cells the set sits. 
 * (Note: owner must implement getCellObject(x,y))
 * @param {Number} startRow The row index of the start cell of the set.
 * @param {Number} startColumn The column index of the start column of the set.
 * @param {Number} endRow The row index of the end cell of the set.
 * @param {Number} endColumn The column index of the end cell of the set.
 */
nitobi.collections.CellSet = function(owner, startRow, startColumn, endRow, endColumn)
{
	this.owner = owner;
	if (startRow != null && startColumn != null && endRow != null && endColumn != null)
	{
		this.setRange(startRow, startColumn, endRow, endColumn);
	}
	else
	{
		this.setRange(0,0,0,0);
	}
};

/**
 * Converts the CellSet into a string of the form "[0,1][0,4]"
 * @type String
 */
nitobi.collections.CellSet.prototype.toString = function()
{
	var str = "";
	for (var i = this._topRow; i <= this._bottomRow; i++)
	{
		str += "["
		for (var j = this._leftColumn; j <= this._rightColumn; j++)
		{
			str += "("+i+","+j+")";
		}
		str += "]";
	}
	return str;
};

/**
 * Sets the endpoints of the set of cells on the grid to which the cellset refers.
 * @param {Number} startRow The row index of the start cell of the set.
 * @param {Number} startColumn The column index of the start column of the set.
 * @param {Number} endRow The row index of the end cell of the set.
 * @param {Number} endColumn The column index of the end cell of the set.
 */
nitobi.collections.CellSet.prototype.setRange = function(startRow, startColumn, endRow, endColumn)
{
	ntbAssert(startRow != null && startColumn != null && endRow != null && endColumn != null, "nitobi.collections.CellSet.setRange requires startRow, startColumn, endRow, endColumn as integers",null,EBA_THROW);
	this._startRow = startRow;
	this._startColumn = startColumn;
	this._endRow = endRow;
	this._endColumn = endColumn;
	
	this._leftColumn = Math.min(startColumn, endColumn);
	this._rightColumn = Math.max(startColumn, endColumn);
	this._topRow = Math.min(startRow, endRow);
	this._bottomRow = Math.max(startRow, endRow);
};

/**
 * Increases or decreases the size of the CellSet by changing the location of the starting cell.
 * @param {Number} startRow The row index of the start cell of the set.
 * @param {Number} startColumn The column index of the start cell of the set.
 */
nitobi.collections.CellSet.prototype.changeStartCell = function(startRow, startColumn)
{
	this._startRow = startRow;
	this._startColumn = startColumn;
	
	this._leftColumn = Math.min(startColumn, this._endColumn);
	this._rightColumn = Math.max(startColumn, this._endColumn);
	this._topRow = Math.min(startRow, this._endRow);
	this._bottomRow = Math.max(startRow, this._endRow);
};

/**
 * Increases or decreases the size of the CellSet by changing the location of the ending cell.
 * @param {Number} startRow The row index of the end cell of the set.
 * @param {Number} startColumn The column index of the end cell of the set.
 */
nitobi.collections.CellSet.prototype.changeEndCell = function(endRow, endColumn)
{
	this._endRow = endRow;
	this._endColumn = endColumn;
	
	this._leftColumn = Math.min(endColumn, this._startColumn);
	this._rightColumn = Math.max(endColumn, this._startColumn);
	this._topRow = Math.min(endRow, this._startRow);
	this._bottomRow = Math.max(endRow, this._startRow);
};


/**
 * Returns the number of rows in the CellSet
 * @type Number
 */
nitobi.collections.CellSet.prototype.getRowCount = function()
{
	return this._bottomRow - this._topRow + 1;
};

/**
 * Returns the number of columns in the CellSet
 * @type Number
 */
nitobi.collections.CellSet.prototype.getColumnCount = function()
{
	return this._rightColumn - this._leftColumn +1 ;
};

/**
 * An inline object where object.top is the nitobi.drawing.Point object for the top left cell and object.bottom 
 * is the nitobi.drawing.Point object for the bottom right cell
 * @type Object
 * @see nitobi.drawing.Point
 */
nitobi.collections.CellSet.prototype.getCoords = function()
{
	return {'top':new nitobi.drawing.Point(this._leftColumn,this._topRow), 'bottom':new nitobi.drawing.Point(this._rightColumn,this._bottomRow)};
};

/**
 * Returns the cell object at a position in the container offset from the top left cell in the CellSet
 * @param {Number} relRow  The row index (indexed from 0 at the top of the CellSet) of the desired cell.
 * @param {Number} relColumn The column index (indexed from 0 at the leftmost column in the CellSet) of the desired cell.
 * @type nitobi.grid.Cell
 */
nitobi.collections.CellSet.prototype.getCellObjectByOffset = function(relRow, relColumn)
{
	return this.owner.getCellObject(this._topRow+relRow, this._leftColumn + relColumn);
};

///**
// * Clears the contents of the cells in the CellSet
// */
//nitobi.collections.CellSet.prototype.clear = function()
//{
//	// Out of scope for 2006-06-09 sprint http://portal:8090/cgi-bin/trac.cgi/milestone/Grid%203.1%20-%20Copy%20%26%20Paste%20Sprint
//}
//
///**
// * Fills the cells in the cellset with a specified value
// * @param {String} fillString The string that each cell in the CellSet will contain when fill() completes
// */
//nitobi.collections.CellSet.prototype.fill = function(fillString)
//{
//	// Out of scope for 2006-06-09 sprint http://portal:8090/cgi-bin/trac.cgi/milestone/Grid%203.1%20-%20Copy%20%26%20Paste%20Sprint
//}