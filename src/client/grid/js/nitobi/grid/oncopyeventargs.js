nitobi.lang.defineNs('nitobi.grid');

/**
 * Constructs a OnCopyEventArgs object.
 * @class When you subscribe to Grid events through the declaration, you
 * can optionally pass information about the event to the function
 * registered to handle it.  You do this by using the eventArgs keyword.
 * @constructor
 * @param {nitobi.grid.Grid} source The object which is firing the event.
 * @param {String} data The data that was copied in HTML table format.
 * @param {Object} coords The top left and bottom right coords, which are nitobi.drawing.Point objects. {"top":POINT,"bottom":POINT}.
 * @extends nitobi.grid.SelectionEventArgs
 * @private
 */
nitobi.grid.OnCopyEventArgs = function(source, data, coords)
{
	nitobi.grid.OnCopyEventArgs.baseConstructor.apply(this, arguments);
}

nitobi.lang.extend(nitobi.grid.OnCopyEventArgs, nitobi.grid.SelectionEventArgs);