/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**************************************************************************/
/*					nitobi.ui.DragDrop	     	      
/**************************************************************************/
nitobi.lang.defineNs("nitobi.ui");
if (false)
{
	/**
	 * @namespace
	 * @constructor
	 */
	nitobi.ui = function(){};
}

/**
 * Start a drag/drop event.
 * @example
 * onmousedown="nitobi.ui.startDragOperation(this.parentNode,event)"
 * @param element {Object} The element to drag.
 * @param event {Object} Mozilla event object.
 * @param allowVertDrag {Boolean} True to allow vertical dragging.
 * @param allowHorizDrag {Boolean} True to allow horizontal dragging.
 * @param context {Object} The context to invoke the onMouseUpEvent handler.
 * @param onMouseUpEvent {Function} The method to invoke onmouseup
 */
nitobi.ui.startDragOperation = function(element, event, allowVertDrag, allowHorizDrag,context,onMouseUpEvent)
{
	var ddo = new nitobi.ui.DragDrop(element, allowVertDrag, allowHorizDrag);
	ddo.onDragStop.subscribe(onMouseUpEvent, context);
	ddo.startDrag(event);
}

/**
 * Create a DragDrop object to help manage drag/drop interactions.
 * @class A Drag and Drop library that allows the user to drag an element around the page.
 * @constructor
 * @example 
 * function mouseDownHandler(event)
 * {
 * 	var dd = new nitobi.ui.DragDrop(someDraggleElement, false, false);
 * 	dd.startDrag(event);
 * }
 * @param element {Object} The element to drag.
 * @param event {Object} Mozilla event object.
 * @param allowHorizDrag {Boolean} True to allow horizontal dragging.
 */
nitobi.ui.DragDrop = function(element, allowVertDrag, allowHorizDrag)
{
	this.allowVertDrag = (allowVertDrag!=null ? allowVertDrag : true)
	this.allowHorizDrag = (allowHorizDrag!=null ? allowHorizDrag : true)

	if (nitobi.browser.IE)
	{
		/**
		 * @private
		 */
		this.surface = document.getElementById("ebadragdropsurface_");
		if (this.surface == null)
		{
			this.surface = nitobi.html.createElement("div", {"id":"ebadragdropsurface_"}, {
				"filter":"alpha(opacity=1)",
				"backgroundColor":"white",
				"position":"absolute",
				"display":"none",
				"top":"0px",
				"left":"0px",
				"width":"100px",
				"height":"100px",
				"zIndex":"899"
			});
			document.body.appendChild(this.surface);		

		}
	}
	
	// What if the node is a text node.
	if (element.nodeType == 3) alert("Text node not supported. Use parent element");
	
	/**
	 * @ignore
	 */
	this.element = element;

	/**
	 * @ignore
	 */
	this.zIndex=this.element.style.zIndex;
  	this.element.style.zIndex=900;

	this.onMouseMove = new nitobi.base.Event();
	this.onDragStart = new nitobi.base.Event();
	this.onDragStop = new nitobi.base.Event();

    /**
     * These are the events for the drag and drop that are attached / detached all the time
     */
    this.events = [{"type":"mouseup","handler":this.handleMouseUp,"capture":true}, {"type":"mousemove","handler":this.handleMouseMove,"capture":true}];
}

/**
 * Starts the dragging operation.
 * @param {Object} event The dom event that triggered the drag operation.
 */
nitobi.ui.DragDrop.prototype.startDrag = function (event) {
	/**
	 * @ignore
	 */
  	this.elementOriginTop  = parseInt(this.element.style.top,  10);
  	/**
	 * @ignore
	 */
  	this.elementOriginLeft = parseInt(this.element.style.left, 10);
  	

  	if (isNaN(this.elementOriginLeft)) this.elementOriginLeft = 0;
  	if (isNaN(this.elementOriginTop )) this.elementOriginTop = 0;

	var coords = nitobi.html.getEventCoords(event);
	x = coords.x;
	y = coords.y;

  	/**
  	 * The x coordinate from where the object was dragged.
  	 * @type int 
  	 */	
	this.originX = x;
	 /**
  	 * The y coordinate from where the object was dragged.
  	 * @type int 
  	 */	
  	this.originY = y;

    nitobi.html.attachEvents(document, this.events, this);

  	nitobi.html.cancelEvent(event);

	this.onDragStart.notify();
}

/**
 * @private
 */
nitobi.ui.DragDrop.prototype.handleMouseMove = function (event) 
{
	var x, y;

	var coords = nitobi.html.getEventCoords(event);
	x = coords.x;
	y = coords.y;

	if (nitobi.browser.IE) 
	{
		// TODO: this should all be in getBodyArea and it should work...
		this.surface.style.display="block";
		if (document.compat == "CSS1Compat") {
			var bodyCoords = nitobi.html.getBodyArea();
			var offset = 0;
			// TODO: Fix this hack for IE standards
			// IE standards coords are off by a bit
			if (document.compatMode == "CSS1Compat")
				offset = 25;
			this.surface.style.width = (bodyCoords.clientWidth-offset) + "px";
			this.surface.style.height = (bodyCoords.clientHeight) + "px";
		} else {
			this.surface.style.width = document.body.clientWidth;
			this.surface.style.height = document.body.clientHeight;
		}
/*		if (document.compat == "CSS1Compat") {
			this.surface.style.width = document.documentElement.clientWidth + "px";
			this.surface.style.height = document.documentElement.clientHeight + "px";
		} else {
			this.surface.style.width = document.body.clientWidth;
			this.surface.style.height = document.body.clientHeight;
		}*/
	}

	if (this.allowHorizDrag) this.element.style.left = (this.elementOriginLeft + x - this.originX) + "px";
	if (this.allowVertDrag)  this.element.style.top  = (this.elementOriginTop  + y - this.originY) + "px";

	this.x=x;
	this.y=y;

	this.onMouseMove.notify(this);

	nitobi.html.cancelEvent(event);
}

/**
 * @private
 */
nitobi.ui.DragDrop.prototype.handleMouseUp = function(event)
{
	this.onDragStop.notify({"event":event,"x":this.x,"y":this.y});

    nitobi.html.detachEvents(document, this.events);

	if (nitobi.browser.IE)
		this.surface.style.display="none";

  this.element.style.zIndex = this.zIndex;
  this.element.object = null; 
  this.element = null;
}