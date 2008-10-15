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
 * @class General arguments class that is passed to JavaScript event handlers.
 * @extends nitobi.base.EventArgs
 * @param {Object} source The object that fired the event.
 * @param {nitobi.base.Event} event The event that is being fired.
 * @param {String} targetId The id of the event target.
 */
nitobi.ui.ElementEventArgs = function(source, event, targetId)
{
	nitobi.ui.ElementEventArgs.baseConstructor.apply(this,arguments);
	
	/**
	 * The id of the event target.
	 * @type String
	 */
	this.targetId = targetId || null;
}

nitobi.lang.extend(nitobi.ui.ElementEventArgs,nitobi.base.EventArgs);