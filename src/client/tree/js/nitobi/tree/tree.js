/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.tree');

if (false)
{
	/**
	 * @namespace <code>nitobi.tree</code> is the namespace for classes that make up 
	 * the Nitobi Tree component.
	 * @constructor
	 */
	nitobi.tree = function(){};
}
/**
 * Creates a nitobi tree.  Optionally, creates a tree at the given declaration. 
 * @class The nitobi tree. A tree declaration takes this form:
 * <pre class="code">
 * &lt;ntb:tree id="tree1" cssclass="folders" expanded="false"&gt;
 * 	&lt;ntb:children&gt;
 * 		&lt;ntb:node label="United States"&gt;
 * 			&lt;ntb:children&gt;
 * 				&lt;ntb:node label="New York City" &gt;&lt;/ntb:node&gt;
 * 				&lt;ntb:node label="Washington" &gt;&lt;/ntb:node&gt;
 * 				&lt;ntb:node label="Los Angeles" &gt;&lt;/ntb:node&gt;
 * 			&lt;/ntb:children&gt;
 * 		&lt;/ntb:node&gt;
 * 		&lt;ntb:node label="Canada" &gt;
 * 			&lt;ntb:children&gt;
 * 				&lt;ntb:node label="Toronto"&gt;&lt;/ntb:node&gt;
 * 				&lt;ntb:node label="Vancouver"&gt;&lt;/ntb:node&gt;
 * 				&lt;ntb:node label="Calgary"&gt;&lt;/ntb:node&gt;
 * 			&lt;/ntb:children&gt;
 * 		&lt;/ntb:node&gt;
 * 	&lt;/ntb:children&gt;
 * &lt;/ntb:tree&gt;
 * </pre>
 * Calling <code>nitobi.loadComponent('tree1');</code> will render a tree at the location of that XML 
 * declaration in your web page. To access this API you get the tree object from its node in the HTML 
 * document. We can, for example, add a parameter to the gethandler:
 * <pre class="code">
 * var tree = $ntb('tree1').jsObject;
 * var gethandler = tree.getGetHandler();
 * gethandler = nitobi.html.Url.addParameter(gethandler, 'testname', 'testvalue');
 * tree.setGetHandler(gethandler);
 * </pre>
 * @constructor
 * @param {String} element The id of the control's declaration, or an xml node that describes the tree. 
 * If you do not specify an id, one is created for you. (Optional)
 * @param {Function} onLoadCallback A function to call once the tree has loaded.  This can be used in 
 * case data is loaded asynchronously (by a gethandler) and you cannot rely on the tree being fully initialized
 * in the next line of code.
 * @extends nitobi.ui.Element
 * @see nitobi.tree.Children 
 * @see nitobi.tree.Node
 */
nitobi.tree.Tree = function(element, onLoadCallback) 
{
	nitobi.tree.Tree.baseConstructor.call(this, element);
	this.renderer.setTemplate(nitobi.tree.xslTemplate);

	if (nitobi.browser.IE && document.compatMode == 'BackCompat')
	{
		this.renderer.setParameters(
			{
				iequirks: 'true'
			}
		);
	}
	// Defaults
	var sidebarEnabled = this.getSidebarEnabled();
	if (typeof(sidebarEnabled) == 'undefined')
	{
		this.setSidebarEnabled(false);
	}
	
	/**
	 * Fires when data has been loaded by the tree and the tree is ready to be rendered. 
	 * {@link nitobi.base.EventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onDataReady = new nitobi.base.Event();
	this.eventMap["dataready"] = this.onDataReady;
	/**
	 * Fires when any node in the tree is clicked on.  The clickable area includes the icon 
	 * and the label of the node. {@link nitobi.ui.EventNotificationEventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onClick = new nitobi.base.Event();
	this.eventMap["mousedown"] = this.onClick;
	this.eventMap["click"] = this.onClick;
	/**
	 * Fires when any node in the tree is hovered over.  The hover area includes the entire width of 
	 * the tree. {@link nitobi.ui.EventNotificationEventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onMouseOver = new nitobi.base.Event();
	this.eventMap["mouseover"] = this.onMouseOver;
	/**
	 * Fires when the mouse exits the area that a node occupies.  This area includes the entire width of 
	 * the tree. {@link nitobi.ui.EventNotificationEventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onMouseOut = new nitobi.base.Event();
	this.eventMap["mouseout"] = this.onMouseOut;


	/**
	 * Fires when any node is selected. {@link nitobi.ui.ElementEventArgs} are passed to any 
	 * subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onSelect = new nitobi.base.Event();
	this.eventMap["select"] = this.onSelect;
	/**
	 * Fires when any node is deselected. {@link nitobi.ui.ElementEventArgs} are passed to any 
	 * subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onDeselect = new nitobi.base.Event();
	this.eventMap["deselect"] = this.onDeselect;
	
	/**
	 * Fires when any node is expanded or collapsed. {@link nitobi.ui.ElementEventArgs} are passed to any 
	 * subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onNodeToggled = new nitobi.base.Event();
	this.eventMap["nodetoggled"] = this.onNodeToggled;
	
	/**
	 * @ignore
	 */
	this.onLoadCallback = onLoadCallback || null;
	
	/**
	 * @ignore
	 */
	this.selected = this.find('selected','true');
	
	var effectFamily = this.getAttribute('effect','shade'); 
	/**
	 * The effect class to use when expanding a node in the tree.  Use the
	 * <code>effect</code> attribute in the XML declaration to set an effect family.
	 * Default: {@link nitobi.effects.ShadeDown}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.showEffect = nitobi.effects.families[effectFamily].show;
	/**
	 * The effect class to use when collapsing a node in the tree.  Use the
	 * <code>effect</code> attribute in the XML declaration to set an effect family.
	 * Default: {@link nitobi.effects.ShadeUp}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.hideEffect = nitobi.effects.families[effectFamily].hide;

	this.onBeforePropagate.subscribe(this.handlePropagate,this);
	this.onEventNotify.subscribe(this.handleEvent,this);
	this.onNodeToggled.subscribe(this.handleScrollSizeChanged,this);	
	
	this.onRender.subscribe(this.handleScrollSizeChanged,this);
	
	this.subscribeDeclarationEvents();	

	this.onDataReady.subscribe(this.handleDataReady, this);
	if (this.onLoadCallback)
	{
		this.onDataReady.subscribeOnce(this.onLoadCallback);
	}
	var gethandler = this.getGetHandler()
	if (gethandler)
	{
		this.setGetHandler(gethandler);
		
		// If the declaration didn't provide a collection of children, then load from gethandler.
		if (!this.getChildren())
		{
			this.loadData();
		}
		else
		{
			this.onDataReady.notify(new nitobi.base.EventArgs(this,this.onDataReady));
		}
	}
	else
	{
		this.onDataReady.notify(new nitobi.base.EventArgs(this,this.onDataReady));
	} 
};

nitobi.lang.extend(nitobi.tree.Tree, nitobi.ui.Element);

nitobi.base.Registry.getInstance().register(
		new nitobi.base.Profile("nitobi.tree.Tree",null,false,"ntb:tree")
);

/**
 * @ignore
 */
nitobi.tree.Tree.prototype.handlePropagate = function(eventArgs)
{
	var event = eventArgs.htmlEvent;
	if (event.type === 'mousedown')
	{
		return false;
	}
	else if (event.type === 'mouseover')
	{
		return false;
	}
	else if (event.type === 'mouseout')
	{
		return false;
	}
	return true;
};

/**
 * @ignore
 */
nitobi.tree.Tree.prototype.handleEvent = function(eventArgs)
{
	var event = eventArgs.htmlEvent;
	var idProperties = nitobi.ui.Element.parseId(eventArgs.targetId);
	
	// Cut right to the specified object for a click event:
	if (event.type === 'mousedown')
	{
		var targetNode = this.find('id',idProperties.id)[0];
		if (idProperties.localName === 'chooser')
		{
			this.setSelected([targetNode]);
			targetNode.notify(event,eventArgs.targetId);
		}
		else if (idProperties.localName === 'junction')
		{
			targetNode.toggleChildren();
		}
		else
		{
			targetNode.notify(event,eventArgs.targetId);
		}
	}
	else if (event.type === 'mouseover')
	{
		if (this.getHoverHighlight())
		{
			var el = $ntb(idProperties.id+'.css');
			if (el)
			{
				nitobi.html.Css.addClass(el,'hover');
			}
		}
	}
	else if (event.type === 'mouseout')
	{
		if (this.getHoverHighlight())
		{
			var el = $ntb(idProperties.id+'.css');
			if (el)
			{
				nitobi.html.Css.removeClass(el,'hover');
			}
		}
	}
	else if (event.type === 'keydown')
	{
		var key = event.keyCode;
		var keyMap = nitobi.tree.Tree.keyMap;
		var selected = this.getSelected();
		if (selected.length)
		{
			var currentNode = selected[0];
			switch(key)
			{
				case keyMap.LEFT:
					nitobi.html.cancelEvent(event);
					var c = currentNode.getChildren();
					if (c && c.isVisible())
					{
						currentNode.toggleChildren();
					}
					else
					{
						var p = currentNode.getParent(); 
						if (p)
						{
							this.setSelected([p]);
						}
					}
					break;
				case keyMap.RIGHT:
					nitobi.html.cancelEvent(event);
					var c = currentNode.getChildren();
					if (c && c.getLength() && c.isVisible())
					{
						this.setSelected([c.get(0)]);
					}
					else
					{
						currentNode.toggleChildren();
					}
					break;
				case keyMap.UP:
					nitobi.html.cancelEvent(event);
					var p = currentNode.getParent();
					var c = currentNode.getParentObject();
					var i = c.indexOf(currentNode);
					if (i)
					{
						this.setSelected([c.get(i-1).getFurthestVisibleDescendent()]);
					}
					else if (p)
					{
						this.setSelected([p]);
					}
					break;
				case keyMap.DOWN:
					nitobi.html.cancelEvent(event);
					var c = currentNode.getChildren();
					
					if (c && c.getLength() && c.isVisible())
					{
						this.setSelected([c.get(0)]);
					}
					else
					{
						var c = null;
						while(currentNode && (c = currentNode.getParentObject()))
						{
							var i = c.indexOf(currentNode);
							if (i < c.getLength()-1)
							{
								this.setSelected([c.get(i+1)])
								break;
							}
							currentNode = currentNode.getParent();
						}
					}
					break;
			}
		}
		else
		{
			var root = this.getRoot();
			if (root)
			{
				this.setSelected([root]);
			}
		}
	}
};

/**
 * Sets the id of the target frame.  When a frame target is set, the tree subscribes a function to its own
 * <CODE>onSelect</CODE> event.  The function changes the source of the frame to the URL specified by the 
 * selected node's <CODE>url</CODE> attribute.
 * @param {String} frame the id of the frame to change
 */
nitobi.tree.Tree.prototype.setTargetFrame = function(frame)
{
	this.setAttribute('targetframe',frame);
};

/**
 * Returns the tree's target frame, if one is set. When a frame target is set, the tree subscribes a function 
 * to its own <CODE>onSelect</CODE> event.  The function changes the source of the frame to the URL specified 
 * by the selected node's <CODE>url</CODE> attribute.
 * @type String
 */
nitobi.tree.Tree.prototype.getTargetFrame = function()
{
	return this.getAttribute('targetframe');
};

/**
 * Sets the theme class of the tree.
 * Note: Remember to include the CSS file for this class in your page. 
 * @param {String} cssClass the class name for the theme
 */
nitobi.tree.Tree.prototype.setCssClass = function(cssClass)
{
	nitobi.html.Css.swapClass(this.getHtmlNode(), this.getCssClass(), cssClass);
	this.setAttribute('cssclass',cssClass);
};

/**
 * Sets the theme class of the tree.
 * Note: Remember to include the CSS file for this class in your page. 
 * @param {String} cssClass the class name for the theme
 */
nitobi.tree.Tree.prototype.setTheme = function(theme)
{
	this.setCssClass(theme);
};

/**
 * Returns the theme class of the tree.
 * @type String
 */
nitobi.tree.Tree.prototype.getCssClass = function()
{
	return this.getAttribute('cssclass');
};

/**
 * Returns the theme class of the tree.
 * @type String
 */
nitobi.tree.Tree.prototype.getTheme = function()
{
	return this.getCssClass();
};

/**
 * Returns the <CODE>children</CODE> collection for the tree.  A tree's <CODE>children</CODE>
 * object contains the root-level nodes of the tree.
 * @type nitobi.tree.Children
 */
nitobi.tree.Tree.prototype.getChildren = function()
{
	return this.getObject(nitobi.tree.Children.profile);
};

/**
 * Sets the <CODE>children</CODE> collection for the tree.
 * @param {nitobi.tree.Children} children the new <CODE>children</CODE> collection
 */
nitobi.tree.Tree.prototype.setChildren = function(children)
{
	return this.setObject(children);
};

/**
 * Returns the root node of the tree.  If the tree has multiple root nodes, this method
 * returns the first of those.
 * A synonym for <CODE>tree.getChildren().get(0)</CODE>.
 * @type nitobi.tree.Node
 */
nitobi.tree.Tree.prototype.getRoot = function()
{
	return this.getChildren().get(0);	
};

/**
 * Returns an <CODE>Array</CODE> of the currently selected nodes as {@link nitobi.tree.Node}
 * objects.
 * @type Array
 * @see nitobi.tree.Node
 */
nitobi.tree.Tree.prototype.getSelected = function()
{
	return this.selected;
};

/**
 * Sets the currently selected nodes in the tree.
 * @example 
 * var tree = nitobi.getComponent("myTree");
 * var thirdNode = tree.getChildren().get(2);
 * tree.setSelected([thirdNode]);
 * @param {Array} selected an array of {@link nitobi.tree.Node} objects.
 */
nitobi.tree.Tree.prototype.setSelected = function(selected)
{
	var p = null;
	
	while (p = this.selected.pop())
	{
		try {
			p.deselect();
			this.onDeselect.notify(new nitobi.ui.ElementEventArgs(this,this.onDeselect,p.getId()));
		}
		catch (e)
		{
			// These objects may or may not still exist.
		}		
	}
	
	p = null;
	var tabindexSet = false; 
	while (p = selected.pop())
	{
		if (typeof(p) === 'string' )
		{
			p = this.find('id', p)[0];
		}
		this.selected.push(p);

		// Frame Targeting
		var targetFrame = this.getTargetFrame();
		var url = p.getUrl();
		if (targetFrame && targetFrame != "" && url && url != "")
		{
			var frame = eval('parent.'+targetFrame);
			if (!frame)
			{
				frame = $ntb(targetFrame);
				if (frame)
				{
					frame.src = url;
				}
			}
			else
			{
				frame.location.href = url;
			}
		}
		// Set the tab index
		if (tabindexSet == false)
		{
			p.select(this.getTabIndex());
			var scrollerNode = this.getHtmlNode("scroller");
			if (scrollerNode.tabIndex != -1)
			{
				scrollerNode.tabIndex = -1;
			}
			tabIndexSet = true;  
		}
		else
		{
			p.select();
		}
		this.onSelect.notify(new nitobi.ui.ElementEventArgs(this,this.onSelect,p.getId()));
	}	
};

/**
 * Returns an <CODE>Array</CODE> of the nodes matching the given key/value pair.
 * Typical usage would be to find a node with a known id:
 * <pre class="code">
 * 	var myNode = tree.find('id','myNodeId')[0];
 * </pre>
 * Or to find all the nodes of a specific type:
 * <pre class="code">
 * 	var fooNodes = tree.find('type','foo');
 * </pre>
 * Note: The running time for this method increases linearly with the number of nodes found.
 * @param {String} key The key to search on.
 * @param {String} value The value to search with.
 * @type Array
 */
nitobi.tree.Tree.prototype.find = function(key, value)
{
	if (typeof(value) === 'string')
	{
		value = "'" + value + "'";
	}
	var found = new Array();
	var c = this.getChildren();
	if (c)
	{
		var xmlNode = c.getXmlNode();

		var located = xmlNode.selectNodes('//*[@'+key+'='+value+']');
		for (var i = 0; i < located.length; i++)
		{
			var node = located[i];
			var locator = '';
			while (node)
			{
				var name = node.nodeName;
				if (name.indexOf('node') > -1)
				{
					locator = ".getById('"+node.getAttribute("id")+"')" + locator;
				}
				else if (name.indexOf('children') > -1)
				{
					locator = ".getChildren()" + locator;
				}
				else if (name.indexOf('tree') > -1)
				{
					locator = "this" + locator;
					break;
				}
				else
				{
					nitobi.lang.throwError("Unexpected and Invalid XML Structure");
				}
				node = node.parentNode;
			}
			if (locator !== '')
			{
				found.push(eval(locator));
			}
		}
	}
	return found;
};

/**
 * Render the object
 */
nitobi.tree.Tree.prototype.render = function()
{
	nitobi.tree.Tree.base.render.apply(this,arguments);
	this.onRender.notify(new nitobi.base.EventArgs(this, this.onRender));
};

/**
 * Returns <CODE>true</CODE> if the sidebar is enabled, and <CODE>false</CODE> otherwise.
 * @type Boolean
 * @private
 */
nitobi.tree.Tree.prototype.getSidebarEnabled = function()
{
	return this.getBoolAttribute('sidebarenabled', false);
};

/**
 * Set to <CODE>true</CODE> to enable the sidebar.  You will need to call <CODE>render()</CODE> 
 * for the change to appear.
 * @param {Boolean} sidebarEnabled whether or not to show the sidebar
 * @private
 */
nitobi.tree.Tree.prototype.setSidebarEnabled = function(sidebarEnabled)
{
	this.setBoolAttribute('sidebarenabled', sidebarEnabled);
};

/**
 * Returns whether or not a <CODE>hover</CODE> class is added to nodes when they are hovered over.
 * @type Boolean
 */
nitobi.tree.Tree.prototype.getHoverHighlight = function()
{
	return this.getBoolAttribute('hoverhighlight', false);
};

/**
 * If the HoverHighlight attribute is set to <CODE>true</CODE> a <CODE>hover</CODE> class is added 
 * to nodes when they are hovered over.
 * @param {Boolean} hoverHighlight the new value for hoverHighlight
 */
nitobi.tree.Tree.prototype.setHoverHighlight = function(hoverHighlight)
{
	this.setBoolAttribute('hoverhighlight', hoverHighlight)
};

/**
 * Returns this tree's gethandler URL. 
 * @type String
 */
nitobi.tree.Tree.prototype.getGetHandler = function()
{
	return this.getAttribute('gethandler');
};

/**
 * Sets the URL for the tree's gethandler.  
 * @param {String} getHandler the URL for the tree's gethandler
 */
nitobi.tree.Tree.prototype.setGetHandler = function(getHandler)
{
	this.setAttribute('gethandler',getHandler);
	this.urlConnector = new nitobi.data.UrlConnector(this.getGetHandler(), nitobi.tree.Tree.translateData);
};

/**
 * Sets the tab index for the tree component.  A tab index is used to specify at what point
 * in your web page's tab order the tree will assume focus.
 * @param {Number} tabIndex the new tab index for the component
 */
nitobi.tree.Tree.prototype.setTabIndex = function(tabIndex)
{
	this.setIntAttribute('tabindex', tabIndex);
};

/**
 * Returns the tree's tab index. A tab index is used to specify at what point
 * in your web page's tab order the tree will assume focus.
 * @type Number
 */
nitobi.tree.Tree.prototype.getTabIndex = function()
{
	return this.getIntAttribute('tabindex', 1000);
}
/**
 * Load data from the gethandler.  The tree will use the url specified by {@link #setGetHandler}
 * with the tree's id added to the query string as the parameter <CODE>treeId</CODE>.  The event 
 * {@link #onDataReady} will be notified when the loaded data has been added to the tree, 
 * and before rendering.
 */
nitobi.tree.Tree.prototype.loadData = function()
{
	this.urlConnector.get({treeId: this.getId()}, nitobi.lang.close(this, this.loadDataComplete));
};
/**
 * @ignore
 */
nitobi.tree.Tree.prototype.handleScrollSizeChanged = function(eventArgs)
{
	var outerNode = this.getHtmlNode('scroller');
	var outerWidth = outerNode.clientWidth;

	var realSizeNode = this.getHtmlNode('realsize');	
	realSizeNode.style.width = "";
	var realSize = realSizeNode.offsetWidth;
	realSize = Math.max(outerWidth-1,realSize);

	realSizeNode.style.width = realSize + 'px';
	
	var scrollNode = this.getHtmlNode('scrollsize');
	scrollNode.style.width = realSize + 'px';	
};

/**
 * @ignore
 */
nitobi.tree.Tree.prototype.handleDataReady = function(eventArgs)
{
	if (this.getRootEnabled())
	{
		var childNodes = this.getXmlNode().selectNodes('ntb:children/ntb:node');
		for (var i = 0; i < childNodes.length; i++)
		{
			childNodes[i].setAttribute('rootenabled', 'true');
		} 
	}
};

/**
 * @ignore
 */
nitobi.tree.Tree.prototype.loadDataComplete = function(eventArgs)
{
	//fire onBeforeDataReady
	var result = eventArgs.result;
	var newChildren = new nitobi.tree.Children(result.documentElement);
	this.setChildren(newChildren);
	this.onDataReady.notify(new nitobi.base.EventArgs(this,this.onDataReady));
};

/**
 * Returns <code>true</code> if a special root style is applied to the root nodes.
 * @type Boolean
 */
nitobi.tree.Tree.prototype.getRootEnabled = function()
{
	return this.getBoolAttribute('rootenabled', false);
};

/**
 * Sets whether or not a special root style should be applied to the root nodes.
 * @param {Boolean} root if true, the root node(s) will have a special style applied to them
 */
nitobi.tree.Tree.prototype.setRootEnabled = function(root)
{
	this.setBoolAttribute('rootenabled', root);
};

/**
 * Translates data from the old backend format to the <CODE>children->node</CODE> format
 * used by Tree.  This is used by the tree to transform data returned from the server into the
 * XML format used by the tree (ntb:children -> ntb:node ...).  If this function is re-implemented it can serve
 * as a translator for any kind of XML data as long as it returns a document in the tree's native XML format. 
 * @param {XMLDocument} xmlDocument the old-backend formatted XML document.
 * @return the translated XMLDocument
 * @type XMLDocument 
 * @private
 */
nitobi.tree.Tree.translateData = function(xmlDocument)
{
	if (xmlDocument.documentElement.nodeName == 'root')
	{
		// Add a <fields> node that allows attribute-name lookup for the attributes. 
		
		var fieldNames = xmlDocument.documentElement.getAttribute('fields');
		fieldNames = fieldNames.split("|");
		fieldKeys = new Array();
		for (var i = 0; i < fieldNames.length; i++)
		{
			fieldKeys[i] = nitobi.lang.numToAlpha(i);
		}
		var fields = xmlDocument.createElement('fields');
		for (var i = 0; i < fieldNames.length; i++)
		{
			fields.setAttribute(fieldKeys[i],fieldNames[i]);
		}
		xmlDocument.documentElement.appendChild(fields);
		
		// Now do the transformation
		return nitobi.xml.transformToXml(xmlDocument,nitobi.tree.dataTranslator,'xml');
	}
	else
	{
		return xmlDocument;
	}
};

/**
 * Precaches images found in the tree's stylesheets.  Calling this function before loading
 * a tree component will ensure that all the tree's images are loaded before the tree is rendered.
 * @param {String} url an optional url for your own tree css file (just the filename)
 * @private
 */
nitobi.tree.Tree.precacheImages = function(url)
{
	var url = url || 'tree.css';
	var sheets = nitobi.html.Css.getStyleSheetsByName(url);
	for (var i = 0; i < sheets.length; i++)
	{
		nitobi.html.Css.precacheImages(sheets[i]);
	}
};

/**
 * The US keyboard keyMap for the tree.
 * @type Map
 */
nitobi.tree.Tree.keyMap = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};