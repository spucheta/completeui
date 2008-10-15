/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.html");

/**
 * <I>This class has no constructor.</I>
 * @class Utilities for manipulating URLs.
 * @constructor
 */
nitobi.html.Url = function(){};

/**
 * Sets the parameter key to value in the given url, and returns the new url.
 * @param {String} url the URL to modify, can be relative or absolute
 * @param {String} key the parameter name
 * @param {String} value the new parameter value 
 * @type String
 */
nitobi.html.Url.setParameter = function(url, key, value)
{
	var reg = new RegExp('(\\?|&)('+encodeURIComponent(key)+')=(.*?)(&|$)');
	if (url.match(reg))
	{
		return url.replace(reg, '$1$2='+encodeURIComponent(value)+'$4');		
	}
	if (url.match(/\?/))
	{
		url = url + '&';
	}
	else
	{
		url = url + '?';
	}
	return url + encodeURIComponent(key) + '=' + encodeURIComponent(value);
};

/**
 * Removes the parameter key from url's parameter list and returns the new URL.
 * @param {String} url the URL to modify
 * @param {String} key the parameter to remove
 * @type String
 */
nitobi.html.Url.removeParameter = function(url, key)
{
	var reg = new RegExp('(\\?|&)('+encodeURIComponent(key)+')=(.*?)(&|$)');
	return url.replace(reg, 
		function(str,p1,p2,p3,p4,offset,s)
		{
			if (((p1) == '?') && (p4 != '&'))
			{
				return "";
			}
			else
			{
				return p1;
			} 
		}
	);
};

/**
 * Returns the path of a URL.  The path will have a slash on the end, or will be the empty string.  
 * In that way,
 * <CODE><PRE> 
 * var url = 'http://nitobi.com/index.html'
 * normalize(url) === normalize(normalize(url)) === 'http://nitobi.com/';
 * </PRE></CODE>.
 * @private
 * @param {String} url The URL to normalize.
 * @param {String} file An optional file URL to append to the normalized url.  If the file URL
 * is absolute, the function returns just the file URL.
 * @returns {String} The normalized url.
 */
nitobi.html.Url.normalize = function(url, file)
{
	if (file) {
		if (file.indexOf('http://') == 0 || file.indexOf('https://') == 0 || file.indexOf('/') == 0) {
			return file;
		}
	}
	var href = (url.match(/.*\//) || "") + "";
	if (file)
	{
		return href + file;
	}
	return href;
}

/**
 * Returns the url with a random parameter added.  This is useful for preventing 
 * a URL from being saved in browser cache.
 * @param url the URL to modify
 * @type String
 */
nitobi.html.Url.randomize = function(url)
{
	return nitobi.html.Url.setParameter(url, 'ntb-random',(new Date).getTime());
};
	
