/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.collections");

/**
 *	Creates an IList.
 *	@class A more feature rich IList than a javascript array. If all the items in the IList
 * 	implement ISerializable, then the entire IList will be serializable.
 * 	@constructor
 * 	@extends nitobi.Object
 * 	@implements nitobi.base.ISerializable
 *	@implements nitobi.collections.IEnumerable	
 */
nitobi.collections.IList = function() 
{
	nitobi.base.ISerializable.call(this);
	nitobi.collections.IEnumerable.call(this);
}

nitobi.lang.implement(nitobi.collections.IList,nitobi.base.ISerializable);
nitobi.lang.implement(nitobi.collections.IList,nitobi.collections.IEnumerable);

/**
 * Indicates that the class implements this interface. This is copied onto the class itself
 * when it is implemented. Useful to determine if all IList functions are available.
 * @type Boolean
 */
nitobi.collections.IList.prototype.IListImplemented = true;


/**
	Adds a item to the end of the IList.
	@param {Object} obj An object or primitive to add to the IList.
 */
nitobi.collections.IList.prototype.add = function(obj)
{
	nitobi.collections.IEnumerable.prototype.add.call(this,obj);
	if (obj.ISerializableImplemented == true && obj.profile != null)
	{
		this.addChildObject(obj);		
	}

}

/**
 * Inserts an item at the specified index.  The object at that index and subsequent objects
 * will be moved one place to the right (one index higher).
 * @param {Number} index the index of the object once it is inserted
 * @param {Object} obj an object or primitive to insert in the list
 */
nitobi.collections.IList.prototype.insert = function(index, obj)
{
	var oldObj = this.get(index);
	nitobi.collections.IEnumerable.prototype.insert.call(this,index, obj);
	if (obj.ISerializableImplemented == true && obj.profile != null)
	{
		this.insertBeforeChildObject(obj,oldObj);		
	}
};

/**
 * @private
 */
nitobi.collections.IList.prototype.addToCache = function(obj, index)
{
	nitobi.base.ISerializable.prototype.addToCache.call(this,obj);
	this.list[index] = obj;
}

/**
 * @private
 */
nitobi.collections.IList.prototype.removeFromCache = function(index)
{
	nitobi.base.ISerializable.prototype.removeFromCache.call(this,this.list[index].getId());
}

/**
 * @private
 */
nitobi.collections.IList.prototype.flushCache = function()
{
	nitobi.base.ISerializable.prototype.flushCache.call(this);
	this.list = new Array();
}

/**
 * Returns an item from the IList.
 * @param {Number} index The index of the item you want. Indexed from zero, and throws an error if the index is out of bounds. 
 * If index is an object, the same
 * object is returned.
 * @type Object
 */
nitobi.collections.IList.prototype.get = function(index)
{
	if (typeof(index) == "object")
	{
		return index;
	}
	if (index < 0 || index >= this.getLength())
	{
		nitobi.lang.throwError(nitobi.error.OutOfBounds);
	}
	var obj = null;
	if (this.list[index] != null)
	{
		obj = this.list[index];
	} 
	if (obj == null)
	{
		var xmlNode = nitobi.xml.getChildNodes(this.xmlNode)[index]; 
	
		if (xmlNode==null)
		{
			return null;
		}
		else
		{
			obj = this.factory.createByNode(xmlNode);
			this.onCreateObject.notify(obj);
			nitobi.collections.IList.prototype.addToCache.call(this,obj,index);
		}
		obj.setParentObject(this);
	}
	
	return obj;
}

/**
 * @private
 */
nitobi.collections.IList.prototype.getById = function(id)
{
	var node = this.xmlNode.selectSingleNode("*[@id='"+id+"']");
	var index = nitobi.xml.indexOfChildNode(node.parentNode,node);
	return this.get(index);
}

/**
	Sets an item in the IList.
	@param {Number} index The index for where you want to add the item. Throws an error if out of bounds.
	@param {Object} value The object you want to store.
 */
nitobi.collections.IList.prototype.set = function(index,value)
{
	if (index < 0 || index >= this.getLength())
	{
		nitobi.lang.throwError(nitobi.error.OutOfBounds);
	}
	try
	{
		if (value.ISerializableImplemented == true)
		{
			var obj = this.get(index);
			
			// No need to reset the object if the same object is already in the IList.
			if (obj.getXmlNode() != value.getXmlNode())
			{
				var newNode = this.xmlNode.insertBefore(value.getXmlNode(),obj.getXmlNode());
				this.xmlNode.removeChild(obj.getXmlNode());
				obj.setXmlNode(newNode);	
			}
		}
		value.setParentObject(this);
		// Always update cache last.
		nitobi.collections.IList.prototype.addToCache.call(this,value,index);
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected,err);
	}
}

/**	
 * Removes an item from the IList. An error is thrown if the item does not exists
 * or the index is out of bounds.
 * @param {Number/Object} value An index or object you want removed from the IList.
*/
nitobi.collections.IList.prototype.remove = function(value)
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

	var obj = this.get(i);

	nitobi.collections.IEnumerable.prototype.remove.call(this,value);
	
	this.xmlNode.removeChild(obj.getXmlNode());
}

/**
 * Returns the number of items in the IList.
 * @type Number
*/
nitobi.collections.IList.prototype.getLength = function()
{
	return nitobi.xml.getChildNodes(this.xmlNode).length;
}

