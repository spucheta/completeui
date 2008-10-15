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
 * @class An arguments class that is passed to function subscribed to style change events (i.e. {@link nitobi.ui.IStyleable}).
 * @extends nitobi.base.EventArgs
 * @param {Object} source The object that fired the event.
 * @param {nitobi.base.Event} event The event that is being fired.
 * @param {String} property The style property that was changed (color, borderLeft, etc).
 * @param {String} value The value that the property was set to.
 */
nitobi.ui.StyleEventArgs = function(source, event, property, value)
{
	nitobi.ui.ElementEventArgs.baseConstructor.apply(this,arguments);
	
	/**
	 * The style property that was set.
	 * @type String
	 */
	this.property = property || null;
	/**
	 * The new value of the property.
	 * @type String
	 */
	this.value = value || null;
}

nitobi.lang.extend(nitobi.ui.StyleEventArgs,nitobi.base.EventArgs);