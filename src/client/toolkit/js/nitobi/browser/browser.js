/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.browser");
if (false)
{
	/**
	 * @namespace The nitobi.browser namespace contains several static fields specifying what the current browser is.
	 * @constructor
	 */
	nitobi.browser = function(){};
}

/**
 * When <code>true</code>, there is no information available pointing to what type of browser is being
 * employed.
 * @type Boolean
 */
nitobi.browser.UNKNOWN = true;
/**
 * When <code>true</code>, the browser in use is some version of Internet Explorer.
 * @type Boolean
 */
nitobi.browser.IE = false;
/**
 * When <code>true</code>, the browser in use is Internet Explorer version 6.x.
 * @type Boolean
 */
nitobi.browser.IE6 = false;
/**
 * When <code>true</code>, the browser in use is Internet Explorer version 7.x.
 * @type Boolean
 */
nitobi.browser.IE7 = false;
/**
 * When <code> true, the browser in use is Internet Explorer version 8.x.
 * @type Boolean
 */
nitobi.browser.IE8 = false;
/**
 * When <code> true, the browser in use is some Gecko-based browser (Firefox/Mozilla/Netscape).
 * @type Boolean
 */
nitobi.browser.MOZ = false;
/**
 * When <code> true, the browser in use is Firefox 3 (Firefox/Mozilla/Netscape).
 * @type Boolean
 */
nitobi.browser.FF3 = false;
/**
 * When <code> true, the browser in use is some version Safari.
 * @type Boolean
 */
nitobi.browser.SAFARI = false;
/**
 * When <code>true</code>, the browser in use is some version of Opera.
 * @type Boolean
 */
nitobi.browser.OPERA = false;
/**
 * When <code>true</code>, the browser in use is some version of Adobe AIR.
 * @type Boolean
 */
nitobi.browser.AIR = false;
/**
 * When <code>true</code>, the browser in use is some version of Chrome.
 * @type Boolean
 */
nitobi.browser.CHROME = false;
/**
 * When <code>true</code>, the browser in use is Ajax-capable (it has an XMLHttpRequest object).
 * @type Boolean
 */
nitobi.browser.XHR_ENABLED
/**
 * Detects which browser is being used.
 * This function sets up the booleans found above.  It is called automatically when this class is 
 * included in your page.
 */
nitobi.browser.detect = function ()
{
	var data = [
		{
			string: navigator.vendor,
			subString: "Adobe",
			identity: "AIR"
		},
		{
			string: navigator.vendor,
			subString: "Google",
			identity: "Chrome"
		},
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
		},
		{	
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
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
	nitobi.browser.IE = (browser == "Explorer");
	nitobi.browser.IE6 = (nitobi.browser.IE && !window.XMLHttpRequest);
	nitobi.browser.IE7 = (nitobi.browser.IE && window.XMLHttpRequest);

	nitobi.browser.MOZ = (browser == "Netscape" || browser == "Firefox" || browser == "Camino");
	nitobi.browser.FF3 = (browser == "Firefox" && parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf("Firefox/")+8, 3)) == 3);
	nitobi.browser.SAFARI = (browser == "Safari");
	nitobi.browser.OPERA = (browser == "Opera");
	nitobi.browser.AIR = (browser == "AIR");
	nitobi.browser.CHROME = (browser == "Chrome");

	if (nitobi.browser.SAFARI)
		nitobi.browser.OPERA = true;
	if (nitobi.browser.AIR)
		nitobi.browser.SAFARI = true;

	nitobi.browser.XHR_ENABLED = nitobi.browser.OPERA || nitobi.browser.SAFARI || nitobi.browser.MOZ || nitobi.browser.IE || nitobi.browser.CHROME;

	// This is a pretty liberal usage of the word unknown - we just don't care about other browsers.
	nitobi.browser.UNKNOWN = !(nitobi.browser.IE || nitobi.browser.MOZ || nitobi.browser.SAFARI || nitobi.browser.CHROME);
};

nitobi.browser.detect();
if (nitobi.browser.IE6)
{
	try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch (e)
	{
		/* works in SP1 and after */
	}	
}