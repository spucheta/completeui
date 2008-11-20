/**
 * Creates a row object that encapsulates a row of data in the Nitobi Grid component.
 * @class The Row class represents a row of data in a Grid.  You can use a Row object
 * to manipulate the cells of that row or even the entire row itself.
 * @constructor
 * @param {nitobi.grid.Grid} grid The grid that the row belongs to.
 * @param {Number} row The row index (starting from 0).
 */
nitobi.grid.Row = function(grid,row)
{
	/**
	 * @private
	 */
	this.grid=grid;
	/**
	 * @private
	 */
	this.row=row;
	/**
	 * @private
	 */
	this.Row = row;

	/**
	 * @private
	 */
	this.DomNode = nitobi.grid.Row.getRowElement(grid, row);
}
/**
 * Returns the XML node from the DataTable that contains the Cell data.
 * @type XMLNode
 */
nitobi.grid.Row.prototype.getData = function() {
	if (this.DataNode == null)
		this.DataNode = this.grid.datatable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e[@xi='+this.Row+']');
	return this.DataNode;
}
/**
 * Returns the native web browser Style object for the given cell.
 * @type Object
 */
nitobi.grid.Row.prototype.getStyle = function()
{
	return this.DomNode.style;
}
/**
 * Gets a Cell in the Row either by index or name.
 * @type nitobi.grid.Cell
 */
nitobi.grid.Row.prototype.getCell = function(index)
{
	return this.grid.getCellObject(this.row, index);
}
/**
 * Gets key value for the Row.
 * @private
 */
nitobi.grid.Row.prototype.getKey = function(index)
{
	return this.grid.getCellObject(this.row, index);
}
/**
 * Returns the row HTML element for the given Grid and row indices.
 * @param {nitobi.grid} grid The Grid to which the row belongs.
 * @param {Number} row The row index.
 * @type HTMLElement
 */
nitobi.grid.Row.getRowElement = function(grid, row)
{
	return nitobi.grid.Row.getRowElements(grid,row).mid;
};
/**
 * @private
 */
nitobi.grid.Row.getRowElements = function(grid, row)
{
	// TODO: refactor this offset stuff into a method in grid.
	
	var midCol = grid.getFrozenLeftColumnCount();
	if (!midCol)
		return {left: null, mid: $ntb("row_"+row+"_"+grid.uid)};

	var C = nitobi.grid.Cell;
	var rows = {};
	try
	{
		rows.left = C.getCellElement(grid, row, 0).parentNode;
		var cell = C.getCellElement(grid, row, midCol)
		rows.mid = cell ? cell.parentNode : null;
		return rows;
	}
	catch(e)
	{
		//TODO: Log error? An exception can occur here when using frozen left columns in firefox.
	}
}

/**
 * Returns the row number of a row based on the HTML element of that row.
 * @param {HtmlElement} element The html element corresponding to a Grid row.
 * @type Number
 */
nitobi.grid.Row.getRowNumber = function(element)
{
	return parseInt(element.getAttribute("xi"));
}
/**
 * @private
 */
nitobi.grid.Row.prototype.xGETMETA = function()
{
	var node = this.MetaNode;
	node = node.selectSingleNode("@"+arguments[0]);
	if (node!=null) {
		return node.value;
	}
}
/**
 * @private
 */
nitobi.grid.Row.prototype.xSETMETA = function()
{
	var node = this.MetaNode;
	if (null==node)
	{
		var meta = this.grid.data.selectSingleNode("//root/gridmeta");
		var newNode = this.MetaNode=this.grid.data.createNode(1,"r","");
		newNode.setAttribute("xi",this.row);
		meta.appendChild(newNode);
		node=this.MetaNode=newNode;
	}
	if (node!=null) {
		node.setAttribute(arguments[0],arguments[1][0]);
		// Log changes
		// TODO: This all needs to be changed since we either dont use logMeta or dont even save this type of information.
	} else {
		alert("Cannot set property: "+arguments[0])
	}
}