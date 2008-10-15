/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');
/**
 * Creates a Container.
 * @class A UI container.  A container will typically hold items of type {@link nitobi.ui.Element}.  This is useful for building
 * custom components that are collections of items.  For example, the Nitobi Fisheye component extends this class to manage
 * its menu items.
 * @constructor
 * @param {XmlNode/String} [id] If you want to create a container and deserialize it from the node. Can also be a string for the id.
 * @extends nitobi.ui.Element
 * @implements nitobi.collections.IList
 */
nitobi.ui.Container = function(id)
{
	nitobi.ui.Container.baseConstructor.call(this,id);
	nitobi.collections.IList.call(this);
};

nitobi.lang.extend(nitobi.ui.Container, nitobi.ui.Element);
nitobi.lang.implement(nitobi.ui.Container,nitobi.collections.IList);

nitobi.base.Registry.getInstance().register(
		new nitobi.base.Profile("nitobi.ui.Container",null,false,"ntb:container")
);
