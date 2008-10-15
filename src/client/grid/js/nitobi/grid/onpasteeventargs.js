nitobi.lang.defineNs('nitobi.grid');

/**
 * Event arguments for when data is pasted into the Grid.
 * @constructor
 * @param {nitobi.grid.Grid} source The Grid which is firing the event.
 * @param {String} data The data that is being copied in either tab separated or HTML table format.
 * @param {Object} coords The top left and bottom right coords, which are nitobi.drawing.Point objects. {"top":POINT,"bottom":POINT}.
 * @extends nitobi.grid.SelectionEventArgs
 * @private
 */
nitobi.grid.OnPasteEventArgs = function(source, data, coords)
{
	nitobi.grid.OnPasteEventArgs.baseConstructor.apply(this, arguments);
}

nitobi.lang.extend(nitobi.grid.OnPasteEventArgs, nitobi.grid.SelectionEventArgs);