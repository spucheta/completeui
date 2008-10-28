/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.callout");

if (false)
{
	/**
	 * @namespace <code>nitobi.callout</code> is the namespace for classes that make up 
	 * the Nitobi Callout component.
	 * @constructor
	 */
	nitobi.callout = function(){};
}
/**
 * @private
 */
nitobi.callout.lastStyle = '';
/**
 * Creates a new nitobi.callout.Callout.
 * @class The nitobi.callout.Callout class is used to create a visual indicator on your page much like a tooltip.
 * @example
 * var myCallout = new nitobi.callout.Callout("vista");
 * myCallout.setCalloutDirection(3);
 * myCallout.moveTo(100, 200);
 * myCallout.setTitle('This is a test title');
 * myCallout.setBody('This is the test contents');
 * myCallout.show();
 * @constructor
 * @see #setCalloutDirection
 * @see #moveTo
 * @see #setTitle
 * @see #setBody
 * @see show
 * @param {String} theme Which theme to use for this callout. Eg: "xp", "impact", "vista".
 */
nitobi.callout.Callout = function(stylesheet,title,body)
{
	/**
	 * @private
	 */	
	this.uid = Math.random().toString().replace('.', '').replace('0', '');
	nitobi.callout.Callout.refs[nitobi.callout.Callout.refs.length] = this;
	this.attributesTimer = null;
	/**
	 * The current version number.
	 * @private
	 * @return string
	 */	
	this.ver = '1.11';
	/**
	 * @private
	 */		
	this.titlehtml = '';
	/**
	 * @private
	 */		
	this.stylesheet = 'xp'; // the default stylesheet
	
	/**
	 * @private
	 */
	this.allowOffScreen = true; // is it OK to put it at coords less than 0,0
	
	if (stylesheet != null) 
	{
		/**
		 * @private
		 */		
		this.stylesheet = stylesheet.toLowerCase();
	}

	/**
	 * @private
	 */	
	this.Is = function() 
	{ 
		/**
		 * @private
		 */		
		this.opera = false;
		agent = navigator.userAgent.toLowerCase(); 	
		/**
		 * @private
		 */			
		this.major = parseInt(navigator.appVersion);
		/**
		 * @private
		 */			
		this.minor = parseFloat(navigator.appVersion);	
		/**
		 * @private
		 */			
		this.firefox = false;
		if (navigator.userAgent.indexOf("Firefox")!=-1) 
		{ 
			this.firefox = true; 
		}	
		
		/**
		 * @private
		 */			
		this.ns = ((agent.indexOf('mozilla') != -1) && (agent.indexOf('spoofer') == -1) && (agent.indexOf('compatible') == -1) && (agent.indexOf('opera') == -1) &&	(agent.indexOf('webtv') == -1) && (agent.indexOf('hotjava') == -1));

		/**
		 * @private
		 */			
		this.ns2 = (this.ns && (this.major == 2));	
		/**
		 * @private
		 */		
		this.ns3 = (this.ns && (this.major == 3));	
		/**
		 * @private
		 */
		this.ns4 = (this.ns && (this.major == 4));	
		/**
		 * @private
		 */
		this.ns6 = (this.ns && (this.major >= 5));	
		/**
		 * @private
		 */
		this.ie = ((agent.indexOf("msie") != -1) &&	(agent.indexOf("opera") == -1));	
		/**
		 * @private
		 */
		this.ie3 = (this.ie && (this.major < 4));	
		/**
		 * @private
		 */
		this.ie4 = (this.ie && (this.major == 4) &&	(agent.indexOf("msie 4") != -1));	
		/**
		 * @private
		 */
		this.ie5 = (this.ie && (this.major == 4) &&	(agent.indexOf("msie 5.") != -1) &&	(agent.indexOf("msie 5.5") == -1) && (agent.indexOf("mac") == -1)); 
		/**
		 * @private
		 */
		this.ie6 = (this.ie && (this.major == 4) &&	(agent.indexOf("msie 6.") != -1));	
		/**
		 * @private
		 */
		this.ie7 = (this.ie && (this.major == 4) &&	(agent.indexOf("msie 7.0") != -1));
		if (agent.indexOf("opera") == 0) 
		{
			this.opera = true;
		}
	}
	var agent = navigator.userAgent.toLowerCase(); 	
	if (agent.indexOf("opera") == 0) 
	{

		/**
		 * @private
		 */	
		this.opera = true;
	}
	if(agent.indexOf("Firefox")!=-1)
	{ 
		/**
		 * @private
		 */	
		this.firefox = true; 
	}
	if (agent.indexOf("msie") == 0) 
	{
		/**
		 * @private
		 */	
		this.ie = true;
	}	
	
	/**
	 * @private
	 */
	this.HaltAttributes = false;

	/**
	 * @private
	 */
	this.ContainerNames = Array();
	/**
	 * @private
	 */	
	this.Containers = Array();

	/**
	 * @private
	 */	
	this.MasterContainer = document.createElement('div');
	this.MasterContainer.innerHTML = '';
	this.MasterContainer.setAttribute('id', 'ntbCalloutMasterContainer' + this.uid);
	this.MasterContainer.object = this;
	this.MasterContainer.style.position = "absolute";
	this.MasterContainer.style.top = "0px";
	this.MasterContainer.style.left = "0px";

	/**
	 * @private
	 */
	this.timerObject = null;

	/**
	 * @private
	 */
	this.expireObj = null;

	/**
	 * @private
	 */
	this.object = this;


	/**
	 * @private
	 */
	this.absWidth = 0;
	/**
	 * @private
	 */
	this.absHeight = 0;
	/**
	 * @private
	 */
	this.zSpot = (nitobi.callout.Callout.refs.length*10) + 1000000;
	/**
	 * @private
	 */
	this.ondestroy = null;
	/**
	 * @private
	 */
	this.onappear = null;	
	/**
	 * @private
	 */
	this.onScreenUpdate = null;
	/**
	 * @private
	 */
	this.timeOut = -1;

	
	/**
	 * @private
	 */
	this.x = 0;
	/**
	 * @private
	 */
	this.y = 0;
	/**
	 * @private
	 */
	this.ax = 0;
	/**
	 * @private
	 */
	this.ay = 0;
	/**
	 * @private
	 */
	this.width = 0;
	/**
	 * @private
	 */
	this.height = 0;


	/**
	 * @private
	 */	
	this.MasterContainer.style.visibility = 'hidden';
	this.MasterContainer.style.zIndex = this.zSpot.toString();
	
	document.getElementsByTagName('body').item(0).appendChild(this.MasterContainer);
	
	for (var t = 0; t < 6; t++)
	{
		this.ContainerNames[t] = 'ntbCalloutContainer' + t + '_' + this.uid;
		this.Containers[t] = document.createElement('div');
		this.Containers[t].innerHTML = '';
		this.Containers[t].setAttribute('id', this.ContainerNames[t]);
		this.Containers[t].object = this;
		this.MasterContainer.appendChild(this.Containers[t]);
		//this.Containers[t].style.display = 'none';
		this.Containers[t].style.position = "absolute";
		this.Containers[t].style.top = "0px";
		this.Containers[t].style.left = "0px";
		this.Containers[t].style.zIndex = this.zSpot.toString();
	}

	
	/**
	 * @private
	 */
	this.TitleElement = 'ntbCalloutTitle_' + this.uid;
	this.TitleElement = document.createElement('div');
	this.TitleElement.innerHTML = '';
	this.TitleElement.setAttribute('id', 'title' + this.uid);
	this.TitleElement.object = this;
	this.MasterContainer.appendChild(this.TitleElement);
	this.TitleElement.style.position = "absolute";
	this.TitleElement.style.zIndex = (this.zSpot+1).toString();
	this.TitleElement.style.visibility = 'visible';	
	this.TitleElement.style.display = 'block';
	//this.TitleElement.style.visibility = 'hidden';
	
	
	/**
	 * @private
	 */
	this.CloseElement = 'ntbCalloutClose_' + this.uid;
	this.CloseElement = document.createElement('div');
	this.CloseElement.innerHTML = '';
	this.CloseElement.setAttribute('id', 'close' + this.uid);
	this.CloseElement.object = this;
	this.MasterContainer.appendChild(this.CloseElement);
	this.CloseElement.style.position = "absolute";
	this.CloseElement.style.zIndex = (this.zSpot+5).toString();
	this.CloseElement.style.visibility = 'visible';	
	this.CloseElement.style.display = 'block';
	this.CloseElement.className = 'ntb' + this.stylesheet + 'Callout_close_off';
	this.CloseElement.onmouseover = function() 
	{ 
		try 
		{ 
			var mystyle = this.className.replace('_off', '_on'); 
			this.className = mystyle;
		} 
		catch(e)
		{
		}
	}
	this.CloseElement.onmouseout = function() 
	{
		try 
		{
			var mystyle = this.className.replace('_on', '_off'); 
			this.className = mystyle;
		}
		catch(e)
		{
		}
	}
	this.CloseElement.onmousedown = function() 
	{
		try 
		{
			var mystyle = this.className.replace('_on', '_off'); 
			this.className = mystyle;
		} 
		catch(e)
		{
		}
	}

	var thisObj = this;
	this.CloseElement.onmouseup = function() 
	{
		try 
		{
			var mystyle = this.className.replace('_off', '_on'); 
			this.className = mystyle;
		} 
		catch(e)
		{
		} 
		thisObj.destroy(); 
		return false;
	}
	this.CloseElement.onclick = function() 
	{
		return false
	};


	/**
	 * @private
	 */	
	this.BodyElement = 'ntbCalloutBody_' + this.uid;
	this.BodyElement = document.createElement('div');
	this.BodyElement.innerHTML = '';
	this.BodyElement.setAttribute('id', 'body' + this.uid);
	this.BodyElement.object = this;
	this.MasterContainer.appendChild(this.BodyElement);
	this.BodyElement.style.position = "absolute";
	this.BodyElement.style.zIndex = (this.zSpot+4).toString();
	this.BodyElement.style.visibility = 'visible';	
	this.BodyElement.style.display = 'block';	

	/**
	 * @private
	 */
	nitobi.callout.lastStyle = this.stylesheet;
	/**
	 * @private
	 */
	this.StyleSheetUrl = nitobi.callout.Callout.getStyleSheetUrl();
	this.setMode('INACTIVE');

	
	// There are 8 directions for each callout style

	/**
	 * @private
	 */	
	this.CalloutMinWidth = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_minimums', 'width');

	/**
	 * @private
	 */	
	this.CalloutMinHeight = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_minimums', 'height');


	/**
	 * @private
	 */
	this.CalloutContentWidth = 200;

	/**
	 * @private
	 */	
	this.CalloutContentHeight = 0;
	
	if (this.CalloutContentWidth < this.CalloutMinWidth)
	{
		this.CalloutContentWidth = this.CalloutMinWidth;
	}
	if (this.CalloutContentHeight < this.CalloutMinHeight)
	{
		this.CalloutContentHeight = this.CalloutMinHeight;
	}	

	/**
	 * @private
	 */	
	this.CalloutDirection = 0;
	this.setCalloutDirection(1);
	
	if (nitobi.callout.Callout.refs.length == 1)
	{
		if (window.addEventListener) 
		{ // Non-IE browsers
		window.addEventListener("scroll", nitobi.callout.Callout.update, false);		
		window.addEventListener("resize", nitobi.callout.Callout.update, false);			
		} 
		else if (window.attachEvent) 
		{ // IE 6+
		window.attachEvent('onscroll', nitobi.callout.Callout.update);
		window.attachEvent('onresize', nitobi.callout.Callout.update);	
		} 
	}
	
	this.setTitle('');	

	/**
	 * @private
	 */	
	this.bodyHTML = '';

	/**
	 * @private
	 */	
	this.useBody = false;
	this.setBody('');

	if(title != null)
	this.setTitle(title);
	if(body != null)
		this.setBody(body);
	

	/**
	 * @private
	 */
	this.effectName = 'APPEAR';

	/**
	 * @private
	 */
	this.opacity = 1.0;
	this.setEffect('FADE');
	this.setOpacity(0);
}


/**
 * @private
 */
nitobi.callout.Callout.styleArray = Array();
/**
 * @private
 */
nitobi.callout.Callout.ruleArray = Array();
/**
 * @private
 */
nitobi.callout.Callout.globalStylesheet;
/**
 * @private
 */
nitobi.callout.Callout.precachedImages = Array();

/**
 * @private
 */
nitobi.callout.Callout.refs = Array();

/**
 * @private
 */
nitobi.callout.Callout.permHeight = 0;

/**
 * @private
 */
nitobi.callout.Callout.permWidth = 0;

// Ok the purpose of the following line is to help with all the PNG stuff. if this changes in the implementation then change this line.
// You can also just write 'nitobi' and it will do a keyword search on the css sheets.
/**
 * @private
 */
nitobi.callout.Callout.globalStyleSheetName = 'nitobi.attention.css';

/**
 * @private
 */
nitobi.callout.Callout.rewriteId = function(myobjid)
{
	try 
	{
		document.getElementById(myobjid).id = myobjid; // for IE
	} 
	catch(e) 
	{
		try {
		for(var i=0; i<document.forms.length; i++)
		{
			for(var b=0; b<document.forms[i].elements.length; b++)
			{
				if (document.forms[i].elements[b].name.toUpperCase() == myobjid.toUpperCase()) 
				{
					document.forms[i].elements[b].id = myobjid;
				}
			}
		} 
		} catch(e) {}
	}
}

/**
 * Force all the callouts to render at the correct position. Worth calling if it is attached
 * to an element and that element has moved.
 */
nitobi.callout.Callout.update = function()
{
	var t,o;
	for (t = 0; t < nitobi.callout.Callout.refs.length; t++) {
		o = nitobi.callout.Callout.refs[t];
		clearTimeout(o.timerObject);
		o.timerObject = setTimeout("nitobi.callout.Callout.refs[" + t + "].updateCallout()",150);
	}
}

/**
 * Removes all the callouts on the screen.
 */
nitobi.callout.destroyAll = function()
{
	var t,o;
	for (t = 0; t < nitobi.callout.Callout.refs.length; t++) {
		o = nitobi.callout.Callout.refs[t];
		o.destroy();
	}
}

/**
 * Removes just the last callout on the screen.
 */
nitobi.callout.destroyLast = function()
{
	var t,o;
	for (t = 0; t < nitobi.callout.Callout.refs.length; t++) {
		o = nitobi.callout.Callout.refs[t];
	}
	try {
		o.destroy();
	} catch(e) {}
}



/**
 * @private
 */
nitobi.callout.Callout.prototype.setOnScreenUpdate = function(onScreenUpdateCode) 
{
	this.onScreenUpdate = onScreenUpdateCode;
}


/**
 * Lets you attach some JavaScript to the the onDestroy event.
 * @param {String} onDestroyCode Some JavaScript to execute when a callout is destroyed.
 */
nitobi.callout.Callout.prototype.setOnDestroy = function(onDestroyCode) 
{
	this.ondestroy = onDestroyCode;
}

/**
 * Lets you attach some JavaScript to the the onAppear event.
 * @param {String} onAppearCode Some JavaScript to execute when a callout appears.
 */
nitobi.callout.Callout.prototype.setOnAppear = function(onAppearCode) 
{
	this.onappear = onAppearCode;
}

/**
 * Will cause a callout to disappear after so many miliseconds.  
 * @param {Number} timeout Number of miliseconds to wait before disappearing. 1000 miliseconds = 1 second.
 */
nitobi.callout.Callout.prototype.setExpire = function(timout) 
{
	this.timeOut = timout;
	var ds = this;
	this.expireObj = setTimeout(function(){ds.destroy()}, timout);
}

/**
 * Sets the width and height of the callout content.
 * @param {Number} newWidth The width in pixels.
 * @param {Number} newHeight The height in pixels.
 */
nitobi.callout.Callout.prototype.setSize = function(newWidth, newHeight) 
{
	this.absWidth = newWidth;
	this.absHeight = newHeight;
	this.setTitle(this.titlehtml);
}

/**
 * Get the current rendered position of the callout. Returns x,y.
 * @example
 * var posX = myCalloutObj.getPosition().x;
 * @type Map
 */
nitobi.callout.Callout.prototype.getPosition = function() 
{
	return {x:this.ax,y:this.ay}	
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.setEffect = function(EffectName) 
{
	this.effectName = 'FADE';
}

/**
 * Sets the Title text of the callout. If only the title text is set, then the callout will size to fit just the title.
 * @param {String} TitleHTML The text for the title.
 */
nitobi.callout.Callout.prototype.setTitle = function(TitleHTML) 
{
	this.titlehtml = TitleHTML;
	if (TitleHTML.length > 0) 
	{ 
		this.useTitle = true; 
	} 
	else 
	{ 
		this.useTitle = false; 
	}	
	if (this.useTitle) 
	{
		try 
		{
			this.TitleElement.style.visibility = 'visible';
			this.TitleElement.className = 'ntb' + this.stylesheet + 'Callout_titlediv' + this.CalloutDirection;
			this.TitleElement.innerHTML = this.titlehtml;
			if (this.CalloutContentWidth < this.TitleElement.offsetWidth+30)
			{ 
				this.CalloutContentWidth = this.TitleElement.offsetWidth+30; 
			}
			this.setBody(this.bodyHTML);
		} 
		catch(e) 
		{
		}	
	} 
	else 
	{
		this.TitleElement.style.visibility = 'visible';
		this.TitleElement.innerHTML = '&nbsp;';
	}
	//this.TitleElement.style.zIndex = '1000090';
	if (!this.HaltAttributes) {this.assignAttributes();}
}

/**
 * Sets the Body text of the callout. If only the body text is set, then the callout will size to fit just the body.
 * @param {String} BodyHTML The text for the body.
 */
nitobi.callout.Callout.prototype.setBody = function(BodyHTML) 
{
	try 
	{
		this.bodyHTML = BodyHTML;
		var BodyNoHTML = BodyHTML.replace(/(<([^>]+)>)/ig,"");
		var BodyNoHTMLLength = BodyNoHTML.length;
		if (BodyHTML.length > 0) 
		{ 
			this.useBody = true; 
		} 
		else 
		{ 
			this.useBody = false; 
		}	
		if (this.useBody) 
		{
			this.BodyElement.style.visibility = 'visible';
			if (this.CalloutContentWidth < ((BodyNoHTMLLength/12)*nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_extender', 'width'))) 
			{
				this.CalloutContentWidth = (BodyNoHTMLLength/12)*nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_extender', 'width');
			}
			this.BodyElement.style.width = this.CalloutContentWidth + 'px';
			this.BodyElement.className = 'ntb' + this.stylesheet + 'Callout_bodydiv' + this.CalloutDirection;
			this.BodyElement.innerHTML = BodyHTML;
			if (this.useTitle == false) 
			{
				this.BodyElement.style.top = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top') + 'px';
				this.BodyElement.style.left = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'left') + 'px';
				this.BodyElement.style.marginTop = '';
				

				/*if (this.CalloutContentHeight < this.BodyElement.offsetHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top'))
				{ this.CalloutContentHeight = this.BodyElement.offsetHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top'); }*/
				this.CalloutContentHeight = this.BodyElement.offsetHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top');
				this.CalloutContentHeight -= parseInt(this.TitleElement.offsetHeight);

			} 
			else 
			{
				this.BodyElement.style.top = '';
				this.BodyElement.style.left = '';	
				var extraOffset = 	parseInt(nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_titleOffset', 'top'));		
				if (isNaN(extraOffset)) {extraOffset = 0;}
				
				/*if (this.CalloutContentHeight < this.BodyElement.offsetHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top'))
				{ this.CalloutContentHeight = this.BodyElement.offsetHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top'); }*/
				this.CalloutContentHeight = this.BodyElement.offsetHeight+parseInt(nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top')) + extraOffset;
				
			}
		} 
		else 
		{
			this.BodyElement.style.visibility = 'hidden';
		}
		
		//this.CalloutContentWidth = this.BodyElement.offsetWidth+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'left');
		if ((this.absWidth > 0) || (this.absHeight > 0)) 
		{
			this.CalloutContentWidth = this.absWidth+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'left');
			this.CalloutContentHeight = this.absHeight+nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bodytitlediv' + this.CalloutDirection, 'top');
		}
		if (!this.HaltAttributes) {this.assignAttributes();}
	}
	catch(e)
	{
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.setCalloutDirection = function(direction) 
{
	var myTitle = this.titlehtml;
	if (direction != this.CalloutDirection)
	{
		this.CalloutDirection = direction;
		this.setTitle(myTitle);
		if (!this.HaltAttributes) {this.assignAttributes();}		
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.updateCallout = function() 
{
	if (this.mode == 'ATTACHELEMENT') 
	{
		this.attachToElement(this.lastID);
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.assignAttributes = function(runforReal) 
{
	var t, tempVar, tempVar2, tempVar3 = 0;
	var offsetX, offsetY = 0;
	try 
	{
		for (t = 0; t < 6; t++) 
		{
			this.Containers[t].style.display = 'none';
			this.Containers[t].style.width = '';
			this.Containers[t].style.height = '';
			this.Containers[t].style.top = '0px';
			this.Containers[t].style.left = '0px';
		}
	offsetX = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_offset' + this.CalloutDirection, 'width');
	offsetY = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_offset' + this.CalloutDirection, 'height');
	
	var closeoffsetX = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_closeoffset' + this.CalloutDirection, 'left');
	var closeoffsetY = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_closeoffset' + this.CalloutDirection, 'top');
		
	this.CalloutContentWidth += offsetX;
	this.CalloutContentHeight += offsetY;	

	if (this.CalloutDirection == 0)  
	{
		// No pointer	
		for (t = 0; t < 4; t++) {
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bl_right', 'width');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tl_br_plain', 'width');
		
		this.width = tempVar + this.CalloutContentWidth;
		this.height = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tl_br_plain', 'height') + this.CalloutContentHeight;
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_bl_main";
		this.Containers[0].style.top = "0px";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_bl_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_bl_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = this.CalloutContentHeight + "px";		
		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_bl_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_bottom_plain";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_bottom_plain");
		
		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_tl_br_plain";
		this.Containers[3].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[3].style.top = this.CalloutContentHeight + "px";
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_tl_br_plain");
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
	}
	if (this.CalloutDirection == 1) 
	{
		// pointer is on bottom right	
		for (t = 0; t < 4; t++) {
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bl_right', 'width');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_br_bottom', 'width');
		
		this.width = tempVar + this.CalloutContentWidth;
		this.height = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_br_bottom', 'height') + this.CalloutContentHeight;
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_bl_main";
		this.Containers[0].style.top = "0px";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_bl_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_bl_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = this.CalloutContentHeight + "px";		
		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_bl_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_bottom_plain";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_bottom_plain");
		
		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_br_bottom";
		this.Containers[3].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[3].style.top = this.CalloutContentHeight + "px";
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_br_bottom");
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
	}
	if (this.CalloutDirection == 2) 
	{
		// pointer is on bottom right
		for (t = 0; t < 4; t++)
		{
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bl_right', 'width');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_br_plain', 'width');

		this.width = tempVar + this.CalloutContentWidth;
		this.height = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bl_bottom', 'height') + this.CalloutContentHeight;		
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
				
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_bl_main";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_bl_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_bl_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = this.CalloutContentHeight + "px";		
		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_bl_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_bl_bottom";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_bl_bottom");
		

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_br_plain";
		this.Containers[3].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";	
		this.Containers[3].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_br_plain");				

		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';

	}	
	if (this.CalloutDirection == 3) 
	{
		// pointer is on top left		
		for (t = 0; t < 4; t++)
		{
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tl_right', 'width');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_br_plain', 'width');
		
		this.width = tempVar + this.CalloutContentWidth;

		this.height = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bottom_plain', 'height') + this.CalloutContentHeight;		
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_tl_main";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_tl_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_tl_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = this.CalloutContentHeight + "px";		
		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_tl_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_bottom_plain";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_bottom_plain");
		
		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_tl_br_plain";
		this.Containers[3].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";	
		this.Containers[3].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_tl_br_plain");				

		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';
	}
	if (this.CalloutDirection == 4) 
	{
		// pointer is on top right
		for (t = 0; t < 6; t++)
		{
			this.Containers[t].style.display = 'block';
		}	
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tr_right', 'width');		
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tr_topright', 'width');
		tempVar3 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tr_topleft', 'height');
		
		//this.CalloutContentHeight -= tempVar3;

		this.width = tempVar + this.CalloutContentWidth;
		this.height = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_tr_topleft', 'height') + nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_bottom_plain', 'height') + this.CalloutContentHeight;
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
			
		this.Containers[4].className = "ntb" + this.stylesheet + "Callout_tr_topleft";
		this.Containers[4].style.left = "0px";	
		this.Containers[4].style.top = "0px";
		this.Containers[4].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";			
		this.swapIEPNG(4, "ntb" + this.stylesheet + "Callout_tr_topleft");
		
		this.Containers[5].className = "ntb" + this.stylesheet + "Callout_tr_topright";
		this.Containers[5].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";	
		this.Containers[5].style.top = "0px";		
		this.swapIEPNG(5, "ntb" + this.stylesheet + "Callout_tr_topright");			
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_tr_mainpart";
		this.Containers[0].style.top = tempVar3 + "px";		
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = (this.CalloutContentHeight-tempVar3) + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_tr_mainpart");
	
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_br_plain', 'width');
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_tr_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = (this.CalloutContentHeight-tempVar3) + "px";		
		this.Containers[1].style.top = tempVar3 + "px";	
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_tr_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_bottom_plain";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";		
		this.Containers[2].style.top = (this.CalloutContentHeight-tempVar3) + tempVar3 + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_bottom_plain");
		

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_tl_br_plain";
		this.Containers[3].style.left = (this.CalloutContentWidth + parseInt(tempVar) - parseInt(tempVar2)) + "px";	
		this.Containers[3].style.top = (this.CalloutContentHeight-tempVar3) + tempVar3 + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_tl_br_plain");				

		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';
	}		
	if (this.CalloutDirection == 5) 
	{
		// pointer is on left top	
		for (t = 0; t < 4; t++)
		{
			this.Containers[t].style.display = 'block';		
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lt_br', 'height');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lt_bottom', 'height');
		
		this.width = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lt_right', 'width') + this.CalloutContentWidth;
		this.height = tempVar2 + this.CalloutContentHeight;		
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_lt_main";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_lt_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_lt_bottom";
		this.Containers[1].style.left = "0px";	
		this.Containers[1].style.width = this.CalloutContentWidth + "px";		
		this.Containers[1].style.top = this.CalloutContentHeight + "px";	
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_lt_bottom");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_lt_right";
		this.Containers[2].style.left = this.CalloutContentWidth + "px";	
		this.Containers[2].style.height = (this.CalloutContentHeight+tempVar2-tempVar) + "px";		
		this.Containers[2].style.top = "0px";
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_lt_right");			

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_lt_br";
		this.Containers[3].style.left = (this.CalloutContentWidth ) + "px";	
		this.Containers[3].style.top = (this.CalloutContentHeight+tempVar2-tempVar) + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_lt_br");				
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
	}	
	if (this.CalloutDirection == 6) 
	{
		// pointer is on left bottom

		for (t = 0; t < 6; t++)
		{
			this.Containers[t].style.display = 'block';
		}	
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lb_left', 'width');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lb_lb', 'height');
		tempVar3 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lb_bottom', 'height');

		this.width = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lb_right', 'width') + tempVar + this.CalloutContentWidth;
		this.height = tempVar3 + this.CalloutContentHeight;				
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[4].className = "ntb" + this.stylesheet + "Callout_lb_left";
		this.Containers[4].style.left = "0px";	
		this.Containers[4].style.top = "0px";
		this.Containers[4].style.height = (this.CalloutContentHeight+tempVar3-tempVar2)  + "px";			
		this.swapIEPNG(4, "ntb" + this.stylesheet + "Callout_lb_left");
		
		this.Containers[5].className = "ntb" + this.stylesheet + "Callout_lb_lb";
		this.Containers[5].style.left = "0px";
		this.Containers[5].style.top = (this.CalloutContentHeight+tempVar3-tempVar2) + "px";	
		this.swapIEPNG(5, "ntb" + this.stylesheet + "Callout_lb_lb");			
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_lb_main";
		this.Containers[0].style.top = "0px";
		this.Containers[0].style.left = tempVar + "px";		
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_lb_main");
	
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_lb_bottom";
		this.Containers[1].style.left = tempVar + "px";	
		this.Containers[1].style.width = this.CalloutContentWidth + "px";		
		this.Containers[1].style.top = this.CalloutContentHeight + "px";	
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_lb_bottom");		
		
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_lb_br', 'height');
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_lb_right";
		this.Containers[2].style.left = (tempVar+this.CalloutContentWidth) + "px";	
		this.Containers[2].style.top = "0px";
		this.Containers[2].style.height = (this.CalloutContentHeight+tempVar3-tempVar2) + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_lb_right");

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_lb_br";
		this.Containers[3].style.left = (tempVar+this.CalloutContentWidth) + "px";	
		this.Containers[3].style.top = (this.CalloutContentHeight+tempVar3-tempVar2) + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_lb_br");				
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
	}
	
	if (this.CalloutDirection == 7) 
	{
		// pointer is on right top
		for (t = 0; t < 4; t++)
		{
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rb_bottom', 'height');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rt_br', 'height');
		
		this.width = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rt_right', 'width') + this.CalloutContentWidth;
		this.height = tempVar2 + this.CalloutContentHeight;					
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_rb_main";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_rb_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_rt_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = (this.CalloutContentHeight+tempVar-tempVar2) + "px";		
		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_rt_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_rb_bottom";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = this.CalloutContentWidth + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_rb_bottom");

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_rt_br";
		this.Containers[3].style.left = this.CalloutContentWidth + "px";	
		this.Containers[3].style.top = (this.CalloutContentHeight+tempVar-tempVar2) + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_rt_br");	
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
		
	}		
	if (this.CalloutDirection == 8) 
	{
		// pointer is on right bottom
		for (t = 0; t < 4; t++)
		{
			this.Containers[t].style.display = 'block';
		}
		tempVar = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rb_bottom', 'height');
		tempVar2 = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rb_rb', 'height');
		
		this.width = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_rb_right', 'width') + this.CalloutContentWidth;
		this.height = tempVar2 + this.CalloutContentHeight;				
		this.MasterContainer.style.width = this.width;
		this.MasterContainer.style.height = this.height;
		
		this.Containers[0].className = "ntb" + this.stylesheet + "Callout_rb_main";
		this.Containers[0].style.width = this.CalloutContentWidth + "px";	
		this.Containers[0].style.height = this.CalloutContentHeight + "px";
		this.swapIEPNG(0, "ntb" + this.stylesheet + "Callout_rb_main");
		
		this.Containers[1].className = "ntb" + this.stylesheet + "Callout_rb_right";
		this.Containers[1].style.left = this.CalloutContentWidth + "px";	
		this.Containers[1].style.height = (this.CalloutContentHeight+tempVar-tempVar2) + "px";		

		this.Containers[1].style.top = "0px";
		this.swapIEPNG(1, "ntb" + this.stylesheet + "Callout_rb_right");		
		
		this.Containers[2].className = "ntb" + this.stylesheet + "Callout_rb_bottom";
		this.Containers[2].style.left = "0px";	
		this.Containers[2].style.width = this.CalloutContentWidth + "px";		
		this.Containers[2].style.top = this.CalloutContentHeight + "px";		
		this.swapIEPNG(2, "ntb" + this.stylesheet + "Callout_rb_bottom");
		

		this.Containers[3].className = "ntb" + this.stylesheet + "Callout_rb_rb";
		this.Containers[3].style.left = this.CalloutContentWidth + "px";	
		this.Containers[3].style.top = (this.CalloutContentHeight+tempVar-tempVar2) + "px";		
		this.swapIEPNG(3, "ntb" + this.stylesheet + "Callout_rb_rb");	
		
		this.CloseElement.style.left = (this.CalloutContentWidth + closeoffsetX) + 'px';		
		this.CloseElement.style.top = closeoffsetY + 'px';		
		
	}	
	
	this.CalloutContentWidth -= offsetX;
	this.CalloutContentHeight -= offsetY;
	this.moveTo(this.ax,this.ay);
	}
	catch(e)
	{
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.swapIEPNG = function(ContainerID, StyleName) 
{
	this.Is();
	if ((this.ie) && (!this.ie7)) 
	{
		this.Containers[ContainerID].style.backgroundImage = 'none';	
		this.Containers[ContainerID].style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.StyleSheetUrl + nitobi.callout.Callout.readClassAttribute(StyleName, 'backgroundImage') + '\', sizingMethod=\'crop\');';		
	} 
	else 
	{
		this.Containers[ContainerID].style.filter = '';
	}		
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.setOpacity = function(newOpacity) 
{
	this.opacity = newOpacity;
	var isIE7 = false;
	if (this.ie7) 
	{
		if (newOpacity == 0) {
			//this.TitleElement.style.opacity = 0;
			//this.TitleElement.style.filter = 'alpha(opacity=0)';	
			this.BodyElement.style.opacity = 0;
			this.BodyElement.style.filter = 'alpha(opacity=0)';
			this.CloseElement.style.opacity = 0;
			this.CloseElement.style.filter = 'alpha(opacity=0)';
		} else {
			isIE7 = true;
		}
		
	}
	try 
	{
		if (newOpacity == 1.0) 
		{
		//	this.TitleElement.style.filter = '';
			//this.BodyElement.style.filter = '';		
			this.MasterContainer.style.filter = '';
			this.MasterContainer.style.opacity = newOpacity;
		} 
		else 
		{
			this.MasterContainer.style.opacity = this.opacity;
			this.MasterContainer.style.filter = 'alpha(opacity=' + (this.opacity*100) + ')';	
			//this.TitleElement.style.opacity = this.opacity;
			//this.TitleElement.style.filter = 'alpha(opacity=' + (this.opacity*100) + ')';	
			this.BodyElement.style.opacity = this.opacity;
			this.BodyElement.style.filter = 'alpha(opacity=' + (this.opacity*100) + ')';
			this.CloseElement.style.opacity = this.opacity;
			this.CloseElement.style.filter = 'alpha(opacity=' + (this.opacity*100) + ')';		
		}
	} 
	catch(e) 
	{
	}
	
	if (isIE7) {
		try {this.MasterContainer.style.filter = '';}catch(e){}
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.fadeIn = function() 
{
	if (!this.ie7) 
	{
	var myObj = this;
	var newOpacity = this.opacity + 0.10;
	if (newOpacity > 1.0)
	{
		newOpacity = 1.0;	
	}
	if (this.opacity < 0.95) 
	{
		this.setOpacity(newOpacity);
		setTimeout(function() {myObj.fadeIn()}, 50);	
	} 
	else 
	{
		this.setOpacity(1.0);
		if (this.onappear != null)
			this.onappear.call();
	}
	} else {
		this.setOpacity(0.99);
		this.setOpacity(1.0);
		if (this.onappear != null)
			this.onappear.call();		
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.fadeOut = function(AfterFade) 
{
	if (!this.ie7) 
	{	
	var myObj = this;
	var newOpacity = this.opacity-0.10;
	if (newOpacity < 0)
	{
		newOpacity = 0;
	}
	if (this.opacity > 0.05) 
	{
		this.setOpacity(newOpacity);
		setTimeout(function() {myObj.fadeOut(AfterFade)}, 50);	
	} 
	else 
	{
		this.setOpacity(0);
		eval(AfterFade);
	}
	} else {
		
		this.setOpacity(0);
		eval(AfterFade);
	}
}

/**
 * Renders the callout object to the page.
 */
nitobi.callout.Callout.prototype.show = function() 
{
	if (this.effectName == 'APPEAR') 
	{
		this.MasterContainer.style.visibility = 'visible';	
		if (this.onappear != null)
			this.onappear.call();
	}
	if (this.effectName == 'FADE') 
	{
		try {
			this.MasterContainer.style.visibility = 'visible';	
		this.setOpacity(0);
		this.fadeIn();
		} catch(e) {}
	}
	if (this.mode == 'ATTACHELEMENT') 
	{
		this.attachToElement(this.lastID);
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.hide = function() 
{
	if (this.effectName == 'APPEAR') 
	{
		this.MasterContainer.style.visibility = 'hidden';	
	}
	if (this.effectName == 'FADE') 
	{
		this.fadeOut();
	}
}

/**
 * @private
 */
nitobi.callout.Callout.getStyleSheetUrl = function()
{
	if (nitobi.callout.Callout.globalStylesheet	== null) 
	{
		var rule = nitobi.html.Css.getRule('ntb' + nitobi.callout.lastStyle);
		nitobi.callout.Callout.globalStylesheet = nitobi.html.Css.getPath(rule.parentStyleSheet);
		return nitobi.callout.Callout.globalStylesheet;
	} 
	else 
	{
		return nitobi.callout.Callout.globalStylesheet;
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.setMode = function(newMode) 
{
	if (this.mode != newMode)
	{
		this.mode = newMode;
	}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype._destroy = function() 
{	
	try 
	{
		this.MasterContainer.style.display = 'none';
		for (var t = 0; t < 6; t++)
		{
			this.Containers[t].parentNode.removeChild(this.Containers[t]);
			this.Containers[t] = null;
		}	
		this.MasterContainer.parentNode.removeChild(this.MasterContainer); 
		this.TitleElement.parentNode.removeChild(this.TitleElement);
		this.TitleElement = null;
		this.CloseElement.parentNode.removeChild(this.CloseElement);
		this.CloseElement = null;	
		this.MasterContainer = null; 
	} 
	catch(e) 
	{
	}
	this.setMode('INACTIVE');
	var foundItem = false;

	for (var t = 0; t < nitobi.callout.Callout.refs.length; t++)
	{
		if (nitobi.callout.Callout.refs[t].uid != null)
		{
			foundItem = true;
		}
	}
	if (foundItem == false) 
	{
		if (window.addEventListener) 
		{ 
			// Non-IE browsers
			window.removeEventListener("scroll", nitobi.callout.Callout.update, false);		
			window.removeEventListener("resize", nitobi.callout.Callout.update, false);			
		} 
		else if (window.attachEvent) 
		{ 
			// IE 6+
			window.detachEvent('onscroll', nitobi.callout.Callout.update);
			window.detachEvent('onresize', nitobi.callout.Callout.update);	
		}	
		nitobi.callout.Callout.refs.length = 0;
	}
	this.BodyElement = null;
	try 
	{
		document.getElementById('body' + this.uid).parentNode.removeChild(document.getElementById('body' + this.uid)); 
	} 
	catch(e)
	{
	}
	this.uid = null;
	if (this.ondestroy != null) 
	{
		this.ondestroy.call(); this.ondestroy = null;
	}
	 for (var item in this) {
		this[item] = null;
		delete this[item];
		
	}

}

/**
 * Removes the callout.
 */
nitobi.callout.Callout.prototype.destroy = function() 
{
	clearTimeout(this.expireObj);
	if (this.effectName == 'APPEAR') 
	{
		this._destroy();
	}
	if (this.effectName == 'FADE') 
	{
		this.fadeOut("this._destroy();");
	}	
}

/**
 * @private
 */
nitobi.callout.Callout.readClassAttribute = function(cssclassname, attributename)
{
	var b,c,d,e;
	e = nitobi.callout.Callout.styleArray[cssclassname + attributename];
	if (typeof(e) == 'undefined') 
	{
		if (typeof(nitobi.callout.Callout.ruleArray[cssclassname]) == 'undefined') {
			var rule = nitobi.html.Css.getRule(cssclassname);
			nitobi.callout.Callout.ruleArray[cssclassname] = rule;
		} else {
			var rule = nitobi.callout.Callout.ruleArray[cssclassname];
		}
		
		if (rule && rule.selectorText.toLowerCase().indexOf(cssclassname.toLowerCase()) > -1) 
		{
			if (attributename.toLowerCase() == 'backgroundimage') 
			{
				nitobi.callout.Callout.styleArray[cssclassname + attributename] = rule.style.backgroundImage.replace('url', '').replace('(', '').replace(')','');
				return nitobi.callout.Callout.styleArray[cssclassname + attributename];
			}
			if (attributename.toLowerCase() == 'width') 
			{
				nitobi.callout.Callout.styleArray[cssclassname + attributename] = parseInt(rule.style.width.replace('px', ''));
				return nitobi.callout.Callout.styleArray[cssclassname + attributename];
			}
			if (attributename.toLowerCase() == 'height') 
			{
				nitobi.callout.Callout.styleArray[cssclassname + attributename] = parseInt(rule.style.height.replace('px', ''));
				return nitobi.callout.Callout.styleArray[cssclassname + attributename];
			}
			if (attributename.toLowerCase() == 'left') 
			{
				nitobi.callout.Callout.styleArray[cssclassname + attributename] = parseInt(rule.style.left.replace('px', ''));
				return nitobi.callout.Callout.styleArray[cssclassname + attributename];
			}
			if (attributename.toLowerCase() == 'top') 
			{
				nitobi.callout.Callout.styleArray[cssclassname + attributename] = parseInt(rule.style.top.replace('px', ''));
				return nitobi.callout.Callout.styleArray[cssclassname + attributename];
			}					
		}
	} 
	else 
	{
		return nitobi.callout.Callout.styleArray[cssclassname + attributename];
	} 
}

/**
 * @private
 */
nitobi.callout.Callout.getCoords = function(element)
{
	var ew, eh;
	if (element == null) {
		var lx,ly = 0;
		var cc = nitobi.callout.Callout.getScrollPosition();
		lx = cc.scrollLeft+(cc.clientWidth/2); ly = cc.scrollTop+(cc.clientHeight/2); ew = 10; eh = 10;
	} else {

	try 
	{
		var originalElement = element;
		ew = element.offsetWidth;
		eh = element.offsetHeight;
		for (var lx=0,ly=0; element!=null; lx+=element.offsetLeft,ly+=element.offsetTop,element=element.offsetParent);
		for (;originalElement!=document.body; lx-=originalElement.scrollLeft,ly-=originalElement.scrollTop,originalElement=originalElement.parentNode);
	} 
	catch(e) 
	{
	}}
	return {x:lx,y:ly,h:eh,w:ew}
}

/**
 * @private
 */
nitobi.callout.Callout.getCoordsAlt = function(eElement)
{
	if (!eElement && this) 
    {       
        eElement = this; 
    }  
    
    try 
    {
    	var nLeftPos = eElement.offsetLeft; 
    	var nTopPos = eElement.offsetTop;	
		var eParElement = eElement.offsetParent; 
	} 
	catch(e) 
	{
	}
    while (eParElement != null)
    {  
       	try 
       	{
			nLeftPos += eParElement.offsetLeft; 
			nTopPos += eParElement.offsetTop;
       		eParElement = eParElement.offsetParent;  
		} 
		catch(e)
		{
		}
    }
	var myh = eElement.offsetHeight;
	var myw = eElement.offsetWidth;
	
	if (eElement == null) {
		var nLeftPos,nTopPos = 0;
		var cc = nitobi.callout.Callout.getScrollPosition();
		nLeftPos = cc.scrollLeft+(cc.clientWidth/2); nTopPos = cc.scrollTop+(cc.clientHeight/2); myh = 0; myw = 0;
	}	
	
	return {x:nLeftPos,y:nTopPos,h:myh,w:myw}
}

/**
 * @private
 */
nitobi.callout.Callout.prototype.getXY = function() 
{
	return {x:this.ax, y:this.ay}
}

/**
 * Moves the callout to a particular set of coordinates. The pointer of the callout will be centered on these coordinates.
 * @param {Number} x The x position (left).
 * @param {Number} y The y position (top).
 */
nitobi.callout.Callout.prototype.moveTo = function(x,y) 
{
	x = parseFloat(x);
	y = parseFloat(y);
	this.ax = x;
	this.ay = y;
	var offsetX = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_offset' + this.CalloutDirection, 'left');
	var offsetY = nitobi.callout.Callout.readClassAttribute('ntb' + this.stylesheet + 'Callout_offset' + this.CalloutDirection, 'top');
	try 
	{
		if (this.CalloutDirection == 0) 
		{		
			this.MasterContainer.style.top = (y - this.height/2) + 'px';
			this.MasterContainer.style.left = (x - this.width/2) + 'px';
		}		
		if (this.CalloutDirection == 1) 
		{		
			this.MasterContainer.style.top = (y - this.height + offsetY) + 'px';
			this.MasterContainer.style.left = (x - this.width + offsetX) + 'px';
		}
		if (this.CalloutDirection == 2) 
		{
			this.MasterContainer.style.top = (y - this.height + offsetY) + 'px';
			this.MasterContainer.style.left = (x + offsetX) + 'px';
		}
		if (this.CalloutDirection == 3) 
		{		
			this.MasterContainer.style.top = (y + offsetY) + 'px';
			this.MasterContainer.style.left = (x + offsetX) + 'px';
		}
		if (this.CalloutDirection == 4) 
		{		
			this.MasterContainer.style.top = (y + offsetY) + 'px';
			this.MasterContainer.style.left = (x - this.width + offsetX) + 'px';
		}
		if (this.CalloutDirection == 5) 
		{		
			this.MasterContainer.style.top = (y + offsetY) + 'px';
			this.MasterContainer.style.left = (x + offsetX) + 'px';
		}
		if (this.CalloutDirection == 6) 
		{		
			this.MasterContainer.style.top = (y - this.height + offsetY) + 'px';
			this.MasterContainer.style.left = (x + offsetX) + 'px';
		}
		if (this.CalloutDirection == 7) 
		{		
			this.MasterContainer.style.top = (y + offsetY) + 'px';
			this.MasterContainer.style.left = (x - this.width + offsetX) + 'px';
		}
		if (this.CalloutDirection == 8) 
		{		
			this.MasterContainer.style.top = (y - this.height + offsetY) + 'px';
			this.MasterContainer.style.left = (x - this.width + offsetX) + 'px';
		}	
	} 
	catch(e)
	{
	}
	if (this.allowOffScreen == false) {
		try {
		if (parseInt(this.MasterContainer.style.top.replace('px', '')) < 0)
			this.MasterContainer.style.top = '0px';
		if (parseInt(this.MasterContainer.style.left.replace('px', '')) < 0)
			this.MasterContainer.style.left = '0px';			
		} catch(e) {}
	}
}

/**
 * @private
 */
nitobi.callout.Callout.getScrollPosition = function()
{
	var ResultScrollTop, ResultScrollLeft, ClientWidth, ClientHeight = 0;
	if ((this.opera == false) && (document.documentElement.scrollTop > 0)) 
	{
		ResultScrollTop = document.documentElement.scrollTop;
		ResultScrollLeft = document.documentElement.scrollLeft;	
		ClientWidth = document.documentElement.clientWidth;
		ClientHeight = document.documentElement.clientHeight;
	} 
	else 
	{
		ResultScrollTop = document.body.scrollTop;
		ResultScrollLeft = document.body.scrollLeft;
		ClientWidth = document.body.clientWidth;
		ClientHeight = document.body.clientHeight;		
	}
	
	if ((document.body.clientHeight > 0) && (document.documentElement.clientHeight > 0) && (document.body.clientHeight < document.documentElement.clientHeight)) 
	{
		ClientWidth = document.body.clientWidth;
		ClientHeight = document.body.clientHeight;			
	}
	
	if ((document.body.clientHeight > 0) && (document.documentElement.clientHeight > 0) && (document.body.clientHeight > document.documentElement.clientHeight)) 
	{
		ClientWidth = document.documentElement.clientWidth;
		ClientHeight = document.documentElement.clientHeight;			
	}	
	
	if ((nitobi.callout.Callout.permHeight == 0) || (nitobi.callout.Callout.permWidth == 0))
	{
		var agent = navigator.userAgent.toLowerCase(); 	
		if (agent.indexOf("opera") == 0) 
		{
			var opera = true;
		}
		var ie = false;
		if (agent.indexOf("ie") > 0) 
		{
			ie = true;
		}		
	
		var tempDiv = document.createElement('div');
		tempDiv.innerHTML = '';
		tempDiv.setAttribute('id', 'ntbHeightDiv');
		tempDiv.object = this;
		tempDiv.style.position = "relative";
		tempDiv.style.width = "100%";
		tempDiv.style.height = "1px";
		tempDiv.style.visibility = 'visible';
			
		document.getElementsByTagName('body').item(0).appendChild(tempDiv);
			
		var ObjCoords;
	
		if (opera) 
		{
			ObjCoords = nitobi.callout.Callout.getCoordsAlt(tempDiv);
		} 
		else
		{
			ObjCoords = nitobi.callout.Callout.getCoords(tempDiv);
		}		
	
		nitobi.callout.Callout.permHeight = parseInt(ObjCoords.y);
		nitobi.callout.Callout.permWidth = parseInt(ObjCoords.w)+(parseInt(ObjCoords.x)*2);
	
		if (nitobi.callout.Callout.permHeight < ClientHeight)
		{
			nitobi.callout.Callout.permHeight = ClientHeight;
		}
			
		if (nitobi.callout.Callout.permHeight < document.body.clientHeight)
		{
			nitobi.callout.Callout.permHeight = document.body.clientHeight;
		}
		
		if (nitobi.callout.Callout.permHeight < document.documentElement.clientHeight)
		{
				nitobi.callout.Callout.permHeight = document.documentElement.clientHeight;
		}	
		document.getElementsByTagName('body').item(0).removeChild(tempDiv);
		tempDiv = null;
		agent = null;
		opera = null;
	}
	if (((ResultScrollTop == 0) && (document.documentElement.scrollTop > 0)) ||  ((ResultScrollLeft == 0) && (document.documentElement.scrollLeft > 0)))
	{
		ResultScrollTop = document.documentElement.scrollTop;
		ResultScrollLeft = document.documentElement.scrollLeft;
	}
	if ((document.documentElement.scrollWidth > nitobi.callout.Callout.permWidth) || (document.documentElement.scrollHeight > nitobi.callout.Callout.permHeight)) 
	{
		nitobi.callout.Callout.permWidth = document.documentElement.scrollWidth;
		nitobi.callout.Callout.permHeight = document.documentElement.scrollHeight;
	}
	if ((document.body.scrollWidth > nitobi.callout.Callout.permWidth) || (document.body.scrollHeight > nitobi.callout.Callout.permHeight)) 
	{
		nitobi.callout.Callout.permWidth = document.body.scrollWidth;
		nitobi.callout.Callout.permHeight = document.body.scrollHeight;
	}	

	// This if block causes problems in Moz in standards.  Earlier we
	// check for the smaller of document.body.clientHeight and 
	// document.documentElement.clientHeight.  In standards in Moz, the proper
	// value should be document.documentElement.clientHeight, which is set 
	// properly above,  but this if block below essentially undoes that re-jiggering.
	// Does this block have some other, obscure use?
	//if (navigator.userAgent.toLowerCase().indexOf("gecko") >= 0) 
	//{
	//	if (document.body.clientHeight > ClientHeight) {
//			ClientHeight = document.body.clientHeight;
//			ClientWidth = document.body.clientWidth;
//		}
//	}
	//if ((ie) && (document.compatMode == 'BackCompat')) {
		//alert(nitobi.callout.Callout.permWidth + ':' + nitobi.callout.Callout.permHeight + ':' + document.body.scrollHeight );
	//}
	return {scrollLeft:ResultScrollLeft,scrollTop:ResultScrollTop,clientWidth:ClientWidth,clientHeight:ClientHeight,bodyWidth:nitobi.callout.Callout.permWidth,bodyHeight:nitobi.callout.Callout.permHeight}
}

/**
 * Will attach a callout to an HTML element on the page, identified by it's unique ID. 
 * For example if there is a DIV on the page with ID 'myDiv' then you could attach a callout
 * to it by saying myCalloutObject.attachToElement('myDiv');
 * @param {String} elementid The ID of the element to attach a callout to.
 */
nitobi.callout.Callout.prototype.attachToElement = function(elementid) 
{
	this.assignAttributes(); 
	if (typeof(elementid) == "function")
		try { elementid = elementid.call();	} catch(e){}	
		
	var sP = nitobi.callout.Callout.getScrollPosition();	
	this.setMode('ATTACHELEMENT');
	this.lastID = elementid;
	var ObjCoords;
	var x;
	
	nitobi.callout.Callout.rewriteId(elementid);
	
	if (this.opera) 
	{	
		ObjCoords = nitobi.callout.Callout.getCoordsAlt(document.getElementById(elementid));
	} 
	else
	{	
		ObjCoords = nitobi.callout.Callout.getCoords(document.getElementById(elementid));
	}


	var newCD = this.CalloutDirection;

	var DirectDecisions = Array(9);
	for (c = 1; c < 9; c++)
	{
		DirectDecisions[c] = true;
	}
	var AdjustedHeight = this.height*1.0;
	var AdjustedWidth = this.width*1.0;	
	var halfHeight = (ObjCoords.h/2);
	var halfWidth = (ObjCoords.w/2);	
	
	if ((ObjCoords.y-AdjustedHeight)<sP.scrollTop) 
	{
		DirectDecisions[1] = false;
		DirectDecisions[2] = false;
	}
	if ((ObjCoords.x-AdjustedWidth)<sP.scrollLeft) 
	{
		DirectDecisions[7] = false;
		DirectDecisions[8] = false;	
	}
	if ((ObjCoords.y+ObjCoords.h+AdjustedHeight)>(sP.scrollTop+sP.clientHeight)) 
	{
		DirectDecisions[3] = false;
		DirectDecisions[4] = false;	
	}
	if ((ObjCoords.x+ObjCoords.w+AdjustedWidth)>(sP.scrollLeft+sP.clientWidth)) 
	{
		DirectDecisions[5] = false;
		DirectDecisions[6] = false;
	}	
	if ((ObjCoords.x-AdjustedWidth+halfWidth)<sP.scrollLeft) 
	{
		DirectDecisions[1] = false;
		DirectDecisions[4] = false;		
	}
	if ((ObjCoords.x+AdjustedWidth+halfWidth)>(sP.scrollLeft+sP.clientWidth)) 
	{
		DirectDecisions[2] = false;
		DirectDecisions[3] = false;	
	}
	if ((ObjCoords.y-AdjustedHeight+halfHeight)<sP.scrollTop) 
	{
		DirectDecisions[6] = false;
		DirectDecisions[8] = false;
	}
	if ((ObjCoords.y+AdjustedHeight+halfHeight)>(sP.scrollTop + sP.clientHeight)) 
	{
		DirectDecisions[5] = false;
		DirectDecisions[7] = false;	
	}

	
	
	for (c = 1; c < 9; c++)
	{
		if (DirectDecisions[c]) 
		{
			newCD = c;
			break;
		}
	}	
	
	if ((newCD == 1) || (newCD == 2) || (newCD == 3) || (newCD == 4))
	{
		ObjCoords.x += halfWidth;
	}
	if ((newCD == 3) || (newCD == 4)) 
	{
		ObjCoords.y += ObjCoords.h;
	}
	if ((newCD == 5) || (newCD == 6)) 
	{
		ObjCoords.x += ObjCoords.w;
	}
	if ((newCD == 5) || (newCD == 6) || (newCD == 7) || (newCD == 8)) 
	{
		ObjCoords.y += halfHeight;
	}	
	var didchange = false;
	
	if (newCD != this.CalloutDirection)
	{
		this.CalloutDirection = newCD;
		if (this.firefox)
		{
			didchange = true;
			try {this.MasterContainer.style.visibility = 'hidden';}catch(e){didchange=false;}
		}
		try {
		this.HaltAttributes = true;
		var myTitle = this.titlehtml;
		this.setTitle(myTitle);	
		var myBody = this.bodyHTML;
		this.setBody(myBody);
		this.HaltAttributes = false;		
		this.assignAttributes(); 
		} catch(e){}
		
	}

	this.allowOffScreen = false;
	this.moveTo(ObjCoords.x,ObjCoords.y);
	if (didchange)
	{
		var gfd = this;
		setTimeout(function() {gfd.MasterContainer.style.visibility = 'visible';}, 5);
	}
	
	if (this.onScreenUpdate != null)
	{
		this.onScreenUpdate.call();
	}
	//this.TitleElement.style.visibility = 'visible';
}

/**
 * @ignore
 */
nitobi.callout.Callout.precacheImages = function()
{
	var opera = false;
	var agent = navigator.userAgent.toLowerCase();
	if (agent.indexOf("opera") > -1) 
	{
		opera = true;
	} 
	else 
	{
		var b,c,d;
		var sheets = nitobi.html.Css.getStyleSheetsByName('nitobi.callout.css');
		for (var i = 0; i < sheets.length; i++)
		{
			nitobi.html.Css.precacheImages(sheets[i]);
		}
//		var b = rule.parentStyleSheet;
//		if (b.cssRules)
//		{
//			d = b.cssRules;
//		}
//		if (b.rules)
//		{
//			d = b.rules;
//		}		
//		for (c = 0; c < d.length; c++)
//		{
//			if ((d[c].style.backgroundImage != null) && (d[c].style.backgroundImage.length > 1)) 
//			{
//				var image = new Image();
//				image.src = nitobi.callout.Callout.getStyleSheetUrl() + "/" + d[c].style.backgroundImage.replace('url', '').replace('(','').replace(')','');
//				nitobi.callout.Callout.precachedImages[nitobi.callout.Callout.precachedImages.length] = image;
//			}
//		}			
	}
}














