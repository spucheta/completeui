/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

/**
 * This is a singleton and the static getInstance method can be used to retrieve a handle to the object.
 * @class <code>nitobi.base.Factory</code> has methods that aid in creating objects by different sets
 * of attributes.  Is used internally by Toolkit to instantiate components from their declarations.
 * @constructor
 * @extends	nitobi.Object
 */
nitobi.base.Factory = function() 
{
	/**
	 * The Registry containing various component profiles defined by {@link nitobi.base.Profile}
	 * @type nitobi.base.Registry
	 */
	this.registry = nitobi.base.Registry.getInstance();
}

nitobi.lang.extend(nitobi.base.Factory,nitobi.Object);

/**
 * The singleton instance.
 * @private
 */
nitobi.base.Factory.instance = null;

/**
 * Instanstiate a class based on its class name.
 * @param {String} className The className.
 * @param {XmlNode} xmlNode XmlNode. 
 */
nitobi.base.Factory.prototype.createByClass = function(className)
{
	try
	{
		return nitobi.lang.newObject(className,arguments,1);
	} 
	catch(err)
	{
		nitobi.lang.throwError("The Factory (createByClass) could not create the class " + className + ".",err);
	}
}

/**
 * Instanstiate a class based on its serialized form that is stored in an xml node.
 * @param {Object} xmlNode 
 */
nitobi.base.Factory.prototype.createByNode = function(xmlNode)
{
	try
	{
		if (null == xmlNode)
		{
			nitobi.lang.throwError(nitobi.error.ArgExpected);
		}
		if (nitobi.lang.typeOf(xmlNode) == nitobi.lang.type.XMLDOC)
		{
			xmlNode = nitobi.xml.getChildNodes(xmlNode)[0];
		}
		var className = this.registry.getProfileByTag(xmlNode.nodeName).className;
	
		// Don't let this be garbage collected. KEEP THIS CALL!!!!
		var ownerDoc = xmlNode.ownerDocument;
		var methodArgs = Array.prototype.slice.call(arguments, 0);
		var obj = nitobi.lang.newObject(className,methodArgs,0);
		return obj;
	} 
	catch(err)
	{
		nitobi.lang.throwError("The Factory (createByNode) could not create the class " + className + ".",err);
	}
}

/**
 * Instanstiate a class based on its profile.
 * @param {nitobi.base.Profile} profile
 * @type Object
 * 
 */
nitobi.base.Factory.prototype.createByProfile = function(profile)
{
	try
	{
		return nitobi.lang.newObject(profile.className,arguments,1);
	} 
	catch(err)
	{
		nitobi.lang.throwError("The Factory (createByProfile) could not create the class " + profile.className + ".",err);
	}
}

/**
 * Instanstiate a class based on its tag name.
 * @param {String} tagName The tagname corresponding to a component.  e.g. "ntb:calendar"
 */
nitobi.base.Factory.prototype.createByTag = function(tagName)
{

		var className = this.registry.getProfileByTag(tagName).className;
		var methodArgs = Array.prototype.slice.call(arguments, 0);
		return nitobi.lang.newObject(className,methodArgs,1);
}

/**
 * Return an instance of this singleton.
 * @type nitobi.base.Factory
 */
nitobi.base.Factory.getInstance = function()
{
	if (nitobi.base.Factory.instance == null)
	{
		nitobi.base.Factory.instance = new nitobi.base.Factory();
	}
	return nitobi.base.Factory.instance;
}

