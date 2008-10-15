/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.combo");

if (nitobi.combo == null) {
	/**
	 * @namespace The namespace for classes that make up 
	 * the Nitobi ComboBox component.
	 * @constructor
	 */
	nitobi.combo = function(){};
}

// Constants

// Number of combos left to load in loading sequence.
/**
 * @private
 */
nitobi.combo.numCombosToLoad = 0;
// Number of combos to load before the rest of the page loads.
/**
 * @private
 */
nitobi.combo.numCombosToLoadInitially=4;
// A multiplier that delays the combo loading, allowing others to load before it.
// Used to load top combos before bottom. In milliseconds.
/**
 * @private
 */
nitobi.combo.loadDelayMultiplier=10;

/**
 * Returns the element corresponding to the combobox with the supplied id.
 * To get the combobox javascript object, you can do the following:
 * @deprecated Use {@link nitobi#getComponent}
 * @param {String} id The id of the combobox.
 * @type HTMLElement
 */
nitobi.getCombo = function(id)
{
	return $(id).jsObject;
}

/**
 * @private
 */
nitobi.combo.initBase = function()
{
	if (nitobi.combo.initBase.done == false)
	{
		// Before we do anything, hide all the panels.
		var panels = [];
		var ebaPanels = document.getElementsByTagName((!nitobi.browser.IE)?"eba:ComboPanel":"combopanel");
		var ntbPanels = ((!nitobi.browser.IE)?document.getElementsByTagName("ntb:ComboPanel"):[]);
		for (var i=0;i<ntbPanels.length;i++)
		{
			panels.push(ntbPanels[i]);
		}
		for (var i=0;i<ebaPanels.length;i++)
		{
			panels.push(ebaPanels[i]);
		}
		for(var i=0; i<panels.length; i++)
		{
			panels[i].style.display = "none";
		}
			
		nitobi.combo.createLanguagePack();
			
		// Create an iframe that we'll use to show the list over
		// option boxes.  This is a fix for an ie bug whereby
		// the option control has a greater z-index than any 
		// other control. A note: it is not that much more expensive
		// to just create one iframe than check to see if
		// there are option boxes on the page.
		if (nitobi.browser.IE)
		{
			nitobi.combo.iframeBacker = document.createElement("IFRAME");
			nitobi.combo.iframeBacker.style.position="absolute";
			nitobi.combo.iframeBacker.style.zindex="1000";
			nitobi.combo.iframeBacker.style.visibility="hidden";
			nitobi.combo.iframeBacker.name="nitobi.combo.iframeBacker_Id";
			nitobi.combo.iframeBacker.id="nitobi.combo.iframeBacker_Id";
			nitobi.combo.iframeBacker.frameBorder=0;
			nitobi.combo.iframeBacker.src="javascript:true";
			// Insert the iframe after the body tag to avoid creating space at the bottom of the page.
			nitobi.html.insertAdjacentElement(document.body,"afterBegin",nitobi.combo.iframeBacker);
		}
		nitobi.combo.initBase.done = true;
	}
}

nitobi.combo.initBase.done = false;

/**
 * Initializies a combobox
 * @param {String/HTMLElement} el Either the id of the combobox or its declaration
 * @deprecated You should use {@link nitobi#loadComponent}
 */
nitobi.initCombo = function(el)
{
	nitobi.combo.initBase();
	var tag;
	if (typeof(el) == "string")
	{
		tag = $(el);
	}
	else
	{
		tag = el;
	}
	tag.object = new nitobi.combo.Combo(tag);
	tag.object.Initialize();
	tag.object.GetList().Render();
	return tag.object;
}

/**
 * Initializes all comboboxes on the page
 * @deprecated You should use {@link nitobi#loadComponent}
 */
nitobi.initCombos = function()
{
	nitobi.combo.initBase();
	var combos = [];
	var ebaCombos = document.getElementsByTagName((!nitobi.browser.IE)?"eba:Combo":"combo");
	var ntbCombos = ((!nitobi.browser.IE)?document.getElementsByTagName("ntb:Combo"):[]);
	for (var i=0;i<ntbCombos.length;i++)
	{
		combos.push(ntbCombos[i]);
	}
	for (var i=0;i<ebaCombos.length;i++)
	{
		combos.push(ebaCombos[i]);
	}
	if(0==document.styleSheets.length)
		alert("You are missing a link to the Web ComboBoxes' style sheet.");
	else
	{
		nitobi.combo.numCombosToLoad=combos.length;
		for(var i=0; i<combos.length; i++)
		{
		try
		{
			if (i>=nitobi.combo.numCombosToLoadInitially)
			{
				var delay=i*nitobi.combo.loadDelayMultiplier;
				window.setTimeout("try{$('"+combos[i].id+"').object = new nitobi.combo.Combo($('"+combos[i].id+"'));$('"+combos[i].id+"').object.Initialize();}catch(err){alert(err.message);}",delay);
				
			}
			else
			{
				nitobi.initCombo(combos[i]);				
			}
			}catch(err)
			{alert(err.message)};
		}
		
	}	
}

function InitializeEbaCombos()
{
	nitobi.initCombos();
}

/**
 * @private
 */
nitobi.combo.finishInit = function()
{
	nitobi.combo.resize();
	nitobi.html.attachEvent(window, "resize", nitobi.combo.resize);
	
	// Hook the unload event so that we have an opportunity to unload all
	// of our stuff.
	if( window.addEventListener )
	{
    	window.addEventListener( 'unload', nitobi.combo.unloadAll, false );
	} else if( document.addEventListener )
	{
		document.addEventListener( 'unload', nitobi.combo.unloadAll, false );
	} else if( window.attachEvent )
	{
		window.attachEvent( 'onunload', nitobi.combo.unloadAll );
	} else
	{
		if( window.onunload )
		{
			window.XTRonunload = window.onunload;
		}
		window.onunload = nitobi.combo.unloadAll;
	}
	try
	{
		eval("try{OnAfterIntializeEbaCombos()} catch(err){}");
	}catch(err){}




}

// Actively unload the combos. This is an effort to prevent mem leaks.
/**
 * @private
 */
nitobi.combo.unloadAll = function()
{
	var combos = [];
	var ebaCombos = document.getElementsByTagName((!nitobi.browser.IE)?"eba:Combo":"combo");
	var ntbCombos = ((!nitobi.browser.IE)?document.getElementsByTagName("ntb:Combo"):[]);
	for (var i=0;i<ntbCombos.length;i++)
	{
		combos.push(ntbCombos[i]);
	}
	for (var i=0;i<ebaCombos.length;i++)
	{
		combos.push(ebaCombos[i]);
	}

	if (combos)
	{
		for(var i=0; i<combos.length; i++)
		{


			if ((combos[i]) && (combos[i].object))
			{
				combos[i].object.Unload();
				combos[i].object = null;
			}
		}
		combos = null;
	}
	
	if (nitobi.browser.IE)
	{
		if (nitobi.combo.iframeBacker)
		{
			delete nitobi.combo.iframeBacker;
			nitobi.combo.iframeBacker=null;
		}
	}
}

// *****************************************************************************
// * nitobi.combo.resize
// *****************************************************************************
/**
 * @private
 */
nitobi.combo.resize = function()
{
	var combos = [];
	var ebaCombos = document.getElementsByTagName((!nitobi.browser.IE)?"eba:Combo":"combo");
	var ntbCombos = ((!nitobi.browser.IE)?document.getElementsByTagName("ntb:Combo"):[]);
	for (var i=0;i<ntbCombos.length;i++)
	{
		combos.push(ntbCombos[i]);
	}
	for (var i=0;i<ebaCombos.length;i++)
	{
		combos.push(ebaCombos[i]);
	}
	for(var i=0; i<combos.length; i++)
	{
		var combo = combos[i].object;
		if ("smartlist" != combo.mode)
		{
			// This is only used when the combo container has dimensions. If the combo doesn't
			// the user is using the textbox dimensions.
			if (combo.GetWidth() != null)
			{
				var uniqueId = combo.GetUniqueId();

				// Resize the combo to be 100% of the containing span.
				var textbox = combo.GetTextBox();
				var list = combo.GetList();
				
				var container = $(combo.GetId());
				var containerWidth = parseInt(combo.GetWidth());
				if ((!nitobi.browser.IE) && nitobi.Browser.GetMeasurementUnitType(combo.GetWidth()) == "px")
				{
					// Moz doesn't respect the container being set to a px. Therefore, 
					// in this case, we need to get the desired combo width.
					containerWidth = parseInt(combo.GetWidth());
				}
				
				var buttonTag = $("EBAComboBoxButtonImg" + uniqueId);

				var buttonWidth;
				if (null != buttonTag)
				{
					buttonWidth = nitobi.html.getWidth(buttonTag);
				}
				else
				{
					buttonWidth=0;
				}

				textbox.SetWidth((containerWidth-buttonWidth)+"px");
				list.OnWindowResized();
			}
		}
	}
}

/**
 * Creates a nitobi combobox.
 * @class This is the base class for the Nitobi ComboBox component.  Normally, you will instantiate the component
 * using the custom tags.  Here is a sample ComboBox declaration:
 * <pre class="code">
 * &lt;ntb:Combo id="myCombo" Mode="unbound" &gt;
 * 	&lt;ntb:ComboTextBox  DataFieldIndex=0 &gt;&lt;/ntb:ComboTextBox&gt;
 * 	&lt;ntb:ComboList Width="200px" AllowPaging="false" Height="180px" &gt;
 * 		&lt;ntb:ComboColumnDefinition Width="100px" DataFieldIndex=0&gt;&lt;/ntb:ComboColumnDefinition&gt;
 * 		&lt;ntb:ComboColumnDefinition Width="70px" DataFieldIndex=1&gt;&lt;/ntb:ComboColumnDefinition&gt;
 * 	&lt;/ntb:ComboList&gt;
 * 	&lt;ntb:ComboValues fields="City|Population"&gt;
 * 		&lt;ntb:ComboValue a="Vancouver" b="3,000,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Toronto" b="4,500,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Ottawa" b="1,000,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Halifax" b="900,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Calgary" b="1,500,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Red Deer" b="100,000" &gt;&lt;/ntb:ComboValue&gt;
 * 		&lt;ntb:ComboValue a="Prince George" b="200,000" &gt;&lt;/ntb:ComboValue&gt;
 * 	&lt;/ntb:ComboValues&gt;
 * &lt;/ntb:Combo&gt;
 * </pre>
 * Calling <code>nitobi.loadComponent('combo1');</code> will render a ComboBox at the location of that XML 
 * declaration in your web page. To access this API you get the combo object from its node in the HTML 
 * document. We can, for example, get the nitobi.combo.List object of the combobox:
 * <pre class="code">
 * var combo = nitobi.getComponent('combo1');
 * var list = combo.GetList();
 * </pre>
 * @constructor
 * @param {HTMLNode} userTag The HTML object that represents Combo
 */
nitobi.combo.Combo = function(userTag)
{
	var DEFAULTINITIALSEARCH=""; 
	var DEFAULTREQUESTMETHOD="GET";
	
	var ERROR_NOID="You must specify an Id for the combo box";
	var ERROR_NOXML="ntb:Combo could not correctly transform XML data. Do you have the MS XML libraries installed? These are typically installed with your browser and are freely available from Microsoft.";

	/**
	 * @private
	 */
	this.Version = "3.5";
	((null==userTag.id) || (""==userTag.id))
		? alert(ERROR_NOID)
		: this.SetId(userTag.id);
	
	var xmlDataSourceTag=null;
	var listTag=null;
	var buttonTag=null;
	var textboxTag=null;
	userTag.object=this;
	userTag.jsObject = this;
	/**
	 * @private
	 */
	this.m_userTag=userTag;
	var unboundComboValues=null;

	// TODO: Finish this implemenatino. Out of time.
	//this.m_StateMgr = new EbaStateManager;
	//this.m_StateMgr.SetOnChangeState(nitobi.components.combo.stateFocus,nitobi.components.combo.stateFocus_FOCUS,nitobi.components.combo.stateFocus_NOFOCUS,this.OnBlurEvent);
	
	// Enable warnings in the combo. This should be moved to debug, see the note below.
	this.BuildWarningList();
	var disabledWarnings = this.m_userTag.getAttribute("DisabledWarningMessages");
	if (!((null == disabledWarnings) || ("" == disabledWarnings)))
	{
		this.SetDisabledWarningMessages(disabledWarnings);
	}
	// See if the user wants debug messages turned on.
	var errorLevel=this.m_userTag.getAttribute("ErrorLevel");
	((null == errorLevel) || ("" == errorLevel))
		? this.SetErrorLevel("")
		: this.SetErrorLevel(errorLevel);

	// need to strip out whitespaces or else a space can appear before and/or after the combobox
	userTag.innerHTML=userTag.innerHTML.replace(/>\s+</g,"><").replace(/^\s+</,"<").replace(/>\s+$/,">");

	// Check to see if the user is building a quick combobox with one column
	// and key/value pairs.  Use one or the other.
	var dtf=userTag.getAttribute("DataTextField");
	var dvf=userTag.getAttribute("DataValueField");
	if((null==dtf) || (""==dtf))
	{
		dtf=dvf;
		userTag.setAttribute("DataTextField",dtf);
	}
	this.SetDataTextField(dtf);
	this.SetDataValueField(dvf);
	if((null != dtf) && ("" != dtf))
	{
		// See if there is a value field and if not, use the text field as value.
		if((null==dvf) || (""==dvf))
			dvf=dtf;
		this.SetDataValueField(dvf);
	}
	// Iterate through all the child tags and create the appropriate objects.
	for(var i=0; i < userTag.childNodes.length; i++)
	{
		var childTag = userTag.childNodes[i];
		var n = childTag.tagName;
		if(n)
		{
			// toLowerCase comparsion to eliminate IE/Moz case differences
			// remove ntb: namespace for Moz
			n = n.toLowerCase().replace(/^eba:/,"").replace(/^ntb:/,"");
			switch(n)
			{
				case "combobutton":
				{
					buttonTag=childTag;
					break;
				}
				case "combotextbox":
				{
					textboxTag=childTag;
					break;
				}
				case "combolist":
				{
					listTag=childTag;
					break;
				}
				case "xmldatasource":
				{
					// We want to try and minimize user confusion. Therefore, the XmlDatasource tag
					// is a child of the combo tag even though in our internal architecture it makes
					// more sense to have it as owned by the list. Additionally, we should wait until
					// all the list object is created.
					xmlDataSourceTag=childTag;
					break;
				}
				case "combovalues":
				{
					unboundComboValues=childTag;
				}
			}
		}
	}

	var DEFAULTMODE="default";


	var mode=this.m_userTag.getAttribute("Mode");
	if(null!=mode)
		mode=mode.toLowerCase();
	// note, we've changed "DEFAULT" to "CLASSIC" but code below still works
	// so internally, it's still referred to as "default" mode
	switch(mode)
	{
		case "smartsearch":
		case "smartlist":
		case "compact":
		case "filter":
		case "unbound":
			this.mode = mode;
			break;
		default:
			this.mode = DEFAULTMODE;
	}

	var durl = (listTag==null ? null : listTag.getAttribute("DatasourceUrl"));
	// if SMARTSEARCH, SMARTLIST, FILTER, it is absolutely necessary for the user
	// to specify a DatasourceURL or else, we'll default back to CLASSIC mode;
	// also, can't work w/ local dataset only (i.e. ComboValues) so default back
	// to CLASSIC mode
	if((unboundComboValues==null && durl==null) && this.mode!="compact")
	{
		this.mode=DEFAULTMODE;
	}
	// defaults to 25 if none specified
	var pagesize = 25;
	if(null!=listTag)
	{
		var ps = listTag.getAttribute("PageSize");
		if(ps!=null && ps!="")
			pagesize=ps;
	}

	var initsearch = userTag.getAttribute("InitialSearch");
	/**
	 * @private
	 */
	this.m_InitialSearch = "";
	if ((null == initsearch) || ("" == initsearch))
	{
		this.m_InitialSearch = DEFAULTINITIALSEARCH;
	}
	else
	{
		this.m_InitialSearch = initsearch;
	}
	 
	var rt=userTag.getAttribute("HttpRequestMethod");
	((null == rt) || ("" == rt))
		? this.SetHttpRequestMethod(DEFAULTREQUESTMETHOD)
		: this.SetHttpRequestMethod(rt);

	// this automatically takes care of the XmlDataSource tag for the user if
	// they've specified a DatasourceURL but neglected to specify an XmlDatasource
	// tag; previously, would crash
	/**
	 * @private
	 */
	this.m_NoDataIsland = unboundComboValues==null && durl!=null && xmlDataSourceTag==null;
	if(this.m_NoDataIsland)
	{
		// TODO: refactor this... xbrowser.js/XmlDataIslands() uses similar code
		var id = userTag.id + "XmlDataSource";
		// reuse listTag since we ONLY need to access the XmlId attribute
		listTag.setAttribute("XmlId", id);
		xmlDataSourceTag = listTag;
		durl += (durl.indexOf("?") == -1 ? "?" : "&");
		durl += "PageSize=" + pagesize;
		durl += "&StartingRecordIndex=0"  +  "&ComboId="+encodeURI(this.GetId())+"&LastString=";
	
		if (this.m_InitialSearch != null && this.m_InitialSearch!="")
		{
			durl += "&SearchSubstring=" + encodeURI(this.m_InitialSearch);
		}
		// Careful here. If there is anything before the XML declaration in an xml document, such as the 
		// junk that MS adds for their ASP debugging, then xml.load will fail. Instead, we have to 
		// manually load the data from the url, strip out anything that comes before <?xml.
		var loadedXml = nitobi.Browser.LoadPageFromUrl(durl, this.GetHttpRequestMethod());
		var declaredXmlIndex = loadedXml.indexOf("<?xml");
		if (declaredXmlIndex != -1)
			loadedXml =(loadedXml.substr(declaredXmlIndex));
		var d = nitobi.xml.createXmlDoc(loadedXml);
		d.async=false;

		var d2 = nitobi.xml.createXmlDoc(d.xml.replace(/>\s+</g,"><"));
		d2 = xbClipXml(d2, "root", "e", pagesize);
		document[id]=d2;
	}
	var modeIsDef = (this.mode==DEFAULTMODE || this.mode=="unbound");
	// only create button in CLASSIC (default) mode
	if(modeIsDef)
	{
		this.SetButton(new nitobi.combo.Button(buttonTag, this));
	}
	
	this.SetList(new nitobi.combo.List(listTag, xmlDataSourceTag, unboundComboValues, this));
	// in CLASSIC (default) mode, we don't need to have the right border (taken
	// care of by the button); whereas in the other modes, leave the right border
	// because there's no button
	this.SetTextBox(new nitobi.combo.TextBox(textboxTag, this, modeIsDef));
	// The mouse is not over the list.
	/**
	 * @private
	 */
	this.m_Over=false;
}

/**
 * Builds a list of all combo warning messages.
 * This should be moved to the debug class. However, since this is not shipped, this requires more work than time permits.
 * @private
 */
nitobi.combo.Combo.prototype.BuildWarningList = function ()
{
	this.m_WarningMessagesEnabled = new Array();
	this.m_DisableAllWarnings=false;
	this.m_WarningMessages = new Array();
	this.m_WarningMessages["cw001"]="The combo tried to search the server datasource for data.  " +
									"The server returned data, but no match was found within this data by the combo. The most "+
									"likely cause for this warning is that the combo mode does not match the gethandler SQL query type: "+
									"the sql query is not matching in the same way the combo is. Consult the documentation to see what " +
									"matches to use given the combo's mode.";
	this.m_WarningMessages["cw002"]="The combo tried to load XML data from the page. However, it encountered a tag attribute of the form <tag att='___'/> instead" +
									" of the form <tag att=\"___\"/>. A possible reason for this is encoding ' as &apos;. To fix this error correct the tag to use " +
									"<tag att=\"__'___\"/>. If you are manually encoding data, eg. for an unbound combo, do not encode ' as &apos; and do not use ' as your string literal. If you believe, "+
									"this warning was generated in error, you can disable it.";
	this.m_WarningMessages["cw003"]="The combo failed to load and parse the XML sent by the gethandler. Check your gethandler to ensure that it is delivering valid XML.";
}

/**
 * Disables warning messages issued by the combo. This is a comma separates list of ids or, to disable all warnings, set this to *.
 * @param {String} WraningIds A list of warning ids separated by commas. To prevent all warnings use only *
 * @example
 * HTML: &lt;... DisabledWarningMessages='cw001,cw002' ...&gt;
 * JAVASCRIPT: Combo.SetDisabledWarningMessages('cw001,cw002');
 * @see #SetErrorLevel
 * @private
 */
nitobi.combo.Combo.prototype.SetDisabledWarningMessages = function (WarningIds)
{
	if (WarningIds=="*")
	{
		this.m_DisableAllWarnings=true;
	}
	else
	{
		this.m_DisableAllWarnings=false;
		WarningIds = WarningIds.toLowerCase();
		WarningIds = WarningIds.split(",");
		for (var i=0;i<WarningIds.length;i++)
		{
			this.m_WarningMessagesEnabled[WarningIds[i]] = false;
		}
	}
}

/**
 * Returns true if a particular warning is enabled.
 * @param {String} WarningId The id of the warning.
 * @return True if the warning is enabled.
 * @type Boolean
 * @private
 */
nitobi.combo.Combo.prototype.IsWarningEnabled = function (WarningId)
{
	if (this.m_ErrorLevel=="")
	{
		return;
	}
	else
	{
		if (this.m_WarningMessagesEnabled[WarningId] == null)
		{
			this.m_WarningMessagesEnabled[WarningId] = true;
		}
		return this.m_WarningMessagesEnabled[WarningId] && this.m_DisableAllWarnings==false;
	}
}

/**
 * Set this to EBAERROR_LEVEL_DEBUG if you want to see debug messages.
 * If no value is supplied, no debug messages are shown.  To disable certain warning messages see DisabledWarningMessages.
 * @param {String} Value The error level.
 * @private
 */ 
nitobi.combo.Combo.prototype.SetErrorLevel = function (Value)
{
	this.m_ErrorLevel = Value.toLowerCase();
}

/**
 * Returns the width of the combo in html units, eg 100px or 100%.
 * If you use this property, TextBox.Width is ignored.  This does not set the width of 
 * the list: use {@link nitobi.combo.List#SetWidth} 
 * @type String
 * @see #GetHeight
 */
nitobi.combo.Combo.prototype.GetWidth = function ()
{
	return this.m_Width;
}

/**
 * Sets the width of the combo in html units, e.g. 100px or 100%.
 * If you use this property, TextBox.Width is ignored.  This does not set the width of 
 * the list: use {@link nitobi.combo.List#SetWidth} 
 * @param {String} Value The width in px or other HTML measurement type.
 * @see #GetWidth
 * @see #SetHeight
 */
nitobi.combo.Combo.prototype.SetWidth = function (Value)
{
	this.m_Width = Value;
}

/**
 * Returns the height of the combo in html units, e.g. 100px or 100%.
 * If you use this property, {@link nitobi.combo.TextBox#Height} is ignored. This property is only used when the 
 * mode is set to SmartList.  In all other modes, the height of the component
 * is defined in css.
 * @type String
 * @see #GetWidth
 * @see nitobi.combo.TextBox#SetHeight
 */
nitobi.combo.Combo.prototype.GetHeight = function ()
{
	return this.m_Height;
}

/**
 * Sets the height of the combo in html units, e.g. 100px or 100%.
 * If you use this property, {@link nitobi.combo.TextBox#Height} is ignored. This property is only used when the 
 * mode is set to SmartList.
 * @param {String} Value The Height in px or other measurement type.
 * @see #GetHeight
 * @see #SetWidth
 */
nitobi.combo.Combo.prototype.SetHeight = function (Value)
{
	this.m_Height = Value;
}

/**
 * @private
 */
function _EBAMemScrub(p_element)
{
    for(var l_member in p_element)    
    {        
        if ((l_member.indexOf("m_") == 0) || 
            (l_member.indexOf("$") == 0))
        {
            // Break the potential circular reference
            p_element[l_member] = null;
        }        
    }
}

/**
 * Actively unloads the object, and destroys owned objects.
 * @private
 */
nitobi.combo.Combo.prototype.Unload = function ()
{
	if (this.m_Callback)
	{
		delete this.m_Callback;
		this.m_Callback = null;
	}
	if (this.m_TextBox)
	{
		this.m_TextBox.Unload();
		delete this.m_TextBox;
		this.m_TextBox = null;
	}
	if (this.m_List)
	{
		this.m_List.Unload();
		delete this.m_List;
		this.m_List = null;
	}
	if (this.m_Button)
	{
		this.m_Button.Unload();
		delete m_Button;
	}
	var htmlTag = this.GetHTMLTagObject();
	_EBAMemScrub(this);
	_EBAMemScrub(htmlTag);

}

/**
 * Returns the kind of server request is used when requesting data, GET or POST. The default is GET.
 * In some cases a POST is useful because certain form fields are posted with the request.
 * @type String
 */
nitobi.combo.Combo.prototype.GetHttpRequestMethod = function ()
{
	return this.m_HttpRequestMethod;
}

/**
 * Sets the kind of server request is used when requesting data, GET or POST. The default is GET.
 * In some cases a POST is useful because certain form fields are posted with the request.
 * @param {String} HttpRequestMethod The request method.  Valid values are "GET" and "POST"
 * @see #GetHttpRequestMethod
 */
nitobi.combo.Combo.prototype.SetHttpRequestMethod = function (HttpRequestMethod)
{
	if(null == this.m_HTMLTagObject)
		this.m_HttpRequestMethod = HttpRequestMethod;
	else
		this.m_HTMLTagObject.className = HttpRequestMethod;
}

/**
 * Returns the name of a custom CSS class to associate with the entire combo box. 
 * If this is left as an empty string, then the 'ComboBox' class is used.  Refer to the CSS file 
 * for details on this class, and which CSS attributes you must supply to use a custom class.  You can 
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @example
 * &lt;ntb:Combo id="combo1" CSSClassName="customClass"&gt;&lt;/ntb:Combo&gt;
 * &lt;ntb:Combo id="combo2"&gt;&lt;/ntb:Combo&gt;
 * 
 * nitobi.getComponent("combo1").GetCSSClassName();  // Will return "customClass"
 * nitobi.getComponent("combo2").GetCSSClassName();  // Will return "ComboBox"
 * @type String
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 */
nitobi.combo.Combo.prototype.GetCSSClassName = function ()
{
	return (null == this.m_HTMLTagObject ? this.m_CSSClassName : this.m_HTMLTagObject.className);
}

/**
 * Sets the name of a custom CSS class to associate with the entire combo box. 
 * If this is left as an empty string, then the 'ComboBox' class is used.  You can 
 * include a custom class by using the HTML style tags or by using a stylesheet. 
 * @param {String} CSSClassName The combo's CSS class name.  Do not include the dot in the class name.
 * @see #SetCSSClassName
 * @see nitobi.combo.TextBox#SetCSSClassName
 * @see nitobi.combo.Button#SetDefaultCSSClassName
 */
nitobi.combo.Combo.prototype.SetCSSClassName = function (CSSClassName)
{
	if(null == this.m_HTMLTagObject)
		this.m_CSSClassName = CSSClassName;
	else
		this.m_HTMLTagObject.className = CSSClassName;
}

/**
 * Returns the initial value to search for and select in the dataset. Only in bound search modes.
 * When the combo is bound to a datasource, you can use this property to make the combo search the datasource 
 * at load time.
 * @type String
 * @see #SetInitialSearch
 */
nitobi.combo.Combo.prototype.GetInitialSearch = function ()
{
	return this.m_InitialSearch;
}

/**
 * Sets the initial value to search for and select in the dataset. Only in bound search modes.
 * When the combo is bound to a datasource, you can use this property make the combo search the datasource 
 * at load time.
 * @param {String} insch The initial search string
 * @see #GetInitialSearch
 */
nitobi.combo.Combo.prototype.SetInitialSearch = function (insch)
{
	this.m_InitialSearch = insch;
}

/**
 * Returns an integer specifying the order of combo lists on the page along the Z axis.
 * @type Number
 * @see #SetListZIndex
 */
nitobi.combo.Combo.prototype.GetListZIndex = function ()
{
	return this.m_ListZIndex;
}

/**
 * Sets the order of combo lists on the page along the Z axis.
 * @param {Number} zindex The zindex of the ComboBox
 * @see #GetListZIndex
 */
nitobi.combo.Combo.prototype.SetListZIndex = function (zindex)
{
	this.m_ListZIndex = zindex;
}

/**
 * Returns the search and render mode of this combo.
 * It can be one of 
 * <ul>
 * 	<li>classic</li>
 * 	<li>compact</li>
 * 	<li>filter</li>
 * 	<li>smartlist</li>
 * 	<li>smartsearch</li>
 * 	<li>unbound</li>
 * </ul>
 * @type String
 */
nitobi.combo.Combo.prototype.GetMode = function ()
{
	return this.mode;
}

/**
 * Gets the javascript that is run when the textbox of the combo loses focus.
 * This event fires when the combo loses focus. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnBlurEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * combo object.
 * @type String
 * @see #SetOnBlurEvent
 */
nitobi.combo.Combo.prototype.GetOnBlurEvent = function ()
{
	return this.m_OnBlurEvent;
}

/**
 * Sets the javascript that is run when the textbox of the combo loses focus.
 * This event fires when the combo loses focus. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnBlurEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * combo object.
 * @param {String} OnBlurEvent Valid javascript to run when OnBlur fires.
 * @see #GetOnBlurEvent
 */
nitobi.combo.Combo.prototype.SetOnBlurEvent = function(OnBlurEvent)
{
	this.m_OnBlurEvent = OnBlurEvent;
}

/**
 * @private
 */
nitobi.combo.Combo.prototype.OnBlurEvent = function()
{
}

/**
 * Sets the focus in the combo.
 * Once the combo has focus, the user has full control of it via 
 * the keyboard.  When the combo gains focus the OnFocusEvent is called.
 * @see #SetOnFocusEvent
 */
nitobi.combo.Combo.prototype.SetFocus = function()
{
	this.GetTextBox().m_HTMLTagObject.focus();
}

/**
 * Returns the valid javascript that is run when the textbox of the combo gains focus.
 * If the combo does not have focus, you can force focus and fire this event using Combo.SetFocus. 
 * You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnFocusEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * combo object. You can then use this.GetCombo() to get the Combo object.
 * @type String
 * @see #SetOnFocusEvent
 * @see #SetFocus
 */
nitobi.combo.Combo.prototype.GetOnFocusEvent = function()
{
	return this.m_OnFocusEvent;
}

/**
 * Sets the valid javascript that is run when the textbox of the combo gains focus.
 * If the combo does not have focus, you can force focus and fire this event using Combo.SetFocus. 
 * You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnFocusEvent="MyFunction(this)"</code>.  'this' will refer to the 
 * combo object. You can then use this.GetCombo() to get the Combo object.
 * @param {String} OnFocusEvent Valid javascript that runs when the OnFocusEvent fires.
 * @see #GetOnFocusEvent
 * @see #SetFocus
 */
nitobi.combo.Combo.prototype.SetOnFocusEvent = function(OnFocusEvent)
{
	this.m_OnFocusEvent = OnFocusEvent;
}

/**
 * Returns the Valid javascript that is run when the combo loads on the page.
 * This function is called after you call {@link nitobi#loadComponent}. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the combo object, for example, in the 
 * Combo html tag you can set it to: <code>OnLoadEvent="MyFunction(this)"</code>.  'this' will refer to the combo object. 
 * @type String
 * @see #SetOnLoadEvent
 */
nitobi.combo.Combo.prototype.GetOnLoadEvent = function()
{
	if("void"==this.m_OnLoadEvent)
		return "";
	return this.m_OnLoadEvent;
}

/**
 * Sets the Valid javascript that is run when the combo loads on the page.
 * This function is called after you call {@link nitobi#loadComponent}. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for the combo object, for example, in the 
 * Combo html tag you can set it to: <code>OnLoadEvent="MyFunction(this)"</code>.  'this' will refer to the combo object. 
 * @param {String} OnLoadEvent Valid javascript that is run when the OnLoadEvent fires.
 * @see #GetOnLoadEvent
 * @private
 */
nitobi.combo.Combo.prototype.SetOnLoadEvent = function(OnLoadEvent)
{
	this.m_OnLoadEvent = OnLoadEvent;
}

/**
 * Returns the valid javascript that is run when the user makes a selection.
 * This function is called when the user makes a selection. This can occur if they select something from the list, or type a value and press enter.  
 * You can set this property to be any valid javascript.  You can also set this property to return the 'this' pointer 
 * for either the list or textbox object, for example, in the Combo html tag you can set it to: <code>OnSelectEvent="MyFunction(this)"</code>.  
 * 'this' will refer to either list or the textbox object. However, both support the GetCombo function; use this to get the Combo object 
 * and be sure of what kind of reference you have.
 * @type String
 * @see #SetOnSelectEvent
 * @see #GetOnBeforeSelectEvent
 */
nitobi.combo.Combo.prototype.GetOnSelectEvent = function()
{
	if("void"==this.m_OnSelectEvent)
		return "";
	return this.m_OnSelectEvent;
}

/**
 * Sets the valid javascript that is run when the user makes a selection.
 * This function is called when the user makes a selection. This can occur if they select something from the list, or type a value and press enter.  
 * You can set this property to be any valid javascript.  You can also set this property to return the 'this' pointer 
 * for either the list or textbox object, for example, in the Combo html tag you can set it to: <code>OnSelectEvent="MyFunction(this)"</code>.  
 * 'this' will refer to either list or the textbox object. However, both support the GetCombo function; use this to get the Combo object 
 * and be sure of what kind of reference you have.
 * @param {String} OnSelectEvent Valid javascript that is run when the OnSelectEvent fires.
 * @see #GetOnSelectEvent
 * @see #SetOnBeforeSelectEvent
 */ 
nitobi.combo.Combo.prototype.SetOnSelectEvent = function(OnSelectEvent)
{
	this.m_OnSelectEvent = OnSelectEvent;
}

/**
 * Gets the valid javascript that is run just before the user makes a selection.
 * This function is called just before user makes a selection. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for either the list or textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnBeforeSelectEvent="MyFunction(this)"</code>.  'this' will refer to either 
 * list or the textbox object. However, both support the GetCombo function; use this to get the Combo object 
 * and be sure of what kind of reference you have.
 * @type String
 * @see #SetOnBeforeSelectEvent
 */ 
nitobi.combo.Combo.prototype.GetOnBeforeSelectEvent = function()
{
	if("void"==this.m_OnBeforeSelectEvent)
		return "";
	return this.m_OnBeforeSelectEvent;
}
/**
 * Sets the valid javascript that is run just before the user makes a selection.
 * This function is called just before user makes a selection. You can set this property to be any valid javascript.  
 * You can also set this property to return the 'this' pointer for either the list or textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnBeforeSelectEvent="MyFunction(this)"</code>.  'this' will refer to either 
 * list or the textbox object. However, both support the GetCombo function; use this to get the Combo object 
 * and be sure of what kind of reference you have.
 * @param {String} OnBeforeSelectEvent Valid javascript that is run when the OnBeforeSelectEvent fires.
 * @see #GetOnBeforeSelectEvent
 */ 
nitobi.combo.Combo.prototype.SetOnBeforeSelectEvent = function(OnBeforeSelectEvent)
{
	this.m_OnBeforeSelectEvent = OnBeforeSelectEvent;
}

/**
 * Gets the tag that represents the combo.
 * @type HTMLElement
 * @private
 */
nitobi.combo.Combo.prototype.GetHTMLTagObject = function()
{
	return this.m_HTMLTagObject;
}

/**
 * Sets the tag that represents the combo.
 * @param {HTMLElement} The HTML element of the ComboBox
 * @private
 */
nitobi.combo.Combo.prototype.SetHTMLTagObject = function(HTMLTagObject)
{
	this.m_HTMLTagObject = HTMLTagObject;
}

/**
 * Returns the combo's unique id generated by the browser.
 * @type String
 * @private
 */
nitobi.combo.Combo.prototype.GetUniqueId = function()
{
	return this.m_UniqueId;
}

/**
 * Seturns the combo's unique id generated by the browser.
 * @param {String} UniqueId The unique id for the ComboBox
 * @private
 */
nitobi.combo.Combo.prototype.SetUniqueId = function(UniqueId)
{
	this.m_UniqueId = UniqueId;
}

/**
 * Returns the id of the combo on the HTML page. This id must be unique.
 * You can use this Id to get a reference to the combo on the page.
 * @type String
 */
nitobi.combo.Combo.prototype.GetId = function()
{
	return this.m_Id;
}

/**
 * Sets the id of the combo on the HTML page. This id must be unique.
 * @param {String} Id The id of the combo
 * @private
 */
nitobi.combo.Combo.prototype.SetId = function(Id)
{
	this.m_Id = Id;
}

/**
 * Returns the object that handles the button on the combo.
 * @type nitobi.combo.Button
 */
nitobi.combo.Combo.prototype.GetButton = function()
{
	return this.m_Button;
}

/**
 * Sets the object that handles the button on the combo.
 * @param {nitobi.combo.Button} Button The value of the property you want to set.
 * @private
 */
nitobi.combo.Combo.prototype.SetButton = function(Button)
{
	this.m_Button = Button;
}


/**
 * Returns the object that handles the list on the combo.  
 * @example
 * &#102;unction addParam(param, value)
 * {
 * 	var list = nitobi.getComponent('combo1').GetList();
 * 	var currentDatasourceUrl = list.GetDatasourceUrl();
 * 	list.SetDatasourceUrl(currentDatasourceUrl + "?" + param + "=" + value);
 * }
 * @type nitobi.combo.List
 */
nitobi.combo.Combo.prototype.GetList = function()
{
	return this.m_List;
}

/**
 * Sets the object that handles the list on the combo.
 * @param {nitobi.combo.List} List
 * @private
 */
nitobi.combo.Combo.prototype.SetList = function(List)
{
	this.m_List = List;
}

/**
 * Returns the object that handles the textbox on the combo.  
 * @example
 * &#102;unction toggleInput(editable)
 * {
 * 	var textbox = nitobi.getComponent('combo1').GetTextBox();
 * 	textbox.SetEditable(editable);
 * }
 * @type nitobi.combo.TextBox
 */
nitobi.combo.Combo.prototype.GetTextBox = function()
{
	return this.m_TextBox;
}

/**
 * Sets the object that handles the textbox on the combo.
 * @param {nitobi.combo.TextBox} TextBox
 * @private
 */
nitobi.combo.Combo.prototype.SetTextBox = function(TextBox)
{
	this.m_TextBox = TextBox;
}

/**
 * Returns the value inside the textbox.
 * This is equivalent to {@link nitobi.combo.TextBox#GetValue}.
 * Note that the value in the TextBox does not necessarily mean
 * a row from the List was selected.
 * @type String
 * @see #SetTextValue
 */ 
nitobi.combo.Combo.prototype.GetTextValue = function()
{
	return this.GetTextBox().GetValue();
}

/**
 * Sets the value inside the textbox.
 * This is equivalent to {@link nitobi.combo.TextBox#SetValue}.
 * @param {String} TextValue The value inside the textbox
 * @see #GetTextValue
 */
nitobi.combo.Combo.prototype.SetTextValue = function(TextValue)
{
	this.GetTextBox().SetValue(TextValue);
}

/**
 * Returns the values selected by the user when they click an item in the list.
 * This returns all values in the row that was selected including values not displayed in the list, but
 * returned in the response from the datasourceurl. 
 * Use {@link #GetSelectedRowIndex} to see if the user actually clicked a row, as opposed to simply typing 
 * a custom value in the list.  If you want to programmatically select an item in the list, 
 * use {@link nitobi.combo.List#SetSelectedRow}.
 * @type Array
 * @see #SetSelectedRowValues
 * @see #SetSelectedRowIndex
 */
nitobi.combo.Combo.prototype.GetSelectedRowValues = function()
{
	return this.GetList().GetSelectedRowValues();
}

/**
 * Sets the values selected by the user when they click an item in the list.
 * @param {Array} SelectedRowValues
 * @see #GetSelectedRowValues
 * @see #GetSelectedRowIndex
 * @see nitobi.combo.List#SetSelectedRow
 * @see nitobi.combo.XmlDataSource#GetRow
 */
nitobi.combo.Combo.prototype.SetSelectedRowValues = function(SelectedRowValues)
{
	this.GetList().SetSelectedRowValues(SelectedRowValues);
}

/**
 * Returns the index of the selected row number.
 * The index of the selected row is set when the user makes a selection from the list.  
 * If no selection is made or the user types a custom value in the textbox, then this value is -1. The selected 
 * row index also corresponds to the same index of the selected values row in the XmlDataSource. Note: when 
 * a row is selected, this is only one of two properties set, SelectedRowIndex, and SelectedRowValues. To set a 
 * selected row manually, use {@link nitobi.combo.List#SetSelectedRow}
 * @example
 * var combo = nitobi.getComponent('combo1');
 * if (combo.GetSelectedRowIndex() == combo.GetList().GetXmlDataSource().GetRow())
 * {
 * 	alert('They're the same!');
 * }
 * @type Number
 * @see nitobi.combo.List#SetSelectedRow
 * @see nitobi.combo.XmlDataSource#GetRow
 * @see #SetSelectedRowIndex
 */
nitobi.combo.Combo.prototype.GetSelectedRowIndex = function()
{
	return this.GetList().GetSelectedRowIndex();
}

/**
 * Sets the index of the selected row number.
 * The index of the selected row is set when the user makes a selection from the list.  
 * If no selection is made or the user types a custom value in the textbox, then this value is -1. The selected 
 * row index also corresponds to the same index of the selected values row in the XmlDataSource. Note: when 
 * a row is selected, this is only one of two properties set, SelectedRowIndex, and SelectedRowValues. To set a 
 * selected row manually, use {@link nitobi.combo.List#SetSelectedRow}
 * @param {Number} SelectedRowIndex The index of the row that was clicked
 * @see nitobi.combo.List#SetSelectedRow
 * @see nitobi.combo.TextBox#GetValue
 * @see nitobi.combo.XmlDataSource#GetRow
 * @see #SetSelectedRowIndex
 * @see #GetTextValue
 */
nitobi.combo.Combo.prototype.SetSelectedRowIndex = function(SelectedRowIndex)
{
	this.GetList().SetSelectedRowIndex(SelectedRowIndex);
}

/**
 * Returns the name of the field in the dataset that provides text for the list to display.
 * If you want a combo that displays key/value pairs, use this property. The DataTextField 
 * is the field used as a display value, and the DataValueField is used as a key value, and is the 
 * value returned when using GetSelectedItem.  If you only specify 
 * one of these it is used as both the TextField and the ValueField.
 * @type String
 * @see #GetSelectedItem
 * @see nitobi.combo.TextBox#GetDataFieldIndex
 */
nitobi.combo.Combo.prototype.GetDataTextField = function()
{
	return this.m_DataTextField;
}

/**
 * Sets the name of the field in the dataset that provides text for the list to display.  
 * Use this if you only want one column, and you don't want to use the ListColumnDefinition tags.
 * If you want a combo that displays key/value pairs, use this property. The DataTextField 
 * is the field used as a display value, and the DataValueField is used as a key value, and is the 
 * value returned when using GetSelectedItem.  If you only specify 
 * one of these it is used as both the TextField and the ValueField.
 * @param {String} DataTextField The name of the data field to use as a display field
 * @private
 */
nitobi.combo.Combo.prototype.SetDataTextField = function(DataTextField)
{
	this.m_DataTextField = DataTextField;
	var hiddenField = $(this.GetId() + "DataTextFieldIndex");
	if (null != hiddenField)
	{
		var index = this.GetList().GetXmlDataSource().GetColumnIndex(DataTextField);
		hiddenField.value = index;
	}
}

/**
 * Returns the name of the field in the dataset that provides data for the list. Use this
 * if you only want one column, and you don't want to use the ListColumnDefinition tag.
 * If you want a combo that displays key/value pairs, use this property. The DataTextField 
 * is the field used as a display value, and the DataValueField is used as a key value, and is the 
 * value returned when using GetSelectedItem.  If you only specify 
 * one of these it is used as both the TextField and the ValueField.
 * @type String
 * @see #GetDataTextField
 * @see #GetDataFieldIndex
 * @see nitobi.combo.TextBox#GetDataFieldIndex
 */
nitobi.combo.Combo.prototype.GetDataValueField = function()
{
	return this.m_DataValueField;
}

/**
 * Sets the name of the field in the dataset that provides data for the list. Use this if you only want one column, and you don't want to use the
 * ListColumnDefinition tag.
 * @param {String} DataValueField The value of the property you want to set
 * @private
 */
nitobi.combo.Combo.prototype.SetDataValueField = function(DataValueField)
{
	this.m_DataValueField = DataValueField;
	// I don't think there is support to switch DataValueField midstream, but i put it
	// here for future use.
	var hiddenField = $(this.GetId() + "DataValueFieldIndex");
	if (null != hiddenField)
	{
		var index = this.GetList().GetXmlDataSource().GetColumnIndex(DataValueField);
		hiddenField.value = index;
	}
}

/**
 * Returns the selected list item.
 * Used only in conjunction with the DataValueField
 * and DataTextField properties. Check SelectedRowIndex to see if an item was actually selected from
 * the list as opposed to a custom value being entered; if so, use {@link #GetTextValue}
 * Retrieve the text and value as follows: 
 * @example
 * SelectedItem.Text;
 * SelectedItem.Value;
 * 
 * @type Object
 */
nitobi.combo.Combo.prototype.GetSelectedItem = function()
{
// better to default to col 0 (i.e. GetColumnIndex(null) now returns 0) than to fail and throw a fit
//		if ((null == this.GetDataValueField()) || (null == this.GetDataTextField())){
//			alert(this.GetId() + " Error: You must define a DataValueField and a DataTextField to use this function.");

//			return;
//		}
	var ListItem=new Object;
	ListItem.Value=null;
	ListItem.Text=null;
	var rowIndex = this.GetList().GetSelectedRowIndex();
	if (-1 != rowIndex)
	{
		var dataSource=this.GetList().GetXmlDataSource();
		var row = dataSource.GetRow(rowIndex);
		var colIndex = dataSource.GetColumnIndex(this.GetDataValueField());
		if (-1 != colIndex)
			ListItem.Value = row[colIndex];
		colIndex = dataSource.GetColumnIndex(this.GetDataTextField());
		if (-1 != colIndex)
			ListItem.Text = row[colIndex];
	}

	return ListItem;
}

/**
 * Returns the javascript that is run when the list is hidden.
 * You can set this property to be any valid javascript. You can also hide the list
 * and fire this event by using the {@link nitobi.combo.List#Hide} function.
 * Set this property to return the 'this' pointer for the list object, for example, in the 
 * Combo html tag you can set it to: <code>OnHideEvent="MyFunction(this)"</code>.  'this' will refer to the
 * list object. You can then use this.GetCombo() to get the Combo object.
 * @type String
 * @see #SetOnHideEvent
 * @see nitobi.combo.List#Hide
 */
nitobi.combo.Combo.prototype.GetOnHideEvent = function()
{
	return this.GetList().GetOnHideEvent();
}

/**
 * Sets the javascript that is run when the list is hidden.
 * You can set this property to be any valid javascript. You can also hide the list
 * and fire this event by using the {@link nitobi.combo.List#Hide} function.
 * Set this property to return the 'this' pointer for the list object, for example, in the 
 * Combo html tag you can set it to: <code>OnHideEvent="MyFunction(this)"</code>.  'this' will refer to the
 * list object. You can then use this.GetCombo() to get the Combo object.
 * @param {String} OnHideEvent Valid javascript that runs when the OnHideEvent fires.
 * @see #GetOnHideEvent
 * @see nitobi.combo.List#Hide
 */
nitobi.combo.Combo.prototype.SetOnHideEvent = function(OnHideEvent)
{
	this.GetList().SetOnHideEvent(OnHideEvent);
}

/**
 * Returns the javascript that is run when the user tabs out of the combo.
 * The OnBlurEvent will also fire when this event fires.
 * You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnTabEvent="MyFunction(this)"</code>.  'this' will refer to the
 * textbox object. You can then use this.GetCombo() to get the Combo object.  For additional information about the
 * object, including how to check for the shift key, see GetEventObject.
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction OnTab(textbox)
 * {
 *  	var combo = textbox.GetCombo();
 *  	if (combo.GetEventObject().shiftKey)
 *  	{
 *  		AddEventLog("OnShiftTab");
 *  	}
 *  	else
 *  	{
 *  		AddEventLog("OnTab");
 *  	}
 *  }
 * </code></pre>
 * </div>
 * @type String
 * @see #SetOnTabEvent
 * @see #GetEventObject
 * @see #GetOnBlurEvent
 */
nitobi.combo.Combo.prototype.GetOnTabEvent = function()
{
	return this.m_OnTabEvent;
}

/**
 * Sets the javascript that is run when the user tabs out of the combo.
 * The OnBlurEvent will also fire when this event fires.
 * You can set this property to be any valid javascript.
 * You can also set this property to return the 'this' pointer for the textbox object, for example, in the 
 * Combo html tag you can set it to: <code>OnTabEvent="MyFunction(this)"</code>.  'this' will refer to the
 * textbox object. You can then use this.GetCombo() to get the Combo object.  For additional information about the
 * object, including how to check for the shift key, see GetEventObject.
 * @param {String} OnTabEvent Valid javascript that is run when the user tabs out of the combo
 * @see #GetOnTabEvent
 * @see #GetEventObject
 * @see #SetOnBlurEvent
 */
nitobi.combo.Combo.prototype.SetOnTabEvent = function(OnTabEvent)
{
	this.m_OnTabEvent = OnTabEvent;
}


/**
 * Returns the javascript event object that describes more information about a certain event.
 * This is not available in all events.  For futher documentation regarding this object, see
 * <a href="http://msdn.microsoft.com/workshop/author/dhtml/reference/objects/obj_event.asp">MSDN</a>.
 * @type Object
 * @private
 */
nitobi.combo.Combo.prototype.GetEventObject = function()
{
	return this.m_EventObject;
}

/**
 * @private
 */
nitobi.combo.Combo.prototype.SetEventObject = function(EventObject)
{
	this.m_EventObject = EventObject;
}


/**
 * Returns the character used to separate selected list records, in SmartList mode. The default value is "," (comma).
 * You should try to pick a value that will not appear in your datasource.
 * @type String
 * @see #SetSmartListSeparator
 */
nitobi.combo.Combo.prototype.GetSmartListSeparator = function()
{
	return this.SmartListSeparator;
}

/**
 * Sets the character used to separate selected list records, in SmartList mode. The default value is "," (comma).
 * You should try to pick a value that will not appear in your datasource.
 * @param {String} slstsep The character used to separate the values in textbox when in smartlist mode
 * @see #GetSmartListSeparator
 */
nitobi.combo.Combo.prototype.SetSmartListSeparator = function(slstsep)
{
	this.SmartListSeparator = slstsep;
}

/**
 * Returns the HTML tab index of the combo box.
 * @type Number
 * @see #SetTabIndex
 */
nitobi.combo.Combo.prototype.GetTabIndex = function()
{
	return this.m_TabIndex;
}

/**
 * Sets the HTML tab index of the combo box.
 * his should be a unique number. Combos with the same tab index will conflict.
 * @param {Number} TabIndex The tab index of the combo
 * @see #GetTabIndex
 */
nitobi.combo.Combo.prototype.SetTabIndex = function(TabIndex)
{
	this.m_TabIndex = TabIndex;
}

/**
 * Determines whether the combo is enabled for user interaction.  Note
 * that the enabled/disabled distinction is different from the editable/non-editable
 * distinction.  When the ComboBox is disabled, both the textbox and list are disabled
 * whereas if the ComboBox is non-editable, the list is still accessible while the textbox
 * is disabled.
 * @example
 * if(nitobi.getComponent('combo1').GetEnabled() == true)
 * {
 * 	// Check if the ComboBox is enabled before programatically setting
 * 	// the value in the TextBox
 * 	nitobi.getComponent('combo1').SetTextValue("We're enabled!");
 * }
 * @type Boolean
 * @see #SetEnabled
 * @see #GetEditable
 */
nitobi.combo.Combo.prototype.GetEnabled = function()
{
	return this.m_Enabled;
}

/**
 * Sets whether the combo is enabled for user interaction.
 * @param {Boolean} Enabled true if the combo is enabled and false otherwise
 * @see #GetEnabled
 * @see #SetEditable
 */
nitobi.combo.Combo.prototype.SetEnabled = function(Enabled)
{
	this.m_Enabled = Enabled;
	var t = this.GetTextBox();
	if(null!=t.GetHTMLTagObject())
	{
		if(Enabled)
		{
			t.Enable();
		}
		else
		{
			t.Disable();
		}

	}
	var b = this.GetButton();
	if(null!=b && null!=b.m_Img)
	{
		if(Enabled)
		{
			b.Enable();
		}
		else
		{
			b.Disable();
		}
	}
}


/**
 * Initialize the combo. This draws the combo and binds each EBA object to its corresponding HTML tag.
 * @private
 */
nitobi.combo.Combo.prototype.Initialize = function()
{
	var DEFAULTCLASSNAME="ComboBox";
	var DEFAULTTHEME="outlook";
	
	var DEFAULTONSELECTEVENT="";
	var DEFAULTONLOADEVENT="";
	var DEFAULTONBEFORESELECTEVENT="";
	var DEFAULTONBLUR="";
	var DEFAULTONFOCUS="";
	var DEFAULTONTAB="";
	
	var DEFAULTTABINDEX="0";
	var DEFAULTENABLED=true;
	var DEFAULTMODE="default";
	var DEFAULTLISTZINDEX=1000;
	var DEFAULTSMARTLISTSEPARATOR=",";
	var DEFAULTONSHOWEVENT="";
	var DEFAULTONHHIDEEVENT="";

	var listZIndex = this.m_userTag.getAttribute("ListZIndex");
	((null == listZIndex) || ("" == listZIndex))
		? this.SetListZIndex(DEFAULTLISTZINDEX)
		: this.SetListZIndex(listZIndex);

	this.SetWidth(this.m_userTag.getAttribute("Width"));
	this.SetHeight(this.m_userTag.getAttribute("Height"));
	
	this.theme = this.m_userTag.getAttribute("theme");
	if ((this.theme == null) || ("" == this.theme))
	{
		this.theme = DEFAULTTHEME;
	}
	

	var sls=this.m_userTag.getAttribute("SmartListSeparator");
	((null == sls) || ("" == sls))
		? this.SetSmartListSeparator(DEFAULTSMARTLISTSEPARATOR)
		: this.SetSmartListSeparator(sls);

	var enabled=this.m_userTag.getAttribute("Enabled");
	((null == enabled) || ("" == enabled))
		? this.SetEnabled(DEFAULTENABLED)
		: this.SetEnabled("true"==enabled.toLowerCase());

	var tabidx=this.m_userTag.getAttribute("TabIndex");
	((null == tabidx) || ("" == tabidx))
		? this.SetTabIndex(DEFAULTTABINDEX)
		: this.SetTabIndex(tabidx);

	var ontab=this.m_userTag.getAttribute("OnTabEvent");
	((null == ontab) || ("" == ontab))
		? this.SetOnTabEvent(DEFAULTONTAB)
		: this.SetOnTabEvent(ontab);
	
	this.SetEventObject(null);

	var onfocus=this.m_userTag.getAttribute("OnFocusEvent");
	((null == onfocus) || ("" == onfocus))
		? this.SetOnFocusEvent(DEFAULTONFOCUS)
		: this.SetOnFocusEvent(onfocus);

	var onblur=this.m_userTag.getAttribute("OnBlurEvent");
	((null == onblur) || ("" == onblur))
		? this.SetOnBlurEvent(DEFAULTONBLUR)
		: this.SetOnBlurEvent(onblur);

	var ose=this.m_userTag.getAttribute("OnSelectEvent");
	((null == ose) || ("" == ose))
		? this.SetOnSelectEvent(DEFAULTONSELECTEVENT)
		: this.SetOnSelectEvent(ose);
		
	var ole=this.m_userTag.getAttribute("OnLoadEvent");
	((null == ole) || ("" == ole))
		? this.SetOnLoadEvent(DEFAULTONLOADEVENT)
		: this.SetOnLoadEvent(ole);

	var obse=this.m_userTag.getAttribute("OnBeforeSelectEvent");
	((null == obse) || ("" == obse))
		? this.SetOnBeforeSelectEvent(DEFAULTONBEFORESELECTEVENT)
		: this.SetOnBeforeSelectEvent(obse);
		
	

	var css=this.m_userTag.getAttribute("CSSClassName");
	((null == css) || ("" == css))
		? this.SetCSSClassName(DEFAULTCLASSNAME)
		: this.SetCSSClassName(css);

	var uniqueId = this.m_userTag.uniqueID;
	this.SetUniqueId(uniqueId);

	// If we're using the Combo width properties instead of textbox, resize the container.
	// The container will define the height and width, and the textbox will resize to match it.
	if (this.GetWidth() != null)
	{
		if ("smartlist" == this.mode)
		{
			this.m_TextBox.SetWidth(this.GetWidth());
			this.m_TextBox.SetHeight(this.GetHeight());
		}

		// We need to make the container block if the unit type is %.
		// Otherwise, the containing span tag, doesn't resize when the browser window resizes.
		if (nitobi.Browser.GetMeasurementUnitType(this.GetWidth()) == "%")
		{
			this.m_userTag.style.display = "block";
		}
		else
		{
			this.m_userTag.style.display = "inline";
		}

		// In smartlist, we let the textbox govern the size of the combo.
		// It has a height where input type=text does not. It must
		// also not hide any overflow, as the textarea border get's cut off.
		if ("smartlist" == this.mode)
		{
			this.m_userTag.style.height = this.GetHeight();
		}
		else
		{
			this.m_userTag.style.overflow = "hidden";
		}
	}

	// note:
	// - keeping <input type="text"></input><img></img> on the same line w/o any spaces, breaks, etc.
	// is important to ensuring that no gap appears between the two elements so do NOT put an
	// "\n" before/after this <nobr>...</nobr> html bit


	// Insert all the required HTML and then allow the object to set its HTML OBJECT.
	var html = "<span id='EBAComboBox" + uniqueId + "' class='ntb-combo-reset " + this.GetCSSClassName() + "' "
		+ "onMouseOver='$(\"" + this.GetId() + "\").object.m_Over=true' "
		+ "onMouseOut='$(\"" + this.GetId() + "\").object.m_Over=false'>"
		+ "<span id='EBAComboBoxTextAndButton" + uniqueId + "' class='ComboBoxTextAndButton'><nobr>";

	// Write out the hidden fields that display the "key" values.
	var id="";
	var comboId = this.GetId();
	for (var i=0, n = this.GetList().GetXmlDataSource().GetNumberColumns(); i < n; i++)
	{
		id = comboId + "SelectedValue" + i;
		// Name and id are the same for .net purposes.
		html+="<input type='HIDDEN' id='" + id + "' name='" + id + "'></input>";
	}
	id = comboId + "SelectedRowIndex";
	html += "<input type='HIDDEN' id='" + id + "' name='" + id + "' value='" + this.GetSelectedRowIndex() + "'></input>";

	// Insert the hidden fields that map the DataValueField to its ordinal field position in
	// the table of xml data.
	var dataTextField = this.GetDataTextField();
	// better to default to col 0 (i.e. GetColumnIndex(null) now returns 0) than to fail and throw a fit
	id = comboId + "DataTextFieldIndex";
	var index = this.GetList().m_XmlDataSource.GetColumnIndex(dataTextField);
	html+="<input type='HIDDEN' id='" + id + "' name='" + id + "' value='" + index + "'></input>";
	id = comboId + "DataValueFieldIndex";
	var dataValueField = this.GetDataValueField();
	index = this.GetList().m_XmlDataSource.GetColumnIndex(dataValueField);
	html+="<input type='HIDDEN' id='" + id + "' name='" + id + "' value='" + index + "'></input>";

	html += "<div class=\" ntb-combo-reset "+ this.theme +"\">"
	html += this.GetTextBox().GetHTMLRenderString();
	var modeIsDef = (this.mode=="default" || this.mode=="unbound");
	if(modeIsDef)
		html += this.GetButton().GetHTMLRenderString();
		
	html += "<div style=\"overflow: hidden; display: block; clear: both; float: none; height: 0px; width: auto;\"><!-- --></div>";
	// Might be missing a div here...
	html += "</div>"
	
	html += "</nobr></span></span>";
	// It would be nice to have only one inserthtml, but for some reason,
	// the list prefers to be in the body.
			/*+this.GetList().GetHTMLRenderString()*/;

	nitobi.html.insertAdjacentHTML(this.m_userTag,'beforeEnd',html);

	this.SetHTMLTagObject($('EBAComboBox'+uniqueId));

	// Now that we have tags for the html object initialize the EBA object.

	this.GetTextBox().Initialize();

	if(modeIsDef)
		this.GetButton().Initialize();

	// Check to see if we need to setup the combo with an initial search.
	var is = this.m_InitialSearch;
	if(null!=is && ""!=is)
	{
		this.InitialSearch(is);		
	}

	eval(this.GetOnLoadEvent());

	// Don't user this after init. Use the proper accessors.
	this.m_userTag=null;

	nitobi.combo.numCombosToLoad--;
	if (nitobi.combo.numCombosToLoad == 0)
	{
		nitobi.combo.finishInit();
	}
}

/**
 * @private
 */
nitobi.combo.Combo.prototype.InitialSearch = function(SearchTerm)
{
	var list=this.GetList();
	var tb = this.GetTextBox();
	var dfi = tb.GetDataFieldIndex();
	list.SetDatabaseSearchTimeoutStatus(EBADatabaseSearchTimeoutStatus_EXPIRED);
	list.InitialSearchOnce=true;
	
	this.m_Callback=_EbaComboCallback;
	list.Search(SearchTerm, dfi,this.m_Callback,this.m_NoDataIsland);
}

/**
 * @private
 */
function _EbaComboCallback(searchResult, list)
{
	if(searchResult >= 0)
	{
		var tb = list.GetCombo().GetTextBox();
		var row = list.GetRow(searchResult);
		list.SetActiveRow(row);
		list.SetSelectedRow(searchResult);
		tb.SetValue(list.GetSelectedRowValues()[ tb.GetDataFieldIndex()]);
		list.scrollOnce=true;
		list.InitialSearchOnce=false;
	}
	else
	{
		var combo = list.GetCombo();
		combo.SetTextValue(combo.GetInitialSearch());
	}
	
}

/**
 * Returns the active value given a field name.
 * <b>The active row is not the selected row.</b> It is the row that has been
 * activated either because the user has the mouse over it, or because the text in the
 * textbox makes a match on a row given the mode's search scheme.
 * @param {String} fieldname The field name of the column in the active row to get.
 * @type String
 * @see #GetSelectedRowValues
 * @see #GetSelectedRowIndex
 */
nitobi.combo.Combo.prototype.GetFieldFromActiveRow = function(fieldname)
{
	var l = this.GetList();
	if(null!=l)
	{

		var r = l.GetActiveRow();
		if(null!=r)
		{
			var y = l.GetRowIndex(r);
			var d = l.GetXmlDataSource();
			var x = d.GetColumnIndex(fieldname);
			return d.GetRowCol(y,x);
		}
	}
	return null;
}
