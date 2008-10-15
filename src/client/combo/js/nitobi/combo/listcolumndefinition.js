/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");
/**
 * Defines a column of the list
 * @class Describes the appearance and functioning of a column in the combo list.
 * @constructor
 * @param {HTMLElement} oNewListColumn The HTML object that represents ListColumnDefinition
 * @see nitobi.combo.Combo
 */
nitobi.combo.ListColumnDefinition = function(oNewListColumn)
{
	// in case we're passing in a user created oNewListColumn object vs. a HTML tag
	if(!oNewListColumn.getAttribute)
		oNewListColumn.getAttribute=function(a){return this[a];};

	var DEFAULTWIDTH="50px";
	var DEFAULTCSSCLASSNAME="ntb-combobox-list-column-definition";
	var DEFAULTCOLUMNTYPE="text";
	var DEFAULTIMAGEHANDLERURL="";
	var DEFAULTALIGN="left";
	var DEFAULTTEXTCOLOR="#000";


	var textcolor=(oNewListColumn ? oNewListColumn.getAttribute("TextColor") : null);
	((null == textcolor) || ("" == textcolor))
		? this.SetTextColor(DEFAULTTEXTCOLOR)
		: this.SetTextColor(textcolor);

	var align=(oNewListColumn ? oNewListColumn.getAttribute("Align") : null);
	((null == align) || ("" == align))
		? this.SetAlign(DEFAULTALIGN)
		: this.SetAlign(align);

	var width=(oNewListColumn ? oNewListColumn.getAttribute("Width") : null);
	((null == width) || ("" == width))
		? this.SetWidth(DEFAULTWIDTH)
		: this.SetWidth(width);

	var ihu=(oNewListColumn ? oNewListColumn.getAttribute("ImageHandlerURL") : null);
	((null == ihu) || ("" == ihu))
		? this.SetImageHandlerURL(DEFAULTIMAGEHANDLERURL)
		: this.SetImageHandlerURL(ihu);

	var ct=(oNewListColumn ? oNewListColumn.getAttribute("ColumnType") : null);
	((null == ct) || ("" == ct))
		? this.SetColumnType(DEFAULTCOLUMNTYPE)
		: this.SetColumnType(ct.toLowerCase());

//		if ((this.GetColumnType() == "image") && ((null == ihu) || ("" == ihu)))
//			alert("EBA Combo Error: You cannot have an image column without specifying the ImageHandlerURL");
	/**
	 * @private
	 */
	this.ImageUrlFromData = ((this.GetColumnType() == "image") && ((null == ihu) || ("" == ihu)));

	var ccn=(oNewListColumn ? oNewListColumn.getAttribute("CSSClassName") : null);
	((null == ccn) || ("" == ccn))
		? this.SetCSSClassName(DEFAULTCSSCLASSNAME)
		: this.SetCSSClassName(ccn);

	var hp=(oNewListColumn ? oNewListColumn.getAttribute("HTMLPrefix") : null);
	((null == hp) || ("" == hp))
		? this.SetHTMLPrefix("")
		: this.SetHTMLPrefix(hp);

	var hs=(oNewListColumn ? oNewListColumn.getAttribute("HTMLSuffix") : null);
	((null == hs) || ("" == hs))
		? this.SetHTMLSuffix("")
		: this.SetHTMLSuffix(hs);

	var hl=(oNewListColumn ? oNewListColumn.getAttribute("HeaderLabel") : null);
	((null == hl) || ("" == hl))
		? this.SetHeaderLabel("")
		: this.SetHeaderLabel(hl);

	var dfi=(oNewListColumn ? oNewListColumn.getAttribute("DataFieldIndex") : null);
	((null == dfi) || ("" == dfi))
		? this.SetDataFieldIndex(0)
		: this.SetDataFieldIndex(dfi);
}

/**
 * Returns the alignment of text in this column as one of left, right, or center.
 * <p>
 * If this property is changed after the Combo has loaded its records, future records will be
 * rendered according to the new ListColumnDefinition, but already rendered records will not change. 
 * </p>
 * If you want to re-render the list, you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * @type String
 * @see #SetAlign
 */
nitobi.combo.ListColumnDefinition.prototype.GetAlign = function(){
	return this.m_Align;
}

/**
 * Sets the alignment of text in this column as one of left, right, or center.
 * If this property is changed after the Combo has loaded its records, future records will be
 * rendered according to the new ListColumnDefinition, but already rendered records will not change. 
 * If you want to re-render the list, you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * @param {String} Align Alignment of text in this column. It can be one of left, right, or center.
 * @see #GetAlign
 */
nitobi.combo.ListColumnDefinition.prototype.SetAlign = function(Align){
	Align = Align.toLowerCase();
	if("right"!=Align && "left"!=Align && "center"!=Align)
		Align="left";
	this.m_Align = Align;
}

/**
 * Returns the color of the text in this column.
 * @type String
 */
nitobi.combo.ListColumnDefinition.prototype.GetTextColor = function(){
	return this.m_TextColor;
}

/**
 * Sets the color of the text in this column.
 * <p>
 * The default is #000; this can be any valid HTML color. If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new value,
 * but already rendered records will not change. 
 * </p>
 * <p>
 * If you want to re-render the list, you will have to first
 * clear the List and the XmlDatasource using the Clear methods.
 * </p>
 * @param {String} TextColor Any valid HTML color.
 */
nitobi.combo.ListColumnDefinition.prototype.SetTextColor = function(TextColor){
	this.m_TextColor = TextColor;
}

/**
 * Returns the HTML code that will be added after each row value in this column.
 * <p>
 * This is HTML code that is added after each value in each row of this column. This
 * can include any valid HTML code including closing tags that were written using the HTMLPrefix
 * property. 
 * </p>
 * If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new value,
 * but already rendered records will not change. If you want to re-render the list, 
 * you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * @type String
 * @see #GetHTMLPrefix
 * @see #SetHTMLSuffix
 * @see nitobi.combo.List.GetCustomHTMLDefinition
 */
nitobi.combo.ListColumnDefinition.prototype.GetHTMLSuffix = function(){
	return this.m_HTMLSuffix;
}

/**
 * Sets the HTML code that will be added after each row value in this column.
 * <p>
 * This is HTML code that is added after each value in each row of this column. This
 * can include any valid HTML code including closing tags that were written using the HTMLPrefix
 * property. 
 * </p>
 * <p>If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new value,
 * but already rendered records will not change. 
 * <br/>If you want to re-render the list, 
 * you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * </p>
 * @param {String} HTMLSuffix The HTML code that will be added after each row value in this column
 * @see #SetHTMLPrefix
 * @see #GetHTMLSuffix
 * @see nitobi.combo.List#GetCustomHTMLDefinition
 */
nitobi.combo.ListColumnDefinition.prototype.SetHTMLSuffix = function(HTMLSuffix){
	this.m_HTMLSuffix = HTMLSuffix;
}

/**
 * Returns the HTML code that will be added before each row value in this column.
 * <p>
 * This is HTML code that is added before each value in each row of this column. This
 * can include any valid HTML code including closing tags that were written using the HTMLSuffix
 * property. 
 * </p>
 * If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new value,
 * but already rendered records will not change. If you want to re-render the list, 
 * you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * @type String
 * @see #SetHTMLPrefix
 * @see #GetHTMLSuffix
 * @see nitobi.combo.List.GetCustomHTMLDefinition
 */
nitobi.combo.ListColumnDefinition.prototype.GetHTMLPrefix = function(){
	return this.m_HTMLPrefix;
}

/**
 * Sets the HTML code that will be added before each row value in this column.
 * This is HTML code that is added before each value in each row of this column. This
 * can include any valid HTML code including closing tags that were written using the HTMLSuffix
 * property. If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new value,
 * but already rendered records will not change. If you want to re-render the list, 
 * you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * @param {String} HTMLPrefix Any valid HTML code
 * @see #GetHTMLPrefix
 * @see #SetHTMLSuffix
 * @see nitobi.combo.List.SetCustomHTMLDefinition
 */
nitobi.combo.ListColumnDefinition.prototype.SetHTMLPrefix = function(HTMLPrefix){
	this.m_HTMLPrefix = HTMLPrefix;
}

/**
 * Returns the name of the CSS class that defines the style for this column.
 * <p>
 * The default CSS class that all ListColumnDefinitions in all Combos is ComboBoxListColumnDefinition, which is stored in the CSS file. 
 * If you want to modify all combos on the page, you can modify this class. If you only want to affect one combo
 * you can copy this class and then set CSSClassName to the copy.
 * </p>
 * @type String
 * @see #SetCSSClassName
 */
nitobi.combo.ListColumnDefinition.prototype.GetCSSClassName = function(){
	return this.m_CSSClassName;
}

/**
 * Sets the name of the CSS class that defines the style for this column.
 * <p>
 * The default CSS class that all ListColumnDefinitions in all Combos is ComboBoxListColumnDefinition, which is stored in the CSS file. '
 * </p>
 * <p>
 * If you want to modify all combos on the page, you can modify this class. 
 * <br/>If you only want to affect one combo
 * you can copy this class and then set CSSClassName to the copy.  
 * <br/>If this property is changed after the Combo has loaded its records, future records will be
 * rendered according to the new ListColumnDefinition, but already rendered records will not change. 
 * <br/>If you want to re-render the list, 
 * you will have to call the {@link nitobi.combo.List#Clear} and the {@link nitobi.combo.XmlDatasource#Clear} methods.
 * </p>
 * @param {String} CSSClassName The name of the CSS class that defines the style for this column. Do not include the dot
 * @see #GetCSSClassName
 */
nitobi.combo.ListColumnDefinition.prototype.SetCSSClassName = function(CSSClassName){
	this.m_CSSClassName = CSSClassName;
}

/** 
 * Returns the type of the column. It can be one of TEXT or IMAGE.
 * If IMAGE is used, you must also specify the ImageHandlerURL property.
 * @type String
 * @see #GetImageHandlerURL
 * @see #SetColumnType
 */
nitobi.combo.ListColumnDefinition.prototype.GetColumnType = function(){
	return this.m_ColumnType;
}

/** 
 * Sets the type of the column. It can be one of TEXT or IMAGE.
 * If IMAGE is used, you must also specify the ImageHandlerURL property.
 * @param {String} ColumnType The type of the column. It can be one of 'TEXT' or 'IMAGE'
 * @see #SetImageHandlerURL
 * @see #GetColumnType
 */
nitobi.combo.ListColumnDefinition.prototype.SetColumnType = function(ColumnType){
	this.m_ColumnType = ColumnType;
}

/**
 * Returns the string displayed as the header for this column.
 * This allows you define headers for each column of data in the list. Use CustomHTMLHeader if you only want one header that spans all columns.
 * @type String
 * @see #SetHeaderLabel
 * @see nitobi.combo.List#GetCustomHTMLHeader
 */
nitobi.combo.ListColumnDefinition.prototype.GetHeaderLabel = function(){
	return this.m_HeaderLabel;
}

/**
 * Sets the string displayed as the header for this column.
 * This allows you define headers for each column of data in the list. Use CustomHTMLHeader if you only want one header that spans all columns.
 * @param {String} HeaderLabel The string displayed as the header for this column
 * @see #GetHeaderLabel
 */
nitobi.combo.ListColumnDefinition.prototype.SetHeaderLabel = function(HeaderLabel){
	this.m_HeaderLabel = HeaderLabel;
}

/**
 * Returns the width of the column. This can be an absolute pixel value, e.g., 15px or a percentage of the list width, e.g., 50%.
 * Wrapping is determined by the CSS class used to render the column. If you set this value to
 * a px value, you should ensure that the list width will be big enough to fit it.
 * @type String
 * @see #SetWidth
 * @see #GetCSSClassName
 * @see nitobi.combo.List#GetWidth
 */
nitobi.combo.ListColumnDefinition.prototype.GetWidth = function(){
	return this.m_Width;
}

/**
 * Sets the width of the column. This can be an absolute pixel value, e.g., 15px or a percentage of the list width, e.g., 50%.
 * Wrapping is determined by the CSS class used to render the column. If you set this value to
 * a px value, you should ensure that the list width will be big enough to fit it.
 * @param {String} Width The width of the column in HTML units
 * @see #GetWidth
 * @see #SetCSSClassName
 * @see nitobi.combo.List#SetWidth
 */
nitobi.combo.ListColumnDefinition.prototype.SetWidth = function(Width){
	this.m_Width = Width;
}

/**
 * Returns the index of the data field that populates this column. If you leave this field
 * empty, it will use the ordinal position of the ListColumnDefinition within the List.ListColumnDefinitions collection.
 * @type Number
 * @see #SetDataFieldIndex
 * @see nitobi.combo.Combo#GetDataTextField
 * @see nitobi.combo.Combo#GetDataValueField
 * @see nitobi.combo.TextBox#GetDataFieldIndex
 */
nitobi.combo.ListColumnDefinition.prototype.GetDataFieldIndex = function(){
	return this.m_DataFieldIndex;
}

/**
 * Sets the index of the data field that populates this column. If you leave this field
 * empty, it will use the ordinal position of the ListColumnDefinition within the List.ListColumnDefinitions collection.
 * @param {Number} DataFieldIndex The index of the data field that populates this column
 * @see #GetDataFieldIndex
 * @see nitobi.combo.TextBox#SetDataFieldIndex
 */
nitobi.combo.ListColumnDefinition.prototype.SetDataFieldIndex = function(DataFieldIndex){
	this.m_DataFieldIndex = DataFieldIndex;
}

/**
 * Returns the image url of the column.
 * <p>
 * If the ColumnType is IMAGE this property must be specfied. It contains the URL of a page that will serve up an image given an argument.
 * </p>
 * <p> 
 * The database column will contain image identifiers; this identifier will be used as an argument to the page, e.g. if the URL is
 * http://localhost/ImageServer.aspx?, then  combo will call it as follows http://localhost/ImageServer.aspx?Image=DataFromColumn.  
 * </p>
 * <p>
 * It will expect a binary image to be written out by the page. For example, the values in this column could be the id's of people
 * stored in the database.  When the combo is loaded the row value sends a request to the 
 * image handler, e.g. by calling http://localhost/ImageServer.aspx?Image=shiggens.  
 * <br/>
 * ImageServer.aspx
 * will check if shiggens is online, and, if so, send back an image specifying so.
 * </p>
 * @type String 
 * @see #GetColumnType
 * @see #SetImageHandlerURL
 */
nitobi.combo.ListColumnDefinition.prototype.GetImageHandlerURL = function(){
	return this.m_ImageHandlerURL;
}

/**
 * Sets the image url of the column.
 * <p>
 * If the ColumnType is IMAGE this property must be specfied. It contains the URL of a page that will serve up an image given an argument. 
 * The database column will contain image identifiers; this identifier will be used as an argument to the page, e.g. if the URL is
 * http://localhost/ImageServer.aspx?, then  combo will call it as follows http://localhost/ImageServer.aspx?Image=DataFromColumn.  
 * It will expect a binary image to be written out by the page. For example, the values in this column could be the id's of people
 * stored in the database.  
 * </p>
 * <p>
 * When the combo is loaded the row value sends a request to the 
 * image handler, e.g. by calling http://localhost/ImageServer.aspx?Image=shiggens.  ImageServer.aspx
 * will check if shiggens is online, and, if so, send back an image specifying so.
 * </p>
 * @param {String} ImageHandlerURL A URL to a page that supplies images
 * @see #SetColumnType
 * @see #GetImageHandlerURL
 */
nitobi.combo.ListColumnDefinition.prototype.SetImageHandlerURL = function(ImageHandlerURL){
	this.m_ImageHandlerURL = ImageHandlerURL;
}