/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.tabstrip");

if (false)
{
	/**
	 * @namespace The namespace for classes that make up the Nitobi Tabstrip component.
	 * @constructor
	 */
	nitobi.tabstrip = function(){};
}

/**
 * Creates a Nitobi Tabstrip.  Note: Some operations require that you call {@link #render} after changing 
 * some properties.  This is due to the expense of changing them and rendering them individually.
 * @class The base class for the Nitobi Tabstrip component.  You can create a Tabstrip through script or using the declaration.
 * A tabstrip declaration takes this form:
 * <pre class="code">
 * &lt;ntb:tabstrip id="SimpleTabstrip" width="800px" height="600px"&gt;
 * 	&lt;ntb:tabs height="" align="center" overlap="15"&gt;
 * 		&lt;ntb:tab width="190px" tooltip="Welcome." label="IFrame Tab" source="http://www.nitobi.com" containertype="iframe"&gt;&lt;/ntb:tab&gt;
 * 		&lt;ntb:tab width="190px" tooltip="Welcome." label="DOM Tab" source="tab2"&gt;&lt;/ntb:tab&gt;
 * 		&lt;ntb:tab width="190px" tooltip="Welcome." label="Ajax Tab" source="tab3.html" loadondemandenabled="true"&gt;&lt;/ntb:tab&gt;
 * 	&lt;/ntb:tabs&gt;
 * &lt;/ntb:tabstrip&gt;
 * &lt;div id="tab2"&gt;
 * 	&lt;h1&gt;DOM Tab&lt;/h1&gt;
 * 	&lt;img src="images/nitobi.jpg" /&gt;
 * &lt;/div&gt;
 * </pre>
 * @constructor
 * @example
 * var t1 = new nitobi.tabstrip.TabStrip("aUniqueId");
 * t1.setWidth("900px");
 * t1.setHeight("600px");
 * var tabs = new nitobi.tabstrip.Tabs();
 * var tab = new nitobi.tabstrip.Tab();
 * tab.setWidth("200px");
 * tab.setLabel("Nitobi");
 * tab.setContainerType("iframe");
 * tab.setSource("http://nitobi.com");
 * tabs.add(tab);
 * t1.setTabs(tabs);
 * t1.setContainer(container);
 * t1.render();
 * @param {String} [id] The id of the control. If you do not specify an id, one is created for you.
 * @extends nitobi.ui.Element
 */
nitobi.tabstrip.TabStrip = function(id) 
{
	nitobi.tabstrip.TabStrip.baseConstructor.call(this,id);
	this.renderer.setTemplate(nitobi.tabstrip.tabstripProc);
	
	
	/**
	 * Fired on click. {@link nitobi.ui.ElementEventArgs} are passed to the event handler.
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
	
	this.subscribeDeclarationEvents();
	
	/**
	 * @private
	 */
	this.renderTimes = 0;
	/**
	 * The version number.
	 * @private
	 * @type String
	 */
	this.version = "0.8";
	this.onCreated.notify(new nitobi.ui.ElementEventArgs(this));
}

nitobi.lang.extend(nitobi.tabstrip.TabStrip,nitobi.ui.Element);

/**
 * Information about the tabstrip class.
 * @private
 * @type nitobi.base.Profile
 */
nitobi.tabstrip.TabStrip.profile = new nitobi.base.Profile("nitobi.tabstrip.TabStrip",null,false,"ntb:tabstrip");
nitobi.base.Registry.getInstance().register(nitobi.tabstrip.TabStrip.profile);

/**
 * Returns the list of tabs for this tabstrip component.
 * @example
 * &#102;unction changeLabel()
 * {
 * 	var tabstrip = nitobi.getComponent('tabstrip1');
 * 	var tabs = tabstrip.getTabs();
 * 	var tab = tabs.get(0);
 * 	tab.setLabel("A new label for the 1st tab");
 * }
 * @type nitobi.tabstrip.Tabs
 */
nitobi.tabstrip.TabStrip.prototype.getTabs = function()
{
	return this.getObject(nitobi.tabstrip.Tabs.profile);
}

/**
 * Sets the tab collection for the Tabstrip object.
 * @example
 * var tabstrip = nitobi.getComponent("myTabstrip");
 * var tabs = new nitobi.tabstrip.Tabs();
 * var tab = new nitobi.tabstrip.Tab();
 * tab.setWidth("200px");
 * tab.setLabel("Nitobi");
 * tab.setContainerType("iframe");
 * tab.setSource("http://www.nitobi.com");
 * tabs.add(tab);
 * tabstrip.setTabs(tabs);
 * tabstrip.render();
 * @param {nitobi.tabstrip.Tabs} tabs The list of tabs.
 */
nitobi.tabstrip.TabStrip.prototype.setTabs = function(tabs)
{
	return this.setObject(tabs);
}


/**
 * Correctly fits the inside containers to the outside container. If 
 * you perform an operation on the outside container that modifies
 * its dimensions, you may need to call this function.
 * @see #setWidth
 * @see #setHeight
 * @see #render
 */
nitobi.tabstrip.TabStrip.prototype.fitContainers = function()
{
	try
	{
		var primary = this.getHtmlNode();
		if (primary)
		{
			var secondary = this.getHtmlNode("secondarycontainer");
			if (secondary)
			{
				
				var box = nitobi.html.getBox(primary);
				secondary.style.height = box.height + "px";
				secondary.style.width = box.width + "px";
			}
		}
	}
	catch(err)
	{
		//	nitobi.error.throwError(nitobi.error.Unexpected + " fitContainers failed",err)
	}
}

/**
 * Renders the tabstrip.  The first time the tabstrip is rendered, both the tabs and their 
 * body containers are rendered. On subsequent render calls, unless tabs are added and removed,
 * only the tabs are rendered. This prevents the user losing data in a tab body.
 */
nitobi.tabstrip.TabStrip.prototype.render = function()
{
	this.onBeforeRender.notify(new nitobi.ui.ElementEventArgs(this,null,this.getId()));
	if (this.renderTimes==0)
	{
		nitobi.tabstrip.TabStrip.base.render.call(this);
		var tabs = this.getTabs();
		this.onRender.subscribe(tabs.handleRender,tabs)
		tabs.loadTabs();
		var node = this.getHtmlNode();
		if (nitobi.browser.IE)
		{
			nitobi.html.attachEvent(node,"resize",this.fitContainers,this);
			nitobi.html.attachEvent(node,"resize",tabs.handleResize,tabs);
		}
		else
		{
			nitobi.html.attachEvent(window,"resize",this.fitContainers,this);
			nitobi.html.attachEvent(window,"resize",tabs.handleResize,tabs);
		}
	}
	else
	{
		var tabs = this.getTabs();
		tabs.render();
	}
	this.renderTimes++;
	this.onRender.notify(new nitobi.ui.ElementEventArgs(this,null,this.getId()));
	this.fitContainers();
	if (node) node.jsObject = this;
}

/**
 * Returns the width of the tabstrip e.g "500px"
 * @type String
 */
nitobi.tabstrip.TabStrip.prototype.getWidth = function()
{
	return this.getAttribute("width");
}

/**
 * Set the width of the tabstrip.  This change takes effect immediately; no
 * render is required. You may need to call fitContainers.
 * @example
 * &#102;unction changeWidth()
 * {
 * 	var tabstrip = nitobi.getComponent('tabstrip1');
 * 	tabstrip.setWidth("400px");
 * 	tabstrip.fitContainers();
 * }
 * @see #fitContainers
 * @param {String} width Any html measurement (in 'px' or '%').
 */
nitobi.tabstrip.TabStrip.prototype.setWidth = function(width)
{
	this.setAttribute("width",width);
	this.setStyle("width",width);	
}

/**
 * Returns the height of the tabstrip e.g "500px"
 * @type String
 */
nitobi.tabstrip.TabStrip.prototype.getHeight = function()
{
	return this.getAttribute("height");
}

/**
 * Set the height of the tabstrip. This change takes effect immediately; no
 * render is required. You may need to call {@link #fitContainers}.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code>
 * &#102;unction changeHeight()
 * {
 * 	var tabstrip = nitobi.getComponent('tabstrip1');
 * 	tabstrip.setHeight("400px");
 * 	tabstrip.fitContainers();
 * }
 * </code></pre>
 * </div>
 * @param {String} height Any html measurement.
 */
nitobi.tabstrip.TabStrip.prototype.setHeight = function(height)
{
	this.setAttribute("height",height);
	this.setStyle("height",height);	
}

/**
 * Returns the cssclass of the tabstrip.  Should use {@link #getTheme}.
 * @type String
 */
nitobi.tabstrip.TabStrip.prototype.getCssClass = function()
{
	return this.getAttribute("cssclass");
}

/**
 * Returns the theme of the tabstrip.
 * @type String
 */
nitobi.tabstrip.TabStrip.prototype.getTheme = function()
{
	return this.getAttribute("theme");
}

/**
 * Set the cssclass of the tabstrip. This change takes effect immediately; no
 * render is required. You may need to call fitContainers.
 * @see #fitContainers
 * @param {String} cssclass The classname.
 */
nitobi.tabstrip.TabStrip.prototype.setCssClass = function(cssclass)
{
	this.setAttribute("cssclass",cssclass);
	var node = this.getHtmlNode();
	if (node)
	{
		node.className = cssclass;
	}
}

/**
 * Set the theme of the tabstrip (same as setCssClass, added for clarity). This change takes effect immediately; no
 * render is required. You may need to call fitContainers.
 * @see #fitContainers
 * @param {String} theme The theme name.
 */
nitobi.tabstrip.TabStrip.prototype.setTheme = function(theme)
{
	this.setAttribute("theme",theme);
	var node = this.getHtmlNode();
	if (node)
	{
		node.className = theme;
	}
}

/**
 * Returns the css style of the tabstrip.  The css style is defined on the &lt;ntb:tabstrip&gt; tag to define some 
 * in line styling.
 * @type String
 */
nitobi.tabstrip.TabStrip.prototype.getCssStyle = function()
{
	return this.getAttribute("cssstyle");
}

/**
 * Set the css style of the tabstrip.
 * @param {String} cssstyle The style.
 */
nitobi.tabstrip.TabStrip.prototype.setCssStyle = function(cssstyle)
{
	this.setAttribute("cssstyle",cssstyle);
}

/**
 * Returns the tab index of the tabstrip.
 * @type Number
 */
nitobi.tabstrip.TabStrip.prototype.getTabIndex = function()
{
	return this.getAttribute("tabindex");
}

/**
 * @private
 */
nitobi.tabstrip.TabStrip.handleEvent = function(id, event, targetId, cancelBubble)
{
	try
	{
		var tabstrip = $(id);
		if (tabstrip == null)
		{
			nitobi.lang.throwError("The tabstrip event could not find the component object.  The element with the specified id could not be found on the page.");
		}
		tabstrip = tabstrip.jsObject;
	    tabstrip.notify(event,targetId,null,cancelBubble);	
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected,err);
	}
}

/**
 * Precaches images found in the tabstrip's stylesheets.  Calling this function before loading
 * a tabstrip component will ensure that all the tabstrip's images are loaded before the tabstrip is rendered.
 * @param {String} url an optional url for your own tabstrip css file (just the filename)
 * @private
 */
nitobi.tabstrip.TabStrip.precacheImages = function(url)
{
	var url = url || 'tabstrip.css';
	var sheets = nitobi.html.Css.getStyleSheetsByName(url);
	for (var i = 0; i < sheets.length; i++)
	{
		nitobi.html.Css.precacheImages(sheets[i]);
	}
};

/**
 * @ignore
 */
nitobi.TabStrip = nitobi.tabstrip.TabStrip;

