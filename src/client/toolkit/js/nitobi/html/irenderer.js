/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.html');

/**
 * Instantiates a Renderer object with a given template.
 * @class The interface for an HTML renderer.  A renderer contains a template and can transform
 * data into a string that is written to an HTML document.  Classes implementing IRenderer must provide 
 * their own <CODE>renderToString</CODE> method.
 * @constructor 
 * @param {Object} template The template used by this renderer.
 */
nitobi.html.IRenderer = function(template)
{
	this.setTemplate(template);
	/**
	 * A key-value map of parameters to pass to the template on render.
	 * @type Map
	 */
	this.parameters = {};
};

/**
 * Render the data <I>after</I> a given HTML DOM node.  That is, the first node created by the renderer 
 * will be <CODE>element.nextSibling</CODE>.
 * @param {HTMLElement} element render after this element
 * @param {Object} data the data to render 
 * @return an array containing the <CODE>HTMLElement</CODE>s rendered
 * @type Array
 */
nitobi.html.IRenderer.prototype.renderAfter = function(element, data)
{
	element = $ntb(element);
	var _parent = element.parentNode;
	element = element.nextSibling;	
	return this._renderBefore(_parent,element,data);
};

/**
 * Render the data <I>before</I> a given HTML DOM node.  That is, the last node created by the renderer 
 * will be <CODE>element.previousSibling</CODE>.
 * @param {HTMLElement} element render before this element
 * @param {Object} data the data to render 
 * @returns an array containing the <CODE>HTMLElement</CODE>s rendered
 * @type Array
 */

nitobi.html.IRenderer.prototype.renderBefore = function(element, data)
{
	element = $ntb(element);
	return this._renderBefore(element.parentNode, element, data);
};

/**
 * Render the data <I>before</I> a given HTML DOM node.  That is, the last node created by the renderer 
 * will be <CODE>element.previousSibling</CODE>.
 * @param {HTMLElement} _parent <CODE>element</CODE> must be a child of this node
 * @param {HTMLElement} element render before this element
 * @param {Object} data the data to render 
 * @returns {Array} an array containing the <CODE>HTMLElement</CODE>s rendered
 * @type Array
 * @private
 */
nitobi.html.IRenderer.prototype._renderBefore = function(_parent, element, data)
{
	var s = this.renderToString(data);
	var tempNode = document.createElement('div');
	tempNode.innerHTML = s;

	var nodeSet = new Array();
	if (tempNode.childNodes)
	{
		var i = 0;
		while (tempNode.childNodes.length)
		{
			nodeSet[i++] = tempNode.firstChild;
			_parent.insertBefore(tempNode.firstChild,element);
		}
	}
	else
	{
		// TODO: Throw an error.
	}	
	return nodeSet;	
};

/**
 * Render the data <I>in</I> a given HTML DOM node.  The renderer will overwrite the contents of 
 * <CODE>element</CODE> with the result.
 * @param {HTMLElement} element render in this element
 * @param {Object} data the data to render 
 * @returns An array containing the <CODE>HTMLElement</CODE>s rendered
 * @type Array
 */
nitobi.html.IRenderer.prototype.renderIn = function(element, data)
{
	element = $ntb(element);
	var s = this.renderToString(data);
	element.innerHTML = s;
	return element.childNodes;
};

/**
 * Render the data to a string.  This method must exist in every class that implements <CODE>IRenderer</CODE>.
 * @param {Object} data the data to render
 * @returns The data transformed by the renderer's template
 * @type String
 */
nitobi.html.IRenderer.prototype.renderToString = function(data)
{
	
};

/**
 * Sets the renderer's template.
 * @param {Object} template
 */
nitobi.html.IRenderer.prototype.setTemplate = function(template)
{
	this.template = template;
};

/**
 * Returns the renderer's template. 
 * @type Object
 */
nitobi.html.IRenderer.prototype.getTemplate = function()
{
	return this.template;
};

/**
 * Set parameters for the template.
 * @param {Map} parameters the parameters to set on the template.
 */
nitobi.html.IRenderer.prototype.setParameters = function(parameters)
{
	for (var p in parameters)
	{
		this.parameters[p] = parameters[p];
	}
};

/**
 * Returns the <CODE>Map</CODE> of parameters that are applied to the template when rendering.
 * @type Map
 */ 
nitobi.html.IRenderer.prototype.getParameters = function()
{
	return this.parameters;
};