/**
 * Creates a new Cell object
 * @class The Cell object represents a single row/column combination in the Grid. 
 * It can be used to get or set values of cells in the Grid, or to manipulate
 * the look of a particular cell.
 * <p>
 * A cell is represented in two ways:  as a rendered html element and as
 * an xml node.  The Cell object provides a means to affect either
 * representation
 * </p>
 * @constructor
 * @param {nitobi.grid.Grid} grid
 * @param {Object} row This argument can either be a row index or a HtmlElement. 
 * If the row index is used the third argument is also required.
 * @param {Number} column Index of the column of the Cell. This is optional, however, it is 
 * required if the row argument is specified as a row index and not a Cell HTML element.
 * @see nitobi.grid.Grid#getCellObject
 */
nitobi.grid.Cell = function(grid, row, column, surface)
{
	// Row should not be null
	if (row == null || grid == null)
		return null;

	/**
	 * @private
	 */
	this.grid=grid;

	/**
	 * @private
	 */
	var DomNode = null;
	
	/**
	 * @private
	 */
	this.surface = surface;
	if (typeof(row) == "object")
	{
		var cell = row;
		row = Number(cell.getAttribute('xi'));
		column = cell.getAttribute('col');
		DomNode = cell;
		var surfacePath = nitobi.grid.Cell.getSurfacePath(cell);
		this.surface = this.grid.Scroller.getSurface(surfacePath);
	}
	else
	{
		// TODO: We should be able to get this from the surface?
		DomNode = this.grid.getCellElement(row, column, surface.key);
	}

	/**
	 * @private
	 */
	 this.DomNode = DomNode;


	// For backwards compatibility have the lower case but they should be upper for getRow etc...
	/**
	 * @private
	 */
	this.row=Number(row);
	/**
	 * @private
	 */
	this.Row=this.row;

	/**
	 * @private
	 */
	this.column=Number(column);
	/**
	 * @private
	 */
	this.Column=this.column;

	/**
	 * @private
	 */
	this.dataIndex = this.Row;

	/**
	 * @private
	 */
	this.table;
	if (this.surface)
	{
		this.table = this.surface.dataTable;
	}
	else
	{
		this.table = this.grid.datatable;
	}
}

/**
 * Returns the XML node from the DataTable that contains the Cell data.
 * @type {XMLElement}
 */
nitobi.grid.Cell.prototype.getData = function() {
	// TODO: We should not need the column object to get the attribute mapping
	// TODO: We may have problems after sorting for example
	if (this.DataNode == null)
		this.DataNode = this.table.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@xi='+this.dataIndex+']/'+ this.table.fieldMap[this.getColumnObject().getColumnName()]);
	return this.DataNode;
}

/**
 * Returns the XML node that represents the Cell state.
 * @type {XMLElement}
 */
nitobi.grid.Cell.prototype.getModel = function() {
	if (this.ModelNode == null)
		this.ModelNode = this.grid.model.selectSingleNode("//ntb:columns/*[@xi='"+this.column+"']");
	return this.ModelNode;
}

/**
 * @private
 */
nitobi.grid.Cell.prototype.setRow = function() {
	this.jSET("Row",arguments);
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.getRow = function() {
	return this.Row;
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.setColumn = function() {
	this.jSET("Column",arguments);
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.getColumn = function() {
	return this.Column;
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.setDomNode = function() {	
	this.jSET("DomNode",arguments);	
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.getDomNode = function() {
	return this.DomNode;
};

/**
 * @private
 */
nitobi.grid.Cell.prototype.setDataNode = function() {
	this.jSET("DataNode",arguments);	
};

/**
 * This sets the value of a cell which results in the value being set in 
 * the datasource (its xml node) and the view of the data being updated
 * (the html rendered for the cell).  If the cell 
 * belongs to a number or date column, for example, the value will have 
 * the appropriate mask applied to it.
 * <p>
 * <b>Example</b><br>
 * <pre><code class="ntb javascript">
 * &#102;unction setCellValue(row, col, value)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var cell = grid.getCellObject(row, col);
 * 	// Note the second parameter is optional
 * 	cell.setValue(value);
 * }
 * </code></pre>
 * </p>
 * @param {String} value The value which will be put in the database.
 * @param {String} display The value which will be displayed in the Grid. 
 * This is optional.
 */
nitobi.grid.Cell.prototype.setValue = function(value, display) 
{
	if (value == this.getValue())
		return;

	//	First thing to do is validate the input for the given column type.

	var colObj = this.getColumnObject();

	//	Second thing to do is to actually format the data for presentation in the HTML

	var domValue = '';
	switch (colObj.getType())
	{
		case 'PASSWORD':
			for (var i=0; i<value.length; i++)
			{
				domValue += '*';
			}
			break;
		case 'NUMBER':
			if (this.numberXsl == null)
				this.numberXsl = nitobi.form.numberXslProc;

			if (value == "")
				value = colObj.getEditor().defaultValue || 0;

			if (this.DomNode != null)
			{
				if (value < 0)
					nitobi.html.Css.addClass(this.DomNode, "ntb-cell-negativenumber");
				else
					nitobi.html.Css.removeClass(this.DomNode, "ntb-cell-negativenumber");
			}

			var mask = colObj.getMask();
			var nmask = colObj.getNegativeMask();
			var maskedValue = value;
			if (value < 0 && nmask != "")
			{
				mask = nmask;
				// if there is a negative mask let it handle the negative sign.
				maskedValue = (value+"").replace("-","");
			}

			this.numberXsl.addParameter("number", maskedValue, "");
			this.numberXsl.addParameter("mask", mask, "");
			this.numberXsl.addParameter("group", colObj.getGroupingSeparator(), "");
			this.numberXsl.addParameter("decimal", colObj.getDecimalSeparator(), "");

			// Now reformat the number according to the mask and add the mask signs again.
			domValue = nitobi.xml.transformToString(nitobi.xml.Empty, this.numberXsl);

			// Check if the mask was applied

			if("" == domValue && value != "")
			{
				domValue = nitobi.html.getFirstChild(this.DomNode).innerHTML;
				value = this.getValue();
				// ebaErrorReport("[" + this.control.value + "] is not a valid date. Only a valid date such as '2006-12-05' can be entered in this cell.","",EBA_ERROR);
			}

			break;
		case 'DATE':
			if (this.dateXsl == null)
				this.dateXsl = nitobi.form.dateXslProc.stylesheet;

			var d = new Date();
			var xmlDoc = nitobi.xml.createXmlDoc('<root><date>'+value+'</date><year>'+(d.getFullYear())+'</year><mask>'+this.columnObject.getMask()+'</mask></root>');

			domValue = nitobi.xml.transformToString(xmlDoc, this.dateXsl);

			// Check if the mask was applied
			if("" == domValue)
			{
				domValue = nitobi.html.getFirstChild(this.DomNode).innerHTML;
				value = this.getValue();
				// ebaErrorReport("[" + this.control.value + "] is not a valid date. Only a valid date such as '2006-12-05' can be entered in this cell.","",EBA_ERROR);
			}
			else
            {
                value = domValue;
            }

			break;
		case 'TEXTAREA':
			domValue = nitobi.html.encode(value);
			break;
		case 'LOOKUP':
			var colObjModel = colObj.getModel();
			// TODO: these getAttribute calls need to be converted to proper API methods once we separate Editors and Columns
			var sDatasourceId = colObjModel.getAttribute('DatasourceId');
			var dataTable = this.grid.data.getTable(sDatasourceId);
			var displayFields = colObjModel.getAttribute('DisplayFields');
			var valueField = colObjModel.getAttribute('ValueField');
			var xmlNode = dataTable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@'+valueField+'=\''+value+'\']/@'+displayFields);
			if (xmlNode != null)
				domValue = xmlNode.nodeValue;
			else
				domValue = value;
			break;
		case 'CHECKBOX':
			var colObjModel = colObj.getModel();
			var sDatasourceId = colObjModel.getAttribute('DatasourceId');
			var dataTable = this.grid.data.getTable(sDatasourceId);
			var displayFields = colObjModel.getAttribute('DisplayFields');
			var valueField = colObjModel.getAttribute('ValueField');
			var checkedValue = colObjModel.getAttribute('CheckedValue');
			if (checkedValue == '' || checkedValue == null)
				checkedValue = 0;

			var displayValue = dataTable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@'+valueField+'=\''+value+'\']/@'+displayFields).nodeValue;

			var checkstate = (value == checkedValue)?"checked":"unchecked";
			domValue = '<div style="overflow:hidden;"><div class="ntb-checkbox ntb-checkbox-'+checkstate+'" checked="'+value+'">&nbsp;</div><div class="ntb-checkbox-text">'+nitobi.html.encode(displayValue)+'</div></div>';

			break;
		case 'LISTBOX':
			var colObjModel = colObj.getModel();
			var sDatasourceId = colObjModel.getAttribute('DatasourceId');
			var dataTable = this.grid.data.getTable(sDatasourceId);
			var displayFields = colObjModel.getAttribute('DisplayFields');
			var valueField = colObjModel.getAttribute('ValueField');
			domValue = dataTable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@'+valueField+'=\''+value+'\']/@'+displayFields).nodeValue;
			break;
		case 'IMAGE':
			domValue = nitobi.html.getFirstChild(this.DomNode).innerHTML;
			if (nitobi.lang.typeOf(value) == nitobi.lang.type.HTMLNODE)
				domValue = '<img border="0" src="'+value.getAttribute('src')+'" />';
			else if (typeof(value) == "string")
				domValue = '<img border="0" src="'+value+'" />';
//			else
//				throw "Invalid value for an Image cell. Expected either an <img> element or image src location.";
			break;
		default:
			domValue = value;
	}
	
	domValue = domValue || "&nbsp;";

	if (this.DomNode != null)
	{
		var elem = nitobi.html.getFirstChild(this.DomNode);
		elem.innerHTML = domValue || "&nbsp;"; 
		elem.setAttribute("title", value);
		this.DomNode.setAttribute("value", value);
	}
	this.surface.dataTable.updateRecord(this.dataIndex, colObj.getColumnName(), value);
}

/**
 * Gets the value of the cell from its xml node.  
 * @return {String}
 */
nitobi.grid.Cell.prototype.getValue = function()
{
	// TODO: Need to return the correct JS type
	var colObj = this.getColumnObject();
	var val = this.GETDATA();
	switch (colObj.getType())
	{
		case 'NUMBER':
			val = parseFloat(val);
			break;
//		case 'DATE':
//			break;
		default:
	}

	return val;
}

/**
 * Gets the value of the cell <i>displayed</i> in the Grid.
 * That is, this method obtains the cell value from the rendered
 * html representation of the cell.
 * @return {String}
 * @see #getValue
 */
nitobi.grid.Cell.prototype.getHtml = function()
{
	return nitobi.html.getFirstChild(this.DomNode).innerHTML;
}

/**
 * Puts the cell into edit mode.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction editCell(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var cell = grid.getCellObject(row, col);
 * 	cell.edit();
 * }
 * </code></pre>
 * </div>
 */
nitobi.grid.Cell.prototype.edit = function()
{
	this.grid.setActiveCell(this.DomNode);
	this.grid.edit();
}

/**
 * @private
 */
nitobi.grid.Cell.prototype.GETDATA = function()
{
	var node = this.getData();
	if (node!=null) {
		return node.value;
	}
}

/**
 * @private
 */
nitobi.grid.Cell.prototype.xGETMETA = function()
{
	if (this.MetaNode == null) return null;  
	var node = this.MetaNode;
	node = node.selectSingleNode("@"+arguments[0]);
	if (node!=null) {
		return node.value;
	}
}

/**
 * @private
 */
nitobi.grid.Cell.prototype.xSETMETA = function()
{
	var node = this.MetaNode;
	if (node!=null) {
		node.setAttribute(arguments[0],arguments[1][0]);

		// Log changes
		// TODO: This all needs to be changed since we either dont use logMeta or dont even save this type of information.
	} else {
		alert("Cannot set property: "+arguments[0])
	}
}

/**
 * xSETCSS sets a value in the Grid CSS.
 * @private
 */
nitobi.grid.Cell.prototype.xSETCSS = function()
{
	var node = this.DomNode;
	if (node!=null) {
		node.style.setAttribute(arguments[0],arguments[1][0]);
	} else {
		alert("Cannot set property: "+arguments[0])
	}
}

/**
 * xGET gets a value from the Grid model XML document.
 * @private
 */
nitobi.grid.Cell.prototype.xGET = function()
{
	var node = this.getModel();
	node = node.selectSingleNode(arguments[0]);
	if (node!=null) {
		return node.value;
	}
}

/**
 * xSET sets a value in the Grid model XML document.
 * @private
 */
nitobi.grid.Cell.prototype.xSET = function()
{
	var node = this.getModel();
	node = node.selectSingleNode(arguments[0]);
	if (node!=null) {
		node.nodeValue=arguments[1][0];
	}
}

/**
 * Returns the native web browser Style object for the given cell.
 */
nitobi.grid.Cell.prototype.getStyle = function()
{
	return this.DomNode.style;
}

/**
 * Returns the Column object to which the given cell belongs.
 * @return {nitobi.grid.Column}
 */
nitobi.grid.Cell.prototype.getColumnObject = function()
{
	if (typeof(this.columnObject) == "undefined")
	{
		this.columnObject = this.grid.getColumnObject(this.getColumn(), this.surface.key);
	}
	return this.columnObject;
}

/**
 * Returns the cell HTML element for the given Grid, row and column indices.
 * @param {nitobi.grid} grid The Grid to which the cell belongs.
 * @param {Number} row The row index of the Cell.
 * @param {Number} column The column index of the Cell.
 * @return {nitobi.grid.Cell}
 */
nitobi.grid.Cell.getCellElement = function(grid, row, column, surfacePath)
{
	return $ntb("cell_"+row+"_"+column+"_"+grid.uid + "_" + (surfacePath?surfacePath:""));
}

/**
 * Returns the row number of a cell based on the DOM representation of 
 * that cell.
 * @param {HtmlElement} element The cell's html element.
 * @return {Number} The index of the row for the Cell.
 */
nitobi.grid.Cell.getRowNumber = function(element)
{
	return parseInt(element.getAttribute("xi"));
}


/**
 * Returns the column number of a cell based on the DOM representation of 
 * that cell.
 * @param {HtmlElement} element
 * @return {Number} The index of the column for the Cell (zero indexed).
 */
nitobi.grid.Cell.getColumnNumber = function(element)
{
	return parseInt(element.getAttribute("col"));
}

nitobi.grid.Cell.getSurfacePath = function(element)
{
	return element.getAttribute("path");
}