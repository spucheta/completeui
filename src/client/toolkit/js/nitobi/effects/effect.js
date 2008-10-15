/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.effects');

if (false)
{
	/**
	 * @namespace The <code>nitobi.effects</code> namespace hosts classes that can be used for animated
	 * manipulation of HTML elements.  {@link nitobi.effects.Effect} is an abstract class that is 
	 * at the root of the Nitobi effects system, all effects extend this class.
	 * @constructor
	 */
	nitobi.effects = function(){}; 
}

/**
 * Creates a new effect that will act on <code>element</code> with the given parameters.  
 * @class An abstract class that needs to be extended by subclasses that will provide functionality
 * that actually modifies the appearance of an HTML element.
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @constructor 
 */
nitobi.effects.Effect = function( element, params )
{
	/**
	 * The HTML element this effect will act on.
	 * @type HTMLElement
	 */
	this.element = $(element);
	/**
	 * The transition (any function that takes any value between 0.0 and 1.0 and returns a value
	 * between 0.0 and 1.0) for this effect. Default: {@link nitobi.effects.Transition#sinoidal}
	 * @type Function
	 */
	this.transition = params.transition || nitobi.effects.Transition.sinoidal;
	/**
	 * The duration (in seconds) of the effect. Default: <code>1.0</code>
	 * @type Number
	 */
	this.duration = params.duration || 1.0;
	/**
	 * The frame rate (number of frames per second) for this effect.
	 * @type Number
	 */
	this.fps = params.fps || 50;
	/**
	 * The starting point for the transition. One might want to start a sin wave at 0.5. 
	 * Default: <code>0.0</code>
	 * @type Number 
	 */
	this.from = typeof(params.from) === 'number' ? params.from : 0.0;
	/**
	 * The ending point for the transition. 
	 * Default: <code>1.0</code>
	 * @type Number 
	 */
	this.to = typeof(params.from) === 'number' ? params.to : 1.0;
	/**
	 * A delay (in seconds) from when <code>start()</code> is called to when the effect actually begins.
	 * Default: <code>0.0</code>
	 * @type Number
	 */
	this.delay = params.delay || 0.0;
	/**
	 * A function to call when the effect finishes.
	 * @type Function
	 */
	this.callback = typeof(params.callback) === 'function' ? params.callback : nitobi.lang.noop;
	/**
	 * @private
	 */
	this.queue = params.queue || nitobi.effects.EffectQueue.globalQueue;
	/**
	 * The event that fires just before the last render call and removal of the effect from the 
	 * global effect queue. {@link nitobi.base.EventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onBeforeFinish = new nitobi.base.Event();
	/**
	 * The event that fires after the last render call and removal of the effect from the 
	 * global effect queue. {@link nitobi.base.EventArgs} are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onFinish = new nitobi.base.Event();
	/**
	 * The event that fires just before the first render call {@link nitobi.base.EventArgs} 
	 * are passed to any subscribed handlers.
	 * @type nitobi.base.Event
	 */
	this.onBeforeStart = new nitobi.base.Event();
};

/**
 * Start the effect.  Call <code>start()</code> when the effect's parameters have been set 
 * as you desire.  
 */
nitobi.effects.Effect.prototype.start = function ()
{
	var now = new Date().getTime();
	/**
	 * @ignore
	 */
	this.startOn = now + this.delay*1000;
	/**
	 * @ignore
	 */
	this.finishOn = this.startOn + this.duration*1000;
	/**
	 * @ignore
	 */
	this.deltaTime = this.duration*1000;
	/**
	 * @ignore
	 */
	this.totalFrames = this.duration * this.fps;
	/**
	 * @ignore
	 */
	this.frame = 0;
	/**
	 * @ignore
	 */
	this.delta = this.from-this.to;
	this.queue.add(this);
};

/**
 * @private
 */
nitobi.effects.Effect.prototype.render = function( pos )
{
	if (!this.running)
	{
		this.onBeforeStart.notify(new nitobi.base.EventArgs(this, this.onBeforeStart));
		this.setup();
		/**
		 * @ignore
		 */
		this.running = true;
	}
	this.update(this.transition(pos*this.delta+this.from));	
};

/**
 * @private
 */
nitobi.effects.Effect.prototype.step = function( now )
{
	if (this.startOn <= now)
	{
		if (now >= this.finishOn)
		{
			this.end()
			return;
		}
		var pos = (now - this.startOn) / (this.deltaTime);
		var frame = Math.floor(pos*this.totalFrames);
		if (this.frame < frame)
		{
			this.render(pos);
			this.frame = frame
		}
	}
};

/**
 * This method is executed directly before the first update is made to the element.  Extending 
 * classes use this method as an initialization step.
 */
nitobi.effects.Effect.prototype.setup = function(){};

/**
 * This method is executed on every frame with the position (adjusted by the <code>transition</code>)
 * used as input.  Extending classes use this method to update the element's style.
 * @param {Number} pos the position (between 0.0 and 1.0) of the animation
 */
nitobi.effects.Effect.prototype.update = function(pos){};

/**
 * This method is executed directly after the last update has been made to the element.  Extending
 * classes use this method to clean up settings on the elment that are no longer needed.
 */
nitobi.effects.Effect.prototype.finish = function(){};

/**
 * Ends the effect.  This method can be called at any point and will update the element to
 * how it should look at the end of the effect.  It also cancels the effect by calling 
 * {@link nitobi.effects.Effect#cancel}.
 */
nitobi.effects.Effect.prototype.end = function()
{
	this.onBeforeFinish.notify(new nitobi.base.EventArgs(this, this.onBeforeFinish));
	this.cancel();
	this.render(1.0);
	this.running = false;	
	this.finish();
	this.callback();
	this.onFinish.notify(new nitobi.base.EventArgs(this, this.onAfterFinish));	
};

/**
 * Cancels the effect, preventing further updates to the element.  This does not return the element
 * to its original state, it simply prevents further modification.
 */
nitobi.effects.Effect.prototype.cancel = function()
{
	this.queue.remove(this);
};

/**
 * Creates a constructor for the given effect class that will take only the HTML element as
 * an argument.  For the given effect class,  we will return a constructor that takes 
 * only an element argument.  It will use this element with the <code>params</code> and any further
 * arguments to this method as inputs to the constructor for <code>effectClass</code>.
 * <BR>For example:
 * @example
 *  var effect = nitobi.effects.factory(nitobi.effects.Effect.Scale, 
 *                                      {fps:25,scaleFrom:50.0},
 *                                      75.0);
 *  var e1 = new effect($('myDiv'));
 *  var e2 = new effect($('anotherDiv'));
 *  myEffects.FiftyToSeventyFiveWithFps25 = effect;  
 * @param {Function} effectClass the class to use as the basis for the returned effect
 * @param {Map} params the params Map to use in the <code>effectClass</code> constructor
 * @param {Object} etc the first of as many other arguments as the constructor for 
 * <code>effectClass</code> takes. 
 * @type Function
 */
nitobi.effects.factory = function(effectClass, params, etc)
{
	var args = nitobi.lang.toArray(arguments, 2);
	return function(element)
	{
		var f = function () {effectClass.apply(this,[element,params].concat(args))};
		nitobi.lang.extend(f,effectClass); 
		return new f();
	}
};

/**
 * A Map of of effect family names to their respective <code>show</code> and <code>hide</code> effects.  ie: 
 * @example
 * nitobi.effects.families.blind == {show: nitobi.effects.BlindDown, hide: nitobi.effects.BlindUp}
 * nitobi.effects.families.shade == {show: nitobi.effects.ShadeDown, hide: nitobi.effects.ShadeUp}
 * nitobi.effects.families.none == {show: null, hide: null}
 * @type Map
 */
nitobi.effects.families = {
	none: {show: null, hide: null}
};
	