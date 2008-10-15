nitobi.lang.defineNs("nitobi.grid");

/**
 * Constructs a EditCompleteEventArgs object.
 * @class When you subscribe to Grid events through the declaration, you
 * can optionally pass information about the event to the function
 * registered to handle it.  You do this by using the eventArgs keyword.
 * EditCompleteEventArgs is the single parameter passed to the 
 * EditComplete handler of the Editor.
 * @constructor
 * @private 
 */
nitobi.grid.EditCompleteEventArgs = function(obj, display, store, cell)
{
	this.editor = obj;
	this.cell = cell;
	this.databaseValue = store;
	this.displayValue = display;
}

nitobi.grid.EditCompleteEventArgs.prototype.dispose = function()
{
	this.editor = null;
	this.cell = null;
	this.metadata = null;
}