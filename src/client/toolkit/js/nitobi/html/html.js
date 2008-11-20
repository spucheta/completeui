/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.html");

// This is required for namespace docs.
if (false)
{
	/**
	 * @namespace This namespace contains methods and classes having to do with HTML DOM modification and
	 * inspection.
	 * @constructor
	 */
	nitobi.html = function(){};
}

/**
 * Creates a new HTML element with the specified tag name, attributes and styles.
 * @param {String} tagName The name of the element to create such as "div" or "span".
 * @param {Map} attrs A hash of name/value pairs of attributes to set such as {"id":"myDiv","class":"myClass"}.
 * @param {Map} styles A hash of name/value pair of styles to set such as {"color":"red"}.
 * @type HTMLElement
 */
nitobi.html.createElement = function(tagName, attrs, styles)
{
	var elem = document.createElement(tagName);
	for (var attr in attrs)
	{
		if (attr.toLowerCase().substring(0,5) == "class")
			elem.className = attrs[attr];
		else
			elem.setAttribute(attr, attrs[attr]);
	}
	for (var style in styles)
	{
		elem.style[style] = styles[style];
	}
	return elem;
}

/**
 * Returns an HTML table element with a single cell.
 * @param {Map} attrs A hash of name/value pairs of attributes to set such as {"id":"myDiv","class":"myClass"}.
 * @param {Map} styles A hash of name/value pair of styles to set such as {"color":"red"}.
 * @type HTMLElement
 */
nitobi.html.createTable = function(attrs, styles)
{
	// TODO: could also pass in the number of cols / rows and use the proper table DOM methods to add rows / cols
	var table = nitobi.html.createElement("table", attrs, styles);
	var tablebody = document.createElement("tbody");
	var tabletr = document.createElement("tr");
	var tabletd = document.createElement("td");
	table.appendChild(tablebody);
	tablebody.appendChild(tabletr);
	tabletr.appendChild(tabletd);
	return table;	
}



/**
 * Sets the background image of a DIV when the image is a transparent PNG.
 * @param {HTMLElement} elem The HTML element to set the background on.
 * @param {String} src The path to the image.
 */
nitobi.html.setBgImage = function(elem, src) {
	var s = nitobi.html.Css.getStyle(elem, "background-image");
	if (s != "" && nitobi.browser.IE) {
		s = s.replace(/(^url\(")(.*?)("\))/,"$2");
//		elem.style.backgroundImage = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+src+"', sizingMethod='crop');";
	}
}

/**
 * Adjusts the <code>child</code> element to have the same width as the <code>parent</code> element
 * taking into account the browser doctype as well as any borders or padding.
 * @param {HTMLElement} parent The element that the <code>child</code> element width should fill.
 * @param {HTMLElement} child The element that should have the width changed on to fit inside the <code>parent</code> element.
 */
nitobi.html.fitWidth = function(parent, child) 
{
	var w;
	var C = nitobi.html.Css;
	if (nitobi.browser.IE && !nitobi.lang.isStandards())
		w = (parseInt(C.getStyle(parent, "width")) - parseInt(C.getStyle(parent, "paddingLeft")) - parseInt(C.getStyle(parent, "paddingRight")) - parseInt(C.getStyle(parent, "borderLeftWidth")) - parseInt(C.getStyle(parent, "borderRightWidth"))) + "px";
	else if (nitobi.lang.isStandards())
		w = (parseInt(C.getStyle(parent, "width")) - (child.offsetWidth - parseInt(C.getStyle(child, "width")))) + "px";
	else
		w = parseInt(C.getStyle(parent, "width")) + "px";
	child.style.width = w;
}

/**
 * @private
 */
nitobi.html.getDomNodeByPath = function (Node,Path)
{
	// This function traverses the DOM tree based on a Path comprised of ordinal indexes delimited by slash ( / ) characters
	// Example : Path = "0/1/0/5" - This would return the sixth child (5+1  because its zero based) or the first child or the second child of the first child of the parent node. 
	if (nitobi.browser.IE) {
//		Path="/"+Path;
	}
	var curNode = Node;
//	Path=Path.substr(Path.indexOf("/")+1);
	var subPaths=Path.split("/");
	var len = subPaths.length;
	for (var i=0; i<len; i++) {
//	if (nitobi.browser.IE) {
		if (curNode.childNodes[Number(subPaths[i])]!=null) {
			curNode = curNode.childNodes[Number(subPaths[i])];
		} else {
			alert("Path expression failed." + Path);
		}
		var s="";
	}
	return curNode;
}

/**
 * Returns the index of the child node in the parent collection. -1 if not found.
 * @type Number
 * @param {HTMLElement} parent The parent to search through.
 * @param {HTMLElement} child The child whose index you want to find.
 */
nitobi.html.indexOfChildNode = function(parent,child)
{
	var childNodes = parent.childNodes;
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
 * Recursively evaluates all script blocks in the node.  All script blocks in the node
 * and the nodes children are evaluated.
 * @param {HTMLElement} node The node containing script blocks.
 */
nitobi.html.evalScriptBlocks = function(node)
{
	for (var i =0; i < node.childNodes.length; i++)
	{
		var childNode = node.childNodes[i];
		if (childNode.nodeName.toLowerCase() == "script")	
		{
			eval(childNode.text);
		}
		else
		{
			nitobi.html.evalScriptBlocks(childNode);			
		}
	}
}

/**
 * Positions this node relatively if it has no set position.
 * @param {HTMLElement} node 
 */
nitobi.html.position = function(node)
{
	var pos = nitobi.html.getStyle($(node), 'position');
	if ( pos == 'static' ) node.style.position = 'relative';
};

/**
 * Sets the opacity of an element. 
 * @deprecated Use nitobi.html.Css.setOpacity instead.
 * @param {Element} element The element on which to set the opacity.
 * @param {int} opacity The opacity, 0 - 100;
 */
nitobi.html.setOpacity = function(element,opacity)
{
    var objectStyle = element.style;
    objectStyle.opacity = (opacity / 100);
    objectStyle.MozOpacity = (opacity / 100);
    objectStyle.KhtmlOpacity = (opacity / 100);
    objectStyle.filter = "alpha(opacity=" + opacity + ")";	
}

/**
 * @private
 */
nitobi.html.highlight = function(o,x,end)
{
	end = end || o.value.length;
	if(o.createTextRange)
	{
		// Make sure the object has the focus, otherwise you select the whole page.
		o.focus();
		// Create the text range based off the original object so as to avoid weird IE browser window shift bugs.
		var r=o.createTextRange();
		r.move("character",0-end);
		r.move("character",x);
		r.moveEnd("textedit",1);
		r.select();
	}else if(o.setSelectionRange){
		o.focus();
		o.setSelectionRange(x,end);
	}
}

/**
 * @private
 */
nitobi.html.setCursor = function(o,x)
{
	if(o.createTextRange)
	{
		// Make sure the object has the focus, otherwise you select the whole page.
		o.focus();
		// Create the text range based off the original object so as to avoid weird IE browser window shift bugs.
		var r=o.createTextRange();
		r.move("character",0-o.value.length);
		r.move("character",x);
		r.select();
	}else if(o.setSelectionRange){
		o.setSelectionRange(x,x);
	}
}

/**
 * @ignore
 */
nitobi.html.getCursor = function(o)
{
	if(o.createTextRange)
	{
		// Make sure the object has the focus, otherwise you select the whole page.
		o.focus();
		var r=document.selection.createRange().duplicate();
//		r.moveStart("textedit",-1);
//		return r.text.length;
// above doesn't work when user types too quickly; never
// figured why though... anyway, below works

// 2005.04.26
// first one doesn't work well in textareas; second one
// seems to work well w/ textboxes and textareas
//		r.moveEnd("textedit",1);
//		r.move("textedit",1);
// 2005.04.26b
// ARGG! only moveEnd works so that the typeahead bug doesn't
// come up -- TODO: investigate!
		r.moveEnd("textedit",1);

		return o.value.length - r.text.length;
	}else if(o.setSelectionRange){
		return o.selectionStart;
	}
	return -1;
}

/**
 * @private
 */
nitobi.html.encode = function(str)
{
	str += "";
	str = str.replace(/&/g,"&amp;");
	str = str.replace(/\"/g,"&quot;");
	str = str.replace(/'/g,"&apos;");
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	str = str.replace(/\n/g,"<br>");
	return str;
}

/**
 * Returns a DOM element from either a DOM element or an element ID.
 * @para {Object} element The element can be either a DOM element or an element ID.
 * @type HTMLElement
 */
nitobi.html.getElement = function(element)
{
	if (typeof(element) == "string")
		return document.getElementById(element);
	return element;
};

if (typeof($) == "undefined")
{
	/**
	 * Returns a DOM element from either a DOM element or an element ID.  A shorthand for this function
	 * is the dollar sign ($).  IE: <code>nitobi.html.getElement('myId') == $('myId')
	 * @param {Object} element The element can be either a DOM element or an element ID.
	 * @type HTMLElement
	 */
	$ = nitobi.html.getElement;
}

if (typeof($F) == "undefined")
{
	/**
	 * Returns the value of a form field.
	 * @param {String} id The ID of the DOM form element for which the value is wanted.
	 * @type {String}
	 */
	$F = function(id)
	{
		var field = $(id);
		if (field != null)
			return field.value;
		return "";
	}
}

/**
 * Return the tagname with the namespace prefix, if it has one.
 * @param {HTMLElement} elem The HTML element.
 * @type String
 */
nitobi.html.getTagName = function(elem)
{
	if (nitobi.browser.IE && elem.scopeName != "")
	{
		return (elem.scopeName + ":" + elem.nodeName).toLowerCase();
	}
	else
	{
		return elem.nodeName.toLowerCase();
	}
}

/**
 * Returns the style top of an element as a number. 	 is the top
 * specified on the style.  If none has been specified, zero is returned.
 * @param {HTMLElement} elem the element to inspect
 * @type Number
 */
nitobi.html.getStyleTop = function(elem)
{
	var top = elem.style.top; 
	if (top == "")
		top = nitobi.html.Css.getStyle(elem, "top");
	return nitobi.lang.parseNumber(top);
}

/**
 * Returns the style left of an element as a number. This is the left
 * specified on the style.  If none has been specified, zero is returned.
 * @param {HTMLElement} elem the element to inspect
 * @type Number
 */
nitobi.html.getStyleLeft = function(elem)
{
	var left = elem.style.left; 
	if (left == "")
		left = nitobi.html.Css.getStyle(elem, "left");
	return nitobi.lang.parseNumber(left);
}

/**
 * Returns the offsetHeight of an element in pixels.
 * @param {HTMLElement} elem the element to inspect
 * @type Number
 */
nitobi.html.getHeight = function(elem)
{
	// used to use getBoundingClientRect but that is slow
	return elem.offsetHeight;
}

/**
 * Returns the offsetWidth of an element in pixels.
 * @param {HTMLElement} elem the element to inspect
 * @type Number
 */
nitobi.html.getWidth = function(elem)
{
	// used to use getBoundingClientRect but that is slow
	return elem.offsetWidth;
}

if (nitobi.browser.IE)
{
	/**
	 * Returns an associative array containing position and dimensions of the box for the specified element. 
	 * Returns the box struct that includes the top, left, bottom, right, height and width properties as numbers.
	 * Note: in mozilla, this only work if the box-model is set to border.
	 * @param {HTMLElement} elem The element for which you want a box.
	 * @type {Object}
	 */
	nitobi.html.getBox = function(elem)
	{
		var borderTop = nitobi.lang.parseNumber(nitobi.html.getStyle(document.body,"border-top-width"));
		var borderLeft = nitobi.lang.parseNumber(nitobi.html.getStyle(document.body,"border-left-width"));
		var fixTop = nitobi.lang.parseNumber(document.body.scrollTop) - (borderTop == 0 ? 2 : borderTop);
		var fixLeft = nitobi.lang.parseNumber(document.body.scrollLeft) - (borderLeft == 0 ? 2 : borderLeft);
		var rect = nitobi.html.getBoundingClientRect(elem);
		return {top: rect.top + fixTop , 
				left: rect.left + fixLeft , 
				bottom: rect.bottom, 
				right: rect.right,
				height: rect.bottom - rect.top,
				width: rect.right - rect.left};	
	}
}
else if	(nitobi.browser.MOZ)
{
	/**
	 * @ignore
	 */
	nitobi.html.getBox = function(elem)
	{
		var fixTop = 0;
		var fixLeft = 0;
		var parent = elem.parentNode;
		while (parent.nodeType == 1  && parent != document.body)
		{
			//if (nitobi.html.getBox.cache[parent] == null || true)
			//{
				fixTop += nitobi.lang.parseNumber(parent.scrollTop) 
							- (nitobi.html.getStyle(parent,"overflow") == "auto" ? nitobi.lang.parseNumber(nitobi.html.getStyle(parent,"border-top-width")) :0);
				fixLeft += nitobi.lang.parseNumber(parent.scrollLeft) 
							 - (nitobi.html.getStyle(parent,"overflow") == "auto" ? nitobi.lang.parseNumber(nitobi.html.getStyle(parent,"border-left-width")) :0);
				
			// This caching needs work.
			/*	nitobi.html.getBox.cache[parent] = {};
				nitobi.html.getBox.cache[parent].left = fixLeft;
				nitobi.html.getBox.cache[parent].top = fixTop;
			}
			else
			{
				// Cache hit
				fixTop += nitobi.html.getBox.cache[parent].top;
				fixLeft += nitobi.html.getBox.cache[parent].left;
				break;
			}*/
			parent = parent.parentNode;
		}
		
		var mozBox = elem.ownerDocument.getBoxObjectFor(elem);
		var borderLeft = nitobi.lang.parseNumber(nitobi.html.getStyle(elem,"border-left-width"))
		var borderRight = nitobi.lang.parseNumber(nitobi.html.getStyle(elem,"border-right-width"))
		var borderTop = nitobi.lang.parseNumber(nitobi.html.getStyle(elem,"border-top-width"))
		var top = nitobi.lang.parseNumber(mozBox.y)  - fixTop - borderTop;
		var left = nitobi.lang.parseNumber(mozBox.x) - fixLeft - borderLeft;
		var right = left + nitobi.lang.parseNumber(mozBox.width); 
		var bottom = top + mozBox.height;
		var height = nitobi.lang.parseNumber(mozBox.height);
		var width = nitobi.lang.parseNumber(mozBox.width);

		return {top: top, 
				left: left, 
				bottom: bottom, 
				right: right,
				height: height,
				width: width};	
	}
	nitobi.html.getBox.cache = {};
}
else if (nitobi.browser.SAFARI || nitobi.browser.CHROME)
{
	/**
	 * @ignore
	 */
	nitobi.html.getBox = function(elem)
	{
		var coords = nitobi.html.getCoords(elem);
		return {top: coords.y, 
				left: coords.x, 
				bottom: coords.y+coords.height, 
				right: coords.x+coords.width,
				height: coords.height,
				width: coords.width};
	}
}


// Used for combo box.
nitobi.html.getBox2 = nitobi.html.getBox;

/**
 * Gets the element unique ID and creates one if it does not already exist.
 * @param {HTMLElement} elem The element from which we want the unique ID.
 * @type Number
 */
nitobi.html.getUniqueId = function(elem)
{
	if (elem.uniqueID)
	{
		return elem.uniqueID;
	}
	else
	{
		var t = (new Date()).getTime();
		// The element should remember the unique id since it is assigned once and based on time.
		elem.uniqueID = t;
		return t;
	}
}

/**
 * Gets a child element of the current element with the specified ID.
 * @param {HTMLElement} elem The element from which to start searching.
 * @param {String} childId The ID of the child element being searched for.
 * @param {Boolean} deepSearch Searches more than one level of depth.
 * @type HTMLElement
 */
nitobi.html.getChildNodeById = function(elem, childId, deepSearch)
{
	return nitobi.html.getChildNodeByAttribute(elem,"id",childId,deepSearch);
}

/**
 * Gets a child element of the current element with the specified attribute name and value.
 * @param {HTMLElement} elem The element from which to start searching.
 * @param {String} attName The name of the child element attribute searched for.
 * @param {String} attValue The value of the child element attribute searched for.
 * @param {Boolean} deepSearch Searches more than one level of depth.
 * @type HTMLElement
 */
nitobi.html.getChildNodeByAttribute = function(elem,attName,attValue,deepSearch)
{
	for (var i=0;i<elem.childNodes.length;i++)
	{
		if (elem.nodeType != 3 && Boolean(elem.childNodes[i].getAttribute))
		{
			 if (elem.childNodes[i].getAttribute(attName) == attValue)
			 {
				return elem.childNodes[i];
			 }
		}
	}
	
	if (deepSearch)
	{
		for (var i=0;i<elem.childNodes.length;i++)
		{
			var child = nitobi.html.getChildNodeByAttribute(elem.childNodes[i],attName,attValue,deepSearch);
			if (child != null) return child;
		}
	}
	return null;
}

/**
 * Gets the parent element of specified element where the element ID is equal to that specified.
 * @param {HTMLElement} elem The element from which the parent element should be searched for.
 * @param {String} parentId The ID of the parent element that is being searched for.
 * @type HTMLElement
 */
nitobi.html.getParentNodeById = function(elem,parentId)
{
	return nitobi.html.getParentNodeByAtt(elem,"id",parentId);
}

/**
 * Gets the parent element of specified element where the element ID is equal to that specified.
 * @param {HTMLElement} elem The element from which the parent element should be searched for.
 * @param {String} att The name of the attribute.
 * @param {String} value The value of the attribute of the parent element that is being searched for.
 * @type HTMLElement
 */
nitobi.html.getParentNodeByAtt = function(elem,att,value)
{
	while(elem.parentNode != null)
	{
		if (elem.parentNode.getAttribute(att) == value)
		{
			return elem.parentNode;
		}
		elem = elem.parentNode;
	}	
	return null;
}

if (nitobi.browser.IE)
{
	/**
	 * Gets the first child element that is of type HTMLElement since Firefox also considers whitespace and other nodes in the native firstChild property.
	 * @param {HTMLElement} node The element for which the first child is requested.
	 * @type HTMLElement
	 */
	nitobi.html.getFirstChild = function(node)
	{
		return node.firstChild;
	}
}
else
{
	/**
	 * @ignore
	 */
	nitobi.html.getFirstChild = function(node)
	{
		var i = 0;
		while (i < node.childNodes.length && node.childNodes[i].nodeType == 3)
			i++;
		return node.childNodes[i];
	}
}

/**
 * Gets the scroll positions of the current document and returns a struct like {"left":0,"top":0}.
 * @type Map
 */
nitobi.html.getScroll = function()
{
	var ResultScrollTop, ResultScrollLeft = 0;
	//console.log(document.documentElement.clientHeight);
	if ((nitobi.browser.OPERA == false) && (document.documentElement.scrollTop > 0)) {
		ResultScrollTop = document.documentElement.scrollTop;
		ResultScrollLeft = document.documentElement.scrollLeft;	
	} else {
		ResultScrollTop = document.body.scrollTop;
		ResultScrollLeft = document.body.scrollLeft;
	}

	if (((ResultScrollTop == 0) && (document.documentElement.scrollTop > 0)) ||  ((ResultScrollLeft == 0) && (document.documentElement.scrollLeft > 0))){
		ResultScrollTop = document.documentElement.scrollTop;
		ResultScrollLeft = document.documentElement.scrollLeft;
	}

	return {"left":ResultScrollLeft,"top":ResultScrollTop}
}

/**
 * Returns an associative array containing position and dimensions of the box for the specified element.
 * The return value is a struct with the following structure {x:0,y:0,height:0,width:0}. 
 * @param {HTMLElement} elem The element for which you want a box.
 * @type Map
 */
nitobi.html.getCoords = function(element)
{
   var ew, eh;
   try {
       var originalElement = element;
       ew = element.offsetWidth;
       eh = element.offsetHeight;
       for (var lx=0,ly=0;element!=null;
           lx+=element.offsetLeft,ly+=element.offsetTop,element=element.offsetParent);
       for (;originalElement!=document.body;
           lx-=originalElement.scrollLeft,ly-=originalElement.scrollTop,originalElement=originalElement.parentNode);
   } catch(e) {}
   return {"x":lx,"y":ly,"height":eh,"width":ew}
};

/**
 * The cached scroll bar width.
 * @type Number
 * @private
 */
nitobi.html.scrollBarWidth = 0;
/**
 * Returns the width of a vertical scroll bar on the client's screen.  This measurement is 
 * variable depending on the platform, browser, and window theme.  This value will only be calculated once.
 * Thereafter, the cached version will be returned.
 * @param {HTMLElement} container a container to use for the temporary DOM structure (optional)
 * @type Number
 */
nitobi.html.getScrollBarWidth = function(container)
{
	if (nitobi.html.scrollBarWidth) return nitobi.html.scrollBarWidth;
	try{
		if (null==container)
		{
			var divId = "ntb-scrollbar-width";
			var d = document.getElementById(divId);

			if (null == d)
			{
				d = nitobi.html.createElement("div",{"id":divId},{width:"100px",height:"100px",overflow:"auto",position:"absolute",top:"-200px",left:"-5000px"});
				d.innerHTML = "<div style='height:200px;'></div>";
				document.body.appendChild(d);
			}
			container = d;
//			return(Math.abs(this.GetScrollBarWidth(d)));
		}
		if (nitobi.browser.IE)
		{
			nitobi.html.scrollBarWidth = Math.abs(container.offsetWidth - container.clientWidth - (container.clientLeft ? container.clientLeft * 2 : 0));
		}
		else if (nitobi.browser.MOZ)
		{
			var b = document.getBoxObjectFor(container);
			nitobi.html.scrollBarWidth = Math.abs((b.width - container.clientWidth));
		}
		else if (nitobi.browser.SAFARI || nitobi.browser.CHROME)
		{
			var b = nitobi.html.getBox(container);
			nitobi.html.scrollBarWidth = Math.abs((b.width - container.clientWidth));
		}
	}catch(err){
		//TODO: Error reporting here.	
	}
	return nitobi.html.scrollBarWidth;
};
/**
 * @ignore
 * @private
 */
nitobi.html.align = nitobi.drawing.align;

/**
 * @ignore
 * @private
 */
nitobi.html.emptyElements = {
	HR: true, BR: true, IMG: true, INPUT: true
};

/**
 * @ignore
 * @private
 */
nitobi.html.specialElements = {
	TEXTAREA: true
};

/**
 * @ignore
 * @private
 */
nitobi.html.permHeight = 0;
/**
 * @ignore
 * @private
 */
nitobi.html.permWidth = 0;	

/**
 * Returns a collection containing scrollbar and client dimension details.
 * @type Map
 */
nitobi.html.getBodyArea = function()
{
	var scrollLeft,scrollTop,clientWidth,clientHeight;
	var x,y;
	var strict = false;

	if (nitobi.lang.isStandards()) {strict = true;}
	
	var de = document.documentElement;
	var db = document.body;
	if (self.innerHeight) // all except Explorer 
	{
		x = self.innerWidth;
		y = self.innerHeight;
	}
	else if (de && de.clientHeight)
		// Explorer 6 Strict Mode
	{
		x = de.clientWidth;
		y = de.clientHeight;
	}
	else if (db) // other Explorers
	{
		x = db.clientWidth;
		y = db.clientHeight;
	}
	clientWidth = x; clientHeight = y;

	if (self.pageYOffset) // all except Explorer
	{
		x = self.pageXOffset;
		y = self.pageYOffset;
	}
	else if (de && de.scrollTop)
		// Explorer 6 Strict
	{
		x = de.scrollLeft;
		y = de.scrollTop;
	}
	else if (db) // all other Explorers
	{
		x = db.scrollLeft;
		y = db.scrollTop;
	}	
	scrollLeft = x; scrollTop = y;

	var test1 = db.scrollHeight;
	var test2 = db.offsetHeight
	if (test1 > test2) // all but Explorer Mac
	{
		x = db.scrollWidth;
		y = db.scrollHeight;
	}
	else // Explorer Mac;
	     //would also work in Explorer 6 Strict, Mozilla and Safari
	{
		x = db.offsetWidth;
		y = db.offsetHeight;
	}	
	nitobi.html.permHeight = y; nitobi.html.permWidth = x;
	
	if (nitobi.html.permHeight < clientHeight) {
		nitobi.html.permHeight = clientHeight;
		if (nitobi.browser.IE && strict) {
			clientWidth += 20;
		}
	}
	
	if (clientWidth < nitobi.html.permWidth) {
		clientWidth = nitobi.html.permWidth;
	}
	
	if (nitobi.html.permHeight > clientHeight) {
		
		clientWidth += 20;
	}
	
	var scrollHeight, scrollWidth;
	scrollHeight = de.scrollHeight;
	scrollWidth = de.scrollWidth;
	

	return {scrollWidth:scrollWidth, scrollHeight:scrollHeight, scrollLeft:scrollLeft, scrollTop:scrollTop, clientWidth:clientWidth, clientHeight:clientHeight, bodyWidth:nitobi.html.permWidth, bodyHeight:nitobi.html.PermHeight}
}

/**
 * Gets the outer HTML for the node as per Internet Explorers outerHTML element property.
 * Note: Comment nodes are ignored.
 * @param {HTMLElement} node The element what one wants the outer HTML of.
 * @type String
 */
nitobi.html.getOuterHtml = function (node) 
{
	if (nitobi.browser.IE)
		return node.outerHTML;
	else
	{
		var html = '';
		  switch (node.nodeType) {
		case Node.ELEMENT_NODE:
		html += '<';
		html += node.nodeName.toLowerCase();
		if (!nitobi.html.specialElements[node.nodeName]) {
	      for (var a = 0; a < node.attributes.length; a++)
	        {
	        	if (node.attributes[a].nodeName.toLowerCase() != "_moz-userdefined")
	        	{
		          html += ' ' + node.attributes[a].nodeName.toLowerCase() +
		                  '="' + node.attributes[a].nodeValue + '"';
	            }
         	}
	        html += '>'; 
	        if (!nitobi.html.emptyElements[node.nodeName]) {
	          html += node.innerHTML;
	          html += '<\/' + node.nodeName.toLowerCase() + '>';
	        }
	      }
	      else switch (node.nodeName) {
	        case 'TEXTAREA':
	          for (var a = 0; a < node.attributes.length; a++)
	            if (node.attributes[a].nodeName.toLowerCase() != 'value')
	              html += ' ' + node.attributes[a].nodeName.toUpperCase() +
	                      '="' + node.attributes[a].nodeValue + '"';
	            else 
	              var content = node.attributes[a].nodeValue;
	          html += '>'; 
	          html += content;
	          html += '<\/' + node.nodeName + '>';
	          break; 
	      }
	      break;
	    case Node.TEXT_NODE:
	      html += node.nodeValue;
	      break;
	    case Node.COMMENT_NODE:
	      html += '<!' + '--' + node.nodeValue + '--' + '>';
	      break;
	  }
	  return html;
	}
}

/**
 * @private
 * @ignore
 */
nitobi.html.insertAdjacentText = function(sibling, pos, s)
{
	if (nitobi.browser.IE)
		return sibling.insertAdjacentText(pos,s);

	var node = document.createTextNode(s)
	nitobi.html.insertAdjacentElement(sibling,pos,node)
}

/**
 * @private
 * @ignore
 */
nitobi.html.insertAdjacentHTML = function(oNode, sWhere, sHTML, workaround)
{
	if (nitobi.browser.IE)
		return oNode.insertAdjacentHTML(sWhere, sHTML, workaround);

	var df;
	var r=oNode.ownerDocument.createRange();
	switch(String(sWhere).toLowerCase()) {
		case "beforebegin":
			r.setStartBefore(oNode);
			df = r.createContextualFragment(sHTML);
			oNode.parentNode.insertBefore(df, oNode);
			break;
		case "afterbegin":
			r.selectNodeContents(oNode);
			r.collapse(true);
			df = r.createContextualFragment(sHTML);
			oNode.insertBefore(df, oNode.firstChild);
			break;
		case "beforeend":
			// workaround==true:
			// we lose parsing feature of createContextualFragment but this seems
			// to fix the visual bug that occurs when the original code is used
			if(workaround==true){
				oNode.innerHTML = oNode.innerHTML + sHTML;
			} else {
				r.selectNodeContents(oNode);
				r.collapse(false);
				df = r.createContextualFragment(sHTML);
				oNode.appendChild(df);
			}
			break;
		case "afterend":
			r.setStartAfter(oNode);
			df = r.createContextualFragment(sHTML);
			oNode.parentNode.insertBefore(df, oNode.nextSibling);
			break;
	}
}

/**
 * @ignore
 * @private
 */
nitobi.html.insertAdjacentElement = function(sibling,pos,node)
{
	if (nitobi.browser.IE)
		return sibling.insertAdjacentElement(pos,node);

	switch (pos)
	{
		case "beforeBegin":
			sibling.parentNode.insertBefore(node,sibling)
			break;
		case "afterBegin":
			sibling.insertBefore(node,sibling.firstChild);
			break;
		case "beforeEnd":
			sibling.appendChild(node);
			break;
		case "afterEnd":
			if (sibling.nextSibling)
				sibling.parentNode.insertBefore(node,sibling.nextSibling);
			else
				sibling.parentNode.appendChild(node);
			break;
	}
}

//TODO: Do we need to take into account scrolling here?
/**
 * @private
 * @ignore
 */
nitobi.html.getClientRects = function(node, scrollTop, scrollLeft) 
{
	if (nitobi.browser.IE)
		return node.getClientRects();
	
	scrollTop = scrollTop || 0;
	scrollLeft = scrollLeft || 0;
	var td;
	if (nitobi.browser.SAFARI||nitobi.browser.CHROME) {
		td = nitobi.html.getCoords(node);
		scrollTop = 0;
		scrollLeft = 0;
	}
	else
	{
		var td = document.getBoxObjectFor(node);
		//td = node.ownerDocument.getBoxObjectFor(node)
	}
	return new Array({top: (td.y - scrollTop), left: (td.x - scrollLeft), bottom: (td.y + td.height - scrollTop), right: (td.x + td.width - scrollLeft)});
}

/**
 * @private
 * @ignore
 */
nitobi.html.getBoundingClientRect = function(node,scrollTop, scrollLeft) 
{
	if (nitobi.browser.IE)
		return node.getBoundingClientRect();

	scrollTop = scrollTop || 0;
	scrollLeft = scrollLeft || 0;
	var td;
	if (nitobi.browser.SAFARI||nitobi.browser.CHROME) {
		td = nitobi.html.getCoords(node);
		scrollTop = 0;
		scrollLeft = 0;
	}
	else
	{
		td = document.getBoxObjectFor(node);
	}
	var top = td.y-scrollTop;
	var left = td.x-scrollLeft;
	return {top: top, left: left, bottom: (top + td.height), right: (left + td.width)};
}
