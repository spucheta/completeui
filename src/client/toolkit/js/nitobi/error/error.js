/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
if (false)
{
	/**
	 * @namespace This namespace contains specific error messages, the global {@link nitobi.error#onError}
	 * event, and the {@link nitobi.error.ErrorEventArgs} class.
	 * @private
	 * @constructor
	 */
	nitobi.error = function(){};
}

nitobi.lang.defineNs('nitobi.error');

/**
 * Any errors that are thrown by the browser and can not be passed along to the caller script
 * are notified here. {@link nitobi.error.ErrorEventArgs} is passed as an argument.
 * @type nitobi.base.Event
 */
nitobi.error.onError = new nitobi.base.Event();
if (nitobi)
{
	if (nitobi.testframework)
	{
		if (nitobi.testframework.initEventError)
		{
			nitobi.testframework.initEventError();			
		}
	}
}

/**
 * Creates an event arguments object based on the given parameters.
 * @class Arguments that are passed when nitobi.error.onError fires.
 * @constructor
 * @param {Object} source The object that fired the event.
 * @param {String} description A human-readable description of the error.
 * @param {String} type The type of object that threw the error.
 * @private
 * @extends nitobi.base.EventArgs
 */
nitobi.error.ErrorEventArgs = function(source, description, type)
{
	nitobi.error.ErrorEventArgs.baseConstructor.call(this,source);	

	/**
	 * The error description.
	 * @type String
	 */
	this.description = description;
	/**
	 * The type of object that threw the error.
	 * @type String
	 */
	this.type = type;
}

nitobi.lang.extend(nitobi.error.ErrorEventArgs,nitobi.base.EventArgs);

/**
 * Returns true if the error is the specified error.
 * @param {String} err The error you have.
 * @param {String} checkError The error you want to check against.
 * @type Boolean
 */
nitobi.error.isError = function(err, checkError)
{
	return (err.indexOf(checkError) > -1);	
}

/**
 * Array index out of bounds.
 * @type String
 */
nitobi.error.OutOfBounds = "Array index out of bounds.";
/**
 * An unexpected error occurred.
 * @type String
 */
nitobi.error.Unexpected = "An unexpected error occurred.";
/**
 * The argument is null and not optional.
 * @type String
 */
nitobi.error.ArgExpected = "The argument is null and not optional.";
/**
 * The argument is not of the correct type.
 * @type String
 */
nitobi.error.BadArgType = "The argument is not of the correct type.";
/**
 * The argument is not a valid value.
 * @type String
 */
nitobi.error.BadArg = "The argument is not a valid value.";
/**
 * The XML did not parse correctly.
 * @type String
 */
nitobi.error.XmlParseError = "The XML did not parse correctly.";
/**
 * The HTML declaration could not be parsed.
 * @type String
 */
nitobi.error.DeclarationParseError = "The HTML declaration could not be parsed.";
/**
 * The object does not support the properties or methods of the expected interface. Its class must implement the required interface.
 * @type String
 */
nitobi.error.ExpectedInterfaceNotFound = "The object does not support the properties or methods of the expected interface. Its class must implement the required interface.";
/**
 * No HTML node found with id.
 * @type String
 */
nitobi.error.NoHtmlNode = "No HTML node found with id.";
/**
 * The XML node has no owner document.
 * @type String
 */
nitobi.error.OrphanXmlNode = "The XML node has no owner document.";
/**
 * The HTML page could not be loaded.
 * @type String
 */
nitobi.error.HttpRequestError = "The HTML page could not be loaded.";
