/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.lang');
	
/**
 * Initializes a new instance of the StringBuilder class
 * @class An optimized string concatenation class.
 * @constructor
 * @param {String|Array} [value] an initial value, or set of inital values.
 */
nitobi.lang.StringBuilder = function (value)
{
	if (value)
	{
		if (typeof(value) === 'string')
		{
			this.strings = [value];
		}
		else
		{
			this.strings = value;
		}
	}
	else
	{
		this.strings = new Array();
	}
};

/**
 * Appends the given string to the end of the string buffer.  <code>append()</code>
 * returns the <code>StringBuilder</code> object so that chaining calls to append is possible.
 * @example
 * var helloWorld = new nitobi.lang.StringBuilder();
 * helloWorld.append('Hello').append(', ').append('World!');
 * alert(helloWorld); // Calls helloWorld.toString();
 * @param {String} value the string to append
 * @type nitobi.lang.StringBuilder
 */
nitobi.lang.StringBuilder.prototype.append = function (value)
{
	if (value)
	{
		this.strings.push(value);
	}
	return this;
};

/**
 * Clears the string buffer.
 */
nitobi.lang.StringBuilder.prototype.clear = function ()
{
	this.strings.length = 0;
};

/**
 * Returns the current state of the buffer as a single string.
 * @type String
 */
nitobi.lang.StringBuilder.prototype.toString = function ()
{
	return this.strings.join("");
};