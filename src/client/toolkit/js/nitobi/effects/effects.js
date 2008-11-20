/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ui");

/**
 * @ignore
 */
NTB_CSS_SMALL = 'ntb-effects-small';
/**
 * @ignore
 */
NTB_CSS_HIDE = 'nitobi-hide';

if (false)
{
	/**
	 * @class
	 * @constructor
	 */
	nitobi.ui.Effects = function(){};
}

/**
 * @ignore
 */
nitobi.ui.Effects = {};


nitobi.ui.Effects.setVisible = function(element, visible, effectFamily, callback, context)
{
	callback = (context ? nitobi.lang.close(context,callback) : callback) || nitobi.lang.noop;
	element = $ntb(element);
	if (typeof effectFamily == 'string')
		effectFamily = nitobi.effects.families[effectFamily];
	if (!effectFamily)
		effectFamily = nitobi.effects.families['none'];
	if (visible)
		var effectClass = effectFamily.show;
	else
		var effectClass = effectFamily.hide;
	if (effectClass)
	{
		var effect = new effectClass(element);
		effect.callback = callback;
		effect.start();
	}
	else
	{
		if (visible)
			nitobi.html.Css.removeClass(element,NTB_CSS_HIDE);
		else
			nitobi.html.Css.addClass(element,NTB_CSS_HIDE);
		callback();		
	}
};

/**
 * Shrinks the given HTML DOM element to the size specified by 
 * <CODE>options</CODE> in <CODE>duration</CODE> milliseconds.
 * @param {Object} options The dimensions after shrinking <CODE>{width: <int> x, height: <int> y}</CODE>.
 * @param {Element} domElement The unique ID of this Pane.
 * @param {int} duration How long the effect will take.
 * @param {function} callback A function to call after shrink completes
 * @ignore
 */
nitobi.ui.Effects.shrink = function(options, domElement, duration, callback)
{
	var rect = nitobi.html.getClientRects(domElement)[0];

	options.deltaHeight_Doctype = 0 - parseInt("0"+nitobi.html.getStyle(domElement, "border-top-width")) - parseInt("0"+nitobi.html.getStyle(domElement, "border-bottom-width")) - 
									parseInt("0"+nitobi.html.getStyle(domElement, "padding-top")) - parseInt("0"+nitobi.html.getStyle(domElement, "padding-bottom")); 
	options.deltaWidth_Doctype = 0 - parseInt("0"+nitobi.html.getStyle(domElement, "border-left-width")) - parseInt("0"+nitobi.html.getStyle(domElement, "border-right-width")) - 
									parseInt("0"+nitobi.html.getStyle(domElement, "padding-left")) - parseInt("0"+nitobi.html.getStyle(domElement, "padding-right"));
	
	options.oldHeight = Math.abs(rect.top - rect.bottom) + options.deltaHeight_Doctype;
	options.oldWidth = Math.abs(rect.right - rect.left) + options.deltaWidth_Doctype;
	
	
//	options.oldHeight = nitobi.html.getStyle(domElement, "height");
//	options.oldHeight = nitobi.html.getStyle(domElement, "width");
	
	if (!(typeof(options.width) == "undefined"))
	{
		options.deltaWidth = Math.floor(Math.ceil(options.width - options.oldWidth) / (duration / nitobi.ui.Effects.ANIMATION_INTERVAL));
	}
	else
	{
		options.width = options.oldWidth;
		options.deltaWidth = 0;
	}
	
	if (!(typeof(options.height) == "undefined"))
	{
		options.deltaHeight = Math.floor(Math.ceil(options.height - options.oldHeight) / (duration / nitobi.ui.Effects.ANIMATION_INTERVAL));
	}
	else
	{
		options.height = options.oldHeight;
		options.deltaHeight = 0;
	}
	
	//domElement.style.overflow = "hidden";
	nitobi.ui.Effects.resize(options, domElement, duration, callback)
};

/**
 * A helper function that resizes <CODE>domElement</CODE> over a given duration by deltas given by 
 * <CODE>options.deltaWidth</CODE> and <CODE>options.deltaHeight</CODE> every 
 * <CODE>nitobi.ui.Effects.ANIMATION_INTERVAL</CODE> milliseconds.  Once complete, the function reference 
 * <CODE>callback</CODE> is called. 
 * @param {Object} options
 * @param {Element} domElement
 * @param {int} duration
 * @param {Function} callback
 * @private
 */
nitobi.ui.Effects.resize = function(options, domElement, duration, callback)
{
	var rect = nitobi.html.getClientRects(domElement)[0];

	var currentHeight = Math.abs(rect.top - rect.bottom);

//	var currentHeight = nitobi.html.getStyle(domElement, "height");
	
	var newHeight = Math.max(currentHeight + options.deltaHeight + options.deltaHeight_Doctype, 0);
	if (Math.abs(currentHeight - options.height) < Math.abs(options.deltaHeight))
	{
		newHeight = options.height;
		options.deltaHeight = 0;
	}

// 	var currentWidth = nitobi.html.getStyle(domElement, "width");
	var currentWidth = Math.abs(rect.right - rect.left);
	
	var newWidth = Math.max(currentWidth + options.deltaWidth + options.deltaWidth_Doctype, 0);
	newWidth = (newWidth >= 0) ? newWidth : 0;
	if (Math.abs(currentWidth - options.width) < Math.abs(options.deltaWidth))
	{
		newWidth = options.width;
		options.deltaWidth = 0;
	}

	duration -= nitobi.ui.Effects.ANIMATION_INTERVAL;
	if (duration > 0)
	{
		window.setTimeout(nitobi.lang.closeLater(this, nitobi.ui.Effects.resize, [options, domElement, duration, callback]), nitobi.ui.Effects.ANIMATION_INTERVAL);
	}

	var resizeFunc = function () {
		domElement.height = newHeight + "px";
		domElement.style.height = newHeight + "px";

		domElement.width = newWidth + "px"; 
		domElement.style.width = newWidth + "px"; 
			
		if (duration <= 0)
		{
			if (callback)
			{
				window.setTimeout(callback,0);
			}
		}
	}

	nitobi.ui.Effects.executeNextPulse.push(resizeFunc);

};

/**
 * A stack of function references that will be called every animation pulse.
 * @private
 */
nitobi.ui.Effects.executeNextPulse = new Array();

/**
 * Executes every function reference in {@link nitobi.ui.Effects#executeNextPulse} and clears its contents.
 */
nitobi.ui.Effects.pulse = function()
{
	var p;
	while (p = nitobi.ui.Effects.executeNextPulse.pop())
	{
		p.call()
	}
}

/**
 * The number of milliseconds between executions of {@link nitobi.ui.Effects#pulse}.
 * @private
 * @final
 */
nitobi.ui.Effects.PULSE_INTERVAL = 20;

/**
 * The number of milliseconds between calculating new animation frames.
 * @private
 * @final
 */
nitobi.ui.Effects.ANIMATION_INTERVAL = 40;

window.setInterval(nitobi.ui.Effects.pulse, nitobi.ui.Effects.PULSE_INTERVAL);window.setTimeout(nitobi.ui.Effects.pulse, nitobi.ui.Effects.PULSE_INTERVAL);

/**
 * @private
 */
nitobi.ui.Effects.fadeIntervalId = {};
/**
 * @private
 */
nitobi.ui.Effects.fadeIntervalTime = 10;

/**
 * @private
 */
nitobi.ui.Effects.cube = function(number)
{
	return number * number * number;
}

/**
 * @private
 */
nitobi.ui.Effects.cubeRoot = function(number)
{
	var T=0;
	var N = parseFloat (number);
	if (N < 0) {N=-N; T=1;};
	var M = Math.sqrt (N);
	var ctr = 1
	while (ctr < 101) {
	var M = M*N;
	var M = Math.sqrt (Math.sqrt(M));
	ctr++;
	}
	return M;
}

/**
 * @private
 */
nitobi.ui.Effects.linear = function(number)
{
	return number;
}

/**
 * @private
 */
nitobi.ui.Effects.fade = function(element,target,time,endFunc, stepFunc)
{
	stepFunc = stepFunc || nitobi.ui.Effects.linear;
	var endTime = (new Date()).getTime() + time;
	var id = nitobi.component.getUniqueId();
	var startTime = (new Date()).getTime()
	var el = element;
	if (element.length)
	{
		el = element[0]
	}
	var current = nitobi.html.Css.getOpacity(el);
	var direction = (target - current < 0 ? -1 : 0);
	nitobi.ui.Effects.fadeIntervalId[id] = window.setInterval(function(){nitobi.ui.Effects.stepFade(element,target,startTime, endTime,id,endFunc, stepFunc, direction)},nitobi.ui.Effects.fadeIntervalTime);
}

/**
 * @private
 */
nitobi.ui.Effects.stepFade = function(element,target,startTime,endTime,id, endFunc, stepFunc, direction)
{
	var ct = (new Date()).getTime();
	var range = endTime - startTime;
	var nct = ((ct - startTime)/(endTime - startTime));
	
	if (nct <= 0 || nct >= 1)
	{
		nitobi.html.Css.setOpacities(element, target);
		window.clearInterval(nitobi.ui.Effects.fadeIntervalId[id]);
		endFunc();
		return;
	}
	else
	{
		nct = Math.abs(nct + direction);
	}
	var no = stepFunc(nct);
	nitobi.html.Css.setOpacities(element, no * 100);
}
