/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.xml");

/**
 * @namespace The nitobi.xml namespace contains static functions for dealing with XML data and performing XSLT transformations.
 * @constructor
 */
nitobi.xml = function(){}

/**
 * The namespace prefix for Nitobi XML.  Is <i>ntb:</i> by default.
 * @type String
 */
nitobi.xml.nsPrefix = "ntb:";
/**
 * The XML namespace URI for Nitobi XML.  Is <i>xmlns:ntb="http://www.nitobi.com"</i> by default.
 * @type String
 */
nitobi.xml.nsDecl = 'xmlns:ntb="http://www.nitobi.com"';

if (nitobi.browser.IE)
{
	//	TODO: this should be pooled.
	//Define a global XSLTemplate Object so that we dont have to create it at runtime
	//This is used when creating an XSLT Processor 
	var inUse = false;
	/**
	 * @private
	 */
	nitobi.xml.XslTemplate = new ActiveXObject("MSXML2.XSLTemplate.3.0");
}

if (typeof XMLSerializer != "undefined" && typeof DOMParser != "undefined")
{
	//	TODO: this should be pooled.
	//Define a global serializer so that we don't have to create it at runtime
	/**
	 * @private
	 */
	nitobi.xml.Serializer = new XMLSerializer();
	nitobi.xml.DOMParser = new DOMParser();
}

/**
 * Returns the child nodes of a given XML node, ignoring text nodes.
 * @param {XMLNode} xmlNode The parent node.
 * @type XMLNode
 */
nitobi.xml.getChildNodes = function(xmlNode)
{
	if (nitobi.browser.IE)
	{
		return xmlNode.childNodes;
	}
	else
	{
		return xmlNode.selectNodes('./*');
	}
};

/**
 * Returns the index of the child node in the parent collection. -1 if not found.
 * @param {XMLNode} parent The parent to search through.
 * @param {XMLNode} child The child whose index you want to find.
 * @type Number
 */
nitobi.xml.indexOfChildNode = function(parent,child)
{
	var childNodes = nitobi.xml.getChildNodes(parent);
	for (var i=0; i < childNodes.length;i++)
	{
		if (childNodes[i] == child)
		{
			return i;
		}
	}
	return -1;
}

/**
 * Creates an XML document from a string of XML.
 * @param {String | XMLDocument} xml XML string to load into the XmlDocument object.
 * @type XMLDocument
 */
nitobi.xml.createXmlDoc = function(xml)
{
	// checks for anything added to the beginning of the response, i.e. by a debugger
	if (xml != null)
		xml = xml.substring(xml.indexOf("<?xml"));
	
	if (xml != null && xml.documentElement != null)
		return xml;

	var doc = null;
	if (nitobi.browser.IE)
	{
		// TODO: Do a better job of using whatever DOMDocument is available.
		//var AX=["Msxml4.DOMDocument","Msxml3.DOMDocument","Msxml2.DOMDocument","Msxml.DOMDocument","Microsoft.XmlDom"];
		doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		doc.setProperty('SelectionNamespaces', 'xmlns:ntb=\'http://www.nitobi.com\'');
	}
	else if (document.implementation && document.implementation.createDocument)
	{
		doc = document.implementation.createDocument("", "", null);
	}

	if(xml!=null && typeof xml == "string")
	{
		doc = nitobi.xml.loadXml(doc, xml);
	}
	return doc;
}

/**
 * Loads a string of XML data into the given XML document object.  <code>loadXml</code> also
 * returns the XML document object to allow for chaining operations.
 * @param {XMLDocument} doc An xml document to receive the XML from the xml string.
 * @param {String} str XML string to load into the XmlDocument object (doc).
 * @param {Boolean} clearDoc Flag indicating if the expensive operation of clearing the XMLDocument should be performed. 
 * This is only required if the XMLDocument already has contents to be overwritten. Optional.
 * @type XMLDocument
 */
nitobi.xml.loadXml = function(doc, xml, clearDoc)
{
	doc.async = false;
	if (nitobi.browser.IE)
		doc.loadXML(xml);
	else
	{
		// added the terse if for Chrome ... not sure what the deal is there...
		var tempDoc = nitobi.xml.DOMParser.parseFromString(( xml.xml != null ? xml.xml : xml ), "text/xml");

		if (clearDoc)
		{
			while (doc.hasChildNodes())
				doc.removeChild(doc.firstChild);
			for (var i=0; i < tempDoc.childNodes.length; i++) {
				doc.appendChild(doc.importNode(tempDoc.childNodes[i], true));
			}
		}
		else
			doc = tempDoc;

		tempDoc = null;
	}
	return doc;
}

/**
 * Determines whether or not an XML document has a parse error. If an error
 * exists it returns true and false otherwise.
 * @param {XMLDocument} xmlDoc The xml doc that had the error.
 * @type Boolean
 */
nitobi.xml.hasParseError = function(xmlDoc)
{
	if (nitobi.browser.IE)
	{
		return (xmlDoc.parseError != 0);
	}
	else
	{
		if (xmlDoc == null || xmlDoc.documentElement == null) return true;
		var roottag = xmlDoc.documentElement;
		if ((roottag.tagName == "parserError") || (roottag.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
		{
			return true;
		}
		return false;
	}
}

/**
 * Returns the parse error in an XML document.
 * @param {XMLDocument} xmlDoc The xml doc that had the error.
 * @type String
 */
nitobi.xml.getParseErrorReason = function(xmlDoc)
{
	if (!nitobi.xml.hasParseError(xmlDoc))
	{
		return "";
	}
	if (nitobi.browser.IE)
	{
		return (xmlDoc.parseError.reason);
	}
	else
	{
		return (new XMLSerializer().serializeToString(xmlDoc));
	}
}

/**
 * Creates and returns an XSL document. This differs from an XML document in that in Internet Explorer we use the MSXML2.FreeThreadedDOMDocument.3.0 ActiveX object such that it can be used with an XSLProcessor.
 * @param {String} xsl XML string to load into the XmlDocument object.
 * @type XMLDocument
*/
nitobi.xml.createXslDoc = function(xsl)
{
	var doc = null;

	if (nitobi.browser.IE)
		doc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0"); 
	else
		doc = nitobi.xml.createXmlDoc();

	doc = nitobi.xml.loadXml(doc, xsl || '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" />');
	return doc;
}


/**
 * Creates an XSL processor object that will cache compiled XSLT stylesheets.
 * @param {String|XMLDocument} xsl An XML document that conforms to the XSL dtd.
 * @type XSLProcessor
 */
nitobi.xml.createXslProcessor = function(xsl)
{
	// TODO: we use createXslDoc a lot but then re-load the XML here ... this needs to be tightened up.
	var xslDoc = null;
	var xt = null;

	if (typeof(xsl) != "string")
	{
		xsl = nitobi.xml.serialize(xsl);
	}

	if (nitobi.browser.IE)
	{
		xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
		xt = new ActiveXObject("MSXML2.XSLTemplate.3.0");
		xslDoc.async = false;
		xslDoc.loadXML(xsl);
		xt.stylesheet = xslDoc;
		return xt.createProcessor();
	}
	else if (XSLTProcessor)
	{
		xslDoc = nitobi.xml.createXmlDoc(xsl);
		xt = new XSLTProcessor();
		xt.importStylesheet(xslDoc);
		xt.stylesheet = xslDoc;
		return xt;
	}
}

/**
 * Parses an HTML fragment and returns a valid XML document.
 * @param {HTMLElement} element An HTML element which corresponds to the documentElement
 * of the resulting XML document or a string of HTML.
 * @type XMLDocument
 */
nitobi.xml.parseHtml = function(element)
{
	if (typeof(element) == "string")
		element = document.getElementById(element);

	var html = nitobi.html.getOuterHtml(element);

	// In IE < etc come in unencoded no matter how many times you encode - ie &amp;lt; == <
	// But in FF this is not the case.
	var fixedHtml = "";
	if (nitobi.browser.IE)
	{
		// First things first, IE will mess with attribute values containing &quot;
		// eg attname="&quot;Value&quot;" => attname='"Value"' note the outer single quotes!!! 
		var regexpQuot = new RegExp("(\\\s+.[^=]*)='(.*?)'","g");
		html = html.replace(regexpQuot, function(m,_1,_2){return _1+"=\""+_2.replace(/"/g,"&quot;")+"\"";});

		fixedHtml = (html.substring(html.indexOf('/>')+2).replace(/(\s+.[^\=]*)\=\s*([^\"^\s^\>]+)/g,"$1=\"$2\" ")).replace(/\n/gi,'').replace(/(.*?:.*?\s)/i,"$1  ");

		var regexpLt = new RegExp('\="([^"]*)(\<)(.*?)"', 'gi');
		var regexpGt = new RegExp('\="([^"]*)(\>)(.*?)"', 'gi');

		// Encode any < or > characters in attribute values.
		// Loop through until the match is false - cause we need to get
		// every < with an attribute =".." ...
		while (true)
		{
			fixedHtml = fixedHtml.replace(regexpLt, "=\"$1&lt;$3\" ")
			fixedHtml = fixedHtml.replace(regexpGt, "=\"$1&gt;$3\" ");
			// TODO: Two tests here since IE (and maybe MOZ??) is being weird.
			var x = (regexpLt.test(fixedHtml));
			if (!regexpLt.test(fixedHtml))
				break;
		}
	}
	else
	{	
		// The html is going to have everything escaped in firfox - ie <br> == &lt;br&gt;.
		// but the & character is a problem.
		fixedHtml = html;//.replace(/(\s+.[^\=]*)\=\s*([^\"^\s^\>]+)/g,"$1=\"$2\" ")
		fixedHtml = fixedHtml.replace(/\n/gi,'').replace(/\>\s*\</gi,'><').replace(/(.*?:.*?\s)/i,"$1  ");		
		fixedHtml = fixedHtml.replace(/\&/g,'&amp;');
		fixedHtml = fixedHtml.replace(/\&amp;gt;/g,'&gt;').replace(/\&amp;lt;/g,'&lt;').replace(/\&amp;apos;/g,'&apos;').replace(/\&amp;quot;/g,'&quot;').replace(/\&amp;amp;/g,'&amp;').replace(/\&amp;eq;/g,'&eq;');
	}

	if (fixedHtml.indexOf('xmlns:ntb="http://www.nitobi.com"') < 1)
	{
		// indert our namespace into this XML
		fixedHtml = fixedHtml.replace(/\<(.*?)(\s|\>|\\)/, '<$1 xmlns:ntb="http://www.nitobi.com"$2');
	}

	fixedHtml = fixedHtml.replace(/\&nbsp\;/gi,' ');

	return nitobi.xml.createXmlDoc(fixedHtml);
}


/**
 * Transforms the provided XML document using the provided XSL processor.
 * @param {XMLDocument} xml the XML document to input
 * @param {Object} xsl Either an XmlDocument or an XslProcessor
 * @type String
 * @private
 */
nitobi.xml.transform = function(xml,xsl,type)
{
	// Check to see if the XSL is an XML doc or not...
	if (xsl.documentElement)
	{
		xsl = nitobi.xml.createXslProcessor(xsl);
	}
	if (nitobi.browser.IE)
	{
		/*
		if (typeof(xsl.xml) == "string" || type == "xml")
		{
			// We dont have an XSL processor - just regular XSL
			// OR we want XML output in which case we can't use the XSLProcessor.
			if (type == "text")
			{
				return xml.transformNode(xsl);
			}
			else
			{
				var output = nitobi.xml.createXmlDoc();
				if (typeof(xsl.xml) != "string")
				{
					xsl = xsl.ownerTemplate.stylesheet;
				}
				xml.transformNodeToObject(xsl, output);
				return output;
			}
		}
		else
		{
		*/
			xsl.input=xml;
			xsl.transform();
			return xsl.output;
		//}
	}
	else if (XSLTProcessor)
	{
		var doc = xsl.transformToDocument(xml);
		var firstNode = doc.documentlement;
		if (firstNode && firstNode.nodeName.indexOf('ntb:') == 0)
		{
			firstNode.setAttributeNS('http://www.w3.org/2000/xmlns/','xmlns:ntb','http://www.nitobi.com');
		}
		return doc;
	}
}

/**
 * Transforms the provided XML document using the provided XSL processor.
 * @param {XMLDocument} xml the XML document to use as input
 * @param {Object} xsl Either an XmlDocument or an XslProcessor
 * @type String
 */
nitobi.xml.transformToString = function(xml,xsl,type)
{
	var result = nitobi.xml.transform(xml,xsl,"text");
	if (nitobi.browser.MOZ)
	{
		//The type attribute does nothing in the IE version of this function
		if (type == "xml")
		{
			//	This is to be used when the output type is xml ...
			result = nitobi.xml.Serializer.serializeToString(result);
		}
		else
		{
			//	This is to be used when the output type is text ...

			if (result.documentElement.childNodes[0] == null)
			{
				nitobi.lang.throwError("The transformToString fn could not find any valid output");
			}
			if (result.documentElement.childNodes[0].data != null)
			{
				result = result.documentElement.childNodes[0].data;
			}
			else if (result.documentElement.childNodes[0].textContent != null)
			{
				result = result.documentElement.childNodes[0].textContent;
			}
			else
			{
				nitobi.lang.throwError("The transformToString fn could not find any valid output");
			}				
		}
	}
	else if (nitobi.browser.SAFARI||nitobi.browser.CHROME)
	{
		//The type attribute does nothing in the IE version of this function
		if (type == "xml")
		{
			//	This is to be used when the output type is xml ...
			result = nitobi.xml.Serializer.serializeToString(result);
		}
		else
		{
			var dataNode = result.documentElement;
			if (dataNode.nodeName != 'transformiix:result')
			{
				// WebKit stores its "text" transformation in a pre tag.
				dataNode = dataNode.getElementsByTagName('pre')[0];
			}
			try {
				result = dataNode.childNodes[0].data;
			} catch(e) {
				// This is the case for Safari when the transformation result is ""
				result = (dataNode.data)
			}
		}
	}
	return result;
}

/**
 * Transforms the provided XML document using the provided XSL processor and returns an XML document.
 * @param {XMLDocument} xml the XML document to use as input
 * @param {XMLDocument|XSLProcessor} xsl Either an XmlDocument or an XslProcessor
 * @type XMLDocument
 */
nitobi.xml.transformToXml = function(xml,xsl)
{
	var result = nitobi.xml.transform(xml,xsl,"xml");
	if (typeof result == "string")
	{
		result = nitobi.xml.createXmlDoc(result);
	}
	else
	{
		if (result.documentElement.nodeName == "transformiix:result")
		{
			result = nitobi.xml.createXmlDoc(result.documentElement.firstChild.data);
//				result = result.documentElement.firstChild;
		}
	}
	return result;
}

/**
 * Converts the contents of an XMLDocument to a string.
 * @param {XMLDocument} xml the XML document to be serialized
 * @type String
 */
nitobi.xml.serialize = function(xml)
{
	if (nitobi.browser.IE)
		return xml.xml;
	else
		return (new XMLSerializer()).serializeToString(xml);
}

/**
 * Creates and returns an XMLHttpRequest object.
 * @type XMLHttpRequest
 * @private
 */
nitobi.xml.createXmlHttp = function()
{
	if (nitobi.browser.IE)
	{
		//	TODO: try all the XML HTTP objects starting from 5...
		var reservedObj = null;
		try
		{
			reservedObj = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			try
			{
				reservedObj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(ee)
			{
			}
		}
		return reservedObj;
	}
	else
	{
		return new XMLHttpRequest();
	}
}

/**
 * Creates a namespaced XML element. 
 * @param {XMLDocument} xmlDoc The document to create the element in.
 * @param {String} elementName The name of the element to create.
 * @param {String} [ns] The namespace.  The default namespace is "http://www.nitobi.com".
 */
nitobi.xml.createElement = function(xmlDoc, elementName, ns)
{
	ns = ns || "http://www.nitobi.com";
	var newDataNode = null;
	if (nitobi.browser.IE)
		newDataNode = xmlDoc.createNode(1, nitobi.xml.nsPrefix+elementName, ns);
	else if (xmlDoc.createElementNS)
		newDataNode = xmlDoc.createElementNS(ns, nitobi.xml.nsPrefix+elementName);
	return newDataNode;
}

/**
 * just a little helper ...
 * @private
 */
function nitobiXmlDecodeXslt(xsl)
{
	return xsl.replace(/x:c-/g, 'xsl:choose')
		.replace(/x\:wh\-/g, 'xsl:when')
		.replace(/x\:o\-/g, 'xsl:otherwise')
		.replace(/x\:n\-/g, ' name="')
		.replace(/x\:s\-/g, ' select="')
		.replace(/x\:va\-/g, 'xsl:variable')
		.replace(/x\:v\-/g, 'xsl:value-of')
		.replace(/x\:ct\-/g, 'xsl:call-template')
		.replace(/x\:w\-/g, 'xsl:with-param')
		.replace(/x\:p\-/g, 'xsl:param')
		.replace(/x\:t\-/g, 'xsl:template')
		.replace(/x\:at\-/g, 'xsl:apply-templates')
		.replace(/x\:a\-/g, 'xsl:attribute')
}

//This is all the special stuff to emulate IE stuff in nitobi.browser.MOZ ...
if (!nitobi.browser.IE)
{
	/**
	 * Mimic IE's loadXML()
	 * @private
	 * @ignore
	 * @deprecated Use nitobi.xml.loadXml instead.
	 */
	Document.prototype.loadXML=function(strXML) {
		changeReadyState(this,1);
		var p=new DOMParser();
		var d=p.parseFromString(strXML,"text/xml");
		while(this.hasChildNodes())
			this.removeChild(this.lastChild);
		for(var i=0; i<d.childNodes.length; i++)
			this.appendChild(this.importNode(d.childNodes[i],true));
		changeReadyState(this,4);
	};

	/**
	 * Make the .xml property available on XML Document and XML Node objects.
	 * @private
	 * @ignore
	 */
	Document.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});
	/**
	 * Make the .xml property available on XML Document and XML Node objects.
	 * @private
	 * @ignore
	 */
	Node.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});

	/**
	 * @private
	 * @ignore
	 */
	XPathResult.prototype.__defineGetter__("length", function() {return this.snapshotLength;});

	//These are important and are currently used
	//Simple emulation of IE addParameter method on the XSLT processor object
	/**
	 * Emulate the setParameter method for Firefox.
	 * @ignore
	 */
	if (XSLTProcessor) {
		XSLTProcessor.prototype.addParameter = function (baseName, parameter, namespaceURI)
		{
			if (parameter == null)
			{
				this.removeParameter(namespaceURI,baseName);
			}
			else
			{
				this.setParameter(namespaceURI, baseName, parameter);
			}
		};
    }

	/**
	 * Emulates the selectNodes method that is available on XML documents Internet Explorer such that it can be used in Firefox.
	 * @param {string} sExpr XPath expression that is evaluated to get the XMLNodeList.
	 * @param {Element} contextNode XML element from which the XPath should be executed. Optional
	 * @type {XMLNodeList}
	 * @private
	 * @ignore
     */
	XMLDocument.prototype.selectNodes = function(sExpr, contextNode)
	{
		try {
			//	TODO: we need to get some assert stuff in here ... 
			if (this.nsResolver == null)
				this.nsResolver = this.createNSResolver(this.documentElement);
	
			var oResult = this.evaluate(sExpr, (contextNode?contextNode:this), new MyNSResolver(), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var nodeList = new Array(oResult.snapshotLength);
			nodeList.expr = sExpr;
			var j = 0;
			for (i=0;i<oResult.snapshotLength;i++)
			{
				var item = oResult.snapshotItem(i);
				//	Ignore whitespace nodes.
				if (item.nodeType != 3)
				{
					nodeList[j++] = item;
				}
			}
			return nodeList;
		}catch(e){
			//console.log('problem in selectnodes. probably in creating NSResolver');
		}
	};

	Document.prototype.selectNodes = XMLDocument.prototype.selectNodes;

    function MyNSResolver() {}
	MyNSResolver.prototype.lookupNamespaceURI = function(prefix) {
		switch (prefix) {
			case "xsl":
				return "http://www.w3.org/1999/XSL/Transform";
				break;
			case "ntb":
				return "http://www.nitobi.com";
				break;
			case "d":
				return "http://exslt.org/dates-and-times";
				break;
			case "n":
				return "http://www.nitobi.com/exslt/numbers";
				break;
			default:
				return null;
				break;
		}
	}

	/**
	 * Emulates the selectSingleNode method that is available on XML documents Internet Explorer such that it can be used in Firefox.
	 * @param {string} sExpr XPath expression that is evaluated to get the XML element.
	 * @param {Element} contextNode XML element from which the XPath should be executed. Optional
	 * @type {Element}
	 * @private
	 * @ignore
	 */
	XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode)
	{
		var indexExpression = sExpr.match(/\[\d+\]/ig);
		if (indexExpression != null)
		{
			var x = indexExpression[indexExpression.length-1];
			if (sExpr.lastIndexOf(x) + x.length != sExpr.length)
			{     
				sExpr += "[1]";
			}
		}

		var nodeList = this.selectNodes(sExpr, contextNode || null);
		return ((nodeList != null && nodeList.length > 0)?nodeList[0]:null);
	};

	Document.prototype.selectSingleNode = XMLDocument.prototype.selectSingleNode;

	/**
	 * @private
	 * @ignore
	 */
	Element.prototype.selectNodes = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectNodes(sExpr, this);
	};

	/**
	 * @private
	 * @ignore
	 */
	Element.prototype.selectSingleNode = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectSingleNode(sExpr, this);
	};
}

/**
 * Returns the remainder of a string after the first appearance of a colon (':').  When
 * an XML node name is used as input this will be the local name of the node.
 * @param {String} nodeName the input string
 * @type String
 */
nitobi.xml.getLocalName = function(nodeName)
{
	var colon = nodeName.indexOf(":");
	if (colon == -1)
	{
		return nodeName;
	}
	else
	{
		return nodeName.substr(colon+1);
	}
}

nitobi.xml.importNode = function(doc, node, childClone)
{
	if (childClone == null)
		childClone = true;
	return (doc.importNode?doc.importNode(node, childClone):node);
	//return node;
}


/**
 * @private
 */
nitobi.xml.encode = function(str)
{
	str += "";
	str = str.replace(/&/g,"&amp;");
	str = str.replace(/'/g,"&apos;");
	str = str.replace(/\"/g,"&quot;");
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	str = str.replace(/\n/g,"&#xa;");
	return str;
}

/**
 * @private
 * Makes a valid XPATH query from a value.
 * This addresses a deficiency in XSL.A literal string can be written with either kind of quote. 
 * XPaths usually appear in attributes, and of course these have to be quoted too. 
 * You can use the usual XML entities &quot; and &apos; for quotes in your XPaths, but remember 
 * that these are expanded by the XML parser, before the XPath string is parsed. There is no way to
 * escape characters at the XPath level, so you can't have a literal XPath string 
 * containing both kinds of quote.However, you can create a concat function that tricks the processor into accepting
 * both kinds of quotes, which is what this function does.
 * @param {String} Value The value.
 * @param {Boolean} QuoteValue If true, when no concat workaround is needed, surrounds the value with quotes.
 * @type {String} A XPATH concat function.
 */
nitobi.xml.constructValidXpathQuery = function(Value, QuoteValue)
{
	var matches=Value.match(/(\"|\')/g);
	if (matches!=null)
	{
		var xpath="concat(";
		var comma="";
		var quote;
		for (var i=0;i<Value.length;i++)
		{
			if (Value.substr(i,1)=="\"")
			{
				quote="&apos;";
			}
			else
			{
				quote="&quot;";
			}
			xpath+=comma+quote+nitobi.xml.encode(Value.substr(i,1))+quote;
			comma=",";
		}
		xpath+=comma+"&apos;&apos;";
		xpath+=")";
		Value=xpath;
	}
	else
	{
		var quot=(QuoteValue?"'":"");
		Value=quot+nitobi.xml.encode(Value)+quot;
	}
	return Value;
}

/**
 * Removes all the child nodes of some given xml node.
 * @param {Node} parentNode The node whose children to remove.
 */
nitobi.xml.removeChildren = function(parentNode)
{
	while(parentNode.firstChild)
		parentNode.removeChild( parentNode.firstChild );
}

/**
 * @private
 * This is an empty XML doc for use whenever you want.
 */
nitobi.xml.Empty = nitobi.xml.createXmlDoc('<root></root>');
