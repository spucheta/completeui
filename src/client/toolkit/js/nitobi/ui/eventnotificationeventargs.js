/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');

/**
 * @constructor
 * @class Used to supply arguments when custom event processing is required in element.
 * @extends nitobi.ui.ElementEventArgs
 * @param {Object} source The object that fired the event.
 * @param {nitobi.base.Event} event The event that is being fired.
 * @param {String} targetId The id of the event target.
 * @param {HTMLEvent} htmlEvent
 */
nitobi.ui.EventNotificationEventArgs = function(source, event, targetId, htmlEvent)
{
	nitobi.ui.EventNotificationEventArgs.baseConstructor.apply(this,arguments);
	
	/**
	 * The browser-native event object.
	 * @type HTMLEvent
	 */
	this.htmlEvent = htmlEvent|| null;
}

nitobi.lang.extend(nitobi.ui.EventNotificationEventArgs,nitobi.ui.ElementEventArgs);