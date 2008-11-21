/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.tabstrip");

/**
 * Creates a tab.  A tab object belongs to a {@link nitobi.tabstrip.Tabs} collection.
 * @class The Tab class defines the properties associated with a specific tab contained with the Tabstrip component.
 * To access a tab object from a given Tabstrip object, you can do the following:
 * <pre class="code">
 * var tabstrip = nitobi.getComponent("myTabstrip");
 * var tabs = tabstrip.getTabs();
 * var firstTab = tabs.get(0);
 * </pre>
 * @constructor
 * @param {XmlNode} [node] If you want to create a tab and deserialize it from the node. 
 * @extends nitobi.ui.Element
 */
nitobi.tabstrip.Tab = function(node) 
{
	nitobi.tabstrip.Tab.baseConstructor.call(this,node);
	this.onEventNotify.subscribe(this.handleEventNotify,this);
	
	/**
	 * Fired on click. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onClick = new nitobi.base.Event("click");
	this.eventMap["click"] = this.onClick;
	/**
	 * Fired on mouse out. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onMouseOut = new nitobi.base.Event("mouseout");
	this.eventMap["mouseout"] = this.onMouseOut;
	/**
	 * Fired on mouse over. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onMouseOver = new nitobi.base.Event("mouseover");
	this.eventMap["mouseover"] = this.onMouseOver;
	/**
	 * Fired on focus. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onFocus = new nitobi.base.Event("focus");
	this.eventMap["focus"] = this.onFocus;
	/**
	 * Fired on blur. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onBlur = new nitobi.base.Event("blur");
	this.eventMap["blur"] = this.onBlur;
	
	/**
	 * Fired when the tab is activated. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onActivate = new nitobi.base.Event("activate");
	this.eventMap["activate"] = this.onActivate;
	/**
	 * Fired when the tab is deactivated. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onDeactivate = new nitobi.base.Event("deactivate");
	this.eventMap["deactivate"] = this.onDeactivate;
	/**
	 * Fired when content finishes loading in the tab. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onLoad = new nitobi.base.Event("load");
	this.eventMap["load"] = this.onLoad;
	
	/**
	 * @private
	 */
	this.callback=null;
	/**
	 * @private
	 */	
	this.contentLoaded = false;
	this.subscribeDeclarationEvents();
	this.onCreated.notify(new nitobi.ui.ElementEventArgs(this));
}


nitobi.lang.extend(nitobi.tabstrip.Tab,nitobi.ui.Element);

/**
 * Information out the tabstrip class.
 * @private
 * @type nitobi.base.Profile
 */
nitobi.tabstrip.Tab.profile = new nitobi.base.Profile("nitobi.tabstrip.Tab",null,false,"ntb:tab");
nitobi.base.Registry.getInstance().register(nitobi.tabstrip.Tab.profile);

/**
 * Show the tab and make it active.
 * @private
 */
nitobi.tabstrip.Tab.prototype.show = function(effect)
{
	var el = this.getBodyHtmlNode();
	if (effect)
	{
		nitobi.html.Css.setOpacity(el, 0);	
	}
	el.style.height="100%";
	el.style.width="100%";
	el.style.position="";	
	el.style.display = "";
	el.className = "ntb-tab-active";
	
	var el = this.getHtmlNode("activetabclassdiv");
	el.className = "ntb-tab-active";
	if (effect)
	{
		
	}
	else
	{
		this.onActivate.notify(new nitobi.ui.ElementEventArgs(this));
	}
	//nitobi.ui.Effects.fade(this.getBodyHtmlNode(),100,400,nitobi.lang.close(this, this.activate));
}

/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.hide = function(effect)
{
	try
	{
		if (effect)
		{
			var el = this.getHtmlNode("activetabclassdiv");
			el.className = "ntb-tab-inactive";
			nitobi.ui.Effects.fade(this.getBodyHtmlNode(),0,400,nitobi.lang.close(this, this.handleHide));
		}
		else
		{
			this.handleHide();
		}
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected + " The tab could not be hidden.",err);	
	}
}

/**
 * Starts the tab pulsing. Call stopPulse to stop it.
 */
nitobi.tabstrip.Tab.prototype.pulse = function()
{
	this.pulseEnabled = true;
	for (var i = 0; i < this.nodelist.length ; i++)
	{
		this.nodelist[i].style.visibility = "visible";
	}
	this.pulseNext(this.nodelist);
	
}

/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.pulseNext = function(nodelist)
{
	var opac = nitobi.html.Css.getOpacity(nodelist[0]);
	if (this.pulseEnabled || opac > 1)
	{
		nitobi.ui.Effects.fade(nodelist,(opac == 0 ? 100 : 0),1400,nitobi.lang.close(this, this.pulseNext,[nodelist]),nitobi.ui.Effects.cube);
	}
	else if (this.pulseEnabled == false)
	{
		for (var i = 0; i < this.nodelist.length ; i++)
		{
			this.nodelist[i].style.visibility = "hidden";
		}
	}
}

/**
 * Stops the tab from pulsing.
 */
nitobi.tabstrip.Tab.prototype.stopPulse = function()
{
	this.pulseEnabled = false;
}

/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.handleHide = function()
{
	var el = this.getHtmlNode("activetabclassdiv");
	el.className = "ntb-tab-inactive";
	el = this.getBodyHtmlNode();
	el.className = "ntb-tab-inactive";

	el.style.width="1px";
	el.style.height="1px";
	el.style.position="absolute";			
	el.style.top="-5000px";
	el.style.left="-5000px";

	try
	{
		this.onDeactivate.notify(new nitobi.ui.ElementEventArgs(this));
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected + " onDeactivate notification contains an error.",err);	
	}
}

/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.handleEventNotify = function(eventArgs)
{
	var event = eventArgs.htmlEvent;
	var idInfo = nitobi.ui.Element.parseId(eventArgs.targetId);
	var returnResult = true;
	switch(event.type)
	{
		case("load"):
		{
			this.handleOnLoad();
			break;
		}
		case("click"):
		{
			returnResult = this.isEnabled();
			break;
		}
	}
	return returnResult;
}


/**
 * Loads content into the tab. If the container type is an IFrame, then the source
 * is treated as an accessible URL. If the container type is not an iframe, the source
 * is first treated as an element on the page, or the id of an element on the page.  If none
 * of these conditions are true, the source is treated as an URL from which content is to be loaded. 
 * Note: in the last case, the URL must be on the same domain as the tabstrip; browsers prohibit cross domain AJAX.
 * If there are Nitobi components in the contents of the tab, the time of their initialization can
 * be controlled.  If you use the onloaddemandenabled attribute, initialization of Nitobi components will 
 * be automatically delayed until the tab is first loaded.   You can handle
 * errors to this call with the usual try,catch procedures. As with all asynchronous calls and events
 * you can also subscribe to {@link nitobi.error.onError} to handle errors when the load completes.
 * @see nitobi.tabstrip.Tab#setSource 
 * @see nitobi.tabstrip.Tab#getSource
 * @param {String} [value] A source (either an html element or a url). The object's source
 * property is used if this argument is not supplied.
 */
nitobi.tabstrip.Tab.prototype.load = function(value)
{
	this.nodelist = new Array();
	this.nodelist[0] = this.getHtmlNode("leftpulse");
	nitobi.html.setOpacity(this.nodelist[0],0);
	this.nodelist[1] = this.getHtmlNode("bodypulse");
	this.nodelist[2] = this.getHtmlNode("rightpulse");
	var box = nitobi.html.getBox(this.getHtmlNode("labeltable"));
	this.nodelist[1].style.width = box.width + "px";
	
	if (value == null)
	{
		value = this.getSource();
	}
	if (value == null)
	{
		return;
	}
	this.setActivityIndicatorVisible(true);
	var iframeNode = this.getIframeHtmlNode();
	var el = $ntb(value);
	if (iframeNode != null)
	{
		// IFrame target requested.
		try
		{
			iframeNode.src = value;
		}
		catch(err)
		{
			nitobi.lang.throwError("Could not load iframe with src " + value);
		}
	}
	else if (el != null)
	{
		// Another node on the page targeted.
		var node = this.getNodeFrameHtmlNode();
		node.appendChild(el);
		nitobi.component.loadComponentsFromNode(node);
		nitobi.html.Css.removeClass(el, "ntb-tab-domnode");
		this.handleOnLoad();
	} 
	else
	{
		try
		{
			// Load an html fragment from the server.
			var nodeframe = this.getNodeFrameHtmlNode();
			this.setActivityIndicatorVisible(true);
			var pool = nitobi.ajax.HttpRequestPool.getInstance();
			this.callback = pool.reserve();
			this.callback.handler = value;
			this.callback.context = this;
			this.callback.params = this.callback;
			this.callback.onGetComplete.subscribe(this.handleOnLoad,this);
			this.callback.responseType = "text";
			this.callback.get();
		} 
		catch(err)
		{
			nitobi.lang.throwError("The HTTP request for tab could not be performed. Is the website accessible by client script? Cross domain scriping is not permitted. Use IFrame for this purpose.",err);
		}
	}
}

/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.handleOnLoad = function(eventArgs)
{
	try
	{
		if (eventArgs != null && eventArgs.params != null)
		{
			var node = this.getNodeFrameHtmlNode();
			if (nitobi.ajax.HttpRequest.isError(eventArgs.status))
			{
				node.innerHTML = '<div style="margin-left:20px;margin-right:20px"><h1 style="font-family:arial;font-size:14pt;">Error</h1><p style="font-family:tahoma;font-size:10pt;">The tab could not be opened because the location of the tab content could not be found.</p><ul style="font-family:tahoma;font-size:10pt;"><li>The server may be busy or not responding</li><li>The address of the tab content may be incorrect.</li><li>The address may be that of an HTML Element that was not on the page</li></ul><p style="font-family:tahoma;font-size:10pt;">Try again later. If the problem persists, contact your local administrator.</p><p style="font-family:tahoma;font-size:10pt;">The faulty source was ' + this.getSource() + '. The server return code was <b>'+eventArgs.status+' ('+eventArgs.statusText+').</b> The server response follows:</p><hr/><p>'+eventArgs.response+'</p></div>';
				nitobi.error.onError.notify(new nitobi.error.ErrorEventArgs(this,nitobi.error.HttpRequestError + "\n\n OR \n\n " + nitobi.error.NoHtmlNode,nitobi.tabstrip.Tab.profile.className));
			}
			else
			{
				node.innerHTML = eventArgs.response;
				if (this.isScriptEvaluationEnabled())
				{
					nitobi.html.evalScriptBlocks(node);
				}
				nitobi.component.loadComponentsFromNode(node);
			}
			var pool = nitobi.ajax.HttpRequestPool.getInstance();
			pool.release(eventArgs.params); 
		}
		this.setContentLoaded(true);
		this.setActivityIndicatorVisible(false);
		this.onLoad.notify(new nitobi.ui.ElementEventArgs(this));
	}
	catch(err)
	{
		
		nitobi.error.onError.notify(new nitobi.error.ErrorEventArgs(this,"The tab encountered an error while trying to parse the response from load. There may be an error in the onLoad event.",nitobi.tabstrip.Tab.profile.className));
	}
}

/**
 * Specifies whether or not the activity indicator is visible.
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.isActivityIndicatorVisible = function()
{
	return (this.getActivityIndicatorHtmlNode().style.display != "none");
}

/**
 * Specifies whether or not the activity indicator is visible.  This change takes 
 * effect immediately; you do not have to call render.
 * @param {Boolean} value true to show the indicator, and false otherwise.
 */
nitobi.tabstrip.Tab.prototype.setActivityIndicatorVisible = function(value)
{
	if (value == null || typeof(value) != "boolean") 
	{
		nitobi.lang.throwError(nitobi.error.BadArgType);	
	}
	this.getActivityIndicatorHtmlNode().style.display = (value ? "" : "none");
		
}

/**
 * Sets the activity indicator according to the current state of the load operation. This change takes 
 * effect immediately; you do not have to call render.
 */
nitobi.tabstrip.Tab.prototype.autoSetActivityIndicator = function()
{
	if (this.getContainerType() == "iframe")
	{
		var iframeNode = this.getIframeHtmlNode();
		if (iframeNode != null)
		{
			// readyState property is IE only.
			if (nitobi.browser.IE)
			{
				this.setActivityIndicatorVisible(iframeNode.readyState != "complete");
			}
			else
			{
				if (this.contentLoaded == true) 
				{
					this.setActivityIndicatorVisible(false);
				} 
				else if (this.getLoadOnDemandEnabled() == true)
				{
					this.setActivityIndicatorVisible(false);
				} 
			}				
		} else if (this.callback != null)
		{
			this.setActivityIndicatorVisible(this.callback.readyState != 4);
		}
	}		
}

/**
 * Returns the HTML node for the indicator.  The activity indicator is invoked automatically when the tab is loading 
 * content.
 * @type HTMLElement
 */
nitobi.tabstrip.Tab.prototype.getActivityIndicatorHtmlNode = function()
{
	return this.getHtmlNode("activityindicator");
}

/**
 * Returns the HTML node for the iframe, if one is used.
 * @type HTMLElement
 */
nitobi.tabstrip.Tab.prototype.getIframeHtmlNode = function()
{
	return this.getHtmlNode("tabiframe");
}

/**
 * Returns the HTML node for the container if no iframe is used.
 * @type HTMLElement
 */
nitobi.tabstrip.Tab.prototype.getNodeFrameHtmlNode = function()
{
	return this.getHtmlNode("tabnodeframe");
}

/**
 * Returns true if this tab has a body in the html or not.
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.isBodyHtmlNodeAvail = function()
{
	return (this.getHtmlNode("tabbody") != null);
}

/**
 * Returns the HTML node for the body of a tab.
 * @type HTMLElement
 */
nitobi.tabstrip.Tab.prototype.getBodyHtmlNode = function()
{
	var node = this.getHtmlNode("tabbody");
	if (node==null)
	{
		nitobi.lang.throwError(nitobi.error.NoHtmlNode + " The body of the tab could not be found. Is a body defined for this tab?");
	}
	return node;	
}


/**
 * @private
 */
nitobi.tabstrip.Tab.prototype.destroyHtml = function()
{
	if (this.isBodyHtmlNodeAvail())
	{
		var node = this.getBodyHtmlNode();
		node.parentNode.removeChild(node);
	}
	var node = this.getHtmlNode();
	if (node!=null)
	{
		node.parentNode.removeChild(node);
	}
}

/**
 * Whether or not the tab is enabled or not and can be clicked on. This change takes 
 * effect immediately; you do not have to call render.
 * @param {Boolean} enabled true if the tab is enabled and false otherwise.
 */
nitobi.tabstrip.Tab.prototype.setEnabled = function(enabled)
{
	if (enabled == null || typeof(enabled) != "boolean") 
	{
		nitobi.lang.throwError(nitobi.error.BadArgType);	
	}
	nitobi.tabstrip.Tab.base.setEnabled.call(this,enabled);
	this.setBoolAttribute("enabled",enabled)
	var el = this.getHtmlNode("activetabclassdiv");
	if (el)
	{
		if (el.className != "ntb-tab-disabled" && !enabled)
		{
			el.className = "ntb-tab-disabled";
		}
	}
}

/**
 * Whether or not the tab is enabled or not and can be clicked on.
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.isEnabled = function()
{
	return this.getBoolAttribute("enabled");
}

/**
 * Returns the width of the tab. Note: this is not the width of the content.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getWidth = function()
{
	return this.getAttribute("width");
}

/**
 * Set the width of the tab. This change takes 
 * effect immediately; you do not have to call render.
 * @see nitobi.tabstrip.Tabs#setHeight
 * @param {String} width Any html measurement.
 */
nitobi.tabstrip.Tab.prototype.setWidth = function(width)
{
	this.setAttribute("width",width);
	this.setStyle("width",width);	
}

/**
 * Returns the tooltip.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getTooltip = function()
{
	return this.getAttribute("tooltip");
}

/**
 * The tooltip. This change takes 
 * effect immediately; you do not have to call render.
 * @param {String} value The value of the tooltip to be set on the tab.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.setTooltip = function(value)
{
	this.setAttribute("tooltip",value);
	var el = this.getHtmlNode();
	if (el)
	{
		el.title = value;
	}
}

/**
 * Returns the icon used in the header for this tab.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getIcon = function()
{
	return this.getAttribute("icon");
}

/**
 * The Icon. This change takes 
 * effect immediately; you do not have to call render.
 * @param {String} value The HREF of the icon.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.setIcon = function(value)
{
	this.setAttribute("icon",value);
	var node = this.getHtmlNode("icon");
	if (value == null || value == "")
	{
		if (node)
		{
			nitobi.html.Css.setStyle(node, "display","none");
		}
	}
	else
	{
		if (node)
		{
			nitobi.html.Css.setStyle(node, "display","inline");
		}
	}
	if (node)
	{
		node.src=value;
	}
}

/**
 * Returns the source that defines the body for this tab.  For example, if an iframe is used, it will return
 * the url for the tab.  If the body is defined as a domnode, it will return the id of the node.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getSource = function()
{
	return this.getAttribute("source");
}

/**
 * The source. See {@link nitobi.tabstrip.Tab#load} to see how this value is used. load must
 * also be called for this change to take effect.
 * @param {String} value The source. Either a DOM node or (if an AJAX or IFRAME tab is used) the URL of the fragment/page.
 */
nitobi.tabstrip.Tab.prototype.setSource = function(value)
{
	this.setAttribute("source",value);
}

/**
 * Determines whether or not script blocks are recursively evaluated when
 * HTML is loaded in a tab without an iframe. The default is true.
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.isScriptEvaluationEnabled = function()
{
	var val = this.getAttribute("scriptevaluationenabled");
	if (null == val)
	{
		return true;
	}
	else
	{
		return this.getBoolAttribute("scriptevaluationenabled");
	}
}

/**
 * Determines whether or not script blocks are recursively evaluated when
 * HTML is loaded in a tab without an iframe. The default is true.
 * @param {Boolean} value true if script should be evaluated.
 */
nitobi.tabstrip.Tab.prototype.setScriptEvaluationEnabled = function(value)
{
	this.setBoolAttribute("scriptevaluationenabled",value);
}

/**
 * Returns the label for this tab.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getLabel = function()
{
	return this.getAttribute("label");
}

/**
 * The label. The label may include HTML. This change takes 
 * effect immediately; you do not have to call render.
  @param {String} value The label text.
 */
nitobi.tabstrip.Tab.prototype.setLabel = function(value)
{
	this.setAttribute("label",value);
	var node = this.getHtmlNode("label");
	if (node)
	{
		node.innerHTML = value;
	}
}

/**
 * The type of container for the tab body. It can be iframe, or if the string is empty, it is a domnode.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getContainerType = function()
{
	return this.getAttribute("containertype");
}

/**
 * The type of container for the tab body. It can be iframe, or if the string is empty, it is a domnode.
 * Once the tab has been rendered, this is immutable. To change it, remove the container, by removing
 * its HTML node (with standard Javascript DHTML), and re-render.  Alternatively, you can remove the 
 * tab, and create a new one with a different container type.
 * @param {String} value The container type. Either 'iframe' or ''.
 */
nitobi.tabstrip.Tab.prototype.setContainerType = function(value)
{
	if (value != '' && value != 'iframe')
	{
		nitobi.lang.throwError(nitobi.error.BadArg + " Valid values are 'iframe' or ''");
	}
	this.setAttribute("containertype",value);
}

/**
 * The cssclass of the tab.
 * @type String
 */
nitobi.tabstrip.Tab.prototype.getCssClass = function()
{
	return this.getAttribute("cssclass");
}

/**
 * Set the cssclass of the tab. This change takes 
 * effect immediately; you do not have to call render.
 * @param {String} cssclass The class.
 */
nitobi.tabstrip.Tab.prototype.setCssClass = function(cssclass)
{
	this.setAttribute("cssclass",cssclass);
	var node = this.getHtmlNode("customcss");
	if (node)
	{
		this.className = cssclass;
	}
}

/**
 * Determines whether to load the tab's contents when the tabstrip is first
 * rendered or when the tab is first set as the active tab.
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.getLoadOnDemandEnabled = function()
{
	if (this.getBoolAttribute("loadondemandenabled") != null) {
		return this.getBoolAttribute("loadondemandenabled");
	} else {
		return false;
	}
}

/**
 * The loadondemandenabled attribute is used to determine whether to load
 * a tab when the tabstrip is first rendered or to wait until the first time
 * the tab is set as the active tab.  If set to true, the tab will not
 * load until it is set as the active tab--i.e. until it is clicked on.  
 * In the case of IFRAME and AJAX tabs, this means 
 * that a server request won't be made until the tab is first
 * set to active.  However, if the tab's source is a DOM node, this attribute is ignored
 * and its content will be loaded when the tabstrip renders.
 * @param {Boolean} loadondemandenabled Either true or false
 */
nitobi.tabstrip.Tab.prototype.setLoadOnDemandEnabled = function(loadondemandenabled)
{
	this.setBoolAttribute("loadondemandenabled", loadondemandenabled);
}

/**
 * Used to determine if the tab's contents have been loaded.
 * If the tab's contents have been loaded, this will return true.
 * @see nitobi.tabstrip.Tab#setLoadOnDemandEnabled
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.getContentLoaded = function()
{
	return this.contentLoaded;
}

/**
 * Used to determine if the tab's contents have been loaded.
 * @see nitobi.tabstrip.Tab#setLoadOnDemandEnabled
 * @param {Boolean} contentloaded True if the content of the tab has been loaded
 */
nitobi.tabstrip.Tab.prototype.setContentLoaded = function(contentloaded)
{
	this.contentLoaded = contentloaded;
}

/**
 * Returns true if the tab has the hideoverflowenabled property set to true
 * @see #setHideOverflowEnabled
 * @type Boolean
 */
nitobi.tabstrip.Tab.prototype.getHideOverflowEnabled = function()
{
	if (this.getBoolAttribute("hideoverflowenabled") != null) 
	{
		return this.getBoolAttribute("hideoverflowenabled");
	} 
	else 
	{
		return false;
	}
}

/**
 * The hideoverflowenabled attribute can be used to set the overflow style of the tab's
 * body to hidden.  It is auto by default.
 * @see #getHideOverflowEnabled
 * @param {Boolean} hideoverflowenabled True to hide the overflow of the tab body, false to have overflow set to auto
 */
nitobi.tabstrip.Tab.prototype.setHideOverflowEnabled = function(hideoverflowenabled)
{
	this.setBoolAttribute("hideoverflowenabled", hideoverflowenabled);
	var node = this.getHtmlNode("tabbody");
	if (hideoverflowenabled == true)
	{
		node.style.overflow = "hidden";
	} else
	{
		node.style.overflow = "auto";
	}
}