/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.fisheye");

if (false)
{
	/**
	 * @namespace The namespace for classes that make up the Nitobi FishEye component.
	 * @constructor
	 */
	nitobi.fisheye = function(){};
}

/**
 * Creates a Nitobi FishEye.  You cannot instantiate this component through script.  You must use the
 * custom declaration tags.
 * @class The base class for the Nitobi Fisheye component.  The component is meant to be instantiated through
 * a declaration.  For example:
 * <pre class="code">
 * &lt;ntb:fisheye id="fisheye1" growpercent="200" opendirection="up" expanddirection="right" iconwidth="50"&gt;
 * 	&lt;ntb:menuitem imagesrc="images/file_new.png" label="New File"&gt;&lt;/ntb:menuitem&gt;
 * 	&lt;ntb:menuitem imagesrc="images/file_edit.png" label="Edit File" onclick="alert('test');"&gt;&lt;/ntb:menuitem&gt;
 * 	&lt;ntb:menuitem imagesrc="images/file_explore.png" label="Search File"&gt;&lt;/ntb:menuitem&gt;
 * 	&lt;ntb:menuitem imagesrc="images/file_export.png" label="Export File"&gt;&lt;/ntb:menuitem&gt;
 * 	&lt;ntb:menuitem imagesrc="images/file_del.png" label="Delete File"&gt;&lt;/ntb:menuitem&gt;
 * &lt;/ntb:fisheye&gt;
 * </pre>
 * @constructor
 * @param {String} [id] The id of the control. If you do not specify an id, one is created for you.
 * @extends nitobi.ui.Container
 */
nitobi.fisheye.FishEye = function(id)
{	
	nitobi.fisheye.FishEye.baseConstructor.call(this, id);
	this.renderer.setTemplate(nitobi.fisheye.renderer);

	/**
	 * @private
	 */
	this.yBoundary = this.getIntAttribute("yboundary");	
	/**
	 * @private
	 */
	this.iconWidth = this.getIntAttribute("iconwidth");
	/**
	 * @private
	 */
	this.growPercent = this.getIntAttribute("growpercent")/100;
	/**
	 * @private
	 */
	this.openDirection = this.getAttribute("opendirection").toUpperCase();
	/**
	 * @private
	 */
	this.expandDirection = this.getAttribute("expanddirection").toUpperCase();
	/**
	 * @private
	 */
	this.theme = this.getAttribute("theme");
	if ((this.theme == null) || (this.theme == ""))
	{
		this.theme = "nitobi"
	}
	
	if (this.yBoundary == 0) {
	  this.yBoundary = this.iconWidth;
	}
	
	// TODO: This mapping is totally unnecessary
	/**
	 * @private
	 */
	this.eD = null;
	if (this.expandDirection == 'RIGHT')
	{
		this.eD = 0;
	}
	if (this.expandDirection == 'LEFT')
	{
		this.eD = 1;
	}
	if (this.expandDirection == 'CENTER')
	{
		this.eD = 2;		
	}
	
	/**
	 * @private
	 */
	this.minWidth = 0;
	/**
	 * @private
	 */
	this.iconArea = this.iconWidth;
	/**
	 * @private
	 */
	this.containerPadding = this.iconArea * 0.06;
	/**
	 * @private
	 */
	this.rangeSensitivity = 2.2;
	/**
	 * @private
	 */
	this.highindex = 0;
	/**
	 * @private
	 */
	this.mouseX = 0;
	/**
	 * @private
	 */
	this.mouseY = 0;
	/**
	 * @private
	 */
	this.labeltext = '';
	/**
	 * @private
	 */
	this.lastBounce = 0;
	/**
	 * @private
	 */
	this.iteratetimer = null;
	/**
	 * @private
	 */
	this.restartIterator = null;
	/**
	 * @private
	 */
	this.timerObj = null;	
	/**
	 * @private
	 */
	this.disableIterator = null;
	/**
	 * @private
	 */
	this.useIterator = true;
	/**
	 * @private
	 */
	this.startedIKillTimer = false;
	
	/**
	 * @private
	 */
	this.renderTimes = 0;
	
	fisheyeList.push(this);
}

nitobi.lang.extend(nitobi.fisheye.FishEye, nitobi.ui.Container);
/**
 * Information about the fisheye class.
 * @type nitobi.base.Profile
 * @private
 */
nitobi.fisheye.FishEye.profile = new nitobi.base.Profile("nitobi.fisheye.FishEye",null,false,"ntb:fisheye");
nitobi.base.Registry.getInstance().register(nitobi.fisheye.FishEye.profile);

/**
 * A static list of all FishEye objects that have been rendered.
 * @private
 */
var fisheyeList = new Array();

/**
 * A static variable used to determines if the mouse handler has already been
 * attached to the page.
 * @private
 */
nitobi.fisheye.FishEye.isMouseAttached = false;

/**
 * Renders the fisheye.  If you add or remove items to the fisheye control,
 * you will need to call this method.
 * @example
 * function add()
 * {
 * 	var fisheye = nitobi.getComponent('fisheye1');
 * 	var item = new nitobi.fisheye.MenuItem();
 * 	item.setLabel("New item");
 * 	item.setImageSource("images/info.png");
 * 	fisheye.add(item);
 * 	fisheye.render();
 * }
 */
nitobi.fisheye.FishEye.prototype.render = function()
{
	if (this.renderTimes == 0)
	{
		nitobi.fisheye.FishEye.base.render.call(this);
		this.renderContainers();
		this.renderItems();
		this.updateMenuPosition();
		this.reDrawItems();
		
		if (nitobi.fisheye.FishEye.isMouseAttached == false)
		{
			nitobi.html.attachEvent(document.body, "mousemove", handleMouse);	
			nitobi.html.attachEvent(window, "resize", nitobi.fisheye.FishEye.handleResize);
			nitobi.fisheye.FishEye.isMouseAttached = true;
			nitobi.fisheye.FishEye.continuousPositionCheck();
		}
		this.renderTimes++;
	}
	else
	{
		while (this.MasterContainer.hasChildNodes())
		{
			var node = this.MasterContainer;
			node.removeChild(node.childNodes[0]);
		}
		// TODO: I don't think minWidth needs to be a member variable.
		this.minWidth = 0;
		this.renderItems();
		this.updateMenuPosition();
		this.reDrawItems();
		
		this.renderTimes++;
	}
	this.labelObj.style.width = "50px";
}

/**
 * A static property that controls how often the fisheye will check for its main DHTML element being moved/resized
 * Any value less than equal 0 will cause the checking of size/position to only occur during a 
 * browser window resize.  Any value greater than 0 will be the interval in ms for how often the check
 * for size/position will occur.
 * @private
 */
nitobi.fisheye.FishEye.performContinuousPositionCheck = 200;

/**
 * Does the work of calling the handleResize static method and itself with a window timer based
 * on the performContinuousPositionCheck value.
 * @private
 */
nitobi.fisheye.FishEye.continuousPositionCheck = function()
{
	if(nitobi.fisheye.FishEye.performContinuousPositionCheck > 0)
		window.setTimeout("nitobi.fisheye.FishEye.handleResize();nitobi.fisheye.FishEye.continuousPositionCheck();", nitobi.fisheye.FishEye.performContinuousPositionCheck);
}

/**
 * @private
 */
nitobi.fisheye.FishEye.prototype.renderContainers = function()
{
	var containerDiv = $ntb(this.getId());
		
	this.labelObj = nitobi.fisheye.FishEye.createLabel(); 
	this.labelObj.setAttribute("id", this.getId() + ".label");
	containerDiv.appendChild(this.labelObj);
	
	this.MasterContainer = nitobi.fisheye.FishEye.createContainer()
	this.MasterContainer.setAttribute("id", this.getId() + ".master");
	containerDiv.appendChild(this.MasterContainer);
	
	this.BGContainer = nitobi.fisheye.FishEye.createBackground(this.theme);
	this.BGContainer.setAttribute("id", this.getId() + ".background");
	containerDiv.appendChild(this.BGContainer);
}

/**
 * @private
 */
nitobi.fisheye.FishEye.prototype.updateMenuPosition = function()
{
	var objCoords = nitobi.html.getCoords(this.getHtmlNode());
	this.MasterContainer.style.top = (objCoords.y + this.containerPadding) + 'px'; 
	this.MasterContainer.style.left = (objCoords.x + this.containerPadding) + 'px';
	this.x = (objCoords.x + this.containerPadding); 
	this.y = (objCoords.y + this.containerPadding);
}

/**
 * Positions the label on an item.
 * @private
 */
nitobi.fisheye.FishEye.prototype.positionLabel = function(labelText, x, y)
{
	if (labelText != null) 
	{
		if (this.labeltext != labelText) 
		{
			this.labelObj.style.width = '';
			this.labelObj.innerHTML = labelText; 
			this.labeltext = labelText;
			if (nitobi.browser.OPERA) 
			{
				this.labelObj.style.width = '75px';
			} 
			else 
			{
				this.labelObj.style.width = this.labelObj.offsetWidth + "px";
			}
		}
		this.labelObj.style.visibility = 'visible';
		this.labelObj.style.left = (x - this.labelObj.offsetWidth/2) + 'px';
		this.labelObj.style.top = y + 'px';
	} 
	else
	{
		this.labelObj.style.visibility = 'hidden';
	}
}

/**
 * Handles the bounce action.
 * @private
 */
nitobi.fisheye.FishEye.prototype.handleBounce = function(menuItem)
{
	// TODO: Move into nitobi.fisheye.FishEye.MenuItem
	var item = this.get(menuItem);
	var ffs = this;
	item.bounceIt += 0.045;
	if (item.bounceIt > 1.0)
		item.bounceIt -= 1.0;
	
	item.yoffset = Math.sin(item.bounceIt*3.1415926)*(this.growPercent*this.iconWidth*0.13);
	this.iteratetimer = setTimeout(function(){ffs.reDrawItems()}, 30);
	item.bounceTimer = setTimeout(function(){ffs.handleBounce(menuItem)}, 30);
}

/**
 * Causes a menu item to visually bounce, indicating that it has been activated. This will self terminate after a few seconds.
 * @param {Number} menuItem The ordinal item number of the object you want to bounce. Begins at 0.
 * @param {Number} bounceTime How long you would like the bounce to happen for. In miliseconds (1000 = 1 second).
 */
nitobi.fisheye.FishEye.prototype.bounceItem = function(menuItem, bounceTime)
{
	var ffd = this;
	var lastItem = this.get(this.lastBounce);
	var item = this.get(menuItem);
	lastItem.bounceIt = 0;
	lastItem.yoffset = 0;
	clearTimeout(lastItem.bounceTimer);
	item.bounceIt = 0;
	this.lastBounce = menuItem;
	clearTimeout(item.bounceTimer);
	clearTimeout(this.bounceKiller);
	clearTimeout(this.iteratetimer);	
	this.bounceKiller = setTimeout(function(){clearTimeout(item.bounceTimer); ffd.get(menuItem).yoffset = 0;}, bounceTime);
	this.handleBounce(menuItem);
}

/**
 * Positions the menu items and determines the size of the background and container divs
 * @private
 */
nitobi.fisheye.FishEye.prototype.renderItems = function()
{
	var passOK = true;
	var obj = this;
	var t;
	/*for (t = 0; t < this.menuItems.length; t++)
		if (!this.menuItems[t].complete)
			passOK = false;
		
	if (!passOK)  {
		setTimeout(function(){obj.render()}, 100); 
	} else {
	*/
		this.loaded = true;
		//this.timerObj = setTimeout(nitobi.fishEyeUpdatePositions,300);
		for (t = 0; t < this.getLength(); t++)
		{
			// TODO: Refactor this block into a method
			//myHeight = this.iconWidth*(this.menuItems[t].width/this.menuItems[t].height);
			var item = this.get(t);
			var myWidth = this.iconWidth;
			var myHeight = this.iconWidth;
			var mo;
			if (nitobi.browser.IE6)
			{
				mo = document.createElement('div');			
				mo.style.height = myHeight;
				mo.style.width = myWidth;
				mo.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.get(t).src + "', sizingMethod='scale'); ";	
			} else {
				mo = document.createElement('img');
				mo.src = this.get(t).src;
				mo.style.height = myHeight + "px";
				mo.style.width = myWidth + "px";
			}					
			mo.style.position = 'absolute';
			mo.style.cursor = 'pointer';
			mo.style.visibility = 'visible';
			mo.style.top = '0px';
			mo.style.left = this.minWidth + 'px';
			item.img = mo;		
			item.myx = this.minWidth;
			item.startWidth = myWidth;
			item.startHeight = myHeight;
			item.currentWidth = myWidth;
			item.currentHeight = myHeight;
			item.img.onclick = function(){
				obj.bounceItem(obj.highindex,5000);  
				obj.get(obj.highindex).onClick.notify();
			};
			
			// TODO: Menu height should be a declaration attribute?
			/*
			if (myHeight > this.minHeight)
				this.minHeight = myHeight;

			if (myHeight > this.iconHeight)
				this.iconHeight = myHeight;
				*/
			this.minWidth += this.iconArea;	
			this.iconHeight = myHeight;
			this.MasterContainer.style.width = this.minWidth + 'px';		
			this.MasterContainer.appendChild(mo);				
		}
		this.setStyle("width", this.minWidth + this.containerPadding * 2 + "px");
		this.setStyle("height", myHeight + this.containerPadding * 2 + "px");
		this.MasterContainer.style.visibility = 'visible';
		this.MasterContainer.style.height = this.iconWidth + 'px';	
		this.BGContainer.style.visibility = 'visible';
		obj.labelObj.style.display = 'none';
		setTimeout(function() {obj.labelObj.style.visibility = 'hidden'; obj.labelObj.style.display = 'block';}, 700);
}

/**
 * Redraws the menu and resizes the menu items and background as necessary
 * @private
 */
nitobi.fisheye.FishEye.prototype.reDrawItems = function()
{
	var f;
	var ol = this.getLength();
	var w,h;
	var ms, rs, nw, nh, cx, cy, mo;
	var doagain = false;
	var fds = this;
	var xoffset,yoffset, totalxoffset;
	clearTimeout(this.iteratetimer);
	var percentExpanded = 0;
	var lof = 0;

	if ((this.useIterator) && (!this.startedIKillTimer) && (this.foundActive)) 
	{
		this.startedIKillTimer = true;
		clearTimeout(this.disableIterator);
		this.disableIterator = setTimeout(function(){fds.useIterator = false; }, 400);
	}
	clearTimeout(this.restartIterator);
	
	xoffset = 0;
	totalxoffset = 0;

	for (f = 0; f < ol; f++)
	{
		mo = this.get(f);
		ms = mo.mysize;
		if (ms > 0.01)
		{
			if ((ms > mo.lastsize) && (this.useIterator))
			{
				rs = mo.lastsize + ((ms - mo.lastsize)/4.5);
				mo.lastsize = rs;
			} 
			else 
			{
				mo.lastsize = ms;
				rs = ms;
			}
			percentExpanded = rs/ms;
		} 
		else 
		{
			ms = 0;
			if (this.useIterator)  
			{
				rs = mo.lastsize + ((ms - mo.lastsize)/4.5);
			} 
			else 
			{
				rs = ms;
			}
			//rs = 0;
			mo.lastsize = rs;
		}
		w = mo.startWidth;
		h = mo.startHeight;
		nw = w * (((this.growPercent - 1) * rs) + 1);
		nh = h * (((this.growPercent - 1) * rs) + 1);
		mo.currentWidth = nw;
		mo.currentHeight = nh;
		mo.xoffset = (nw - w);
		totalxoffset += (nw - w);

		if (rs > 0.01)
		{
			doagain = true;
		}
	}
	if (this.highindex == -1)
	{
		this.labelObj.style.visibility = 'hidden';
	}
	
	if ((this.eD == 2) || (this.eD == 0)) { 
	lof = (this.iconWidth/2);
	} else {
	lof = 0-(this.iconWidth/2);
	}
	
	if ((this.eD == 2) && (this.highindex > -1))
	{
		for (f = 0; f < ol; f++)
		{
			mo = this.get(f);
			ms = mo.mysize;
			nw = mo.currentWidth;
			nh = mo.currentHeight;
			mo.img.style.width = nw + "px";
			mo.img.style.height = nh + "px";
			xoffset = (1 - mo.mysize) * (totalxoffset/2) * (1 + (this.growPercent/11));			
				
			if ((this.mouseX - this.x) >= (mo.myx + (mo.startWidth/2))) 
			{
				cx = (mo.startWidth) + (mo.myx - ((nw)/2) - xoffset);
				mo.img.style.left = cx + 'px';
			}
			if ((this.mouseX - this.x) < (mo.myx + (mo.startWidth/2))) 
			{
				cx = xoffset + (mo.startWidth) + (mo.myx - ((nw)/2));
				mo.img.style.left = cx + 'px';
			}
				
			if (this.openDirection == 'UP') 
			{
				cy = -(mo.currentHeight - mo.startHeight + mo.yoffset);
				cy -= ms * (this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex)
				{ 
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2) - lof,this.y + cy - 23);				
				}
			} 
			else 
			{
				cy = mo.yoffset;
				cy += ms*(this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex) 
				{
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2) - lof,this.y + nh + cy);
				}
			}
		}	
	}
	
	if ((this.eD == 0) || ((this.eD == 2) && (this.highindex == -1)))
	{
		for (f = 0; f < ol; f++)
		{
			mo = this.get(f);
			ms = mo.mysize;
			nw = mo.currentWidth;
			nh = mo.currentHeight;
			mo.img.style.width = nw + "px"
			mo.img.style.height = nh + "px";
			if (f > 0)
			{ 
				xoffset += (this.get(f-1).xoffset/2) * (1 + (this.growPercent/2.5));
			}
			cx = xoffset + (mo.startWidth/2) + (mo.myx - ((nw)/2)) + (nw/2);
			mo.img.style.left = cx +'px';
	
			if (this.openDirection == 'UP') 
			{
				cy = -(mo.currentHeight-mo.startHeight+mo.yoffset);
				cy -= ms * (this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex)
				{ 
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2) - lof, this.y + cy - 23);				
				}
			} 
			else 
			{
				cy = mo.yoffset;
				cy += ms * (this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex) 
				{	
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2) - lof, this.y + nh + cy);
				}
			}
		}
	}



	if (this.eD == 1)
	{
		for (f = ol-1; f >= 0; f--)
		{
			mo = this.get(f);
			ms = mo.mysize;
			nw = mo.currentWidth;
			nh = mo.currentHeight;
			mo.img.style.width = nw + "px";
			mo.img.style.height = nh + "px";
			if (f < (ol-1))
			{ 
				xoffset += (this.get(f+1).xoffset/2) * (1 + (this.growPercent/2.5));
			}	
			cx = (mo.startWidth/2) + (mo.myx - ((nw)/2) - xoffset) - nw/2;
			mo.img.style.left = cx + 'px';
			
			if (this.openDirection == 'UP') 
			{
				cy = -(mo.currentHeight - mo.startHeight + mo.yoffset);
				cy -= ms * (this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex) 
				{
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2),this.y + cy - 23);				
				}
			} 
			else 
			{
				cy = mo.yoffset;
				cy += ms * (this.iconArea/3);
				mo.img.style.top = cy + 'px';
				if (f == this.highindex) 
				{
					this.positionLabel(mo.imgLabel, this.x + cx + (nw/2)-lof, this.y + nh + cy);
				}
			}			
		}
	}
	
	var mox = 0;
	
	for (f = 0; f < ol; f++)
	{
		mo = this.get(f);
		mox = mo.img.style.left.replace('px','');
		mo.img.style.left = (parseFloat(mox)-lof) + 'px';
	}	
	this.currentxoffset = xoffset;

	var ls = parseInt(this.MasterContainer.style.left.replace('px', '')) + parseInt(this.get(0).img.style.left.replace('px', ''));
	this.BGContainer.style.left = (ls - this.containerPadding) + 'px';
	this.BGContainer.style.top = (parseInt(this.MasterContainer.style.top.replace('px', ''))-this.containerPadding) + 'px';
	this.BGContainer.style.height = (parseInt(this.MasterContainer.offsetHeight)+this.containerPadding+this.containerPadding) + "px";
	this.BGContainer.style.width = (parseInt(this.get(this.getLength()-1).img.style.left.replace('px', '')) + (parseInt(this.get(this.getLength()-1).img.style.width.replace('px', ''))) - parseInt(this.get(0).img.style.left.replace('px', '')) + this.containerPadding + this.containerPadding) + "px";

	if ((doagain) && ((this.useIterator) || (!this.foundActive))) 
	{
		this.iteratetimer = setTimeout(function(){fds.reDrawItems()}, 40);
	} 
	else 
	{
		this.startedIKillTimer = false;
		clearTimeout(this.disableIterator);
		this.restartIterator = setTimeout(function(){clearTimeout(fds.disableIterator); fds.startedIKillTimer = false; fds.useIterator = true;}, 420);
	}
}

/**
 * @private
 */
nitobi.fisheye.FishEye.createContainer = function()
{
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.visibility = 'hidden';
	container.style.zIndex = '999990';
	
	return container;
}

/**
 * @private
 */
nitobi.fisheye.FishEye.createBackground = function()
{
	var background = document.createElement('div');
	background.className = "ntb-fisheye-menubackground";
	background.style.zIndex = '99999';
	background.style.filter = 'alpha(opacity=' + (0.65*100) + ')';	
	background.style.position = 'absolute';
	background.style.visibility = 'hidden';
	background.style.width = '100px'; background.style.height = '100px';
	background.style.top = '100px'; background.style.top = '100px';
	
	return background;
}

/**
 * @private
 */
nitobi.fisheye.FishEye.createLabel = function(theme)
{
	var label = document.createElement('div');
	label.className = "ntb-fisheye-label";

	label.style.position = 'absolute';
	label.style.visibility = 'visible';

	label.style.height = '1px';	
	label.style.top = '1px'; 
	label.style.left = '1px';	
	label.innerHTML = 'blank';
	label.style.whiteSpace = 'nowrap';
	label.style.visibility = 'hidden';
	label.style.width = '50px';
	label.style.height = '15px';
	label.style.filter = 'alpha(opacity=' + (0.85*100) + ')';	
	
	return label;
}

/**
 * Handles window resize events
 * @private
 */
nitobi.fisheye.FishEye.handleResize = function() {
	for (t = 0; t < fisheyeList.length; t++) {
		var f = fisheyeList[t];
		var objCoords = nitobi.html.getCoords(f.getHtmlNode());
		if(f.lastCoords == null || f.lastCoords.x != objCoords.x || f.lastCoords.y != objCoords.y)
		{
			f.lastCoords = objCoords;
			f.updateMenuPosition();
			f.reDrawItems();
		}
	}
}

/**
 * Handles the mousemove event.
 * @private
 */
function handleMouse(event)
{

	var sP = nitobi.html.getScroll();
	var doRedraw = false;
	var mouseX, mouseY;
	var cancelZoom = false;
	var highZoom = 0;
	/*if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) { // grab the x-y pos.s if browser is IE
	mouseX = event.clientX + sP.scrollLeft;
	mouseY = event.clientY + sP.scrollTop;
	} else { */
	//mouseX =event.clientX
	//mouseY =event.clientY;
	mouseX = event.clientX + sP.left ;
	mouseY = event.clientY + sP.top;	
	//} 

	//*** USE NITOBI EVENT STUFF HERE.

	var t,f,w,h,x,y,o,ol,p,q,dist,calcval;
	// For each fisheye menu
	var listLength = fisheyeList.length;
	for (t = 0; t < listLength; t++) 
	{
		// get the fisheye object
		o = fisheyeList[t];
		if (o.loaded) 
		{

			w = o.iconWidth;
			h = o.iconHeight;
			// ol is how many icons in this particular fisheye menu
			ol = o.getLength();
			o.highval = 0;
			o.highindex = -1;
			o.foundActive = false;
			cancelZoom = false;
			highZoom = 0;
			for (f = 0; f < ol; f++) 
			{
				var item = o.get(f);
				if (item.mysize > 0.01)
				{	
					doRedraw = true;
				}
				x = o.x + item.myx + (w/2);
				y = o.y + item.myy + (h/2);	
				
				if (o.eD == 2)	
				{		
					p = Math.abs(x - mouseX);	
				}		
				if (o.eD == 0)			
				{
					p = Math.abs(x - mouseX + o.iconWidth/2 + (o.currentxoffset * (f/ol)));
				}
				if (o.eD == 1)			
				{
					p = Math.abs(x - mouseX - (o.iconWidth/2) - (o.currentxoffset * ((ol - f)/ol)));			
				}
				//p = Math.abs((x)-mouseX);
				q = Math.abs(y - mouseY);
				//dist = Math.sqrt((p*p)+(q*q));
				//dist = Math.sqrt((p*p));	
				dist = p;
				if (q > o.yBoundary) {
					q = 1000;
				}
				//console.log(dist);
				if ((p < (w * o.rangeSensitivity)) && (q < (h * 1.5)))
				{
					doRedraw = true;
					o.mouseX = mouseX;
					o.mouseY = mouseY;
					o.foundActive = true;

					calcval = 1 - (dist/(w * o.rangeSensitivity));
					//o.menuObjects[f].distance = 0;
					//o.menuObjects[f].mysize = calcval;
					item.mysize = calcval;
					if (o.highval < calcval)
					{
						o.highval = calcval;
						o.highindex = f;
						highZoom = q;
					}
				} 
				else 
				{
					item.mysize = 0;
				}
			}	
		
			if (highZoom > (o.iconWidth * 0.8)) 
			{
				o.foundActive = false;
				doRedraw = false;
				cancelZoom = true; 
				for (f = 0; f < ol; f++) 
				{
					o.foundActive = false;
					doRedraw = true;	
					o.highval = 0;
					// The following lines were commented out by Mike because
					// I wasn't sure why these assignments were necessary
					// Their inclusion caused the fisheye to not work properly
					//o.highindex = -1;					
					//item.mysize = 0;
				}
			}
		
			if (!o.foundActive)
			{
				o.useIterator = true;
			}
			if ((doRedraw) || (o.highindex > -1))
			{
				o.reDrawItems();
			}
		}		
	}
}
