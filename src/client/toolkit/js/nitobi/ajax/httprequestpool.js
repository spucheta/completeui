/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class A class to manage {@link nitobi.ajax.HttpRequest} objects.
 * @constructor This class is a singleton.  Do not instantiate it; use {@link #getInstance} instead.
 * @param {Number} maxObjects The maximum number of HttpRequest objects in the pool.  Defaults to the value 
 * defined in nitobi.ajax.HttpRequestPool_MAXCONNECTIONS
 */
nitobi.ajax.HttpRequestPool = function(maxObjects)
{
	/**
	 * @private
	 */
	this.inUse = new Array();
	/**
	 * @private
	 */
	this.free = new Array();
	/**
	 * @private
	 */
	this.max = maxObjects || nitobi.ajax.HttpRequestPool_MAXCONNECTIONS;
	/**
	 * @private
	 */
	this.locked = false;
	/**
	 * @private
	 */
	this.context = null;
}

/**
 * Retrieves an HttpRequest object from the pool. If there are no available objects it will create a new one until the
 * maximum number of objects are created.
 * @type nitobi.ajax.HttpRequest
 */
nitobi.ajax.HttpRequestPool.prototype.reserve = function()
{
	// A blocking lock for thread safety
	//	TODO: This should be changed into a callback to prevent user interface locking ...
//		while (this.locked) {}

	this.locked = true;

	var reservedObj;

	if (this.free.length)
	{
		reservedObj = this.free.pop();
		reservedObj.clear();
		this.inUse.push(reservedObj);
	}
	else if(this.inUse.length < this.max)
	{
		try
		{
			reservedObj = new nitobi.ajax.HttpRequest();
		}
		catch(e)
		{
			reservedObj=null;
		}

		this.inUse.push(reservedObj);
	}
	else
	{
		throw "No request objects available";
	}

	this.locked = false;
	return reservedObj;
}

/**
 * Returns an HttpRequest object back to the pool.
 * @param {nitobi.ajax.HttpRequest} resource The resource to return to the pool.
 */
nitobi.ajax.HttpRequestPool.prototype.release = function(resource)
{
	var found = false;
	// A blocking lock for thread safety - necessary in javascript?
	//while (this.locked) {}
	this.locked = true;
	if (null != resource)
	{
		for (var i=0; i < this.inUse.length; i++)
		{
			if (resource == this.inUse[i])
			{
				this.free.push(this.inUse[i]);
				this.inUse.splice(i,1);
				found = true;
				break;
			}
		}
	}
	this.locked = false;

	return null;
}

/**
 * @ignore
 */
nitobi.ajax.HttpRequestPool.prototype.dispose = function()
{
	for (var i=0; i<this.inUse.length; i++)
	{
		this.inUse[i].dispose();
	}
	this.inUse = null;
	for (var j=0; j<this.free.length; j++)
	{
		this.free[i].dispose();
	}
	this.free = null;
}

/**
 * @private
 */
nitobi.ajax.HttpRequestPool.instance = null;
/**
 * Returns the globally used HttpRequestPool instance.
 * @type nitobi.ajax.HttpRequestPool
 */
nitobi.ajax.HttpRequestPool.getInstance = function()
{
	if (nitobi.ajax.HttpRequestPool.instance == null)
	{
		nitobi.ajax.HttpRequestPool.instance = new nitobi.ajax.HttpRequestPool();
	}
	return nitobi.ajax.HttpRequestPool.instance;
}
