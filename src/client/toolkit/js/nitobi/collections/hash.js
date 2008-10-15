/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.collections');

//	Helper function for check if a hash is empty or not.
/**
 * @private
 */
nitobi.collections.isHashEmpty = function(hash) //collections
{
	var empty = true;
	for (var item in hash)
	{
		if (hash[item] != null && hash[item] != '')
		{
			empty = false;
			break;
		}
	}
	return empty;
}

nitobi.collections.hashLength = function(hash)
{
	var count = 0;
	for (var item in hash)
	{
		count++;
	}
	return count;
}

nitobi.collections.serialize = function(hash)
{
	var s = "";
	for (var item in hash)
	{
		var value = hash[item];
		var type = typeof(value);
		if (type == "string" || type == "number")
			s += "'"+item+"':'"+value+"',";
	}
	s = s.substring(0, s.length-1);
	return "{"+s+"}";
}