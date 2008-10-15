/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.html');

/**
 * Creates an XslRenderer with an optional template.
 * @class XslRenderer
 * Renders before, after, or to the contents of a given dom node.  The renderer maintains an 
 * XSLProcessor for a template and is provided with an XMLDocument when rendering.
 * @constructor 
 * @param {XSLProcessor|XMLDocument|String} template an XSL Processor to use as the template 
 */
nitobi.html.XslRenderer = function(template)
{
	nitobi.html.IRenderer.call(this, template);
};

nitobi.lang.implement(nitobi.html.XslRenderer, nitobi.html.IRenderer);


/**
 * Sets the renderer's template.
 * @param {XSLProcessor|XMLDocument|String} template an XSL Processor to use as the template 
 */
nitobi.html.XslRenderer.prototype.setTemplate = function(template)
{
	if (typeof(template) === 'string')
	{
		template = nitobi.xml.createXslProcessor(template);
	}
	this.template = template;
};

/**
 * Transform the given data with the template.
 * @param {XMLDocument|String} data the data to transform.
 * @return The result of the transformation as a string.
 * @type String
 */
nitobi.html.XslRenderer.prototype.renderToString = function(data)
{
	if (typeof(data) === 'string')
	{
		data = nitobi.xml.createXmlDoc(data);
	}
	if (nitobi.lang.typeOf(data) === nitobi.lang.type.XMLNODE)
	{
		data = nitobi.xml.createXmlDoc(nitobi.xml.serialize(data));
	}
	var template = this.getTemplate();
	var params = this.getParameters();
	for (var p in params)
	{
		template.addParameter(p, params[p], '');
	}
	var s = nitobi.xml.transformToString(data,template,'xml');
	for (var p in params)
	{
		template.addParameter(p, '', '');
	}
	return s;
		
};

