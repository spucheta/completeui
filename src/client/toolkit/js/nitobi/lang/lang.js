/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
if (typeof(nitobi) == "undefined")
{
	/**
	 * @namespace The nitobi namespace is the root namespace for all Nitobi components and libraries.
	 * It should not be instantiated and is meant only to function as a namespace.
	 * @constructor 
	 * @private
	 */
	nitobi = function(){};
}

if (false)
{
	/**
	 * @namespace This namespace hosts methods that could be considered language extensions.  
	 * Most importantly one can find the {@link nitobi.lang#extend} and {@link nitobi.lang#implement}
	 * methods in this namespace.
	 * @constructor
	 */
	nitobi.lang = function(){};
}

if (typeof(nitobi.lang) == "undefined")
{
	/**
	 * @ignore
	 */
	nitobi.lang = {};
}

/**
 * If the given namespace does not exist, create an empty object with that name.
 * @param {String} namespace the namespace to define
 */
nitobi.lang.defineNs = function(namespace)
{
	var names = namespace.split(".");
	var currentNamespace ="";
	var dot="";
	for (var i=0; i < names.length; i++)
	{
		currentNamespace += dot + names[i];
		dot=".";
		if (eval("typeof("+currentNamespace+")") == "undefined")
		{
			eval(currentNamespace + "={}");
		}
	}
}

/**
 * Extends the <code>subClass</code> with the functionality included in the <code>baseClass</code>. 
 * This function should be called immediately after the subClass constructor is defined.
 * <pre class="code">
 * example.Cat = &#102;unction() {}
 * example.Cat.prototype.run = function() {}
 * 
 * example.Lion = &#102;unction() {
 *   example.Lion.baseConstructor.call(this);
 * }
 * 
 * nitobi.lang.extend(example.Lion, example.Cat);
 * </pre>
 * @param subClass {Object} The class that will inherit from the base.
 * @param baseClass {Object} The class that will be inherited from.
 */
nitobi.lang.extend = function(subClass, baseClass) {
   function inheritance() {};
   inheritance.prototype = baseClass.prototype;

   subClass.prototype = new inheritance();
   subClass.prototype.constructor = subClass;
   subClass.baseConstructor = baseClass;
   if (baseClass.base)
   {
	   baseClass.prototype.base = baseClass.base;
   }
   subClass.base = baseClass.prototype;
}

/**
 * Copies all functions from the interface to the class - commonly referred to as a mixin. 
 * This is very similar to <code>extend</code>. 
 * @example
 * example.Cat = &#102;unction() {}
 * example.Cat.prototype.run = function() {}
 * 
 * example.Lion = &#102;unction() {
 *   example.Lion.baseConstructor.call(this);
 * }
 * 
 * nitobi.lang.implement(example.Lion, example.Cat);
 * @param {Function} class_ the class to copy functions onto
 * @param {Function} interface_ the interface to copy from
 * @see #extend
 */
nitobi.lang.implement = function(class_, interface_)
{
	for (var member in interface_.prototype)
	{
		if (typeof(class_.prototype[member]) == "undefined" || class_.prototype[member] == null)
		{
			class_.prototype[member] = interface_.prototype[member];
		}
	}
}

// TODO: support dates and numbers
/**
 * Takes a prototype and creates getters/setters for the provided array of JS properties defined
 * as {n:"PropName",t:"s"} where n is the property name and t is the property type which can be "(s)tring", 
 * "(b)oolean" or "(i)nteger".
 * @private
 */
nitobi.lang.setJsProps = function(p, props) {
	for (var i=0; i<props.length; i++) {
		var prop = props[i];
		// create the getter/setter
		p["set"+prop.n] = this.jSET;
		p["get"+prop.n] = this.jGET;
		// set the default value
		p[prop.n] = prop.d;
	}
}

// TODO: support dates and numbers
/**
 * Takes a prototype and creates getters/setters for the provided array of XML properties defined
 * as {n:"PropName",t:"s"} where n is the property name and t is the property type which can be "(s)tring", 
 * "(b)oolean" or "(i)nteger".
 * @private
 */
nitobi.lang.setXmlProps = function(p, props) {
	for (var i=0; i<props.length; i++) {
		var prop = props[i];
		// create the getter/setter
		var s,g;
		switch (prop.t) {
			case "i": // integer types
				s=this.xSET; // no need to do any custom convert from int to string
				g=this.xiGET;
				break;
			case "b": // boolean
				s=this.xbSET;
				g=this.xbGET;
				break;
			default:
				s=this.xSET;
				g=this.xGET;
		}
		p["set"+prop.n] = s;
		p["get"+prop.n] = g;
		// set the default value
		p["sModel"] += prop.n+"\""+prop.d+"\" ";
	}
}

/**
 * Takes a prototype and creates getters/setters for the provided array of event names defined
 * as "OnBeforeSaveEvent". Both the getter/setter for the event and an event object are created.
 * @private
 */
nitobi.lang.setEvents = function(p, events) {
	for (var i=0; i<events.length; i++) {
		var n = events[i];
		// this is all for backwards compat.
		p["set"+n] = this.eSET;
		p["get"+n] = this.eGET;
		var nn = n.substring(0,n.length-5);
		p["set"+nn] = this.eSET;
		p["get"+nn] = this.eGET;
		// TODO: could do this here or in the actual constructor ...
		p["o"+n.substring(1)] = new nitobi.base.Event();
	}
}


/**
 * Returns true if the member is defined and false otherwise. 
 * Use this only on members, eg, isDefined(this.foo) or 
 * isDefined(obj.foo) but never isDefined(foo).
 * @param {Object} a Any member.
 * @type Boolean
 */
nitobi.lang.isDefined = function(a)
{
	return (typeof(a) != "undefined");
}

/**
 * Casts a string value to a boolean.  Returns <code>true</code> if the input string is "true".
 * Otherwise, returns false.
 * @param {String} a the string-encoded boolean
 * @type Boolean
 */
nitobi.lang.getBool = function(a)
{	if (null == a) return null;
	if (typeof(a) == "boolean") return a;
	return a.toLowerCase() == "true";
}

/**
 * An enumeration of the different types that can be returned from {@link #typeOf}.
 * <code>nitobi.lang.type.XMLNODE</code>, <code>nitobi.lang.type.HTMLNODE</code>, 
 * <code>nitobi.lang.type.ARRAY</code>, and <code>nitobi.lang.type.XMLDOC</code> are the 
 * possible values.
 * @type Map
 */
nitobi.lang.type = {XMLNODE:0, HTMLNODE:1, ARRAY:2, XMLDOC:3};

/**
 * Returns the type of the input object as a member of the {@link nitobi.lang#type} enumeration.
 * @param {Object} obj the object to inspect
 * @type Number
 */
nitobi.lang.typeOf = function(obj) 
{
	var t=typeof(obj);
	if (t=="object")
	{	
		if (obj.blur && obj.innerHTML)
		{
			return nitobi.lang.type.HTMLNODE;
		}			
		if (obj.nodeName && obj.nodeName.toLowerCase() === "#document")
		{
			return nitobi.lang.type.XMLDOC;	
		}
		if (obj.nodeName){
			return nitobi.lang.type.XMLNODE;
		}
		if (obj instanceof Array)
		{
			return nitobi.lang.type.ARRAY;
		}
			
	}
	return t;
}

/**
 * @private
 */
nitobi.lang.toBool = function(boolStr,defaultval) 
{
	if (typeof(defaultval)!="undefined")
		if ((typeof(boolStr)=="undefined") || (boolStr=="") || (boolStr==null)) boolStr=defaultval;

	boolStr=boolStr.toString() || "";
	boolStr=boolStr.toUpperCase();

	if ( (boolStr=="Y") || (boolStr=="1") || (boolStr=="TRUE") ) return true;
	else return false;
}
/**
 * @private
 * @type String
 */
nitobi.lang.boolToStr = function (bool) 
{
	if ((typeof(bool) == "boolean" && bool) || (typeof(bool) == "string" && (bool.toLowerCase() == "true" || bool == "1"))) return "1"; else return "0";
	return bool;
}

/**
 * Formats the given number with the given mask.
 * @param {String} number The number to format as a string
 * @param {String} mask The mask to apply
 * @param {String} groupingSymbol The symbol used to group numbers, e.g "," as in "100,000"
 * @param {String} decimalSymbol The symbol used to separate the decimal, e.g "." as in "10.02"
 * @type String
 */
nitobi.lang.formatNumber = function(number, mask, groupingSymbol, decimalSymbol) {
	var n = nitobi.form.numberXslProc; 
	n.addParameter("number", number, "");
	n.addParameter("mask", mask, "");
	n.addParameter("group", groupingSymbol, "");
	n.addParameter("decimal", decimalSymbol, "");
	// TODO: put the number xsl into lang
    return nitobi.xml.transformToString(nitobi.xml.Empty, nitobi.form.numberXslProc);
}

/**
 * Creates a closure for a function and a context. Also supports the passing of arguments. As an alternative to 
 * defining inline anonymous functions that alias the <code>this</code> keyword one can use a closure. The conventional
 * approach to creating a closure is shown below:
 * <pre class="code">
 * example.Account.prototype.getBalance = &#102;unction() {
 *   var xhr = new nitobi.ajax.HttpRequest();
 *   var _this = this;
 *   xhr.onGetComplete.subscribe(&#102;unction(evtArgs) {
 *     _this.balance = evtArgs.response;
 *   });
 *   xhr.get("balance.do");
 * }
 * </pre>
 * An example of the same code using closures is shown below. This code is slightly more verbose yet easier to document and understand as well as 
 * being less prone to Internet Explorer memory leak patterns.
 * <pre class="code">
 * example.Account.prototype.getBalance = &#102;unction() {
 *   var xhr = new nitobi.ajax.HttpRequest();
 *   xhr.onGetComplete.subscribe(nitobi.lang.close(this, this.getBalanceComplete));
 *   xhr.get("balance.do");
 * }
 * example.Account.prototype.getBalanceComplete = &#102;unction(evtArgs) {
 *   this.balance = evtArgs.response;
 * }
 * </pre>
 * @param {Object} context The context for the function to be executed in.
 * @param {Function} func The function to be executed.
 * @param {Array} params An array of arugments that can be passed to the function.
 */
nitobi.lang.close = function(context, func, params)
{
	if (null == params)
	{
		return function()
		{
			return func.apply(context, arguments);
		}
	}
	else
	{
		return function()
		{
			return func.apply(context, params);
		}
	}
}

/**
 * Attachs a function to be called immediately after another method.
 * @param {Object} object1 The object that is the context of the method we are attaching the other method to.
 * @param {String} method1 The name of the method we are attaching the other method to.
 * @param {Object} object2 The object that is the context of the attached method.
 * @param {String} method2 The name of the method we are attaching.
 */
nitobi.lang.after = function(object1, method1, object2, method2)
{
	var srcMethod = object1[method1];
	var attachMethod = object2[method2];
	if(method2 instanceof Function)
		attachMethod = method2;
	object1[method1] = function()
	{
		srcMethod.apply(object1, arguments);
		attachMethod.apply(object2, arguments);
	}
	object1[method1].orig = srcMethod;
}

/**
 * Attachs a function to be called immediately before another method.
 * @param {Object} object1 The object that is the context of the method we are attaching the other method to.
 * @param {String} method1 The name of the method we are attaching the other method to.
 * @param {Object} object2 The object that is the context of the attached method.
 * @param {String|Function} method2 The name of the method we are attaching.
 */
nitobi.lang.before = function(object1, method1, object2, method2)
{
	var srcMethod = object1[method1];
	var attachMethod = function() {};
	if (object2 != null)
		// Set the "before" method to the method that is passed in
		attachMethod = object2[method2];
	if(method2 instanceof Function)
		attachMethod = method2;
	object1[method1] = function()
	{
		attachMethod.apply(object2, arguments);
		srcMethod.apply(object1, arguments);
	}
	object1[method1].orig = srcMethod;
}

/**
 * For each item in the provided array calls the provided function with the array item and the index
 * as the two arguments to the function.
 * @param {Array} arr The array of objects.
 * @param {Function} func The function to be called for each item in the array.
 */
nitobi.lang.forEach = function(arr, func)
{
	var len = arr.length;
	for (var i=0; i<len; i++)
	{
		func.call(this, arr[i], i);
	}
	func = null;
}

/**
 * Throw an error with an optional Javascript exception.
 * @param {String} description a human-readable description of the error
 * @param {Exception|String} [excep] the exception that has caused this error
 */
nitobi.lang.throwError = function(description, excep)
{
	var msg = description;
	if (excep != null)
	{
		msg += "\n - because " + nitobi.lang.getErrorDescription(excep);
	} 
	throw msg;
}
/**
 * @ignore
 */
nitobi.lang.getErrorDescription = function(excep)
{
	var result =
        (typeof(excep.description) == 'undefined') ?
        excep :
        excep.description;
	return result;
}

/**
 * Returns a new obejct 
 * @param {int} ignoreNLeft Ignore the first n arguments.
 * @private
 */
nitobi.lang.newObject = function(className,args,ignoreNLeft)
{
	var a = args;
	if (null == ignoreNLeft) ignoreNLeft = 0;
	var e = "new "+className+"(";
	var comma="";
	for (var i=ignoreNLeft;i<a.length;i++)
	{
		e+=comma + "a[" + i + "]";
		comma=",";
	}
	e+=")";
	return eval(e);
}


/**
 * Get the last n args starting from start
 * @private
 */
nitobi.lang.getLastFunctionArgs = function(args,start)
{
	var a = new Array(args.length-start);
	for (var i=start;i<args.length;i++)
	{
		a[i-start] = args[i];
	}
	return a;
}

/**
 * Return the first available key from a hash.
 * @param {Hash} hash The hash.
 * @type String
 * @private
 */
nitobi.lang.getFirstHashKey = function(hash)
{
	for (var x in hash)
	{
		return x;
	}
}

/**
 * Returns a struct containing the "name" of the first function in
 * obj and the "value" that is the function itself.
 * @param {Object} obj The obj whose function you want.
 * @type Object
 * @private
 */
nitobi.lang.getFirstFunction = function(obj)
{
	for (var x in obj)
	{
		if (obj[x] != null && typeof(obj[x]) == "function" && typeof(obj[x].prototype) != "undefined")
		{
			return {name:x, value: obj[x]};
		}
	}
	return null;
}

/**
 * Returns a shallow copy of an object - this is useful for the event object in IE.
 * @param {Object} obj The object to copy.
 * @type Object
 */
nitobi.lang.copy = function(obj)
{
	var newObj = {};
	for (var item in obj)
		newObj[item] = obj[item];
	return newObj;
}

/**
 * Used by our javascript destructors.
 * @private
 */
nitobi.lang.dispose = function(context, disposal)
{
	try
	{
		if (disposal != null) {
			var disposalLength = disposal.length;
			for (var i=0; i<disposalLength; i++)
			{
				// ?
				if (typeof(disposal[i].dispose) == "function")
					disposal[i].dispose();	
				if (typeof(disposal[i]) == "function")
					disposal[i].call(context);
				disposal[i] = null;
			}
		}

		// Loop through every item in the object.
		for (var item in context)
		{
			if (context[item] != null && context[item].dispose instanceof Function)
				context[item].dispose();
			context[item] = null;
		}
	}
	catch(e)
	{
	}
}

/**
 * Returns a number from a value, and never returns NaN.  Returns 0 if the number
 * can't be parsed.
 * @param {String} val A value that may or may not be a number.
 * @type Number
 */
nitobi.lang.parseNumber = function(val)
{
	var num = parseInt(val);
	return (isNaN(num) ? 0 : num);
}

/**
 * Returns the base-26 style character string for the given number.  This will be valid up from 'a' to 'zz' or (26^2-1)
 * @param {Number} num the number to use in the conversion
 * @type String
 * @private
 */
nitobi.lang.numToAlpha = function(num)
{
	if (typeof(nitobi.lang.numAlphaCache[num]) === 'string')
	{
		return nitobi.lang.numAlphaCache[num];
	}
	var ck1 = num % 26;
	var ck2 = Math.floor(num / 26);
	var alpha = (ck2>0?String.fromCharCode(96+ck2):"")+String.fromCharCode(97+ck1);
	nitobi.lang.alphaNumCache[alpha] = num;
	nitobi.lang.numAlphaCache[num] = alpha;
	return alpha;
};

/**
 * Returns the numeric value (base-10) for the given base-26 style character string.
 * @param {String} alpha the base-26 character string ('a'-'zz')
 * @type Number
 * @private
 */
nitobi.lang.alphaToNum = function(alpha)
{
	if (typeof(nitobi.lang.alphaNumCache[alpha]) === 'number')
	{
		return nitobi.lang.alphaNumCache[alpha];
	}
	var j = 0;
	var num = 0;
	for (var i = alpha.length-1; i >= 0; i--)
	{
		num += (alpha.charCodeAt(i)-96) * Math.pow(26,j++);
	}
	num = num-1;
	nitobi.lang.alphaNumCache[alpha] = num;
	nitobi.lang.numAlphaCache[num] = alpha;
	return num;
};

/**
 * @ignore
 * @private
 */
nitobi.lang.alphaNumCache = {};
/**
 * @ignore
 * @private
 */
nitobi.lang.numAlphaCache = {};

/**
 * Makes the input obj an array.  This will work for many objects that are 'close' to the 
 * standard javascript array, like the <CODE>arguments</CODE> variable. Your original object 
 * will be lost.
 * @param {Obect} obj an Array-like object.
 * @param {Number} ignoreFirst when this is set to <code>n</code>, the returned array will 
 * not contain the first <code>n</code> elements in <code>obj</code>.
 * @type Array 
 */
nitobi.lang.toArray = function(obj, ignoreFirst)
{
	return Array.prototype.splice.call(obj,ignoreFirst || 0);
};

/**
 * Merges two or more <CODE>Map</CODE>s.  Any arguments after <code>obj2</code> will be treated as
 * additional Maps to merge.
 * @param {Map} obj1 the base object
 * @param {Map} obj2 the second object, if <code>obj2</code> has a field in common with 
 * <code>obj1</code>, the value in <code>obj2</code> will be used.
 * @type Map
 */	
nitobi.lang.merge = function(obj1,obj2)
{
	var r = {};
	for (var i = 0; i < arguments.length; i++)
	{
		var a = arguments[i];
		for (var x in arguments[i])
		{
			r[x] = a[x];
		}
	}
	return r;
};

/**
 * Performs a logical XOR on its arguments.  XOR returns true if and only if
 * exactly one argument is true.
 * @type Boolean
 * @private
 */

nitobi.lang.xor = function()
{
    var b = false;
    for( var j = 0; j <arguments.length; j++ )
    {
        if( arguments[ j ] && !b ) b = true;
        else if( arguments[ j ] && b ) return false;
    }
    return b;
};

/**
 * @ignore
 * @private
 */
nitobi.lang.zeros = "00000000000000000000000000000000000000000000000000000000000000000000";
/**
 * adds padding zeroes
 * @private
 */
nitobi.lang.padZeros = function(num, places)
{
	places = places || 2;
	num = num + "";
	return nitobi.lang.zeros.substr(0,Math.max(places - num.length,0)) + num;
}; 

/**
 * An empty function.  This function will do nothing if called.  It can be used as a callback
 * when no callback is desired.
 * @private
 */
nitobi.lang.noop = function(){};

nitobi.lang.isStandards = function() {
	var s = (document.compatMode == "CSS1Compat")
	if (nitobi.browser.SAFARI||nitobi.browser.CHROME)
	{
        var elem = document.createElement('div');
        elem.style.cssText = "width:0px;width:1";
        s = (parseInt(elem.style.width) != 1); 
	}
	return s;
}