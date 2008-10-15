/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
if (typeof(nitobi.ajax) == "undefined")
{
	/**
	 * @namespace The namespace for classes that make up 
	 * the Nitobi cross-browser HttpRequest.
	 * @constructor
	 */
	nitobi.ajax = function() {}
}

/**
 * Creates an XMLHttpRequest object.
 * @type XMLHttpRequest
 * @private
 */
nitobi.ajax.createXmlHttp = function()
{
	if (nitobi.browser.IE)
	{
		//	TODO: try all the XML HTTP objects starting from 5...
		var reservedObj = null;
		try
		{
			reservedObj = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			try
			{
				reservedObj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(ee)
			{
			}
		}
		return reservedObj;
	}
	else if (nitobi.browser.XHR_ENABLED)
	{
		return new XMLHttpRequest();
	}
}