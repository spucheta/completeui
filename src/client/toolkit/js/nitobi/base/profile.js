/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

 /**
 * A Profile stores information about a particular entity. It contains basic 
 * descriptions of how the entity is named as a Class, an XmlTag, and so on.
 * @constructor
 * @param {String} [className] The name of the class associated with this profile.
 * @param {Object} [schema] The schema that helps build the entity if it is complex or has properties.
 * @param {Boolean} [singleton] Whether or not the class associated with this profile is a singleton
 * @param {String} [tagName] The name of the tag associated with this profile.
 * @param {String} [idField] The name of the id field if an id is used.
 */
nitobi.base.Profile = function(className,schema,singleton,tagName,idField) 
{
	/**
	 * The name of the entity when it is represented as a class.
	 * @type String
	 */
	this.className = className;
	
	/**
	 * The class object itself.
	 * @type Object
	 */
	this.classObject = eval(className);
	
	
	/**
	 * The schema that helps build the entity if it is complex or has properties.
	 * @type Schema
	 */
	this.schema = schema;
	
	/**
	 * True if there is only one instance of this entity as an object.
	 * @type Boolean
	 */
	this.singleton = singleton;
	
	/**
	 * The name of the entity when it is represented as an xml tag.
	 * @type String
	 */
	this.tagName = tagName;
	
	/**
	 * The name of the Id field if an Id is used.
	 * @type String
	 */
	this.idField = idField || "id";
}

