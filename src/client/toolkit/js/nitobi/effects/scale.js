/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.effects');

/**
 * Creates a scaling effect.  After the effect is created it can be started by calling 
 * <code>start()</code>.
 * @class A class that facilitates animated scaling.  Each instance is a different 
 * scaling effect on a different element with its own set of parameters.
 * @constructor
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @param {Number} percent the percentage (0-100) of size to which the effect should scale <code>element</code>
 * @extends nitobi.effects.Effect
 */
nitobi.effects.Scale = function(element, params, percent)
{
	nitobi.effects.Scale.baseConstructor.call(this,element,params);
	/**
	 * Whether or not to scale the width of the element. Default: <code>true</code>
	 * @type Boolean
	 */
	this.scaleX = typeof(params.scaleX) == 'boolean' ? params.scaleX : true;
	/**
	 * Whether or not to scale the height of the element. Default: <code>true</code>
	 * @type Boolean
	 */
	this.scaleY = typeof(params.scaleY) == 'boolean' ? params.scaleY : true;
	/**
	 * The percentage (0-100) size to start the animation at. Default: <code>100.0</code>
	 * @type Number
	 */
	this.scaleFrom = typeof(params.scaleFrom) == 'number' ? params.scaleFrom : 100.0;
	/**
	 * @ignore
	 */
	this.scaleTo = percent;
};

nitobi.lang.extend(nitobi.effects.Scale, nitobi.effects.Effect);

/**
 * @private
 */
nitobi.effects.Scale.prototype.setup = function()
{
	var style = this.element.style;
	var Css = nitobi.html.Css;
	this.originalStyle = {
		'top': style.top,
		'left': style.left,
		'width': style.width,
		'height': style.height,
		'overflow': Css.getStyle(this.element, "overflow")
	};
	this.factor = (this.scaleTo - this.scaleFrom) / 100.0;
	this.dims = [this.element.scrollWidth, this.element.scrollHeight];
	style.width = this.dims[0]+"px";
	style.height = this.dims[1]+"px";
	Css.setStyle(this.element, "overflow", "hidden");
};

/**
 * @private
 */
nitobi.effects.Scale.prototype.finish = function()
{
	for (var s in this.originalStyle)
		this.element.style[s] = this.originalStyle[s]; 
};

/**
 * @private
 */
nitobi.effects.Scale.prototype.update = function( pos )
{
	var currentScale = (this.scaleFrom / 100.0) + (this.factor * pos);
	this.setDimensions(Math.floor(currentScale * this.dims[0]) || 1, Math.floor(currentScale * this.dims[1]) || 1);
};	

/**
 * @private
 */
nitobi.effects.Scale.prototype.setDimensions = function( x, y )
{
	if (this.scaleX) this.element.style.width = x + 'px';
	if (this.scaleY) this.element.style.height = y + 'px';
};
	
