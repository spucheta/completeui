/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.effects');

/**
 * Creates a shade effect.  After the effect is created it can be started by calling 
 * <code>start()</code>.
 * @class This effect shrinks an HTML Element in the Y-direction, preserving the width of the element.
 * After shrinking, the element is hidden. The effect pins the first child node of the element to its 
 * bottom.  Visually, the element will appear as if it is sliding up, like a window shade.
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @constructor
 * @extends nitobi.effects.Scale
 */
nitobi.effects.ShadeUp = function( element, params )
{
	params = nitobi.lang.merge(
		{
			scaleX: false,
			duration: Math.min(0.2 * (element.scrollHeight / 100) , 0.30) 
		}, 
		params || {}
	);
	nitobi.effects.ShadeUp.baseConstructor.call(this,element,params,0.0);
};

nitobi.lang.extend(nitobi.effects.ShadeUp, nitobi.effects.Scale );

/**
 * @private
 */
nitobi.effects.ShadeUp.prototype.setup = function()
{
	nitobi.effects.ShadeUp.base.setup.call(this);
	var fnode = nitobi.html.getFirstChild(this.element);
	this.originalStyle.position = this.element.style.position;
	nitobi.html.position(this.element);
	
	if (fnode)
	{
		var style = fnode.style;
		this.fnodeStyle = {
			position: style.position,
			bottom: style.bottom,
			left: style.left
		}
		this.fnode = fnode;
		style.position = 'absolute';
		style.bottom = '0px';
		style.left = '0px';
		style.top = '';
	}
};

/**
 * @private
 */
nitobi.effects.ShadeUp.prototype.finish = function()
{
	nitobi.effects.ShadeUp.base.finish.call(this);
	nitobi.html.Css.addClass(this.element,NTB_CSS_HIDE);
	this.element.style.height = '';
	this.element.style.position = this.originalStyle.position;
	this.element.style.overflow = this.originalStyle.overflow;
	for (var x in this.fnodeStyle)
	{
		this.fnode.style[x] = this.fnodeStyle[x];
	}
};

/*************************************************************/

/**
 * Creates a shade effect.  After the effect is created it can be started by calling 
 * <code>start()</code>.
 * @class This effect grows an HTML Element in the Y-direction, preserving the width of the element.
 * The effect pins the first child node of the element to its 
 * bottom.  Visually, the element will appear as if it is sliding down, like a window shade.
 * @param {HTMLElement} element the HTML element that will be affected by this effect
 * @param {Map} params initial values for the effect's fields - ie 
 * <code>{@link nitobi.effects.Effect#duration} = params.duration</code> 
 * @constructor
 * @extends nitobi.effects.Scale
 */
nitobi.effects.ShadeDown = function( element, params )
{
	nitobi.html.Css.swapClass(element, NTB_CSS_HIDE, NTB_CSS_SMALL);
	params = nitobi.lang.merge(
		{
			scaleX:false,
			scaleFrom:0.0,
			duration:Math.min(0.2 * (element.scrollHeight / 100) , 0.30)
		}, 
		params || {}
	);
	nitobi.effects.ShadeDown.baseConstructor.call(this,element,params,100.0);
};

nitobi.lang.extend(nitobi.effects.ShadeDown, nitobi.effects.Scale );

/**
 * @private
 */
nitobi.effects.ShadeDown.prototype.setup = function()
{
	nitobi.effects.ShadeDown.base.setup.call(this);
	this.element.style.height = '1px';
	nitobi.html.Css.removeClass(this.element,NTB_CSS_SMALL);
	
	var fnode = nitobi.html.getFirstChild(this.element);
	this.originalStyle.position = this.element.style.position;
	nitobi.html.position(this.element);
	
	if (fnode)
	{
		var style = fnode.style;
		this.fnodeStyle = {
			position: style.position,
			bottom: style.bottom,
			left: style.left,
			right: style.right,
			top: style.top
		}
		this.fnode = fnode;
		style.position = 'absolute';
		style.top = '';
		style.right = '';
		style.bottom = '0px';
		style.left = '0px';
	}
	
};

/**
 * @private
 */
nitobi.effects.ShadeDown.prototype.finish = function()
{
	nitobi.effects.ShadeDown.base.finish.call(this);
	this.element.style.height = '';
	this.element.style.position = this.originalStyle.position;
	this.element.style.overflow = this.originalStyle.overflow;
	for (var x in this.fnodeStyle)
	{
		this.fnode.style[x] = this.fnodeStyle[x];
	}

	this.fnode.style.top = '0px';
	this.fnode.style.left = '0px';
	this.fnode.style.bottom = '';
	this.fnode.style.right = '';
return

	this.fnode.style['position'] = ''; //this.fnodeStyle['position'];
//	this.fnode.style['top'] = this.fnodeStyle['top'];
//	this.fnode.style['right'] = this.fnodeStyle['right'];
//	this.fnode.style['bottom'] = this.fnodeStyle['bottom'];
//	this.fnode.style['left'] = this.fnodeStyle['left'];
//	//this.fnode.style['position'] = 'relative';
//	
//	this.element.style['top'] = this.originalStyle['top'];
//	this.element.style['left'] = this.originalStyle['left'];
//
//	
//	this.element.style['width'] = this.originalStyle['width'];
//	this.element.style['height'] = this.originalStyle['height'];
//	
//	this.element.style['overflow'] = this.originalStyle['overflow'];
	
//	this.element.style['position'] = this.originalStyle['position'];
	
//	for (var x in this.fnodeStyle)
//	{
//		console.log(this.fnode.style[x]+" inner ["+x+"]: "+this.fnodeStyle[x]); 
//		if (this.fnode.style[x] != this.fnodeStyle[x]) this.fnode.style[x] = this.fnodeStyle[x];
//		
//	}
//	nitobi.effects.ShadeDown.base.finish.call(this);
//	this.element.style.height = '';
//	this.element.style.position = this.originalStyle.position;
//	this.element.style.overflow = this.originalStyle.overflow;
};

nitobi.effects.families.shade = {show: nitobi.effects.ShadeDown, hide: nitobi.effects.ShadeUp};