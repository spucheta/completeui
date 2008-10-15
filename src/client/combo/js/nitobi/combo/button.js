/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");

/**
 * The combo's button.
 * @class The button that is rendered for the ComboBox.
 * @constructor
 * @param {Object} userTag The HTML object that represents Button
 * @param {Object} comboObject The parent {@link nitobi.combo.Combo} object.
 * @see nitobi.combo.Combo
 */
nitobi.combo.Button = function(userTag, comboObject)
{
	try{

		var DEFAULTCLASSNAME="ntb-combobox-button";
		var DEFAULTPRESSEDCLASSNAME="ntb-combobox-button-pressed";
		var DEFAULTWIDTH="";
		var DEFAULTHEIGHT="";
		this.SetCombo(comboObject);

		var width=(userTag ? userTag.getAttribute("Width") : null);
		((null == width) || (width == ""))
			? this.SetWidth(DEFAULTWIDTH)
			: this.SetWidth(width);

		var height=(userTag ? userTag.getAttribute("Height") : null);
		((null == height) || (height == ""))
			? this.SetHeight(DEFAULTHEIGHT)
			: this.SetHeight(height);

		var dccn=(userTag ? userTag.getAttribute("DefaultCSSClassName") : null);
		((null == dccn) || (dccn == ""))
			? this.SetDefaultCSSClassName(DEFAULTCLASSNAME)
			: this.SetDefaultCSSClassName(dccn);

		var pccn=(userTag ? userTag.getAttribute("PressedCSSClassName") : null);
		((null == pccn) || (pccn == ""))
			? this.SetPressedCSSClassName(DEFAULTPRESSEDCLASSNAME)
			: this.SetPressedCSSClassName(pccn);

		this.SetCSSClassName(this.GetDefaultCSSClassName());
		/**
		 * @private
		 */
		this.m_userTag = userTag;
		/**
		 * @private
		 */
		this.m_prevImgClass = "ntb-combobox-button-img";

	}catch(err){


	}
}

/**
 * @private
 * @ignore
 */
nitobi.combo.Button.prototype.Unload = function()
{}

/**
 * The name of the CSS class that defines the combo's button in the normal position. Does not include the dot in the class name.
 * @type String
 */
nitobi.combo.Button.prototype.GetDefaultCSSClassName = function()
{
	return this.m_DefaultCSSClassName;
}

/**
 * Sets the name of the CSS class that defines the combo's button in the normal position.
 * If this is left as an empty string, then the 'ComboBoxButton' class is used.  Refer to the CSS file 
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can 
 * include a custom class by using the HTML style tags or by using a stylesheet.
 * @param {String} DefaultCSSClassName The name of the CSS class that defines the combo's button. Do not include the dot in the class name.
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see nitobi.combo.List#SetCSSClassName
 * @see nitobi.combo.TextBox#GetCSSClassName
 * @see #GetDefaultCSSClassName
 * @see #SetPressedCSSClassName
 */
nitobi.combo.Button.prototype.SetDefaultCSSClassName = function(DefaultCSSClassName)
{
	this.m_DefaultCSSClassName = DefaultCSSClassName;
}

/**
 * The name of the CSS class that defines the combo's button in the pressed position.
 * If this is left as an empty string, then the 'ComboBoxButtonPressed' class is used.  Refer to the CSS file 
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can 
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @type String
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see nitobi.combo.List#SetCSSClassName
 * @see nitobi.combo.TextBox#GetCSSClassName
 * @see #GetDefaultCSSClassName
 * @see #SetPressedCSSClassName
 */
nitobi.combo.Button.prototype.GetPressedCSSClassName = function()
{	
	return this.m_PressedCSSClassName;
}

/**
 * Sets the name of the CSS class that defines the combo's button in the pressed position. 
 * If this is left as an empty string, then the 'ComboBoxButtonPressed' class is used.  Refer to the CSS file 
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can 
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @param {String} PressedCSSClassName The name of the CSS class that defines the combo's button in the pressed position. Do not include the dot in the class name.
 * @see nitobi.combo.Combo#SetCSSClassName
 * @see nitobi.combo.List#SetCSSClassName
 * @see nitobi.combo.TextBox#GetCSSClassName
 * @see #GetDefaultCSSClassName
 * @see #SetPressedCSSClassName
 */
nitobi.combo.Button.prototype.SetPressedCSSClassName = function(PressedCSSClassName)
{
	this.m_PressedCSSClassName = PressedCSSClassName;
}

/**
 * Returns the button's height in HTML units, e.g. 16px.
 * @type String
 * @see #SetHeight
 * @see #SetWidth
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.TextBox#GetHeight
 * @see nitobi.combo.List#GetHeight
 */
nitobi.combo.Button.prototype.GetHeight = function()
{
	return (null == this.m_HTMLTagObject ? this.m_Height : this.m_HTMLTagObject.style.height);
}

/**
 * Sets the button's height in HTML units, e.g. 16px.
 * This will not stretch the button image.
 * @param {String} Height The button's height in HTML units, e.g. 16px.
 * @see #SetHeight
 * @see #SetWidth
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.TextBox#GetHeight
 * @see nitobi.combo.List#GetHeight
 */
nitobi.combo.Button.prototype.SetHeight = function (Height)
{
	if(null==this.m_HTMLTagObject)
		this.m_Height = Height;
	else
		this.m_HTMLTagObject.style.height = Height;
}

/**
 * Returns the button's width in HTML units, e.g. 16px.
 * @type String
 * @see #SetHeight
 * @see #SetWidth
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.TextBox#GetHeight
 * @see nitobi.combo.List#GetHeight
 */
nitobi.combo.Button.prototype.GetWidth = function ()
{
	if(null==this.m_HTMLTagObject)
		return this.m_Width;
	else
		return this.m_HTMLTagObject.style.width;
}

/**
 * Sets the button's width in HTML units, e.g. 16px.
 * This will not stretch the button image.
 * @param {String} Width The button's width in HTML units, e.g. 16px.
 * @see #SetHeight
 * @see #SetWidth
 * @see nitobi.combo.Combo#GetHeight
 * @see nitobi.combo.TextBox#GetHeight
 * @see nitobi.combo.List#GetHeight
 */
nitobi.combo.Button.prototype.SetWidth = function (Width)
{
	if(null==this.m_HTMLTagObject)
		this.m_Width = Width;
	else
		this.m_HTMLTagObject.style.width = Width;
}

/**
 * Returns the HTML tag. Only available after initialize has been called.
 * @type Object
 * @private
 */
nitobi.combo.Button.prototype.GetHTMLTagObject = function ()
{
	return this.m_HTMLTagObject;
}

/**
 * Sets the HTML tag.  Only available after initialize has been called.
 * @param {Object} HTMLTagObject The HTML Object
 * @private
 */
nitobi.combo.Button.prototype.SetHTMLTagObject = function (HTMLTagObject)
{
	this.m_HTMLTagObject = HTMLTagObject;
}

/**
 * Returns the combo object that owns this button.
 * This is equivalent to the statement: document.getElementById("ComboID").jsObject.
 * @type nitobi.combo.Combo
 */
nitobi.combo.Button.prototype.GetCombo = function ()
{
	return this.m_Combo;
}

/**
 * Sets the combo object that owns this one.
 * @param {nitobi.combo.Combo} Combo The combo object that is to be the new owner of this button
 * @private
 */
nitobi.combo.Button.prototype.SetCombo = function(Combo)
{
	this.m_Combo = Combo;
}

/**
 * Returns the class currently being used draw the button.
 * This property has been deprecated.  It is equivalent to GetDefaultCSSClassName.
 * @type String
 * @see #GetDefaultCSSClassName
 * @deprecated
 */
nitobi.combo.Button.prototype.GetCSSClassName = function ()
{
	return (null == this.m_HTMLTagObject ? this.m_CSSClassName : this.m_HTMLTagObject.className);
}

/**
 * Sets the class currently being used draw the button.
 * This property has been deprecated.  It is equivalent to SetDefaultCSSClassName.
 * @param {String} CSSClassName The CSS class to apply to the button
 * @see #SetDefaultCSSClassName
 * @deprecated
 */
nitobi.combo.Button.prototype.SetCSSClassName = function (CSSClassName)
{
	if(null==this.m_HTMLTagObject)
		this.m_CSSClassName = CSSClassName;
	else
		this.m_HTMLTagObject.className = CSSClassName;
}

/**
 * Handles the mouse over event for the button
 * @param {Object} TheImg The button's IMG element being moused over.
 * @param {Boolean} firstTime Whether or not to subsequently call the textbox's OnMouseOver.
 * @private
 */
nitobi.combo.Button.prototype.OnMouseOver = function (TheImg, firstTime)
{
	if (this.GetCombo().GetEnabled())
	{
		if(null==TheImg)
			TheImg=this.m_Img;
		this.m_prevImgClass = "ntb-combobox-button-img-over";
		TheImg.className = this.m_prevImgClass;
		if(firstTime)
			this.GetCombo().GetTextBox().OnMouseOver(false);
	}
}

/**
 * Handles the mouse out event for the button
 * @param {Object} TheImg The button's IMG element being moused over.
 * @param {Boolean} firstTime Whether or not to subsequently call the textbox's OnMouseOver.
 * @private
 */
nitobi.combo.Button.prototype.OnMouseOut = function (TheImg, firstTime)
{
	if(null==TheImg)
		TheImg=this.m_Img;
	this.m_prevImgClass = "ntb-combobox-button-img";
	TheImg.className=this.m_prevImgClass;
	if(firstTime)
		this.GetCombo().GetTextBox().OnMouseOut(false);
}

/**
 * Handles the mouse down event for the button
 * @param {Object} TheImg The button's IMG element being moused over.
 * @private
 */
nitobi.combo.Button.prototype.OnMouseDown = function (TheImg)
{
	if (this.GetCombo().GetEnabled())
	{
		if(null != TheImg)
			TheImg.className="ntb-combobox-button-img-pressed";
		this.OnClick();
	}
}

/**
 * Handles the mouse up event for the button
 * @param {Object} TheImg The button's IMG element being moused over.
 * @private
 */
nitobi.combo.Button.prototype.OnMouseUp = function (TheImg)
{
	if (this.GetCombo().GetEnabled())
	{
		if(null != TheImg)
			TheImg.className=this.m_prevImgClass;
	}
}

/**
 * Handles the mouse click event for the button
 * @private
 */
nitobi.combo.Button.prototype.OnClick = function ()
{
	var combo = this.GetCombo();
	// hide dropdowns for all other lists
	var allcombos = document.getElementsByTagName((!nitobi.browser.IE)?"ntb:Combo":"combo");
	for (var i=0; i<allcombos.length; i++){
		var other = allcombos[i].object;
		try
		{
			if (combo.GetId() != other.GetId())
				other.GetList().Hide();
		}
		catch(err)
		{
			// Do nothing. The list may not have been rendered yet.
		}
	}
	var l = combo.GetList();
	l.Toggle();
	var t = combo.GetTextBox();
	var tb = t.GetHTMLTagObject();
	if(t.focused)
		t.m_skipFocusOnce=true;
	tb.focus();
}

/**
 * Returns the HTML that is used to render the object.
 * @private
 */
nitobi.combo.Button.prototype.GetHTMLRenderString = function ()
{
	var comboId = this.GetCombo().GetId();
	var uid = this.GetCombo().GetUniqueId();
	// three notes:
	// - align=nitobi.browser.MOZ?"absbottom":"absmiddle" is very important to lining up the IMG w/ the textbox
	// - keeping <input type="text"></input><img></img> on the same line w/o any spaces, breaks, etc.
	// is important to ensuring that no gap appears between the two elements so do NOT put an
	// "\n" before/after this html bit
	// - of course, the <nobr></nobr> is necessary to keep the two together also (nobr is not
	// written in this context... see parent context)
	var w = this.GetWidth();
	var h = this.GetHeight();

	// In IE, if the ComboBox is on a page using SSL, it will prompt the user with a "This page is using
	// both secure and unsecure items" alert.  The cause is the src attribute of the image tag.
	if( (!nitobi.browser.IE) ) {
		var html =	"<span id='EBAComboBoxButton" + uid + "' " +
				"class='" + this.GetDefaultCSSClassName() + "' " +
				"style='" + (null!=w && ""!=w ? "width:"+w+";" : "") + (null!=h && ""!=h ? "height:"+h+";" : "") + "'>" +
				// Note: the img tag has a default src that may not exist; we replace it in initialize.
				"<img src='javascript:void(0);' class='ntb-combobox-button-img' id='EBAComboBoxButtonImg" + uid + "' " +
				"onmouseover='$(\"" + comboId + "\").object.GetButton().OnMouseOver(this, true)' "+
				"onmouseout='$(\"" + comboId + "\").object.GetButton().OnMouseOut(this, true)' "+
				// use onmousedown now: solves button image dragging bug (i.e. list stays open on blur)
				"onmousedown='$(\"" + comboId + "\").object.GetButton().OnMouseDown(this);return false;' "+
				"onmouseup='$(\"" + comboId + "\").object.GetButton().OnMouseUp(this)' "+
				"onmousemove='return false;' "+
				"></img></span>";
	} else {
		var html =	"<span id='EBAComboBoxButton" + uid + "' " +
					"class='" + this.GetDefaultCSSClassName() + "' " +
					"style='" + (null!=w && ""!=w ? "width:"+w+";" : "") + (null!=h && ""!=h ? "height:"+h+";" : "") + "'>" +
					// Note: the img tag has a default src that may not exist; we replace it in initialize.
					"<img class='ntb-combobox-button-img' id='EBAComboBoxButtonImg" + uid + "' " +
					"onmouseover='$(\"" + comboId + "\").object.GetButton().OnMouseOver(this, true)' "+
					"onmouseout='$(\"" + comboId + "\").object.GetButton().OnMouseOut(this, true)' "+
					// use onmousedown now: solves button image dragging bug (i.e. list stays open on blur)
					"onmousedown='$(\"" + comboId + "\").object.GetButton().OnMouseDown(this);return false;' "+
					"onmouseup='$(\"" + comboId + "\").object.GetButton().OnMouseUp(this)' "+
					"onmousemove='return false;' "+
					"></img></span>";
	}
	return html;
}

/**
 * Initializes the object after creation.
 * @private
 */
nitobi.combo.Button.prototype.Initialize = function ()
{
	var combo = this.GetCombo();
	var uid = combo.GetUniqueId();
	this.SetHTMLTagObject($("EBAComboBoxButton" + uid));
	var img = $("EBAComboBoxButtonImg" + uid);

	// The browser requires that every img tag has a src.  We use the backgound-image
	// in the CSS to display the button.gif. However, this causes an image not found
	// icon in the browser because img.src is null. Here we replace img.src with
	// blank.gif, found in the same directory as button.gif
	// Start by getting the button.gif url.
	var blankImgPath = nitobi.html.Css.getStyle(img,"background-image");
	// Replace button.gif with blank.gif, and remove url,(", and ") chars.
	blankImgPath = blankImgPath.replace(/button\.gif/g,"blank.gif");
	if (nitobi.browser.IE)
	{
		blankImgPath = blankImgPath.substr(5,blankImgPath.length-7);
	}
	else
	{
		blankImgPath = blankImgPath.substr(4,blankImgPath.length-5);
		// Replace \( with (. Moz adds the \ for some reason.
		blankImgPath = blankImgPath.replace(/\\\(/g,"(");
		// Replace \) with )
		blankImgPath = blankImgPath.replace(/\\\)/g,")");
	}
	img.src=blankImgPath;

	this.m_Img = img;
	this._onmouseover=img.onmouseover;
	this._onmouseout=img.onmouseout;
	this._onclick=img.onclick;
	this._onmousedown=img.onmousedown;
	this._onmouseup=img.onmouseup;
	if(!this.GetCombo().GetEnabled())
		this.Disable();
	// Don't user this after init. Use the proper accessors.
	this.m_userTag = null;
}

/**
 * Disables the button from user interaction.
 * @private
 */
nitobi.combo.Button.prototype.Disable = function ()
{
	var img = this.m_Img;
	img.onmouseover=null;
	img.onmouseout=null;
	img.onclick=null;
	img.onmousedown=null;
	img.onmouseup=null;
	img.className = "ntb-combobox-button-img-disabled";
}

/** 
 * Enables the button for user interaction.
 * @private
 */
nitobi.combo.Button.prototype.Enable = function ()
{
	var img = this.m_Img;
	img.onmouseover=this._onmouseover;
	img.onmouseout=this._onmouseout;
	img.onclick=this._onclick;
	img.onmousedown=this._onmousedown;
	img.onmouseup=this._onmouseup;
	img.className = "ntb-combobox-button-img";
}