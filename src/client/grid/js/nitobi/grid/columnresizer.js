// TODO: This needs to be merged with gridresizer to create a resize baseclass.

/**
 * @class
 * @private
 */
nitobi.grid.ColumnResizer = function(grid)
{
	this.grid = grid;

	/**
	 * The CSS class for the horizontal scrollbar range.
	 */
	this.hScrollClass = null;

	/**
	 * The line is the vertical resize line that the user sees.
	 * @private
	 * @type object
	 */

	this.grid_id = this.grid.UiContainer.parentid

	this.line = document.getElementById("ntb-column-resizeline" + this.grid.uid);
	
	this.lineStyle = this.line.style;
	if (nitobi.browser.IE)
	{
		/**
		 * The surface here is slipped underneath the 
		 * resize line to provide a smooth drag surface. Otherwise
		 * IE hooks on other tags. A little trick. The opacity is set to 1
		 * because if the bg is set to transparent, IE treats the element like 
		 * its not there.
		 * @private
		 * @type object
		 */
		this.surface = document.getElementById("ebagridresizesurface_");
		if (this.surface == null)
		{
			this.surface = document.createElement("div");
			this.surface.id = "ebagridresizesurface_";
			this.surface.className = "ntb-column-resize-surface";
			this.grid.UiContainer.appendChild(this.surface);		
		}
	}

	/**
	 * The index of the column that is being resized.
	 * @type Integer
	 */
	this.column;

	/**
	 * @private
	 * Event that fires after the resize of the column is complete.
	 */
	this.onAfterResize = new nitobi.base.Event();
}

nitobi.grid.ColumnResizer.prototype.startResize = function(grid, column, columnHeaderElement, evt)
{
	// TODO: This should be in the ctor but not avail from some objects.
	this.grid = grid;
	this.column = column;

	var x = nitobi.html.getEventCoords(evt).x;

	//	TODO: encapsulate this sort of mouse position calculation stuff in a cross browser lib
	// Calculate the current mouse position.
	if (nitobi.browser.IE) 
	{
		this.surface.style.display="block";
		nitobi.drawing.align(this.surface,this.grid.element,nitobi.drawing.align.SAMEHEIGHT | nitobi.drawing.align.SAMEWIDTH | nitobi.drawing.align.ALIGNTOP | nitobi.drawing.align.ALIGNLEFT);
//		this.surface.style.width = this.grid.getWidth() + "px";
//		this.surface.style.height = this.grid.getHeight() + "px";
  	}

  	this.x = x;

	// First make the resize line visible
	this.lineStyle.display = "block";

	// The div containing the resize line is a child of the grid's html, not the body
	// so we need to offset the position of the resize line by the Grid's x coord.
	var gridLeft = nitobi.html.getBoundingClientRect(this.grid.UiContainer).left;
	this.lineStyle.left = x - gridLeft + "px";

 	// Fit the line in the viewable area. 26 for the scrollbar
	this.lineStyle.height = this.grid.Scroller.scrollSurface.offsetHeight + "px";	

  	// Align the resize line to the column header element.
  	nitobi.drawing.align(this.line,columnHeaderElement,nitobi.drawing.align.ALIGNTOP,0,0,nitobi.html.getHeight(columnHeaderElement) + 1);

	nitobi.ui.startDragOperation(this.line, evt, false, true, this, this.endResize);
}

nitobi.grid.ColumnResizer.prototype.endResize = function(dragStopEventArgs)
{
	var x = dragStopEventArgs.x;
	var Y = dragStopEventArgs.y;

	if (nitobi.browser.IE)
	{
		this.surface.style.display="none";
	}

	var ls = this.lineStyle;
	ls.display="none";
	ls.top="-3000px";
	ls.left="-3000px";

	// dx is the difference between the start and end x coordinates
	this.dx = x - this.x;

	this.onAfterResize.notify(this);
}

nitobi.grid.ColumnResizer.prototype.dispose = function()
{
	this.grid = null;
	this.line = null;
	this.lineStyle = null;
	this.surface = null;
}
