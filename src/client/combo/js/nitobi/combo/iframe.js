/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// 2005.04.18 - changed all // (xml comments) to // (normal comments)
// no need to create documentation (for now) for this file

// *****************************************************************************
// *****************************************************************************
// * Iframe
// *****************************************************************************
// <class name='Iframe' access='private'>
// <summary>


// </summary>
// *****************************************************************************
// * Iframe Constructor
// *****************************************************************************
// NOTE: DOUBLE SLASHED COMMENTS SO THAT CSHARP GEN DOESN'T CREATE TWO CTORS
// <function name='Iframe' access="private">
// <summary>Constructor for Iframe, a (cross-browser) object that encapsulates an absolutely positioned IFRAME.</summary>
// <returns type="void"></returns></function>
// createAttribute(), createDocumentFragment(), createElement(),
// createTextNode(), getElementById(), etc.: REMEMBER to call these from
// Iframe.document vs. document because this IFRAME is a different (new) document
// parameters:
// - attachee (required) - HTMLElement to attach this IFRAME to
// - h (optional) - height of IFRAME, defaults to 0 if not specified
// - w (optional) - width of IFRAME, defaults to offsetWidth of attachee if not specified
/**
 * @private
 * @ignore
 */
function Iframe(attachee,h,w, ComboHtmlTagObject)
{
	if(!attachee){
		var msg="Iframe constructor: attachee is null!";
		alert(msg);
		throw msg;
	}
	var d=document;
	var oIF=d.createElement("IFRAME");
	var s=oIF.style;
	// attach() depends on this.oIFStyle so set this before calling
	// attach() depends on this.attachee so set this before calling
	this.oIFStyle=s;
	this.attachee=attachee;
	this.attach();
	s.position="absolute";
	w = w || attachee.offsetWidth;
	s.width=w;
	s.height = h || 0;
	s.display="none";
	s.overflow="hidden";
	// .name is needed to use frames[name]; .id is not enough
	var name="IFRAME"+oIF.uniqueID;
	oIF.name=name;
	oIF.id=name;
	oIF.frameBorder=0;
	// Keeps IE from complaining about unsecure items when in secure site
	oIF.src="javascript:true";
	
	// Insert the iframe just before the form end if possible.
	// This is done to keep the iframe in any form the combo might be in
	// If this is not done, the list causes the webpage to resize.
	var hostTag = Browser_GetParentElementByTagName(ComboHtmlTagObject,"form");
	if (null==hostTag)
	{
		hostTag = d.body;
	}
	hostTag.appendChild(oIF);
	
	var oF=window.frames[name];
	var oD=oF.document;
	oD.open();
	// - oD.write(...) is needed to create a body for oD; remember to access oD.body AFTER oD.write(...);
	// - margin-* all need to be set to 0 or we'd get some default margin space;
	// - background-color:white; needed for Mozilla to show w/o bleeding as in IE;
	// - float:left; needed for Mozilla or else SPAN won't show;
	// - need to put border in SPAN (vs. in IFRAME) or we'd get minor bleeding w/ SELECT elements in IE;
	// - bodySpan's width and height are reduced by 2 pixels for Mozilla to show the same as in IE
	//		because IE's width/height include borders whereas Mozilla's don't; so if user needs to change
	//		border width to 0 (i.e. Iframe.bodySpan.style.border) then please adjust the width/height
	//		according for Moz (i.e. add border pixels back); similarly, adjustments to width/height should
	//		take into account the borders for Moz (i.e. minus border pixels);
	// - note that inline styles below will not be overriden by css (i.e. assignment to .className);
	//		IF it's necessary to override, then do it through DOM (i.e. Iframe.bodySpan.style.*);
	//		user may want to override the border color, width, style (see previous note on this for Moz)
	// BUG: TEXTAREA's cursor still bleeds through IFRAME in IE;
	oD.write("<html><head></head><body style=\"margin:0;background-color:white;\"><span id=\"bodySpan\" class=\"ntb-combobox-list-outer-border\" style=\"overflow:hidden;float:left;border-width:1px;border-style:solid;width:"+(w-(nitobi.browser.MOZ?2:0))+";height:"+(h-(nitobi.browser.MOZ?2:0))+";\"></span></body></html>");
//	oD.write("<html><head></head><body style=\"margin:0;background-color:white;\"><span id=\"bodySpan\" style=\"overflow:hidden;float:left;border:0px solid black;width:"+w+";height:0;\"></span></body></html>");
	oD.close();
	// because this IFRAME is a new document, need to import window.document's
	// stylesheets or else they won't be available to this IFRAME
	var dss=d.styleSheets;
	var ss=oD.createElement("LINK");
	for(var i=0,n=dss.length; i<n; i++){
		// cloneNode() is faster than createElement()
		var ss2=ss.cloneNode(true);
		ss2.rel=(nitobi.browser.IE ? dss[i].owningElement.rel : dss[i].ownerNode.rel);
		ss2.type="text/css";
		ss2.href=dss[i].href;
		ss2.title=dss[i].title;
		oD.body.appendChild(ss2);
	}
	// only one HEAD tag written above so [0] is our desired element
	var head=oD.getElementsByTagName("head")[0];
	// - because this IFRAME is a new document, need to import window.document's
	//		scripts or else they won't be available to this IFRAME;
	// - document.scripts is only in IE; need to grab SCRIPT tags in Moz;
	var ds=(d.scripts?d.scripts:d.getElementsByTagName("script"));
	var st=oD.createElement("SCRIPT");
	var src=null;
	for(var i=0,n=ds.length; i<n; i++){
		src=ds[i].src;
		if(""!=src)
		{
			// cloneNode() is faster than createElement()
			var st2=st.cloneNode(true);
			st2.language=ds[i].language;
			st2.src=src;
			head.appendChild(st2);
		}
	}
	this.oIF=oIF;
	this.oF=oF;
	this.d=oD;
	this.bodySpan=oD.getElementById("bodySpan");
	this.bodySpanStyle=this.bodySpan.style;
	if(window.addEventListener){
		// Moz way of moving IFRAME on body resize; onresize in Moz is called
		// once after the user releases the mouse after resizing
		window.addEventListener('resize',this,false);
	}else if(window.attachEvent){
		if(!window.g_Iframe_oIFs){
			window.g_Iframe_oIFs=new Array;
			window.g_Iframe_onresize=window.onresize;
			Iframe_oResize();
			window.onresize=window.oResize.check1;
		}
		window.g_Iframe_oIFs[name]=this;
	}
}

// *****************************************************************************
// * Unload
// *****************************************************************************
/// <function name='Unload' access='private' obfuscate='no'><summary>
/// Actively unloads the object, and destroys owned objects.
/// </summary></function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.Unload = Iframe_Unload;
/**
 * @private
 * @ignore
 */
function Iframe_Unload()
{
	if (this.oIF)
	{
		delete this.oIF;
	}	
}

// the IE solution to Moz's handleEvent
// TODO: perhaps find a way to do this w/o injecting global variables?
/**
 * @private
 * @ignore
 */
var g_Iframe_oIFs=null;
/**
 * @private
 * @ignore
 */
var g_Iframe_onresize=null;
/**
 * @private
 * @ignore
 */
function Iframe_onafterresize(){
	for(var f in window.g_Iframe_oIFs){
		var oIF=window.g_Iframe_oIFs[f];
		oIF.attach();
	}
	if(window.g_Iframe_onresize)
		window.g_Iframe_onresize();
}
/**
 * @private
 * @ignore
 */
function Iframe_dfxWinXY(w){
	var b,d,x,y;
	x=y=0;
	var d=window.document;
	if(d.body){
		b = d.documentElement.clientWidth ? d.documentElement : d.body;
		x=b.clientWidth||0;
		y=b.clientHeight||0;
	}
	return {x:x,y:y};
}
/**
 * @private
 * @ignore
 */
function Iframe_oResize(){
	window.oResize={
		CHECKTIME:500,
		oldXY:Iframe_dfxWinXY(window),
		timerId:0,
		check1:function(){window.oResize.check2()},
		check2:function(){
			if(this.timerId)
				window.clearTimeout(this.timerId);
			this.timerId = setTimeout("window.oResize.check3()",this.CHECKTIME);
		},
		check3:function(){
			var newXY = Iframe_dfxWinXY(window);
			this.timerId = 0;
			if((newXY.x != this.oldXY.x) || (newXY.y != this.oldXY.y)){
				this.oldXY = newXY;
				Iframe_onafterresize();
			}
		}
	}
}

// *****************************************************************************
// * handleEvent
// *****************************************************************************
// <function name="handleEvent" access="private">
// <summary>Internal function for handling events in the context of this Iframe object.</summary>
// </function>
// works for Moz only
/**
 * @private
 * @ignore
 */
Iframe.prototype.handleEvent=Iframe_handleEvent;
/**
 * @private
 * @ignore
 */
function Iframe_handleEvent(evt){
	switch(evt.type){
		case 'resize':{
			if(this.isVisible())
				this.attach();
			break;
		}
	}
}

// *****************************************************************************
// * offset
// *****************************************************************************
// <function name="offset" access="private">
// <summary>Calculates the offset(Left|Top) of an object on a page.</summary>
// </function>
// parameters:
// o = object to find offset*
// attr = either "offsetLeft" or "offsetTop"
// a = true if absolute positioning, false otherwise
/**
 * @private
 * @ignore
 */
Iframe.prototype.offset=Iframe_offset;
/**
 * @private
 * @ignore
 */
function Iframe_offset(o, attr, a){
// for absolutely positioned 'o', only take its offset* and add
// table border pixels back in;
// for relatively positioned 'o', also add in its ancestor's offset*
	var x = (a ? o[attr] : 0);
	var _o = o;
	while(o){
		x += (a ? 0 : o[attr]);

		// seems to fix a bug in IE where if the element is inside a TABLE
		// with a border != 0, the offset* is off by one
		if(nitobi.browser.IE && "TABLE"==o.tagName && "0"!=o.border && ""!=o.border){
			x++;
		}
		o=o.offsetParent;
	}
// no longer necessary because we've fixed the textbox+button position issues;
// but leave here just in case; comments get stripped out at build-time anyway
//	// IE hack-like code to deal w/ TR's w/ VALIGN of 'middle' and 'bottom',
//	// which mess up the offsetTop calculated for the object 'o'
//	if(nitobi.browser.IE && "offsetTop"==attr){
//		o=_o;
//		while(o){
//			if("TR"==o.tagName && "TD"==_o.tagName){
//				// either "middle" or "" (because default is "middle")
//				// NOTE: known bug: the minus one is there to round down (in case
//				// the difference is odd); most of the time, this is the desired
//				// behavior; some other times, the top is off by one (i.e. didn't
//				// subtract enough); however, not subtract enough (by one pixel) is
//				// better than subtracting by too much (by one pixel); so the final
//				// decision is to leave it as minus one to always round down
//				if("middle"==o.vAlign)
//					x -= (_o.clientHeight - _o.scrollHeight - 1) / 2;
//				else if("bottom"==o.vAlign)
//					x -= _o.clientHeight - _o.scrollHeight;
//			}
//			// save previous element in chain
//			_o=o;
//			o=o.parentElement;
//		}
//	}
	return x;
}

// *****************************************************************************
// * setHeight
// *****************************************************************************
// <function name="setHeight" access="private">
// <summary>Sets the height of the IFRAME</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.setHeight=Iframe_setHeight;
/**
 * @private
 * @ignore
 */
function Iframe_setHeight(h,workaround){
	h=parseInt(h);
	this.oIFStyle.height=h;
	// bodySpan's height is reduced by ? border pixels for Mozilla to show the same as in IE
	//	because IE's width/height include borders whereas Mozilla's don't
	if(workaround!=true){
		this.bodySpanStyle.height =
			(h-(nitobi.browser.MOZ ? parseInt(this.bodySpanStyle.borderTopWidth) + parseInt(this.bodySpanStyle.borderBottomWidth) : 0));
	}
}

// *****************************************************************************
// * setWidth
// *****************************************************************************
// <function name="setWidth" access="private">
// <summary>Sets the width of the IFRAME</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.setWidth=Iframe_setWidth;
/**
 * @private
 * @ignore
 */
function Iframe_setWidth(w){
	w=parseInt(w);
	this.oIFStyle.width=w;
	// bodySpan's width is reduced by ? border pixels for Mozilla to show the same as in IE
	//	because IE's width/height include borders whereas Mozilla's don't
	this.bodySpanStyle.width =
		(w-(nitobi.browser.MOZ ? parseInt(this.bodySpanStyle.borderLeftWidth) + parseInt(this.bodySpanStyle.borderRightWidth) : 0));
}

// *****************************************************************************
// * show
// *****************************************************************************
// <function name="show" access="private">
// <summary>Shows the IFRAME</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.show=Iframe_show;
/**
 * @private
 * @ignore
 */
function Iframe_show(){
// in Moz & IE, resizing window when IFRAME is not shown and then
// showing the IFRAME can cause the IFRAME to be off, position-wise; solve by
// calling attach() every time show() is called
	this.attach();
	this.oIFStyle.display="inline";
}

// *****************************************************************************
// * hide
// *****************************************************************************
// <function name="hide" access="private">
// <summary>Hides the IFRAME</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.hide=Iframe_hide;
/**
 * @private
 * @ignore
 */
function Iframe_hide(){
	this.oIFStyle.display="none";
}

// *****************************************************************************
// * toggle
// *****************************************************************************
// <function name="toggle" access="private">
// <summary>Shows the IFRAME if hidden; hides the IFRAME if shown</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.toggle=Iframe_toggle;
/**
 * @private
 * @ignore
 */
function Iframe_toggle(){
	if(this.isVisible())
		this.hide();
	else
		this.show();
}

// *****************************************************************************
// * isVisible
// *****************************************************************************
// <function name="isVisible" access="private">
// <summary>Returns whether or not the IFRAME if visible</summary>
// </function>
/**
 * @private
 * @ignore
 */
Iframe.prototype.isVisible=Iframe_isVisible;
/**
 * @private
 * @ignore
 */
function Iframe_isVisible(){
	return "inline"==this.oIFStyle.display;
}

// *****************************************************************************
// * attach
// *****************************************************************************
// <function name="attach" access="private">
// <summary>Attaches this IFRAME to the bottom of 'attachee', matching its left border.</summary>
// </function>
// attach() depends on this.oIFSytle so set this before calling attach()
// attach() depends on this.attachee so set this before calling attach()
/**
 * @private
 * @ignore
 */
Iframe.prototype.attach=Iframe_attach;
/**
 * @private
 * @ignore
 */
function Iframe_attach(){
	var attachee=this.attachee;
	var a = (attachee.offsetParent && "absolute"==attachee.offsetParent.style.position);
	// oIF.style.top: minus 1 to match f's top border w/ attachee's bottom border
	// attachees w/ absolutely positioned parents need to be handled differently
	this.oIFStyle.top = this.offset(attachee, "offsetTop", a) + attachee.offsetHeight - 1 + (a ? parseInt(attachee.offsetParent.style.top) : 0);
	this.oIFStyle.left = this.offset(attachee, "offsetLeft", a) + (a ? parseInt(attachee.offsetParent.style.left) : 0);
}
// </class>
