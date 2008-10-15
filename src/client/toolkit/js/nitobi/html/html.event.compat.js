/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.event");

/**
 * @namespace nitobi.event is a cross-browser DOM and JavaScript event registration system. 
 * It is a global object and so the contstructor does not need to be called.
 * @constructor
 * @private
 */
nitobi.event = function(){};

/**
 * @private
 */
nitobi.event.keys = {};

/**
 * @private
 */
nitobi.event.guid = 0;

/**
 * @private
 */
nitobi.event.subscribe = function(key, method)
{
	ntbAssert(key.indexOf("undefined")==-1,"Something used nitobi.event with an invalid key. The key was " + key);
	nitobi.event.publish(key);
	var guid = this.guid++;
	this.keys[key].add(method, guid);
	return guid;
}

/**
 * @private
 */
nitobi.event.unsubscribe = function(key, guid)
{
	ntbAssert(key.indexOf("undefined")==-1,"Something used nitobi.event with an invalid key. The key was " + key);
	if (this.keys[key] == null) return true;
	if (this.keys[key].remove(guid)) {
		this.keys[key] = null;
		delete this.keys[key];
	}
}

/**
 * @private
 */
nitobi.event.evaluate = function(func, eventArgs)
{
	var retVal = true;
	if (typeof func == "string")
	{
		func = func.replace(/eventArgs/gi,"arguments[1]");
		var result = eval(func);
		retVal = (typeof(result)=="undefined"?true:result);
	}
	return retVal;
}

/**
 * @private
 */
nitobi.event.publish = function(key)
{
	ntbAssert(key.indexOf("undefined")==-1,"Something used nitobi.event with an invalid key. The key was " + key);
	if (this.keys[key] == null) this.keys[key] = new nitobi.event.Key();
}

/**
 * @private
 */
nitobi.event.notify = function(key, evtArgs)
{
	ntbAssert(key.indexOf("undefined")==-1,"Something used nitobi.event with an invalid key. The key was " + key);
	if (this.keys[key] != null)
	{
		return this.keys[key].notify(evtArgs);
	}
	else
	{
		// TODO: Throw a warning message ... 
		return true;
	}
}

/**
 * @private
 */
nitobi.event.dispose = function()
{
	for (var key in this.keys)
	{
		if (typeof(this.keys[key]) == "function")
		{
			this.keys[key].dispose();
		}
	}
	this.keys = null;
}



/**
 * It contains an array of hanlders that require notification when the key is called to be notified
 * @class EventKey represents a key for publishing or subscribing to an event.
 * @constructor
 * @ignore
 * @private
 */
nitobi.event.Key = function()
{
	/**
	 * @private
	 */
	this.handlers = {};
}
/**
 * @private
 * @ignore
 */
nitobi.event.Key.prototype.add = function(method, guid)
{
	ntbAssert(method instanceof Function,'EventKey.add requires a JavaScript function pointer as a parameter.','',EBA_THROW);
	this.handlers[guid] = method;
}
/**
 * @private
 * @ignore
 */
nitobi.event.Key.prototype.remove = function(guid)
{
	this.handlers[guid] = null;
	delete this.handlers[guid];
	// return true if there are no more handlers
	var i=true;
	for (var item in this.handlers) {
		i=false;
		break;
	}
	return i;
}
/**
 * @private
 * @ignore
 */
nitobi.event.Key.prototype.notify = function(evtArgs)
{
	var fail = false;
	for (var item in this.handlers)
	{
		var handler = this.handlers[item];
		if (handler instanceof Function)
		{
			var rv = (handler.apply(this, arguments)==false);
			fail = fail || rv;
		}
		else
		{
			// ntbAssert(false,'There is no function','',EBA_THROW);
		}
	}
	return !fail;
}

/**
 * @private
 * @ignore
 */
nitobi.event.Key.prototype.dispose = function()
{
	for (var handler in this.handlers)
	{
		this.handlers[handler] = null;
	}
}


/**
 * @private
 * @ignore
 */
nitobi.event.Args = function(src)
{
	this.source = src;
}
/**
 * @private
 * @ignore
 */
nitobi.event.Args.prototype.callback = function()
{
}

/**
 * Cancels 
 * @private
 */
nitobi.html.cancelBubble = nitobi.html.cancelEvent;
