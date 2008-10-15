/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * Creates an instance of IDraggable.  You should implement this interface
 * in class and instantiate that class.
 * Defines an interface for Nitobi UI classes that are to be draggable.
 * @class
 * @constructor
 * @param {HTMLElement} element The HTML element that is draggable.
 */
nitobi.ui.IDraggable = function nitobi_ui_IDraggable(element)
{
	this.DragElement = element;
}

/**
 * Returns a reference to the HTML element that is draggable.
 */
nitobi.ui.IDraggable.prototype.getDragElement = function()
{
	return this.DragElement;
}

/**
 * Makes the specified object draggable.
 * @param {Object} obj A nitobi object like an instance of a nitobi.ui.Panel.
 */
nitobi.ui.IDraggable.makeDraggable = function(obj, element)
{
	obj.DragElement = element;
	obj.getDragElement = createFunction(obj, nitobi.ui.IDraggable.prototype.getDragElement);
}

/**
 * @private
 */
function createFunction(obj, func)
{
	return function() {return func.apply(obj, arguments)};
}