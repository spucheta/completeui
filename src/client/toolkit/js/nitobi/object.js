/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**************************************************************************/
/*					nitobi.Object	     	      
/**************************************************************************/
nitobi.lang.defineNs("nitobi");

/**
 * Creates a <code>nitobi.Object</code>.
 * @class The class from which all other nitobi classes derive.
 * @constructor
 */
nitobi.Object = function() 
{
	/**
	 * A collection of objects that are destroyed when the object is unloaded.
	 * @private
	 * @type Array
	 */
	this.disposal= new Array();

	/**
	 * A hash of cached XML nodes in the object model representation.
	 * @private
	 */
	this.modelNodes = {};
}

/**
 * Sets the internal values of the object based on a configuration object.
 * The values are set with the following precedence:
 *  - if there is a property with the same name it will be set.
 *  - if there is a method with the same name it will be called with the value from the configuration object as the single argument.
 *  - if there is a setter (setPropertyName) it will be called with the value from the configuration object as the single argument.
 *  - otherwise it will just set the property.
 * @private
 * @param {Object} values An object containing the values to be set.
 */
nitobi.Object.prototype.setValues = function(values)
{
	// Sets values on the object using a struct
	for (var item in values)
	{
		if (this[item] != null)
		{
			if (this[item].subscribe != null)
			{
			}
			else
			{
				this[item] = values[item];
			}
		}
		else if (this[item] instanceof Function)
			this[item](values[item]);
		else if (this['set'+item] instanceof Function)
			this['set'+item](values[item]);
		else
			this[item] = values[item];
	}
}

/**
 * @private
 */
nitobi.Object.prototype.xGET= function(){
	var node = null, xpath = "@"+arguments[0], val = "";
	var cachedNode = this.modelNodes[xpath];
	if (cachedNode != null)
		node = cachedNode;
	else
		node = this.modelNodes[xpath] = this.modelNode.selectSingleNode(xpath);

	if (node!=null)
		val = node.nodeValue;

	return val;
}

/**
 * @private
 */
nitobi.Object.prototype.xSET= function(){
	var node = null, xpath = "@"+arguments[0];
	var cachedNode = this.modelNodes[xpath];
	if (cachedNode != null)
		node = cachedNode;
	else 
		node = this.modelNodes[xpath] = this.modelNode.selectSingleNode(xpath);
	if (node == null) 	// Create the attribute
		this.modelNode.setAttribute(arguments[0], "");
	if (arguments[1][0] != null && node != null)
	{
		// TODO: REMOVE THIS CAUSE IT IS DONE IN XBSET
		if (typeof(arguments[1][0]) == "boolean")
			node.nodeValue=nitobi.lang.boolToStr(arguments[1][0]);
		else
			node.nodeValue=arguments[1][0];
	}
}

/**
 * @private
 */
nitobi.Object.prototype.eSET=function(name, args)
{
	var oFunction = args[0];
	var funcRef = oFunction;

	var subName = name.substr(2);
	subName = subName.substr(0,subName.length-5);

	if (typeof(oFunction) == 'string')
	{
		funcRef = function() {return nitobi.event.evaluate(oFunction,arguments[0])};
	}
	if (this[name] != null)
	{
		this.unsubscribe(subName, this[name]);
	}

	// name should be OnCellClickEvent but we just expect CellClick for firing
	var guid = this.subscribe(subName,funcRef);
	this.jSET(name, [guid]);
	return guid;
}

/**
 * @private
 */
nitobi.Object.prototype.eGET=function()
{
	// TODO: implement something here... will be useful once we have objects for events
}

/**
 * @private
 */
nitobi.Object.prototype.jSET= function(name, val)
{
	this[name] = val[0];
}

/**
 * @private
 */
nitobi.Object.prototype.jGET= function(name)
{
	return this[name];
}

/**
 * @private
 */
nitobi.Object.prototype.xsGET=nitobi.Object.prototype.xGET;

/**
 * @private
 */
nitobi.Object.prototype.xsSET=nitobi.Object.prototype.xSET;

/**
 * @private
 */
nitobi.Object.prototype.xbGET=function(){
	return nitobi.lang.toBool(this.xGET.apply(this, arguments), false);
}

/**
 * @private
 */
nitobi.Object.prototype.xiGET=function(){
	return parseInt(this.xGET.apply(this, arguments));
}

/**
 * @private
 */
nitobi.Object.prototype.xiSET=nitobi.Object.prototype.xSET;

/**
 * @private
 */
nitobi.Object.prototype.xdGET=function(){
}

/**
 * @private
 */
nitobi.Object.prototype.xnGET=function(){
	return parseFloat(this.xGET.apply(this, arguments));
}

/**
 * @private
 */
nitobi.Object.prototype.xbSET= function(){
	this.xSET.call(this, arguments[0], [nitobi.lang.boolToStr(arguments[1][0])]);
}

// TODO: Remove the subscribe and fire methods to IObservable which the grid implements.
/**
 * Manually fires the particular event.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.fire("CellClick"); // Note we supply "CellClick" for the OnCellClickEvent
 * </code></pre>
 * </div>
 * @param {String} evt The identifier for the evnt such as "HtmlReady".
 * @param {Object} args Any arguments to pass to the event handlers.
 * @private
 */
nitobi.Object.prototype.fire=function(evt,args){
	return nitobi.event.notify(evt+this.uid,args);
}

/**
 * Subscribes a function to a Grid event.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.subscribe("DataReady", myFunction);
 * </code></pre>
 * </div>
 * <p>
 * Notice that the event we are subscribing to does not specify the "On" 
 * or "Event" parts of the name.
 * </p>
 * @param {String} evt A event string identifier or key for the given 
 * event. This value is the event name without the "On" and "Event" parts 
 * of the name, for example, the key for the OnDataReadyEvent is becomes 
 * "DataReady".
 * @param {Function} func A reference to the Function object that should 
 * be called when the event is fired.
 * @param {Object} context A reference to the Object that the Function 
 * should be called in the context of. When writing object oriented 
 * JavaScript the reference to the Function must also have some context 
 * in which it is to be executed.
 * @see nitobi.grid.Grid#subscribeOnce
 * @see nitobi.grid.Grid#unsubscribe
 * @private
 */
nitobi.Object.prototype.subscribe=function(evt,func,context){
	if (this.subscribedEvents == null)
		this.subscribedEvents = {};
	if (typeof(context)=="undefined") context=this;
	var guid = nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
	this.subscribedEvents[guid] = evt+this.uid;
	return guid;
}

/**
 * Subscribe to an event only once.  That is, the handler is only fired 
 * once and then automatically unregistered.
 * <p>
 * <b>Example</b>:  Load the grid and subscribe to the OnHtmlReadyEvent
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction loadGrid()
 * {
 * 	var grid = nitobi.loadComponent('grid1');
 * 	grid.subscribeOnce("HtmlReady", handleHtmlEvent, null, new Array(grid));
 * }
 * 
 * &#102;unction handleHtmlEvent(gridObj)
 * {
 * 	gridObj.selectCellByCoords(0,0);
 * 	gridObj.edit();
 * }
 * </code></pre>
 * </div>
 * @param {String} evt A event string identifier or key for the given event. This value is the event name without the "On" and "Event" parts of the name, for example, the key for the OnDataReadyEvent is becomes "DataReady".
 * @param {Function} func A reference to the Function object that should be called when the event is fired.
 * @param {Object} context A reference to the Object that the Function should be called in the context of. When writing object oriented JavaScript the reference to the Function must also have some context in which it is to be executed.
 * @param {Array} params Any parameters that should be passed to the handler function.
 * @see #subscribe
 * @private
 */
nitobi.Object.prototype.subscribeOnce = function(evt, func, context, params)
{
	var _this = this;
	var func1 = function()
	{
		func.apply(context || this, params || arguments);
		_this.unsubscribe(evt, guid);
	}
	var guid = this.subscribe(evt,func1);
	return guid;
}

/**
 * Unsubscribes an event from Grid.
 * @param {String} evt The event name without the "On" prefix and "Event" suffix.
 * @param {Number} guid The unique ID of the event as returned by the subscribe method. 
 * If the event is defined through the declaration the unique ID can be accessed through the grid API such as grid.OnHtmlReadyEvent.
 * @private
 */
nitobi.Object.prototype.unsubscribe=function(evt,guid)
{
	return nitobi.event.unsubscribe(evt+this.uid, guid);
}

/**
 * Destroys all objects added to the disposal array.
 */
nitobi.Object.prototype.dispose = function()
{
	if (this.disposing)
		return;

	this.disposing = true;

	// Loop through the disposal array first. 
	var disposalLength = this.disposal.length;
	for (var i=0; i<disposalLength; i++)
	{
		if (disposal[i] instanceof Function)
		{
			disposal[i].call(context);
		}
		disposal[i] = null;
	}

	// Loop through every item in the object.
	for (var item in this)
	{
		if (this[item].dispose instanceof Function)
		{
			this[item].dispose.call(this[item]);
		}
		this[item] = null;
	}
}
