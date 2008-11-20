/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

 /**
 * Creates a Declaration object.
 * @class This class is used to retrieve and set the defaults from a Nitobi component declaration.
 * @ignore
 * @constructor
 * @extends	nitobi.Object
 */
nitobi.base.Declaration = function() 
{
	nitobi.base.Declaration.baseConstructor.call(this);
	/**
	 * @private
	 */
	this.xmlDoc=null;
}

nitobi.lang.extend(nitobi.base.Declaration, nitobi.Object);

/**
 * Given an HTML element, loads the HTML and creates an XML document from it.
 * If the HTML cannot be loaded into a XML document an error is thrown. Consult the
 * error string for information on what caused the parse error.
 * @param element {HTMLElement/String} The id of an element, or the element itself. 
 * @returns {void}
 */
nitobi.base.Declaration.prototype.loadHtml = function(element)
{
	try
	{
		element = $ntb(element);
		this.xmlDoc = nitobi.xml.parseHtml(element);
		return this.xmlDoc;
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.DeclarationParseError,err);
	}
}

/**
 * Returns the XML Document.
 * @type XMLDocument
 */
nitobi.base.Declaration.prototype.getXmlDoc = function()
{
	return this.xmlDoc;
}

/**
 * Returns XML.
 * @type String
 */
nitobi.base.Declaration.prototype.serializeToXml = function()
{
	return nitobi.xml.serialize(this.xmlDoc);	
}
