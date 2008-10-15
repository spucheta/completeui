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
	 * <I>This class has no constructor.</I>
	 * @class This class hosts static functions that take values between zero and one and return
	 * values between zero and one.  They can be used as the transition property in subclasses of 
	 * {@link nitobi.effects.Effect} to make animation look smoother.
	 * @constructor
	 */
	nitobi.effects.Transition = function(){}; 
}
nitobi.effects.Transition = {};

/**
 * A sinoidal curve with its valley at 0.0 and peak at 1.0.
 * @param {Number} x a number between 0.0 and 1.0
 */
nitobi.effects.Transition.sinoidal = function(x)
{
	return (-Math.cos(x*Math.PI)/2)+0.5;
};

/**
 * This function just returns <code>x</code>.
 * @param {Number} x a number between 0.0 and 1.0
 */
nitobi.effects.Transition.linear = function(x)
{
	return x;
};

/**
 * Returns <code>1-x</code>.
 * @param {Number} x a number between 0.0 and 1.0
 */
nitobi.effects.Transition.reverse = function(x)
{
	return 1-x;
};


/*
 	  pulse: function(x, pulses) {
 	    pulses = pulses || 5;
 	    return (
 	      Math.round((x % (1/pulses)) * pulses) == 0 ?
 	            ((x * pulses * 2) - Math.floor(x * pulses * 2)) :
 	        1 - ((x * pulses * 2) - Math.floor(x * pulses * 2))
 	      );
 	  },
*/