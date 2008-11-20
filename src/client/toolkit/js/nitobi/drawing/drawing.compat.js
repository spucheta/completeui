/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.drawing");

if (false)
{
	/**
	 * @namespace The namespace for drawing functions/classes.
	 * @constructor
	 */
	nitobi.drawing = function() {};
}

/**
 * Creates a point that manages x,y coordinates.
 * @class A class that represents a two-dimensional coordinate.
 * @constructor
 * Contains (x,y) pairs accessable via their respective properties: samplePoint.x and samplePoint.y
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 */
nitobi.drawing.Point = function(x,y)
{
	this.x = x;
	this.y = y;
};

/**
 * Converts the point to a string, e.g. "(4,2)"
 * @type String
 */
nitobi.drawing.Point.prototype.toString = function()
{
	return "("+this.x+","+this.y+")";
};

/**
 * Returns the hex representation of a colour defined in rgb.
 * @param {Number} r The red value.
 * @param {Number} g The green value.
 * @param {Number} b The blue value.
 * @type String
 */
nitobi.drawing.rgb = function(r,g,b) 
{
  	return "#"+((r*65536)+(g*256)+b).toString(16);
}

/**
 * Aligns two DOM nodes on in the web browser.
 * @example
 * var header = $ntb("header");
 * var title = $ntb("title");
 * nitobi.drawing.align(header, title, nitobi.drawing.align.ALIGNRIGHT);
 * @param {HtmlElement} source The element to align.
 * @param {HtmlElement} target The reference element to align against.
 * @param {BitMask} align A value defining how to align the two elements.  Can be of the
 * following values:
 * <ul>
 * 	<li>nitobi.drawing.align.SAMEHEIGHT</li>
 * 	<li>nitobi.drawing.align.SAMEWIDTH</li>
 * 	<li>nitobi.drawing.align.ALIGNTOP</li>
 * <li>nitobi.drawing.align.ALIGNBOTTOM</li>
 * <li>nitobi.drawing.align.ALIGNLEFT</li>
 * <li>nitobi.drawing.align.ALIGNRIGHT</li>
 * <li>nitobi.drawing.align.ALIGNMIDDLEVERT</li>
 * <li>nitobi.drawing.align.ALIGNMIDDLEHORIZ</li>
 * </ul>
 * @param {Number} oh The height offset for the target HtmlElement.
 * @param {Number} ow The width offset for the target HtmlElement.
 * @param {Number} oy The left offset for the target HtmlElement.
 * @param {Number} ox The top offset for the target HtmlElement.
 */
nitobi.drawing.align = function(source,target,AlignBit_HWTBLRCM,oh,ow,oy,ox)
{
	oh=oh || 0;
	ow=ow || 0;
	oy=oy || 0;
	ox=ox || 0;
	var a=AlignBit_HWTBLRCM;
	var td,sd,tt,tb,tl,tr,th,tw,st,sb,sl,sr,sh,sw;

	if (nitobi.browser.IE)
	{
		//	this is for IE
		td=target.getBoundingClientRect();
		sd=source.getBoundingClientRect();
		tt=td.top;
		tb=td.bottom;
		tl=td.left;
		tr=td.right;
		th=Math.abs(tb-tt);
		tw=Math.abs(tr-tl);
		st=sd.top;
		sb=sd.bottom;
		sl=sd.left;
		sr=sd.right;
		sh=Math.abs(sb-st);
		sw=Math.abs(sr-sl);
	}
	else if (nitobi.browser.MOZ)
	{
		//	this is for Mozilla
		td = document.getBoxObjectFor(target);
		sd = document.getBoxObjectFor(source);

		tt = td.y;
		tl = td.x;
		tw = td.width;
		th = td.height;

		st = sd.y;
		sl = sd.x;
		sw = sd.width;
		sh = sd.height;
	}
	else
	{
		td = nitobi.html.getCoords(target);
		sd = nitobi.html.getCoords(source);

		tt = td.y;
		tl = td.x;
		tw = td.width;
		th = td.height;

		st = sd.y;
		sl = sd.x;
		sw = sd.width;
		sh = sd.height;
	}
	var s = source.style;

	if (a&0x10000000) s.height = (th+oh)+'px'; // make same height
	if (a&0x01000000) s.width = (tw+ow)+'px'; // make same width
	if (a&0x00100000) s.top = (nitobi.html.getStyleTop(source)+tt-st+oy)+'px'; // align top
	if (a&0x00010000) s.top = (nitobi.html.getStyleTop(source)+tt-st+th-sh+oy)+'px'; // align bottom
	if (a&0x00001000) s.left = (nitobi.html.getStyleLeft(source)-sl+tl+ox)+'px'; // align left
	if (a&0x00000100) s.left = (nitobi.html.getStyleLeft(source)-sl+tl+tw-sw+ox)+'px'; // align right
	if (a&0x00000010) s.top = (nitobi.html.getStyleTop(source)+tt-st+oy+Math.floor((th-sh)/2))+'px'; // align middle vertically
	if (a&0x00000001) s.left = (nitobi.html.getStyleLeft(source)-sl+tl+ox+Math.floor((tw-sw)/2))+'px'; // align middle horizontally
}

/**
 * Bit mask for aligning two HtmlElements with the same height.
 */
nitobi.drawing.align.SAMEHEIGHT				=0x10000000;
/**
 * Bit mask for aligning two HtmlElements with the same width.
 */
nitobi.drawing.align.SAMEWIDTH				=0x01000000;
/**
 * Bit mask for aligning two HtmlElements to the same top edge.
 */
nitobi.drawing.align.ALIGNTOP				=0x00100000;
/**
 * Bit mask for aligning two HtmlElements to the same bottom edge.
 */
nitobi.drawing.align.ALIGNBOTTOM			=0x00010000;
/**
 * Bit mask for aligning two HtmlElements to the same left edge.
 */
nitobi.drawing.align.ALIGNLEFT				=0x00001000;
/**
 * Bit mask for aligning two HtmlElements to the same right edge.
 */
nitobi.drawing.align.ALIGNRIGHT				=0x00000100;
/**
 * Bit mask for aligning two HtmlElements to the same height.
 */
nitobi.drawing.align.ALIGNMIDDLEVERT		=0x00000010;
nitobi.drawing.align.ALIGNMIDDLEHORIZ		=0x00000001;

/**
 * I don't think is used anywhere...
 * @private
 */
nitobi.drawing.alignOuterBox = function(source,target,AlignBit_HWTBLRCM,oh,ow,oy,ox,show)
{
	oh=oh || 0;
	ow=ow || 0;
	oy=oy || 0;
	ox=ox || 0;

	if (nitobi.browser.moz)
	{
		//	this is for Mozilla
		td = document.getBoxObjectFor(target);
		sd = document.getBoxObjectFor(source);

		var borderLeftTarget = parseInt(document.defaultView.getComputedStyle(target, '').getPropertyValue('border-left-width'));
		var borderTopTarget = parseInt(document.defaultView.getComputedStyle(target, '').getPropertyValue('border-top-width'));

		var borderTop = parseInt(document.defaultView.getComputedStyle(source, '').getPropertyValue('border-top-width'));
		var borderBottom = parseInt(document.defaultView.getComputedStyle(source, '').getPropertyValue('border-bottom-width'));

		var borderLeft = parseInt(document.defaultView.getComputedStyle(source, '').getPropertyValue('border-left-width'));
		var borderRight = parseInt(document.defaultView.getComputedStyle(source, '').getPropertyValue('border-right-width'));

		oy = oy + borderTop - borderTopTarget;
		ox = ox + borderLeft - borderLeftTarget;
	}

	nitobi.drawing.align(source,target,AlignBit_HWTBLRCM,oh,ow,oy,ox,show);
}