/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ui");

/**
 * Initializes the IStyleable interface.
 * @class Allows for easy manipulation of styles on an HTML node.
 * @constructor
 * @param {HTMLElement} htmlNode The HTML element that will have styles applied to it.
 */
nitobi.ui.IStyleable = function(htmlNode) 
{
	/** 
	 * @private 
	 */
	this.htmlNode = htmlNode || null;
	/**
	 * Fires before a style is updated and passes the style name and value.
	 * @type nitobi.base.Event 
	 */
	this.onBeforeSetStyle = new nitobi.base.Event();
//	this.eventMap['beforesetstyle'] = this.onBeforeSetStyle;
	
	/**
	 * Fires when the style is updated and passes the style name and value to the handler.
	 * @see nitobi.ui.StyleEventArgs
	 */
	this.onSetStyle = new nitobi.base.Event();
//	this.eventMap['setstyle'] = this.onSetStyle;
}

/**
 * Returns the HTML node that this interface manipluates.
 */
nitobi.ui.IStyleable.prototype.getHtmlNode = function()
{
	return this.htmlNode;
}

/**
 * Sets the HTML node that this interface manipluates.
 * @param {HTMLElement} node The element to which styles will be applied.
 */
nitobi.ui.IStyleable.prototype.setHtmlNode = function(node)
{
	this.htmlNode = node;
}

/**
 * Sets a style on the element.  
 * @param {String} name The name of the style. This can be either all lowercase using dashes, or camel-case
 * e.g., either background-color or backgroundColor.
 * @param {String} value The value to which you want the style set.
 */
nitobi.ui.IStyleable.prototype.setStyle = function(name, value)
{
	if (this.onBeforeSetStyle.notify(new nitobi.ui.StyleEventArgs(this,this.onBeforeSetStyle,name,value)) && this.getHtmlNode() != null)
	{
		nitobi.html.Css.setStyle(this.getHtmlNode(), name, value);
		this.onSetStyle.notify(new nitobi.ui.StyleEventArgs(this,this.onSetStyle,name,value));
	}
}

/**
 * Gets the computer style of the element with the specified name.
 * @param {String} name The name of the style whose value you want.
 * @type String
 */
nitobi.ui.IStyleable.prototype.getStyle = function(name)
{
	return nitobi.html.Css.getStyle(this.getHtmlNode(), name);
}