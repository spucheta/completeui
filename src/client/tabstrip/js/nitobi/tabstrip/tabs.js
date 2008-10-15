/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.tabstrip");

/**
 * Creates a tabs collection.  The tabs collection is a container for individual tabs.
 * @class This class allows for modifications of certain shared tab attributes. 
 * It allows you to re-order, add, and remove the tabs from the collection. If you modify the tab 
 * collection by calling add and remove, call {@link nitobi.tabstrip.TabStrip#render} for
 * the changes to take effect.
 * <br/>
 * To obtain a reference to a specific tab in the collection use 
 * {@link nitobi.ui.Container#get}
 * @constructor
 * @see nitobi.tabstrip.TabStrip
 * @see nitobi.tabstrip.Tab
 * @param {XmlNode} [node] If you want to create a tabs list and deserialize it from the node. 
 * @extends nitobi.ui.Container
 * @implements nitobi.ui.IScrollable
 */
nitobi.tabstrip.Tabs = function(node) 
{
	nitobi.tabstrip.Tabs.baseConstructor.call(this,node);
	nitobi.ui.IScrollable.call(this);
	
	/**
	 * Fired on click. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @type nitobi.base.Event
	 */
	this.onClick = new nitobi.base.Event("click");
	this.eventMap["click"] = this.onClick;
	
	/**
	 * Fired on mouse out. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @type nitobi.base.Event
	 */
	this.onMouseOut = new nitobi.base.Event("mouseout");
	this.eventMap["mouseout"] = this.onMouseOut;
	
	/**
	 * Fired on mouse over. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
	 * @type nitobi.base.Event
	 */
	this.onMouseOver = new nitobi.base.Event("mouseover");
	this.eventMap["mouseover"] = this.onMouseOver;
	
	
	this.onEventNotify.subscribe(this.handleEventNotify,this);
	this.onBeforeEventNotify.subscribe(this.handleBeforeEventNotify,this);
	
	/**
	 * Fired before the tabs change. If the event returns false, nothing will happen.
	 * {@link nitobi.tabstrip.TabChangeEventArgs} are passed to the event handler.
	 * @type nitobi.base.Event
	 */
	this.onBeforeTabChange = new nitobi.base.Event("beforetabchange");
	this.eventMap["beforetabchange"] = this.onBeforeTabChange;

	/**
	 * Fired after the tabs have changed. {@link nitobi.tabstrip.TabChangeEventArgs} are passed to the event handler.
	 * @type nitobi.base.Event
	 */
	this.onTabChange = new nitobi.base.Event("tabchange");
	this.eventMap["tabchange"] = this.onTabChange;
	
	this.subscribeDeclarationEvents();
	
	this.renderer.setTemplate(nitobi.tabstrip.tabstripProc);
	this.onCreated.notify(new nitobi.ui.ElementEventArgs(this));
}

nitobi.lang.extend(nitobi.tabstrip.Tabs,nitobi.ui.Container);
nitobi.lang.implement(nitobi.tabstrip.Tabs,nitobi.ui.IScrollable);

/**
 * Information out the tabs class.
 * @private
 * @type nitobi.base.Profile
 */
nitobi.tabstrip.Tabs.profile = new nitobi.base.Profile("nitobi.tabstrip.Tabs",null,false,"ntb:tabs");
nitobi.base.Registry.getInstance().register(nitobi.tabstrip.Tabs.profile);

/**
 * @private
 * Load all the tabs that don't use IFRAMEs.
 */
nitobi.tabstrip.Tabs.prototype.loadTabs = function()
{	
	// We load the tab set as active, regardless of its loadondemandenabled attribute
	var tab = this.get(this.getActiveTabIndex());
	if (tab == null) {
		return;
	} else {
		tab.load();
	}

	// Now go through the rest of the tabs and load only the ones that have loadondemandenabled=false
	var nodes = this.getXmlNode().selectNodes("ntb:tab[@loadondemandenabled!='true' or not(@loadondemandenabled) and not(@id='"+tab.getId()+"')]");
	for (var i = 0; i < nodes.length; i++ ) {
		var index = nitobi.xml.indexOfChildNode(this.getXmlNode(), nodes[i]);
		var tab = this.get(index);
		tab.load();
	} 
}


/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.handleRender = function()
{
	this.handleResize();
}

/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.handleResize = function()
{
	this.setScrollableElement(this.getHtmlNode("container"));
	this.setScrollButtonsVisible(this.isOverflowed());
}

/**
 * Fired when a tab is clicked.
 * @private
 */
nitobi.tabstrip.Tabs.prototype.handleTabClick = function(tab)
{
	if (typeof(tab) == "object")
	{
		index = this.indexOf(tab);
	}
	else
	{
		index = tab;
		tab = this.get(index);
	}
		
	tab.onClick.notify(new nitobi.ui.ElementEventArgs(this));
	this.setActiveTab(tab);
}

/**
 * Displays or hides the tabs' scroll buttons. 
 * @param {Boolean} value True if the buttons should be visible.
 */
nitobi.tabstrip.Tabs.prototype.setScrollButtonsVisible = function(value)
{
	if (value != null && typeof(value) != "boolean") 
	{
		nitobi.lang.throwError(nitobi.error.BadArgType);
	}
	var el = this.getHtmlNode("scrollerbuttoncontainer");
	nitobi.html.Css.setStyle(el, "display",(value ? "" : "none"));
}

/**
 * Returns the index of the active tab. To set the active tab, use setActiveTab.
 * @see nitobi.tabstrip.Tabs#getActiveTab
 * @see nitobi.tabstrip.Tabs#setActiveTab
 * @type Number
 */
nitobi.tabstrip.Tabs.prototype.getActiveTabIndex = function()
{
	return this.getIntAttribute("activetabindex");
}

/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.setActiveTabIndex = function(index)
{
	this.setIntAttribute("activetabindex",index)
}

/**
 * Renders the tabs.
 * @private
 */
nitobi.tabstrip.Tabs.prototype.render = function()
{
	this.onBeforeRender.notify(new nitobi.ui.ElementEventArgs(this,null,this.getId()));
	this.setContainer(this.getHtmlNode().parentNode);
	this.renderer.setParameters({'apply-template':'tabs'});
	nitobi.tabstrip.Tabs.base.render.call(this,null,this.getXmlNode().ownerDocument);	
	
	// If we render again, we don't want to destroy all the containers.
	// Loop through them, and add ones that we don't have.
	var lastTab = null;
	var len = this.getLength();
	for (var i=0;i < len;i++)
	{
		var tab = this.get(i);
		
		// The bodypulse div is set to width: 100% from the xsl transform.
		// This is corrected when tab.load() is called, but we need to do it
		// here because not all tabs will have load() called on them.
		var box = nitobi.html.getBox(tab.getHtmlNode("labeltable"));
		tab.getHtmlNode("bodypulse").style.width = box.width + "px";
		
		if (!tab.isBodyHtmlNodeAvail())
		{
			this.renderer.setParameters({'apply-template':'body'});
			this.renderer.setParameters({'apply-id':(i+1)});
			if (lastTab == null)
			{
				this.renderer.renderIn(this.getBodiesContainerHtmlNode(),this.getState().ownerDocument);
			}
			else
			{
				this.renderer.renderAfter(lastTab,this.getState().ownerDocument);
			}

			tab.load();

		}
		else
		{
			tab.autoSetActivityIndicator();
			lastTab = tab.getBodyHtmlNode();
		}
		
	}
	if (len > 0) 
	{
		this.getActiveTab().show();
	}
	this.onRender.notify(new nitobi.ui.ElementEventArgs(this,null,this.getId()));
}

/**
 * Returns the HTML element that contains all the tabs' bodies.
 * @type HTMLElement
 */
nitobi.tabstrip.Tabs.prototype.getBodiesContainerHtmlNode = function()
{
	if (this.bodiesContainerHtmlNode)
	{
		return this.bodiesContainerHtmlNode;
	}
	else
	{
		// TODO: Huh? Getting the tabstrip to get this is wrong. Needs to be id'd according to the tabs. 
		var node = this.getParentObject().getHtmlNode("tabbodiescontainer");
		if (node==null)
		{
			nitobi.lang.throwError(nitobi.error.NoHtmlNode + " The bodiesContainer html element could not be found.");
		}
		this.bodiesContainerHtmlNode=node;
		return node;	
	}
}

/**
 * Returns the active tab.
 * @see nitobi.tabstrip.Tabs#getActiveTabIndex
 * @see nitobi.tabstrip.Tabs#setActiveTab
 * @type nitobi.tabstrip.Tab
 */
nitobi.tabstrip.Tabs.prototype.getActiveTab = function()
{
	return this.get(this.getActiveTabIndex());
}

/**
 * Sets the active tab. The tab must be a part of the tabstrip's collection
 * of tabs.
 * @param {nitobi.tabstrip.Tab/Number} tab The tab to make active or the index of the tab to make active.
 */
nitobi.tabstrip.Tabs.prototype.setActiveTab = function(tab)
{
	if (null == tab)
	{
		nitobi.lang.throwError(nitobi.error.BadArgType);
	}
	try
	{
		var index;
		var activeTab = this.getActiveTab();
	
		if (typeof(tab) == "object")
		{
			index = this.indexOf(tab);
		}
		else
		{
			index = tab;
			tab = this.get(index);
		}
		if (index == this.getActiveTabIndex())
		{
			return;
		}
		var args = new nitobi.tabstrip.TabChangeEventArgs(this, null, this.getId(), activeTab, tab);
		if(this.onBeforeTabChange.notify(args))
		{
			if (this.getActivateEffect() == "fade")
			{
				nitobi.tabstrip.Tabs.transition(this,activeTab,tab);			
			}
			else
			{
				activeTab.hide();
				if (tab.getContentLoaded() == false) {
					tab.load();
				} 
				tab.show();	
			}
			this.setActiveTabIndex(index);
			this.onTabChange.notify(args);
		}
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected + " The active tab could not be set.",err);	
	}
}

/**
 * @private
 */
nitobi.tabstrip.Tabs.transition = function(tabs,tabToHide,tabToShow)
{
	var hideEl = tabToHide.getBodyHtmlNode();
	var showEl = tabToShow.getBodyHtmlNode();
	var hideIndex = nitobi.html.indexOfChildNode(hideEl.parentNode,hideEl);
	var showIndex = nitobi.html.indexOfChildNode(showEl.parentNode,showEl);

	var elToMove, elToKeep;
	
	if (showIndex > hideIndex)
	{
		elToMove = showEl;
		elToKeep = hideEl;
	}
	else
	{
		elToMove = hideEl;
		elToKeep = showEl;
	}
	
	nitobi.html.Css.setOpacity(hideEl, 100);
	
	var index = nitobi.html.indexOfChildNode(hideEl.parentNode,hideEl);
	var box = nitobi.html.getBox(hideEl);

	if (hideIndex < showIndex)
	{
		//	TODO: The "effect" argument is here is a place holder for a real effect.
		tabToShow.show("effect");
	}
	
	var container = tabs.getParentObject().getHtmlNode("tabbodiesdivcontainer");
	container.style.height = nitobi.html.getBox(container).height + "px";
	var top = -1 * nitobi.html.getBox(hideEl).height;
	var disp = elToMove.style.display;
	elToMove.style.display = "none";
	elToMove.style.top = top + "px";
	elToMove.style.left="0px";
	elToMove.style.left = "0px";
	elToMove.style.position = "relative";
	elToMove.style.height = box.height + "px";
	elToKeep.style.height = box.height + "px";
	
	container.style.height = "100%";

	elToMove.style.display = disp;	
	tabToHide.hide("effect");
	if (hideIndex > showIndex)
	{
		tabToShow.show("effect");
	}
	nitobi.ui.Effects.fade(showEl,100,400,nitobi.lang.close(tabToShow, tabToShow.show));
}

/**
 * The alignment of the tabs. Valid values are left, right, and center.
 * @type String
 */
nitobi.tabstrip.Tabs.prototype.getAlign = function()
{
	return this.getAttribute("align");
}

/**
 * The alignment of the tabs. 
 * Call {@link nitobi.tabstrip.TabStrip#render} after setting the alignment.
 * @param {String} value The alignment.  Valid values are left, right, and center.
 */
nitobi.tabstrip.Tabs.prototype.setAlign = function(value)
{
	if (value != "left" && value !="right" && value!="center")
	{
		nitobi.lang.throwError(nitobi.error.BadArg);
	}
	this.setAttribute("align",value);
}

/**
 * Determines what effect is applied when the tab is activated. Valid values
 * are 'none', and 'fade'.
 * @type String
 */
nitobi.tabstrip.Tabs.prototype.getActivateEffect = function()
{
	return this.getAttribute("activateeffect");
}

/**
 * Determines what effect is applied when the tab is activated.
 * @param {String} value The effect.  Valid values are 'none', and 'fade'.
 */
nitobi.tabstrip.Tabs.prototype.setActivateEffect = function(value)
{
	if (value != "" && value !="fade")	
	{
		nitobi.lang.throwError(nitobi.error.BadArg);
	}
	this.setAttribute("activateeffect",value);
}

/**
 * The height of the tabs.
 * @type String
 */
nitobi.tabstrip.Tabs.prototype.getHeight = function()
{
	return this.getAttribute("height");
}

/**
 * The height of the tabs. Call {@link nitobi.tabstrip.TabStrip#render} after setting the height.
 * @param {String} value The height.
 */
nitobi.tabstrip.Tabs.prototype.setHeight = function(value)
{
	this.setAttribute("height",value);
}

/**
 * The overlap of the tabs.
 * @type Number
 */
nitobi.tabstrip.Tabs.prototype.getOverlap = function()
{
	return this.getIntAttribute("overlap");
}

/**
 * The overlap of the tabs. If you want the tabs to be aligned next to each other set this to zero.
 * If you want more space in between the tabs, set this value to a negative value.
 * Call {@link nitobi.tabstrip.TabStrip#render} after setting the overlap.
 * @param {Number} value The overlap.
 */
nitobi.tabstrip.Tabs.prototype.setOverlap = function(value)
{
	this.setIntAttribute("overlap",value);
}

/**
 * Removes a tab. Call {@link nitobi.tabstrip.TabStrip#render} after adding or removing tabs.
 * @param {nitobi.tabstrip.Tab} The tab or the index of the tab to remove.
 */
nitobi.tabstrip.Tabs.prototype.remove = function(value)
{
	if (value == null)
	{
		nitobi.lang.throwError(nitobi.error.BadArg);
	}
	var i;
	// TODO: Wrap this indexing stuff up somewhere else.
	if (typeof(value) != "number")
	{
		i = this.indexOf(value);
	}
	else
	{
		i = value;
	}
	if (i == -1)
	{
		nitobi.lang.throwError(nitobi.error.BadArg + " The tab could not be found.");
	}

	var tab = this.get(i);
	var activeI = this.getActiveTabIndex();
	if (this.getLength() == 1)
	{
		activeI = -1;
	}
	else if (activeI > i)
	{
		activeI--;	
	} 
	else if (activeI == i)
	{
		if (!(activeI == 0 && i == 0))
		{
			activeI--;	
		}
	}
	
	this.setActiveTabIndex(activeI);
	tab.destroyHtml();
	nitobi.tabstrip.Tabs.base.remove.call(this,value);
}


/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.handleBeforeEventNotify = function(eventArgs)
{
	var event = eventArgs.htmlEvent;
	var idInfo = nitobi.ui.Element.parseId(eventArgs.targetId);
	if (event.type == "click")
	{
		// Ignore the click if the tab is disabled.
		var tab = this.getById(idInfo.id);
		if (null == tab)
		{
			return false;
		}
		else
		{
			return tab.isEnabled();
		}
	}
}

/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.handleEventNotify = function(eventArgs)
{
	var event = eventArgs.htmlEvent;
	var idInfo = nitobi.ui.Element.parseId(eventArgs.targetId);
	switch(event.type)
	{
		case "click":
		{
			try
			{
				if (idInfo.localName!="scrollleft" && idInfo.localName!="scrollright")
				{
					var tab = this.getById(idInfo.id);
					this.setActiveTab(tab);
				}
			}
			catch(err)
			{
				nitobi.lang.throwError("The Tabs object encountered an error handling the click event.",err);
			}
			break;
		}
		case "mousedown":
		{
			var closure;
			switch(idInfo.localName)
			{
				case "scrollleft":
				{
					this.scrollLeft();
					closure = nitobi.lang.close(this,this.scrollLeft,[]);		
					break;
				}
				case "scrollright":
				{
					this.scrollRight();
					closure = nitobi.lang.close(this,this.scrollRight,[]);
					break;
				}
			}
			this.stopScrolling();
			this.scrollerEventId = window.setInterval(closure,100);
			nitobi.html.attachEvent(document.body,"mouseup",this.stopScrolling,this);
			break;
		}
		case "mouseup":
		{
			this.stopScrolling();
			break;
		}
		
	}
}


/**
 * @private
 */
nitobi.tabstrip.Tabs.prototype.stopScrolling = function()
{
	window.clearInterval(this.scrollerEventId);
}
