/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.tree");

/**
 * Creates a tree Node.
 * @class A tree node to be used with a {@link nitobi.tree.Tree} object.  Tree nodes can be accessed
 * through their parent {@link nitobi.tree.Children} object.  In this example we set the variable
 * <code>myNode</code> to the second child of the first node in a tree:
 * <pre class="code">
 * var tree = $('myTreeId').jsObject;
 * var firstNode = tree.getChildren().get(0);
 * var myNode = firstNode.getChildren().get(1);
 * </pre>
 * @constructor
 * @param {String} [id] The id of the control. If you do not specify an id, one is created for you.
 * @extends nitobi.ui.Element
 * @see nitobi.tree.Tree 
 * @see nitobi.tree.Children
 */
nitobi.tree.Node = function(element, onLoadCallback)
{
	nitobi.tree.Node.baseConstructor.apply(this, arguments);
	nitobi.base.ISerializable.call(this,{className:"nitobi.tree.Node"});
	this.subscribeToChildrenEvents();
	this.renderer.setTemplate(nitobi.tree.xslTemplate);
	this.renderer.setParameters(
		{
			'apply-id': this.getId()
		}
	);
	
	/**
	 * @ignore
	 */
	this.onLoadCallback = onLoadCallback || null;
	//API Events
	/**
	 * Fires when this node's <CODE>children</CODE> object is set.
	 * The node is passed as an argument to each subscribed function.
	 * @type nitobi.base.Event 
	 */
	this.onSetChildren = new nitobi.base.Event();
	this.onSetChildren.subscribe(this.subscribeToChildrenEvents, this);

	/**
	 * Fires when the node is selected.
	 * The node is passed as an argument to each subscribed function.
	 * @type nitobi.base.Event
	 */
	this.onSelect = new nitobi.base.Event();
	this.eventMap["select"] = this.onSelect;

	/**
	 * Fires when the node is deselected.
	 * The node is passed as an argument to each subscribed function.
	 * @type nitobi.base.Event
	 */
	this.onDeselect = new nitobi.base.Event();
	this.eventMap["deselect"] = this.onDeselect;
	
	/**
	 * Fires when a node is clicked on.  The clickable area includes the icon and the label of the node.
	 * @type nitobi.base.Event
	 */
	this.onClick = new nitobi.base.Event();
	this.eventMap["mousedown"] = this.onClick;
	this.eventMap["click"] = this.onClick;
	
	this.subscribeDeclarationEvents();
		
	// Set up the UrlConnector in an unintuitive way:
	var gethandler = this.getGetHandler();
	if (gethandler)
	{
		this.setGetHandler(gethandler);
	}
};

nitobi.lang.extend(nitobi.tree.Node, nitobi.ui.Element);

nitobi.base.Registry.getInstance().register(
	new nitobi.base.Profile("nitobi.tree.Node",null,false,"ntb:node")
);

/**
 * Subscribes to the events that need to be subscribed to when the children are changed.
 * @private
 */
nitobi.tree.Node.prototype.subscribeToChildrenEvents = function()
{
	var c = this.getChildren();
	if (c) 
	{
		c.onBeforeSetVisible.subscribe(this.handleChildrenBeforeVisibility, this);
		c.onSetVisible.subscribe(this.handleChildrenVisibility, this);
	}	
};

/**
 * @ignore
 */
nitobi.tree.Node.prototype.handleChildrenBeforeVisibility = function(eventArgs)
{
	var expander = this.getHtmlNode('expander');	
	if (eventArgs.args[0])
	{
		nitobi.html.Css.swapClass(expander, 'collapsed', 'expanded');
		nitobi.html.Css.swapClass(expander, 'working', 'expanded');
		this.setBoolAttribute('expanded',true);
	}
	else
	{
		nitobi.html.Css.swapClass(expander, 'expanded', 'collapsed');
		nitobi.html.Css.swapClass(expander, 'working', 'collapsed');		
		this.setBoolAttribute('expanded',false);
	}
};

/**
 * @ignore
 */
nitobi.tree.Node.prototype.handleChildrenVisibility = function(eventArgs) {
	var tree = this.getTree();
	tree.onNodeToggled.notify(new nitobi.ui.ElementEventArgs(tree, tree.onNodeToggled, this.getId()));
};

/**
 * Toggles the visibility of this nodes child nodes.
 * @param {Class} [effect] The effect to use when toggling.  The default value is defined in
 * {@link nitobi.tree.Tree}
 */
nitobi.tree.Node.prototype.toggleChildren = function(effect)
{
	if (!this.isLeaf())
	{
		var c = this.getChildren();
		if (c == null)
		{
			var el = this.getHtmlNode('expander');
			if (el)
			{
				nitobi.html.Css.swapClass(el,'collapsed', 'working');
			}
			this.loadData();
		}
		else
		{
			var tree = this.getTree(); 
			var visible = !c.isVisible();
			effect = typeof(effect) == 'undefined' ? (visible ? tree.showEffect : tree.hideEffect) : effect;
			c.setVisible(!c.isVisible(), effect, nitobi.lang.close(this, this.handleToggle));
		}
	}
};

nitobi.tree.Node.prototype.handleToggle = function()
{
};

/**
 * Load data from the gethandler.  The tree's gethandler will be used, and all attributes of this
 * node will be sent as parameters on the URL.
 * @param {Map} params a Map of parameters to add to the URL for this request   
 */
nitobi.tree.Node.prototype.loadData = function(params)
{
	params = params || {};

	var attributes = this.getXmlNode().attributes;
	
	for (var i = 0; i < attributes.length; i++)
	{
		var key = attributes[i].nodeName;
		var value = attributes[i].nodeValue;
		if (!params[key] && key != 'xmlns:ntb')
		{
			params[key] = value;
		}
	}
	params['treeId'] = this.getTree().getId();
	var tree = this.getDataboundAncestor();
	tree.urlConnector.get(params, nitobi.lang.close(this, this.handleDataReady));	
};

/**
 * @ignore
 */
nitobi.tree.Node.prototype.handleDataReady = function(eventArgs)
{
	//fire onBeforeDataReady
	var result = eventArgs.result;
	var newChildren = new nitobi.tree.Children(result.documentElement);
	var oldChildren = this.getChildren();
	if (!oldChildren || !oldChildren.isVisible() || !oldChildren.getLength())
	{ 
		this.setBoolAttribute('expanded',false);
	}
	else
	{
		this.setBoolAttribute('expanded',true);
	}
	this.setChildren(newChildren);
	var hasChildren = this.getChildren().getLength() != 0;
	if (!hasChildren)
	{
		this.setBoolAttribute('haschildren',false);
	}
	this.render();
	if (hasChildren && !this.getBoolAttribute('expanded'))
	{
		newChildren.setVisible(true, this.getTree().showEffect, nitobi.lang.close(this, this.handleToggle));	
	}
	//fire onDataReady
};

/**
 * Returns the <CODE>children</CODE> collection for this node.
 * @type nitobi.tree.Children
 */
nitobi.tree.Node.prototype.getChildren = function()
{
	return this.getObject(nitobi.tree.Children.profile);
};

/**
 * Sets the children <CODE>children</CODE> collection for this node.
 * @param {nitobi.tree.Children} children the new children for this node
 */
nitobi.tree.Node.prototype.setChildren = function(children)
{
	this.setObject(children);
	this.onSetChildren.notify(this);
};

/**
 * Show all of this node's descendents.  This will expand every node that is a 
 * descendent of this node.
 * @param {nitobi.effects.Effect} effect an optional effect to use
 */
nitobi.tree.Node.prototype.showDescendents = function(effect)
{
	var children = this.getChildren();
	if (children)
	{
		for (var i = 0; i < children.getLength(); i++)
		{
			children.get(i).showDescendents(null);
		}
		children.show(effect);
	}
};

/**
 * Returns the parent Node for this object.  A root node will return null.
 * @type nitobi.tree.Node
 */
nitobi.tree.Node.prototype.getParent = function()
{
	var parentChildren = this.getParentObject();
	if (parentChildren)
	{
		var p = parentChildren.getParentObject();
		if (p)
		{
			if (p instanceof nitobi.tree.Node)
			{
				return p;
			}
		}
	}
	return null;
};

/**
 * Makes visible each of this node's ancestor nodes.
 * @param {nitobi.effects.Effect} effect an animation effect to use when opening the topmost ancestor.
 */
nitobi.tree.Node.prototype.showAncestors = function(effect)
{
	var container = this.getParentObject();
	var toShow = new Array();
	
	while (container)
	{
		if (!container.isVisible()) 
		{
			toShow.push(container);
		}
		container = container.getParentObject(); // container is now a Node or a Tree
		if (container)
		{
			container = container.getParentObject(); 
			// if container was a Node it is now that Node's Parent's Children object.
		}
	}

	if (toShow.length)
	{
		for (var i = 0; i < toShow.length-1; i++)
		{
			toShow[i].show(null);
		}
		toShow[toShow.length-1].show(effect);
	}
};

/**
 * Returns the closest ancestor of this node with a gethandler specified.
 * @type nitobi.tree.Node|nitobi.tree.Tree
 */
nitobi.tree.Node.prototype.getDataboundAncestor = function()
{
	var gethandler = this.getAttribute('gethandler');
	var p = this;
	var retVal = p;
	while (!gethandler && (p = p.getParentObject()))
	{
		gethandler = p.getAttribute('gethandler');
		retVal = p;	
	}
	return retVal.getAttribute('gethandler') ? retVal : null;
};

/**
 * Returns this node's gethandler URL. 
 * @type String
 */
nitobi.tree.Node.prototype.getGetHandler = function()
{
	return this.getAttribute('gethandler');
};

/**
 * Sets the URL for the tree's gethandler.
 * @param {String} getHandler the URL for the tree's gethandler
 */
nitobi.tree.Node.prototype.setGetHandler = function(getHandler)
{
	this.setAttribute('gethandler',getHandler);
	this.urlConnector = new nitobi.data.UrlConnector(this.getGetHandler(), nitobi.tree.Tree.translateData);
};

/**
 * Returns the label for this node.
 * @type String
 */
nitobi.tree.Node.prototype.getLabel = function()
{
	return this.getAttribute('label');
};

/**
 * Sets the label for this node.  The change will take place immediately on a rendered tree.
 * @param {String} label the new label for this node
 */
nitobi.tree.Node.prototype.setLabel = function(label)
{
	this.setAttribute('label', label);
	var node = this.getHtmlNode('label');
	if (node) node.innerHTML = label;
};

/**
 * Returns the URL for this node.  This can be used for frame targeting.
 * @see nitobi.tree.Tree#setTargetFrame 
 * @type String
 */
nitobi.tree.Node.prototype.getUrl = function()
{
	return this.getAttribute('url');
};

/**
 * Sets the URL for this node.  This can be used for frame targeting.
 * @see nitobi.tree.Tree#setTargetFrame 
 * @param {String} label the new label for this node
 */
nitobi.tree.Node.prototype.setUrl = function(url)
{
	this.setAttribute('url', url);
};


/**
 * Returns the current flag for this node.
 * @type String
 * @private
 */
nitobi.tree.Node.prototype.getFlag = function()
{
	return this.getAttribute('flag');
};

/**
 * Sets a flag for this node. The change will take place immediately on a rendered tree.
 * @param {String} flag the new flag for this node
 * @private
 */
nitobi.tree.Node.prototype.setFlag = function(flag)
{
	var oldFlag = this.getFlag();
	this.setAttribute('flag',flag);
	var el = this.getHtmlNode('flag');
	if (el)
	{
		nitobi.html.Css.replaceOrAppend(el,oldFlag,flag);
	}
};

/**
 * Render the current state of the node and delete any previously rendered version.
 */
nitobi.tree.Node.prototype.render = function()
{
	var oldNode = this.getHtmlNode();
	var parentNode = this.getParent();
	if (parentNode)
	{
		var hierarchy = parentNode.getHtmlNode('hierarchy');
//		if (nitobi.browser.IE)
//		{
			var doc = nitobi.xml.parseHtml(hierarchy);
			hierarchy = doc.documentElement;
			var lastOne = doc.createElement('div');
			parentNode.getHtmlNode('junction').className === 'tee' ? lastOne.setAttribute('class','pipe') : lastOne.setAttribute('class','spacer');
			hierarchy.appendChild(lastOne);
//		}
		
		this.renderer.setParameters(
			{
				'hierarchy': hierarchy  
			}
		);
	}
	
	if (oldNode)
	{
		this.flushHtmlNodeCache();
		oldNode.style.display = 'none';
		this.htmlNode = this.renderer.renderBefore(oldNode, this.getState().ownerDocument.documentElement)[0];
		oldNode.parentNode.removeChild(oldNode);
	}
	else
	{
		var beforeNode = null;
		var p = this.getParentObject();
		var i = p.indexOf(this);
		var l = p.getLength();
		if (i == l - 1 && i > 0)
		{
			p.get(i-1).render();
		} 
		if (++i < l)
		{
			while ((i < l) && !(beforeNode = p.get(i++).getHtmlNode())){/* find the closest rendered sibling */}			
		}
		// parent_doc = this.getState().ownerDocument.documentElement;
		parent_doc = this.parentNode.ownerDocument.documentElement;
		this.htmlNode = this.renderer._renderBefore(p.getHtmlNode('container'), beforeNode, parent_doc)[0];
	}
	var tabIndex = this.getIntAttribute('tabindex', -1);
	if (tabIndex > -1)
	{
		this.getHtmlNode('selector').focus();
	}
};


/**
 * Returns the URL of the custom icon for this node.
 * @type String
 */
nitobi.tree.Node.prototype.getIcon = function()
{
	return this.getAttribute('icon');
};
 
/**
 * Sets a custom icon for this node.  It will over-write the icon found in the CSS.
 * @param {String} icon the URL for this icon
 */
nitobi.tree.Node.prototype.setIcon = function(icon)
{
	
	this.setAttribute('icon',icon);
	var iconNode = this.getHtmlNode('icon');
	if (iconNode)
	{
		if (icon && icon != '')
		{
			icon = 'url('+icon+')';			
		}
		iconNode.style.backgroundImage = icon;
	}
};

/**
 * Returns the custom CSS class set on this node.
 * @type String
 */
nitobi.tree.Node.prototype.getCssClass = function()
{
	return this.getAttribute("cssclass");
};

/**
 * Sets a custom CSS class for this node.
 * @param {String} type this node's type
 */
nitobi.tree.Node.prototype.setCssClass = function(cssClass)
{
	var oldClass = this.getCssClass();
	this.setAttribute("cssclass",cssClass);
	var el = this.getHtmlNode('css');
	if (el)
	{
		nitobi.html.Css.replaceOrAppend(el,oldClass,cssClass);
	}
};

/**
 * Select this node.
 * @param {Number} [tabIndex] the tabIndex to set for this node.
 */
nitobi.tree.Node.prototype.select = function(tabIndex)
{
	this.setBoolAttribute('selected',true);
	var selectorNode = this.getHtmlNode('selector');
	if (selectorNode) 
	{
		nitobi.html.Css.addClass(selectorNode,'selected');
		if (typeof(tabIndex) != 'undefined')
		{
			this.setIntAttribute('tabindex',tabIndex);
			selectorNode.tabIndex = tabIndex;
			selectorNode.focus();
		}
	}
	this.onSelect.notify(this);	
};

/**
 * Deselect this node.
 */
nitobi.tree.Node.prototype.deselect = function()
{
	this.setBoolAttribute('selected',false);
	var selectorNode = this.getHtmlNode('selector');
	if (selectorNode) 
	{
		nitobi.html.Css.removeClass(selectorNode,'selected');
		selectorNode.tabIndex = -1;
	}
	this.setIntAttribute('tabindex',-1);
	this.onDeselect.notify(this);	
};

/**
 * Returns the furthest visible descendant for whom all ancestors are visible.
 * @type nitobi.tree.Node
 * @private
 */
nitobi.tree.Node.prototype.getFurthestVisibleDescendent = function()
{
	var c = this.getChildren();
	var length = c ? c.getLength() : 0;
	if (c && c.isVisible() && length)
	{
		return c.get(length-1).getFurthestVisibleDescendent();
	}
	else
	{
		return this;
	}
};

/**
 * Returns <code>true</code> if the node is a leaf node.
 */
nitobi.tree.Node.prototype.isLeaf = function()
{
	var test;
	if (test = this.getAttribute('nodetype'))
	{
		return (test == 'leaf');
	}
	else if (test = this.getAttribute('haschildren'))
	{
		return (test == 'false');
	}
	else 
	{
		return this.getChildren() ? false : true;
	}
};

/**
 * Returns the tree to which this node belongs.
 * @type nitobi.tree.Tree
 */
nitobi.tree.Node.prototype.getTree = function()
{
	if (this.tree) return this.tree;
	var p = this;
	var r = null;
	while (r = p.getParentObject())
	{
		p = r;
	}
	this.tree = p;
	return p;
};