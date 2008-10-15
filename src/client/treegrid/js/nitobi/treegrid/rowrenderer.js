/**
 * @private
 */
nitobi.grid.RowRenderer = function(xmlDataSource, columnDefinitions, firstColumn, uniqueId, surfaceKey, showHeaders, rowHeight, rowHover)
{
	this.rowHeight = rowHeight;
	this.xmlDataSource = xmlDataSource;
	this.dataTableId = '';
	this.definitions = columnDefinitions;
	this.columnSet = "";
	
	this.surfaceKey = surfaceKey;
	//this.xslTemplate = xslTemplate;

	this.firstColumn = firstColumn;

	this.uniqueId = uniqueId;
	
	this.showHeaders = showHeaders;
	this.rowHover = rowHover;

	this.mergeDoc = nitobi.xml.createXmlDoc("<ntb:root xmlns:ntb=\"http://www.nitobi.com\"><ntb:columns><ntb:stub/></ntb:columns><ntb:data><ntb:stub/></ntb:data></ntb:root>");
	this.mergeDocCols = this.mergeDoc.selectSingleNode("//ntb:columns");
	this.mergeDocData = this.mergeDoc.selectSingleNode("//ntb:data");
}

/**
 * @private
 */
nitobi.grid.RowRenderer.prototype.render = function(firstRow,rows, activeColumn, activeRow, sortColumn, sortDir)
{
//	if (this.xslTemplate == null)
//		return "";
	var firstRow = Number(firstRow) || 0;
	var rows = Number(rows) || 0;

	var xt = nitobi.grid.rowXslProc;
	xt.addParameter("start", firstRow, "");
	xt.addParameter("end", firstRow + rows, "");
	xt.addParameter('sortColumn', sortColumn, '');
	xt.addParameter('sortDirection', sortDir, '');
	xt.addParameter('dataTableId', this.dataTableId, '');
	xt.addParameter('columnSet', this.columnSet, '');

	// Do +0 to cast the bool to an int for Safari
	xt.addParameter("showHeaders", this.showHeaders+0, "");
	xt.addParameter("firstColumn", this.firstColumn, "");
	this.lastColumn = this.definitions.childNodes.length;
	xt.addParameter("lastColumn", this.lastColumn, "");
	xt.addParameter("uniqueId", this.uniqueId, "");
	xt.addParameter("rowHover", this.rowHover, "");
	// No support for frozen columns in grouping grid
	//xt.addParameter("frozenColumnId", this.frozenColumnId, "");
	xt.addParameter("surfaceKey", this.surfaceKey, "");

	var data = this.xmlDataSource.xmlDoc();
	// TODO: This may not be applicable in all cases ... just the first render. THIS MAY BREAK STUFF!
	if (data.documentElement.firstChild == null)
		return "";

	var root = this.mergeDoc;
	this.mergeDocCols.replaceChild((!nitobi.browser.IE?root.importNode(this.definitions, true):this.definitions.cloneNode(true)), this.mergeDocCols.firstChild);
	this.mergeDocData.replaceChild((!nitobi.browser.IE?root.importNode(data.documentElement, true):data.documentElement.cloneNode(true)), this.mergeDocData.firstChild);

	s2 = nitobi.xml.transformToString(root, xt, "xml");
	s2 = s2.replace(/ATOKENTOREPLACE/g,"&nbsp;");
	s2 = s2.replace(/\#\&lt\;\#/g,"<").replace(/\#\&gt\;\#/g,">").replace(/\#\&eq\;\#/g,"=").replace(/\#\&quot\;\#/g,"\"").replace(/\#\&amp\;\#/g,"&");

	return s2;
}

nitobi.grid.RowRenderer.prototype.setColumnDefinitions = function(definitions)
{
	this.definitions = definitions;
	if (this.definitions)
		this.lastColumn = this.definitions.selectNodes("//ntb:column").length;
}

/**
 * @private
 */
nitobi.grid.RowRenderer.prototype.generateXslTemplate = function(definitions,generator,firstColumn,columns,showHeaders,showRowIndicators,rowHover, id)
{
	//this.definitions = definitions;
	this.showIndicators = showRowIndicators;
	this.showHeaders = showHeaders;
	this.firstColumn = firstColumn;
	this.lastColumn = firstColumn+columns;
	this.rowHover = rowHover;
	this.frozenColumnId = (id?id:"");

	return;

	// TODO: Need to put this into the new code ... 
	try {
		var path = (typeof(gApplicationPath) == "undefined"?window.location.href.substr(0,window.location.href.lastIndexOf('/')+1):gApplicationPath);
		var imp = this.xmlTemplate.selectNodes("//xsl:import");
		for (var i=0;i<imp.length;i++)
		{
			imp[i].setAttribute("href", path + "xsl/" + imp[i].getAttribute("href"));
		}
	} catch(e) {}
}

/**
 * @private
 */
nitobi.grid.RowRenderer.prototype.dispose = function()
{
	this.xslTemplate = null;
//	this.xmlDataSource.dispose();
	this.xmlDataSource = null;
}