/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.effects');

/**
 * Creates a blind effect.  After the effect is created it can be started by calling 
 * <code>start()</code>.
 * @class This effect shrinks an HTML Element in the Y-direction, preserving the width of the element.  After
 * After shrinking, the element is hidden.
 * @constructor
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @extends nitobi.effects.Scale
 */
nitobi.effects.BlindUp = function( element, params )
{
	params = nitobi.lang.merge(
		{
			scaleX:false,
			duration:Math.min(0.2 * (element.scrollHeight / 100) , 0.50)
		}, 
		params || {}
	);
	nitobi.effects.BlindUp.baseConstructor.call(this,element,params,0.0);
};

nitobi.lang.extend(nitobi.effects.BlindUp, nitobi.effects.Scale );

/**
 * @private
 */
nitobi.effects.BlindUp.prototype.setup = function()
{
	nitobi.effects.BlindUp.base.setup.call(this);
};
/**
 * @private
 */
nitobi.effects.BlindUp.prototype.finish = function()
{
	nitobi.html.Css.addClass(this.element, NTB_CSS_HIDE);
	nitobi.effects.BlindUp.base.finish.call(this);
	this.element.style.height = '';
};

/*************************************************************/

/**
 * Creates a blind effect.  After the effect is created it can be started by calling 
 * <code>start()</code>.
 * @class This effect grows an HTML Element to 100% of its size in the Y-direction, preserving the width 
 * of the element. The element should start off hidden.
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @constructor
 * @extends nitobi.effects.Scale
 */
nitobi.effects.BlindDown = function( element, params )
{
	nitobi.html.Css.swapClass(element, NTB_CSS_HIDE, NTB_CSS_SMALL);
	params = nitobi.lang.merge(
		{
			scaleX:false,
			scaleFrom:0.0,
			duration:Math.min(0.2 * (element.scrollHeight / 100) , 0.50) 
		}, 
		params || {}
	);
	nitobi.effects.BlindDown.baseConstructor.call(this,element,params,100.0);
};

nitobi.lang.extend(nitobi.effects.BlindDown, nitobi.effects.Scale );

/**
 * @private
 */
nitobi.effects.BlindDown.prototype.setup = function()
{
//	this.element.style.height = '1px';
//	nitobi.html.Css.removeClass(this.element,NTB_CSS_HIDE);
	nitobi.effects.BlindDown.base.setup.call(this);
	this.element.style.height = '1px';
	nitobi.html.Css.removeClass(this.element,NTB_CSS_SMALL);
};
/**
 * @private
 */
nitobi.effects.BlindDown.prototype.finish = function()
{
	nitobi.effects.BlindDown.base.finish.call(this);
	this.element.style.height = '';
};

nitobi.effects.families.blind = {show: nitobi.effects.BlindDown, hide: nitobi.effects.BlindUp};