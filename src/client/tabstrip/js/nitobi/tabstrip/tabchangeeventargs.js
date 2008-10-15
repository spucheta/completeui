/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');

/**
 * Creates a TabChangeEventArgs object.  An instance of this class is passed to the function handling events
 * relating to tab changes.
 * @constructor
 * @class Used to supply arguments when changing tabs.
 * @extends nitobi.ui.ElementEventArgs
 * @param {Object} source The object that fired the event.
 * @param {nitobi.base.Event} event The event that is being fired.
 * @param {String} targetId The id of the event target.
 * @param {nitobi.tabstrip.Tab} activeTab The tab that is active.
 * @param {nitobi.tabstrip.Tab} tab The tab that is about to become active.
 */
nitobi.tabstrip.TabChangeEventArgs = function(source, event, targetId, activeTab, tab)
{
	nitobi.tabstrip.TabChangeEventArgs.baseConstructor.apply(this,arguments);
	
	/**
	 * The tab that is active.
	 * @type nitobi.tabstrip.Tab
	 */
	this.activeTab = activeTab || null;
	/**
	 * The tab that is about to become active.
	 * @type nitobi.tabstrip.Tab
	 */
	this.tab = tab || null;
}

nitobi.lang.extend(nitobi.tabstrip.TabChangeEventArgs,nitobi.ui.ElementEventArgs);