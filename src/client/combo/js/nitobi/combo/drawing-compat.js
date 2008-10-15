/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.drawing");

nitobi.drawing.rgb = function(r,g,b) 
{
  	return "#"+((r*65536)+(g*256)+b).toString(16);
}

/**
 * Aligns two DOM nodes on in the web browser.
 * @param {HtmlElement} source
 * @param {HtmlElement} target
 * @param {BitMask} align
 * @param {Number} oh The height offset for the target HtmlElement.
 * @param {Number} ow The width offset for the target HtmlElement.
 * @param {Number} oy The left offset for the target HtmlElement.
 * @param {Number} ox The top offset for the target HtmlElement.
 */
nitobi.drawing.align = function(source,target,AlignBit_HWTBLRCM,oh,ow,oy,ox,show)
{
	oh=oh || 0;
	ow=ow || 0;
	oy=oy || 0;
	ox=ox || 0;
	var a=AlignBit_HWTBLRCM;
	var td,sd,tt,tb,tl,tr,th,tw,st,sb,sl,sr,sh,sw;

//CROSS BROWSER
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
	if (nitobi.browser.MOZ)
	{
		//	this is for Mozilla
		td = document.getBoxObjectFor(target);
		sd = document.getBoxObjectFor(source);

		tt = td.y;
		tl = td.x;
//		tt=td.screenY;
//		tl=td.screenX;
		tw = td.width;
		th = td.height;

//		st=sd.screenY;
//		sl=sd.screenX;
		st = sd.y;
		sl = sd.x;
		sw = sd.width;
		sh = sd.height;
	} 

	if (a&0x10000000) source.style.height=th+oh; // make same height
	if (a&0x01000000) source.style.width=tw+ow; // make same width
	if (a&0x00100000) source.style.top = nitobi.html.getStyleTop(source)+tt-st+oy; // align top
	if (a&0x00010000) source.style.top = nitobi.html.getStyleTop(source)+tt-st+th-sh+oy; // align bottom
	if (a&0x00001000) source.style.left = nitobi.html.getStyleLeft(source)-sl+tl+ox; // align left
	if (a&0x00000100) source.style.left = nitobi.html.getStyleLeft(source)-sl+tl+tw-sw+ox; // align right
	if (a&0x00000010) source.style.top = nitobi.html.getStyleTop(source)+tt-st+oy+Math.floor((th-sh)/2); // align middle vertically
	if (a&0x00000001) source.style.left = nitobi.html.getStyleLeft(source)-sl+tl+ox+Math.floor((tw-sw)/2); // align middle horizontally

	if (show) {
		src.style.top=st-2;
		src.style.left=sl-2;
		src.style.height=sh;
		src.style.width=sw;
		tgt.style.top=tt-2;
		tgt.style.left=tl-2;
		tgt.style.height=th;
		tgt.style.width=tw;

		if (document.getBoundingClientRect) { 
			sd=source.getBoundingClientRect();
			st=sd.top;
			sb=sd.bottom;
			sl=sd.left;
			sr=sd.right;
			sh=Math.abs(sb-st);
			sw=Math.abs(sr-sl);
		}
		if (document.getBoxObjectFor) { 
			sd = document.getBoxObjectFor(source); 
	//		st=sd.y;
	//		sl=sd.x;
			st=sd.screenY;
			sl=sd.screenX;
			sw=sd.width;
			sh=sd.height;
		}  

		src2.style.top=st-2;
		src2.style.left=sl-2;
		src2.style.height=sh;
		src2.style.width=sw;
	}
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

nitobi.drawing.alignOuterBox = function(source,target,AlignBit_HWTBLRCM,oh,ow,oy,ox,show)
{
	oh=oh || 0;
	ow=ow || 0;
	oy=oy || 0;
	ox=ox || 0;

	if (nitobi.browser.MOZ)
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