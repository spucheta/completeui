/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');

/**
 * @private
 */
NTB_CSS_HIDE = 'nitobi-hide';

/**
 * Creates an Element.
 * @class An abstract class that represents an element.  It abstracts the relationship between custom tags in the Nitobi
 * library and their html representation in the browser.  Many Nitobi components extend this class.  
 * @constructor
 * @param {String|XMLNode|HTMLElement} id The id of an element, or the node representing an element, or an HTML declaration for the element.
 * @extends nitobi.Object
 * @implements nitobi.base.ISerializable
 * @implements nitobi.ui.IStyleable
 */
nitobi.ui.Element = function(id)
{
	nitobi.ui.Element.baseConstructor.call(this);
	// ISerializable is initialized below so that we don't have to re-initialize it with another node.
	nitobi.ui.IStyleable.call(this);
	
	if (id != null)
	{
		if (nitobi.lang.typeOf(id) == nitobi.lang.type.XMLNODE)
		{
			// Assume that id is an XmlNode.
			nitobi.base.ISerializable.call(this,id);
		}
		else if ($ntb(id) != null)
		{
			// Assume a decl.
			var decl = new nitobi.base.Declaration();
			var xmlNode = decl.loadHtml($ntb(id));

			var oldContainer = $ntb(id);
			var parentNode = oldContainer.parentNode;
			var wrapper = parentNode.ownerDocument.createElement('ntb:component');
			parentNode.insertBefore(wrapper, oldContainer);
			parentNode.removeChild(oldContainer);
			this.setContainer(wrapper);

			nitobi.base.ISerializable.call(this,xmlNode);
						
		} else
		{
			nitobi.base.ISerializable.call(this);
			// Assume string.
			this.setId(id);
		}
	}
	else
	{
		nitobi.base.ISerializable.call(this);
	}
	
	/**
	 * @ignore
	 */
	this.eventMap = {};
	
	/**
	 * Fired when the object is created. {@link nitobi.ui.ElementEventArgs} are passed to the listener.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onCreated = new nitobi.base.Event("created");
	this.eventMap["created"] = this.onCreated;
	
	
	// API Events
	/**
	 * Fired on before render. {@link nitobi.ui.ElementEventArgs} are passed to the listener.
	 * @type nitobi.base.Event
	 */
	this.onBeforeRender = new nitobi.base.Event("beforerender");
	this.eventMap["beforerender"] = this.onBeforeRender;
	
	/**
	 * Fired on render. {@link nitobi.ui.ElementEventArgs} are passed to the listener.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onRender = new nitobi.base.Event("render");
	this.eventMap["render"] = this.onRender;
	
	/**
	 * Fired on before set visible. {@link nitobi.ui.ElementEventArgs} are passed to the listener.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onBeforeSetVisible = new nitobi.base.Event("beforesetvisible");
	this.eventMap["beforesetvisible"] = this.onBeforeSetVisible;
	/**
	 * Fired on set visible. {@link nitobi.ui.ElementEventArgs} are passed to the listener.
	 * @see nitobi.ui.ElementEventArgs
	 * @type nitobi.base.Event
	 */
	this.onSetVisible = new nitobi.base.Event("setvisible");
	this.eventMap["setvisible"] = this.onSetVisible;
	
	/**
	 * Fires before the element propagates an event 
	 * down the tree. If false is returned, then the propagation does
	 * not occur. If true is returned, then the default
	 * propagation occurs. EventNotificationEventArgs are passed to the event handler.
	 * @see nitobi.ui.EventNotificationEventArgs
	 * @private
	 * @type nitobi.base.Event;
	 */
	this.onBeforePropagate = new nitobi.base.Event("beforepropagate");
	
	/**
	 * Fired when the event needs handling by this object. EventNotificationEventArgs are passed to the event handler.
	 * @see nitobi.ui.EventNotificationEventArgs
	 * @private
	 * @type nitobi.base.Event;
	 */
	this.onEventNotify = new nitobi.base.Event("eventnotify");
	
	/**
	 * Fired before the object is notified. If this event returns false, then this.onEventNotify is not called. EventNotificationEventArgs are passed to the event handler.
	 * @see nitobi.ui.EventNotificationEventArgs
	 * @type nitobi.base.Event;
	 * @private
	 */
	this.onBeforeEventNotify = new nitobi.base.Event("beforeeventnotify");
		
	/**
	 * Fires before the element propagates an event 
	 * down the tree. If false is returned, then the propagation does
	 * not occur. If true is returned, then the default
	 * propagation occurs. This differs from onBeforeProgagate because
	 * at this point the childId is available. EventNotificationEventArgs are passed to the event handler.
	 * @see nitobi.ui.EventNotificationEventArgs
	 * @private
	 * @type nitobi.base.Event;
	 */
	this.onBeforePropagateToChild = new nitobi.base.Event("beforepropogatetochild");

	
	this.subscribeDeclarationEvents();
	
	this.setEnabled(true);
	
	/**
	 * The xsl document responsible for rendering the component.
	 * @type nitobi.html.XslRenderer
	 */
	this.renderer = new nitobi.html.XslRenderer();
	
};

nitobi.lang.extend(nitobi.ui.Element, nitobi.Object);
nitobi.lang.implement(nitobi.ui.Element,nitobi.base.ISerializable);
nitobi.lang.implement(nitobi.ui.Element,nitobi.ui.IStyleable);

/**
 * A cache of html nodes.
 * @ignore
 */
nitobi.ui.Element.htmlNodeCache = {};

/**
 * @private
 */
nitobi.ui.Element.prototype.setHtmlNode = function(htmlNode)
{
	var node = $ntb(htmlNode);
	this.htmlNode = node;
};

/**
 * Return the root's id.
 * @private
 */
nitobi.ui.Element.prototype.getRootId = function()
{
	var _parent = this.getParentObject();
	if (_parent == null)
	{
		return this.getId();
	}	
	else
	{
		return _parent.getRootId();
	}
}

/**
 * Returns the id of this object.
 * @type String
 */
nitobi.ui.Element.prototype.getId = function()
{
	return this.getAttribute("id");
}

/**
 * Each element has an id; sub elements have a name that is appended
 * to the id; this function retrieves both the "id" and the "localName" 
 * in a map.
 * @param {String} id The full id of the sub element.
 * @type Map
 */
nitobi.ui.Element.parseId = function(id)
{
	var ids = id.split(".");
	if (ids.length <= 2)
		return {localName:ids[1],id:ids[0]};
	return {localName:ids.pop(),id:ids.join('.')};
}

/**
 * Sets the id of the object.
 * @param {String} id The id to set.
 */
nitobi.ui.Element.prototype.setId = function (id)
{
	this.setAttribute("id",id);
}

/**
 * A catch all event notifier. If the child class does not override this function,
 * then element will just fire the event, whatever it is.
 * @private
 */
nitobi.ui.Element.prototype.notify = function(event, id, propagationList, cancelBubble)
{
	try
	{
		event = nitobi.html.getEvent(event);
		if (cancelBubble !== false)
		{
			nitobi.html.cancelEvent(event);
		}
		var targetId = nitobi.ui.Element.parseId(id).id;
		
		// If notify is called on this element, and the target doesn't exist here
		// then just return;
		if (!this.isDescendantExists(targetId))
		{
			return false;
		}
		var propagate = !(targetId == this.getId());
		var eventArgs = new nitobi.ui.ElementEventArgs(this,null,id);
		var eventNotificationArgs = new nitobi.ui.EventNotificationEventArgs(this,null,id,event);
		propagate = propagate && this.onBeforePropagate.notify(eventNotificationArgs);
		var result=true;
		if (propagate)
		{
			if (propagationList == null)
			{
				propagationList = this.getPathToLeaf(targetId);								
			}
			var fireNotify = this.onBeforeEventNotify.notify(eventNotificationArgs);
			var eventResult = (fireNotify ? this.onEventNotify.notify(eventNotificationArgs) : true);
			var nextId = propagationList.pop().getAttribute("id");
			var nextObject = this.getObjectById(nextId);
			var result = this.onBeforePropagateToChild.notify(eventNotificationArgs);
			if (nextObject.notify && result && eventResult)
			{
				result = nextObject.notify(event,id,propagationList,cancelBubble);
			}
		}
		else
		{
			result = this.onEventNotify.notify(eventNotificationArgs);
		}
		
		// Notify the nitobi event object for this event, if one exists.
		// e.g. if the event is onclick, then lookup to see if an Event object exists (e.g. this.onClick = new nitobi.base.Event())
		// and if it does, fire it.
		var objEvent = this.eventMap[event.type];
		if (objEvent != null && result)
		{
			objEvent.notify(this.getEventArgs(event, id));
		}
		
		return result;
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected + " Element.notify encountered a problem.",err);
	}
}

/**
 * Returns the event arguments, given the parameters of the event.
 * @param {Event} event the HTML event that is firing
 * @param {String} targetId the id of the node on which the event is firing  
 * @private
 */
nitobi.ui.Element.prototype.getEventArgs = function(event, targetId)
{
	var eventArgs = new nitobi.ui.ElementEventArgs(this,null,targetId)
	return eventArgs;
};

/**
 * Subscribes any events found in the decl to the corresponding event object.
 * @private
 */
nitobi.ui.Element.prototype.subscribeDeclarationEvents = function()
{
	for (var name in this.eventMap)
	{
		var ev = this.getAttribute("on" + name);
		if (ev != null && ev != "")
		{
			this.eventMap[name].subscribe(ev,this,name);
		}
	}
}

/**
 * Returns the HTML node associated with this element. If name is specified,
 * the HTML node searched for is assumed to be a sub-element of this object's node.
 * @example
 * var datepicker = nitobi.getComponent("myDatePicker");
 * var buttonElement = datepicker.getHtmlNode("button");
 * buttonElement.style.width = "300px";
 * @param {String} [name] The name of the sub element.
 * @type HTMLElement
 */
nitobi.ui.Element.prototype.getHtmlNode = function(name)
{
	var id = this.getId();
	id = (name != null ? id + "." + name : id); 
	var node = nitobi.ui.Element.htmlNodeCache[name];
	if (node==null)
	{
		node = $ntb(id);
		nitobi.ui.Element.htmlNodeCache[id] = node;		
	}
	return node;
};

/**
 * @private
 */
nitobi.ui.Element.prototype.flushHtmlNodeCache = function()
{
	nitobi.ui.Element.htmlNodeCache = {};
}

/**
 * Hide the component using the given effect. <code>effectClass</code> is the class of effect to 
 * use - <code>hide()</code> will instantiate a new effect object of this class.
 * @param {Class} [effectClass] The class of effect to use (if any) to hide the element
 * @param {Function} [callback] A function to evaluate after the element is shown
 * @param {Object} [params] The parameters to use with the hide effect.
 */
nitobi.ui.Element.prototype.hide = function(effectClass, callback, params)
{
	this.setVisible(false, effectClass, callback, params);
};

/**
 * Show the component using the given effect.  <code>effectClass</code> is the class of effect to 
 * use - <code>show()</code> will instantiate a new effect object of this class. 
 * @param {Class} [effectClass] The class of effect to use (if any) to show the element.
 * @param {Function} [callback] A function to evaluate after the element is shown.
 * @param {Object} params The parameters to use with the show effect.
 */
nitobi.ui.Element.prototype.show = function(effectClass, callback, params)
{
	this.setVisible(true, effectClass, callback, params);
};

/**
 * Returns <code>true</code> if the component has not been hidden. This value does not take into 
 * account the visibility of any parent objects.
 * @type Boolean
 */
nitobi.ui.Element.prototype.isVisible = function()
{
	var node = this.getHtmlNode();
	return node && !nitobi.html.Css.hasClass(node, NTB_CSS_HIDE);
};
/**
 * Show or hide the component using the given effect.  <code>effectClass</code> is the class 
 * of effect to use - <code>setVisible()</code> will instantiate a new effect object of this class. 
 * @param {Boolean} visible if <code>true</code>, show the component, otherwise hide
 * @param {Class} [effectClass] The class of effect to use (if any) to show the element
 * @param {Function} [callback] A function to evaluate after the element is shown
 * @param {Object} [params] The parameters to use with the effect.
 */
nitobi.ui.Element.prototype.setVisible = function(visible, effectClass, callback, params)
{

	var element = this.getHtmlNode();
	if (element && this.isVisible() != visible && this.onBeforeSetVisible.notify({source: this, event: this.onBeforeSetVisible, args: arguments}) !== false)
	{
		if (this.effect)
		{
			this.effect.end();
		}
		if (visible)
		{
			if (effectClass)
			{
				var effect = new effectClass(element, params);
				effect.callback = nitobi.lang.close(this, this.handleSetVisible, [callback]);
				this.effect = effect;
				effect.onFinish.subscribeOnce(nitobi.lang.close(this, function(){this.effect = null}));
				effect.start();
			}
			else
			{
				nitobi.html.Css.removeClass(element, NTB_CSS_HIDE);
				this.handleSetVisible(callback);
			}
		}
		else
		{
			if (effectClass)
			{
				var effect = new effectClass(element, params);
				effect.callback = nitobi.lang.close(this, this.handleSetVisible, [callback]);
				this.effect = effect;
				effect.onFinish.subscribeOnce(nitobi.lang.close(this, function(){this.effect = null}));
				effect.start();
			}
			else
			{
				nitobi.html.Css.addClass(this.getHtmlNode(), NTB_CSS_HIDE);
				this.handleSetVisible(callback);
			}
		}
	}
};

/**
 * @ignore
 */
nitobi.ui.Element.prototype.handleSetVisible = function(callback)
{
	if (callback) callback();
	this.onSetVisible.notify(new nitobi.ui.ElementEventArgs(this, this.onSetVisible));
};

/**
 * Enable or disable the component.
 * @param {Boolean} enabled
 */
nitobi.ui.Element.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;
};

/**
 * Check if the component is enabled.
 * @type Boolean
 */
nitobi.ui.Element.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Render the element.  Without arguments this will render the component in place of the in-page
 * XML declaration.
 * @param {HTMLElement} container a container whose inner HTML will be replaced 
 * by the rendered component (Optional)
 * @param {XMLDocument} state an XML document representing the state of the component (Optional)
 */
nitobi.ui.Element.prototype.render = function(container, state)
{
	this.flushHtmlNodeCache();
	state = state || this.getState();
	container = $ntb(container) || this.getContainer();
	
	if (container == null)
	{
		var container = document.createElement("span");
		document.body.appendChild(container);
		this.setContainer(container);
	}
	this.htmlNode = this.renderer.renderIn(container,state)[0];
	this.htmlNode.jsObject = this;
};

/**
 * Returns the HTML element into which the component is rendered.
 * @type HTMLElement
 */
nitobi.ui.Element.prototype.getContainer = function()
{
	return this.container;
};

/**
 * The container in which the element will be rendered.
 * @param {String|HTMLElement} container The id of the container or the container itself.
 */
nitobi.ui.Element.prototype.setContainer = function(container)
{
	this.container = $ntb(container);
};

/**
 * @private
 */
nitobi.ui.Element.prototype.getState = function()
{	
	return this.getXmlNode();
};
