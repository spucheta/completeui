/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ui");

nitobi.ui.Scrollbar = function() 
{
	this.uid = "scroll" + nitobi.base.getUid();
}


nitobi.ui.Scrollbar.prototype.render = function()
{
	//Render the scrollbar
}
nitobi.ui.Scrollbar.prototype.attachToParent = function(UiContainer,element,surface)
{
	this.UiContainer = UiContainer;
	this.element = element || nitobi.html.getFirstChild(this.UiContainer);
	if (this.element == null) this.render();
	this.surface = surface || nitobi.html.getFirstChild(this.element);

	// Attach events
	this.element.onclick="";
	this.element.onmouseover="";
	this.element.onmouseout="";
	this.element.onscroll="";

//	var _this = this;
//	this.element.onscroll=function() {_this.scrollByUser()};
//	this.attach("onscroll",this.scrollByUser,this.element};
	nitobi.html.attachEvent(this.element, "scroll", this.scrollByUser, this);
}
nitobi.ui.Scrollbar.prototype.align = function()
{
	var vs = document.getElementById("vscroll"+this.uid);

	var dx = -1;
	if (nitobi.browser.MOZ)
	{
		dx = -3
	}
	nitobi.drawing.align(vs,this.UiContainer.childNodes[0],0x10100100,-42,0,24,dx,false);
}
nitobi.ui.Scrollbar.prototype.scrollByUser = function()
{
	this.fire("ScrollByUser",this.getScrollPercent());
}
nitobi.ui.Scrollbar.prototype.setScroll = function(position)
{
}
nitobi.ui.Scrollbar.prototype.getScrollPercent = function()
{
}

/**
 * @param size A percent value between 0 and 1.
 */
nitobi.ui.Scrollbar.prototype.setRange = function(size)
{
}

/**
 * Returns the horizontal thickness of the scrollbar
 */ 
nitobi.ui.Scrollbar.prototype.getWidth = function()
{
	return nitobi.html.getScrollBarWidth();
}
/**
 * Returns the vertical thickness of the scrollbar
 */ 
nitobi.ui.Scrollbar.prototype.getHeight = function()
{
	return nitobi.html.getScrollBarWidth();
}


nitobi.ui.Scrollbar.prototype.fire= function(evt,args)  {
	return nitobi.event.notify(evt+this.uid,args);
  }
nitobi.ui.Scrollbar.prototype.subscribe= function(evt,func,context)  {
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
}
