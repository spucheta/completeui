/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.base');

/**
 * @constructor
 * @class General arguments class that is passed to JavaScript event handlers.
 * @param {Object} source The object that fired the event.
 * @param {Event} event An optional parameter that indicates which event was fired. If this is
 * not supplied, then the global nitobi.html.Event is used.
 */
nitobi.base.EventArgs = function(source,event)
{
	/**
	 * The object that fired the event.
	 * @type Object
	 */
	this.source = source;
	
	/**
	 * The event that was fired.
	 * @type nitobi.base.Event
	 */
	this.event = event || nitobi.html.Event;
}

/**
 * Returns the source object for the event.
 * @type Object
 */
nitobi.base.EventArgs.prototype.getSource = function()
{
	return this.source;
}

/**
 * Returns the native browser Event object for the event.
 * @type nitobi.base.Event
 */
nitobi.base.EventArgs.prototype.getEvent = function()
{
	return this.event;
}