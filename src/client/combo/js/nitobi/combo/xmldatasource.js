/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");

/**
 * The XML data source manages the local XML cache.  It doesn't have anything to do
 * with any other datasource.  It is used directly by the list to manage the
 * client side data. The XML stored in this object is compressed EBA XML in the form:
 * <pre class="code">
 * 	&lt;e xk="1" a="The Clash" b="London Calling"/&gt;
 * 	&lt;e xk="2" a="Elvis Costello" b="Armed Forces"/&gt;
 * 	&lt;e xk="3" a="XTC" b="Black Sea"/&gt;
 * &lt;/root&gt;
 * </pre>
 * @class The client side data source for the List
 * @constructor
 * @param {HTMLElement} userTag The HTML object that represents ListColumnDefinition
 * @param {Boolean} clip Whether or not to clip list
 * @param {Number} clipLength The clip length to use to clip the list
 * @param {nitobi.combo.Combo} comboObject The owner combo object
 */
nitobi.combo.XmlDataSource = function()
{
	/**
	 * @private
	 */
	this.combo = null;
	/**
	 * @private
	 */
	this.m_Dirty = true;

	this.SetLastPageSize(0);
	this.SetNumberColumns(0);
}

/**
 * Returns the ID of the XML data-island on the page.
 * Typically, the XML data is stored on the HTML page itself in what is referred to 
 * as an XML data island, that is, XML enclosed by XML tags.  This is the ID of that dataisland.
 * @type String
 */
nitobi.combo.XmlDataSource.prototype.GetXmlId = function()
{
	return this.m_XmlId;
}

/**
 * Sets the ID of the XML data-island on the page.
 * Typically, the XML data is stored on the HTML page itself in what is referred to 
 * as an XML data island, that is, XML enclosed by XML tags.  This is the ID of that dataisland.
 * @param {String} XmlId The id of the xml data island
 * @private
 */
nitobi.combo.XmlDataSource.prototype.SetXmlId = function(XmlId)
{
	this.m_XmlId = XmlId;
}

/**
 * Returns the XML DOM object.
 * The type of this object changes depending on the type of the browser.
 * In Internet Explorer it is the latest version (up to version 4) of the Microsoft XML DOM, e.g.,
 * Msxml4.DOMDocument. For Mozilla based browsers, this is the standard XML doc document. Note: Some
 * text in the document is escaped.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * var xmlDataSource = list.GetXmlDataSource();
 * var xmlDoc = xmlDataSource.GetXmlObject();
 * // Gives us the xml node with xk equal to 47858
 * var node = xmlDoc.selectSingleNode('//e[&amp;xk=47858]');
 * node.setAttribute('a', 'London Calling');
 * @type XMLDocument
 * @see nitobi.combo.XmlDataSource#.GetRow
 */
nitobi.combo.XmlDataSource.prototype.GetXmlObject = function()
{
	return this.m_XmlObject;
}

// TODO: This function is private until AddPage is public.
/**
 * Sets the XML DOM object.
 * The type of this object changes depending on the type of the browser.
 * In Internet Explorer it is the latest version (up to version 4) of the Microsoft XML DOM, e.g.,
 * Msxml4.DOMDocument. For Mozilla based browsers, this is the standard XML doc document. Note: Some
 * text in the document is escaped.
 * @param {XMLDocument} XmlObject The XML document
 * @param {Number} clip Whether or not to clip list
 * @param {Boolean} clipLength The clip length to use to clip the list
 * @private
 */
nitobi.combo.XmlDataSource.prototype.SetXmlObject = function(XmlObject, clip, clipLength)
{
	if(null==XmlObject.documentElement) return;
	if(clip==true)
		XmlObject = xbClipXml(XmlObject, "root", "e", clipLength);
	this.m_XmlObject = XmlObject;
	// Since the whole object was blown away, treat this like a getpage.
	// Set the page size to number of rows we receive initially.
	// Here we assume that the initial data we receive is like a page
	// get.  We don't actually do a page get because we don't want
	// to copy our initial xml datasource.
	this.SetLastPageSize(this.GetNumberRows());

	var fields = XmlObject.documentElement.getAttribute("fields");
	if (null==fields){
		// TODO: How are we going to deal with exceptions in dontnet.
//			alert( "You must have at least one field in your dataset.  The root's 'fields' attribute was not set.");
	}else{
		var colNames = fields.split("|");
		this.SetColumnNames(colNames);
		this.SetNumberColumns(colNames.length);
	}
}

/**
 * Returns the number of rows currently in the dataset.
 * @type Number
 * @see #GetRow
 * @see #GetNumberColumns
 */
nitobi.combo.XmlDataSource.prototype.GetNumberRows = function()
{
	return this.GetXmlObject().selectNodes("//e").length;
}

/** 
 * Returns the size of the last page retrieved.
 * @type Number
 * @private
 */
nitobi.combo.XmlDataSource.prototype.GetLastPageSize = function()
{
	return this.m_LastPageSize;
}

/** 
 * Sets the size of the last page retrieved.
 * @param {Number} LastPageSize The size of the last page retrieved
 * @private
 */
nitobi.combo.XmlDataSource.prototype.SetLastPageSize = function(LastPageSize)
{
	this.m_LastPageSize = LastPageSize;
}

/**
 * Returns the number of columns in the dataset.
 * @type Number
 * @see #GetNumberRows
 */
nitobi.combo.XmlDataSource.prototype.GetNumberColumns = function()
{
	return this.m_NumberColumns;
}

/**
 * Sets the number of columns in the dataset.
 * @param {Number} NumberColumns The number of columns of the dataset
 * @private
 */
nitobi.combo.XmlDataSource.prototype.SetNumberColumns = function(NumberColumns)
{
	this.m_NumberColumns = parseInt(NumberColumns);
}

/**
 * Contains the list of column names.
 * @type Array
 * @private
 */
nitobi.combo.XmlDataSource.prototype.GetColumnNames = function()
{
	return this.m_ColumnNames;
}

/**
 * Contains the list of column names.
 * @param {Array} ColumnNames The value of the property you want to set.
 * @private
 */
nitobi.combo.XmlDataSource.prototype.SetColumnNames = function(ColumnNames)
{
	this.m_ColumnNames = ColumnNames;
}

/**
 * Searches the list and returns the ordinal value of the first matched row. Searches the local cache only.
 * @param {String} Value The value to match.
 * @param {Int} ColumnIndex The column to search on.
 * @param {Boolean} Smart Whether or not this is a "smart" mode search.
 */
nitobi.combo.XmlDataSource.prototype.Search = function(Value, ColumnIndex, Smart){

	Value = Value.toLowerCase();
	Value=nitobi.xml.constructValidXpathQuery(Value,true);

	// ** A few notes on this Search mechanism. **//
	// ** There is only one central xml datasource object. IE searches this datasource object using XSL. 
	// ** The XSL calls the js toLowerCase() function in order to do case-insensitive search.
	// ** Netscape has no such facility. For netscape, we must mirror the xml object and make a lower case version of it.
	// ** This is not done for IE because it is more error prone. I'm trying to minimize the risk here. Sometimes, people
	// ** modify the xml directly.
	var xsl="<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\" version=\"1.0\">";
	xsl+="<xsl:output method=\"text\" />";
	xsl+="<xsl:template match=\"/\"><xsl:apply-templates select=\"//e[" + (Smart==true ? "contains" : "starts-with") + "(@"+String.fromCharCode(97 + parseInt(ColumnIndex))+"," + Value + ")][1]\"/></xsl:template>";
	xsl+="<xsl:template match=\"e\">";
	// Note this needs to be indexing from 0 not 1.
	xsl+="<xsl:value-of select=\"count(preceding-sibling::e)\" />";
	xsl+="</xsl:template>";
	xsl+="</xsl:stylesheet>";

	var oXSL=nitobi.xml.createXslProcessor(xsl);
	var searchXml = nitobi.xml.createXmlDoc(this.GetXmlObject().xml.replace(/>\s+</g,"><").toLowerCase());
	var index = nitobi.xml.transformToString(searchXml, oXSL);

	if("" == index)
		index = -1;
	return parseInt(index);
}

/**
 * Adds a page of XML to the local datasource.
 * @param {String} XML The xml page including the root tags.
 * @private
 */
nitobi.combo.XmlDataSource.prototype.AddPage = function(XML)
{
	// Got rid of the lower case XML crap for Netscape
	
	// Copy the XML into our local datasource.
	var tmp=nitobi.xml.createXmlDoc(XML);
	var newNodes = tmp.selectNodes("//e");
	var root = this.GetXmlObject().documentElement;
	// In the future we may support different page sizes. For now
	// this should be the same as the specified preset page size.
	this.SetLastPageSize(tmp.selectNodes("//e").length);
	for(var i=0; i<newNodes.length; i++)
	{
		// removed some lower case XML crap here
  		root.appendChild(newNodes[i].cloneNode(true));
  	}
  	
  	this.m_Dirty=false;
}

/**
 * Deletes all records in the XML cache.
 * This does not clear the rendered list. Use 
 * {@link nitobi.combo.List#Clear} to clear the rendered
 * list.
 * @example
 * &#102;unction clearCombo()
 * {
 * 	var combo = nitobi.getComponent('combo1');
 * 	combo.GetList().GetXmlDataSource().Clear();
 * 	combo.GetList().Clear();
 * }
 * @see nitobi.combo.List#AddRow
 */
nitobi.combo.XmlDataSource.prototype.Clear = function()
{
	// Removed stuff here to do with lower casing the XML for Firefox case sensitivity
	nitobi.xml.loadXml(this.GetXmlObject(), "<root/>", true);
}

/**
 * Returns a row from the dataset.
 * This returns a row from the XML cache. The ordinal position of the row
 * corresponds to the ordinal position of the row displayed in the list. If you want 
 * to get all rows, i.e., the entire dataset, you should use {@link #GetXmlObject}.
 * @example
 * var datasource = nitobi.getComponent('combo1').GetList().GetXmlDataSource();
 * var row = datasource.GetRow(0);
 * alert('The 3rd column of data: ' + row[2]);
 * @param {Number} Index The index of the row you want to retrieve. Indexed from zero
 * @type Array
 */
nitobi.combo.XmlDataSource.prototype.GetRow = function(Index)
{
	Index = parseInt(Index);
	var row = this.GetXmlObject().documentElement.childNodes.item(Index);
	var values = new Array;
	for (var i = 0; i < this.GetNumberColumns(); i++){
		values[i] = row.getAttribute(String.fromCharCode(97+i));
	}
	return values;
}

/**
 * Returns a value from a column from a row.
 * @param {Number} Row The index of the row you want to retrieve. Indexed from zero.
 * @param {Number} Col The index of the col you want to retrieve. Indexed from zero.
 * @private
 */
nitobi.combo.XmlDataSource.prototype.GetRowCol = function(Row,Col)
{
	var row = this.GetXmlObject().documentElement.childNodes.item(parseInt(Row));
	var val = row.getAttribute(String.fromCharCode(97+parseInt(Col)));
	return val;
}

/**
 * Returns a column index given its name.
 * @param {String} Name The name of the column whose index you want to find.
 * @private
 */
nitobi.combo.XmlDataSource.prototype.GetColumnIndex = function(Name)
{
	// better to default to col 0 (i.e. GetColumnIndex(null) now returns 0) than to fail and throw a fit
	if(Name==null)
		return 0;
		
	Name=Name.toLowerCase();
	var colNames = this.GetColumnNames();
	
	if (colNames != null){
		for (var i = 0 ; i < colNames.length ; i++){
			if (Name == colNames[i].toLowerCase()){
				return parseInt(i);
			}
		}
	}
	return -1;
}