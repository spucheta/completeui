/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * A abstract class the represents a UI element on the screen.
 * @param xml {string} XML that defines the element.
 * @param xsl {string} XSL that enables rendering of the object.
 * @param id {string} The id of the object.
 * @private
 */
nitobi.ui.UiElement = function (xml,xsl,id)
{
	if (arguments.length > 0)
	{
		this.initialize(xml,xsl,id);	
	}
}

/**
 * Initializes the object.
 * @private
 */
nitobi.ui.UiElement.prototype.initialize = function (xml,xsl,id)
{
	this.m_Xml = xml;
	this.m_Xsl = xsl;
	this.m_Id = id;
	this.m_HtmlElementHandle=null;
}

/**
 * The height of the element.
 * @return {string} The height of the object including the type of unit used, e.g., 10px.
 */
nitobi.ui.UiElement.prototype.getHeight = function ()
{
	return this.getHtmlElementHandle().style.height;
}

/**
 * Sets the height of the element.
 * @param height {string} The height of the element including its units, e.g., 10px.
 */
nitobi.ui.UiElement.prototype.setHeight = function (height)
{
	this.getHtmlElementHandle().style.height = height + "px";
}


/**
 * The Id of the element.
 * @return {string} The id of the element. 
 */
nitobi.ui.UiElement.prototype.getId = function ()
{
	return this.m_Id;
}

/**
 * The Id of the element.
 * @param id {string} The Id. It must be unique on the page.
 */
nitobi.ui.UiElement.prototype.setId = function (id)
{
	this.m_Id = id;
}


/**
 * The width of the element.
 * @return {string} The width of the element including its units, e.g., 10px.  
 */
nitobi.ui.UiElement.prototype.getWidth = function ()
{
	return this.getHtmlElementHandle().style.width;
}


/**
 * The width of the element.
 * @param width {string} The width of the element including its units, e.g., 10px.
 */
nitobi.ui.UiElement.prototype.setWidth = function (width)
{
	if(width > 0)
		this.getHtmlElementHandle().style.width = width + "px";
}


/**
 * The XML that defines the element.  The XML is used together with the XSL to render.
 * @return {string} The XML.
 */
nitobi.ui.UiElement.prototype.getXml = function ()
{
	return this.m_Xml;
}

/**
 * The XML that defines the element. The XML is used together with the XSL to render.
 * @param xml {string} XML.
 */
nitobi.ui.UiElement.prototype.setXml = function (xml)
{
	this.m_Xml = xml;
}

/**
 * The XSL that defines the element.  The XSL is used together with the XML to render.
 * @return {string} The XSL.
 */
nitobi.ui.UiElement.prototype.getXsl = function ()
{
	return this.m_Xsl;
}

/**
 * The XSL that defines the element. The XSL is used together with the XML to render.
 * @param xsl {string} XSL.
 */
nitobi.ui.UiElement.prototype.setXsl = function (xsl)
{
	this.m_Xsl = xsl;
}

/**
 * A handle to the html element that represents this UI object.
 * @return {object} An HTML element reference.
 */
nitobi.ui.UiElement.prototype.getHtmlElementHandle = function ()
{
	if (!this.m_HtmlElementHandle)
	{
		this.m_HtmlElementHandle = document.getElementById(this.m_Id);
	}
	return this.m_HtmlElementHandle;
}


/**
 * @private
 */
nitobi.ui.UiElement.prototype.setHtmlElementHandle = function (htmlElementHandle)
{
	this.m_HtmlElementHandle = htmlElementHandle;
}


/**
 * Hides the element.
 */
nitobi.ui.UiElement.prototype.hide = function ()
{
	var tag = this.getHtmlElementHandle();
	tag.style.visibility="hidden";
	tag.style.position="absolute";
}

/**
 * Shows the element.
 */
nitobi.ui.UiElement.prototype.show = function ()
{
	var tag = this.getHtmlElementHandle();
	tag.style.visibility="visible";
}


/**
 * Returns true if the element is visible and false otherwise.
 */
nitobi.ui.UiElement.prototype.isVisible = function ()
{
	var tag = this.getHtmlElementHandle();
	return tag.style.visibility=="visible";
}


/**
 * Makes the element float in absolute position mode.
 */
nitobi.ui.UiElement.prototype.beginFloatMode = function ()
{
	var tag = this.getHtmlElementHandle();
	tag.style.position="absolute";
}

/**
 * Returns true if the element is floating or not.
 */
nitobi.ui.UiElement.prototype.isFloating = function ()
{
	var tag = this.getHtmlElementHandle();
	return	tag.style.position=="absolute";
}

/**
 * If the element is floating, sets the x position.
 * @param x {string} The x position including its units.
 */
nitobi.ui.UiElement.prototype.setX = function (x)
{
	var tag = this.getHtmlElementHandle();
	tag.style.left=x + "px";
}


/**
 * If the element is floating, gets the x position.
 * @return {string} The x position including its units.
 */
nitobi.ui.UiElement.prototype.getX = function ()
{
	var tag = this.getHtmlElementHandle();
	return tag.style.left;
}

/**
 * If the element is floating, sets the y position.
 * @param y {string} The y position including its units.
 */
nitobi.ui.UiElement.prototype.setY = function (y)
{
	var tag = this.getHtmlElementHandle();
	tag.style.top=y + "px";
}

/**
 * If the element is floating, gets the y position.
 * @return {string} The y position including its units.
 */
nitobi.ui.UiElement.prototype.getY = function ()
{
	var tag = this.getHtmlElementHandle();
	return tag.style.top;
}

/**
 * Renders the Element using the XSL, XML and possibly the htmlElement.
 * @param htmlElement {object} A handle to the HTML element on the page inside
 * which the UiElement is rendered. If htmlElement is null, the UiElement is appended
 * to the end of the body.
 * @param xslDoc {object} The XSL Document that is used to render. If this is null, then the XSL
 * string defined in the object elsewhere is used. 
 * @param xmlDoc {object} The XML Document that is used to render. If this is null, then the XML
 * string defined in the object elsewhere is used. 
 * @see nitobi.ui.UiElement#setXsl 
 * @see nitobi.ui.UiElement#setXml
 */
nitobi.ui.UiElement.prototype.render = function (htmlElement,xslDoc,xmlDoc)
{
	var xsl = this.m_Xsl;
	if (xsl != null && xsl.indexOf("xsl:stylesheet") == -1)
	{
		xsl = "<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:output method=\"html\" version=\"4.0\" />" + xsl
		+ "</xsl:stylesheet>";
	}
	
	if (null==xslDoc)
	{
		xslDoc = nitobi.xml.createXslDoc(xsl);
	}

	if (null==xmlDoc)
	{
		xmlDoc = nitobi.xml.createXmlDoc(this.m_Xml);
	}
	Eba.Error.assert(nitobi.xml.isValidXml(xmlDoc),"Tried to render invalid XML according to Mozilla. The XML is " + xmlDoc.xml);
	var html = nitobi.xml.transform(xmlDoc, xslDoc);
	if (html.xml) html = html.xml;

	if (null == htmlElement)
	{
		nitobi.html.insertAdjacentHTML(document.body,"beforeEnd",html);
	}
	else
	{
		htmlElement.innerHTML = html;
	}
	
	this.attachToTag();
}


/**
 * Attaches the javascript object to the HTML tag. Once this is called after render,
 * you can access the object by using the javascriptObject property on the HTML tag.
 */
nitobi.ui.UiElement.prototype.attachToTag = function ()
{

	var domNode = this.getHtmlElementHandle()
	if (domNode != null)
	{
		// Here for legacy, but we should not use this name.
		domNode.object=this;
		domNode.jsobject=this;
		
		// Use this instead.
		domNode.javascriptObject=this;
	}
};

// *****************************************************************************
// * Dispose
// *****************************************************************************
/// <function name="Dispose" access="public">
/// <summary></summary>
/// </function>
nitobi.ui.UiElement.prototype.dispose = function ()
{
	var domNode = this.getHtmlElementHandle()
	if (domNode != null)
	{
		domNode.object=null;
	}

	this.m_Xml = null;
	this.m_Xsl = null;
	this.m_HtmlElementHandle = null;
};