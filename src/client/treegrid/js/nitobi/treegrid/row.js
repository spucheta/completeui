nitobi.grid.Row = function(grid, row, key)
{
	this.key = key;
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
 * @type {XMLElement}
 */
nitobi.grid.Row.prototype.getData = function() {
	if (this.DataNode == null)
		this.DataNode = this.grid.datatable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e[@xi='+this.Row+']');
	return this.DataNode;
}
/**
 * Returns the native web browser Style object for the given cell.
 */
nitobi.grid.Row.prototype.getStyle = function()
{
	return this.DomNode.style;
}
/**
 * Gets a Cell in the Row either by index or name.
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
	//var id = this.DomNode.id;
	//var index = this.DomNode.getAttribute("xi");
	//var key = id.match(new RegExp("row_(.*_" + index + ")_"));
	//return key[1];
	return this.key;
	//return this.grid.getCellObject(this.row, index);
};

/**
 * 
 */
nitobi.grid.Row.prototype.isExpanded = function()
{
	if (this.rowElement.getAttribute("expanded") == "true")
	{
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Returns the row's index relative to the surface it is rendered in.  For example,
 * if the row is the 1st row in the 4th group of the root surface, 0 will be returned
 * @type Number
 */
nitobi.grid.Row.prototype.getIndex = function()
{
	return parseInt(this.rowElement.getAttribute("xi"));
};

/**
 * Returns the path of surfaces to follow to get to the surface that the row
 * belongs to.
 * @type String
 */
nitobi.grid.Row.prototype.getPathToRow = function()
{
	var index = this.rowElement.getAttribute("xi");
	return this.key.substr(0, this.key.length - (index.length + 1));
};
/**
 * Returns the row HTML element for the given Grid and row indices.
 * @param {nitobi.grid} grid The Grid to which the row belongs.
 * @param {Number} row The row index.
 * @return {nitobi.grid.Row}
 */
nitobi.grid.Row.getRowElement = function(grid, row)
{
	return nitobi.grid.Row.getRowElements(grid,row).mid;
};

nitobi.grid.Row.findRowElement = function(path, grid)
{
	return $ntb("row_" + path + "_" + grid.uid);
};

/**
 * @private
 */
nitobi.grid.Row.getRowElements = function(grid, row, surfacePath)
{
	surfacePath = surfacePath || "";
	var C = nitobi.grid.Cell;
	// TODO: refactor this offset stuff into a method in grid.
	
	var midCol = grid.getFrozenLeftColumnCount();
	var cell = C.getCellElement(grid, row, midCol, surfacePath);
	var midRow = (cell?cell.parentNode:null);
	if (!midCol)
		return {left: null, mid: midRow};
	
	var rows = {};
	rows.left = C.getCellElement(grid, row, 0).parentNode;
	rows.mid = midRow;
	return rows;
}

/**
 * Returns the row number of a row based on the HTML element of that row.
 * @param {HtmlElement} element 
 * @return {Number} The index of the row for the row.
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