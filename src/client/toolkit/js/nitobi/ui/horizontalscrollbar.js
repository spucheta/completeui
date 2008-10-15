/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ui");

/**
 * @private
 * @ignore
 */
nitobi.ui.HorizontalScrollbar = function() 
{
	this.uid = "hscroll"+nitobi.base.getUid();
}

nitobi.lang.extend(nitobi.ui.HorizontalScrollbar, nitobi.ui.Scrollbar);

/**
 * @private
 * @ignore
 */
nitobi.ui.HorizontalScrollbar.prototype.getScrollPercent = function()
{
	return (this.element.scrollLeft/(this.surface.clientWidth-this.element.clientWidth));
}

/**
 * @private
 * @ignore
 */
nitobi.ui.HorizontalScrollbar.prototype.setScrollPercent = function(percent)
{
	this.element.scrollLeft=(this.surface.clientWidth-this.element.clientWidth)*percent;
	return false;
}

/**
 * @private
 * @ignore
 * @param size A percent value between 0 and 1.
 */ 
nitobi.ui.HorizontalScrollbar.prototype.setRange = function(size)
{
	this.surface.style.width = Math.floor(this.element.offsetWidth / size) + "px";
}