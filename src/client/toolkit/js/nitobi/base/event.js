/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

/**
 * Creates an event object.
 * @class Based on the MVC pattern, the Event class is used for attaching 
 * event handlers to JavaScript objects.
 * <pre class="code">
 * &#102;unction handleEvent(eventArgs) {
 * 	// Do something with the event arguments...
 * }
 *
 * var onItemSelected = new nitobi.base.Event();
 * onItemSelected.subscribe(handleEvent);
 * 
 * // When the item is selected, fire the event.
 * onItemSelected.notify(eventArgs = {arg1: 'val1', arg2: 'val2'});
 * </pre>
 * @constructor
 * @param {String} [type] The type of event, e.g., "click", "mouseover" etc.  Does not affect the behaviour of the 
 * event object.
 */
nitobi.base.Event = function(type)
{
	/**
	 * The type of event this is.
	 * @private
	 * @type String
	 */
	this.type = type;
	/**
	 * @ignore
	 */
	this.handlers = {};
	/**
	 * @ignore
	 */
	this.guid = 0;
	this.setEnabled(true);
}

/**
 * Subscribes a method with a given context to the event.
 * @example
 * var onClick = new nitobi.base.Event();
 * onClick.subscribe(myClickHandlerFunction);
 * @param {Function} method The event handler to be executed when the event is fired.
 * @param {Object} [context] The JavaScript object in the context of which the event handler is to be executed.
 * @param {String} [guid] A custom GUID. Must be unique.
 * @return The unique ID of the subscription - it can be used for unsubscription.
 * @type Number
 */
nitobi.base.Event.prototype.subscribe = function(method, context, guid)
{
	if (method == null)
		return;

	var func = method;
	if (typeof(method) == "string")
	{
		var s = method;
		//Because javascript can have characters in it that are not going to get through XSL properly,
		//this next set of replaces has been added to allow specially embedded characters to get through.
		s = s.replace(/\#\&lt\;\#/g,"<").replace(/\#\&gt\;\#/g,">").replace(/\#\&amp;lt\;\#/g,"<").replace(/\#\&amp;gt\;\#/g,">").replace(/\/\*EQ\*\//g,"=").replace(/\#\Q\#/g,"\"").replace(/\#\&amp\;\#/g,"&");
		s = s.replace(/eventArgs/g,'arguments[0]');
		method = nitobi.lang.close(context, function(){eval(s)});
	}
	if (typeof context == "object" && method instanceof Function)
	{
		func = nitobi.lang.close(context, method);
	}
	guid = guid || func.observer_guid || method.observer_guid || this.guid++;
	func.observer_guid = guid;
	method.observer_guid = guid;
	this.handlers[guid] = func;
	return guid;
}

/**
 * Subscribes a method to the event so that it will fire only once.  When method 
 * is executed (on an event notification) it is immediately unsubscribed.
 * @param {Function} method The event handler to be executed when the event is fired. 
 * @param {Object} context The JavaScript object in the context of which the event handler is to be executed. Optional.
 * @return The unique ID of the subscription - it can be used for unsubscription.
 * @type Number 
 */
nitobi.base.Event.prototype.subscribeOnce = function(method, context)
{
	var guid = null;
	var _this = this;
	var func1 = function()
	{
		method.apply(context || null, arguments);
		_this.unSubscribe(guid);
	}
	guid = this.subscribe(func1);
	return guid;
}

/**
 * Unsubscribes a method from an event.
 * @param {Number|Function} guid The ID of the subscription to remove or the function to unsubscribe.
 */
nitobi.base.Event.prototype.unSubscribe = function(guid)
{
	if (guid instanceof Function)
		guid = guid.observer_guid;
	this.handlers[guid] = null;
	delete this.handlers[guid];
}
/**
 * Executes all the event handlers that have been subscribed to this event.
 * Event handlers should return boolean values.
 * @param {Object} evtArgs Arbitrary event arguments that are passed to the event handler functions.
 * @type Boolean
 */
nitobi.base.Event.prototype.notify = function(evtArgs)
{
	if (this.enabled)
	{
		if (arguments.length == 0)
		{
			arguments = new Array();
			arguments[0] = new nitobi.base.EventArgs(null,this);
			arguments[0].event = this;
			arguments[0].source = null;
		} else if (typeof(arguments[0].event) != "undefined" && arguments[0].event == null)
		{
			arguments[0].event = this;
		}
		var fail = false;
		for (var item in this.handlers)
		{
			var handler = this.handlers[item];
			if (handler instanceof Function)
			{
				var rv = (handler.apply(this, arguments)==false);
				fail = fail || rv;
			}
		}
		return !fail;
	}
	return true;
}

/**
 * Cleans up any dangling closures.
 */
nitobi.base.Event.prototype.dispose = function()
{
	for (var handler in this.handlers)
	{
		this.handlers[handler] = null;
	}
	this.handlers = {};
}

/**
 * Enable or disable this event. After calling this method with <CODE>enabled === false</CODE>, calls to 
 * <CODE>notify</CODE> will be ignored.
 * @param {Boolean} enabled the new enabled value
 */
nitobi.base.Event.prototype.setEnabled = function(enabled)
{
	this.enabled = enabled;	
};

/**
 * Returns <code>true</code> if the event is enabled, <code>false</code> if not.
 * @type Boolean
 */
nitobi.base.Event.prototype.isEnabled = function()
{
	return this.enabled;
};
 