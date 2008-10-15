/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

/**
 * When calling ISerializable, the class must identify itself
 * using a partial profile and it must be registered.  If the object is created by a node using the factory, then
 * the profile is deduced from the nodename.
 * @example
 * nitobi.ui.Button.baseConstructor.call(this,{className:"nitobi.ui.Button"},xmlNode);
 * @class A generalized form of a wrapper around an XML node that allows for serialization to xml.
 * This class allows for the creation of a javascript object from an XML node. 
 * This means that any Xml node can quickly be transformed into its corresponding javascript object and treated accordingly. 
 * The node is used for data storage.  This interface is used to correctly serialize and deserialize javascript objects.
 * @constructor
 * @extends nitobi.Object
 * @param {Object} [xmlNode] The node that specifies the object's data. Optional. If this is null, a new node is created.
 * @param {String} [id] The Id of this object.
 * @param {String} [xml]  The XML string that defines the object and its children. Used to deserialize.
 * @param {nitobi.base.ISerializable} parent The object that is the parent or container of this object.
 */
nitobi.base.ISerializable = function(xmlNode, id, xml, parent) 
{
	nitobi.Object.call(this);
	if (typeof(this.ISerializableInitialized) == "undefined")
	{
		/**
		 * When <code>true</code>, this object has been initialized from an xml node or 
		 * in-page XML declaration.
		 * @type Boolean
		 */
		this.ISerializableInitialized = true;
	}
	else
	{
		return;
	}
	
	/**
	 * The XML Node to which this object is attached.
	 * @type Node
	 * @private
	 */
	this.xmlNode = null;
	this.setXmlNode(xmlNode);
	
	// Fill out as much info as we can about this instance.
	if (xmlNode != null)
	{
		/**
		 * Describes this object.
		 * @type {nitobi.base.Profile}
		 * @private
		 */
		this.profile = nitobi.base.Registry.getInstance().getCompleteProfile({idField:null,tagName:xmlNode.nodeName});
	}
	else
	{
		this.profile = nitobi.base.Registry.getInstance().getProfileByInstance(this);
	}
		
	/**
	 * Fires after deserialization.
	 * @type nitobi.base.Event
	 */
	this.onDeserialize = new nitobi.base.Event();
	
	/**
	 * Fires after the node knows it's parent.
	 * @private
	 * @type nitobi.base.Event;
	 */
	this.onSetParentObject = new nitobi.base.Event();
	
	/**
	 * The factory used to create this object and its children.
	 * @type Factory
	 * @private
	 */
	this.factory = nitobi.base.Factory.getInstance();
	/**
	 * A cache of objects already created from nodes.
	 * @type HashMap
	 * @private
	 */
	this.objectHash = {};
	
	
	/**
	 * Fired when an object is newly created.
	 * @type nitobi.base.Event
	 */
	this.onCreateObject = new nitobi.base.Event();

	if (xmlNode != null)
	{
		this.deserializeFromXmlNode(this.getXmlNode());
	}
	else if (this.factory!=null && this.profile.tagName != null)
	{
		this.createByProfile(this.profile, this.getXmlNode());
	}
	else
	{
		if (xml != null && xmlNode != null)
		{
			this.createByXml(xml);
		}
	}

	this.disposal.push(this.xmlNode);
}

nitobi.lang.extend(nitobi.base.ISerializable, nitobi.Object);
/**
 * @private
 */
nitobi.base.ISerializable.guidMap = {};

/**
 Indicates that the class implements this interface. This is copied onto the class itself
 when it s implemented. Useful to determine if all ISerializable functions are available.
 @type Boolean
 */
nitobi.base.ISerializable.prototype.ISerializableImplemented = true;

/**
 * Returns the profile that describes this object.
 * @type nitobi.base.Profile
 */ 
nitobi.base.ISerializable.prototype.getProfile = function()
{
	return this.profile;
}


/**
 * Used by the constructor to create the object. 
 * @param {nitobi.base.Profile} The profile that describes enough about the object to create it.
 * @param {XMLNode} xmlNode Optional. If supplied, uses this node for storage.
 * @private
 */
nitobi.base.ISerializable.prototype.createByProfile = function(profile, xmlNode)
{
	if (xmlNode == null)
	{		
		var xml="<" + profile.tagName + " xmlns:" + nitobi.base.XmlNamespace.prefix + "=\"" + nitobi.base.XmlNamespace.uri + "\" />"
		var xmlDoc = nitobi.xml.createXmlDoc(xml);
		this.setXmlNode(xmlDoc.firstChild);
		this.deserializeFromXmlNode(this.xmlNode);		
	}
	else
	{
		this.deserializeFromXmlNode(xmlNode);		
		this.setXmlNode(xmlNode);
	}
}

/**
 * Used by the constructor to create the object by deserializing it. 
 * @param {string} xml Xml used in deserialization.
 * @private
 */
nitobi.base.ISerializable.prototype.createByXml = function(xml)
{
	this.deserializeFromXml(xml);
}

/**
 * Returns the object that created this object. If the value is null
 * then this object does not have an ISerializable parent.
 * @type nitobi.base.ISerializable
 */
nitobi.base.ISerializable.prototype.getParentObject = function()
{
	return this.parentObj;
}

/**
 * @ignore
 */
nitobi.base.ISerializable.prototype.setParentObject = function(value)
{
	this.parentObj = value;
	this.onSetParentObject.notify();
}

/**
 * Add a serializable object to this one. 
 * @param {nitobi.base.ISerializable} child The child to add.
 * @private
 */
nitobi.base.ISerializable.prototype.addChildObject = function(child)
{
	this.addToCache(child);
	child.setParentObject(this);
	var xmlNode = child.getXmlNode();
	if (!this.areGuidsGenerated(xmlNode))
	{
		xmlNode = this.generateGuids(xmlNode);
		child.setXmlNode(xmlNode);
	}

	// Append the child xmlNode to the parent and update the pointer to the childs xmlNode to the node in the parents document ... 
	// In particular this is a DOM problem in Safari 3 / Firefox 3
	child.setXmlNode(this.xmlNode.appendChild(nitobi.xml.importNode(this.xmlNode.ownerDocument, xmlNode, true)));
	
}

/**
 * Insert a serializable object at an index specified. 
 * @param {nitobi.base.ISerializable} obj The object to insert.
 * @param {nitobi.base.ISerializable} sibling The siblign to insert before
 * @private
 */
nitobi.base.ISerializable.prototype.insertBeforeChildObject = function(obj, sibling)
{
	sibling = sibling ? sibling.getXmlNode() : null;
	this.addToCache(obj);
	obj.setParentObject(this);
	var xmlNode = obj.getXmlNode();
	if (!this.areGuidsGenerated(xmlNode))
	{
		xmlNode = this.generateGuids(xmlNode);
		obj.setXmlNode(xmlNode);
	}
	xmlNode = nitobi.xml.importNode(this.xmlNode.ownerDocument, xmlNode, true);
	this.xmlNode.insertBefore(xmlNode, sibling);
}


/**
 * Create a new node using our namespace.
 * @return A new Xml node/element.
 * @type XMLNode
 * @param name {String} name The name of the node including the ns prefix.
 * @private
 */
nitobi.base.ISerializable.prototype.createElement = function(name)
{
	var xmlDoc;
	if (this.xmlNode == null || this.xmlNode.ownerDocument == null)
	{
		xmlDoc = nitobi.xml.createXmlDoc();	
	}
	else
	{
		xmlDoc = this.xmlNode.ownerDocument;
	}
	
	
	if (nitobi.browser.IE)
	{
		return xmlDoc.createNode(1, name, nitobi.base.XmlNamespace.uri);
	}
	else if (xmlDoc.createElementNS)
	{
		return xmlDoc.createElementNS(nitobi.base.XmlNamespace.uri, name);
	} else
	{
		nitobi.lang.throwError("Unable to create a new xml node on this browser.");
	}
}

/**
 * Deletes a child from the cache including its corresponding node in the xml document.
 * @param {nitobi.base.ISerializable} child The child to delete.
 * @private
 */
nitobi.base.ISerializable.prototype.deleteChildObject = function(id)
{
	this.removeFromCache(id);
	var e = this.getElement(id);
	if (e!=null)
	{
		e.parentNode.removeChild(e);
	}
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.addToCache = function(obj)
{
	this.objectHash[obj.getId()] = obj;
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.removeFromCache = function(id)
{
	this.objectHash[id] = null;
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.inCache = function(id)
{
	return (this.objectHash[id] != null);
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.flushCache = function()
{
	this.objectHash = {};
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.areGuidsGenerated = function(xmlNode)
{
	if (xmlNode == null || xmlNode.ownerDocument == null) return false;
	if (nitobi.browser.IE)
	{
		var node = xmlNode.ownerDocument.documentElement;
		if (node == null)
		{
			return false;
		}
		else
		{
			var id = node.getAttribute("id");
			if (id == null || id == "")
			{
				return false;
			} 
			else
			{
				return (nitobi.base.ISerializable.guidMap[id] != null);
			}
		}
	}
	else
	{
		return (xmlNode.ownerDocument.generatedGuids == true);
	}
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.setGuidsGenerated = function(xmlNode,value)
{
	if (xmlNode == null || xmlNode.ownerDocument == null) return;
	if (nitobi.browser.IE)
	{
		var node = xmlNode.ownerDocument.documentElement;
		if (node != null)
		{
			var id = node.getAttribute("id");
			if (id != null && id != "")
			{
				nitobi.base.ISerializable.guidMap[id] = true;
			} 
		}
	}
	else
	{
		xmlNode.ownerDocument.generatedGuids = true;
	}
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.generateGuids = function(xmlNode)
{
	/*var doc = nitobi.xml.createXmlDoc(nitobi.xml.serialize(xmlNode));
	var node = nitobi.xml.transformToString(doc,nitobi.base.uniqueIdGeneratorProc,'xml');
	node = nitobi.xml.createXmlDoc(node).documentElement; 
	
	// We don't want moz to accidentally destoy the owner document, hence the jumble here.
	// Ideally, loss of namespace information would be fixed in the xml libs. Pending though.
	var parent = xmlNode.parentNode;
	parent.replaceChild(node,xmlNode);*/
	nitobi.base.uniqueIdGeneratorProc.addParameter('guid', nitobi.component.getUniqueId(), '');
	var doc = nitobi.xml.transformToXml(xmlNode,nitobi.base.uniqueIdGeneratorProc);
	this.saveDocument = doc;
	this.setGuidsGenerated(doc.documentElement,true);
	return doc.documentElement;
}

/**
 * Deserializes the object from an XML node. All references to the properties of the 
 * object are destroyed or invalidated.  The cache is also emptied.  The XML Node
 * should be of the same type as the object, that is, don't deserialize a node such as 
 * &lt;foo&gt; if the class is not Foo.
 * @param {XMLNode} xmlNode The XML Node from which this object will be deserialized.
 */
nitobi.base.ISerializable.prototype.deserializeFromXmlNode = function(xmlNode)
{
	if (!this.areGuidsGenerated(xmlNode))
	{
		xmlNode = this.generateGuids(xmlNode);
	}
	this.setXmlNode(xmlNode);
	this.flushCache();
		
	if (this.profile == null)
	{
		this.profile = nitobi.base.Registry.getInstance().getCompleteProfile({idField:null,tagName:xmlNode.nodeName});
	}

	this.onDeserialize.notify();
}

/**
 * Deserializes the object from an XML string. All references to the properties of the 
 * object are destroyed or invalidated.  The cache is also emptied.  The XML 
 * should be of the same type as the object, that is, don't deserialize a node such as 
 * &lt;foo&gt; if the class is not Foo.
 * @param {String} xml Valid Xml.
 */
nitobi.base.ISerializable.prototype.deserializeFromXml = function(xml)
{
	var doc = nitobi.xml.createXmlDoc(xml);
	var node = this.generateGuids(doc.firstChild);
	this.setXmlNode(node);
	this.onDeserialize.notify();
}


/**
 * Returns a child of this object given its profile and its id. 
 * @param Id {string} id Optional. The id of the object. Only needed if there are two or more objects of the same
 * type stored by this object.
 * @returns {nitobi.base.ISerializable} The requested object.
 * @private
 */
nitobi.base.ISerializable.prototype.getChildObject = function(id)
{
	var obj = null; 
	obj = this.objectHash[id]; 
	if (obj == null)
	{
		var xmlNode = this.getElement(id);
	
		if (xmlNode==null)
		{
			return null;
		}
		else
		{
			obj = this.factory.createByNode(xmlNode);
			this.onCreateObject.notify(obj);
			this.addToCache(obj);
		}
		obj.setParentObject(this);
	}
	return obj;
}

/**
 * Returns a child of this object given its id. 
 * @param Id {string} id The id of the object.
 * @returns {nitobi.base.ISerializable} The requested object.
 * @private
 */
nitobi.base.ISerializable.prototype.getChildObjectById = function(id)
{
	return this.getChildObject(id);
}

/**
 * Returns the xmlnode that corresponds to the object specified by its profile.
 * @param Id {string} id Optional. The id of the object. Only needed if there are two or more objects of the same
 * type stored by this object.
 * @returns {object} The node that is attached to the specified object.
 * @private
 */
nitobi.base.ISerializable.prototype.getElement = function(id)
{
	try
	{
		var node = this.xmlNode.selectSingleNode("*[@id='"+id+"']");
		return node;
	}
	catch(err)
	{
		nitobi.lang.throwError(nitobi.error.Unexpected,err);
	}
}

/**
 * The Factory used to create this object and its children.
 * @type nitobi.base.Factory
 * @private
 */
nitobi.base.ISerializable.prototype.getFactory = function()
{
	return this.factory;
}

/**
 * The Factory used to create this object and its children. 
 * @param value {nitobi.base.Factory} value
 * @private
 */
nitobi.base.ISerializable.prototype.setFactory = function(value)
{
	this.factory = factory;
}

/**
 * The node that stores the object in the XML DOM.
 * Be careful modifying this node programmatically; items stored in this
 * node are also cached.
 * @type XMLNode
 * 
 */
nitobi.base.ISerializable.prototype.getXmlNode = function()
{
	return this.xmlNode;
}

/**
 * Returns the node that stores the object in the XML DOM.
 * Be careful modifying this node programmatically; items stored in this
 * node are also cached. If you set this, you should also clear the cache.
 * @param {XMLNode} value The XMLNode to use.
 * @private
 */
nitobi.base.ISerializable.prototype.setXmlNode = function(value)
{
	if (nitobi.lang.typeOf(value) == nitobi.lang.type.XMLDOC && value != null)
	{
		this.ownerDocument = value;
		value = nitobi.html.getFirstChild(value);
	}
	else if (value!=null)
	{
		this.ownerDocument = value.ownerDocument;
	}
	// TODO: Awaiting fix.
	if (value != null && nitobi.browser.MOZ && value.ownerDocument == null)
	{
		nitobi.lang.throwError(nitobi.error.OrphanXmlNode + " ISerializable.setXmlNode");
	}
	this.xmlNode = value;
}


/**
 * Serializes the object into XML.
 * @type String
 */
nitobi.base.ISerializable.prototype.serializeToXml = function()
{
	return nitobi.xml.serialize(this.xmlNode);
}

/**
 * Returns an attribute from the object as a string. The attribute 
 * must be a simple type (i.e., string, integer, etc); use getObject
 * to return a complex type.
 * @param {String} name The name of the attribute.
 * @param {String} [defaultValue] The defualt value for this attribute.
 */
nitobi.base.ISerializable.prototype.getAttribute = function(name, defaultValue)
{
	if (this[name] != null) 
	{
		return this[name];
	}
	var retVal = this.xmlNode.getAttribute(name);
	return retVal === null ? defaultValue : retVal;
}

/**
 * Sets any kind of value as an attribute on the object.  If the value
 * is a complex object it's string representation is used (i.e., it may be stored as
 * name="[object]". Use setObject to set a complex object.
 * @param {String} name The name of the attribute. This must be a valid XML attribute name.
 * @param {String} value The value of the attribute.
 */
nitobi.base.ISerializable.prototype.setAttribute = function(name, value)
{
	this[name] = value;
	this.xmlNode.setAttribute(name.toLowerCase(),value != null ? value.toString() : "");
}

/**
 * Sets an integer value as an attribute on the object.  The value must be a valid
 * number otherwise an error is thrown.
 * @param {String} name The name of the attribute. This must be a valid XML attribute name.
 * @param {Number} value The value of the attribute.
 */
nitobi.base.ISerializable.prototype.setIntAttribute = function(name,value)
{
	var n = parseInt(value);
	if (value != null && (typeof(n) != "number" || isNaN(n))) 
	{
		nitobi.lang.throwError(name + " is not an integer and therefore cannot be set. It's value was " + value);
	}
	this.setAttribute(name,value);
}

/**
 * Returns a integer attribute from the object. The attribute 
 * must be an integer; if it is "" then zero is returned, otherwise, if the
 * value is not a valid number, an error is thrown.
 * @param {String} name The name of the attribute.
 * @param {Number} [defaultValue] The default value for this attribute.
 * @type Number
 */
nitobi.base.ISerializable.prototype.getIntAttribute = function(name, defaultValue)
{
	var x = this.getAttribute(name, defaultValue);
	if (x==null || x=="")
	{
		return 0;
	}
	var tx = parseInt(x);
	if (isNaN(tx))
	{
		nitobi.lang.throwError("ISerializable attempting to get " + name + " which was supposed to be an int but was actually NaN");
	}
	return tx;
}

/**
 * Sets a boolean value as an attribute on the object.  The value must be a valid
 * boolean otherwise an error is thrown.
 * @param {String} name The name of the attribute. This must be a valid XML attribute name.
 * @param {Boolean} value The value of the attribute.
 */
nitobi.base.ISerializable.prototype.setBoolAttribute = function(name,value)
{
	value = nitobi.lang.getBool(value);
	if (value != null && typeof(value) != "boolean") 
	{
		nitobi.lang.throwError(name + " is not an boolean and therefore cannot be set. It's value was " + value);
	}
	this.setAttribute(name,(value ? "true" : "false"));
}

/**
 * Returns a boolean attribute from the object. The attribute 
 * must be a boolean; if it is "" then null is returned, otherwise, if the
 * value is not a valid boolean, an error is thrown.
 * @param {String} name The name of the attribute.
 * @param {Boolean} defaultValue The default value for this attribute. (Optional)
 * @type Boolean
 */
nitobi.base.ISerializable.prototype.getBoolAttribute = function(name, defaultValue)
{
	var x = this.getAttribute(name, defaultValue);
	if (typeof(x) == "string" && x=="")
	{
		return null;
	}
	var tx = nitobi.lang.getBool(x);
	if (tx == null)
	{
		nitobi.lang.throwError("ISerializable attempting to get " + name + " which was supposed to be a bool but was actually " + x);
	}
	return tx;
}

/**
 * Sets a Date value as an attribute on the object.  The value must be a valid
 * Date otherwise an error is thrown.
 * @param {String} name The name of the attribute. This must be a valid XML attribute name.
 * @param {Date} value The value of the attribute.
 */
nitobi.base.ISerializable.prototype.setDateAttribute = function(name,value)
{	
	this.setAttribute(name,value);
}

/**
 * Returns a Date attribute from the object. The attribute 
 * must be a boolean; if it is "" then null is returned, otherwise, if the
 * value is not a valid Date, an error is thrown.
 * @param {String} name The name of the attribute. This must be a valid XML attribute name.
 * @param {Boolean} value The value of the attribute.
 */
nitobi.base.ISerializable.prototype.getDateAttribute = function(name, defaultValue)
{	
	if (this[name])
	{
		return this[name];
	}
	var dateStr = this.getAttribute(name, defaultValue);
	return dateStr ? new Date(dateStr) : null;
}

/**
 * Returns the id of the object. This id is assumed to be globally unique.
 * @type String
 */
nitobi.base.ISerializable.prototype.getId = function()
{
	return this.getAttribute("id");
}


/**
 * Returns the id of a child object. Note: this is the id of the child object currently being
 * stored in this object. 
 * @param {nitobi.base.Profile/nitobi.base.ISerializable} locator Either the profile of the object, or the object itself. 
 * If the locator is an ISerializable object, it may or may not be the same object that is currently being stored.
 * @param {String} If there is more than one type of this object being stored, then you must include the instance name. 
 * If only one type of this object is stored, the name is not required.
 * @type String
 * @private
 */
nitobi.base.ISerializable.prototype.getChildObjectId = function(locator, instanceName) 
{
	var tagname = (typeof(locator.className) == "string" ? locator.tagName : locator.getXmlNode().nodeName);
	var xpath = tagname;
	if (instanceName)
	{
		xpath += "[@instancename='"+instanceName+"']";
	}
	
	var node = this.getXmlNode().selectSingleNode(xpath);
	if (null == node)
	{
		return null;
	}
	else
	{
		return node.getAttribute("id");
	}
}

/**
 * Sets an object value as a sub element of the object.  The object must implement 
 * ISerializable otherwise an error is thrown.  In order to uniquely identify child objects of the same type,
 * an id is used. If getId() is not defined on the object, it is added and the name
 * is used as an id.
 * @param {String} instanceName The name of the object. This must be a valid XML attribute name.  If no name is specified
 * it is assumed that there is only one type of this object.
 * @param {Object} value The value. Must implement ISerializable.
 */
nitobi.base.ISerializable.prototype.setObject = function(value, instanceName) 
{
	if (value.ISerializableImplemented != true)
	{
		nitobi.lang.throwError(nitobi.error.ExpectedInterfaceNotFound + " ISerializable");
	}
	
	var id = this.getChildObjectId(value,instanceName);
	if (null != id)
	{
		this.deleteChildObject(id);
	}
	if (instanceName)
	{
		value.setAttribute("instancename",instanceName);
	}
	this.addChildObject(value);
}

/**
 * Returns a child object of the current object. The class must be 
 * registered with the factory this object is using.  If the current object contains
 * more that one type of the child, the name of the child is used as an id.
 * @param {String} instanceName The name of the child. Optional. If this is not supplied, then
 * the first child that matches the classname is retrieved.
 * @param {nitobi.base.Profile} profile The profile of the child you want to retrieve.
 * @type Object
 */
nitobi.base.ISerializable.prototype.getObject = function(profile, instanceName) 
{
	var id = this.getChildObjectId(profile,instanceName);
	if (null == id)
	{
		return id;
	}
	return this.getChildObject(id);
}

/**
 * Returns the object given its id.
 * @param {String} id The id of the object.
 */
nitobi.base.ISerializable.prototype.getObjectById = function(id) 
{
	return this.getChildObject(id);
	
}

/**
 * @private
 */
nitobi.base.ISerializable.prototype.isDescendantExists = function(id)
{
	var node = this.getXmlNode();
	var child = node.selectSingleNode("//*[@id='" + id + "']");
	return (child!=null);
}

/**
 * Returns an array of xmlNodes that describes the path from this node
 * to a descendant node.
 * @param {String} id The id of the descendant.
 * @type Array
 * @private
 */
nitobi.base.ISerializable.prototype.getPathToLeaf = function(id)
{
	var node = this.getXmlNode();
	var child = node.selectSingleNode("//*[@id='" + id + "']");
	if (nitobi.browser.IE)
	{
		child.ownerDocument.setProperty("SelectionLanguage","XPath");
	}
	var pathNodes = child.selectNodes("./ancestor-or-self::*");
	var thisId = this.getId();
	var start=0;
	for (var i=0;i<pathNodes.length;i++)
	{
		if (pathNodes[i].getAttribute("id") == thisId)
		{
			start = i+1;
			break;
		}
	}
	var arr = nitobi.collections.IEnumerable.createNewArray(pathNodes,start);
	return arr.reverse();
}


/**
 * @private
 */
nitobi.base.ISerializable.prototype.isDescendantInstantiated = function(id)
{
	var node = this.getXmlNode();
	var child = node.selectSingleNode("//*[@id='" + id + "']");
	if (nitobi.browser.IE)
	{
		child.ownerDocument.setProperty("SelectionLanguage","XPath");
	}
	var pathNodes = child.selectNodes("ancestor::*");
	var startPushing = false;
	var obj = this;
	for (var i=0;i<pathNodes.length;i++)
	{
		if (startPushing)
		{
			var pathId = pathNodes[i].getAttribute("id");
			instantiated = obj.inCache(pathId);
			if (!instantiated)
			{
				return false;
			}
			obj = this.getObjectById(pathId)
		}
		if (pathNodes[i].getAttribute("id") == this.getId())
		{
			startPushing = true;
		}
	}
	return obj.inCache(id);
}
	
