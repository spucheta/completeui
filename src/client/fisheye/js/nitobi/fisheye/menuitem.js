/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.fisheye");

/**
 * Creates a menu item.
 * @class A menu item to be used with a {@link nitobi.fisheye.FishEye} object.
 * @constructor
 * @example
 * var fisheye = nitobi.getComponent("myFisheye");
 * var item = new nitobi.fisheye.MenuItem();
 * item.setImageSource("images/icon.png");
 * item.setLabel("A dynamically added item");
 * fisheye.add(item);
 * fisheye.render();
 * @param {XmlNode} [node] If you want to create a menu item and deserialize it from the node. 
 * @extends nitobi.ui.Element
 */
nitobi.fisheye.MenuItem = function(node)
{
	nitobi.fisheye.MenuItem.baseConstructor.call(this, node);
	/**
	 * @private
	 */
	this.src = this.getAttribute("imagesrc");
	/**
	 * @private
	 */
	this.imgLabel = this.getAttribute("label");
	/**
	 * This event fires whenever the menu item is clicked.
	 * @type nitobi.base.Event
	 */
	this.onClick = new nitobi.base.Event();
	this.eventMap["click"] = this.onClick;
	this.subscribeDeclarationEvents();
	
	this.setAttribute('id', this.getId());
	/**
	 * @private
	 */
	this.bounceIt = 0;
	/**
	 * @private
	 */
	this.mysize = 0;
	/**
	 * @private
	 */
	this.lastsize = 0;
	/**
	 * @private
	 */
	this.xoffset = 0;
	/**
	 * @private
	 */
	this.yoffset = 0;
	/**
	 * @private
	 */
	this.distance = 0;
	/**
	 * @private
	 */
	this.myy = 0;
	/**
	 * @private
	 */
	this.bounceTimer = null;
}

nitobi.lang.extend(nitobi.fisheye.MenuItem, nitobi.ui.Element);

/**
 * Information out the menuitem class.
 * @type nitobi.base.Profile
 * @private
 */
nitobi.fisheye.MenuItem.profile = new nitobi.base.Profile("nitobi.fisheye.MenuItem",null,false,"ntb:menuitem");
nitobi.base.Registry.getInstance().register(nitobi.fisheye.MenuItem.profile);

/**
 * Sets the image source of the menu item.  FishEye requires 32-bit PNG's with transparency. 
 * These can be generated from applications like Adobe Fireworks, and also borrowed from icon packs found on sites like deviantArt. 
 * Always check Copyright restrictions before using people's artwork. There are many sources of free icons (deviantArt is a good one) that 
 * offer royalty-free use.
 * @param {String} source The location of the image file
 */
nitobi.fisheye.MenuItem.prototype.setImageSource = function(source)
{
	this.setAttribute("imagesrc", source);
	this.src = source;
}

/**
 * Sets the label text for the menu item.  The lable is visible when the mouse is hovering
 * over the menu item.
 * @param {String} label The label to apply to the menu item
 */
nitobi.fisheye.MenuItem.prototype.setLabel = function(label)
{
	this.setAttribute("label", label);
	this.imgLabel = label;
}
