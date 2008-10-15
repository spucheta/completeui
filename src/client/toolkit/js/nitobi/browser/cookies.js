/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.browser");
// Is this stuff tested?
/**
 * @private
 */
nitobi.browser.Cookies = function()
{
};

nitobi.lang.extend(nitobi.browser.Cookies, nitobi.Object);

/**
 * Returns a cookie with the given ID.
 * @param {String} id The ID of the cookie to retrieve.
 * @returns {Cookie}
 */
nitobi.browser.Cookies.get = function(id)
{
	var begin, end;
	if (document.cookie.length > 0)
	{
		begin = document.cookie.indexOf(id+"=");
		if (begin != -1)
		{
			begin += id.length+1;
			end = document.cookie.indexOf(";", begin);
			if (end == -1) end = document.cookie.length;
			return unescape(document.cookie.substring(begin, end)); 
		}
	}
	return null;
};

/**
 * Sets the
 * @param {String} id The ID of the cookie.
 * @param {String} value The value to be stored in the cookie.
 * @param {String} expireDays The number of days before the cookie should expire.
 */
nitobi.browser.Cookies.set = function(id, value, expireDays)
{
	var expiry = new Date ();
	expiry.setTime(expiry.getTime() + (expireDays * 24 * 3600 * 1000));

	document.cookie = id + "=" + escape(value) +
	((expireDays == null) ? "" : "; expires=" + expiry.toGMTString());
};

/**
 * Destroys cookie.
 * @param {String} id The ID of the cookie to destroy.
 */
nitobi.browser.Cookies.remove = function(id)
{
	if (nitobi.browser.Cookies.get(id)) 
	{
		document.cookie = id + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
};
