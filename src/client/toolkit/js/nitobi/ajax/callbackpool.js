/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
if (typeof(nitobi.ajax) == "undefined")
{
	nitobi.ajax = {};
}

g_CALLBACKPOOL_MAXCONNECTIONS=32767;

/**
 * This class is used to maintain a pool of Callback objects which 
 * can be reserved for use by particular objects and subsequently
 * released once done using them.
 * @private
 */
nitobi.ajax.CallbackPool = function(maxObjects)
{
	this.inUse = new Array();
	this.free = new Array();
	this.max = maxObjects || g_CALLBACKPOOL_MAXCONNECTIONS;
	this.locked = false;
	this.context = null;
};

/**
 * Reserve is used to actually get a handle to a Callback object. 
 * If there are not enough Callback objects a new one will be created.
 * @returns {nitobi.ajax.Callback} Returns a callback object.
 * @private
 */
nitobi.ajax.CallbackPool.prototype.reserve = function()
{
	// TODO: is this even necessary? Can we have a test for this?
	while (this.locked) {}
	
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
			reservedObj = new nitobi.ajax.Callback();
		}
		catch(e)
		{
			reservedObj=null;
		}

		this.inUse.push(reservedObj);
	}
	else
	{
		nitobi.debug.assert(false,"Too many concurrent Callback objects", "", NTB_THROW);
	}

	this.locked = false;
	nitobi.debug.assert(this.inUse.length > 0, "inUse > 0");
	return reservedObj;
};

/**
 * Releases the given Callback object back into the pool.
 * @param {nitobi.ajax.Callback} resource The Callback object to be released.
 * @private
 */
nitobi.ajax.CallbackPool.prototype.release = function(resource)
{

	nitobi.debug.assert(resource != null,"resource == null");
	nitobi.debug.assert(this.inUse.length>0,"None in use");

	var found = false;
	// A blocking lock for thread safety - necessary in javascript?
	while (this.locked) {}

	this.locked = true;

	if (null != resource)
	{
		//	TODO: We should attach the index in the array to the resource when
		//	it is reserved so that we dont have to loop through the resource list again later
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

	nitobi.debug.assert(found,"Tried to release an unreserved resource", NTB_THROW);

	return null;
};

/**
 * Disposes all the Callback objects in the pool when we unload the application.
 * @private
 */
nitobi.ajax.CallbackPool.prototype.dispose = function()
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