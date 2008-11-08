if (typeof(nitobi) == "undefined")
{
	nitobi = {};
}

if (typeof(nitobi.testframework) == "undefined")
{
	nitobi.testframework = {};
}


nitobi.testframework.projectDir = "fisheye";



/****************************************************************/
/* DO NOT CHANGE ANYTHING BELOW THIS LINE. THE PROJECT DIR IS 
/* THE ONLY VARIABLE THAT NEEDS TO BE SET. 
/****************************************************************/

var pathname = window.location.pathname;
var baseDir = window.location.protocol + "//" + window.location.host

// Go back until we hit branches, tags, or trunk.
/*if (pathname.indexOf("trunk") != -1)
{
	nitobi.testframework.baseDir = baseDir + pathname.substr(0,pathname.indexOf("trunk")+ "trunk".length);
} else if (pathname.indexOf("tags") != -1)
{
	// Simply go back and select the base + version of the branch.
	alert("Test framework todo");
} else if (pathname.indexOf("branches") != -1)
{
	//alert("Test framework todo");
	nitobi.testframework.baseDir = baseDir + pathname.replace(/(.*?branches\/.*?)\/.*,"$1");
}*/

nitobi.testframework.baseDir = baseDir + pathname.substr(0, pathname.indexOf("samples"));

nitobi.testframework.projectBaseDir = nitobi.testframework.baseDir + "src/client/" + nitobi.testframework.projectDir;
nitobi.testframework.testFrameworkBaseDir = nitobi.testframework.baseDir + "testframework";
nitobi.testframework.frameworkBaseDir = nitobi.testframework.baseDir + "src/client/toolkit";

nitobi.testframework.includeSource = function () 
{
	nitobi.testframework.include(nitobi.testframework.frameworkBaseDir + "/includes.xml",nitobi.testframework.frameworkBaseDir);
	nitobi.testframework.include(nitobi.testframework.projectBaseDir + "/includes.xml");
};

nitobi.testframework.includeJs = function(file)
{
	document.writeln("<script language='javascript' src='" + file +"'></script>");
}

function initTest(showDebugTools)
{
	nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/jsunit/app/jsUnitCore.js");
	nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/selenium/scripts/selenium-browserdetect.js");
	nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/selenium/scripts/selenium-browserbot.js");
	nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/selenium/scripts/selenium-logging.js");
	nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/selenium/scripts/htmlutils.js");
	nitobi.testframework.includeSource();
	/*if (showDebugTools == true)
	{
		nitobi.testframework.includeJs(nitobi.testframework.testFrameworkBaseDir + "/debug/debug.js");
	}*/
	//pagebot = PageBot.createForWindow(window);
}



nitobi.testframework.loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

nitobi.testframework.randomText = function (length)
{
	var retVal = nitobi.testframework.loremIpsum;
	while (retVal.length < length)
	{
		retVal = retVal + nitobi.testframework.loremIpsum;
	}
	return retVal.substr(0,length);
}

nitobi.testframework.include = function(xmlFileName, baseDir)
{
	baseDir = baseDir || nitobi.testframework.projectBaseDir;
	var includesXmlDoc = nitobi.testframework.createXmlDoc();
	includesXmlDoc.async = false;
	includesXmlDoc.load(xmlFileName);
	var xslDoc = nitobi.testframework.createXslDoc();
	xslDoc.async = false;
	xslDoc.load(nitobi.testframework.testFrameworkBaseDir + "/linking/include.xsl");

	var xslProc = nitobi.testframework.createXslProcessor(xslDoc);

	nitobi.testframework.setParameter(xslProc, "basedir", baseDir, "");
	nitobi.testframework.setParameter(xslProc, "rand", Math.random()+(new Date).getTime(), "");
	var txt = nitobi.testframework.transformToString(includesXmlDoc, xslProc,"text");
	document.writeln(txt);
};




// ***************************************************************** //

nitobi.testframework.escapeXslt = function(sXslt)
{
	return sXslt.replace(/\&lt\;/g, '&amp;lt;').replace(/\&gt\;/g, '&amp;gt;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

nitobi.testframework.detect = function ()
{
	var data = [
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{	// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 	// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	];

	var browser = "Unknown";
	for (var i=0;i<data.length;i++)	{
		var dataString = data[i].string;
		var dataProp = data[i].prop;
		if (dataString) {
			if (dataString.indexOf(data[i].subString) != -1)
			{
				browser = data[i].identity;
				break;
			}
		}
		else if (dataProp)
		{
			browser = data[i].identity;
			break;
		}
	}
	nitobi.testframework.ie = (browser == "Explorer");
	nitobi.testframework.moz = (browser == "Netscape" || browser == "Firefox");
	nitobi.testframework.safari = (browser == "Safari");
	nitobi.testframework.opera = (browser == "Opera");
	if (nitobi.testframework.moz)
		nitobi.testframework.opera = true;
};

nitobi.testframework.detect();
	

if (nitobi.testframework.moz || nitobi.testframework.safari)
{
	nitobi.testframework.Serializer = new XMLSerializer();
}

nitobi.testframework.createXmlDoc = function(str)
{
	var doc = null;
	if (nitobi.testframework.ie)
	{
		doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		doc.setProperty('SelectionNamespaces', 'xmlns:ntb=\'http://www.nitobi.com\'');
	}
	else
	{
		doc = document.implementation.createDocument("", "", null);
		if (nitobi.testframework.safari)
		{
			doc.load = function(url) {
				var req = new XMLHttpRequest();
				req.open("GET", url, false);
				req.send(null);
				nitobi.testframework.loadXml(this,req.responseText);
			}
		}
	}
	if(str!=null)
	{
		doc = nitobi.testframework.loadXml(doc, str);
	}
	return doc;
}

nitobi.testframework.loadXml = function(doc, xml)
{
	doc.async = false;
	if (nitobi.testframework.ie)
	{
		doc.loadXML(xml);
	}
	else
	{
		var tempDoc = new DOMParser().parseFromString(xml, "text/xml");
		while (doc.hasChildNodes())
			doc.removeChild(doc.firstChild);
		for (var i=0; i < tempDoc.childNodes.length; i++) {
			doc.appendChild(doc.importNode(tempDoc.childNodes[i], true));
		}
		tempDoc = null;
	}
	return doc;
}

nitobi.testframework.createXslDoc = function(xsl)
{
	var doc = null;
	if (nitobi.testframework.ie)
	{
		doc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.3.0"); 
	}
	else
	{
		doc = nitobi.testframework.createXmlDoc();
	}
	doc = nitobi.testframework.loadXml(doc, xsl || '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" />');
	return doc;
}

nitobi.testframework.createXslProcessor = function(xsl)
{
	// TODO: we use createXslDoc a lot but then re-load the XML here ... this needs to be tightened up.
	var xslDoc = null;
	var xt = null;

	if (typeof(xsl) != "string")
	{
		try {
			xsl = xsl.xml;
		}
		catch(e)
		{
			xsl = (new XMLSerializer()).serializeToString(xsl);
		}
	}

	if (nitobi.testframework.ie)
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
		xslDoc = nitobi.testframework.createXmlDoc(xsl);
		xt = new XSLTProcessor();
		xt.importStylesheet(xslDoc);
		xt.stylesheet = xslDoc;
		return xt;
	}
	else
	{
	    var obj = function(stylesheet) {this.params = {}; this.stylesheet = nitobi.testframework.createXmlDoc(stylesheet);};
	    obj.prototype.addParameter = function(param, val) {
	        this.params[param] = val;
	    };
	    obj.prototype.getParams = function() {
	        var str = "";
	        var spcr = "";
	        for (var i in this.params)
	        {
	            str += spcr + i + "::" + this.params[i];
	            spcr = "||";
	        }
	        return str;
	    };
		return new obj(xsl);
	}
}

nitobi.testframework.transform = function(xml,xsl,type)
{
	if (xsl.documentElement)
	{
		xsl = nitobi.testframework.createXslProcessor(xsl);
	}

	if (nitobi.testframework.ie)
	{
		xsl.input=xml;
		xsl.transform();
		return xsl.output;
	}
	else if (XSLTProcessor)
	{
		// do the transform (domDocument is the current HTML page you're on)
		var doc = xsl.transformToDocument(xml);
		//alert(nitobi.testframework.Serializer.serializeToString(doc));
		return doc;
	}
	else
	{
		
		var req = new XMLHttpRequest();
		req.async = false;
		req.open("POST", nitobi.testframework.frameworkBaseDir+'/server/asp/transform.asp', false);
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		req.send("xml="+encodeURIComponent(nitobi.testframework.Serializer.serializeToString(xml))+"&xsl="+encodeURIComponent(nitobi.testframework.Serializer.serializeToString(xsl.stylesheet))+"&params="+encodeURIComponent(xsl.getParams()));
		return type == 'text' ? req.responseText : req.responseXML;
	}

}

nitobi.testframework.defineNs = function(namespace)
{
	var names = namespace.split(".");
	var currentNamespace ="";
	var dot="";
	for (var i=0; i < names.length; i++)
	{
		currentNamespace += dot + names[i];
		dot=".";
		if (typeof(eval(currentNamespace)) == "undefined")
		{
			eval(currentNamespace + "={}");
		}
	}
}

nitobi.testframework.transformToString = function(xml,xsl,type)
{
	var result = nitobi.testframework.transform(xml,xsl,"text");
	if (nitobi.testframework.moz || nitobi.testframework.safari)
	{
		//The type attribute does nothing in the IE version of this function
		if (type == "xml")
		{
			//	This is to be used when the output type is xml ...
			result = nitobi.testframework.Serializer.serializeToString(result);
		}
		else
		{
			//	This is to be used when the output type is text ...
			if (typeof result != "string")
			{
				var dataNode = result.documentElement;
				if (dataNode.nodeName != 'transformiix:result')
				{   
					// WebKit stores its "text" transformation in a pre tag.
					dataNode = dataNode.getElementsByTagName('pre')[0];
				}
				result = dataNode.childNodes[0].data;
			}
		}
	}
	return result;
}

nitobi.testframework.setParameter = function(xslt, baseName, parameter, namespaceURI)
{
	if (xslt.setParameter)
		xslt.setParameter(namespaceURI, baseName, parameter);
	else
		xslt.addParameter(baseName, parameter, namespaceURI);
}

if (nitobi.testframework.moz || nitobi.testframework.safari)
{
	/**
	 * Make the .xml property available on XML Document and XML Node objects.
	 * @private
	 */
	Document.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});
	/**
	 * Make the .xml property available on XML Document and XML Node objects.
	 * @private
	 */
	Node.prototype.__defineGetter__("xml", function () {return (new XMLSerializer()).serializeToString(this);});

	/**
	 * @private
	 */
	XPathResult.prototype.__defineGetter__("length", function() {return this.snapshotLength;});

	/**
	 * Emulates the selectNodes method that is available on XML documents Internet Explorer such that it can be used in Firefox.
	 * @param {string} sExpr XPath expression that is evaluated to get the XMLNodeList.
	 * @param {XmlElement} contextNode XmlElement from which the XPath should be executed. Optional
	 * @returns {XmlNodeList}
     */
	XMLDocument.prototype.selectNodes = function(sExpr, contextNode)
	{
		//	TODO: we need to get some assert stuff in here ... 
		try {
			var oResult = this.evaluate(sExpr, (contextNode?contextNode:this), new MyNSResolver(), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			var nodeList = new Array();
			nodeList.expr = sExpr;
			//for(i=0;i<nodeList.length;i++)
			//for (item in oResult.snapshotItem)
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
		}
		catch(e)
		{
		}
	};

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
	 * @param {string} sExpr XPath expression that is evaluated to get the XmlElement.
	 * @param {XmlElement} contextNode XmlElement from which the XPath should be executed. Optional
	 * @returns {XmlElement}
	 */
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
		if(nodeList != null && nodeList.length > 0)
		{
			return nodeList[0];
		}
		else
		{
			return null;
		}
	};

	/**
	 * @private
	 */
	Element.prototype.selectNodes = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectNodes(sExpr, this);
	};

	/**
	 * @private
	 */
	Element.prototype.selectSingleNode = function(sExpr)
	{
		var doc = this.ownerDocument;
		return doc.selectSingleNode(sExpr, this);
	};
}