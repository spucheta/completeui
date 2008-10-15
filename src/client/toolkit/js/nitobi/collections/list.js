/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.collections");

/**
 * Creates a list.
 * @class A more feature rich list than a javascript array. If all the items in the list
 * implement ISerializable, then the entire list will be serializable.
 * @constructor
 * @param {nitobi.base.Profile} [profile] By default, the list serializes to XML using the tagname ntb:list;
 * if you do not wish to use this name, inherit from this class and supply a different profile.
 * @extends nitobi.Object
 * @implements nitobi.base.ISerializable
 * @implements nitobi.collections.IEnumerable
 * @private
 */
nitobi.collections.List = function(profile) 
{
	nitobi.collections.List.baseConstructor.call(this);
	nitobi.collections.IList.call(this);
}

nitobi.lang.extend(nitobi.collections.List,nitobi.Object);
nitobi.lang.implement(nitobi.collections.List,nitobi.collections.IList);

nitobi.base.Registry.getInstance().register(
		new nitobi.base.Profile("nitobi.collections.List",null,false,"ntb:list")
);