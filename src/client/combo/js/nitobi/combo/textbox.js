/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");
 
/**
 * Creates a TextBox object to be associated with a parent {@link nitobi.combo.Combo}.
 * @class The textbox is the class that manages the text input part of the Nitobi ComboBox.  You shouldn't
 * have to instantiate this class from script, rather you can get a reference to one using {@link nitobi.combo.Combo#GetTextBox}
 * @constructor
 * @param {HTMLElement} userTag The HTML object that represents TextBox
 * @param {nitobi.combo.Combo} comboObject The combo object that is the owner of the textbox
 * @param {Boolean} hasButton true if the textbox has a button associated with it, false otherwise
 */
nitobi.combo.TextBox = function(userTag, comboObject, hasButton)
{
	var DEFAULTCLASSNAME = "";
	if (nitobi.browser.IE)
	{
		DEFAULTCLASSNAME="ntb-combobox-text-ie";
	}
	else
	{
		DEFAULTCLASSNAME="ntb-combobox-text-moz";
	}
	var DEFAULTWIDTH="100px";
	var DEFAULTHEIGHT="";
	var DEFAULTEDITABLE=true;
	var DEFAULTVALUE="";
	var DEFAULTDATAFIELDINDEX=0;
	var DEFAULTSEARCHTERM="";
	var DEFAULTONEDITKEYUP="";
	this.SetCombo(comboObject);
	
	var oeku=(userTag ? userTag.getAttribute("OnEditKeyUpEvent") : null);
	((null == oeku) || ("" == oeku))
		? this.SetOnEditKeyUpEvent(DEFAULTONEDITKEYUP)
		: this.SetOnEditKeyUpEvent(oeku);

	var width=(userTag ? userTag.getAttribute("Width") : null);
	((null == width) || ("" == width))
		? this.SetWidth(DEFAULTWIDTH)
		: this.SetWidth(width);

	var height=(userTag ? userTag.getAttribute("Height") : null);
	((null == height) || ("" == height))
		? this.SetHeight(DEFAULTHEIGHT)
		: this.SetHeight(height);

	var ccn=(userTag ? userTag.getAttribute("CSSClassName") : null);
	((null == ccn) || ("" == ccn))
		? this.SetCSSClassName(DEFAULTCLASSNAME)
		: this.SetCSSClassName(ccn);

	var editable=(userTag ? userTag.getAttribute("Editable") : null);
	((null == editable) || ("" == editable))
		? this.SetEditable(DEFAULTEDITABLE)
		: this.SetEditable(editable);

	var value=(userTag ? userTag.getAttribute("Value") : null);
	((null == value) || ("" == value))
		? this.SetValue(DEFAULTVALUE)
		: this.SetValue(value);

	var dataTextField = comboObject.GetDataTextField();
	if (dataTextField != null)
		this.SetDataFieldIndex(comboObject.GetList().GetXmlDataSource().GetColumnIndex(dataTextField));
	else{
		var dfi=(userTag ? userTag.getAttribute("DataFieldIndex") : null);
		((null == dfi) || ("" == dfi))
			? this.SetDataFieldIndex(DEFAULTDATAFIELDINDEX)
			: this.SetDataFieldIndex(dfi);
	}

	var st=(userTag ? userTag.getAttribute("SearchTerm") : null);
	if ((null == st) || ("" == st)){
		this.SetSearchTerm(DEFAULTSEARCHTERM);
		this.SetIndexSearchTerm(DEFAULTSEARCHTERM);
	}else{
		this.SetSearchTerm(st);
		this.SetIndexSearchTerm(st);
	}
	/**
	 * @private
	 * @ignore
	 */
	this.hasButton = hasButton;
	/**
	 * @private
	 * @ignore
	 */
	this.m_userTag = userTag;
}

/**
 * Actively unloads the object, and destroys owned objects.
 * @private
 */
nitobi.combo.TextBox.prototype.Unload = function()
{
	if (this.m_List)
	{
		delete this.m_List;
		this.m_List = null;
	}
	if (this.m_Callback)
	{
		delete this.m_Callback;
		this.m_Callback = null;
	}
	_EBAMemScrub(this);
}

/**
 * Returns the name of a custom CSS class to associate with the textbox. 
 * <p>
 * If this is left as an empty string, then the 'ComboBoxText' class is used.  
 * Refer to the CSS file for details on these classes, and which CSS attributes 
 * you must supply to use custom classes.  You can include custom classes by using 
 * the HTML style tags or by using a stylesheet.
 * </p>
 * @type String
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 * @see #SetCSSClassName
 */
nitobi.combo.TextBox.prototype.GetCSSClassName = function()
{
	return (null==this.m_HTMLTagObject ? this.m_CSSClassName : this.m_HTMLTagObject.className);
}

/**
 * Sets the name of a custom CSS class to associate with the textbox. 
 * If this is left as an empty string, then the 'ComboBoxText ComboBoxTextDynamic' classes are used.  
 * Refer to the CSS file for details on these classes, and which CSS attributes you must supply to use custom classes.  You can
 * include custom classes by using the HTML style tags or by using a stylesheet.
 * @example
 * &#102;unction swapTextBoxClass(comboId, newClass)
 * {
 * 	var textbox = nitobi.getComponent(comboId).GetTextBox();
 * 	textbox.SetCSSClassName(newClass);
 * }
 * @param {String} CSSClassName The name of a custom CSS class to associate with the textbox. Do not include the dot in the class name
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 * @see #GetCSSClassName
 */
nitobi.combo.TextBox.prototype.SetCSSClassName = function(CSSClassName)
{
	if(null==this.m_HTMLTagObject)
		this.m_CSSClassName = CSSClassName;
	else
		this.m_HTMLTagObject.className = CSSClassName;
}

/**
 * Returns the height of the text box in HTML units, e.g., 50px.
 * In classic mode, if you increase the height of the textbox, you should also increase the height
 * of the button. In all modes except smartlist, if you increase the height of the textbox, you should also
 * increase the size of the font in the CSS file.
 * @type String
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.List#GetHeight
 * @see nitobi.combo.Button#SetHeight
 * @see #SetHeight
 * @see #GetWidth
 */
nitobi.combo.TextBox.prototype.GetHeight = function()
{
	return (null == this.m_HTMLTagObject ? this.m_Height : nitobi.html.Css.getStyle(this.m_HTMLTagObject, "height"));
}

/**
 * Sets the height of the text box in HTML units, e.g., 50px.
 * In classic mode, if you increase the height of the textbox, you should also increase the height
 * of the button. In all modes except smartlist, if you increase the height of the textbox, you should also
 * increase the size of the font in the CSS file.
 * @param {String} Height The height of the text box in HTML units, e.g., 50px
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.List#GetHeight
 * @see nitobi.combo.Button#SetHeight
 * @see #GetHeight
 * @see #SetWidth
 */
nitobi.combo.TextBox.prototype.SetHeight = function(Height)
{
	if(null==this.m_HTMLTagObject)
		this.m_Height = Height;
	else
		this.m_HTMLTagObject.style.height = Height;
}

/**
 * Returns the width of the text box in HTML units.
 * If the combo is in smartlist mode, then this width is the width of the textbox.
 * When in smartlist mode, you can also set the width to a percentage. In this mode, however, this is equivalent to 
 * {@link nitobi.combo.Combo#GetWidth}.
 * @type String
 * @see nitobi.combo.Combo#GetWidth
 * @see nitobi.combo.List#GetWidth
 * @see nitobi.combo.Button#GetWidth
 * @see #SetWidth
 * @see #GetHeight
 */
nitobi.combo.TextBox.prototype.GetWidth = function()
{
	if(null==this.m_HTMLTagObject)
		return this.m_Width;
	else
		return nitobi.html.Css.getStyle(this.GetHTMLContainerObject(), "width");
}

/**
 * Sets the width of the text box in HTML units.
 * If the combo is in smartlist mode, then this width is the width of the textbox.
 * When in smartlist mode, you can also set the width to a percentage. In this mode, however, this is equivalent to 
 * {@link nitobi.combo.Combo#GetWidth}.
 * @param {String} Width The width of the text box in HTML units
 * @see nitobi.combo.Combo#GetWidth
 * @see nitobi.combo.List#SetWidth
 * @see nitobi.combo.Button#SetWidth
 * @see #GetWidth
 * @see #SetHeight
 */
nitobi.combo.TextBox.prototype.SetWidth = function(Width)
{
	this.m_Width = Width;
	if(null!=this.m_HTMLTagObject)
	{
		this.m_HTMLTagObject.style.width = Width;
	}
}

/**
 * The tag associated with the button. Only available after initialize.
 * @type HTMLNode
 * @private
 */
nitobi.combo.TextBox.prototype.GetHTMLTagObject = function()
{
	return this.m_HTMLTagObject;
}

/**
 * The tag associated with the button. Only available after initialize.
 * @param {HTMLNode} HTMLTagObject The value of the property you want to set.
 * @private
 */
nitobi.combo.TextBox.prototype.SetHTMLTagObject = function(HTMLTagObject)
{
	this.m_HTMLTagObject = HTMLTagObject;
}

/**
 * Returns the div containing the input field of the ComboBox
 * @type HTMLElement
 */
nitobi.combo.TextBox.prototype.GetHTMLContainerObject = function()
{
	return document.getElementById("EBAComboBoxTextContainer" + this.GetCombo().GetUniqueId());
}

/**
 * Returns true if the user can type in the textbox and false otherwise.
 * The rest of the combo is still navigable when this property is false, and a value will be displayed
 * in it once the user makes a selection.  Use this if you want the user to select a value from the list, and not type a custom value.
 * @type String
 * @see #SetEditable
 * @see nitobi.combo.Combo#GetEnabled
 */
nitobi.combo.TextBox.prototype.GetEditable = function()
{
	if(null==this.m_HTMLTagObject)
		return this.m_Editable;
	else
		return this.m_HTMLTagObject.getAttribute("readonly");
}

/** 
 * Sets the editable property of the textbox.
 * The rest of the combo is still navigable when this property is false, and a value will be displayed
 * in it once the user makes a selection.  Use this if you want the user to select a value from the list, and not type a custom value.
 * @param {Boolean} Editable true if the user can type in the textbox and false otherwise
 * @see #GetEditable
 * @see nitobi.combo.Combo#GetEnabled
 */
nitobi.combo.TextBox.prototype.SetEditable = function(Editable)
{
	if(null==this.m_HTMLTagObject)
	{
		this.m_Editable = Editable;
	}
	else
	{
		if (Editable == true)
		{
			this.m_HTMLTagObject.removeAttribute("readonly");
		}
		else
		{
			this.m_HTMLTagObject.setAttribute("readonly", "true");
		}
	}
}

/**
 * Returns the text value in the textbox.
 * This can be a custom value that the user has typed.  Setting this value does not
 * mean a specific list item will be selected. To check if the user has selected something
 * from the list, use {@link nitobi.combo.Combo#GetSelectedRowIndex}. To set a specific item from the list as selection, use
 * {@link nitobi.combo.List#SetSelectedRow} in conjunction with this property.
 * @type String
 * @see nitobi.combo.XmlDataSource#GetRow
 * @see #SetValue
 */
nitobi.combo.TextBox.prototype.GetValue = function()
{
	if(null==this.m_HTMLTagObject)
		return this.m_Value;
	else
		return this.m_HTMLTagObject.value;
}

/**
 * Sets the text value in the textbox.
 * Setting this value does not mean a specific list item will be selected. 
 * To check if the user has selected something
 * from the list, use {@link nitobi.combo.Combo#GetSelectedRowIndex}. To set 
 * a specific item from the list as selection, use
 * {@link nitobi.combo.List#SelectedRow} in conjunction with this property.
 * @param {String} Value The text value in the textbox
 * @param {Boolean} PutSmartListSeparator In smartlist mode, set this to true if you want the smartlist separator added to the end of the selection
 * @see nitobi.combo.XmlDataSource#GetRow
 * @see #GetValue
 */
nitobi.combo.TextBox.prototype.SetValue = function(Value, PutSmartListSeparator)
{
	if(null==this.m_HTMLTagObject)
	{
		this.m_Value = Value;
	}
	else
	{
		if(this.GetCombo().mode=="smartlist")
		{
			this.SmartSetValue(Value, PutSmartListSeparator);
		}
		else
		{
			this.m_HTMLTagObject.value = Value;
			// Set the hidden field for posting purposes.
			this.m_TextValueTag.value = Value;
		}
	}
}

/**
 * @private
 */
nitobi.combo.TextBox.prototype.SmartSetValue = function(Value, PutSmartListSeparator)
{
	var t = this.m_HTMLTagObject;
	var combo = this.GetCombo();
	var lio = t.value.lastIndexOf(combo.SmartListSeparator);
	if(lio > -1)
	{
		Value = t.value.substring(0,lio) + combo.SmartListSeparator + " " + Value;
	}
	if(PutSmartListSeparator)
	{
		Value += combo.SmartListSeparator + " ";
	}
	t.value = Value;
	this.m_TextValueTag.value = Value;
}

/**
 * Returns the index of the datafield (data column) to use as a datasource for the textbox.
 * When the user types in the textbox, the combo will search this column for a match. Similarly, when the
 * user clicks a row, this column's value will be entered into the textbox.
 * @type Number
 * @see #SetDataFieldIndex
 * @see nitobi.combo.ListColumnDefinition#GetDataFieldIndex
 * @see nitobi.combo.Combo#GetDataTextField
 * @see nitobi.combo.Combo#GetDataValueField
 */
nitobi.combo.TextBox.prototype.GetDataFieldIndex = function()
{
	return this.m_DataFieldIndex;
}

/**
 * Sets the index of the datafield (data column) to use as a datasource for the textbox.
 * When the user types in the textbox, the combo will search this column for a match. Similarly, when the
 * user clicks a row, this column's value will be entered into the textbox.
 * @param {Number} DataFieldIndex The index of the datafield (data column) to use as a datasource for the textbox
 * @see #GetDataFieldIndex
 * @see nitobi.combo.ListColumnDefinition#SetDataFieldIndex
 * @see nitobi.combo.Combo#GetDataTextField
 * @see nitobi.combo.Combo#GetDataValueField
 */
nitobi.combo.TextBox.prototype.SetDataFieldIndex = function(DataFieldIndex)
{
	this.m_DataFieldIndex = parseInt(DataFieldIndex);
}

/**
 * Returns the parent combo object.
 * This returns a handle to the Combo that owns the textbox.  
 * This is equivalent to the statement: <code>$("ComboID").jsObject</code>.
 * @type nitobi.combo.Combo
 */
nitobi.combo.TextBox.prototype.GetCombo = function()
{
	return this.m_Combo;
}

/**
 * Set the parent Combo object.
 * @param {nitobi.combo.Combo} Combo The combo object to set as the parent.
 * @private
 */
nitobi.combo.TextBox.prototype.SetCombo = function(Combo)
{
	this.m_Combo = Combo;
}

/**
 * Returns the substring the user has typed in the combo box and is currently being used
 * to populate the list.
 * @type String 
 * @private
 */
nitobi.combo.TextBox.prototype.GetSearchTerm = function()
{
	return this.m_SearchTerm;
}

/**
 * The substring the user has typed in the combo box and is currently being used
 * to populate the list.
 * @param {String} SearchTerm The value of the property you want to set.
 * @private
 */
nitobi.combo.TextBox.prototype.SetSearchTerm = function(SearchTerm)
{
	this.m_SearchTerm = SearchTerm;
}

/**
 * This is the search term that was sent to the gethandler for the initial page
 * either when the combo is loaded or when the user searched for something that
 * was not in the local cache. It only changes when the combo does a db hit.
 * @type
 * @private
 */
nitobi.combo.TextBox.prototype.GetIndexSearchTerm = function()
{
	return this.m_IndexSearchTerm;
}

/**
 * This is the search term that was sent to the gethandler for the initial page
 * either when the combo is loaded or when the user searched for something that
 * was not in the local cache. It only changes when the combo does a db hit.
 * @param {String} IndexSearchTerm The value of the property you want to set.
 * @private
 */
nitobi.combo.TextBox.prototype.SetIndexSearchTerm = function(IndexSearchTerm)
{
	this.m_IndexSearchTerm = IndexSearchTerm;
}

/**
 * Fires when the user changes the text in the text box.
 * @param {Object} e An event object.
 * @private
 */
nitobi.combo.TextBox.prototype.OnChanged = function(e)
{
	this.m_skipBlur=true;
	var combo = this.GetCombo();
	var list = combo.GetList();
	list.SetActiveRow(null);
	var searchValue = this.GetValue();
	this.m_TextValueTag.value = searchValue;
	var previousSearchTerm = this.GetSearchTerm();
	
	if (combo.mode=="smartsearch" || combo.mode=="smartlist" || combo.mode=="filter" || combo.mode=="compact")
	{
		list.GetXmlDataSource().m_Dirty=true;
	}		

	if(combo.mode=="smartlist")
	{
		var lio = searchValue.lastIndexOf(combo.SmartListSeparator);
		if(lio > -1)
			searchValue = searchValue.substring(lio + combo.SmartListSeparator.length).replace(/^\s+/,"");
	}

	// Check to see if the user is widening their search. Eg. if the original
	// string was Joel Gerard, and they have search now for Joel,
	// we must hit the db since the cache might hit, but not hit all
	// instances of Joel.

	if ((previousSearchTerm.indexOf(searchValue) == 0 && previousSearchTerm != searchValue))
	{
		list.GetXmlDataSource().m_Dirty=true;
	}
	this.SetSearchTerm(searchValue);
	if(e!=null)
		this.prevKeyCode = e.keyCode;

	// Search the list and find a matching row.
	// Search based on the column we display in the textbox.
	var dfi = this.GetDataFieldIndex();
	var This = this;
	var currentKeyCode = (e != null ? e.keyCode : 0);
	this.m_CurrentKeyCode = currentKeyCode;
	this.m_List = list;
	
	this.m_Event = e;
	this.m_Callback= _TextboxCallback;
	this.m_skipBlur = false;
	// Don't do this. It creates mem leaks.
		/*function(searchResult, list)
		{
			try
			{
				// Reset the previously selected values.
				list.SetSelectedRowValues(null);
				list.SetSelectedRowIndex(-1);
				var row = null;
				if (searchResult > -1)
				{
					var rowId = "EBAComboBoxRow" + combo.GetUniqueId() + "_" + searchResult;
					row=list.ifd.getElementById(rowId);
					// 46 = del, 8 = backspace
					if(""!=searchValue && (null==e || (currentKeyCode!=46 && currentKeyCode!=8)) && (null!=e || (This.prevKeyCode!=46 && This.prevKeyCode!=8)) && combo.mode!="smartlist" && combo.mode!="smartsearch")
					{
						This.TypeAhead(list.GetXmlDataSource().GetRowCol(searchResult,dfi),This.GetSearchTerm().length,This.GetSearchTerm());
					}
					list.SetActiveRow(row);
				}
				if(e!=null && searchResult > -1 && list.InitialSearchOnce!=true)
				{
					list.Show();
					list.ScrollIntoView(row,true);
				}
				This.m_skipBlur=false;
			}
			catch(err)
			{

			}
		};*/
	this.m_List.Search(searchValue,dfi,this.m_Callback);
}

/**
 * @private
 */
function _TextboxCallback(searchResult, list)
{
	var combo = list.GetCombo();

	
	var tb = combo.GetTextBox();

	var e = tb.m_Event;

	var currentKeyCode = tb.m_CurrentKeyCode;
	
	// Reset the previously selected values.
	list.SetSelectedRowValues(null);
	list.SetSelectedRowIndex(-1);
	var searchValue = tb.GetSearchTerm();
	
	var tb = list.GetCombo().GetTextBox();
	var row = null;
	if (searchResult > -1)
	{
		var rowId = "EBAComboBoxRow" + combo.GetUniqueId() + "_" + searchResult;
		row=document.getElementById(rowId);
		// 46 = del, 8 = backspace
		if(""!=tb.searchValue && (null==e || (currentKeyCode!=46 && currentKeyCode!=8)) && (null!=e || (tb.prevKeyCode!=46 && tb.prevKeyCode!=8)) && combo.mode!="smartlist" && combo.mode!="smartsearch")
		{
			tb.TypeAhead(list.GetXmlDataSource().GetRowCol(searchResult,tb.GetDataFieldIndex()),tb.GetSearchTerm().length,tb.GetSearchTerm());
			list.SetSelectedRow(searchResult);
		}
		list.SetActiveRow(row);
	}
	if(e!=null && searchResult > -1 && list.InitialSearchOnce!=true)
	{
		list.Show();
		list.ScrollIntoView(row,true);
	}
	tb.m_skipBlur=false;
}

/**
 * @private
 */
nitobi.combo.TextBox.prototype.TypeAhead = function(txt)
{
	var t = this.m_HTMLTagObject;
	var x = nitobi.html.getCursor(t);

	// Some explanation required here:
	// This is a temporary thing. If you remove this, you will notice another
	// search thread will replace the value of the textbox, just before
	// setting the value given by the variable txt. Apparently,
	// the abort function in getpage doesn't do enough in cancelling
	// old search threads in favour of new.There maybe something wrong there.
	// This quick fix was due to 
	// time constraint. It is not ideal. It simply ignores older
	// search threads. These threads should be cancelled somehow though.
	// TODO: this is important.
	if (txt.toLowerCase().indexOf(t.value.toLowerCase()) != 0)
	{
		// This is an old search thread. Don't do anything more.
		return;
	}
	
	// IMPORTANT NOTE (raised by Alexei):
	// currently, we replace the user's input with the type-ahead text so
	// this kills any casing; this behavior is similar to Google Suggest;
	// ok for now (and perhaps even desirable);
	// IF there's a need to change this, simply take the user's
	// current input and append a substring of the type-ahead text instead
	this.SetValue(txt);
	nitobi.html.highlight(t,x);
}

/**
 * @private
 */
nitobi.combo.TextBox.prototype.OnMouseOver = function(firstTime)
{
	if (this.GetCombo().GetEnabled())
	{
		// Don't change the classname if height is 100%. 
		// IE BUG.	
		if (this.GetHeight() != "100%")
		{
			nitobi.html.Css.swapClass(this.GetHTMLContainerObject(), "ntb-combobox-text-dynamic", "ntb-combobox-text-dynamic-over");
			nitobi.html.Css.addClass(this.m_HTMLTagObject, "ntb-combobox-input-dynamic");
		}
		if(firstTime)
		{
			var b = this.GetCombo().GetButton();
			if(null!=b)
				b.OnMouseOver(null, false);
		}
	}
}

/**
 * @private
 */
nitobi.combo.TextBox.prototype.OnMouseOut = function(firstTime)
{
	if (this.GetCombo().GetEnabled())
	{
		// Don't change the classname if height is 100%. 
		// IE BUG.
		if (this.GetHeight() != "100%")
		{
			nitobi.html.Css.swapClass(this.GetHTMLContainerObject(), "ntb-combobox-text-dynamic-over", "ntb-combobox-text-dynamic");
			nitobi.html.Css.removeClass(this.m_HTMLTagObject, "ntb-combobox-input-dynamic");
		}
		if(firstTime)
		{
			var b = this.GetCombo().GetButton();
			if(null!=b)
			{
				b.OnMouseOut(null, false);
			}
		}
	}
}

/**
 * workaround: tells textbox not to call the user defined onfocus fnc in the next OnFocus()
 * @private
 */
nitobi.combo.TextBox.prototype.ToggleHidden = function()
{
	this.m_ToggleHidden = true;
}

/**
 * workaround: tells textbox to call the user defined onfocus fnc in the next OnFocus()
 * @private
 */
nitobi.combo.TextBox.prototype.ToggleShow = function()
{
	this.m_ToggleShow = true;
}

/**
 * Returns the HTML that is used to render the object.
 * @private
 */
nitobi.combo.TextBox.prototype.GetHTMLRenderString = function()
{
	// HTML For the textbox. Note that we only call blur if the mouse is not over the list.
	// Otherwise the blur cancels the onclick event for some reason.
	// keyup is used for the textbox.onchanged. this is better than the dhtml onchange.
	var c = this.GetCombo();
	var comboId = c.GetId();
	// Encode ' and " because they break the textbox rendering.
	var value = this.GetValue().replace(/\'/g,"&#39;").replace(/\"/g,"&quot;");
	// note:
	// - keeping <input type="text"></input><img></img> on the same line w/o any spaces, breaks, etc.
	// is important to ensuring that no gap appears between the two elements so do NOT put an
	// "\n" before/after this html bit
	// - of course, the <nobr></nobr> is necessary to keep the two together also (nobr is not
	// written in this context... see parent context)
	var w = this.GetWidth();
	var h = this.GetHeight();
	var smartlist = c.mode=="smartlist";
	var html="";

	// The style of the textbox.
	var textStyle;

	textStyle = (null!=w && ""!=w ? "width:"+w+";" : "")
				+ (null!=h && ""!=h ? "height:"+h+";" : "");

	// TextArea has a bug in IE whereby the width changes when set to a 100% when you type.
	// We have to wrap it in a span tag to control the width and height.
	
	html += "<div id=\"EBAComboBoxTextContainer" + this.GetCombo().GetUniqueId()+ "\" class=\"ntb-combobox-text-container ntb-combobox-text-dynamic\" style=\"" + (this.hasButton?"border-right:0px solid white;" : "") + (smartlist && nitobi.browser.IE?"width:" + w + ";":"") + "\">";
	if (smartlist && nitobi.browser.IE)
	{
		html+="<span style='" + textStyle + "'>";
		// Redefine the textarea style to fill the span.
		textStyle="width:100%;height:"+h+";overflow-y:auto;";
	}
	html+="<" + (smartlist==true ? "textarea" : "input") + " id=\"EBAComboBoxText" + comboId + "\" name=\"EBAComboBoxText" + comboId + "\" type=\"TEXT\" class='"
		+ this.GetCSSClassName() + "' " +(this.GetEditable().toString().toLowerCase()=="true" ? "" : "readonly='true'") + " AUTOCOMPLETE='OFF' value='"
		+ value + "'  "
		+ "style=\"" + textStyle + "\" "
		+ "onblur='var combo=document.getElementById(\""+comboId+"\").object; if(!(combo.m_Over || combo.GetList().m_skipBlur)) document.getElementById(\"" + comboId + "\").object.GetTextBox().OnBlur(event)' "
		+ "onkeyup='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnKeyOperation(event,0)' "
		+ "onkeypress='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnKeyOperation(event,1)' "
		+ "onkeydown='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnKeyOperation(event,2)' "
		+ "onmouseover='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnMouseOver(true)' "
		+ "onmouseout='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnMouseOut(true)' "
		+ "onpaste='window.setTimeout(\"document.getElementById(\\\"" + comboId + "\\\").object.GetTextBox().OnChanged()\",0)' "
		+ "oninput='window.setTimeout(\"document.getElementById(\\\"" + comboId + "\\\").object.GetTextBox().OnChanged()\",0)' "
		+ "onfocus='document.getElementById(\"" + comboId + "\").object.GetTextBox().OnFocus()' "
		// I removed the closing "</input>" to IE 7 from losing focus and then editing the listbox table itself.
		+ "tabindex='" + c.GetTabIndex() + "'>" + (smartlist==true ? value : "") + (smartlist==true ? "</textarea>" : "")
		// Create a hidden field for posting purposes. When the textbox is disabled
		// it doesn't post.
		+ "<input id=\"EBAComboBoxTextValue" + comboId + "\" name=\""+comboId+"\" type=\"HIDDEN\" value=\""+value+"\">";
	
	html += "</div>";
	if(smartlist && nitobi.browser.IE)
	{
		html+="</span>";
	}
	return html;
}

/**
 * Initializes the object after creation.
 * @private
 */
nitobi.combo.TextBox.prototype.Initialize = function()
{
	this.m_ToggleHidden=false;
	this.m_ToggleShow=false;
	this.focused=false;
	this.m_skipBlur=false;
	this.m_skipFocusOnce=false;
	this.prevKeyCode = -1;
	this.skipKeyUp=false;
	this.SetHTMLTagObject(document.getElementById("EBAComboBoxText" + this.GetCombo().GetId()));

	/// <property name="m_TextValueTag" type="object" access="private" default="" readwrite="readwrite">
	/// <summary>
	/// This is a handle to the hidden field that is used to post the textbox value.
	/// </summary>
	/// </property>
	this.m_TextValueTag = document.getElementById("EBAComboBoxTextValue"+this.GetCombo().GetId());

	if(!this.GetCombo().GetEnabled())
	{
		this.Disable();
	}
	// Don't user this after init. Use the proper accessors.
	this.m_userTag = null;
}

/**
 * Disables user interaction with the textbox.
 * @private
 */
nitobi.combo.TextBox.prototype.Disable = function()
{
	nitobi.html.Css.swapClass(this.GetHTMLContainerObject(), "ntb-combobox-text-container", "ntb-combobox-text-container-disabled");
	nitobi.html.Css.addClass(this.m_HTMLTagObject, "ntb-combobox-input-disabled");
	this.m_HTMLTagObject.disabled = true;
}

/**
 * Enables user interaction with the textbox.
 * @private
 */
nitobi.combo.TextBox.prototype.Enable = function()
{
	nitobi.html.Css.swapClass(this.GetHTMLContainerObject(), "ntb-combobox-text-container-disabled", "ntb-combobox-text-container");
	nitobi.html.Css.removeClass(this.m_HTMLTagObject, "ntb-combobox-input-disabled");
	this.m_HTMLTagObject.disabled = false;
}

/**
 * Fires when the textbox loses focus.
 * @private
 */
nitobi.combo.TextBox.prototype.OnBlur = function(e)
{
	var combo = this.GetCombo();
	var list = combo.GetList();
	if(this.m_skipBlur || combo.m_Over) return;
	this.focused=false;
	list.Hide();
	eval(combo.GetOnBlurEvent());
}

/**
 * Fires when the textbox gains focus.
 * @private
 */
nitobi.combo.TextBox.prototype.OnFocus = function(){
	//TODO:
	//combo = this.GetCombo();
	//combo.m_StateMgr.SetState(nitobi.components.combo.stateFocus, nitobi.components.combo.stateFocus_FOCUS);
	if(this.m_skipBlur || this.m_skipFocusOnce){
		this.m_skipFocusOnce=false;
		return;

	}
	this.focused=true;
	var isVisible;
	isVisible=this.GetCombo().GetList().IsVisible();
	if(!isVisible || this.m_ToggleShow){
		this.m_ToggleShow=false;
		if(this.m_ToggleHidden)
			this.m_ToggleHidden=false;
		else
			eval(this.GetCombo().GetOnFocusEvent());
	}
}

/**
 * Sets the javascript that is run when a pressed key is released
 * This function is called a key that modifies the contents of the textbox is released.
 * You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * TextBox html tag you can set it to: <code>OnEditKeyUpEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * TextBox object. You can then use {@link #GetCombo} to retrieve a handle to the combo object.
 * @param {String} eventHandler Valid javascript that is run when a pressed key is released
 * @see #GetOnEditKeyUpEvent
 */
nitobi.combo.TextBox.prototype.SetOnEditKeyUpEvent = function(eventHandler)
{
	this.m_OnEditKeyUpEvent=eventHandler;
}

/**
 * Returns the javascript that is run when a pressed key is released
 * This function is called a key that modifies the contents of the textbox is released.
 * You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * TextBox html tag you can set it to: <code>OnEditKeyUpEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * TextBox object. You can then use {@link #GetCombo} to retrieve a handle to the combo object.
 * @type String
 * @see #SetOnEditKeyUpEvent
 */
nitobi.combo.TextBox.prototype.GetOnEditKeyUpEvent = function()
{
	return this.m_OnEditKeyUpEvent;
}

/**
 * Called when some kind of key event is fired.
 * @param {Object} e Either an event object in Mozilla or null in IE, in which case window.event will be used.
 * @param {Number} EventType The type of key event.
 * @private
 */
nitobi.combo.TextBox.prototype.OnKeyOperation = function(e,EventType)
{
	if (this.GetEditable() == "false")
	{
		return;
	}
	// in Moz, e!=null, in IE e==null
	e = e ? e : window.event;

	// Types of events this function is linked to.
	var EVENT_KEYUP=0;
	var EVENT_KEYPRESS=1;
	var EVENT_KEYDOWN=2;
	// Various keys on the keyboard. Not ASCII.
	var KEY_ENTER = 13;
	var KEY_ESC = 27;
	var KEY_TAB = 9;
	var KEY_a = 65;
	var KEY_z = 90;
	var KEY_0 = 48;
	var KEY_9 = 57;
	var KEY_DOWN = 40;
	var KEY_UP = 38;
	var KEY_DEL = 46;
	var KEY_BACKSPACE = 8;
	var KEY_SPACE = 32;
	var KEY_NUMPAD0 = 96;
	var KEY_NUMPAD9 = 105;
	var KEY_HOME = 36;
	var KEY_END = 35;
	var KEY_LEFT = 37;
	var KEY_RIGHT = 39;
	var KEY_F1 = 112;
	var KEY_F12 = 123;
	var KEY_SHIFT = 16;
	var KEY_CTRL = 17;
	var KEY_ALT = 18;
	var KEY_PGUP = 33;
	var KEY_PGDN = 34;
	
	var t=this.m_HTMLTagObject;
	var combo = this.GetCombo();
	var list = combo.GetList();

	var keyCode = e.keyCode;
	combo.SetEventObject(e);
	var dfi = this.GetDataFieldIndex();

	// Separate the events. We'll deal with keys in one specific event only.
	switch(EventType){
		case(EVENT_KEYUP):
		{
			if(KEY_ENTER != keyCode && KEY_ESC != keyCode && KEY_TAB != keyCode
				&& (keyCode < KEY_PGUP || keyCode > KEY_DOWN)
				&& (keyCode < KEY_F1 || keyCode > KEY_F12)
				&& (keyCode < KEY_SHIFT || keyCode > KEY_ALT))
			{
				// In smartsearch, the cache is always considered dirty because
				// it searches anywhere inside a string.
				// IS THIS TRUE? I don't think so!. TODO: look at this issue. it seems to
				// me that the same widening rules apply. If you search for dog anywhere in
				// the string, then hits for og and do will be in the cache. The one problem
				// is that the page get may not be big enough. hmmmm...Does smartsearch support
				// paging? We may be able to optimise here.
				if (combo.mode=="smartsearch" || combo.mode=="smartlist" || combo.mode=="filter" || combo.mode=="compact")
				{
					list.GetXmlDataSource().m_Dirty=true;
				}
				this.OnChanged(e);
				eval(this.GetOnEditKeyUpEvent());
			}
			if(keyCode==KEY_UP || keyCode==KEY_DOWN || keyCode==KEY_PGUP || keyCode==KEY_PGDN || keyCode==KEY_ENTER){
				if(this.smartlistWA==true)
					this.smartlistWA=false;
				else
				{
				// 2005.04.26
				// code below doesn't work for IE; but since we're going to be at the end of the line
				// anyways, let's use the t.value=t.value hack (moves cursor to the end of the line)
					if(nitobi.browser.IE)
						t.value=t.value;
					else
						nitobi.html.setCursor(t,t.value.length);
				}
			}
			if(combo.mode=="smartlist" && keyCode==KEY_ENTER && list.GetActiveRow()!=null)
			{
				this.SetValue(list.GetSelectedRowValues()[this.GetDataFieldIndex()], true);
				list.SetActiveRow(null);
			}
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
			if(combo.mode=="smartlist"){
				var lio = t.value.lastIndexOf(combo.SmartListSeparator);
				if(this.lio != lio)
					list.Hide();
				this.lio = lio;
			}
			break;
		}
		case(EVENT_KEYDOWN):
		{
			switch(keyCode){
				case(KEY_ENTER):
				{
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
					if(combo.mode=="smartlist"){
						var lio = t.value.lastIndexOf(combo.SmartListSeparator);
						if(lio != this.lio){
							list.Hide();
							break;
						}
					}
					this.m_skipBlur=true;
					list.SetActiveRowAsSelected();

					list.Hide();
					t.focus();
					
					// Always call this when the user has pressed enter.
					eval(combo.GetOnSelectEvent());
					// Since this function is called by multiple different events,
					// only trigger this code on keydown.
					nitobi.html.cancelEvent(e);
					this.m_skipBlur=false;
					break;
				}
				case(KEY_TAB):
				{
					list.Hide();
					eval(combo.GetOnTabEvent());
					
					
					// Check to see if the conditions that prevent blurring 
					// are true. If so, set them to false.
					// Otherwise, in some cases ontab is called but onblur is not.
					// This is most noticeable when the mouse is over the list and tab is pressed.
					if (this.m_skipBlur || combo.m_Over)
					{
						this.m_skipBlur = false;
						combo.m_Over = false;
					}
					list.SetActiveRowAsSelected();
					eval(combo.GetOnSelectEvent());
					break;
				}
				case(KEY_ESC):
				{
					// Since this function is called by multiple different events,
					// only trigger this code on keydown.
					list.Hide();
					break;
				}
				case(KEY_UP):
				{
					if(this.Paging==true)
						break;
					var isVisible;
					isVisible=list.IsVisible();
					if(combo.mode=="smartlist" && ! isVisible){
						this.smartlistWA=true;
						break;
					}
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
					if(combo.mode=="smartlist"){
						var lio = t.value.lastIndexOf(combo.SmartListSeparator);
						if(lio != this.lio){
							list.Hide();
							break;
						}
					}
					this.m_skipBlur=true;
					this.cursor=nitobi.html.getCursor(t);
					if(true==list.Move(EBAMoveAction_UP)){
						t.focus();
						this.SetValue(list.GetXmlDataSource().GetRowCol(list.GetRowIndex(list.GetActiveRow()),dfi));
					}
					this.m_skipBlur=false;
					break;
				}
				case(KEY_DOWN):
				{
					if(this.Paging==true)
						break;
					var isVisible;
					isVisible=list.IsVisible();
					if(combo.mode=="smartlist" && ! isVisible){
						this.smartlistWA=true;
						break;
					}
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
					if(combo.mode=="smartlist"){
						var lio = t.value.lastIndexOf(combo.SmartListSeparator);
						if(lio != this.lio){
							list.Hide();
							break;
						}
					}
					this.m_skipBlur=true;
					this.cursor=nitobi.html.getCursor(t);
					var r = list.GetActiveRow();
					if(null!=r && list.GetRowIndex(r)==list.GetXmlDataSource().GetNumberRows()-1 && true==list.GetAllowPaging() && combo.mode=="default"){
						// need to clear the current active row NOW
						// or else if cleared after paging, a visual artifact appears in FireFox
						list.SetActiveRow(null);
						// this.Paging is needed to prevent user from cursoring thru the list
						// while paging is occuring (otherwise visual artifacts can appear)
						this.Paging=true;
						list.OnGetNextPage(EBAScrollToNewBottom, true);
					}
					else if(true==list.Move(EBAMoveAction_DOWN)){
						t.focus();
						this.SetValue(list.GetXmlDataSource().GetRowCol(list.GetRowIndex(list.GetActiveRow()),dfi));
					}
					this.m_skipBlur=false;
					break;
				}
				case(KEY_PGUP):
				{
					if(this.Paging==true)
						break;
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
					if(combo.mode=="smartlist"){
						var lio = t.value.lastIndexOf(combo.SmartListSeparator);
						if(lio != this.lio){
							list.Hide();
							break;
						}
					}
					this.m_skipBlur=true;
					var b = nitobi.Browser;
					var lb = list.GetSectionHTMLTagObject(EBAComboBoxListBody);
					var isVisible;
					isVisible=list.IsVisible();
					if(isVisible){
						var r = list.GetActiveRow() || list.GetRow(0);
						if(null!=r){
							var idx = list.GetRowIndex(r);
							while(0!=idx){
								r = list.GetRow(--idx);
								if(! b.IsObjectInView(r,lb))
									break;
							}
							b.ScrollIntoView(r,lb,false,true);
							list.SetActiveRow(r);
							this.SetValue(list.GetXmlDataSource().GetRowCol(idx,dfi));
						}
					}
					this.m_skipBlur=false;
					break;
				}
				case(KEY_PGDN):
				{
					if(this.Paging==true)
						break;
// 2005.04.27
// due to time constraints, we had to settle w/ this workaround - please fix if you think it's necessary
					if(combo.mode=="smartlist"){
						var lio = t.value.lastIndexOf(combo.SmartListSeparator);
						if(lio != this.lio){
							list.Hide();
							break;
						}
					}
					var isVisible;
					isVisible=list.IsVisible();
					if(!isVisible){
						if(combo.mode!="smartlist")
							list.Show();
					}
					else{
						this.m_skipBlur=true;
						var b = nitobi.Browser;
						var lb = list.GetSectionHTMLTagObject(EBAComboBoxListBody);
						var r = list.GetActiveRow() || list.GetRow(0);
						var idx = list.GetRowIndex(r);
						var end = list.GetXmlDataSource().GetNumberRows() - 1;
						while(idx!=end){
							r=list.GetRow(++idx);
							if(! b.IsObjectInView(r,lb))
								break;
						}
						if(idx==end && true==list.GetAllowPaging() && combo.mode=="default"){
							// need to clear the current active row NOW
							// or else if cleared after paging, a visual artifact appears in FireFox
							list.SetActiveRow(null);
							// this.Paging is needed to prevent user from cursoring thru the list
							// while paging is occuring (otherwise visual artifacts can appear)
							this.Paging=true;
							list.OnGetNextPage(EBAScrollToNewTop, true);
						}else{
							b.ScrollIntoView(r,lb,true,false);
							list.SetActiveRow(r);
							this.SetValue(list.GetXmlDataSource().GetRowCol(idx,dfi));
						}
						this.m_skipBlur=false;
					}
					break;
				}
				default:
				{

				}
			}
			break;
		}
		case(EVENT_KEYPRESS):
		{
			// to prevent artifacts in FireFox where a vertical scrollbar appears briefly
			// as the cursor moves to the next line due to ENTER before we actually
			// move the cursor back to the current line; unnecessary to have ENTER
			// key bubbled up anyways
			if(keyCode==KEY_ENTER)
				nitobi.html.cancelEvent(e);
			break;
		}
		default:
		{
		}
	}
	combo.SetEventObject(null);
}
