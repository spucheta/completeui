/**
 * Responsible for doing grid resize animation.
 * @private
 */
nitobi.grid.GridResizer = function(grid)
{
	this.grid = grid;

	this.widthFixed = false;
	this.heightFixed = false;

	this.minHeight = 0;
	this.minWidth = 0;

	this.box = document.getElementById("ntb-grid-resizebox" + grid.uid);

	/**
	 * @private
	 * Event that fires after the resize of the object is complete.
	 */
	this.onAfterResize = new nitobi.base.Event();
}

/**
 * @private
 */
nitobi.grid.GridResizer.prototype.startResize = function(grid, event)
{
	this.grid = grid;

	var beforeGridResizeEventArgs = null; //new nitobi.grid.OnBeforeGridResizeEventArgs(this.grid);

// TODO: before grid resize event ...
//	if (!nitobi.event.evaluate(column.getOnBeforeGridResizeEvent(), beforeGridResizeEventArgs))
//	{
//		return;
//	}

	var x,y;

	var coords = nitobi.html.getEventCoords(event);
	x = coords.x;
	y = coords.y;

  	this.x = x;
  	this.y = y;

	var w = grid.getWidth();
	var h = grid.getHeight();
	
	var L = grid.element.offsetLeft;
	var T = grid.element.offsetTop;

	this.resizeW=!this.widthFixed;
	this.resizeH=!this.heightFixed;
	
	if (this.resizeW || this.resizeH) {
		this.box.style.cursor=(this.resizeW && this.resizeH)?"nw-resize":(this.resizeW)?"w-resize":"n-resize"
		this.box.style.display = "block";
//		this.box.style.width=(x-L) + "px";
//		this.box.style.height=(y-T) + "px";
		var alignment = nitobi.drawing.align.SAMEWIDTH | nitobi.drawing.align.SAMEHEIGHT | nitobi.drawing.align.ALIGNTOP | nitobi.drawing.align.ALIGNLEFT;
		nitobi.drawing.align(this.box,this.grid.element,alignment,0,0,0,0,false);
		
		this.dd = new nitobi.ui.DragDrop(this.box, false, false);
		this.dd.onDragStop.subscribe(this.endResize, this);
		this.dd.onMouseMove.subscribe(this.resize, this);
		this.dd.startDrag(event);
	}
}

/**
 * @private
 */
nitobi.grid.GridResizer.prototype.resize = function()
{
	var x = this.dd.x;
	var y = this.dd.y;

	var rect = nitobi.html.getBoundingClientRect(this.grid.UiContainer);
	var L = rect.left;
	var T = rect.top;

	this.box.style.display = "block";
	if ((x-L) > this.minWidth) this.box.style.width=(x-L) + "px";
	if ((y-T) > this.minHeight) this.box.style.height=(y-T) + "px";
}

/**
 * @private
 */
nitobi.grid.GridResizer.prototype.endResize = function()
{
	var x = this.dd.x;
	var y = this.dd.y;

	this.box.style.display = "none";
	var prevWidth = this.grid.getWidth();
	var prevHeight = this.grid.getHeight();
	this.newWidth = Math.max(parseInt(prevWidth) + (x - this.x), this.minWidth);
	this.newHeight = Math.max(parseInt(prevHeight) + (y - this.y), this.minHeight);
	if (isNaN(this.newWidth) || isNaN(this.newHeight))
		return;

	this.onAfterResize.notify(this)
}

/**
 * @private
 */
nitobi.grid.GridResizer.prototype.dispose = function()
{
	this.grid = null;
}
