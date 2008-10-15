/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");

/// Constants
EBAComboBoxListHeader=0;
EBAComboBoxListBody=1;
EBAComboBoxListFooter=2;
EBAComboBoxListBodyTable=3;
EBAComboBoxListNumSections=4;
EBAComboBoxList=5;
// Timeout Constants
EBADatabaseSearchTimeoutStatus_WAIT=0;
EBADatabaseSearchTimeoutStatus_EXPIRED=1;
EBADatabaseSearchTimeoutStatus_NONE=2;
EBADatabaseSearchTimeoutWait=200;
// Action Key constants
EBAMoveAction_UP = 0;
EBAMoveAction_DOWN = 1;
// scroll to constants
EBAScrollToNone = 0;
EBAScrollToTop = 1;
EBAScrollToBottom = 2;
EBAScrollToNewTop = 3;
EBAScrollToTypeAhead = 4;
EBAScrollToNewBottom = 5;

// Search constants
EBAComboSearchNoRecords=0;
EBAComboSearchNewRecords=1;

// Moz default scroll bar size
EBADefaultScrollbarSize=18;

/**
 * Creates a List object to be associated with a {@link nitobi.combo.Combo} object.
 * @class List manages the list portion of the Nitobi ComboBox.  Normally, you wouldn't instantiate it
 * manually, but rather, you can get a reference to one using {@link nitobi.combo.Combo#GetList}
 * @example
 * var combo = nitobi.getComponent("myCombo");
 * var list = combo.GetList();
 * @constructor
 * @param {HTMLElement} userTag
 * @param {XMLElement} xmlUserTag
 * @param {HTMLElement} unboundComboValuesTag
 * @param {nitobi.combo.Combo} comboObject The owner combobox of this list
 * @see nitobi.combo.Combo
 */
nitobi.combo.List = function (userTag, xmlUserTag, unboundComboValuesTag, comboObject){

	/**
	 * @private
	 */
	this.m_Rendered=false;
	var DEFAULTCLASSNAME="ntb-combobox-button";
	var DEFAULTWIDTH="150px";
	var DEFAULTSECTIONHEIGHTS = new Array("50px","100px","50px");
	var DEFAULTSECTIONCLASSNAMES = new Array("ntb-combobox-list-header","ntb-combobox-list-body","ntb-combobox-list-footer","ntb-combobox-list-body-table");
	var DEFAULTHIGHLIGHTCSSCLASSNAME = "ntb-combobox-list-body-table-row-highlighted";
	var DEFAULTBACKGROUNDHIGHLIGHTCOLOR = "highlight";
	var DEFAULTFOREGROUNDHIGHLIGHTCOLOR = "highlighttext";
	var DEFAULTCUSTOMHTMLDEFINITION = "";
	var DEFAULTSELECTEDROWINDEX = -1;
	var DEFAULTALLOWPAGING=comboObject.mode=="default";
	var DEFAULTOVERFLOWY = "hidden";
	var DEFAULTFuzzySearchEnabled = false;
	var DEFAULTENABLEDATABASESEARCH=comboObject.mode!="default";
	var DEFAULTPAGESIZE;
	if (comboObject.mode != "classic")
	{
		DEFAULTPAGESIZE=10;
	}
	else
	{
		DEFAULTPAGESIZE=25;
	}
	var DEFAULTONHIDEEVENT="";
	var DEFAULTONSHOWEVENT="";
	var DEFAULTONBEFORESEARCH="";
	var DEFAULTONAFTERSEARCH="";
	var DEFAULTOFFSETX=0;
	var DEFAULTOFFSETY=0;
	var ERROR_NOXML="EBA:Combo could not correctly transform XML data. Do you have the MS XML libraries installed? These are typically installed with your browser and are freely available from Microsoft.";
	var CONVERTCOMBOVALUETOCOMPRESSEDXML=
			"<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\" version=\"1.0\" xmlns:eba=\"http://developer.ebusiness-apps.com\" xmlns:ntb=\"http://www.nitobi.com\" exclude-result-prefixes=\"eba ntb\">"+
			"<xsl:output method=\"xml\" version=\"4.0\" omit-xml-declaration=\"yes\" />"+
			"<xsl:template match=\"/\">" +
			"<xsl:apply-templates select=\"eba:ComboValues|ntb:ComboValues\"/>" +
			"</xsl:template>" +
			"<xsl:template match=\"/eba:ComboValues|ntb:ComboValues\">"+
			"<root>"+
			"<xsl:attribute name=\"fields\"><xsl:value-of select=\"@fields\" /></xsl:attribute>" +
			"	<xsl:apply-templates/>"+
			"</root>"+
			"</xsl:template>" +
			"<xsl:template match=\"eba:ComboValue|eba:combovalue|ntb:ComboValue|ntb:combovalue\">"+
			"	<e><xsl:for-each select=\"@*\"><xsl:attribute name=\"{name()}\"><xsl:value-of select=\".\"/></xsl:attribute></xsl:for-each></e>"+
			"</xsl:template>"+
			"</xsl:stylesheet>";
	this.SetCombo(comboObject);
	
	var ps=(userTag ? userTag.getAttribute("PageSize") : null);
	((null == ps) || ("" == ps))
		? this.SetPageSize(DEFAULTPAGESIZE)
		: this.SetPageSize(parseInt(ps));

	// list clipping logic
	// only clip if SMARTSEARCH, SMARTLIST, or FILTER
	/**
	 * @private
	 */
	this.clip = (comboObject.mode=="smartsearch" || comboObject.mode=="smartlist" || comboObject.mode=="filter");

	var clpLen = (userTag ? userTag.getAttribute("ClipLength") : null);
	((null == clpLen) || ("" == clpLen))
		? this.SetClipLength(this.GetPageSize())
		: this.SetClipLength(clpLen);

	var ds = new nitobi.combo.XmlDataSource();



	if (xmlUserTag != null)
	{
		ds.combo = comboObject;
		var x=(xmlUserTag ? xmlUserTag.getAttribute("XmlId") : "");
		ds.SetXmlId(x);
		var dataIsland = document.getElementById(x);
		if (!nitobi.browser.IE || null == dataIsland)
		{
			nitobi.Browser.ConvertXmlDataIsland(x,comboObject.GetHttpRequestMethod());
			ds.SetXmlObject(document[x], this.clip, this.clipLength);
		}
		else
			ds.SetXmlObject(dataIsland);
		// Set the page size to number of rows we receive initially.
		// Here we assume that the initial data we receive is like a page
		// get.  We don't actually do a page get because we don't want
		// to copy our initial xml datasource.
		ds.SetLastPageSize(ds.GetNumberRows());

		/// <property name="m_Dirty" type="bool" access="private" default="false" readwrite="readwrite">
		/// <summary>If this is true, this local browser xml cache is considered dirty and out of date.</summary></property>
		ds.m_Dirty=false;
	}

	this.SetXmlDataSource(ds);

	// Create this to enable GetPage.
	/**
	 * @private
	 */
	this.m_httpRequest=new nitobi.ajax.HttpRequest();
	this.m_httpRequest.responseType = "text";
	this.m_httpRequest.onRequestComplete.subscribe(this.onGetComplete, this);

	// Is this an XML Datasource or an unbound datasource.  If its unbound to the local XML
	// and defined by html, we need to create the xml object.
	/**
	 * @private
	 */
	this.unboundMode=false;
	if(!xmlUserTag)
	{
		this.unboundMode=true;
		// This is a statically defined datasource using ComboValue tags.
		var xmlObect=null;
		var unboundXml = "<eba:ComboValues fields='" + unboundComboValuesTag.getAttribute("fields") + "' xmlns:eba='http://developer.ebusiness-apps.com' xmlns:ntb='http://www.nitobi.com'>";
		// 31 refers to the end of the bad IE namespace tag.
		//unboundXml += unboundComboValuesTag.innerHTML.substr(nitobi.browser.IE ? 31 : 0) + "</eba:ComboValues>";
		if (nitobi.browser.IE)
		{
			var comboValues = unboundComboValuesTag.innerHTML.match(/<\?xml:namespace.*?\/>(.*)/);
			unboundXml += comboValues[1] + "</eba:ComboValues>";
		}
		else
		{
			unboundXml += unboundComboValuesTag.innerHTML + "</eba:ComboValues>";
		}
		
		
		
		
		
		// NOTE: we replace &nbsp; w/ %a0 here because &nbsp; is an unknown entity reference;
		// in Moz, we could properly declare the entity ref but we couldn't do this in IE;
		// also, replacing &nbsp; w/ &#160; doesn't work because when creating the DOM doc, this
		// gets converted back to &nbsp; and when we transform, the unknown entity ref comes into
		// play again and again, we could declare it in Moz but not IE
		// TODO: declaring the entity ref and leaving &nbsp; is ideal; figure it out for IE if we have time in the future
		// for now do it here via Javascript; also, we didn't do it above in the for-loop on the
		// attributes because we couldn't get the regex to recognize the nonbreaking space char; put it
		// there if we figure out
		// NOTE: need to parse out whitespace (i.e. between xml tags) like IE
		// Angle brackets (< and >) must be encoded. The HTML DOM unencodes them. Additionally, &nbsp; is not an xml entity
		// and must be converted to &#160;. Careful though, sometimes the HTML DOM converts the 160 back to nbsp. 
		// Need to parse out whitespace (i.e. between xml tags) like IE
		unboundXml = nitobi.Browser.EncodeAngleBracketsInTagAttributes(unboundXml,comboObject).replace(/&nbsp;/g,"&#160;").replace(/>\s+</g,"><");
		// Transform the html tags into regular EBA XML for the datasource.
		try
		{
			var oXSL=nitobi.xml.createXmlDoc(CONVERTCOMBOVALUETOCOMPRESSEDXML);
			tmp=nitobi.xml.createXmlDoc(unboundXml);
			xmlObject=nitobi.xml.transformToXml(tmp, oXSL);
			this.GetXmlDataSource().SetXmlObject(xmlObject);
			this.GetXmlDataSource().m_Dirty=false;
		}
		catch(err)
		{
			alert(ERROR_NOXML);
		}
	}

	/**
	 * @private
	 */
	this.m_SectionHTMLTagObjects = new Array;
	/**
	 * @private
	 */
	this.m_SectionCSSClassNames = new Array;
	/**
	 * @private
	 */
	this.m_SectionHeights = new Array;
	/**
	 * @private
	 */
	this.m_ListColumnDefinitions = new Array;

	// Get the list column definition tags.
	var child=null;
	var numColDefs=0;
	var unboundComboValues=null;
	var dataTextField = this.GetCombo().GetDataTextField();
	var tried=false;
	var unresolved=true;
	while(unresolved){
		if(dataTextField != null || tried==true){
			// The column defs have to be built from the simple DataValueField and DataTextFieldProperties
			var newListColumn = new Object;
			// Set the display field.
			newListColumn.DataFieldIndex = this.GetXmlDataSource().GetColumnIndex(dataTextField);
			newListColumn.DataValueIndex = this.GetXmlDataSource().GetColumnIndex(comboObject.GetDataValueField());
			newListColumn.HeaderLabel="";
			newListColumn.Width="100%";
			/**
			 * @private
			 */
			this.m_ListColumnDefinitions[0] = new nitobi.combo.ListColumnDefinition(newListColumn);
			unresolved=false;
		}else{
			// The ComboColumnDefinition can be in either the list tag or the combo tag.
			// Check for the list tag first, and if they are not there, check in the combo tag.
			var tagWithDefs=userTag;
			if ((null==userTag) || (0==userTag.childNodes.length))
				tagWithDefs = comboObject.m_userTag;

			// Build the list column defs based on the tags.
			var tagName=null;
			for (var i=0; i < tagWithDefs.childNodes.length; i++){
				child = tagWithDefs.childNodes[i];
				tagName = child.tagName;
				if(tagName){
					// toLowerCase comparsion to eliminate IE/Moz case differences
					// remove ntb: namespace for Moz
					tagName = tagName.toLowerCase().replace(/^eba:/,"").replace(/^ntb:/,"");
					if (tagName == "combocolumndefinition"){
						/**
						 * @private
	 					 */
						this.m_ListColumnDefinitions[numColDefs] = new nitobi.combo.ListColumnDefinition(child);
						numColDefs++;
						unresolved=false;
					}
				}
			}
			tried=true;
		}
	}
	var width=(userTag ? userTag.getAttribute("Width") : null);
	((null == width) || ("" == width))
		? this.SetWidth(DEFAULTWIDTH)
		: this.SetWidth(width);

	var overflowy=(userTag ? userTag.getAttribute("Overflow-y") : null);
	/**
	 * @private
	 */
	this.m_overflowy = ((null == overflowy) || ("" == overflowy))
		? DEFAULTOVERFLOWY
		: overflowy;

	var chh=(userTag ? userTag.getAttribute("CustomHTMLHeader") : null);
	((null == chh) || ("" == chh))
		? this.SetCustomHTMLHeader("")
		: this.SetCustomHTMLHeader(chh);

	// Set the defaults for the section CSS Classnames.
	for (var i=0; i < EBAComboBoxListNumSections; i++){
		this.SetSectionCSSClassName(i, DEFAULTSECTIONCLASSNAMES[i]);
	}

	// TODO: User defined values.
	// Set the defaults for the section heights.
	for (var i=0; i <= EBAComboBoxListFooter; i++){
		this.SetSectionHeight(i, DEFAULTSECTIONHEIGHTS[i]);
	}

	// Start with the list. Do the header and the footer later. TODO.
	var height=(userTag ? userTag.getAttribute("Height") : null);
	((null == height) || ("" == height))
		? null
		: this.SetHeight(parseInt(height));

	var hccn=(userTag ? userTag.getAttribute("HighlightCSSClassName") : null);
	if ((null == hccn) || ("" == hccn)){
		this.SetHighlightCSSClassName(DEFAULTHIGHLIGHTCSSCLASSNAME);
		/**
		 * @private
		 */
		this.m_UseHighlightClass=false;
	}else{
		this.SetHighlightCSSClassName(hccn);
		/**
	 	 * @private
		 */
		this.m_UseHighlightClass=true;
	}

	var bhc=(userTag ? userTag.getAttribute("BackgroundHighlightColor") : null);
	((null == bhc) || ("" == bhc))
		? this.SetBackgroundHighlightColor(DEFAULTBACKGROUNDHIGHLIGHTCOLOR)
		: this.SetBackgroundHighlightColor(bhc);

	var ohe=(userTag ? userTag.getAttribute("OnHideEvent") : null);
	((null == ohe) || ("" == ohe))
		? this.SetOnHideEvent(DEFAULTONHIDEEVENT)
		: this.SetOnHideEvent(ohe);

	var ose=(userTag ? userTag.getAttribute("OnShowEvent") : null);
	((null == ose) || ("" == ose))
		? this.SetOnShowEvent(DEFAULTONSHOWEVENT)
		: this.SetOnShowEvent(ose);

	var onbs=(userTag ? userTag.getAttribute("OnBeforeSearchEvent") : null);
	((null == onbs) || ("" == onbs))
		? this.SetOnBeforeSearchEvent(DEFAULTONBEFORESEARCH)
		: this.SetOnBeforeSearchEvent(onbs);

	var onas=(userTag ? userTag.getAttribute("OnAfterSearchEvent") : null);
	((null == onas) || ("" == onas))
		? this.SetOnAfterSearchEvent(DEFAULTONAFTERSEARCH)
		: this.SetOnAfterSearchEvent(onas);

	var fhc=(userTag ? userTag.getAttribute("ForegroundHighlightColor") : null);
	((null == fhc) || ("" == fhc))
		? this.SetForegroundHighlightColor(DEFAULTFOREGROUNDHIGHLIGHTCOLOR)
		: this.SetForegroundHighlightColor(fhc);

	var offx=(userTag ? userTag.getAttribute("OffsetX") : null);
	((null == offx) || ("" == offx))
		? this.SetOffsetX(DEFAULTOFFSETX)
		: this.SetOffsetX(offx);

	var offy=(userTag ? userTag.getAttribute("OffsetY") : null);
	((null == offy) || ("" == offy))
		? this.SetOffsetY(DEFAULTOFFSETY)
		: this.SetOffsetY(offy);

	// Get the SelectedRowIndex out of the combo. It really belongs here,
	// but for end user side it makes more sense.
	var sri=(userTag ? userTag.parentNode.getAttribute("SelectedRowIndex") : null);
	((null == sri) || ("" == sri))
		? this.SetSelectedRowIndex(DEFAULTSELECTEDROWINDEX)
		: this.SetSelectedRowIndex(parseInt(sri));

	var chd=(userTag ? userTag.getAttribute("CustomHTMLDefinition") : null);
	((null == chd) || ("" == chd))
		? this.SetCustomHTMLDefinition(DEFAULTCUSTOMHTMLDEFINITION)
		: this.SetCustomHTMLDefinition(chd);

	var ap=(userTag ? userTag.getAttribute("AllowPaging") : null);
	((null == ap) || ("" == ap))
		? this.SetAllowPaging(DEFAULTALLOWPAGING)
		: this.SetAllowPaging(ap.toLowerCase()=="true");
		
	var fz=(userTag ? userTag.getAttribute("FuzzySearchEnabled") : null);
	((null == fz) || ("" == fz))
		? this.SetFuzzySearchEnabled(DEFAULTFuzzySearchEnabled)
		: this.SetFuzzySearchEnabled(fz.toLowerCase()=="true");

	var eds=(userTag ? userTag.getAttribute("EnableDatabaseSearch") : null);
	((null == eds) || ("" == eds))
		? this.SetEnableDatabaseSearch(this.unboundMode==false && DEFAULTENABLEDATABASESEARCH)
		: this.SetEnableDatabaseSearch(this.unboundMode==false && eds.toLowerCase()=="true");


	if(comboObject.mode=="default" && this.GetAllowPaging()==true){
		this.SetClipLength(this.GetPageSize());
		this.clip=true;
	}

	/**
	 * @private
	 */
	this.widestColumn = new Array(this.m_ListColumnDefinitions.length);
	for (var i=0;i<this.widestColumn.length;i++)
	{
		this.widestColumn[i]=0;
	}

	// We're not yet doing any database lookups.
	this.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_NONE);

	var durl=(userTag ? userTag.getAttribute("DatasourceUrl") : null);
	if((null == durl) || ("" == durl) || this.unboundMode==true){
		this.SetDatasourceUrl(document.location.toString());
		this.SetEnableDatabaseSearch(false);
		this.unboundMode=true;
	}else{
		this.SetDatasourceUrl(durl);
		this.SetEnableDatabaseSearch(true);
	}

	/**
	 * @private
	 */
	this.m_httpRequestReady=true;
	this.SetNumPagesLoaded(0);
	/**
	 * @private
	 */
	this.m_userTag = userTag;
}

/**
 * Actively unloads the object, and destroys owned objects.
 * @private
 */
nitobi.combo.List.prototype.Unload = function()
{
	if (this.IF)
	{
		this.IF.Unload();
		delete this.IF;
	}
	_EBAMemScrub(this);
}


/**
 * Sets the length of clipping used in SmartList, SmartSearch and Filter modes.
 * When the combo is in SmartList, SmartSearch or Filter mode, any page of records is 
 * reduced in size to equal ClipLength. This setting is independent of PageSize.
 * @param {Number} clpLength The size to reduce an XML page once it is returned from the server
 * @see #SetPageSize
 */
nitobi.combo.List.prototype.SetClipLength = function(clpLength)
{
	this.clipLength = clpLength
}

/**
 * The HTML tag that is bound to this object. Only available after the combo has inserted the tags and called initialize.
 * @type HTMLElement
 * @private
 */
nitobi.combo.List.prototype.GetHTMLTagObject = function()
{
	this.Render();
	return this.m_HTMLTagObject;
}

/**
 * The HTML tag that is bound to this object. Only available after the combo has inserted the tags and called initialize.
 * @param {HTMLElement} HTMLTagObject The HTML element to associate with the list
 * @private
 */
nitobi.combo.List.prototype.SetHTMLTagObject = function(HTMLTagObject)
{
	this.m_HTMLTagObject = HTMLTagObject;
}

/**
 * Returns the CSS style applied to the row when the user highlights it.
 * Use BackgroundHighlightColor for better performance. The default CSS class that all
 * combos use is ComboBoxListBodyTableRowHighlighted, which is stored in the CSS file. If you want to 
 * modify all combos on the page, you can modify this class. If you only want to affect one combo
 * you can copy this class and then set HighlightCSSClassName to the copy.
 * @type String
 * @see #SetHighlightCSSClassName
 * @see #GetBackgroundHighlightColor
 */
nitobi.combo.List.prototype.GetHighlightCSSClassName = function()
{
	return this.m_HighlightCSSClassName;
}

/**
 * Sets the CSS style applied to the row when the user highlights it.
 * Use BackgroundHighlightColor for better performance. The default CSS class that all
 * combos use is ComboBoxListBodyTableRowHighlighted, which is stored in the CSS file. If you want to 
 * modify all combos on the page, you can modify this class. If you only want to affect one combo
 * you can copy this class and then set HighlightCSSClassName to the copy.
 * @param {String} HighlightCSSClassName The name of the custom CSS class.  Do not include the dot 
 * @see #GetHighlightCSSClassName
 * @see #SetBackgroundHighlightColor
 */
nitobi.combo.List.prototype.SetHighlightCSSClassName = function(HighlightCSSClassName)
{
	this.m_HighlightCSSClassName = HighlightCSSClassName;
}

/**
 * Returns all {@link nitobi.combo.ListColumnDefinition} that define how the list columns look and behave.
 * These are not used if CustomHTMLDefinition is used.
 * <p>
 * So, if our List declaration looked like this:
 * </p>
 * <pre class="code">
 * &lt;ntb:ComboList Width="370px" Height="205px" DatasourceUrl="get.asp" PageSize="11"&gt;
 * 	&lt;ntb:ComboColumnDefinition Width="130px" HeaderLabel="Customer List" DataFieldIndex=0&gt;&lt;/ntb:ComboColumnDefinition&gt;
 * 	&lt;ntb:ComboColumnDefinition Width="200px" DataFieldIndex=1&gt;&lt;/ntb:ComboColumnDefinition&gt;
 * &lt;/ntb:ComboList&gt;
 * </pre>
 * <p>
 * Then,
 * </p>
 * <pre class="code">
 * var list = nitobi.getComponent('combo1').GetList();
 * list.GetListColumnDefinitions()[0].GetWidth();  // Is "130px"
 * </pre>
 * @type Array
 * @see #GetCustomHTMLDefinition
 */
nitobi.combo.List.prototype.GetListColumnDefinitions = function()
{
	return this.m_ListColumnDefinitions;
}

/**
 * The objects that define how the list columns look and behave. 
 * @param {Array} ListColumnDefinitions An array of ListColumnDefinition objects
 * @private
 */
nitobi.combo.List.prototype.SetListColumnDefinitions = function(ListColumnDefinitions)
{
	this.m_ListColumnDefinitions = ListColumnDefinitions;
}

/**
 * Returns a custom HTML definition for each row.  DataTextFields are specified inside the definition as such: ${0} for field 0, ${1} for
 * field 1 and so on. E.g. '&lt;b&gt;${0}&lt;/b&gt;'.
 * You can have more records in your datasource than are displayed using this property. This enables
 * you to hide key values from the user, but still have them returned once they make a selection. 
 * If this is used, the ListColumnDefinitions are ignored. If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new CustomHTMLDefinition,
 * but already rendered records will not change. If you want to re-render the list, you will have to first
 * use {@link #Clear} and the {@link nitobi.combo.XmlDataSource#Clear} methods
 * @type String
 * @see #SetHTMLSuffix
 * @see #SetHTMLPrefix
 * @see #SetCustomHTMLDefinition
 * @see nitobi.combo.ListColumnDefinition#SetHTMLSuffix
 * @see nitobi.combo.ListColumnDefinition#GetHTMLSuffix
 */
nitobi.combo.List.prototype.GetCustomHTMLDefinition = function()
{
	return this.m_CustomHTMLDefinition;
}

/**
 * Sets a custom HTML definition for each row.  DataTextFields are specified inside the definition as such: ${0} for field 0, ${1} for
 * field 1 and so on. E.g. '&lt;b&gt;${0}&lt;/b&gt;'.
 * You can have more records in your datasource than are displayed using this property. This enables
 * you to hide key values from the user, but still have them returned once they make a selection. 
 * If this is used, the ListColumnDefinitions are ignored. If this property is changed after the
 * Combo has loaded its records, future records will be rendered according to the new CustomHTMLDefinition,
 * but already rendered records will not change. If you want to re-render the list, you will have to first
 * use {@link #Clear} and the {@link nitobi.combo.XmlDataSource#Clear} methods
 * @param {String} CustomHTMLDefinition The custom HTML definition used to records records in the list
 * @see #SetHTMLSuffix
 * @see #SetHTMLPrefix
 * @see #GetCustomHTMLDefinition
 */
nitobi.combo.List.prototype.SetCustomHTMLDefinition = function(CustomHTMLDefinition)
{
	this.m_CustomHTMLDefinition = CustomHTMLDefinition;
}

/**
 * Returns the custom HTML definition for the list header. If this is used,
 * the HeaderLabels from the ListColumnDefinition tag will not be used.
 * This is the text display as a header at the top of the list and is a simple HTML string.  It applies to all columns.
 * @type String
 * @see nitobi.combo.ListColumnDefinition#GetHeaderLabel
 */
nitobi.combo.List.prototype.GetCustomHTMLHeader = function()
{
	return this.m_CustomHTMLHeader;
}

/**
 * Specify a custom HTML definition for the list header. If this is used,
 * the HeaderLabels from the ListColumnDefinitions are not used.
 * @param {String} CustomHTMLHeader The value of the property you want to set.
 * @private
 */
nitobi.combo.List.prototype.SetCustomHTMLHeader = function(CustomHTMLHeader)
{
	this.m_CustomHTMLHeader = CustomHTMLHeader;
}

/**
 * Returns the parent combo object.
 * This returns a handle to the Combo that owns the list.  
 * This is equivalent to the statement: <code>$("ComboID").jsObject</code>.
 * @type nitobi.combo.Combo
 */  
nitobi.combo.List.prototype.GetCombo = function()
{
	return this.m_Combo;
}

/**
 * @private
 */
nitobi.combo.List.prototype.SetCombo = function(Combo)
{
	this.m_Combo = Combo;
}

/**
 * Returns the list's XmlDataSource object
 * Returns a handle to the XmlDataSource object that the list is bound to.  
 * The XmlDataSource is in turn bound to the server's datasource.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * var xmlDataSource = list.GetXmlDataSource();
 * var xmlDoc = xmlDataSource.GetXmlObject();
 * // Gives us the xml node with xk equal to 47858
 * var node = xmlDoc.selectSingleNode('//e[&amp;xk=47858]');
 * node.setAttribute('a', 'London Calling');
 * @type nitobi.combo.XmlDataSource
 */
nitobi.combo.List.prototype.GetXmlDataSource = function()
{
	return this.m_XmlDataSource;
}

/**
 * Sets the xml datasource
 * Returns a handle to the XmlDataSource object that the list is bound to.  The XmlDataSource is in turn bound to the server's datasource.
 * @param {nitobi.combo.XmlDataSource} XmlDataSource The xml datasource for the list
 * @private
 */
nitobi.combo.List.prototype.SetXmlDataSource = function(XmlDataSource)
{
	this.m_XmlDataSource = XmlDataSource;
}

/**
 * Returns the width of the list in pixels or percent, e.g., 100px or 100% as specified
 * in the Width attribute of the List element.
 * This is not the same as the combo width.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * if (list.GetWidth() != list.GetActualPixelWidth())
 * {
 * 	alert('They are not the same');
 * }
 * @type String
 * @see nitobi.combo.Combo#GetWidth
 * @see #SetWidth
 * @see #GetActualPixelWidth
 */
nitobi.combo.List.prototype.GetWidth = function()
{
	return this.m_Width;
}

/**
 * Sets the width of the list in either pixels or percent, e.g., 100px or 100%.
 * This is not the same as the combo width.
 * @param {String} Width A string determining the width of the list in px or %
 * @see nitobi.combo.Combo#GetWidth
 * @see #GetWidth
 */
nitobi.combo.List.prototype.SetWidth = function(Width)
{
	this.m_Width = Width;
	if(this.m_Rendered)
	{
		this.GetHTMLTagObject().style.width = this.GetDesiredPixelWidth();
	
		// Set the inner sections to the same width except the table
		for(var i=0; i <= EBAComboBoxListFooter; i++)
		{
			if (i != EBAComboBoxListBodyTable)
			{
				var section = this.GetSectionHTMLTagObject(i);
				if (section != null)
				{
					section.style.width = this.GetDesiredPixelWidth();
				}
			}
		}
	
		this.GenerateCss();
	}
}


/**
 * Calculates the desired with of the list. The user may specify % or px, and
 * we always want it in px.
 * @private
 */
nitobi.combo.List.prototype.GetDesiredPixelWidth = function()
{
	var combo = this.GetCombo();
	var container = document.getElementById(combo.GetId());
	var containerWidth = nitobi.html.getWidth(container);
	var width = this.GetWidth();
	if (nitobi.Browser.GetMeasurementUnitType(width) == "%")
	{
		var w = (combo.GetWidth()==null?combo.GetTextBox().GetWidth():combo.GetWidth());
		var adjust = 1 / (parseInt(w)/100);
		var width = parseInt(width)/100;

		return(Math.floor(containerWidth * adjust * width - 2)+"px");
	}
	else
	{
		return width;
	}
}


/**
 * Returns the rendered width of the List.
 * @type Number
 */
nitobi.combo.List.prototype.GetActualPixelWidth = function()
{
	var tag = this.GetHTMLTagObject();
	if (null == tag)
	{
		return this.GetDesiredPixelWidth();
	}
	else
	{
		return nitobi.Browser.GetElementWidth(tag);
	}
}

/**
 * Returns the name of a custom CSS class to associate with the entire list.
 * If this is left as an empty string, then the 'ComboBoxList' class is used.  Refer to the CSS file
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @type String
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetCSSClassName
 */
nitobi.combo.List.prototype.GetCSSClassName = function()
{
	return (null == this.m_HTMLTagObject ? this.m_CSSClassName : this.GetHTMLTagObject().className);
}

/**
 * Sets the name of a custom CSS class to associate with the entire list. 
 * If this is left as an empty string, then the 'ComboBoxList' class is used.  Refer to the CSS file
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @param {String} CSSClassName The CSS class to associate with the list.  Do not include the dot in the class name.
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 */
nitobi.combo.List.prototype.SetCSSClassName = function(CSSClassName)
{
	if(null==this.m_HTMLTagObject)
		this.m_CSSClassName = CSSClassName;
	else
		this.GetHTMLTagObject().className = CSSClassName;
}

/**
 * Get or set a section of the list. Valid list sections are:
 * EBAComboBoxListHeader, EBAComboBoxListBody, EBAComboBoxListBodyTable, EBAComboBoxListFooter.
 * @param {Number} Section The section.
 * @private
 */
nitobi.combo.List.prototype.GetSectionHTMLTagObject = function(Section)
{
	this.Render();
	// TODO: there was previously the following assert ... not sure why
	// Section != EBAComboBoxListBodyTable
	return this.m_SectionHTMLTagObjects[Section];
}

nitobi.combo.List.prototype.SetSectionHTMLTagObject = List_SetSectionHTMLTagObject;
/**
 * Get or set a section of the list. Valid list sections are:
 * EBAComboBoxListHeader, EBAComboBoxListBody, EBAComboBoxListBodyTable, EBAComboBoxListFooter.
 * @param {Number} Section The section.
 * @private
 */
function List_SetSectionHTMLTagObject(Section, SectionHTMLTagObject)
{
	this.m_SectionHTMLTagObjects[Section] = SectionHTMLTagObject;
}

/**
 * Returns the name of the class that defines the section styles.
 * When the list is rendered it is broken up into distinct sections.
 * The sections are: ComboBoxListHeader, ComboBoxListBody, ComboBoxListFooter, 
 * and ComboBoxListBodyTable. Refer to the CSS file for details on these classes, 
 * and which CSS attributes you must supply to use a custom class.  You can
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @param {Number} Section The section name.  This is a constant integer, not a string. 
 * Valid section names are EBAComboBoxListHeader, EBAComboBoxListBody, EBAComboBoxListBodyTable, EBAComboBoxListFooter
 * @type String
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 */
nitobi.combo.List.prototype.GetSectionCSSClassName = function(Section)
{
	return (null == this.m_HTMLTagObject ? this.m_SectionCSSClassNames[Section] : this.GetSectionHTMLTagObject(Section).className);
}

/**
 * Sets the name of the class that defines the section styles.
 * When the list is rendered it is broken up into distinct sections. This function modifies how those sections are drawn.
 * If this function is not used, then the default classes are used. They are:
 * ComboBoxListHeader, ComboBoxListBody, ComboBoxListFooter, and ComboBoxListBodyTable. Refer to the CSS file
 * for details on these classes, and which CSS attributes you must supply to use a custom class.  You can
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @example
 * var list = nitobi.getComponent('myCombo').GetList();
 * list.SetSectionCSSClassName(EBAComboBoxListHeader, newHeaderCssClass);
 * @param {Number} Section The section name.  This is a constant integer, not a string. Valid section names are EBAComboBoxListHeader, EBAComboBoxListBody, EBAComboBoxListBodyTable, EBAComboBoxListFooter
 * @param {String} SectionCSSClassName The custom CSS class name for the section. Do not include the dot
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 */
nitobi.combo.List.prototype.SetSectionCSSClassName = function(Section, SectionCSSClassName)
{
	if(null==this.m_HTMLTagObject)
		this.m_SectionCSSClassNames[Section]=SectionCSSClassName;
	else
		this.GetSectionHTMLTagObject(Section).className = SectionCSSClassName;
}

/**
 * Returns the height of one of the list sections.
 * When the list is rendered it is broken up into distinct sections.
 * The sections are: ComboBoxListHeader, ComboBoxListBody, ComboBoxListFooter, 
 * and ComboBoxListBodyTable.  For certain modes, not all sections of the list
 * will be drawn (e.g. no header or footer in smartsearch mode).  In these
 * cases where the section doesn't exist, null will be returned.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * if (list.GetSectionHeight(EBAComboBoxList) == list.GetActualHeight())
 * {
 * 	alert('They are the same!');
 * }
 * @param {Number} Section The section name.  This is a constant integer, not a string. 
 * Valid section names are EBAComboBoxListHeader, EBAComboBoxListBody, 
 * EBAComboBoxListBodyTable, EBAComboBoxListFooter
 * @type Number
 * @see #SetSectionHeight
 * @see #SetSectionCSSClassName
 */ 
nitobi.combo.List.prototype.GetSectionHeight = function(Section)
{
	if (this.m_HTMLTagObject == null)
	{
		return parseInt(this.m_SectionHeights[Section]);
	}
	else
	{
		// The list has display set to none so we can't get the dimensions
		// of any list section unless we change that.
		var estyle = this.m_HTMLTagObject.style;
		var top = estyle.top;
		var display = estyle.display;
		var position = estyle.position;
		var visibility = estyle.visibility;
		if (estyle.display=="none" || estyle.visibility!="visible")
		{
			estyle.position = "absolute";
			estyle.top = "-1000px";
			estyle.display="inline";
		}
		var height = null;
		if (this.m_SectionHTMLTagObjects[Section] != null)
		{
			height = nitobi.html.getHeight(this.m_SectionHTMLTagObjects[Section]);
		}
		
		if (estyle.display=="inline")
		{
			estyle.position = position;
			estyle.display=display;	
			estyle.top = top;
		}
		return height;
	}
}

/**
 * Sets the height of one of the list sections.
 * When the list is rendered it is broken up into distinct sections:  Header, Body, Table, Footer.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * list.SetSectionHeight(EBAComboBoxListBody, parseInt("400px"));
 * @param {Number} Section The section name.  This is a constant integer, not a string. Valid section names are EBAComboBoxListHeader, EBAComboBoxListBody, EBAComboBoxListBodyTable, EBAComboBoxListFooter
 * @param {Number} SectionHeight The height of the section
 * @see #GetSectionHeight
 * @see #SetSectionCSSClassName
 */
nitobi.combo.List.prototype.SetSectionHeight = function(Section, SectionHeight)
{
	if(null==this.m_HTMLTagObject)
		this.m_SectionHeights[Section] = SectionHeight;
	else
		this.GetSectionHTMLTagObject(Section).style.height=SectionHeight;
}

/**
 * Returns the index of the selected row number.
 * This is equivalent to {@link nitobi.combo.Combo#GetSelectedRowIndex}.  The index of the selected row is set when the user 
 * makes a selection from the list.
 * If no selection is made or the user types a custom value in the textbox, then this value is -1. The selected
 * row index also corresponds to the same index of the selected values row in the XmlDataSource. Note: when 
 * a row is selected, this is only one of two properties set, SelectedRowIndex, and SelectedRowValues. To set a 
 * selected row manually, use {@link #SetSelectedRow}. 
 * @type Number
 */
nitobi.combo.List.prototype.GetSelectedRowIndex = function()
{
	if(null==this.m_HTMLTagObject)
		return parseInt(this.m_SelectedRowIndex);
	else
		return parseInt(document.getElementById(this.GetCombo().GetId() + "SelectedRowIndex").value);
}

/**
 * The index of the selected row is set when the user makes a selection from the list.
 * If no selection is made or the user types a custom value in the textbox, then this value is -1. The selected
 * row index also corresponds to the same index of the selected values row in the XmlDataSource. Note: when 
 * a row is selected, this is only one of two properties set, SelectedRowIndex, and SelectedRowValues. To set a 
 * selected row manually, use List.SetSelectedRow.
 * @param {Number} SelectedRowIndex The index of the selected row. Indexed from 0. -1 if no row is selected.
 * @private
 */
nitobi.combo.List.prototype.SetSelectedRowIndex = function(SelectedRowIndex)
{
	if(null==this.m_HTMLTagObject)
		this.m_SelectedRowIndex = SelectedRowIndex;
	else
		document.getElementById(this.GetCombo().GetId() + "SelectedRowIndex").value = SelectedRowIndex;
}

/**
 * Returns true if paging is allowed, false otherwise.
 * Only classic mode supports paging.  If you enable paging, the gethandler attached to the 
 * datasource must be setup to deliver data one page at a time. See the tutorials for detailed information.
 * @type Boolean
 * @see #GetPageSize
 * @see #SetAllowPaging
 */ 
nitobi.combo.List.prototype.GetAllowPaging = function()
{
	return this.m_AllowPaging;
}

/**
 * Sets whether or not paging is allowed.  If set to true, the list draws a paging button that lets the user retrieve one page of data at a time. 
 * You must also set PageSize if you want to use this feature.
 * Only classic mode supports paging.  If you enable paging, the gethandler attached to the 
 * datasource must be setup to deliver data one page at a time. See the tutorials for detailed information.
 * @param {Boolean} AllowPaging If set to true, the list draws a paging button that lets the user retrieve one page of data at a time. 
 * You must also set PageSize if you want to use this feature.
 * @see #SetPageSize
 * @see #GetAllowPaging
 */
nitobi.combo.List.prototype.SetAllowPaging = function(AllowPaging)
{
	if (this.m_HTMLTagObject != null)
	{
		if (AllowPaging)
		{
			this.ShowFooter();
		}
		else
		{
			this.HideFooter();
		}
	}
	this.m_AllowPaging = AllowPaging;
}

/**
 * Returns true if fuzzy search is enabled, false otherwise
 * When the combo requests data from the server with a search substring, the search type
 * depends on the mode. Smartsearch and smartlist modes perform substring matching, while other 
 * modes perform prefix matching.  When the data returns to the client, the combo
 * performs a local search in order to highlight search strings, and select the correct default row. 
 * If it cannot match the string on the client-side and FuzzySearch is not enabled, then the behaviour
 * is unpredictable.  If FuzzySearch is enabled, then no client side matching is attempted, then
 * combo simply displays the search results.
 * @type Boolean
 * @see #SetFuzzySearchEnabled
 */
nitobi.combo.List.prototype.IsFuzzySearchEnabled = function()
{
	return this.m_FuzzySearchEnabled;
}

/**
 * Sets whether or not to allow fuzzy searching.  If set to true, the get handler can return anything from a search result, even if it does not match
 * the search type for the mode.
 * When the combo requests data from the server with a search substring, the search type
 * depends on the mode. Smartsearch and smartlist modes perform substring matching, while other 
 * modes perform prefix matching.  When the data returns to the client, the combo
 * performs a local search in order to highlight search strings, and select the correct default row. 
 * If it cannot match the string on the client-side and FuzzySearch is not enabled, then the behaviour
 * is unpredictable.  If FuzzySearch is enabled, then no client side matching is attempted, then
 * combo simply displays the search results.
 * @param {Boolean} FuzzySearchEnabled true in order to enable a fuzzy search and false otherwise
 * @see #GetFuzzySearchEnabled
 */
nitobi.combo.List.prototype.SetFuzzySearchEnabled = function(FuzzySearchEnabled)
{
	this.m_FuzzySearchEnabled = FuzzySearchEnabled;
}

/**
 * Returns the number of records retrieved at a time from the server.
 * If clipping is turned on (according to the mode used),
 * then the value returned may not actually correspond with the displayed pagesize
 * because the record set that is returned from the server is clipped according 
 * to the clip length.
 * <pre class="code">
 * &lt;ntb:ComboList Width="370px" Height="205px" DatasourceUrl="get.asp" PageSize="11" ClipLength="5"&gt;
 * </pre>
 * <p>
 * consider the following:
 * </p>
 * <pre class="code">
 * var list = nitobi.getComponent('combo1').GetList();
 * list.GetPageSize();  // Will be 11
 * </pre>
 * @type Number
 * @see #SetClipLength
 * @see #SetPageSize
 * @see #GetAllowPaging
 */
nitobi.combo.List.prototype.GetPageSize = function()
{
	return this.m_PageSize;
}

/**
 * Sets the number of records retrieved at a time from the server.
 * Only used if AllowPaging is set to true.  If clipping is turned on (according to the mode used),
 * then the record set that is returned from the server is clipped according to the clip length. 
 * @param {Number} PageSize The number of records returned at one time from the server
 * @see #SetClipLength
 * @see #GetPageSize
 * @see #SetAllowPaging
 */
nitobi.combo.List.prototype.SetPageSize = function(PageSize)
{
	this.m_PageSize = PageSize;
}

/** 
 * The number of pages currently loaded.
 * @type Number
 * @private
 */
nitobi.combo.List.prototype.GetNumPagesLoaded = function()
{
	return this.m_NumPagesLoaded;
}

/**
 * The number of pages currently loaded.
 * @param {Number} NumPagesLoaded The value of the property you want to set.
 * @private
 */
nitobi.combo.List.prototype.SetNumPagesLoaded = function(NumPagesLoaded)
{
	this.m_NumPagesLoaded = NumPagesLoaded;
}

/**
 * Returns the row that is currently active.
 * @type HTMLNode
 * @private
 */
nitobi.combo.List.prototype.GetActiveRow = function()
{
	return this.m_ActiveRow;
}

/**
 * The row that is currently active.
 * @type HTMLNode
 * @private
 */
nitobi.combo.List.prototype.SetActiveRow = function(ActiveRow)
{
	var containerTable;
	if(null != this.m_ActiveRow){
		containerTable = document.getElementById("ContainingTableFor"+this.m_ActiveRow.id);
		if(this.m_UseHighlightClass)
			containerTable.className = this.m_OriginalRowClass;
		else{
			containerTable.style.backgroundColor = this.m_OriginalBackgroundHighlightColor;
			containerTable.style.color = this.m_OriginalForegroundHighlightColor;

		}
		var colDefs = this.GetListColumnDefinitions();
		for(var i=0,n=colDefs.length;i<n;i++){
			var containerSpan = document.getElementById("ContainingSpanFor"+this.m_ActiveRow.id+"_"+i);
			if(containerSpan!=null){
				containerSpan.style.color=containerSpan.savedColor;
				containerSpan.style.backgroundColor=containerSpan.savedBackgroundColor;
			}
		}
	}
	this.m_ActiveRow = ActiveRow;
	if(null != ActiveRow)
	{
		// In compact mode, we set the selectedrow values all the time.
		// This is becuase there is no list for the user to make a
		// selection. This may not be the best place to do this,
		// but onblur doesn't fire if you immediately click the submit button.
		if ("compact" == this.GetCombo().mode && ActiveRow != null)
		{
				var rowNum = this.GetRowIndex(ActiveRow);
				this.SetSelectedRow(rowNum);
		}

		containerTable = document.getElementById("ContainingTableFor"+ActiveRow.id);
		containerSpan = document.getElementById("ContainingSpanFor"+this.m_ActiveRow.id);

		if(this.m_UseHighlightClass){
			this.m_OriginalRowClass = containerTable.className;
			containerTable.className = this.GetHighlightCSSClassName();
		}else{
			this.m_OriginalBackgroundHighlightColor = containerTable.style.backgroundColor;
			this.m_OriginalForegroundHighlightColor = containerTable.style.color;
			containerTable.style.backgroundColor = this.m_BackgroundHighlightColor;
			containerTable.style.color = this.m_ForegroundHighlightColor;
		}
		var colDefs = this.GetListColumnDefinitions();
		for(var i=0,n=colDefs.length;i<n;i++){
			var containerSpan = document.getElementById("ContainingSpanFor"+this.m_ActiveRow.id+"_"+i);
			if(containerSpan!=null){
				containerSpan.savedColor=containerSpan.style.color;
				containerSpan.savedBackgroundColor=containerSpan.style.backgroundColor;
				containerSpan.style.color=containerTable.style.color;
				containerSpan.style.backgroundColor=containerTable.style.backgroundColor;
			}
		}
	}
}

/**
 * The values the user selects when they click a row.
 * @type Array
 * @private
 */
nitobi.combo.List.prototype.GetSelectedRowValues = function()
{
	var rowValues = new Array;
	for (var i=0; i < this.GetXmlDataSource().GetNumberColumns(); i++)
		rowValues[i] = document.getElementById(this.GetCombo().GetId() + "SelectedValue" + i).value;
	return rowValues;
}

/** 
 * The values the user selects when they click a row.
 * @param {HTMLNode} [Row] The row object. Values will be extracted from here.
 * @private
 */
nitobi.combo.List.prototype.SetSelectedRowValues = function(SelectedRowValues, Row)
{
	this.m_SelectedRowValues = SelectedRowValues;
	var comboId = this.GetCombo().GetId();
	var numCols = this.GetXmlDataSource().GetNumberColumns();
	if ((null==SelectedRowValues) && (null==Row)){
		// Empty the values.
		for(var i=0;i<numCols;i++)
			document.getElementById(comboId + "SelectedValue" + i).value="";
	}else{
		if (null==Row){
			// Argument is an array. Populate hidden fields.
			for(var i=0;i<numCols;i++)
				document.getElementById(comboId + "SelectedValue" + i).value=SelectedRowValues[i];
		}else{
			// Argument is a row object.
			var uniqueId = this.GetCombo().GetUniqueId();
			// Get the row number.
			var rowNum = this.GetRowIndex(Row);
			// Get the values from the datasource and call this function again.
			var values = this.GetXmlDataSource().GetRow(rowNum);
			this.SetSelectedRowValues(values, null);
		}
	}
}

/**
 * Enables searching the database. If searching the local cache fails, the server is asked to get the records the user is looking for.
 * @type Boolean
 * @private
 */
nitobi.combo.List.prototype.GetEnableDatabaseSearch = function()
{
	return this.m_EnableDatabaseSearch;
}

/**
 * Sets whether or not to search the database.  If searching the local cache fails, the server
 * is asked to get the records the user is looking for.
 * @param {Boolean} EnableDatabaseSearch true if you want to enabled database searching, false otherwise
 * @deprecated enabledatabasesearch is no longer a valid attribute on ComboBox
 */
nitobi.combo.List.prototype.SetEnableDatabaseSearch = function(EnableDatabaseSearch)
{
	this.m_EnableDatabaseSearch = EnableDatabaseSearch;
}

/**
 * Returns the HTML in the footer.
 * @private
 */
nitobi.combo.List.prototype.GetFooterText = function()
{
	if(null==this.m_HTMLTagObject)
		return this.m_FooterText;
	else{
		var footerButton = document.getElementById("EBAComboBoxListFooterPageNextButton" + this.GetCombo().GetUniqueId());
		return (null!=footerButton ? footerButton.innerHTML : "");
	}
}

/**
 * Sets the HTML in the footer
 * @param {String} FooterText The HTML in the footer
 * @private
 */
nitobi.combo.List.prototype.SetFooterText = function(FooterText)
{
	if(null==this.m_HTMLTagObject)
		this.m_FooterText = FooterText;
	else{
		var footerButton = this.GetSectionHTMLTagObject(EBAComboBoxListFooter);
		if(null!=footerButton){
			footerButton = document.getElementById("EBAComboBoxListFooterPageNextButton" + this.GetCombo().GetUniqueId());
			if(null!=footerButton)
				footerButton.innerHTML=FooterText;
		}
	}
}

/**
 * Indicates what the status is for the wait on the db lookup. The Search function
 * will only do a lookup until after the user has paused typing. Valid values for
 * this property are: EBADatabaseSearchTimeoutStatus_WAIT,
 * EBADatabaseSearchTimeoutStatus_EXPIRED,
 * EBADatabaseSearchTimeoutStatus_NONE.
 * @type Number
 * @private
 */
nitobi.combo.List.prototype.GetDatabaseSearchTimeoutStatus = function()
{
	return this.m_DatabaseSearchTimeoutStatus;
}

/**
 * Indicates what the status is for the wait on the db lookup. The Search function
 * will only do a lookup until after the user has paused typing. Valid values for
 * this property are: EBADatabaseSearchTimeoutStatus_WAIT,
 * EBADatabaseSearchTimeoutStatus_EXPIRED,
 * EBADatabaseSearchTimeoutStatus_NONE.
 * @param {Number} DatabaseSearchTimeoutStatus The value of the property you want to set.
 * @private
 */
nitobi.combo.List.prototype.SetDatabaseSearchTimeoutStatus = function(DatabaseSearchTimeoutStatus)
{
	this.m_DatabaseSearchTimeoutStatus = DatabaseSearchTimeoutStatus;
}

/**
 * The id returned by window.setTimeout.
 * @type String
 * @private
 */
nitobi.combo.List.prototype.GetDatabaseSearchTimeoutId = function()
{
	return this.m_DatabaseSearchTimeoutId;
}

/**
 * The id returned by window.setTimeout.
 * @param {String} DatabaseSearchTimeoutId The value of the property you want to set.
 * @private
 */
nitobi.combo.List.prototype.SetDatabaseSearchTimeoutId = function(DatabaseSearchTimeoutId)
{
		this.m_DatabaseSearchTimeoutId = DatabaseSearchTimeoutId;
}

/**
 * Returns the height of the list body. This must be an HTML measurement, e.g., 100px.
 * The list body is the list excluding headers and footers.  This is equivalent to GetSectionHeight(EBAComboBoxListBody); 
 * To get the height of the entire list use GetActualPixelHeight.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * var bodyHeight = list.GetHeight();  // A string like "205px"
 * var listHeight = list.GetActualPixelHeight();  // A number like 250
 * if (parseInt(bodyHeight) != listHeight)
 * {
 * 	alert('They are not equal!');
 * }
 * @type String
 * @see #GetSectionHeight
 * @see #SetHeight
 * @see #GetActualPixelHeight
 */
nitobi.combo.List.prototype.GetHeight = function()
{
	return this.GetSectionHeight(EBAComboBoxListBody);
}

/**
 * Sets the height of the list body. This must be an HTML measurement, e.g., 100px.
 * The list body is the list excluding headers and footers.  This is equivalent to GetSectionHeight(EBAComboBoxListBody); 
 * To get the height of the entire list use GetActualPixelHeight.
 * @param {String} Height The height of the list body in HTML units.
 * @see #SetSectionHeight
 * @see #GetHeight
 */
nitobi.combo.List.prototype.SetHeight = function(Height)
{
	this.SetSectionHeight(EBAComboBoxListBody, parseInt(Height));
}

/**
 * Returns the combined heights of the list's header, body, and footer.
 * @type Number
 */
nitobi.combo.List.prototype.GetActualHeight = function()
{
	var uid = this.GetCombo().GetUniqueId();
	var tag = this.GetHTMLTagObject();
	var height = nitobi.Browser.GetElementHeight(tag);

	return height;
}

/**
 * Returns the combined heights of the list's header, body, and footer.
 * @type Number
 * @private
 */
nitobi.combo.List.prototype.GetActualPixelHeight = nitobi.combo.List.prototype.GetActualHeight;

/**
 * Returns the HTML color that the background of a row changes to when highlighted, e.g., #FFFFFF or red, etc.
 * You can also use HighlightCSSClassName for more control but setting only the color yields better performance.  The default is 'highlight'.
 * @type String
 * @see #GetHighlightCSSClassName
 * @see #SetBackgroundHighlightColor
 * @see #SetForegroundHighlightColor
 */
nitobi.combo.List.prototype.GetBackgroundHighlightColor = function()
{
	return this.m_BackgroundHighlightColor;
}

/**
 * Sets the HTML color that the background of a row changes to when highlighted, e.g., #FFFFFF or red, etc.
 * You can also use HighlightCSSClassName for more control but setting only the color yields better performance.  The default is 'highlight'.
 * @param {String} BackgroundHighlightColor An HTML color
 * @see #SetHighlightCSSClassName
 * @see #GetBackgroundHighlightColor
 * @see #GetForegroundHighlightColor
 */
nitobi.combo.List.prototype.SetBackgroundHighlightColor = function(BackgroundHighlightColor)
{
	this.m_BackgroundHighlightColor = BackgroundHighlightColor;
}

/**
 * Returns the HTML color that the foreground (text) of a row changes to when highlighted, e.g., #FFFFFF or red, etc.
 * You can also use HighlightCSSClassName for more control but setting only the color yields better performance.  The default is 'highlight'.
 * @type String
 * @see #GetHighlightCSSClassName
 * @see #SetBackgroundHighlightColor
 * @see #SetForegroundHighlightColor
 */
nitobi.combo.List.prototype.GetForegroundHighlightColor = function()
{
	return this.m_ForegroundHighlightColor;
}

/**
 * Sets the HTML color that the foreground (text) of a row changes to when highlighted, e.g., #FFFFFF or red, etc.
 * You can also use HighlightCSSClassName for more control but setting only the color yields better performance.  The default is 'highlight'.
 * @param {String} ForegroundHighlightColor An HTML color
 * @see #SetHighlightCSSClassName
 * @see #GetBackgroundHighlightColor
 * @see #GetForegroundHighlightColor
 */
nitobi.combo.List.prototype.SetForegroundHighlightColor = function(ForegroundHighlightColor)
{
	this.m_ForegroundHighlightColor = ForegroundHighlightColor;
}

/**
 * Returns the URL to a page that returns data from a datasource. 
 * This is used for populating the ComboBox as well as for paging and lookup.  When the combo requires a page of data, it calls this URL and gives
 * it the following arguments:
 * <ul>
 * <li>StartingRecordIndex - The next record in the data subset that the combo wants.</li>
 * <li>PageSize - Size of the page.</li>
 * <li>SearchSubstring - [Optional] The string the user is looking for.</li>
 * <li>ComboId - The Id of the combo making the request.</li>
 * <li>LastString - The last string searched for.</li></ul>
 * You can use this in conjunction with List.GetPage to add records to the combo.
 * @type String
 * @see #GetPageSize
 * @see #GetPage
 * @see #GetAllowPaging
 * @see #SetDatasourceUrl
 */
nitobi.combo.List.prototype.GetDatasourceUrl = function()
{
	return this.m_DatasourceUrl;
}

/**
 * Sets the URL to a page that returns data from a datasource. 
 * This is used for populating the ComboBox as well as for paging and lookup.  When the combo requires a page of data, it calls this URL and gives
 * it the following arguments:
 * <ul>
 * <li>StartingRecordIndex - The next record in the data subset that the combo wants.</li>
 * <li>PageSize - Size of the page.</li>
 * <li>SearchSubstring - [Optional] The string the user is looking for.</li>
 * <li>ComboId - The Id of the combo making the request.</li>
 * <li>LastString - The last string searched for.</li></ul>
 * You can use this in conjunction with List.GetPage to add records to the combo.
 * <p>
 * <b>Example</b>:  Adding query string parameters to the List's DatasourceUrl
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction addParam(param, value)
 * {
 * 	var list = nitobi.getComponent('combo1').GetList();
 * 	var currentDatasourceUrl = list.GetDatasourceUrl();
 * 	list.SetDatasourceUrl(currentDatasourceUrl + "?" + param + "=" + value);
 * }
 * </code></pre>
 * </div>
 * @param {String} DatasourceUrl The URL that returns data to the ComboBox
 * @see #SetPageSize
 * @see #GetPage
 * @see #SetAllowPaging
 * @see #GetDatasourceUrl
 */
nitobi.combo.List.prototype.SetDatasourceUrl = function(DatasourceUrl)
{
	this.m_DatasourceUrl = DatasourceUrl;
}

/**
 * Returns the javascript that is run when the list is hidden.
 * You can set this property to be any valid javascript.
 * Set this property to return the 'this' pointer for the list object, for example, in the 
 * Combo html tag you can set it to: <code>OnHideEvent="MyFunction(this)"</code>.  'this' will refer to the
 * list object. You can then use this.GetCombo() to get the Combo object.
 * @type String
 * @see #SetOnHideEvent
 * @see #GetOnShowEvent
 * @see #GetCombo
 */
nitobi.combo.List.prototype.GetOnHideEvent = function()
{
	return this.m_OnHideEvent;
}

/**
 * Sets the javascript that is run when the list is hidden.
 * You can set this property to be any valid javascript.
 * Set this property to return the 'this' pointer for the list object, for example, in the 
 * Combo html tag you can set it to: <code>OnHideEvent="MyFunction(this)"</code>.  'this' will refer to the
 * list object. You can then use this.GetCombo() to get the Combo object.
 * @param {String} OnHideEvent Valid javascript that runs when the OnHideEvent fires.
 * @see #GetOnHideEvent
 * @see #GetCombo
 * @see #SetOnShowEvent
 */
nitobi.combo.List.prototype.SetOnHideEvent = function(OnHideEvent)
{
	this.m_OnHideEvent = OnHideEvent;
}

/**
 * Returns the javascript that is run when the list is shown.
 * This function is called when the list is shown. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnShowEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @type String
 * @see #GetOnHideEvent
 * @see #GetCombo
 * @see #SetOnShowEvent
 */
nitobi.combo.List.prototype.GetOnShowEvent = function()
{
	return this.m_OnShowEvent;
}

/**
 * Sets the javascript that is run when the list is shown.
 * This function is called when the list is shown. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnShowEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @param {String} OnShowEvent Valid javascript that is run when the OnShowEvent fires
 * @see #SetOnHideEvent
 * @see #GetCombo
 * @see #GetOnShowEvent
 */
nitobi.combo.List.prototype.SetOnShowEvent = function(OnShowEvent)
{
	this.m_OnShowEvent = OnShowEvent;
}

/**
 * Returns the javascript that is run just before the combo makes a search.
 * This function is called just before the combo makes a search. This is usually triggered by
 * the user typing something in the textbox.  The combo first searches it's local cache
 * (the XmlDataSource object) and if no hit is made there it searches the server. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnBeforeSearchEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @type String
 * @see #GetOnAfterSearchEvent
 * @see #SetOnBeforeSearchEvent
 * @see #GetCombo
 */
nitobi.combo.List.prototype.GetOnBeforeSearchEvent = function()
{
	return this.m_OnBeforeSearchEvent;
}

/**
 * Sets the javascript that is run just before the combo makes a search.
 * This function is called just before the combo makes a search. This is usually triggered by
 * the user typing something in the textbox.  The combo first searches it's local cache
 * (the XmlDataSource object) and if no hit is made there it searches the server. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnBeforeSearchEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @param {String} OnBeforeSearchEvent Valid javascript that is run just before the search if performed
 * @see #GetOnAfterSearchEvent
 * @see #GetOnBeforeSearchEvent
 * @see #GetCombo
 */
nitobi.combo.List.prototype.SetOnBeforeSearchEvent = function(OnBeforeSearchEvent)
{
	this.m_OnBeforeSearchEvent = OnBeforeSearchEvent;
}

/**
 * Returns the javascript that is run after the combo makes a search.
 * This function is called after the combo makes a search. This is usually triggered by
 * the user typing something in the textbox.  The combo first searches it's local cache
 * (the XmlDataSource object) and if no hit is made there it searches the server. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnAfterSearchEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @type String
 * @see #SetOnAfterSearchEvent
 * @see #GetOnBeforeSearchEvent
 * @see #GetCombo
 */
nitobi.combo.List.prototype.GetOnAfterSearchEvent = function()
{
	return this.m_OnAfterSearchEvent;
}

/**
 * Sets the javascript that is run after the combo makes a search.
 * This function is called after the combo makes a search. This is usually triggered by
 * the user typing something in the textbox.  The combo first searches it's local cache
 * (the XmlDataSource object) and if no hit is made there it searches the server. You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the list object, for example, in the 
 * List html tag you can set it to: <code>OnAfterSearchEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * list object. You can then use List.GetCombo to retrieve a handle to the combo object.
 * @param {String} OnAfterSearchEvent Valid javascript that is run after the search if performed
 * @see #GetOnAfterSearchEvent
 * @see #SetOnBeforeSearchEvent
 * @see #GetCombo
 */
nitobi.combo.List.prototype.SetOnAfterSearchEvent = function(OnAfterSearchEvent)
{
	this.m_OnAfterSearchEvent = OnAfterSearchEvent;
}

/**
 * @private
 */
nitobi.combo.List.prototype.GetOffsetX = function()
{
	return this.m_OffsetX;
}

/**
 * @private
 */
nitobi.combo.List.prototype.SetOffsetX = function(OffsetX)
{
	this.m_OffsetX = parseInt(OffsetX);
}

/**
 * @private
 */
nitobi.combo.List.prototype.GetOffsetY = function()
{
	return this.m_OffsetY;
}

/**
 * @private
 */
nitobi.combo.List.prototype.SetOffsetY = function(OffsetY)
{
	this.m_OffsetY = parseInt(OffsetY);
}

/**
 * @private
 */
nitobi.combo.List.prototype.AdjustSize = function()
{
	var list = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
	var tag = this.GetHTMLTagObject();
	var listStyle = tag.style;
	var listWidth = "";
	// Check for (vertical) scrollbar and adjust width if its present.
	if (true == nitobi.Browser.GetVerticalScrollBarStatus(list))
	{
		if (nitobi.Browser.GetMeasurementUnitType(this.GetWidth()) != "%")
		{
			// TODO: Why are there two lines here?
			// TODO: Why is this being assigned to a global?
			listWidth = parseInt(this.GetWidth()) + nitobi.html.getScrollBarWidth(list)  - (nitobi.browser.MOZ ? EBADefaultScrollbarSize : 0);
			listWidth = this.GetDesiredPixelWidth();
		}
		else
		{
			listWidth = this.GetDesiredPixelWidth();
		}
		
		list.style.width = listWidth;
		var header = this.GetSectionHTMLTagObject(EBAComboBoxListHeader);
		var footer = this.GetSectionHTMLTagObject(EBAComboBoxListFooter);
		if (header != null) header.style.width = listWidth;
		if (footer != null) footer.style.width = listWidth;

		// NOTE: all of the above works and is necessary (or else the vertical
		// bar being present will force the presence of the horizontal bar
		// whether or not it is necessary);
		// - however, some points should be explained:
		// - EBAComboBoxList.style.overflow:visible must be set (or no overflow can be set
		// as overflow defaults to visible)
		// - this permits EBAComboBoxList to grow as its header, body, footer grows
		// - the problem is that EBAComboBoxList "should" grow forever as Show() is
		// called over and over - when looking at the above code initially
		// - this does NOT (which is the correct behavior) happen because of the following:
		// - this.GetWidth() depends on m_HTMLObjectTag.style.width (m_HTMLTagObject is EBAComboBoxList)
		// - even though EBAComboBoxList grows (because of style:visible), its style.width
		// does NOT grow (EBAComboBoxList's width adjusts but we're not changing its style.width)
		// - so, the next time Show() is called, GetWidth() returns the same value and
		// the whole container only grows by the width of the scrollbar if necessary
		// - so, the forever growing problem is nonexistent and everything works

		listStyle.width=(listWidth);
		if (nitobi.browser.IE)
		{
			var iframeStyle=nitobi.combo.iframeBacker.style;
			iframeStyle.width=listStyle.width;
		}
	}

	if (nitobi.browser.IE)
	{
		var iframeStyle=nitobi.combo.iframeBacker.style;
		iframeStyle.height=listStyle.height;
	}
}

/**
 * @private
 */
nitobi.combo.List.prototype.IsVisible = function()
{
	if (!this.m_Rendered)
	{
		return false;
	}
	var tag = this.GetHTMLTagObject();
	var listStyle = tag.style;
	return(listStyle.visibility=="visible");
}

/**
 * Shows the list.
 * If the list is hidden when this is called, then the OnShowEvent is triggered.
 * @example
 * &lt;a href='javascript:nitobi.getComponent('combo1').GetList().Show()'&gt;Show the list&lt;/a&gt;
 * </code></pre>

 * @see #SetOnShowEvent
 * @see #SetX
 * @see #SetY
 * @see #SetFrameX
 * @see #SetFrameY
 */
nitobi.combo.List.prototype.Show = function()
{
	var combo = this.GetCombo();
	var mode = combo.mode;

	this.Render();
	
	if(!this.m_HTMLTagObject || this.IsVisible() || mode=="compact" || this.GetXmlDataSource().GetNumberRows()==0 || ((mode!="default" && mode!="unbound") && combo.GetTextBox().m_HTMLTagObject.value==""))
	{
		// in case user click button, which calls this function before List has initialized fully
		// also, no need to show if list is already shown

		return;
	}

	var tag = this.GetHTMLTagObject();
	var textbox=combo.GetTextBox().GetHTMLContainerObject();
	var listStyle = tag.style;
	

	// TODO: What is this for exactly?
	// We can't call #AdjustSize until the list is visible because in 
	// #GenerateCss, we try to get the list's offsetWidth which is 0 if the 
	// list is not visible.
	//this.AdjustSize();
	
	var textboxHeight = nitobi.html.getHeight(textbox);

	var top = nitobi.html.getCoords(textbox).y + textboxHeight;
	var left = nitobi.html.getCoords(textbox).x;
	
	var height = parseInt(this.GetActualPixelHeight()); 
	var width = parseInt(this.GetActualPixelWidth()); 
	
	listStyle.top = top + "px"; 
	listStyle.left = left + "px";
	listStyle.zIndex = combo.m_ListZIndex;		
	var windowWidth = nitobi.html.getBodyArea().clientWidth;
	var windowHeight = nitobi.html.getBodyArea().clientHeight;   		
	var docScrollTop = (document.body.scrollTop=="" || parseInt(document.documentElement.scrollTop==0) ? 0 : parseInt(document.body.scrollTop));
	var docScrollLeft = (document.body.scrollLeft=="" || parseInt(document.documentElement.scrollLeft==0) ? 0 : parseInt(document.body.scrollLeft));
	
	// Put the list on top if it can't fit on the bottom.
	if (parseInt(top) - docScrollTop + height > windowHeight)
	{
		var newTop = parseInt(listStyle.top) -  height - textboxHeight;
		if (newTop >= 0) 
		{
			listStyle.top = newTop + "px";
		}
	}
	
	// Move the list left if it doesn't fit on the right.
	if (parseInt(left)-parseInt(docScrollLeft) + width > windowWidth)
	{
		var container = document.getElementById(combo.GetId());
		var containerWidth = nitobi.html.getWidth(container);
		
		if (width > containerWidth)
		{
			var delta = width - containerWidth;	
			var newLeft = left - delta; 
			if (newLeft >= 0) 
			{
				listStyle.left = newLeft + "px";
			}
		}
		
	}
	
	listStyle.position = "absolute";
	listStyle.display="inline";
	this.AdjustSize();
	this.GenerateCss();
	listStyle.visibility="visible";
	
	this.SetIFrameDimensions();
	this.ShowIFrame();
	// TODO: Convert this to use our toolkit event code
	eval(this.GetOnShowEvent());
}

/**
 * Set the X coordinate of the list.
 * You can use this in the OnShowEvent.  The Show method always tries to position
 * the list correctly under the list. However, due to bugs in both IE and Firefox, and depending on 
 * the HTML structure of you page, the x,y coordinates of the textbox are not always reported
 * correctly by browsers. This method enables you to move the list if you find it positioned incorrectly.
 * In IE, due to the fact that listboxes have a greater zindex than any other control, an empty
 * iframe is positioned behind the list. This prevents listboxes from showing through the
 * list.  You will also need to position this element correctly in IE.
 * @param {String} x The X coordinate of the list
 * @see #SetOnShowEvent
 * @see #SetY
 * @see #SetFrameX
 * @see #SetFrameY
 * @see #GetFrame
 * @private
 */
nitobi.combo.List.prototype.SetX = function(x)
{
	var tag = this.GetHTMLTagObject();
	tag.style.left = x;
}

/**
 * Returns the X position of the list
 * @type Number
 */
nitobi.combo.List.prototype.GetX = function()
{
	var combo = this.GetCombo();
	var coords = nitobi.html.getCoords(combo.GetHTMLTagObject());
	return coords.x;
}

/**
 * Set the Y coordinate of the list.
 * You can use this in the OnShowEvent.  The Show method always tries to position
 * the list correctly under the list. However, due to bugs in both IE and Firefox, and depending on 
 * the HTML structure of you page, the x,y coordinates of the textbox are not always reported
 * correctly by browsers. This method enables you to move the list if you find it positioned incorrectly.
 * In IE, due to the fact that listboxes have a greater zindex than any other control, an empty
 * iframe is positioned behind the list. This prevents listboxes from showing through the
 * list.  You will also need to position this element correctly in IE.
 * @param {String} y The Y coordinate of the list
 * @see #SetOnShowEvent
 * @see #SetX
 * @see #GetY
 * @see #SetFrameX
 * @see #GetFrame
 * @private
 */
nitobi.combo.List.prototype.SetY = function(y)
{
	var tag = this.GetHTMLTagObject();
	tag.style.top = y;
}

/**
 * Returns the Y position of the list
 * @type Number
 */
nitobi.combo.List.prototype.GetY = function()
{
	var textbox = this.GetCombo().GetTextBox().GetHTMLContainerObject();
	var textboxHeight = nitobi.html.getHeight(textbox);
	var y = nitobi.html.getCoords(textbox).y + textboxHeight;
	return y;
}

/**
 * Set the X coordinate of the list's iframe. This has no effect in Mozilla.
 * You can use this in the OnShowEvent.  The Show method always tries to position
 * the list correctly under the list. However, due to bugs in both IE and Firefox, and depending on 
 * the HTML structure of you page, the x,y coordinates of the textbox are not always reported
 * correctly by browsers. This method enables you to move the list if you find it positioned incorrectly.
 * In IE, due to the fact that listboxes have a greater zindex than any other control, an empty
 * iframe is positioned behind the list. This prevents listboxes from showing through the
 * list.  You will also need to position this element correctly in IE.
 * @param {String} x The x coordinate of the list's iframe
 * @see #SetOnShowEvent
 * @see #SetX
 * @see #SetY
 * @see #SetFrameY
 * @see #GetFrame
 */
nitobi.combo.List.prototype.SetFrameX = function(x)
{
	if (nitobi.browser.IE)
	{
		nitobi.combo.iframeBacker.style.left = x;
	}
}

/**
 * Set the Y coordinate of the list's iframe. This has no effect in Mozilla.
 * You can use this in the OnShowEvent.  The Show method always tries to position
 * the list correctly under the list. However, due to bugs in both IE and Firefox, and depending on 
 * the HTML structure of you page, the x,y coordinates of the textbox are not always reported
 * correctly by browsers. This method enables you to move the list if you find it positioned incorrectly.
 * In IE, due to the fact that listboxes have a greater zindex than any other control, an empty
 * iframe is positioned behind the list. This prevents listboxes from showing through the
 * list.  You will also need to position this element correctly in IE.
 * @param {String} y The y coordinate of the list's iframe
 * @see #SetOnShowEvent
 * @see #SetX
 * @see #SetY
 * @see #SetFrameX
 * @see #GetFrame
 */
nitobi.combo.List.prototype.SetFrameY = function(y)
{
	if (nitobi.browser.IE)
	{
		nitobi.combo.iframeBacker.style.top = y;
	}
}

/**
 * Returns the list's iframe. This returns null in Mozilla.
 * In IE, due to the fact that listboxes have a greater zindex than any other control, an empty
 * iframe is positioned behind the list. This prevents listboxes from showing through the
 * list.  This gives you access to the only iframe (shared by all combos) on the page used
 * for this purpose.
 * @type HTMLElement
 * @see #SetOnShowEvent
 * @see #SetX
 * @see #SetY
 * @see #SetFrameX
 * @see #SetFrameY
 */
nitobi.combo.List.prototype.GetFrame = function()
{
	if (nitobi.browser.IE)
	{
		return nitobi.combo.iframeBacker;
	}
	else
	{
		return null;
	}
}

/**
 * @private
 */
nitobi.combo.List.prototype.ShowIFrame = function()
{
	if (nitobi.browser.IE)
	{
					
		var iframeStyle=nitobi.combo.iframeBacker.style;
		iframeStyle.visibility="visible";
	}
}

/**
 * @private
 */
nitobi.combo.List.prototype.SetIFrameDimensions = function()
{
	if (nitobi.browser.IE)
	{
		var tag = this.GetHTMLTagObject();
		var iframeStyle=nitobi.combo.iframeBacker.style;
		var listStyle = tag.style;
		iframeStyle.top= listStyle.top;
		iframeStyle.left= listStyle.left;
		iframeStyle.width = nitobi.Browser.GetElementWidth(tag); 
		iframeStyle.height = nitobi.Browser.GetElementHeight(tag);

		// Ensure the iframe sits underneath the list.
		iframeStyle.zIndex = parseInt(listStyle.zIndex)-1;
	}
}


/**
 * Hides the list.
 * If the list is visible when this is called, then the OnHideEvent is triggered.
 * @see #SetOnHideEvent
 */
nitobi.combo.List.prototype.Hide = function()
{
	if (!this.m_Rendered)
	{
		return false;
	}
	var tag = this.GetHTMLTagObject();
	var	listStyle = tag.style;
	listStyle.visibility="hidden";
	if ((!nitobi.browser.IE))
	{
		listStyle.display="none";
	}
	if (nitobi.browser.IE)
	{
		var iframeStyle=nitobi.combo.iframeBacker.style;
		iframeStyle.visibility="hidden";
	}
	// TODO: use toolkit event firing
	eval(this.GetOnHideEvent());
}

/**
 * @private
 */
nitobi.combo.List.prototype.Toggle = function()
{
	if(this.IsVisible()){
		this.Hide();
		this.GetCombo().GetTextBox().ToggleHidden();
		
	}
	else{
		this.Show();
		this.GetCombo().GetTextBox().ToggleShow();
		
	}
}


/**
 * Sets the active row as the selected row.
 * @private
 */
nitobi.combo.List.prototype.SetActiveRowAsSelected = function()
{
	var combo = this.GetCombo();
	var t = combo.GetTextBox();
	
	// 2005.04.27
	// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
	
	// Match the hidden fields with the row fields.
	var row=null;
	row=this.GetActiveRow();
	if(null!=row)
	{
		eval(combo.GetOnBeforeSelectEvent());
	}
	if (row!=null)
	{
		this.SetSelectedRow(this.GetRowIndex(row));
		// Copy the value into the textbox.
		if(combo.mode!="smartlist")
		{
			t.SetValue(this.GetSelectedRowValues()[t.GetDataFieldIndex()]);
		}
	}
}


/**
 * Sets a row as selected given its index.
 * This sets the SelectedRowIndex as well as the selected row values.  
 * It is equivalent to calling {@link nitobi.combo.Combo#SetSelectedRowValues} and {@link nitobi.combo.Combo#SetSelectedRowIndex}.
 * @example
 * var list = nitobi.getComponent('combo1').GetList();
 * list.SetSelectedRow(3);  // Selects the 4th row (zero indexed)
 * @param Number RowIndex The number of the row you want to select. Indexed from zero.
 * @see nitobi.combo.Combo#GetSelectedRowIndex
 * @see nitobi.combo.Combo#GetSelectedRowValues
 */
nitobi.combo.List.prototype.SetSelectedRow = function(RowIndex)
{
	//TODO: this will be used for onclick as well as initialize to set the selectedrow.
	// OnClick should be modified to accomadate this,ie, some duplicate lines now.

	// Keep track of which row number was pressed.
	// NOTE: This is based from zero for javascript consistency. XSL indexes from 1.
	this.SetSelectedRowIndex(RowIndex);

	var values = this.GetXmlDataSource().GetRow(RowIndex);
	this.SetSelectedRowValues(values, null);
}

/**
 * Called when the user clicks the list.
 * @private
 */
nitobi.combo.List.prototype.OnClick = function(Row)
{
	eval(this.GetCombo().GetOnBeforeSelectEvent());
	var rowNum = this.GetRowIndex(Row);

	// Keep track of which row number was pressed.
	// NOTE: This is based from zero for javascript consistency. XSL indexes from 1.
	this.SetSelectedRowIndex(rowNum);

	var values = this.GetXmlDataSource().GetRow(rowNum);
	this.SetSelectedRowValues(values, null);

	var combo=this.GetCombo();
	var tb = combo.GetTextBox();
	var textboxDataFieldIndex = tb.GetDataFieldIndex();
	if (values.length <= textboxDataFieldIndex){
		alert("You have bound the textbox to a column that does not exist.\nThe textboxDataFieldIndex is " +
		textboxDataFieldIndex +
		".\nThe number of values in the selected row is " + values.length + "." );
	}
	else
		tb.SetValue(values[textboxDataFieldIndex], combo.mode=="smartlist");

	this.Hide();
	eval(combo.GetOnSelectEvent());
	
	// manually blur combo because it's not auto detected for some reason
	// TODO: figure why? or... stick w/ this workaround
	/*combo.m_Over=false;
	tb.OnBlur();*/
}

/**
 * Called when the user scrolls the list with the mouse wheel.
 * @private
 */
nitobi.combo.List.prototype.OnMouseWheel = function(evt)
{
	if(nitobi.browser.IE){
		var b = nitobi.Browser;
		var lb = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
		var top = this.GetRow(0);
		var bot = this.GetRow(this.GetXmlDataSource().GetNumberRows() - 1);
		if(null!=top){
			if(evt.wheelDelta >= 120)
				b.WheelUp(this);
			else if(evt.wheelDelta <= -120)
				b.WheelDown(this);
			evt.cancelBubble = true;
			evt.returnValue = false;
		}
	}
}

/**
 * @private
 */
nitobi.combo.List.prototype.Render = function()
{
	// Delay rendering until needed. Speeds up load time.
	if (!this.m_Rendered)
	{
		this.m_Rendered=true;
		var combo = this.GetCombo();
		var hostTag = document.body;
		// Insert the element in the beginning so that it doesn't create extra space at the bottom.
		var x = nitobi.html.insertAdjacentHTML(hostTag,'afterBegin',this.GetHTMLRenderString());
		this.Initialize(document.getElementById('EBAComboBoxText'+combo.GetId()));
		this.OnWindowResized();
		this.GenerateCss();
	}
}

/**
 * Returns the HTML that is used to render the object.
 * @private
 */
nitobi.combo.List.prototype.GetHTMLRenderString = function()
{
	var combo = this.GetCombo();
	var theme = 'outlook';

	var uniqueId = combo.GetUniqueId();
	var comboId = combo.GetId();

	var listWidth = parseInt(this.GetDesiredPixelWidth());
	
	var colDefHeadingsVisible=false;
	var rowHTML="";
	if (this.m_XmlDataSource.GetXmlObject())
	{
		var xml = null;
		if(combo.mode=="default" || combo.mode=="unbound")
			xml = this.m_XmlDataSource.GetXmlObject().xml;
		else
			xml = "<root></root>";
		rowHTML=this.GetRowHTML(xml);
	}

	var colDefs = this.GetListColumnDefinitions();

	var s="";
	// Insert the main span. The m_Over is used to keep the list open while keeping the focus
	// in the textbox.
	s="<span class=\"ntb-combo-reset "+ combo.theme +"\"><span id=\"EBAComboBoxList" + uniqueId + "\" class=\"ntb-combobox-list" + "\" style=\"width: " + listWidth + "px;\" " +
			"onMouseOver=\"document.getElementById('" + this.GetCombo().GetId() + "').object.m_Over=true\" " +
			"onMouseOut=\"document.getElementById('" + this.GetCombo().GetId() + "').object.m_Over=false\" " +
			"onClick=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnFocus()\">\n";
	
	// NOTE: above onClick is a fix for Mozilla - not necessary for but compatible w/ IE

	// Write out all the panels.
	var tag = this.m_userTag;
	var childNodes = tag.childNodes;
	var menus="<span class='ntb-combobox-combo-menus ComboListWidth"+uniqueId+"'>";
	var menusExist=false;
	for (var i = 0; i < childNodes.length; i++)
	{
		if (childNodes[i].nodeName.toLowerCase().replace(/^eba:/,"").replace(/^ntb:/,"") == "combopanel")
		{
			s+=childNodes[i].innerHTML;
		}
		
		if (childNodes[i].nodeName.toLowerCase().replace(/^eba:/,"").replace(/^ntb:/,"") == "combomenu")
		{
			menusExist = true;
			var icon = childNodes[i].getAttribute("icon");
			menus += "<div style='"+(nitobi.browser.MOZ && i ==0?/*"padding-top:10px"*/"":"")+";' class='ntb-combobox-combo-menu ComboListWidth"+uniqueId+"' onMouseOver=\"this.className='ntb-combobox-combo-menu-highlight ComboListWidth"+uniqueId+"'\" onmouseout=\"this.className='ntb-combobox-combo-menu ComboListWidth"+uniqueId+"'\" onclick=\""+childNodes[i].getAttribute("OnClickEvent")+"\">";
			if (icon != "")
			{
				menus += "<img class='ntb-combobox-combo-menu-icon' align='absmiddle' src='" + icon + "'>";
			}
			menus+=childNodes[i].getAttribute("text")+"</div>";	
		}
	}
	menus+="</span>";

	// List header.
	// Check to see that there are col def headings to display because if not, we wont
	// display them.
	if(combo.mode=="default" || combo.mode=="filter" || combo.mode=="unbound")
	{
		for (var i = 0; i < colDefs.length ; i++)
		{
			if (colDefs[i].GetHeaderLabel() != "")
				colDefHeadingsVisible=true;
		}
		var customHTMLHeader = this.GetCustomHTMLHeader();
		if ((colDefHeadingsVisible==true) || (customHTMLHeader!="")){
			//listWidth="100%";
			s+="<span id='EBAComboBoxListHeader" + uniqueId + "' class='ntb-combobox-list-header' style='padding:0px; margin:0px; width: " + listWidth + "px;' >\n";
			if (customHTMLHeader != "")
				s+=customHTMLHeader;
			else
			{
				/* table-layout:fixed; */
				s+="<table cellspacing='0' cellpadding='0' style='border-collapse:collapse;' class='ComboHeader"+uniqueId+"'>\n";
				s+="<tr style='width:100%' id='EBAComboBoxColumnLabels" + uniqueId + "' class='ntb-combobox-column-labels'>\n";
				var attributes="";
				var wildcardInList=false;
				for (var i = 0; i < colDefs.length ; i++)
				{
					var colWidth = colDefs[i].GetWidth();
					
					attributes="";
					if (colDefs[i].GetColumnType().toLowerCase() == "hidden"){
						attributes += "style='display: none;'";
						colDefs[i].SetWidth("0%");
					}
					var className = "comboColumn_" + i + "_" + uniqueId;
					// The list itself doesn't have any padding. This corrects the header so it looks the same as the list.
					var padding = (i > 0?"style='padding-left:0px'":"");
					s+="<td " + padding + " align='" + colDefs[i].GetAlign() + "' class='ntb-combobox-column-label "+className+"' " + attributes + ">";
					s += "<div class='" + className + " ntb-combobox-column-label-text'>" +  colDefs[i].GetHeaderLabel() + "</div>";
					//s += colDefs[i].GetHeaderLabel();
					s += "</td>\n";
				}
				s+="</tr>\n";
				s+="</table>\n";
			}
//2005.04.21				s+="</span><br>\n";
			s+="</span><br>\n";
		}
	}


	if (menusExist)
	{
		s+=menus;
	}
	
	// List body.
	s+="<span id='EBAComboBoxListBody" + uniqueId + "' class='ntb-combobox-list-body" + "' style='width:" + listWidth  + "px;" + (combo.mode=="default" || combo.mode=="unbound" || (combo.mode=="smartsearch" && this.GetAllowPaging()) ? "height: "+this.GetSectionHeight(EBAComboBoxListBody) + "px" + (this.m_overflowy == "auto" ? ";_overflow-y:;_overflow:auto": "") : "overflow:visible") + ";' onscroll=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetTextBox().GetHTMLTagObject().focus()\" "+
		"onmousewheel=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnMouseWheel(event)\" "+
		"onfocus=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnFocus()\">\n";

	// Add the 1st table.
	s+=rowHTML +
		"</table>" + // This is a huge hack cause the rowHTML is outputting a self closing emtpy table tag when ther are no rows
		"</span>\n";

	// List footer.
	// TODO List footer text.
//		var allowPaging = this.GetAllowPaging();
//		if ((combo.mode=="default" || combo.mode=="smartsearch") && true == allowPaging){
//2005.04.21			s+="<span id='EBAComboBoxListFooter" + uniqueId + "' style='width:"+ listWidth  +"' class='ntb-combobox-list-footer' >\n";
		s+="<br><span id='EBAComboBoxListFooter" + uniqueId + "' style='width:"+ listWidth  + "px; display:" + (this.GetAllowPaging()?"inline":"none") + "' class='ntb-combobox-list-footer'>\n";
		s+="<span id=\"EBAComboBoxListFooterPageNextButton" + uniqueId + "\" style=\"width:100%\"" +
				" class=\"ntb-combobox-list-footer-page-next-button\" "+
				"onMouseOver='this.className=\"ntb-combobox-list-footer-page-next-button-highlight\"' "+
				"onMouseOut='this.className=\"ntb-combobox-list-footer-page-next-button\"' " +
				"onClick=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnGetNextPage(null, true);\"></span>\n";

		s+="</span>\n"+
			"</span>\n";
	//}
	s+="</span>\n";
	
	s=s.replace(/\#<\#/g,"<").replace(/\#\>\#/g,">").replace(/\#\&amp;lt\;\#/g,"<").replace(/\#\&amp;gt\;\#/g,">").replace(/\#EQ\#/g,"=").replace(/\#\Q\#/g,"\"").replace(/\#\&amp\;\#/g,"&");

	return s;
}

/**
 * Initializes the object after construction.  Must be called after the object's HTML tags are placed on the page.
 * @param {Object} attachee HTML element to attach this list to (i.e. an INPUT element).
 * @private
 */
nitobi.combo.List.prototype.Initialize = function(attachee)
{
	this.attachee=attachee;
	
	var c = this.GetCombo();
	var d = document;
	var uniqueId = c.GetUniqueId();
	this.SetHTMLTagObject(d.getElementById("EBAComboBoxList" + uniqueId));
	this.SetSectionHTMLTagObject(EBAComboBoxListHeader,d.getElementById("EBAComboBoxListHeader" + uniqueId));
	this.SetSectionHTMLTagObject(EBAComboBoxListBody,d.getElementById("EBAComboBoxListBody" + uniqueId));
	this.SetSectionHTMLTagObject(EBAComboBoxListFooter,d.getElementById("EBAComboBoxListFooter" + uniqueId));
	this.SetSectionHTMLTagObject(EBAComboBoxListBodyTable,d.getElementById("EBAComboBoxListBodyTable" + uniqueId));
	this.SetSectionHTMLTagObject(EBAComboBoxList,d.getElementById("EBAComboBoxList" + uniqueId));
	if (c.mode=="default" && true==this.GetAllowPaging())
		this.SetFooterText(this.GetXmlDataSource().GetNumberRows() + EbaComboUi[EbaComboUiNumRecords]);

	this.Hide();
}


/**
 * Called when the user mouses over the list.
 * @param {Object} Row
 * @private
 */
nitobi.combo.List.prototype.OnMouseOver = function(Row)
{
	this.SetActiveRow(Row);
}

/**
 * Called when the user mouses out of the list.
 * @private
 */
nitobi.combo.List.prototype.OnMouseOut = function(Row)
{
	this.SetActiveRow(null);
}

/**
 * Called when the list gains focus.
 * @private
 */
nitobi.combo.List.prototype.OnFocus = function()
{
	var t = this.GetCombo().GetTextBox();
	t.m_skipFocusOnce=true;
	t.m_HTMLTagObject.focus();
}

/**
 * Fires when the users wants another page.
 * @private
 */
nitobi.combo.List.prototype.OnGetNextPage = function(ScrollTo, workaround)
{
	if (this.m_httpRequestReady)
	{
		var dataSource = this.GetXmlDataSource();
		var last = null;
		if(workaround==true)
		{
			var n = dataSource.GetNumberRows();
			if(n>0)
			{
				last = dataSource.GetRowCol(n - 1, this.GetCombo().GetTextBox().GetDataFieldIndex());
			}
		}
		// This makes an async call that calls addpage on list and xmldatasource.
		this.GetPage(dataSource.GetNumberRows(), this.GetPageSize(), this.GetCombo().GetTextBox().GetIndexSearchTerm(), ScrollTo, last);
		// Make sure that the textbox retains focus so that blur works.
		this.GetCombo().GetTextBox().GetHTMLTagObject().focus();
	}
}


/**
 * @private
 */
nitobi.combo.List.prototype.OnWindowResized = function()
{
	if (!this.m_Rendered) return;
	if (nitobi.Browser.GetMeasurementUnitType(this.GetWidth()) == "%")
	{
		// TODO: Clearly needs correction.
		this.SetWidth(this.GetWidth());
	}
}

/**
 * @private
 */
nitobi.combo.List.prototype.GenerateCss = function()
{
	var colDefs = this.GetListColumnDefinitions();
	var uid = this.GetCombo().GetUniqueId();
	var cssText = "";

	var wildCardIndex=-1;
	var list = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
	var sb = nitobi.html.getScrollBarWidth(list);
	var fudge = (nitobi.browser.MOZ?6:0);
	
	var width=0;
	// TODO: This all needs to be cleaned up.  What is this.widestColumn
	// even used for?
	for (var i=0;i<this.widestColumn.length;i++)
	{
		width+=this.widestColumn[i];
	}
	if (width < parseInt(this.GetDesiredPixelWidth()))
	{
		width = parseInt(this.GetDesiredPixelWidth());
	}
	
	// TODO: The width value should be the sum of each column width, not the List width.
	var remainingSpace = width - sb - fudge;
	var availSpace = width - sb - fudge;
	var addRule = nitobi.html.Css.addRule;
	if (this.stylesheet == null)
		this.stylesheet = nitobi.html.Css.createStyleSheet();
	var ss = this.stylesheet.sheet;
	if (nitobi.browser.SAFARI || nitobi.browser.CHROME) {
		addRule(ss, ".ComboRow" + uid, "width:"+(width - sb)+"px;}");
		addRule(ss, ".ComboHeader" + uid, "width:"+(width - sb + 3)+"px;}");
		addRule(ss, ".ComboListWidth" + uid, "width:"+(width)+"px;");
	} else {
		cssText += ".ComboRow" + uid + "{width:"+(width - sb)+"px;}";
		cssText += ".ComboHeader" + uid + "{width:"+(width - sb + 3)+"px;}";
		cssText += ".ComboListWidth" + uid + "{width:"+(width)+"px;}";
	}

	for (var i = 0; i < colDefs.length; i++)
	{
		var colWidth = colDefs[i].GetWidth();
		if (nitobi.Browser.GetMeasurementUnitType(colWidth) == "%" && colWidth != "*")
		{
			colWidth = Math.floor((parseInt(colWidth)/100) * availSpace);
		}
		else if (colWidth != "*")
		{
			colWidth = parseInt(colWidth);
		}
		if(colWidth=="*" || (i == colDefs.length-1 && wildCardIndex==-1))
		{
			wildCardIndex = i;
		}
		else
		{
			if (colWidth < this.widestColumn[i])
				colWidth = this.widestColumn[i];
			remainingSpace -= parseInt(colWidth);
			if (nitobi.browser.SAFARI || nitobi.browser.CHROME)
				addRule(ss, ".comboColumn_" + i + "_" + uid, "width:"+(colWidth)+"px;");
			else
				cssText += ".comboColumn_" + i + "_" + uid + "{ width: " + (colWidth) + "px;}";
		}
	}
	if (wildCardIndex!=-1)
	{
		if (nitobi.browser.SAFARI || nitobi.browser.CHROME)
			addRule(ss, ".comboColumn_" + wildCardIndex + "_" + uid, "width:"+remainingSpace+"px;");
		else
			cssText += ".comboColumn_" + wildCardIndex + "_" + uid + "{ width: " + remainingSpace + "px;}";
	}
	nitobi.html.Css.setStyleSheetValue(this.stylesheet, cssText);
}

/**
 * @private
 */
nitobi.combo.List.prototype.ClearCss = function()
{
	if (this.stylesheet == null) 
	{
		this.stylesheet = document.createStyleSheet();
	}
	this.stylesheet.cssText = "";
}

/**
 * Given some XML, return formatted HTML code that can be inserted into the list.
 * @param {String} XML The XML rows that will be transformed into HTML.
 * @param {String} [SearchSubstring] Search substring to bold (i.e. in "smart" search modes).
 * @private
 */
nitobi.combo.List.prototype.GetRowHTML = function(XML, SearchSubstring)
{
	var combo = this.GetCombo();
	var comboId = combo.GetId();
	var uniqueId = combo.GetUniqueId();
	var colDefs = this.GetListColumnDefinitions();
	// important to parseInt() because GetWidth() currently returns with "px"
	var listWidth = parseInt(this.GetWidth());
			
	// XSL For the table entries.
	var xsl="<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\" version=\"1.0\"  >";

// changed from method='html' to 'xml' to prevent a0: name qualifier from being prepended to tags in Moz
	xsl += "<xsl:output method=\"xml\" version=\"4.0\" omit-xml-declaration=\"yes\" />\n"+
			"<xsl:template match=\"/\">"+
			"<table cellspacing=\"0\" cellpadding=\"0\" id=\"EBAComboBoxListBodyTable" + uniqueId + "_" + this.GetNumPagesLoaded() + "\" class=\"ntb-combobox-list-body-table ComboRow" + uniqueId +"\">\n"+
			"<xsl:apply-templates />"+
			"</table>"+
			"</xsl:template>";

	// Template for table entries.
	xsl += "<xsl:template match=\"e\">";

	xsl += "<tr onclick=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnClick(this)\" " +
			"onmouseover=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnMouseOver(this)\" " +
			"onmouseout=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnMouseOut(this)\">";

	xsl += "<xsl:attribute name=\"id\">";

	// The rows are number linearly through all the tables. Calculate the starting
	// row number for this page of data. Note the -1: xsl indexes from 1, and we
	// want to index from 0.
	var rowNumberXsl = "position()+" + (this.GetXmlDataSource().GetNumberRows() - this.GetXmlDataSource().GetLastPageSize()) + "-1";
	var rowIdXsl = "EBAComboBoxRow" + uniqueId + "_<xsl:value-of select=\"" + rowNumberXsl + "\"/>";
	xsl += rowIdXsl+
			"</xsl:attribute>"+
			// The row is put in a table so that we can apply styles per row. Some styles can't be applied to tr tags.
			"<td class='ComboRowContainerParent'><table cellspacing='0' cellpadding='0' class='ntb-combobox-list-body-table-row "+"ComboRow" + uniqueId +"' style=\"width:"+(nitobi.browser.SAFARI || nitobi.browser.CHROME?this.GetWidth():"100%")+";table-layout:fixed;\"><tbody>"+
			// Set the id of the containing table.
			"<xsl:attribute name=\"id\">"+
			"ContainingTableFor" + rowIdXsl+
			"</xsl:attribute>"+
			"<tr class='ComboRowContainer'>";

	var customHTMLDefinition = this.GetCustomHTMLDefinition();
	var dataFieldIndex;

	var colgroup = "";

	if ("" == customHTMLDefinition){
		// Draw regular columns.
		for (var i = 0; i < colDefs.length; i++){
			var attributes = "";
			var colType = colDefs[i].GetColumnType().toLowerCase();
			if (colType == "hidden")
				attributes += "style='display: none;'";

			var widthClass = "comboColumn_" + i + "_" + uniqueId;

			colgroup += "<col class=\""+widthClass+"\" style=\"width:"+colDefs[i].GetWidth()+"\" />"

			xsl += "<td align='" + colDefs[i].GetAlign() + "' class='" + widthClass + " " + colDefs[i].GetCSSClassName() + "' " + attributes + " style=\"width:"+colDefs[i].GetWidth()+"\">";
			//Write a span tag to contain the data.
//				xsl += "<span class='"+colDefs[i].GetCSSClassName()+"' style='width:" + colDefs[i].GetWidth() + ";color:" + colDefs[i].GetTextColor() + ";' onfocus='document.c.GetList().OnFocus()' onmouseover='document.c.GetList().OnFocus()'>";
// 2005.04.26 - class attr seems like a duplication AND it seems to be the cause of a FireFox bug
// (SetActiveRow causes a flicker); somewhat tested and everything seems to work well w/o this class attr here on the span
				xsl += "<div class=\"" + (nitobi.browser.IE||nitobi.browser.SAFARI||nitobi.browser.CHROME?widthClass + " ":"") + colDefs[i].GetCSSClassName() + "Cell\" style=\"color:" + colDefs[i].GetTextColor() + ";overflow:hidden;\" onfocus=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnFocus()\""+
							" onmouseover=\"document.getElementById('" + this.GetCombo().GetId() + "').object.GetList().OnFocus()\">";
			
			xsl += "<xsl:attribute name=\"id\">"+
					"ContainingSpanFor" + rowIdXsl + "_" + i+
					"</xsl:attribute>"+
					"<xsl:text disable-output-escaping=\"yes\">" +
						"<![CDATA[" +
						colDefs[i].GetHTMLPrefix() +  "" +
						"]]>" +
					"</xsl:text>";

			// The datafield index. If one doesn't exist, use the column position.
			dataFieldIndex = colDefs[i].GetDataFieldIndex();
			if (null == dataFieldIndex)
				dataFieldIndex=i;
			dataFieldIndex=parseInt(dataFieldIndex);
			// If the column is images write the first part of the image tag out.
			var imageHandlerURL="";
			if (colType == "image")
			{
				imageHandlerURL = colDefs[i].GetImageHandlerURL();
				imageHandlerURL.indexOf("?") == -1 ? imageHandlerURL += "?" :  imageHandlerURL += "&";
				imageHandlerURL += "image=";
				
				xsl += "<img> <xsl:attribute name=\"align\"><xsl:value-of  select=\"absmiddle\"/></xsl:attribute>"
						+ "<xsl:attribute name=\"src\"><xsl:value-of select=\"concat('"+(colDefs[i].ImageUrlFromData ? "" : imageHandlerURL) + "',"
						+ "@" + String.fromCharCode(97 + dataFieldIndex) + ")\"/></xsl:attribute>" 
						+ "</img>";
			}

			// Print the value, and bold it if appropriate.
			if((SearchSubstring!=null) && (colType != "image")) {
				 xsl += '<xsl:call-template name="bold"><xsl:with-param name="string">';
			}
			// The value
			if (colType != "image")
			{
				xsl += '<xsl:value-of select="@' + String.fromCharCode(97 + dataFieldIndex) + '"></xsl:value-of>';
			}
			
			if((SearchSubstring!=null) && (colType != "image")) 
			{
				xsl += "</xsl:with-param><xsl:with-param name=\"pattern\" select=\"" + nitobi.xml.constructValidXpathQuery(SearchSubstring,true) + "\"></xsl:with-param></xsl:call-template>";
			}
			

			// Draw the HTMLSuffix.
			xsl += "<xsl:text disable-output-escaping=\"yes\">" +
					"<![CDATA[" +
					colDefs[i].GetHTMLSuffix() +  "" +
					"]]>" +
					"</xsl:text>";

			xsl += "</div>";

			xsl += "</td>";
		}
	}else{
		// Draw HTML that is defined by the user.
		xsl += "<td width='100%'>";
		var done = false;
		var nextOpeningBracket=0;
		var nextClosingBracket=0;
		var prevClosingBracket=0;
		var colNum;


		// Loop through the HTML definition and pick out the columns replacing them
		// with references to the correct XML data.
		while (!done){
			nextOpeningBracket = customHTMLDefinition.indexOf("${",nextClosingBracket);

			if (nextOpeningBracket != -1){
				nextClosingBracket = customHTMLDefinition.indexOf("}",nextOpeningBracket);

				colNum = customHTMLDefinition.substr(nextOpeningBracket+2, nextClosingBracket-nextOpeningBracket-2);


				xsl += "<xsl:text disable-output-escaping=\"yes\">" +
					"<![CDATA[" +
						customHTMLDefinition.substr(prevClosingBracket,nextOpeningBracket-prevClosingBracket) +
					"]]>" +
					"</xsl:text>";
				// The value
 				xsl += '<xsl:value-of select="@' + String.fromCharCode(parseInt(colNum) + 97) + '"></xsl:value-of>';
				prevClosingBracket = nextClosingBracket+1;
			}else{
				xsl += "<xsl:text disable-output-escaping=\"yes\">" +
					"<![CDATA["+
					customHTMLDefinition.substr(prevClosingBracket)+
					"]]>" +
					"</xsl:text>";
				done = true;
			}
		}
		xsl += "</td>";
	}

	// Note: One row per line.
	xsl += "</tr></tbody><colgroup>"+colgroup+"</colgroup></table></td></tr>\n"+
			"</xsl:template>";
	if(SearchSubstring!=null)
	{																																																																																																																																																																																																																																																										
		xsl+="<xsl:template name=\"bold\">"+
			"<xsl:param name=\"string\" select=\"''\" /><xsl:param name=\"pattern\" select=\"''\" /><xsl:param name=\"carryover\" select=\"''\" />";

		xsl+="<xsl:variable name=\"lcstring\" select=\"translate($string,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')\"/>"+
			 "<xsl:variable name=\"lcpattern\" select=\"translate($pattern,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')\"/>";
			
		xsl+="<xsl:choose>"+
			"<xsl:when test=\"$pattern != '' and $string != '' and contains($lcstring,$lcpattern)\">"+
				"<xsl:variable name=\"newpattern\" select=\"substring($string,string-length(substring-before($lcstring,$lcpattern)) + 1, string-length($pattern))\"/>"+
				"<xsl:variable name=\"before\" select=\"substring-before($string, $newpattern)\" />"+
				"<xsl:variable name=\"len\" select=\"string-length($before)\" />"+
				"<xsl:variable name=\"newcarryover\" select=\"boolean($len&gt;0 and contains(substring($before,$len,1),'%'))\" />"+
				"<xsl:value-of select=\"$before\" />"+
					"<xsl:choose>"+
					"<xsl:when test=\"($len=0 and $carryover) or $newcarryover or ($len&gt;1 and contains(substring($before,$len - 1,1),'%'))\">"+
						"<xsl:copy-of select=\"$newpattern\" />"+
					"</xsl:when>"+
				"<xsl:otherwise>"+
					"<b><xsl:copy-of select=\"$newpattern\" /></b>"+
				"</xsl:otherwise></xsl:choose>"+
				"<xsl:call-template name=\"bold\">"+
					"<xsl:with-param name=\"string\" select=\"substring-after($string, $newpattern)\" />"+
					"<xsl:with-param name=\"pattern\" select=\"$pattern\" />"+
					"<xsl:with-param name=\"carryover\" select=\"$newcarryover\" />"+
				"</xsl:call-template>"+
			"</xsl:when>"+
			"<xsl:otherwise>"+
				"<xsl:value-of select=\"$string\" />"+
			"</xsl:otherwise>"+
		"</xsl:choose>"+
		"</xsl:template>";
	}
	xsl += "</xsl:stylesheet>";

	oXSL=nitobi.xml.createXmlDoc(xsl);
	// Moz treats whitespace nodes differently from IE; to be safe, parse
	// out whitespace between xml tags for Moz & IE;
	// if we don't parse out the whitespace, rows may not be numbered
	// properly
	tmp=nitobi.xml.createXmlDoc(XML.replace(/>\s+</g,"><"));
	// TODO: This should just use transformToString but the output type is XML and there may be a reason for that.
	var html = nitobi.xml.serialize(nitobi.xml.transformToXml(tmp, oXSL));
	html = html.replace(/\#\&amp;lt\;\#/g,"<").replace(/\#\&amp;gt\;\#/g,">").replace(/\#\&eq\;\#/g,"=").replace(/\#\&quot\;\#/g,"\"").replace(/\#\&amp\;\#/g,"&");
	return html;
}

/**
 * Scrolls a row into view.
 * @param {HTMLNode} Row The row to scroll into view.
 * @param {Boolean} Top If true, scroll into view if Row not at the top. If false, scroll into view if Row not in list container's view.
 * @param {Boolean} IgnoreHorizontal If true, then ignore check in the horizontal direction.
 * @private
 */
nitobi.combo.List.prototype.ScrollIntoView = function(Row,Top,IgnoreHorizontal)
{
	if(Row && this.GetCombo().mode!="compact")
	{
		var container = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
		if(nitobi.Browser.IsObjectInView(Row,container,Top,IgnoreHorizontal)==false){
			nitobi.Browser.ScrollIntoView(Row,container,Top);
		}
	}
}

/**
 * Returns the index of a row given the tr row object.</summary>
 * @param {HTMLNode} Row The row whose index you want to get.
 * @private
 */
nitobi.combo.List.prototype.GetRowIndex = function(Row)
{
	// Get the row number
	var vals = Row.id.split("_");
	var rowNum = vals[vals.length-1];
	return rowNum;
}


EBAComboListDatasourceAccessStatus_BUSY=0;
EBAComboListDatasourceAccessStatus_READY=1;

/**
 * Returns the status of the search mechanism as either EBAComboListDatasourceAccessStatus_BUSY (0) or
 * EBAComboListDatasourceAccessStatus_READY (1).  If the status is busy, a search or GetPage is in progress.
 * Calling GetPage while Busy will cancel the current GetPage or search.  This is primarily used when you want to do multiple GetPage requests.
 * @type Number
 * @see #GetPage
 */
nitobi.combo.List.prototype.GetDatasourceAccessStatus = function()
{
	if (this.m_httpRequestReady)
		return EBAComboListDatasourceAccessStatus_READY;
	else
		return EBAComboListDatasourceAccessStatus_BUSY;
}

// In some contexts, users put the this ptr in their event handling code
// However, sometimes eval is called when the this pointer is null, because
// it is not this object calling eval. This fixing this problem.
/**
 * @private
 */
nitobi.combo.List.prototype.Eval = function(Expression)
{
	eval(Expression);
}

/**
 * Gets a new page of data from the server, adds it to the local cache, and updates the list display.  Uses the DatasourceUrl property.
 * When you do multiple GetPage requests, newer requests cancel older requests. If you do not want this
 * to occur, use {@link #GetDatasourceAccessStatus} to check the status of the Datasource before calling newer pages.
 * You can clear the list by using {@link #Clear} you can clear the XmlDataSource cache by using {@link nitobi.combo.XmlDataSource#Clear}.
 * When GetPage is used to perform a search by using the SearchSubstring parameter, the mode of the combo determines the local search algorithm.
 * For instance, Classic, Compact, and Unbound modes search by string prefix, that is, it only the tries to match the front of the string; SmartList,
 * SmartSearch, and Filter try to match anywhere in the string.
 * @param {Number} StartingRecordIndex The record index which defines the start of the page
 * @param {Number} PageSize The number of records to be retrieved
 * @param {String} SearchSubstring The search substring the user has typed into the textbox. The type of search is determined by the mode
 * @param {Number} ScrollTo Action to take after paging. It can be one of EBAScrollToNone (0), EBAScrollToTop (1), EBAScrollToBottom (2), EBAScrollToNewTop (3), EBAScrollToTypeAhead (4), EBAScrollToNewBottom (5)
 * @param {String} LastString The last string that was searched for.
 * @param {Object} GetPageCallback A function reference that is called with the a GetPageResult argument. It may be EBAComboSearchNoRecords=0 or EBAComboSearchNewRecords=1
 * @see #GetDatasourceAccessStatus
 * @see nitobi.combo.XmlDataSource#Clear
 * @see #Clear
 * @see #AddRow
 */
nitobi.combo.List.prototype.GetPage = function( StartingRecordIndex, PageSize, SearchSubstring, ScrollTo , LastString, GetPageCallback, SearchColumnIndex, SearchCallback)
{
	var requestTime = new Date().getTime();
	
	this.SetFooterText(EbaComboUi[EbaComboUiPleaseWait]);

	if (LastString == null)
	{
		LastString = "";
	}

	this.m_httpRequest = new nitobi.ajax.HttpRequest();
	this.m_httpRequest.responseType = "text";
	this.m_httpRequest.onRequestComplete.subscribe(this.onGetComplete, this);
	this.lastHttpRequestTime = requestTime;

	// Abort any other searches in favour of this one.
	// this.m_httpRequest.abort();

	if(null==ScrollTo)
		ScrollTo=EBAScrollToNone;

	// Save this value so that we can check it against what the gethandler returned to us.
	this.m_OriginalSearchSubstring=SearchSubstring;
	// Get the current page URL and add args to it.
	var pageUrl = this.GetDatasourceUrl();
	pageUrl.indexOf("?") == -1 ? pageUrl += "?" :  pageUrl += "&";
	// Note: Use encodeURI to be compatible with foreign text.
	pageUrl += "StartingRecordIndex=" + StartingRecordIndex + "&PageSize=" + PageSize + "&SearchSubstring=" + encodeURIComponent(SearchSubstring) + "&ComboId="+encodeURI(this.GetCombo().GetId())+"&LastString="+encodeURIComponent(LastString);
	// Set up the post.
	this.m_httpRequest.open(this.GetCombo().GetHttpRequestMethod(), pageUrl, true, "", "");

	// Send the request.
	this.m_httpRequestReady=false;
	this.m_httpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	this.m_httpRequest.params = {
		StartingRecordIndex:StartingRecordIndex, 
		SearchSubstring:SearchSubstring, 
		ScrollTo:ScrollTo, 
		GetPageCallback:GetPageCallback, 
		SearchColumnIndex:SearchColumnIndex, 
		SearchCallback:SearchCallback,
		RequestTime:requestTime
	};
	

	// Attempt to locate ASP.Net viewstate
	var vs = document.getElementsByName("__VIEWSTATE");
	if ((vs != null) && (vs["__VIEWSTATE"] != null))
	{
		// get the viewstate from the page and URL encode '+' chars
		var viewState = "__VIEWSTATE=" + encodeURI(vs["__VIEWSTATE"].value).replace(/\+/g, '%2B');
		var target = "__EVENTTARGET=" + encodeURI(this.GetCombo().GetId());
		var args = "__EVENTARGUMENT=GetPage";
		var httpRequestBody = target + "&" + args + "&" + viewState;
		this.m_httpRequest.send(httpRequestBody);
	}
	else
	{
		// Handle non-ASP.Net requests
		this.m_httpRequest.send("EBA Combo Box Get Page Request");
	}
	return true;
}

/**
 * Handler that is called when the data is retrieved from the server.
 * @private
 * @param {Object} evtArgs
 */
nitobi.combo.List.prototype.onGetComplete = function(evtArgs){
	
		var params = evtArgs.params;
		if (this.lastHttpRequestTime != params.RequestTime) return;

		var co = this.GetCombo();
		var t = co.GetTextBox();
		var list = co.GetList();

		if (list == null) 
			alert(EbaComboUi[EbaComboUiServerError]);

		var newXml = evtArgs.response;

		// Careful here. If there is anything before the XML declaration in an xml document, such as the 
		// junk that MS adds for their ASP debugging, then xml.load will fail. Instead, we have to 
		// manually load the data from the url, strip out anything that comes before <?xml.
		//TODO: The whole xmlhttprequest needs a better wrapper than xbdom.
		var declaredXmlIndex = newXml.indexOf("<?xml");
		if (declaredXmlIndex != -1) {
			newXml = newXml.substr(declaredXmlIndex);
		}

		var datasource = list.GetXmlDataSource();
		var numOldRecords = datasource.GetNumberRows();
		var tmp=nitobi.xml.createXmlDoc(newXml);
		if (true == list.clip) {
			tmp = xbClipXml(tmp, "root", "e", list.clipLength);
			newXml = tmp.xml;
		}
		
		var numNewRecords = tmp.selectNodes("//e").length;
		
		// If we're starting from the beginning and we get
		// xml back, clear the list. Don't clear the list if allow paging is on in smartsearch.
		var filter = co.mode != "default" && !(co.mode == "smartsearch" && list.GetAllowPaging());
		if ((numNewRecords > 0) && (params.StartingRecordIndex == 0) || filter) {
			list.Clear();
			datasource.Clear();
		}
		if (numNewRecords == 0 && filter) {
			list.Hide();
		}
		if (numNewRecords > 0) {
			datasource.AddPage(newXml);
			var ss = null;
			if (co.mode == "smartsearch" || co.mode == "smartlist") 
				ss = list.searchSubstring;
			list.AddPage(newXml, ss);
			if ((params.StartingRecordIndex == 0) && (list.GetCombo().GetTextBox().GetSearchTerm() != "")) {
				// The user is searching for something. We have records starting with the
				// first match. So match it client side.
				list.SetActiveRow(list.GetRow(0));
			}
			
			var mismatchedDataBinding = false;
			try {
				if (!list.IsFuzzySearchEnabled()) {
					// Analyse the search to see if the gethandler returned what we were searching for,
					// otherwise the combo goes into an infinite loop.
					var index = datasource.Search(list.m_OriginalSearchSubstring, t.GetDataFieldIndex(), co.mode == "smartsearch" || co.mode == "smartlist");
					mismatchedDataBinding = (index == -1);
				// If the server claims to have found a match, but we don't, raise a warning.
				//co.ShowWarning(index!=-1,"cw001");
				}
			} 
			catch (err) {
				// Drop this error. Its better to try the search rather than issue an error
				// about failed search analysis.
				Debug.Assert(false, "Analysis of the server data from search failed. " + err.message);
			}
			
			var isVisible = list.IsVisible();
			
			if (EBAScrollToBottom == params.ScrollTo) {
				var r = list.GetRow(numOldRecords - 1);
				list.SetActiveRow(r);
				list.ScrollIntoView(r, false);
			}
			else {
				if (EBAScrollToNewTop == params.ScrollTo || EBAScrollToNewBottom == params.ScrollTo) {
					var r = list.GetRow(numOldRecords);
					list.SetActiveRow(r);
					list.ScrollIntoView(r, EBAScrollToNewTop == params.ScrollTo);
					var tb = t.m_HTMLTagObject;
					tb.value = list.GetXmlDataSource().GetRowCol(numOldRecords, t.GetDataFieldIndex());
					nitobi.html.setCursor(tb, tb.value.length);
					t.Paging = false;
				}
				else 
					if (isVisible) {
						list.ScrollIntoView(list.GetActiveRow(), true);
					}
			}
			try {
				// If the binding is mismatched, ie, classic hooked up to smartsearch gethandler, don't do any callbacks.
				if (!mismatchedDataBinding && params.GetPageCallback) {
					params.GetPageCallback(EBAComboSearchNewRecords, list, params.SearchSubstring, params.SearchColumnIndex, params.SearchCallback);
				}
			} 
			catch (err) {
				Debug.Assert(false, "GetPageCallback failed." + err.message);
			}
		}
		else {
			try {
				if (params.GetPageCallback) {
					// result, list, SearchSubstring, SearchColumnIndex, SearchCallback
					params.GetPageCallback(EBAComboSearchNoRecords, list, params.SearchSubstring, params.SearchColumnIndex, params.SearchCallback);
				}
			} 
			catch (err) {
				Debug.Assert(false, "GetPageCallback failed in no search record context. " + err.message);
			}
			
			// Tell the user what happened. No new records found.
			list.SetFooterText(EbaComboUi[EbaComboUiNoRecords]);
			
			// Don't highlight any row if we can't find anything.
			list.SetActiveRow(null);
			
		}
		if (list.InitialSearchOnce == true && numNewRecords > 0) {
			list.InitialSearchOnce = false;
			var row = list.GetRow(0);
			list.SetActiveRow(row);
			list.SetSelectedRowValues(null, row);
			list.SetSelectedRowIndex(0);
			var tb = co.GetTextBox();
			tb.SetValue(list.GetSelectedRowValues()[tb.GetDataFieldIndex()]);
		}

		list.m_httpRequestReady = true;
		// Set paging to false so that the textbox can continue using keys.
		// This is not a good solution. See bug 943.
		t.Paging = false;
}

/**
 * Searches the list and returns the matching record index in the searchcallback. It first searches
 * the local cache if the cache is not dirty. If nothing is found in the local cache, it tries to retrieve data from the server.
 * @param {String} SearchSubString The string used to match.
 * @param {Int} SearchColumnIndex The column we search on.
 * @private
 */
nitobi.combo.List.prototype.Search = function(SearchSubstring, SearchColumnIndex, SearchCallback, CacheOnly)
{
	var combo = this.GetCombo();
	var xmlDatasource = this.GetXmlDataSource();
	if(combo.mode!="default" && SearchSubstring=="")
	{
		this.Hide();
		return;
	}
	if (null == CacheOnly)
	{
		CacheOnly =	false;
	}
	eval(this.GetOnBeforeSearchEvent());
	var index = -1;

	// Search the cache if its clean.
	// All modes use the cache. Some modes are stricter than others at
	// what they consider to be a dirty cache. For instance, smartsearch
	// always updates the cache for each search.
	// Unbound mode should never declare cache to be dirty.
	// A dirty cache is searched if db lookups are disabled.
	// This assert is true. TODO. For now, we always search unbound cache.

	if (!this.GetEnableDatabaseSearch() || !xmlDatasource.m_Dirty || combo.mode == "unbound")
	{
		index = xmlDatasource.Search(SearchSubstring, SearchColumnIndex, combo.mode=="smartsearch" || combo.mode=="smartlist");
		// workaround: when list goes blank (in filter mode) due to a previous non-match and then
		// the user types something that results in match(es), then list won't be shown; below
		// fixes this
		if(index > -1 && this.InitialSearchOnce!=true)
		{
			this.Show();
		}
		if (-1 != index)
		{
			if (SearchCallback)
			{
				try
				{
					// We found something, so callback with the result.
					SearchCallback(index,this);
				}
				catch(err)
				{

				}
			}	
			// If we've found something, then this Event is called for sure.
			eval(this.GetOnAfterSearchEvent());
		}
		if (-1 == index && (false == this.GetEnableDatabaseSearch() || CacheOnly))
		{
			if (SearchCallback)
			{
				try
				{
					// We found something, so callback with the result.
					SearchCallback(index,this);
				}
				catch(err)
				{

				}
			}
			// If we've found nothing, and we wont do a db search then this Event is called for sure.
			eval(this.GetOnAfterSearchEvent());
		}
	}
	// save search substring for text bolding
	this.searchSubstring = SearchSubstring;
	if ((-1 == index) && (this.GetEnableDatabaseSearch()==true && (CacheOnly == false)))
	{
		var timeoutStatus=this.GetDatabaseSearchTimeoutStatus();
		var timeoutCode =	"var list = document.getElementById('" + combo.GetId() + "').object.GetList(); " +
							"list.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_EXPIRED);" +
							"var textbox = document.getElementById('" + combo.GetId() + "').object.GetTextBox();"+
							"list.Search(textbox.GetSearchTerm(),textbox.GetDataFieldIndex(),textbox.m_Callback);";
		var timeoutId = this.GetDatabaseSearchTimeoutId();

		// Since we're now going to hit the database, and since the record starting point is
		// based on the search substring, save this term.
		combo.GetTextBox().SetIndexSearchTerm(SearchSubstring);

		// We don't want to do a db search immediately. Rather, since we may get multiple search calls,
		// lets wait until a certain time after the last call.
		switch(timeoutStatus){
			case(EBADatabaseSearchTimeoutStatus_EXPIRED):
			{
				// Do the search now. The wait period has expired.
				if (timeoutId != null)
					window.clearTimeout(timeoutId);
				this.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_NONE);
				// Try get the page from the server. Because we want to get
				// the first page, we blow away the list.

				// This callback is for getpage. GetPage does an asynchronous fetch,
				// This is the callback to deal with the result.
				var callback=_ListGetPageCallback; 
				// Don't do this. It creates mem leaks.
				/*function(result, list)
					{
   
						if ((combo == null))
						{
							alert(EbaComboUi[EbaComboUiServerError]);
						}
						var list = combo.GetList();
						if (result==EBAComboSearchNewRecords)
						{
							// If the callback was successful, then the cache is now clean.
							// Search again. This will search the cache.
							list.Search(SearchSubstring, SearchColumnIndex, SearchCallback);
						}
						else
						{
							// No records were found, so use the search callback to tell the originator
							// of the search that nothing was found.
							SearchCallback(-1,list);
							// When no new records are found, the search has ended.
							list.Eval(list.GetOnAfterSearchEvent());
						}
					};*/
				
				this.GetPage(0, this.GetPageSize(), SearchSubstring, EBAScrollToTypeAhead,null,callback,SearchColumnIndex,SearchCallback);
				// I don't belive this is required anymore. GetPage always returns true.
				/*if(false==this.GetPage(0, this.GetPageSize(), SearchSubstring, EBAScrollToTypeAhead,null,callback,SearchColumnIndex,SearchCallback))
				{
					// httprequest still busy - settimeout as if new search came just in case this is the last search
					// or else last search won't go through
					this.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_WAIT);
					var timeoutId = window.setTimeout(timeoutCode,EBADatabaseSearchTimeoutWait);
					this.SetDatabaseSearchTimeoutId(timeoutId);
				}*/


				break;
			}
			case(EBADatabaseSearchTimeoutStatus_WAIT):
			{
				// Keep waiting. A search request came before the timeout expired.

				// Keep waiting until the user finishes typing.
				if (timeoutId != null)
					window.clearTimeout(timeoutId);
				var timeoutId = window.setTimeout(timeoutCode,EBADatabaseSearchTimeoutWait);
				this.SetDatabaseSearchTimeoutId(timeoutId);
			}
			case(EBADatabaseSearchTimeoutStatus_NONE):
			{
//("Starting wait on " +  SearchSubstring);
				// This is a brand new search request. Wait for a little bit to
				// try and catch other more recent search requests.
				this.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_WAIT);
				var timeoutId = window.setTimeout(timeoutCode,EBADatabaseSearchTimeoutWait);
				this.SetDatabaseSearchTimeoutId(timeoutId);
			}
		}
	}
}

/**
 * @private
 */
function _ListGetPageCallback(result, list, SearchSubstring, SearchColumnIndex, SearchCallback)
{
	if ((list == null))
	{
		alert(EbaComboUi[EbaComboUiServerError]);
	}

	if (result==EBAComboSearchNewRecords)
	{
		if (!list.IsFuzzySearchEnabled())
		{
			// If the callback was successful, then the cache is now clean.
			// Search again. This will search the cache.
			// Don't search if fuzzy search is on, because likely, no match will be made.
			list.Search(SearchSubstring, SearchColumnIndex, SearchCallback);
		}
		else
		{
			list.Show();
		}
	}
	else
	{

		// No records were found, so use the search callback to tell the originator
		// of the search that nothing was found.
		SearchCallback(-1,list);
		// When no new records are found, the search has ended.
		list.Eval(list.GetOnAfterSearchEvent());
	}
}

/**
 * Deletes all the items in the list.
 * This clears all items in the list, and sets the SelectedRowIndex to -1. 
 * It does not clear all items in the XmlDataSource cache. Use XmlDataSource.Clear to do this.
 * @see nitobi.combo.XmlDataSource#Clear
 * @see #GetPage
 */
nitobi.combo.List.prototype.Clear = function()
{
	var listBody = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
	listBody.innerHTML="";
	this.SetSelectedRowIndex(-1);
	this.SetSelectedRowValues(null);
}

/**
 * reserved for stretching the list. not currently used.
 * @private
 */
nitobi.combo.List.prototype.FitContent = function()
{
	var listBody = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
	var lastTable = listBody.childNodes[listBody.childNodes.length-1];
	var row=lastTable;
	while (row.childNodes[0] !=null && row.childNodes[0].className.indexOf("ComboBoxListColumnDefinition") == -1)
	{
		row = row.childNodes[0];
	}
	
	for (var i=0;i<row.childNodes.length;i++)
	{
		var width = nitobi.html.getWidth(row.childNodes[0]);
		if (this.widestColumn[i] < width)
		{
			this.widestColumn[i] = width;
		}
	}
}


/**
 * Adds a page to the list given some xml.
 * @param {String} PageXml The XML for the new page.
 * @private
 */
nitobi.combo.List.prototype.AddPage = function(PageXml, SearchSubstring)
{
	var datasource = this.GetXmlDataSource();
	var tmp=nitobi.xml.createXmlDoc(PageXml);
	var numNewRecords = tmp.selectNodes("//e").length;
	
	if (numNewRecords > 0)
	{
		var html = this.GetRowHTML(PageXml, SearchSubstring);
		var listBody = this.GetSectionHTMLTagObject(EBAComboBoxListBody);
		nitobi.html.insertAdjacentHTML(listBody,'beforeEnd',html,true);
		this.GenerateCss();
	}
	
	var numRecordsRetrieved = datasource.GetLastPageSize();
	// If the last page retrieved is smaller than the page size
	// hide the entire footer.
	if (0 == numNewRecords)
		this.SetFooterText(EbaComboUi[EbaComboUiEndOfRecords]);
	else
		this.SetFooterText(datasource.GetNumberRows() + EbaComboUi[EbaComboUiNumRecords]);
	
	this.AdjustSize();
	this.SetIFrameDimensions();
}

/**
 * Hides the footer section of the list.
 * @see #HideFooter
 */
nitobi.combo.List.prototype.HideFooter = function()
{
	var footer = this.GetSectionHTMLTagObject(EBAComboBoxListFooter);
	var footerStyle = footer.style;
	//footerStyle.visibility = "hidden";
	footerStyle.display = "none";
}

/**
 * Shows the footer section of the list.
 */
nitobi.combo.List.prototype.ShowFooter = function()
{
	var footer = this.GetSectionHTMLTagObject(EBAComboBoxListFooter);
	var footerStyle = footer.style;
	//footerStyle.visibility = "visible";
	footerStyle.display = "inline";
}

/**
 * Adds a row to the list.
 * This is equivalent to returning one row from the server datasource. This function
 * transforms the array into XML and adds the records to both the list (in order to display them) and also
 * to the XmlDataSource.  The array's length must equal the number of columns in the datasource. Note: This includes
 * values that aren't displayed in the list.
 * @param {Array} Values An array of values in the order that that the columns are defined
 * @see nitobi.combo.XmlDataSource#Clear
 * @see #Clear
 */
nitobi.combo.List.prototype.AddRow = function(Values)
{
	var xml="<root><e ";
	for (var i = 0; i < Values.length; i++)
	{
		xml += String.fromCharCode(i + 97) + "='" + nitobi.xml.encode(Values[i]) + "' ";
	}
	xml +=  "/></root>";
	this.GetXmlDataSource().AddPage(xml);
	this.AddPage(xml);
}

/**
 * Move up or down the list.
 * @param {Number} Action The key action you want to perform. It can be one of EBAMoveAction_UP or EBAMoveAction_DOWN.
 * @private
 */
nitobi.combo.List.prototype.Move = function(Action)
{
	var combo = this.GetCombo();
	var mode = combo.mode;

	// Some modes shouldn't drop down the list when you move. Only classic and unbound allow scrolling.
	// Additionally, if there is nothing in the textbox, smartsearch, smartlist, filter won't respond.
	if(mode=="compact" || this.GetXmlDataSource().GetNumberRows()==0 || (mode!="default" && mode!="unbound" && combo.GetTextBox().m_HTMLTagObject.value=="")) return false;
	var activeRow = this.GetActiveRow();
	this.Show();
	if (null == activeRow)
	{
		activeRow = this.GetRow(0,null);
	}
	else
	{
		var index = this.GetRowIndex(this.GetActiveRow());
		switch(Action){
			case(EBAMoveAction_UP):
			{
				index--;
				break;
			}
			case(EBAMoveAction_DOWN):
			{
				index++;
				break;
			}
			default:
			{

			}
		}
		if ((index >= 0) && (index < this.GetXmlDataSource().GetNumberRows()))
			activeRow = this.GetRow(index,null);
	}

	this.SetActiveRow(activeRow);
	this.ScrollIntoView(activeRow,false,true);
	return true;
}

/**
 * Returns a row given its index or id.
 * @param {Number} [Index] Set to null if not used. The index of the row.
 * @param {String} [Id] Set to null if not used. The id of the row.
 * @private
 */
nitobi.combo.List.prototype.GetRow = function(Index, Id)
{
	if (null != Index)
	{
		return document.getElementById("EBAComboBoxRow" + this.GetCombo().GetUniqueId() + "_" + Index);
	}
	if (null != Id)
		return document.getElementById(Id);
}