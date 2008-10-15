/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.tree");

/**
 * Creates a collection of tree nodes that can be used as the <CODE>children</CODE> object for
 * a {@link nitobi.tree.Tree} or a {@link nitobi.tree.Node}.
 * @class A collection of tree nodes to be used with a {@link nitobi.tree.Tree} object.
 * @constructor
 * @param {String} [id] The id of the control. If you do not specify an id, one is created for you.
 * @extends nitobi.ui.Container
 * @see nitobi.tree.Tree 
 * @see nitobi.tree.Node
 */
nitobi.tree.Children = function() 
{
	nitobi.tree.Children.baseConstructor.apply(this, arguments);
	this.renderer.setTemplate(nitobi.tree.xslTemplate);
	this.renderer.setParameters(
		{
			'apply-id': this.getId()
		}
	);
}

nitobi.lang.extend(nitobi.tree.Children, nitobi.ui.Container);

/**
 * @private
 * @type nitobi.base.Profile
 */
nitobi.tree.Children.profile = new nitobi.base.Profile("nitobi.tree.Children",null,false,"ntb:children");
nitobi.base.Registry.getInstance().register(nitobi.tree.Children.profile);

/**
 * Render the current state of the children and delete any previously rendered versions.
 */
nitobi.tree.Children.prototype.render = function()
{
	var parentObj = this.getParentObject();
	
	var oldNode;
	if (!(oldNode = this.getHtmlNode()))
	{
		var parentNode = parentObj.getHtmlNode();
		if (parentNode)
		{
			var nodes = parentNode.childNodes;
			for (var i=0; i < nodes.length; i++)
			{
				if (nitobi.html.Css.hasClass(nodes[i],'children'))
				{
					oldNode = nodes[i];
					break;
				}
			}
		}
	}
	if (parentObj)
	{
		var hierarchy = parentObj.getHtmlNode('hierarchy');
		if (hierarchy)
		{
			if (nitobi.browser.IE)
			{
				var doc = nitobi.xml.parseHtml(hierarchy);
				hierarchy = doc.documentElement; 
			}
			
			this.renderer.setParameters(
				{
					'hierarchy': hierarchy  
				}
			);
		}
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
		this.htmlNode = this.renderer._renderBefore(this.getParentObject().getHtmlNode(), null, this.getState().ownerDocument.documentElement)[0];		
	}
};

/**
 * Adds a node to the list of children.
 * @param {nitobi.tree.Node} node the node to add
 * @param {Boolean} render whether or not we will render the node once it is added (defaults to <CODE>true</CODE>)
 */
nitobi.tree.Children.prototype.add = function(node, render)
{
	nitobi.tree.Children.base.add.call(this,node);
	node.parentNode = this.getXmlNode();
	if (render !== false)
	{
		if (this.getLength() == 1)
		{
			this.getParentObject().render();
		}
		else
		{
			node.render();
		}
	}
};

/**
 * Remove a node from the list of children.
 * @param {nitobi.tree.Node|Number} node the node to remove
 * @param {Boolean} render whether or not to remove the node's HTML representation as well (defaults to <CODE>true</CODE>)
 */
nitobi.tree.Children.prototype.remove = function(node, render)
{
	var obj = node;
	if (typeof(obj) == "number")
	{
		obj = this.get(node);
	}
	else
	{
		node = this.indexOf(obj);
	}
	var parentNode = obj.getParent();
	var domNode = obj.getHtmlNode();

	nitobi.tree.Children.base.remove.call(this,node);
	
	if (render !== false)
	{
		if (node == this.getLength())
		{
			if (node == 0)
			{
				if (parentNode)
				{
					parentNode.render();
				}
				else
				{
					this.getParentObject().render();
				}
				return;			
			}
			else
			{
				var lastNode = this.get(this.getLength()-1);
				nitobi.html.Css.swapClass(lastNode.getHtmlNode('junction'),'tee','ell');
			}
		}
		if (domNode)
		{
			domNode.parentNode.removeChild(domNode);
		}
	}
};

/**
 * Insert a node at a specific index.
 * @param {Number} index the index for the new node
 * @param {nitobi.tree.Node} node the node to add
 * @param {Boolean} render whether or not we will render the node once it is added (defaults to <CODE>true</CODE>)
 */
nitobi.tree.Children.prototype.insert = function(index, node, render)
{
	nitobi.tree.Children.base.insert.call(this,index,node);
	node.parentNode = this.getXmlNode();
	if (render !== false)
	{
		node.render();
	}
};
/**
 * @ignore
 */
nitobi.tree.Children.prototype.notify = function(event, id)
{
//	event = nitobi.tree.Tree.base.notify.call(this,event, id);
//		
//	var idProperties = nitobi.ui.Element.parseId(id);
//	var propagate = !(idProperties.id == this.getId());	
//	if (propagate)
//	{
//		// It would be cool if this was just notify children, but 
//		// finding the correct path down the event tree may require
//		// custom logic.
//		var xmlNode = this.getXmlNode();
//		var c = this.getChildren();
//		
//		if (c)
//		{
//			c.notify(event,id);
//		}
//	}
//
//	var objEvent = this.eventMap[event.type];
//	if (objEvent != null)
//	{
//		objEvent.notify();
//	}
};