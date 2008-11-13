
if (typeof(Eba) == "undefined")
{
	Eba = {};
}

if (typeof(Eba.Xml) == "undefined")
{
	Eba.Xml = {};
}

if (typeof(IE) == "undefined" && window.ActiveXObject)
{
	var IE = true;
	var MOZ = false;
}
if (typeof(MOZ) == "undefined" && document.implementation.createDocument)
{
	var IE = false;
	var MOZ = true;
}

if (IE)
{
	//Define a global XSLTemplate object so that we dont have to create it at runtime
	//This is used when creating an XSLT Processor 
	Eba.Xml.XslTemplate = new ActiveXObject("MSXML2.XSLTemplate.3.0");
}

if (MOZ)
{
	//Define a global serializer so that we don't have to create it at runtime
	Eba.Xml.Serializer = new XMLSerializer();
}

if (!IE && !MOZ)
{
	alert('EBA XML library is not supported in your browser');
}

///Eba.Xml.createXmlDoc
///This is how we create XML documents for our components.
if (IE)
{
	Eba.Xml.createXmlDoc = function(str)
	{
		var doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		doc.async = false;
		doc.loadXML(str || "");
		doc.setProperty('SelectionNamespaces', 'xmlns:eba=\'http://www.ebusinessapplications.ca/ebagrid#\'');
		return doc;
	}
}
else if (MOZ)
{
	Eba.Xml.createXmlDoc = function(str)
	{
		var doc = document.implementation.createDocument("", "", null);
		doc.async = false;
		doc.loadXML(str || "");
		return doc;
	}
}


///Eba.Xml.createXslDoc
///This is how we create XML documents for our components.
if (IE)
{
	Eba.Xml.createXslDoc = function(xsl)
	{
		var doc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0"); 
		doc.loadXML(xsl || "");
		return doc;
	}
}
else if (MOZ)
{
	Eba.Xml.createXslDoc = function(xsl)
	{
		var doc = Eba.Xml.createXmlDoc();
		doc.loadXML(xsl || "");
		return doc;
	}
}

if (MOZ)
{
	// TODO: IE Impelementation.
	Eba.Xml.isValidXml = function (xmldoc)
	{
		if (xmldoc.documentElement)
		{
			var roottag = xmldoc.documentElement;
			if ((roottag.tagName == "parserError") || (roottag.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml"))
			{
				return false;
			}
			return true;
		}
		else
		{
			return false;
		}

	}
	
	Eba.Xml.isValidXslTransform = function(xmlDoc)
	{
		
	}
}
else
{
	Eba.Xml.isValidXml = function (xmldoc)
	{
		if (xmldoc.documentElement)
		{
			return (xmldoc.parseError.errorCode == 0)
		}
		else
		{
			return false;
		}

	}
}


///Eba.Xml.createXslProcessor()
///This will create an XSL processor object that will cache compiled XSLT stylesheets.
if (IE)
{
	Eba.Xml.createXslProcessor = function(xsl)
	{

		var xslDoc = xsl;
		if (typeof(xsl) == "string")
		{
			xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0");
			xslDoc.loadXML(xsl || "");
		}
		else
		{
			// If xsl is a standard XML document
			xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0"); 
			xslDoc.loadXML(xsl.xml);
		}
		Eba.Xml.XslTemplate.stylesheet = xslDoc;
		var proc = Eba.Xml.XslTemplate.createProcessor();
		return proc;
	}
}
else if (MOZ)
{
	Eba.Xml.createXslProcessor = function(xsl)
	{
		if (typeof(xsl) == "undefined")
			xsl = "";

		var xslDoc = xsl;

		if (typeof(xsl) == "string")
			xslDoc = Eba.Xml.xmlDocFromString(xsl);

		var processor = new XSLTProcessor();
		processor.importStylesheet(xslDoc);
		return processor;
	}
}


if (IE)
{
	Eba.Xml.transform = function(xml,xsl)
	{
		try {
			if (typeof(xsl.xml) == "string")
			{
				return xml.transformNode(xsl);
			}
			else
			{
				xsl.input=xml;
				xsl.transform();
				return xsl.output;
			}
		} catch (e) {
			alert("Cannot transform "+xml.xml +" using the "+xsl.xml+" stylesheet. ")
		}
	}
}
else if (MOZ)
{
	Eba.Xml.transform = function(xml,xsl)
	{
		try
		{
			var processor = xsl;
			//DEPRECATED
			//I want to see only XSLTProcessor objects coming in here ...
			if (xsl.documentElement)
			{
				processor = Eba.Xml.createXslProcessor(xsl);
			}
			return processor.transformToDocument(xml);
		}
		catch (e)
		{
			alert(e.message)
		}
	}
}



if (IE)
{
	Eba.Xml.transformToString = function(xml,xsl)
	{
		return Eba.Xml.transform(xml,xsl);
	}
}
else if (MOZ)
{
	//The type attribute does nothing in the IE version of this function
	Eba.Xml.transformToString = function(xml,xsl,type)
	{
		var doc = Eba.Xml.transform(xml,xsl);
		var s = "";
		if (type == "xml")
			//	This is to be used when the output type is xml ...
			s = Eba.Xml.Serializer.serializeToString(doc);
		else
		{
			//	This is to be used when the output type is text ...
			s = doc.documentElement.childNodes[0].data;
		}
		return s;
	}
}


if (IE)
{
	Eba.Xml.transformToXml = function(xml,xsl)
	{
		return Eba.Xml.createXmlDoc(Eba.Xml.transform(xml,xsl));
	}
}
else if (MOZ)
{
	Eba.Xml.transformToXml = function(xml,xsl) {
		var result = Eba.Xml.transform(xml,xsl);
		if (result.documentElement.nodeName == "transformiix:result")
				result = Eba.Xml.xmlDocFromString(result.documentElement.firstChild.data);
		return result;
	}
}


if (IE)
{
	Eba.Xml.xmlDocFromString = function(str)
	{
		var doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		doc.loadXML(str);
		return doc;
	}
}
else if (MOZ)
{
	Eba.Xml.xmlDocFromString = function(str){
		var Parser = new DOMParser();
		return Parser.parseFromString(str,"text/xml"); 
	}
}


if (IE)
{
	Eba.Xml.xslDocFromString = function(str) {
		var doc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
		doc.loadXML(str);
		return doc;
	}
}
else if (MOZ)
{
	Eba.Xml.xslDocFromString = function(str) {
		alert('xslDocFromString not implemented for Mozilla');
	}
}


if (IE)
{
	Eba.Xml.createXmlHttp = function()
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
}
else if (MOZ)
{
	Eba.Xml.createXmlHttp = function()
	{
		return new XMLHttpRequest();
	}
}


//This is all the special stuff to emulate IE stuff in MOZ ...
if (MOZ)
{
	Document.prototype.loadXML = function(sXml) {
		var oDoc = new DOMParser().parseFromString(sXml, "text/xml");
		while (this.hasChildNodes())
			this.removeChild(this.firstChild);
		for (var i=0; i < oDoc.childNodes.length; i++) {
			this.appendChild(this.importNode(oDoc.childNodes[i], true));
		}
		oDoc = null;
	};

	//Make the .xml property available on XML Document and XML Node objects
	Document.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});
	Node.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});


	//This was going to be something so that we implement the IE way of creating an XSLT Processor...
	//might still use this sometime ...
	XSLTProcessor.prototype.__defineSetter__("stylesheet", function (param) {this.stylesheet = param;});
	XSLTProcessor.prototype.__defineSetter__("input", function (param) {this.xml = param;});
	XSLTProcessor.prototype.__defineGetter__("output", function () {return this.xslOutput;});
	XSLTProcessor.prototype.transform = function (param)
	{
		// do the transform (domDocument is the current HTML page you're on)
		var frag = this.transformToFragment(this.xml, eba_ownerDocument);
		var tmpBox = document.createElement("div");
		tmpBox.appendChild(frag);
		this.xslOutput = tmpBox.innerHTML;
	};

	XSLTProcessor.prototype.createProcessor = function () {this.importStylesheet(this.stylesheet);};

	//These are important and are currently used
	//Simple emulation of IE addParameter method on the XSLT processor object
	XSLTProcessor.prototype.addParameter = function (baseName, parameter, namespaceURI)
	{
		this.setParameter(namespaceURI, baseName, parameter);
	};


	//Well used methods for selecting single and multiple nodes in XML DOM objects
	XMLDocument.prototype.selectNodes = function(sExpr, contextNode)
	{
		var oResult = this.evaluate(sExpr, (contextNode?contextNode:this), this.createNSResolver(this.documentElement), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var nodeList = new Array();
		nodeList.expr = sExpr;
		//for(i=0;i<nodeList.length;i++)
		//for (item in oResult.snapshotItem)
		var j = 0;
		for (i=0;i<oResult.snapshotLength;i++)
		{
			var item = oResult.snapshotItem(i);
			if (item.nodeType != 3)
			{
				nodeList[j++] = item;
			}
//			alert(item.xml);
//			nodeList.push(item);
		}
		return nodeList;
	};

	Element.prototype.selectNodes = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectNodes(sExpr, this);
	};
	
	
	Element.prototype.__defineGetter__("firstNonTextChild",
		function()
		{
			var i = 0;
			while (i < this.childNodes.length && this.childNodes[i].nodeType == 3) i++;
			return this.childNodes[i];
		});

	XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode)
	{
		var ctx = contextNode?contextNode:null;
		var indexExpression = sExpr.match(/\[\d+\]/ig);
		if (indexExpression != null)
		{
			var x = indexExpression[indexExpression.length-1];
			if (sExpr.lastIndexOf(x) + x.length != sExpr.length)
			{     
				sExpr += "[1]";
			}
		}

		var nodeList = this.selectNodes(sExpr, ctx);
		if(nodeList.length > 0)
		{
			return nodeList[0];
		}
		else
		{
			return null;
		}
	};

	Element.prototype.selectSingleNode = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectSingleNode(sExpr, this);
	};

	//This should be moved elsewhere ...
	Document.prototype.createStyleSheet = function()
	{
		var newSS = this.createElement('style');
		this.documentElement.childNodes[0].appendChild(newSS);
		return newSS;
	}

	HTMLStyleElement.prototype.__defineSetter__("cssText", function (param) {this.innerHTML = param;});
	
	
}