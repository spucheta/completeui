/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.html");

/**
 * @namespace Utilities for manipulating the and inspecting the CSS properties of HTML Documents and
 * Elements.
 * @constructor
 */
nitobi.html.Css = function(){
	
	};
	
nitobi.html.Css.onPrecached = new nitobi.base.Event();
/**
 * Replace one CSS class with another in an <CODE>Element</CODE>'s class list.
 * @param {HTMLElement} domElement the HTML DOM element whose class attribute will be changed
 * @param {String} class1 the name of the class to replace with <CODE>class2</CODE>
 * @param {String} class2 the name of the class that will replace <CODE>class1</CODE> 
 */
nitobi.html.Css.swapClass = function(domElement, class1, class2)
{
	if (domElement.className)
	{
		var reg = new RegExp('(\\s|^)'+class1+'(\\s|$)');
		domElement.className = domElement.className.replace(reg,"$1"+class2+"$2");
	}
};

/**
 * Replace one CSS class with another in an <CODE>Element</CODE>'s class list.  If class1 
 * is not present, then append class2 to the class list.
 * @param {HTMLElement} domElement the HTML DOM element whose class attribute will be changed
 * @param {String} class1 the name of the class to replace with <CODE>class2</CODE>
 * @param {String} class2 the name of the class that will replace <CODE>class1</CODE> 
 */
nitobi.html.Css.replaceOrAppend = function(domElement, class1, class2)
{
	if (nitobi.html.Css.hasClass(domElement,class1))
	{
		nitobi.html.Css.swapClass(domElement,class1,class2);
	}
	else
	{
		nitobi.html.Css.addClass(domElement,class2);
	}
};
/**
 * Returns <CODE>true</CODE> if <CODE>clazz</CODE> is in <CODE>domElement</CODE>'s CSS class list.
 * @param {HTMLElement} domElement the HTML DOM element whose class attribue will be inspected
 * @param {String} clazz the name of the class to look for
 * @type Boolean 
 */
nitobi.html.Css.hasClass = function(domElement, clazz)
{
	if (!clazz || clazz === '') return false;
	return (new RegExp('(\\s|^)'+clazz+'(\\s|$)')).test(domElement.className);
};

/**
 * Adds a CSS class to the end of an HTML DOM element's class list.
 * @param {HTMLElement} domElement the HTML DOM element to alter
 * @param {String} clazz the CSS class to append to <CODE>domElement</CODE>'s class list
 * @param {Boolean} [ignoreCheck] Indicates whether or not to first check if the element already has the class that we are adding. Default is <code>false</code>.
 */
nitobi.html.Css.addClass = function(domElement, clazz, ignoreCheck)
{
	if (ignoreCheck==true || !nitobi.html.Css.hasClass(domElement, clazz))
	{
		domElement.className = domElement.className ? domElement.className + ' ' + clazz : clazz;
	}
};

/**
 * Removes a CSS class from an HTML DOM element's class list.
 * @param {HTMLElement} domElement The HTML DOM element to alter
 * @param {String | Array} clazz The CSS class to remove from <CODE>domElement</CODE>'s class list. It can also be an array of classes that will be removed.
 * @param {Boolean} [ignoreCheck] Indicates whether or not to first check if the element has the class that we are removing. Default is <code>false</code>.
 */
nitobi.html.Css.removeClass = function(domElement, clazz, ignoreCheck)
{
	if (typeof clazz == "array")
		for (var i=0; i<clazz.length; i++)
			this.removeClass(domElement, clazz[i], ignoreCheck);

	if (ignoreCheck==true || nitobi.html.Css.hasClass(domElement,clazz))
	{
		var reg = new RegExp('(\\s|^)'+clazz+'(\\s|$)');
		domElement.className = domElement.className.replace(reg,'$2');
	}
};

/**
 * Adds a CSS rule to the specified stylesheet object.
 * @example
 * var stylesheet = nitobi.html.Css.createStyleSheet();
 * nitobi.html.Css.addRule(stylesheet, ".header", "background-color: blue")
 * @param {StyleSheet} styleSheet The stylesheet object to add the rule to.
 * @param {String} selector The CSS rule selector string such as <code>.myClass</code>.
 * @param {String} style The CSS rule style string such as <code>color:red;border:1px solid black;</code>.
 */
nitobi.html.Css.addRule = function(styleSheet, selector, style)
{
	if (styleSheet.cssRules) {
		var index = styleSheet.insertRule(selector+"{"+(style||"")+"}", styleSheet.cssRules.length);
		return styleSheet.cssRules[index];
	} else {
		// sets style nitobi:placeholder since IE doesnt like the empty steez
		styleSheet.addRule(selector, style||"nitobi:placeholder;");
		return styleSheet.rules[styleSheet.rules.length-1];
	}
}

/**
 * Returns an <CODE>Array</CODE> of CSS rules in the specified stylesheet.
 * @param {StyleSheet|Number} styleSheetIndex The index of the stylesheet for which you want the rules, or a StyleSheet object itself.
 * @type Array
 */
nitobi.html.Css.getRules = function(styleSheetIndex)
{
	var sheet = null;
	if (typeof(styleSheetIndex) == 'number')
	{
		sheet = document.styleSheets[styleSheetIndex];
	}
	else // styleSheetIndex is an actual stylesheet object.
	{
		sheet = styleSheetIndex;
	}
	if (sheet == null) return null;
	// Watch out here - you can't get cross domain CSS in Firefox
	try
	{
		if (sheet.cssRules)
		{
			return sheet.cssRules;
		}
		if (sheet.rules)
		{
			return sheet.rules;
		}
	} catch (e) {/*error is due to cross domain CSS*/}
	return null;
};

/**
 * Returns an Array of CSS style sheets with the given file name.
 * @param {String} sheetName the file name (with no path) of the stylesheet
 * @type Array
 */
nitobi.html.Css.getStyleSheetsByName = function(sheetName)
{
	var arr = new Array();
	var ss = document.styleSheets;
	var regex = new RegExp(sheetName.replace(".","\.")+"($|\\?)");
	
	for (var i = 0; i < ss.length; i++)
	{
		arr = nitobi.html.Css._getStyleSheetsByName(regex, ss[i],arr);
	}
	return arr;
};
/**
 * @ignore
 */
nitobi.html.Css._getStyleSheetsByName = function(regex, sheet, arr)
{
	if (regex.test(sheet.href))
	{
		arr = arr.concat([sheet]);
	}
	var rules = nitobi.html.Css.getRules(sheet);
	// IE6 imports bug - its actually a problem with using imports on dynamic stylesheets
	if (sheet.href != "" && sheet.imports)
	{
		for (var i = 0; i < sheet.imports.length; i++)
		{
			arr = nitobi.html.Css._getStyleSheetsByName(regex,sheet.imports[i],arr);
		}
	}
	else
	{
		for (var i = 0; i < rules.length; i++)
		{
			var s = rules[i].styleSheet;
			if (s)
			{
				arr = nitobi.html.Css._getStyleSheetsByName(regex,s,arr);
			}
		}
	}
	return arr;
};

/**
 * @ignore
 */
nitobi.html.Css.imageCache = {};

/**
 * @ignore
 */
nitobi.html.Css.imageCacheDidNotify = false;

/**
 * @ignore
 */
nitobi.html.Css.trackPrecache = function(imgName)
{
	nitobi.html.Css.precacheArray[imgName] = true;
	var precacheComplete = false;
	for (var i in nitobi.html.Css.precacheArray) { 
		if (!nitobi.html.Css.precacheArray[i])	
			precacheComplete = true;
	}

	if ((!nitobi.html.Css.imageCacheDidNotify) && (!precacheComplete)) {
		nitobi.html.Css.imageCacheDidNotify = true;
		nitobi.html.Css.isPrecaching = false;
		nitobi.html.Css.onPrecached.notify();	
	}

}

/**
 * @ignore
 */
nitobi.html.Css.precacheArray = {};

/**
 * @ignore
 */
nitobi.html.Css.isPrecaching = false;


/**
 * Loads images from a stylesheet.  If no stylesheet is specified, loads every image from every
 * stylesheet in the page.  After an image is pre-cached, the browser will not need to load the 
 * image from the server.
 * @param {StyleSheet} sheet the stylesheet to parse for image names
 */

nitobi.html.Css.precacheImages = function(sheet)
{
	nitobi.html.Css.isPrecaching = true;
	if (!sheet)
	{
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++)
		{
			nitobi.html.Css.precacheImages(ss[i]);
		}
		//this.onPrecached.notify();
		//this.onPrecached.subscribe();
		return;
	}

	var regex = /.*?url\((.*?)\).*?/;
	var rules = nitobi.html.Css.getRules(sheet);
	var url = nitobi.html.Css.getPath(sheet);
	for (var i = 0; i < rules.length; i++)
	{
		var rule = rules[i];
		if (rule.styleSheet)
		{
			nitobi.html.Css.precacheImages(rule.styleSheet);
		}
		else
		{
			var s = rule.style;
			var bgImage = s ? s.backgroundImage : null;
			if (bgImage)
			{

				bgImage = bgImage.replace(regex,'$1');
				bgImage = nitobi.html.Url.normalize(url, bgImage);

				if (!nitobi.html.Css.imageCache[bgImage])
				{
					var image = new Image();
					image.src = bgImage;
					//console.log(bgImage);

					nitobi.html.Css.precacheArray[bgImage] = false;

					// Create a memory leak safe closure that calls the global function
					var closure = nitobi.lang.close({}, nitobi.html.Css.trackPrecache, [bgImage]);	
					image.onload = closure;
					image.onerror = closure;
					image.onabort = closure;

					nitobi.html.Css.imageCache[bgImage] = image;
					try {
					if (image.width > 0) 
						nitobi.html.Css.precacheArray[bgImage] = true;					
					} catch(e) {}
				
				}
			}
		}
	}
	// IE6 imports bug - its actually a problem with using imports on dynamic stylesheets
	if (sheet.href != "" && sheet.imports)
	{
		for (var i = 0; i < sheet.imports.length; i++)
		{
			nitobi.html.Css.precacheImages(sheet.imports[i]);
		}
	}
	
};

/**
 * Returns the normalized path for a given style sheet.
 * @param {StyleSheet} sheet the stylesheet whose URL is sought
 * @type String
 */
nitobi.html.Css.getPath = function(sheet)
{
	var href = sheet.href;
	href = nitobi.html.Url.normalize(href);
	if (sheet.parentStyleSheet && href.indexOf('/') != 0 && href.indexOf('http://') != 0 && href.indexOf('https://') != 0)
	{
		href = nitobi.html.Css.getPath(sheet.parentStyleSheet)+href;
	}
	return href;
};

/**
 * @ignore
 */
nitobi.html.Css.getSheetUrl = nitobi.html.Css.getPath;

/**
 * Returns the <CODE>StyleSheet</CODE> object to which the specified cssClass belongs.
 * @param {String} cssClass The name of the cssClass whose parent sheet you want to find.
 * @type StyleSheet
 */
nitobi.html.Css.findParentStylesheet = function(cssClass)
{
	var rule = nitobi.html.Css.getRule(cssClass);
	if (rule)
	{
		return rule.parentStyleSheet;
	}
	return null;
};

/**
 * @ignore
 */
nitobi.html.Css.findInSheet = function(cssClass, sheet, level)
{
	// IE 6 BUG - http://cs.nerdbank.net/blogs/jmpinline/archive/2006/02/09/151.aspx
	if (nitobi.browser.IE6 && typeof level == "undefined")
		level = 0;
	else if (level > 4)
		return null;
	level++;

	var rules = nitobi.html.Css.getRules(sheet);
	for (var rule = 0; rule < rules.length; rule++) {
		var ruleItem = rules[rule];
		var ss = ruleItem.styleSheet
		var selectorText = ruleItem.selectorText;
		if (ss)
		{
			// Non-IE
			var inImport = nitobi.html.Css.findInSheet(cssClass, ss, level);
			if (inImport)
				return inImport;
		}
		else if (selectorText != null && selectorText.toLowerCase().indexOf(cssClass) > -1) {
			if (nitobi.browser.IE)
			{
				// We create a dummy rule object that includes the parentStyleSheet field.
				// For whatever reason, IE doesn't support this property.
				ruleItem = {
					selectorText: selectorText,
					style: ruleItem.style,
					readOnly: ruleItem.readOnly,
					parentStyleSheet: sheet
				}
			}
			return ruleItem;
		}
	}
	// IE6 imports bug - its actually a problem with using imports on dynamic stylesheets
	var imports = sheet.imports;
	if (sheet.href != "" && imports)
	{
		// IE only
		var importLen = imports.length;
		for (var i = 0; i < importLen; i++)
		{
			var inImport = nitobi.html.Css.findInSheet(cssClass, imports[i], level);
			if (inImport) return inImport;
		}		
	}
	return null;
};

/**
 * Returns the <CODE>Style</CODE> object that has the cssClass as the only selector.  
 * Styles are cached for performance.
 * @param {String} cssClass The name of the class for which the style should be returned.
 * @param {Boolean} ignoreCache Ignore the performance cache and re-obtain the style object.
 * @type Map
 */
nitobi.html.Css.getClass = function(cssClass, ignoreCache)
{
	// TODO: We need to cache this stuff here ... 
	cssClass = cssClass.toLowerCase();
	if (cssClass.indexOf(".") !== 0)
	{
		cssClass = "."+cssClass;
	}
	if (ignoreCache)
	{
		var rule = nitobi.html.Css.getRule(cssClass);
		if (rule != null)
			return rule.style;
	}
	else 
	{
		if (nitobi.html.Css.classCache[cssClass] == null)
		{
			var rule = nitobi.html.Css.getRule(cssClass);
			if (rule != null)
				nitobi.html.Css.classCache[cssClass] = rule.style;
			else 
				return null;
		}
		return nitobi.html.Css.classCache[cssClass];
	}
};

/**
 * This hash is used to keep track of already found classes in CSS
 * @private
 */
nitobi.html.Css.classCache = {};

/**
 * @ignore
 * @private
 */
nitobi.html.Css.getStyleBySelector = function(sSelector)
{
	var rule = nitobi.html.Css.getRule(sSelector);
	if (rule != null)
		return rule.style;
	return null;
}

/**
 * Returns the <CODE>Rule</CODE> object that has the cssClass as the only selector.
 * @param {String} cssClass The name of the class for which the style should be returned.
 * @type CSSStyleRule
 */
nitobi.html.Css.getRule = function(cssClass)
{
	cssClass = cssClass.toLowerCase();
	if (cssClass.indexOf(".") !== 0)
		cssClass = "."+cssClass;
	var stylesheets = document.styleSheets;
	for (var ss = 0; ss < stylesheets.length; ss++) {
		try
		{
			var inSheet = nitobi.html.Css.findInSheet(cssClass,stylesheets[ss]);
			if (inSheet) return inSheet;
		}
		catch(err)
		{
			// Fall through. Might just be permissions error.
		}
	}
	return null;
}

/**
 * Returns the value for the specified style of the CSS class selector where the selector is the specified class name.
 * The following would return the value of "red":
 * @example
 * &lt;style&gt;.myClass {color:red;}&lt;/style&gt;
 * &lt;script&gt;nitobi.html.Css.getClassStyle("myClass","color");&lt;/script&gt;
 * @param {String} cssClassName The name of the class used in the CSS selector.
 * @param {String} style The name of the style property to return.
 * @type String
 */
nitobi.html.Css.getClassStyle = function(cssClassName, style)
{
	var cssClass = nitobi.html.Css.getClass(cssClassName);
	if (cssClass != null)
		return cssClass[style];
	else
		return null;
}

/**
 * Sets the value of a particular style property. The style rule
 * is written in the CSS syntax, e.g., background-color instead of
 * backgroundColor.
 * @param {HTMLElement} el The element on which to set the style.
 * @param {String} rule The css rule to change.
 * @param {String} value The value to change the style to.
 */ 
nitobi.html.Css.setStyle = function (el, rule, value)
{
	rule = rule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
	el.style[rule] = value;
}

/**
 * Gets the value of the specified element and style property.
 * @param {HTMLElement} oElem The HTML element one wants the style value for.
 * @param {String} sCssRule The style property one wants the value for.
 * @type String
 */
nitobi.html.Css.getStyle = function (oElm, sCssRule){
    var strValue = "";
    if(document.defaultView && document.defaultView.getComputedStyle)
    {
    	// This is for MOZ.
    	// Put the dashes in if there are capital letters.
    	sCssRule = sCssRule.replace(/([A-Z])/g, function ($1){
            return "-" + $1.toLowerCase();
        });
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(sCssRule);
    }
    else if(oElm.currentStyle){
        sCssRule = sCssRule.replace(/\-(\w)/g, function (strMatch, p1){
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[sCssRule];
    }
    return strValue;
};

/*

nitobi.dom.getStyle = function (oElm, strCssRule)
{
    var strValue = "";
	if (oElm.style[strCssRule])
	{
		// inline style property
		return oElm.style[strCssRule];
	}
	else if (oElm.currentStyle)
	{
		// external stylesheet for Explorer
        strCssRule = strCssRule.replace(/([A-Z])/g, "-$1");
        strValue = oElm.currentStyle[strCssRule];
	}
	else if(document.defaultView && document.defaultView.getComputedStyle)
    {
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    if (strValue == 'auto' && console != null)
    	console.log(strCssRule + ' is auto on ' + oElm);
    return strValue;
}
 */

/**
 * Sets the opacity of an Array of elements using {@link nitobi.html.Css#setOpacity}
 * @param {Array} elements the HTML elements to change the opacity of
 * @param {Number} opacity the new opacity for these elements (0-100) 
 */

nitobi.html.Css.setOpacities = function(elements,opacity)
{
	if (elements.length)
	{
		for (var i=0;i<elements.length;i++)
		{
			nitobi.html.Css.setOpacity(elements[i],opacity);
		}
	}
	else
	{
		nitobi.html.Css.setOpacity(elements,opacity);
	}
}

/**
 * Sets the opacity of an element.
 * @param {HTMLElement} element The element on which to set the opacity.
 * @param {Number} opacity The opacity, 0 - 100;
 */
nitobi.html.Css.setOpacity = function(element, opacity)
{
    var s = element.style;
    if (opacity > 100)
    {
    	opacity = 100;
    }
    if (opacity < 0)
    {
    	opacity = 0;
    }
    if (s.filter != null)
    {
    	var match = s.filter.match(/alpha\(opacity=[\d\.]*?\)/ig);
    	if (match != null && match.length > 0)
    	{
			s.filter = s.filter.replace(/alpha\(opacity=[\d\.]*?\)/ig,"alpha(opacity=" + opacity + ")");
    	}
    	else
    	{
    		s.filter += "alpha(opacity=" + opacity + ")";
    	}
    }
    else
    {
		s.opacity = (opacity / 100);
    }
}

/**
 * Gets the opacity (0-100) of an element. This depends on the element having both a 
 * Mozilla and IE6 opacity set.
 * @param {HTMLElement} element the element to inspect
 * @type Number
 */
nitobi.html.Css.getOpacity = function(element)
{
	if (element == null)
	{
		nitobi.lang.throwError(nitobi.error.ArgExpected + " for nitobi.html.Css.getOpacity");
	}
	if (nitobi.browser.IE)
	{
		if (element.style.filter=="") return 100;
		var s = element.style.filter;
		s.match(/opacity=([\d\.]*?)\)/ig);
		if (RegExp.$1 == "") return 100;
		return parseInt(RegExp.$1);
	}
	else
	{
		return Math.abs(element.style.opacity ? element.style.opacity * 100 : 100);
	}
}

/**
 * @ignore
 * @private
 */
nitobi.html.Css.getCustomStyle = function(className, style)
{
	if (nitobi.browser.IE)
	{
		return nitobi.html.getClassStyle(className, style);
	}
	else
	{
		// Do a replace on <!--nitobi.grid.xslProcessorName--> and merge the contents
		// The second block does this for escaped XSL
		var rule = nitobi.html.Css.getRule(className);
		var re = new RegExp('(.*?)(\{)(.*?\)(\})', 'gi');
		var matches = rule.cssText.match(re);
	
		re = new RegExp('('+style+')(\:)(.*?\)(\;)', 'gi');
		matches = re.exec(RegExp.$3);
	
	/*
		nitobi.temp.xsl2 = "";
		if (exprMatches != null)
		{
			for (var i=0; i&lt;exprMatches.length; i++)
			{
				var incl = exprMatches[i].replace("&lt;!--","").replace("--&gt;","");
				// Get the imported stylesheet and remove the outer stylesheet element
				try {
					nitobi.temp.xsl2 = eval(incl).stylesheet.xml;
				} catch(e) {
					continue;
				}
				nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;xsl:stylesheet.*?\&gt;/g,'');
				nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;\/xsl:stylesheet\&gt;/g,'');
	
				nitobi.temp.xsl1 = nitobi.temp.xsl1.replace('&lt;!--'+incl+'--&gt;', nitobi.temp.xsl2);
			}
		}
		*/
	}
}

nitobi.html.Css.createStyleSheet = function(cssText)
{
	var ss;
	if (nitobi.browser.IE)
	{
		ss = document.createStyleSheet();
	}
	else
	{
		ss = document.createElement('style');
		ss.setAttribute("type", "text/css");
		document.body.appendChild(ss);
		ss.appendChild(document.createTextNode(""));
	}
	if (cssText != null)
		nitobi.html.Css.setStyleSheetValue(ss, cssText);
	return ss;
}

nitobi.html.Css.setStyleSheetValue = function(ss, cssText)
{
	if (nitobi.browser.IE)
		ss.cssText = cssText;
	else		
		ss.replaceChild(document.createTextNode(cssText), ss.firstChild);
	return ss;
}

if (nitobi.browser.MOZ)
{
	/**
	 * @private
	 * @ignore
	 */	
	HTMLStyleElement.prototype.__defineSetter__("cssText", function (param) {this.innerHTML = param;});

	/**
	 * @private
	 * @ignore
	 */
	HTMLStyleElement.prototype.__defineGetter__("cssText", function () {return this.innerHTML;});
}