/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.collections");
if (false)
{
	/**
	 * @namespace The collections namespace contains classes that help manage different types of collection objects.
	 * @constructor
	 */
	nitobi.collections = function(){};
}

/**
 * Supports adding more complex list functions to a class. 
 * @class An interface that provides for advanced array/list functions.
 * @constructor
 */
nitobi.collections.IEnumerable = function() 
{
	/**
		@ignore
	*/
	this.list = new Array();
	
	/**
		@ignore
	*/
	this.length=0;
}

/**
 * Adds a item to the end of the list.
 * @param {Object} obj An object or primitive to add to the list.
 */
nitobi.collections.IEnumerable.prototype.add = function(obj)
{
	this.list[this.getLength()] = obj;
	this.length++
}

/**
 * Inserts an item at the specified index.  The object at that index and subsequent objects
 * will be moved one place to the right (one index higher).
 * @param {Number} index the index of the object once it is inserted
 * @param {Object} obj an object or primitive to insert in the list
 */
nitobi.collections.IEnumerable.prototype.insert = function(index, obj)
{
	this.list.splice(index, 0, obj);
	this.length++;
};

/**
 * Converts something that looks like a javascript Array into a javascript Array.
 * @type Array
 * @param {Object} obj An objects that supports [].
 * @param {Number} start Where to start the copy.
 */
nitobi.collections.IEnumerable.createNewArray = function(obj, start)
{
	var length;
	start = start || 0;
	if (obj.count)
	{
		length = obj.count;
	}
	if (obj.length)
	{
		length = obj.length;
	}
	var x = new Array(length-start);
	for (var i = start; i < length; i++)
	{
		x[i - start] = obj[i];
	}
	return x;
}

/**
 * Returns an item from the list.
 * @param {Number} index The index of the item you want. Indexed from zero, and throws an error if the index is out of bounds.
 * @type Object
 */
nitobi.collections.IEnumerable.prototype.get = function(index)
{
	if (index < 0 || index >= this.getLength())
	{
		nitobi.lang.throwError(nitobi.error.OutOfBounds);
	}
	return this.list[index];
}

/**
 * Sets an item in the list.
 * @param {Number} index The index for where you want to add the item. Throws an error if out of bounds.
 * @param {Object} value The object you want to store.
 */
nitobi.collections.IEnumerable.prototype.set = function(index,value)
{
	if (index < 0 || index >= this.getLength())
	{
		nitobi.lang.throwError(nitobi.error.OutOfBounds);
	}
	this.list[index] = value;
}

/**
 * Finds the index of an item in the list.  The first match is returned if 
 * duplicates exist.
 * @param {Object} obj The item whose index you want to find.
 * @type Number
*/
nitobi.collections.IEnumerable.prototype.indexOf = function(obj)
{
	for (var i = 0; i < this.getLength(); i++)
	{
		if (this.list[i] === obj)
		{
			return i;
		}
	}
	return -1;
}

/**
 * Removes an item from the list. An error is thrown if the item does not exists
 * or the index is out of bounds.
 * @param {Number/Object} value An index or object you want removed from the list.
*/
nitobi.collections.IEnumerable.prototype.remove = function(value)
{
	var i;
	if (typeof(value) != "number")
	{
		i = this.indexOf(value);
	}
	else
	{
		i = value;
	}
	if (-1 == i || i < 0 || i >= this.getLength())
	{
		nitobi.lang.throwError(nitobi.error.OutOfBounds);
	}
	this.list[i] = null;
	this.list.splice(i,1);
	this.length--;
}

/**
 * Returns the number of items in the list.
 * @type Number
*/
nitobi.collections.IEnumerable.prototype.getLength = function()
{
	return this.length;
}

/**
 * Applies the function <CODE>func</CODE> to each element in the collection, in order.
 * @param {Function} func A function that will be evaluated on each element in the collection.
 */
nitobi.collections.IEnumerable.prototype.each = function(func)
{
	var l = this.length;
	var list = this.list;
	for (var i = 0; i < l; i++)
	{
		func(list[i]);
	}
};
 