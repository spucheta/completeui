/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */


nitobi.lang.defineNs("nitobi.browser");

// extend Document to mimic IE's loadXML()
if(!nitobi.browser.IE){
	/**
	 * @private
	 * @ignore
	 */
	Document.prototype.readyState=0;
	/**
	 * @private
	 * @ignore
	 */
	Document.prototype.__load__=Document.prototype.load;
	/**
	 * @private
	 * @ignore
	 */
	Document.prototype.load=_Document_load;
	/**
	 * @private
	 * @ignore
	 */
	Document.prototype.onreadystatechange=null;
	// mimic IE's .uniqueID
	/**
	 * @private
	 * @ignore
	 */
	Node.prototype._uniqueID=null;
	/**
	 * @private
	 * @ignore
	 */
	Node.prototype.__defineGetter__("uniqueID",_Node_getUniqueID);
}

// <function name="_Document_load" access="private">
// <summary>Wraps Document.load() with cross browser code</summary>
// </function>
/**
 * @private
 * @ignore
 */
function _Document_load(strURL){

	changeReadyState(this,1);
	try{
		this.__load__(strURL);
	}catch(e){
		changeReadyState(this,4);
	}
}

// <function name="changeReadyState" access="private">
// <summary>Mimics IE's ready state</summary>
// </function>
/**
 * @private
 * @ignore
 */
function changeReadyState(oDOM,iReadyState){ 
	// 0 = uninitialized
	// 1 = loading
	// 4 = completed
    oDOM.readyState=iReadyState;
    // fire event
    if (oDOM.onreadystatechange!=null && (typeof oDOM.onreadystatechange)=="function")
        oDOM.onreadystatechange();
}

// <function name="_Node_getUniqueID" access="private">
// <summary>Document's extended uniqueID property, to mimic IE</summary>
// </function>
/**
 * @private
 * @ignore
 */
_Node_getUniqueID.i = 1;
/**
 * @private
 * @ignore
 */
function _Node_getUniqueID(){
	if (null==this._uniqueID)
		this._uniqueID="mz__id"+_Node_getUniqueID.i++;
	return this._uniqueID;
}

/**
 * @private
 * @ignore
 */
function XmlDataIslands()
{
	// This function does nothing. It should not be called. It is only here becuase
	// it was put in a lot of sample for V3, but was a bad idea.
}

// xml clipping stuff
/**
 * @private
 * @ignore
 */
function xbClipXml(oXml, parent, child, clipLength){
	var xsl = "<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:template match=\""+parent+"\"><xsl:copy><xsl:copy-of select=\"@*\"></xsl:copy-of><xsl:apply-templates select=\""+child+"\"></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match=\""+child+"\"><xsl:choose><xsl:when test=\"position()&lt;="+clipLength+"\"><xsl:copy-of select=\".\"></xsl:copy-of></xsl:when></xsl:choose></xsl:template></xsl:stylesheet>";
	var x = nitobi.xml.createXmlDoc(xsl);
	return nitobi.xml.transformToXml(oXml, x);
}

nitobi.Browser.ConvertXmlDataIsland = function (XmlId, method /* See EncodeAngleBrackets above for an exp of combo object param*/)
{
	if (null != XmlId && "" != XmlId)
	{
		var xmls = document.getElementById(XmlId);


		if (null != xmls)
		{
			var id = xmls.getAttribute("id");
			var src = xmls.getAttribute("src");
			var d;
			if(null==src)
			{
				// parse out whitespace between xml tags
				d = nitobi.xml.createXmlDoc(this.EncodeAngleBracketsInTagAttributes(xmls.innerHTML.replace(/>\s+</g,"><")));
			}
			else
			{
				// Load the document and remove any junk before the XML declaration.
				var loadedXml = nitobi.Browser.LoadPageFromUrl(src,method);
				var declaredXmlIndex = loadedXml.indexOf("<?xml");
				if (declaredXmlIndex != -1)
					loadedXml = (loadedXml.substr(declaredXmlIndex));
				d = nitobi.xml.createXmlDoc(loadedXml);
				var d2 = nitobi.xml.createXmlDoc(this.EncodeAngleBracketsInTagAttributes(d.xml.replace(/>\s+</g,"><")));
				d = d2;
			}

			// xml data island's tags will no longer be a part of the doc
		//		xmls.parentNode.removeChild(xmls);
			// instead, "xml data island" now accessible via document.id;
			// just specifying id by itself won't resolve because .id was added
			// to document via dom rather than it being a tag in doc
			document[id]=d;
			// removeChild() above seems to remove EVERYTHING on i=0; probably
			// because in Moz, it takes a greedy approach and assumes the last
			// </xml> ends this current <xml>...</xml>; below, everything should
			// be removed on the first iteration anyway; but we leave code like
			// it is below because if the above scenario is true, then xmls.length
			// == 0 on the i=1 anyway
			var p = (xmls.parentNode ? xmls.parentNode : xmls.parentElement);
			p.removeChild(xmls);
		}
	}
};
