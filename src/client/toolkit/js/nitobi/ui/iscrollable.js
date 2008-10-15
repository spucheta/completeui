/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');

/**
 * An interface that provides scrolling functionality.
 * @class An interface that provides scrolling functionality.
 * @constructor
 * @param {HTMLElement} element The element that can be scrolled.
 */
nitobi.ui.IScrollable = function(element)
{
	this.scrollableElement = element;
};

/**
 * Sets the element that can be scrolled.
 * @param {HTMLElement} el The element that can be scrolled.
 */
nitobi.ui.IScrollable.prototype.setScrollableElement = function(el)
{
	this.scrollableElement = el;
}

/**
 * Returns the element that is to be scolled.
 * @type HTMLElement
 */
nitobi.ui.IScrollable.prototype.getScrollableElement = function()
{
	return this.scrollableElement;
}

/**
 * Returns scrollLeft.
 * @type Number
 */
nitobi.ui.IScrollable.prototype.getScrollLeft = function()
{
	return this.scrollableElement.scrollLeft;
};

/**
 * Sets ScrollLeft
 * @param {Number} left The position.
 */
nitobi.ui.IScrollable.prototype.setScrollLeft = function(left)
{
	this.scrollableElement.scrollLeft = left; 
};

/**
 * Scrolls left by a specified amount or by 25.
 * @param {Number} scrollValue The amount by which to scroll. Default is 25.
 */
nitobi.ui.IScrollable.prototype.scrollLeft = function(scrollValue)
{
	scrollValue = scrollValue || 25
	this.scrollableElement.scrollLeft -= scrollValue; 
};

/**
 * Scrolls right by a specified amount or by 25.
 * @param {Number} scrollValue The amount by which to scroll. Default is 25.
 */
nitobi.ui.IScrollable.prototype.scrollRight = function(scrollValue)
{
	scrollValue = scrollValue || 25
	this.scrollableElement.scrollLeft += scrollValue; 
};

/**
 * Indicates whether the element has overflowed, ie, whether or not it is worth calling scroll functions.
 * @param {HTMLElement} reference The child element to test the container against. By default it is the scrollable
 * elements first child.
 */
nitobi.ui.IScrollable.prototype.isOverflowed = function(reference)
{
	reference = reference || this.scrollableElement.childNodes[0];
	return !(parseInt(nitobi.html.getBox(this.scrollableElement).width) >= parseInt(nitobi.html.getBox(reference).width));
};

