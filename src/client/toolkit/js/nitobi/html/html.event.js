/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * Creates an Event object that encapsulates an html event.  Is supplied as an argument to functions handling events issued
 * through the EventManager
 * @class nitobi.html.Event is a cross-browser, globally accessible event object which is set when DOM events are fired 
 * through the EventManager.
 * @constructor
 */
nitobi.html.Event = function(){
	/**
	 * The DOM element on which the event was fired. This is equivalent to the <code>target</code> property in 
	 * the Firefox and Safari browsers.
	 * @type String
	 */
	this.srcElement = null;
	/**
	 * The DOM element from which activation or the mouse pointer is exiting during the event. 
	 * This is useful for mouseout type events.
	 * @type String
	 */
	this.fromElement = null;
	/**
	 * The DOM element from which activation or the mouse pointer is entering during the event. 
	 * This is useful for mouseout type events.
	 * @type String
	 */
	this.toElement = null;
	/**
	 * The DOM element to which the event handler was attached.
	 * @type String
	 */
	this.eventSrc = null;
};

/**
 * @private
 */
nitobi.html.handlerId = 0;
/**
 * @private
 */
nitobi.html.elementId = 0;
/**
 * @private
 */
nitobi.html.elements = [];
/**
 * @private
 */
nitobi.html.unload = [];
/**
 * @private
 */
nitobi.html.unloadCalled = false;

/**
 * Attaches multiple events to a single element
 * @param {HtmlElement} element The HTML element to which the events should be attached.
 * @param {Struct} events Structs of the events with type and handler properties.
 * @param {Object} context The context in which the handlers should be executed.
 * @type {Array}
 * @return Returns an array of GUIDs that can be used to detach the event handlers.
 */
nitobi.html.attachEvents = function(element, events, context)
{
	var guids = [];
	for (var i=0; i<events.length; i++)
	{
		var e = events[i];
		guids.push(nitobi.html.attachEvent(element, e.type, e.handler, context, e.capture || false));
	}
	return guids;
}

// TODO: implement an attachEventOnce method that is like subscribeOnce - that would be sweet

/**
 * Attaches the specified handler to the DOM element for the specified event type.
 * Returns the guid of the attached event handler, which can be used to detach events.
 * @param {HtmlElement} element Element on which the event is to be registered.
 * @param {String} type Event type such as 'click', 'mouseover' etc. Note that the 'on' prefix is dropped.
 * @param {Object} [context] Object that the callback function will be called on.
 * @param {Function} handler Function pointer to the function that will handle the event.
 * @param {Boolean} [capture] Specifies if event capturing should be used.
 * @param {Object} [override]
 * @type {String}
 */
nitobi.html.attachEvent = function(element, type, handler, context, capture, override)
{
	if (type == "anyclick")
	{
		if (nitobi.browser.IE)
		{
			nitobi.html.attachEvent(element, "dblclick", handler, context, capture, override);
		}
		type = "click";
	} 
	if (!(handler instanceof Function))
	{
		nitobi.lang.throwError("Event handler needs to be a Function");
	}

	//	Allow people to pass in a node id or an actual DOM node.
	element = $(element);

	// Divert unload attachments to custom unload registration
	if (type.toLowerCase() == 'unload' && override != true)
	{
		var funcRef = handler;
		if (context != null)
		{
			funcRef = function() {handler.call(context)};
		}
		return this.addUnload(funcRef);
	}

	//	Increment our unique id to keep it unique
	var handlerGuid = this.handlerId++;
	var elementGuid = this.elementId++;

	//	Check if the handler already has a guid or not
	//	The guid is used again when we detach the handler for an event
	if (typeof(handler.ebaguid) != "undefined")
	{
		handlerGuid = handler.ebaguid;
	}
	else
	{
		handler.ebaguid = handlerGuid;
	}

	//	Check the custom ebaguid property on the DOM Element object
	//	The ebaguid on the element is used to keep track of all elements that have had events attached
	if (typeof(element.ebaguid) == "undefined")
	{
		element.ebaguid = elementGuid;
		//	add a reference to the element in the elements hash - this could also just use array.push()
		nitobi.html.elements[elementGuid] = element;
	}

	//	The custom eba_events property on the DOM Element object contains
	//	all the events that have been registered on this element.
	if (typeof(element.eba_events) == "undefined")
	{
		element.eba_events = {};
	}

	//	The 'eba_events' property on the DOM node is a hash of the event type
	//	ie store all the handlers defined for event type 'mouseover' in another hash
	if (element.eba_events[type] == null)
	{
		element.eba_events[type] = {};

		//	Browser checking for IE / nitobi.browser.MOZ
		if (element.attachEvent)
		{
			// This maintains a reference to the closure we use as the event handler so we can clean it up later.
			element['eba_event_'+type] = function () {nitobi.html.notify.call(element, window.event)};
			//	Detach will need to be called to get rid of this closure...
			element.attachEvent('on'+type, element['eba_event_'+type]);

			if (capture && element.setCapture != null) element.setCapture(true);
		}
		else if (element.addEventListener)
		{
			// No need for this code really - only used for detachment purposes later.
			// If there are no more handlers attached for a certain event we clean things up by deleting this function reference.
			element['eba_event_'+type] = function () {nitobi.html.notify.call(element, arguments[0])};
			element.addEventListener(type, element['eba_event_'+type], capture);
		}
	}

	//	Once we get here the event has been hooked up 
	//	or it is already hooked up - either way we need to
	//	add the handler to the list of handlers to fire
	element.eba_events[type][handlerGuid] = {handler: handler, context: context};

	return handlerGuid;
}

/**
 * @private
 * The method that is used to handle all the DOM events and dispatch them accordingly.
 */
nitobi.html.notify = function(e)
{
	if (!nitobi.browser.IE)
	{
		e.srcElement = e.target;
		e.fromElement = e.relatedTarget;
		e.toElement = e.relatedTarget;
	}
	var element = this;
	e.eventSrc = element
	nitobi.html.Event = e;

	for (var handlerGuid in element.eba_events[e.type])
	{
		var event_ = element.eba_events[e.type][handlerGuid];
		if (typeof(event_.context) == "object")
		{
			//	Call the handler in the context of the object located in context.
			event_.handler.call(event_.context, e, element);
		}
		else
		{
			event_.handler.call(element, e, element);
		}
	}
}

/**
 * Detaches multiple events to a single element
 * 
 * @param {HTMLElement} element The HTML element to which the events should be detached from.
 * @param {Object} events Structs of the events with type and handler properties.
 */
nitobi.html.detachEvents = function(element, events)
{
	for (var i=0; i<events.length; i++)
	{
		var e = events[i];
		nitobi.html.detachEvent(element, e.type, e.handler);
	}
}

/**
 * Removes an event handler from an HTML element.
 * @param {HTMLElement} element The HTML element to remove the handler from.
 * @param {String} type The event type string such as "mouseover".
 * @param {Function | String} handler The event handler function reference or the GUID of the handler returned from the attachEvent function.
 * @see nitobi.html#attachEvent
 */
nitobi.html.detachEvent = function(element, type, handler)
{
	//	Allow either a node id or an actual DOM node.
	element = $(element);

	// Allow either a Function with a guid or just the guid
	var handlerGuid = handler; 
	if (handler instanceof Function)
		handlerGuid = handler.ebaguid;

	// If it is for an unload event it is special.
	if (type == "unload")
	{
		this.unload.splice(ebaguid,1);
	}

	//	Check if the event type and handler combination are defined
	if (element != null && element.eba_events != null && element.eba_events[type] != null && element.eba_events[type][handlerGuid] != null)
	{

		var handlers = element.eba_events[type];
		// Remove it from the list of handlers
		handlers[handlerGuid] = null;
		delete handlers[handlerGuid];

		//	What actually needs to be done here is ..
		//	if this is the last handler for a certain event type on an element to be removed
		//	then we need to detach it...
		// element['eba_event_'+type]

		if (nitobi.collections.isHashEmpty(handlers))
		{
			this.m_detach(element, type, element['eba_event_'+type]);
     		element['eba_event_'+type] = null;
     		element.eba_events[type] = null;
     		handlers = null;
     		if (element.nodeType == 1)
         		element.removeAttribute('eba_event_'+type);
		}
	}
	return true;
}

/**
 * @private
 * Does the event detachment leg work for both detachAllEvents and detachEvent.
 */
nitobi.html.m_detach = function(element, type, handler)
{
	if (handler != null && handler instanceof Function)
	{
		//	Detach in IE
		if (element.detachEvent)
		{
			element.detachEvent('on' + type, handler)
		}
		//	Remove in Firefox
		else if (element.removeEventListener)
		{
			element.removeEventListener(type, handler, false);
		}
		element['on' + type] = null;
	
		if (type == "unload")
		{
			//	Here we are doing unload so call all the things that are manually registered for unload
			for (var i=0; i<this.unload.length; i++)
			{
				this.unload[i].call(this);
				this.unload[i] = null;
			}
		}
	}
}

/**
 * Detaches all the events that have been attached using the <CODE>nitobi.html.attachEvent</CODE> method.
 */
nitobi.html.detachAllEvents = function(evt)
{
	//	TODO: this needs to be fixed not to use the looping through the array and use the hash instead
	for (var i=0; i<nitobi.html.elements.length; i++)
	{
		if (typeof(nitobi.html.elements[i]) != "undefined")
		{
			for (var eventType in nitobi.html.elements[i].eba_events)
			{
				//	Need to detach the nitobi.html.event.notify method from the element.
				nitobi.html.m_detach(nitobi.html.elements[i], eventType, nitobi.html.elements[i]['eba_event_'+eventType]);

				if (typeof(nitobi.html.elements[i]) != "undefined" && nitobi.html.elements[i].eba_events[eventType] != null)
				{
					for (var handlerGuid in nitobi.html.elements[i].eba_events[eventType])
					{
						nitobi.html.elements[i].eba_events[eventType][handlerGuid] = null;
					}
				}
				nitobi.html.elements[i]['eba_event_'+eventType] = null;
			}
		}
	}
	nitobi.html.elements = null;
}

/**
 * Used to register unload events since using the standard attachEvent can be problematic for unload events.
 */
nitobi.html.addUnload = function(funcRef)
{
	this.unload.push(funcRef);
	return this.unload.length-1;
}

/**
 * Cancels the event provided as the single argument.
 * @param {nitobi.html.Event} evt The event that should be cancelled.
 */
nitobi.html.cancelEvent = function(evt)
{
	nitobi.html.stopPropagation(evt);
	nitobi.html.preventDefault(evt);
}

/**
 * Stops the event bubbling.
 * @param {nitobi.html.Event} The event that should be stopped.
 */
nitobi.html.stopPropagation = function(evt)
{
	if (evt == null)
		return;

	if (nitobi.browser.IE)
		evt.cancelBubble = true;
	else
		evt.stopPropagation();
}

/**
 * Prevents the event default behaviour from occuring.
 * @param {nitobi.html.Event} The event whose default behaviour should be prevented.
 */
nitobi.html.preventDefault = function(evt, v)
{
	if (evt == null)
		return;

	if (nitobi.browser.IE)
		evt.returnValue = false;
	else
		evt.preventDefault();
	
	if (v!=null)
		e.keyCode = v;
}

// TODO: create separate cancelBubble and preventDefault functions 

/**
 * The coordinates of the event in the format of <CODE>{"x":0,"y":0}</CODE>.
 * @param {nitobi.html.Event} That event object of the event for which the coordinates are required.
 * @type Object
 */
nitobi.html.getEventCoords = function(evt)
{
    var coords = {'x':evt.clientX,'y':evt.clientY};
    if (nitobi.browser.IE) 
    {
    	// TODO: document.body if not standards mode.
        coords.x += document.documentElement.scrollLeft + document.body.scrollLeft;
        coords.y += document.documentElement.scrollTop + document.body.scrollTop;
    }
    else
    {
        coords.x += window.scrollX;
        coords.y += window.scrollY;
    }

    return coords;
}

/**
 * Depending on the browser, return the event object for the event handler
 * in scope.
 * @param {Object} event The firefox event object.
 * @type Object
 */
nitobi.html.getEvent = function(event)
{
	if (nitobi.browser.IE)
	{
		return window.event;
	}
	else
	{
		// TODO: add in support for adding the proper event coords.
		event.srcElement = event.target;
		event.fromElement = event.relatedTarget;
		event.toElement = event.relatedTarget;
		return event;	
	}
}

/**
 *	createEvent is used to manually create and fire an event.
 * @private
 */
nitobi.html.createEvent = function(evtType, evtName, evtObj, params)
{
	if (nitobi.browser.IE)
	{
		//	need to re-factor this one ... 
		evtObj.target.fireEvent('on'+evtName);
	}
	else
	{
		// check out http://developer.mozilla.org/en/docs/DOM:document.createEvent#Notes
		// create and init a new event
		var newEvent = document.createEvent(evtType);
		newEvent.initKeyEvent(evtName, true, true, document.defaultView, evtObj.ctrlKey, evtObj.altKey, evtObj.shiftKey, evtObj.metaKey, params.keyCode, params.charCode);

		/*
		switch (evtType)
		{
			case "IUEvent":
				newEvent.initUIEvent(evtName, true, true, document.defaultView, 1);
				break;
			case "MouseEvents":
				newEvent.initMouseEvent(evtName, true, true, document.defaultView, 1, params.screenX, params.screenY, params.clientX, params.clientY, evtObj.ctrlKey, evtObj.altKey, evtObj.shiftKey, evtObj.metaKey, params.button, params.relatedTarget);
				break;
			case "TextEvent":
				newEvent.initTextEvent();
				break;
			case "MutationEvent":
				newEvent.initMutationEvent();
				break;
			case "KeyboardEvent":
			case "KeyEvents":
				newEvent.initKeyEvent(evtName, true, true, document.defaultView, evtObj.ctrlKey, evtObj.altKey, evtObj.shiftKey, evtObj.metaKey, params.keyCode, params.charCode);
				break;
			default:
				newEvent.initEvent(evtName, true, true);
				break;
		}
		*/

		// dispatch new event in old event's place
		evtObj.target.dispatchEvent(newEvent);
	}
}

//This ensures that all events registered through the event manager will be set free!
nitobi.html.unloadEventId = nitobi.html.attachEvent(window, "unload", nitobi.html.detachAllEvents, nitobi.html, false, true);
