/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @namespace The namespace for helper functions used by ComboBox
 * for cross browser compatibility.
 * @private
 * @constructor
 */
nitobi.Browser = function(){};

/**
 * The width of the scrollbar in pixels.  An alias for {@link nitobi.html.getScrollBarWidth}.
 */
nitobi.Browser.GetScrollBarWidth = nitobi.html.getScrollBarWidth;

/**
 * Returns the browser. Current only returns Browser.nitobi.Browser.IE or Browser.nitobi.Browser.UNKNOWN.</summary>
 */
nitobi.Browser.GetBrowserType = function ()
{
	return (navigator.appName == "Microsoft Internet Explorer" ? this.nitobi.Browser.IE : this.nitobi.Browser.UNKNOWN);
};

/**
 * Depending on the browser, this returns an object with detailed information. 
 * Browser specific. For IE it returns a clientInformation Object.
 */
nitobi.Browser.GetBrowserDetails = function ()
{
	return (this.GetBrowserType() == this.nitobi.Browser.IE ? window.clientInformation : null);
};

/**
 * Returns true if the object is visible to the user [AND at the top of the container] and false otherwise.
 * @param {Object} Object The object that you want to check.
 * @param {Object} Container The container in which the object resides.
 * @param {Boolean} Top If true, then check for in view AND at the top.
 * @param {Boolean} IgnoreHorizontal If true, then ignore check in the horizontal direction.
*/
nitobi.Browser.IsObjectInView = function(Object, Container, Top, IgnoreHorizontal){
	// The object is in view if its top left and bottom right are within
	// the bounds of the container.
	var objectRect = nitobi.html.getBoundingClientRect(Object);
	var containerRect = nitobi.html.getBoundingClientRect(Container);
	if(nitobi.browser.MOZ){
		containerRect.top += Container.scrollTop;
		containerRect.bottom += Container.scrollTop;
		containerRect.left += Container.scrollLeft;
		containerRect.right += Container.scrollLeft;
	}
	var inView = ( ( true==Top ? (objectRect.top == containerRect.top)
					: (objectRect.top >= containerRect.top) && (objectRect.bottom <= containerRect.bottom) ) &&
				 ( IgnoreHorizontal ? true : (objectRect.right <= containerRect.right) &&
					(objectRect.left >= containerRect.left) ) );

	return inView;
};

/**
 * @private
 */
nitobi.Browser.VAdjust = function (Object, Container)
{
	// AddPage() causes <table>...page1...</table> to become:
	// <table>...page1...</table><table>...page2...</table>
	// subsequent AddPage() calls append more tables;
	// therefore, getting Object.offsetTop is obviously not enough;
	// also need to add back the difference between the current table's
	// offsetTop and the first row's table's offsetTop
	
	var v = (Object.offsetParent ? Object.offsetParent.offsetTop : 0);
	var id = Object.id;
	var fid = id.substring(0, 1 + id.lastIndexOf("_")) + "0";
	
	// ownerDocument is in the w3c spec but ie5 doesn't support it.
	// < ie6 we need to use document.
	var ownerDocument = Container.ownerDocument;
	if (null == ownerDocument)
	{
		ownerDocument = Container.document;
	}

	
	var oF = ownerDocument.getElementById(fid);

	return v - (oF.offsetParent ? oF.offsetParent.offsetTop : 0);
};

/**
 * @private
 */
nitobi.Browser.WheelUntil = function(bool, inc, list, idx, last, container){
	var min = (inc ? -1 : 0);
	var max = (inc ? last : last + 1);
	while(idx > min && idx < max){
		if(inc)
			idx++;
		else
			idx--;
		var r = list.GetRow(idx);
		var test = this.IsObjectInView(r,container,false,true);
		if(test == bool)
			return idx;
	}
	return idx;
};

/**
 * Scrolls the container up so that the first row not in view comes into view.
 * Because onmousehweel currently only works in IE, code below will only be IE-specific for now
 * @param {Object} List ComboBox's list object.
 */
nitobi.Browser.WheelUp = function(List){
	var top = List.GetRow(0);
	var last = List.GetXmlDataSource().GetNumberRows() - 1;
	var bottom = List.GetRow(last);
	var container = List.GetSectionHTMLTagObject(EBAComboBoxListBody);
	// initial "guess-timate"
	var i = parseInt(container.scrollTop / top.offsetHeight);
	var r = (i > last ? bottom : List.GetRow(i));
	var delta = r.offsetTop - container.scrollTop + nitobi.Browser.VAdjust(r,container);
	if(this.IsObjectInView(r,container,false,true)){
		i = this.WheelUntil(false, false, List, i, last, container);
	}else{
		if(delta < 0){
			i = this.WheelUntil(true, true, List, i, last, container);
			i--;
		}
		else{
			i = this.WheelUntil(true, false, List, i, last, container);
			i = this.WheelUntil(false, false, List, i, last, container);
		}
	}
	this.ScrollIntoView(List.GetRow(i), container, true, false);
};

/**
 * Scrolls the container down so that the first row not in view comes into view.
 * Because onmousehweel currently only works in IE, code below will only be IE-specific for now
 * @param {Object} Container The container in which the list resides.
 * @param {Object} Top Top row in the container.
 */
nitobi.Browser.WheelDown = function(List)
{
	var top = List.GetRow(0);
	var last = List.GetXmlDataSource().GetNumberRows() - 1;
	var bottom = List.GetRow(last);
	var container = List.GetSectionHTMLTagObject(EBAComboBoxListBody);
	// initial "guess-timate"
	var i = parseInt(container.scrollTop / top.offsetHeight);
	var r = (i > last ? bottom : List.GetRow(i));
	
	var delta = r.offsetTop - container.scrollTop + nitobi.Browser.VAdjust(r,container);
	if(this.IsObjectInView(r,container,false,true))
	{
		i = 1 + this.WheelUntil(false, false, List, i, last, container);
	}
	else
	{
		if(delta < 0)
		{
			i = this.WheelUntil(true, true, List, i, last, container);
		}
		else
		{
			i = this.WheelUntil(true, false, List, i, last, container);
			i = 1 + this.WheelUntil(false, false, List, i, last, container);
		}
	}
	r = List.GetRow(i);
	delta = r.offsetTop - container.scrollTop + nitobi.Browser.VAdjust(r,container);
	if(0==delta && i!=last)
	{
		r = List.GetRow(1 + i);
	}
	
	this.ScrollIntoView(r, container, true, false);
};

/**
 * Moves the object into the user's view.
 * @param {Object} Object The object you want to view.
 * @param {Object} Container The container in which the object resides.
 * @param {Boolean} Top If true, then Object is scrolled to the top of the Container. Or else, just scrolls Object into Container's view.
 * @param {Boolean} Bottom If true, then Object is scrolled to the bottom of the Container. Or else, just scrolls Object into Container's view.
 */
nitobi.Browser.ScrollIntoView = function(Object, Container, Top, Bottom){
	// TODO: due to time constraints, the Bottom param was added as a quickie workaround;
	// it's VERY ugly! when there's time, please pretty it up the interface
	var objectRect = nitobi.html.getBoundingClientRect(Object);
	var containerRect = nitobi.html.getBoundingClientRect(Container);
	var topDelta = Object.offsetTop - Container.scrollTop;
	var v = nitobi.Browser.VAdjust(Object, Container);
	topDelta += v;
	var leftDelta = Object.offsetLeft - Container.scrollLeft;
	var rightDelta = leftDelta + Object.offsetWidth - Container.offsetWidth;
	var bottomDelta = topDelta + Object.offsetHeight - Container.offsetHeight;
	var rightScrollBarAdjustment = 0;
	var bottomScrollBarAdjustment = 0;
	var scrollbarSize=this.GetScrollBarWidth(Container);
	// we decided to take out horizontal scrolling (i.e overflow hidden)
//		if(this.GetHorizontalScrollBarStatus(Container)==true)
//			bottomScrollBarAdjustment=scrollbarSize;
	if(this.GetVerticalScrollBarStatus(Container)==true)
		rightScrollBarAdjustment=scrollbarSize;
	if (leftDelta < 0){
		//alert("too far left");
		Container.scrollLeft += leftDelta;
	}else{
		if (rightDelta > 0){
			//The object is too far right. Scroll but don't push the left corner out of view.
			if (objectRect.left - rightDelta > containerRect.left){
				Container.scrollLeft+=rightDelta + rightScrollBarAdjustment;
				//alert("Too far right: ");
			}else{
				// The width of the object is greater than the container so only
				// move as much as we can while still exposing the top left corner
				// of the object.
				Container.scrollLeft+=leftDelta;
				//alert("too far right but too big");
			}
		}
	}
	if ((topDelta < 0 || true==Top) && true!=Bottom){
		Container.scrollTop += topDelta;
		//alert("too far up");
	}else{
		if (bottomDelta > 0 || true==Bottom){
			// The object is too far down. Scoll but don't push the top out of view.
			if (objectRect.top - bottomDelta > containerRect.top || true==Bottom){
				Container.scrollTop += bottomDelta + bottomScrollBarAdjustment;
				//alert("Too far down:" + bottomScrollBarAdjustment);
			}else{
				// The height of the object is greater than the height of the container so only
				// move as much as we can while still exposing the top left corner of the object.
				Container.scrollTop += topDelta;
				//alert("too far down but too big");
			}
		}
	}
};

/**
 * Returns the status of the vertical scrollbars in a container.
 * @param {Object} Container The element whose vertical scrollbars status we want.
 */
nitobi.Browser.GetVerticalScrollBarStatus = function(Container){
	return this.GetScrollBarWidth(Container) > 0;
};

/**
 * Returns the status of the horizontal scrollbars.
 * @param {Object} Container The element whose horizontal scrollbars status we want.
 */
nitobi.Browser.GetHorizontalScrollBarStatus = function(Container){
	return (Container.scrollWidth > Container.offsetWidth - this.GetScrollBarWidth(Container));
};

/**
 * Given a string that has been encoded with HTMLEncode, returns the string unencoded.
 * @param {String} EncodedString The encoded string.
 */
nitobi.Browser.HTMLUnencode = function(EncodedString)
{
	var unencodedString = EncodedString;
	// Regular expression to match encodings for various special
	// charachters.
	var searches = new Array(/&amp;/g, /&lt;/g, /&quot;/g, /&gt;/g, /&nbsp;/g);
	var replacements = new Array("&","<","\"",">"," ");
	
	// Search for each string using the regular expression and replace it.
	for (var i = 0; i < searches.length; i++)
	{
		unencodedString = unencodedString.replace(searches[i],replacements[i]);
	}
	return (unencodedString);
};


/**
 * Looks within the attributes of a string represented tag markup, and encodes angle brackets as &lt; and &gt;
 * Returns the markup with the brackets inside the atts encoded.
 * @param {String} str Tag markup
 * @type String
 */
nitobi.Browser.EncodeAngleBracketsInTagAttributes = function(str)
{
	//TODO: The Combo ptr should be replaced when the new debug system is installed.
	// Careful, the DOM will replace "&quote;" with '"'. Reverse this behaviour.
	str=str.replace(/'"'/g,"\"&quot;\"");
	var vals = str.match(/".*?"/g);
	if (vals)
	{
		for (var i =0;i<vals.length;i++)
		{
			val = vals[i];
			val = val.replace(/</g,"&lt;");
			val = val.replace(/>/g,"&gt;");
			str=str.replace(vals[i],val);
		}
	}
	return str;
};

/**
 * Returns a page from an URL syncronously.  The contents of the page.
 * @param {String} Url The url from which to retrieve data.
 * @type String
 */
nitobi.Browser.LoadPageFromUrl = function(Url,RequestMethod)
{
	if (RequestMethod == null) RequestMethod = "GET";
	var httpRequest=new nitobi.ajax.HttpRequest();
	httpRequest.responseType = "text";
	httpRequest.abort();
	httpRequest.open(RequestMethod, Url, false, "", "");
	httpRequest.send("EBA Combo Box Get Page Request");
	return (httpRequest.responseText);
};

/**
 * Given an HTML measurement type such as 100px or 100% returns px or %.
 * Returns % or px or another html measurement type
 * @param {String} Unit The unit such as 100px.
 * @type String
 */
nitobi.Browser.GetMeasurementUnitType = function(Unit)
{
	if (Unit==null || Unit=="") return "";
	var index = Unit.search(/\D/g);
	var mType = Unit.substring(index);
	return (mType);
};


/**
 * Given an HTML measurement type such as 100px or 100% returns 100.
 * @param {String} Unit The unit such as 100px
 * @type String 
 */
nitobi.Browser.GetMeasurementUnitValue = function(Unit)
{
	var index = Unit.search(/\D/g);
	var mValue = Unit.substring(0,index);
	return Number(mValue);
};


/**
 * Returns the actual width of an html element in px.
 * @parm {Object} Element The html element whose size you want.
 * @type Number
 */
nitobi.Browser.GetElementWidth = function(Element)
{
	if (Element==null) throw ("Element in GetElementWidth is null");
	var estyle = Element.style;
	var top = estyle.top;
	var display = estyle.display;
	var position = estyle.position;
	var visibility = estyle.visibility;
	
	var cVisibility = nitobi.html.Css.getStyle(Element,"visibility");
	var cDisplay = nitobi.html.Css.getStyle(Element,"display");
	var fudge = 0;
	if (cDisplay=="none" || cVisibility=="hidden")
	{
		estyle.position = "absolute";
		estyle.top = -1000;
		estyle.display="inline";
		estyle.visibility="visible";
	}
	var width = nitobi.html.getWidth(Element);
	if (estyle.display=="inline")
	{
		estyle.position = position;
		estyle.top = top;
		estyle.display=display;	
		estyle.visibility=visibility;
	}
	

	return parseInt(width);
};

/**
 * Returns the actual Height of an html element in px.
 * @param {Object} Element The html element whose size you want.
 * @type Number
 */
nitobi.Browser.GetElementHeight = function(Element)
{
	if (Element==null) throw ("Element in GetElementHeight is null");
	var estyle = Element.style;
	var top = estyle.top;
	var display = estyle.display;
	var position = estyle.position;
	var visibility = estyle.visibility;
	if (estyle.display=="none" || estyle.visibility!="visible")
	{
		estyle.position = "absolute";
		estyle.top = "-1000px";
		estyle.display="inline";
		estyle.visibility="visible";
	}
	var height = nitobi.html.getHeight(Element);
	
	if (estyle.display=="inline")
	{
		estyle.position = position;
		estyle.top = top;
		estyle.display=display;	
		estyle.visibility=visibility;
	}
	return parseInt(height);
};

/**
 * Searches through the parent hierarchy to find an element with the specified tagname.
 * @param {HTMLElement} Element The element whose parent you want to find.
 * @param {String} TagName The name of the tag.
 * @type Object
 */
nitobi.Browser.GetParentElementByTagName = function(Element, TagName)
{
	TagName=TagName.toLowerCase();
	var currentTag;
	do 
	{
		Element=Element.parentElement;
		if (Element!=null)
		{
			currentTag=Element.tagName.toLowerCase();
		}
		
	} while((currentTag!=TagName) && (Element!=null))
	return Element;
};