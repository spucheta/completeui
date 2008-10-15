/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// For x-component stuff
nitobi.lang.defineNs("nitobi.component");

if (false)
{
	/**
	 * @namespace The namespace for component helper functions.
	 * @constructor
	 */
	nitobi.component = function(){};
}

/**
 * Loads and renders a component from a declaration. It returns the javascript object.
 * @param {HTMLElement/String} el Either the id of the declaration or the HTMLElement itself.
 * @type Object
 */
nitobi.loadComponent = function(el)
{
	var id = el;
	el = $(el);
	if (el == null)
	{
		nitobi.lang.throwError("nitobi.loadComponent could not load the component because it could not be found on the page. The component may not have a declaration, node, or it may have a duplicated id. Id: " + id);
	}
	if (el.jsObject != null) {
		return el.jsObject;
	}
	var component;
	var tagName = nitobi.html.getTagName(el);
	
	// If the component is grid or combo then use their special init procedures.
	if (tagName == "ntb:grid") 
	{
		component = nitobi.initGrid(el.id);
	} 
	else if (tagName === "ntb:combo")
	{
		component = nitobi.initCombo(el.id);
	}
	else if (tagName == "ntb:treegrid")
	{
		component = nitobi.initTreeGrid(el.id);
	}
	else 
	{
		// The component is a new-style component that doesn't require any special init process.
		if (el.jsObject == null)
		{
			component = nitobi.base.Factory.getInstance().createByTag(tagName,el.id,nitobi.component.renderComponent);
			if (component.render && !component.onLoadCallback)
			{
				component.render();
			}
		}
		else
		{
			component=el.jsObject;	
		}
	}			
	return component;
}

/**
 * @private
 */
nitobi.component.renderComponent = function(eventArgs)
{
	eventArgs.source.render();
}

/**
 * Returns the javascript object for a component with a particular id. The 
 * component must have been already rendered.
 * @param {String} id The id of the component.
 * @type Object
 */
nitobi.getComponent = function(id)
{
	var el = $(id);
	if (el == null) return null;
	return el.jsObject;
}

/**
 * @private
 */
nitobi.component.uniqueId = 0;

/**
 * Returns an id that is unique to other Nitobi components on the page.
 * @type String
 */
nitobi.component.getUniqueId = function()
{
	return "ntbcmp_" + (nitobi.component.uniqueId++);
}

/**
 * Finds all the child nodes of the supplied node that are Nitobi components
 * @param {HTMLNode} rootNode The node to start the search on
 * @param {Array} foundNodes An array to store the nodes
 * @private
 */
nitobi.getComponents = function(rootNode, foundNodes)
{
	if (foundNodes == null)
		foundNodes = [];

	if (nitobi.component.isNitobiElement(rootNode)) {
		foundNodes.push(rootNode);
		return;
	}
	
	var nodes = rootNode.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		nitobi.getComponents(nodes[i], foundNodes);
	}
	
	return foundNodes;
}

/**
 * @private
 */
nitobi.component.isNitobiElement = function(rootNode)
{
	var rootNodeName = nitobi.html.getTagName(rootNode);
	if (rootNodeName.substr(0, 3) == "ntb") {
		return true;
	} else {
		return false;
	}
}

/**
 * @private
 */
nitobi.component.loadComponentsFromNode = function(rootNode)
{
	var ntbElements = new Array();
	nitobi.getComponents(rootNode, ntbElements);
	for (var i = 0; i < ntbElements.length; i++) {
		nitobi.loadComponent(ntbElements[i].getAttribute('id'));
	}
}