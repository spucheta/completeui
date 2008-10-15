/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.spotlight");

if (false)
{
	/**
	 * @namespace The namespace for classes that make up the Nitobi Spotlight component.
	 * @constructor
	 */
	nitobi.spotlight = function(){};
}

/**
 * Creates a Nitobi Spotlight.  After you instantiate a Spotlight object, you must add "steps" to it using the various
 * methods below.  Each step is executed in the order that it was added.  Begin the tour by calling {@link #play}.
 * @class The Spotlight component allows you to create a "tour" that leads a user through various elements on a page.  Tours
 * are composed of steps, of which there are a number of different kinds.
 * @constructor
 * @example
 * var tour = new nitobi.spotlight.Spotlight('GREYSWIPE', 'impact', 'round');
 * tour.createCalloutStep(null, 'Centered', 'By not providing a DOM ID or object to a callout step, you create a centered callout in the tour.');
 * tour.createCalloutStep('corgi', 'Attached to an Image!', 'You can attach a callout to an object by providing the ID.');tour.createCalloutStep(null, 'Centered', 'The Nitobi Tabstrip is a fully skinnable tab component that can load data from Ajax requests, iFrames, or just to trigger JavaScript events.');	
 * tour.createCalloutStep('fatmanatee', 'Scrolling is Automatic', 'Spotlight will automatically scroll an object into view. You can turn this off by setting the allowScrolling attribute to <u>false</u>.');
 * tour.createCalloutStep('toocute', 'Each item occurs in Sequence', 'Each item will occur in sequence according to the order in which they were scripted.');
 * tour.createCalloutStep('fatmanatee', '', 'Its not necessary to have titles in callouts. In this example we simply specified an empty string as the title (\'\').');
 * tour.createCalloutStep('corgi', 'That\'s all folks!', 'Watch some of the other demos to get a sense for the capabilities of Spotlight and Callout.');	
 * tour.play();
 * @param {String} thiseffect The initialization effect to use ('GREYSWIPE', 'NONE')
 * @param {String} stylesheet Which style to use for the callouts
 * @param {String} lensType Which style to use for the lens. 'NONE', 'ROUND', 'SQUARE', 'BURST', etc
 * @param {String} lensOversize How much specifity to use on the lens. (default is 0.2)
 */
nitobi.spotlight.Spotlight = function(thiseffect, stylesheet, lensType, lensOversize) {
	if (lensType == null) { this.useLens = false; } else { this.useLens=false; if (lensType != 'none') {this.useLens = true; this.lensType = lensType;}}
	if (thiseffect == null) {thiseffect = 'NONE';}
	if (lensOversize == null) { this.lensOversize = 0.2; } else {  this.lensOversize = lensOversize;}
	
	/**
	 * @private
	 */
	this.uid = Math.random().toString().replace('.', '').replace('0', '');
	/**
	 * @private
	 */
	this.ver = '1.0';
	/**
	* @private
	*/
	this.masterOpacity = 0.3;
	/**
	* @private
	*/
	this.lensType;
	if (thiseffect == 'NONE') {
		thiseffect = 'GREYSWIPE';
		this.masterOpacity = 0.001;
		this.lensType = 'NONE';
	}
	/**
	* @private
	*/
	this.stylesheet = 'xp';

	/**
	* @private
	*/	
	this.oS = nitobi.callout.Callout.getScrollPosition();
	
	if (stylesheet != null) {
		this.stylesheet = stylesheet.toLowerCase();
	}

	/**
	* @private
	*/	
	this.bodyScroll = document.body.style.overflowX;
	/**
	 * @private
	 */
	this.allowScrolling = true;
	/**
	* @private
	*/
	this.stepArray = Array();
	/**
	* @private
	*/
	this.currentStep = -1;
	/**
	* @private
	*/
	this.effectMode = 'GREYSWIPE';
	if (thiseffect != null)
		this.effectMode = thiseffect.toUpperCase();
	/**
	* @private
	*/

	this.lastID = '';
	/**
	* @private
	*/	
	this.Containers = Array();
	/**
	* @private
	*/	
	this.ContainerCoords = Array();
	/**
	* @private
	*/	
	this.ContainerTempCoords = Array();	
	/**
	* @private
	*/	
	this.swipeStart = 0;
	/**
	* @private
	*/	
	this.swipeEnd = 0;
	/**
	* @private
	*/	
	this.swipePos = 0;
	/**
	* @private
	*/	
	this.textIterator = 0;
	/**
	* @private
	*/	
	this.coords;
	/**
	* @private
	*/	
	var o;
	/**
	* @private
	*/	
	this.ie = false;
	/**
	* @private
	*/	
	this.ie7 = false;
	/**
	* @private
	*/	
	this.firefox = false;
	/**
	* @private
	*/	
	this.opera = false;
	/**
	* @private
	*/	
	this.useMouse = false;
	/**
	* @private
	*/	
	var rule = nitobi.html.Css.getRule('ntbSpot');
	/**
	* @private
	*/	
	this.StyleSheetUrl = nitobi.html.Css.getPath(rule.parentStyleSheet);
	/**
	* @private
	*/	
	var agent = navigator.userAgent.toLowerCase(); 	
	if (agent.indexOf("opera") != -1) {this.opera = true;}
	if(agent.indexOf("firefox")!=-1){ this.firefox = true; }
	if (agent.indexOf("msie") != -1) {this.ie = true;}
	if (agent.indexOf("msie 7.0") != -1) {this.ie7 = true;}	

	/**
	* @private
	*/
	this.MouseIcon = document.createElement('div');
	this.MouseIcon.innerHTML = '';
	this.MouseIcon.setAttribute('id', 'ntbMouseIcon_' + this.uid);
	document.getElementsByTagName('body').item(0).appendChild(this.MouseIcon);
	this.MouseIcon.className = 'ntbMouse';
	this.MouseIcon.style.position = "absolute";
	this.MouseIcon.style.top = "0px";
	this.MouseIcon.style.left = "0px";
	this.MouseIcon.style.zIndex = 999999;
	this.MouseIcon.style.display = 'none';
	this.MouseIcon.style.visibility = 'visible';
//	this.MouseIcon.style.backgroundColor = '#cccccc';

	/**
	* @private
	*/
	this.waitForMouse = false;
	/**
	* @private
	*/	
	this.mouseDone = true;
	/**
	* @private
	*/	
	this.mouseTimerObj = null;
	/**
	* @private
	*/	
	this.Mouse_offX = 0;
	/**
	* @private
	*/	
	this.Mouse_offY = 0;
	/**
	* @private
	*/	
	this.MouseX = 0;
	/**
	* @private
	*/	
	this.MouseY = 0;	
	/**
	* @private
	*/	
	this.MouseOrigX = 0;
	/**
	* @private
	*/	
	this.MouseOrigY = 0;
	/**
	* @private
	*/	
	this.MouseAngle = 0;
	/**
	* @private
	*/	
	this.MouseDistance = 0;
	/**
	* @private
	*/	
	this.setMouseIcon('ntbMouse');
	/**
	* @private
	*/	
	this.targetScrollX = 0;
	/**
	* @private
	*/	
	this.targetScrollY = 0;
	/**
	* @private
	*/	
	this.startingScrollX = 0;
	/**
	* @private
	*/	
	this.startingScrollY = 0;
	/**
	* @private
	*/	
	this.inScroll = false;
	/**
	* @private
	*/	
	this.scrollTimer = null;
	/**
	* @private
	*/	
	this.scrollX = 0;
	/**
	* @private
	*/	
	this.scrollY = 0;
	/**
	* @private
	*/	
	this.onfindscroll = null;
	
	/**
	* @private
	*/
	this.MouseTargetX = 0;
	/**
	* @private
	*/	
	this.MouseTargetY = 0;
	
	for (var t = 0; t < 4; t++){
		this.Containers[t] = document.createElement('div');
		this.Containers[t].innerHTML = '';
		this.Containers[t].setAttribute('id', 'ntbBackground' + t + '_' + this.uid);
		//this.Containers[t].object = this;
		document.getElementsByTagName('body').item(0).appendChild(this.Containers[t]);
		this.Containers[t].style.backgroundColor = '#000000';
		this.Containers[t].style.position = "absolute";
		this.Containers[t].style.top = "0px";
		this.Containers[t].style.left = "0px";
		this.Containers[t].style.zIndex = 999990;
		this.Containers[t].style.overflow = "hidden";
		this.Containers[t].style.display = "block";
		this.Containers[t].style.visibility = "hidden";		
		this.ContainerCoords[t] = Array();
		this.ContainerTempCoords[t] = Array();		
		for (o = 0; o < 4; o++) {
			this.ContainerCoords[t][o] = 0;
			this.ContainerTempCoords[t][o] = 0;	}
	}
	this.Lens;
	this.setupLens();
	
}

/**
 * A static member used to determine whether or not to continue the tour
 * after a callout step has been destroyed.  We need this to distinuish the case
 * where the callout was destroyed from clicking the 'next' button or the [x] button
 * @private
 */
nitobi.spotlight.Spotlight.continueTour;

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.setupLens = function() {
	this.Lens = document.createElement('div');
	var tL = this.Lens;
	tL.innerHTML = '&nbsp;';
	tL.setAttribute('id', 'ntbLens' + this.uid);
	document.getElementsByTagName('body').item(0).appendChild(tL);
	var tLs = tL.style;
	tLs.overflow = "hidden";
	tLs.position = "absolute";
	tLs.top = "0px";
	tLs.left = "0px";
	tLs.width = "300px";
	tLs.height = "300px";
	tLs.zIndex = 999990;
	tLs.display = "block";
	tLs.visibility = "hidden";
	if ((this.ie) && (!this.ie7)) {
		tL.innerHTML = '<div id="ntbLensI' + this.uid + '" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.StyleSheetUrl + '/' + this.lensType + '.png\', sizingMethod=\'scale\');"></div>';
		//tLs.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.StyleSheetUrl + '/' + this.lensType + '.png\', sizingMethod=\'scale\');';	
	} else {
		tL.innerHTML = '<img id="ntbLensI' + this.uid + '" src="' + this.StyleSheetUrl + '/' + this.lensType + '.png">';
	}
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.drawLens = function() {
	if (this.useLens) {
	var tL = this.Lens; var tLs = tL.style;
	tLs.visibility = 'visible';
	tLs.left = this.coords.x + 'px'; tLs.top = this.coords.y + 'px';
	tLs.width = this.coords.w + 'px';
	if (this.swipePos < this.coords.h+this.coords.y) {
		if (this.swipePos <= this.coords.y) {
			tLs.height = '0px';
			tLs.visibility = 'hidden';
		} else {
			tLs.height = (this.swipePos-this.coords.y) + 'px';
		}
	} else {
		tLs.height = this.coords.h + 'px';
	}
	var tLi = $('ntbLensI' + this.uid).style;
	tLi.width = this.coords.w + 'px';
	tLi.height = this.coords.h + 'px';
	}
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.updateScroller = function(x1,y1,x2,y2) {
	clearTimeout(this.scrollTimer);

	if (this.allowScrolling) {
	var mS = nitobi.callout.Callout.getScrollPosition();
	
	
	var newScrollY = mS.scrollTop;
	var newScrollX = mS.scrollLeft;
	if (y1<mS.scrollTop)
		var newScrollY = y1-(mS.clientHeight/4.5);

	if (x1<mS.scrollLeft)
		var newScrollX = x1-(mS.clientWidth/4.5);
		
	if (y2>(mS.scrollTop+mS.clientHeight))
		var newScrollY = y2-mS.clientHeight+(mS.clientHeight/4.5);		

	if (x2>(mS.scrollLeft+mS.clientWidth))
		var newScrollX = x2-mS.clientWidth+(mS.clientWidth/4.5);
		
	if (newScrollY < 0)
		newScrollY = 0;
		
	if (newScrollX < 0)
		newScrollX = 0;
		
	if (newScrollY > (mS.bodyHeight-mS.clientHeight))
		newScrollY = (mS.bodyHeight-mS.clientHeight+10);

	if (newScrollX > (this.oS.bodyWidth-this.oS.clientWidth))
		newScrollX = (this.oS.bodyWidth-this.oS.clientWidth);	
				

	this.targetScrollX = newScrollX; this.targetScrollY = newScrollY;
	if (!this.inScroll) {
		this.startingScrollX = mS.scrollLeft;
		this.startingScrollY = mS.scrollTop;
		this.inScroll = true;
	}
	this.scrollX = mS.scrollLeft;
	this.scrollY = mS.scrollTop;
	this.iterateScroller();
	//window.scrollTo(newScrollX,newScrollY);
	} else {
		try {
		this.onfindscroll.call();	
		} catch(e) {}
	}
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.iterateScroller = function() {

	var scrollxVelocity = 0;
	var scrollyVelocity = 0;
	var ids = this;
	var scrollxAmplitude = 10;
	var scrollyAmplitude = 10;
	var scrollxIterator = 0;
	var scrollyIterator = 0;
	
	if ((this.targetScrollX-this.scrollX) > 0)
		scrollxVelocity = 1.1;
	if ((this.targetScrollX-this.scrollX) < 0)
		scrollxVelocity = -1.1;

	if ((this.targetScrollY-this.scrollY) > 0)
		scrollyVelocity = 1.1;
	if ((this.targetScrollY-this.scrollY) < 0)
		scrollyVelocity = -1.1;
	
	scrollxAmplitude = (Math.abs(this.targetScrollX-this.startingScrollX)/20)*0.8;
	scrollyAmplitude = (Math.abs(this.targetScrollY-this.startingScrollY)/20)*0.8;
	scrollxIterator = (this.scrollX-this.startingScrollX)/(this.targetScrollX-this.startingScrollX+0.0001);
	scrollyIterator = (this.scrollY-this.startingScrollY)/(this.targetScrollY-this.startingScrollY+0.0001);
	
	
	scrollxVelocity = (this.easeInEaseOut(scrollxAmplitude, 1, scrollxIterator)*scrollxVelocity);
	scrollyVelocity = (this.easeInEaseOut(scrollyAmplitude, 1, scrollyIterator)*scrollyVelocity);
	
	this.scrollX += scrollxVelocity;
	this.scrollY += scrollyVelocity;
	
	if (this.scrollY < 0)
		this.scrollY = 0;
		
	if (this.scrollX < 0)
		this.scrollX = 0;	
	
	window.scrollTo(this.scrollX,this.scrollY);
	
	
	if ((Math.abs(this.targetScrollY-this.scrollY) > 3) || (Math.abs(this.targetScrollX-this.scrollX) > 3)) {
//if ((scrollyIterator < 0.90) || (scrollxIterator < 0.90)) {
		this.scrollTimer = setTimeout(function(){ids.iterateScroller()}, 15);
	} else {this.inScroll = false; try {this.onfindscroll.call();}catch(e){}}
//this.scrollTimer
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.setMouseIcon = function(mouseClass) {
	this.MouseIcon.className = mouseClass;
	if ((this.ie) && (!this.ie7)) {	

		this.MouseIcon.style.backgroundImage = 'none';	
		this.MouseIcon.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + this.StyleSheetUrl + nitobi.callout.Callout.readClassAttribute(mouseClass, 'backgroundImage') + '\', sizingMethod=\'crop\');';		
	} else {this.MouseIcon.style.filter = '';}	
	this.Mouse_offX = nitobi.callout.Callout.readClassAttribute(mouseClass + '_offset', 'left');
	this.Mouse_offY = nitobi.callout.Callout.readClassAttribute(mouseClass + '_offset', 'top');
	this.MouseIcon.style.left = (this.MouseX + this.Mouse_offX) + 'px';
	this.MouseIcon.style.top = (this.MouseY + this.Mouse_offY) + 'px';	
}
/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.setEffect = function(effectName) {
	this.effectMode = effectName.toUpperCase();
	
}
/**
 * Stops the tour currently in progress.
 */
nitobi.spotlight.Spotlight.prototype.destroy = function() {
	if (this.Lens) {
		this.Lens.removeChild(this.Lens.firstChild);
		this.Lens = null;
	}
	for (var t = 0; t < 4; t++){
		document.getElementsByTagName('body').item(0).removeChild(this.Containers[t]);
		this.Containers[t] = null;
	}
	
	document.getElementsByTagName('body').item(0).removeChild(this.MouseIcon);

	
	this.MouseIcon = null;
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.lensMagnify = function(objC) {
	var resObj;
	resObj = objC;
	if (this.useLens) {
		resObj.x -= parseInt(objC.w*this.lensOversize);
		resObj.y -= parseInt(objC.h*this.lensOversize);
		resObj.w += parseInt(objC.w*(this.lensOversize*2));
		resObj.h += parseInt(objC.h*(this.lensOversize*2)); 
	}	
	return resObj;
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.setEffect = function(elementid) {
	var isFake = false;

	if (elementid==null)
	{
		
		isFake = true;
		var mc = nitobi.callout.Callout.getCoords($(elementid));
		elementid="NTB_tempDiv" + this.uid;
		var me = nitobi.html.createElement('div', {"id":elementid}, {"position":"absolute", "top":mc.y+"px", "left":mc.x+"px", "width":"0px", "height":"0px"});
		document.getElementsByTagName('body').item(0).appendChild(me);
		
	}
	if (elementid.indexOf(':') > 0) {
		elementid = document.forms[elementid.split(':')[0]][[elementid.split(':')[1]]];
	}	
	if (typeof(elementid) == "object")
		try { elementid = elementid.id;} catch(e){}
		
	if (typeof(elementid) == "function")
		try { elementid = elementid.call();} catch(e){}
		
	if ((this.effectMode == 'GREYSWIPE') || (this.effectMode == 'MODAL') || (this.effectMode == 'NONE')) {
		if (this.effectMode == 'MODAL') {
			this.swipePos = this.swipeEnd;
		}
		var sP = nitobi.callout.Callout.getScrollPosition();
		var ObjCoords;
		if (elementid != this.lastID) {
		this.lastID = elementid;
		if (this.opera) {ObjCoords = nitobi.callout.Callout.getCoordsAlt($(elementid));} else {ObjCoords = nitobi.callout.Callout.getCoords($(elementid)); }
		ObjCoords = this.lensMagnify(ObjCoords);
		this.coords = ObjCoords;
		this.ContainerCoords[0][0] = 0; this.ContainerCoords[0][1] = 0;
		this.ContainerCoords[0][2] = sP.bodyWidth; this.ContainerCoords[0][3] = ObjCoords.y;
		this.ContainerCoords[1][0] = 0; this.ContainerCoords[1][1] = ObjCoords.y;
		this.ContainerCoords[1][2] = ObjCoords.x; this.ContainerCoords[1][3] = ObjCoords.h;
		this.ContainerCoords[2][0] = ObjCoords.x+ObjCoords.w; this.ContainerCoords[2][1] = ObjCoords.y;
		this.ContainerCoords[2][2] = sP.bodyWidth-(ObjCoords.x+ObjCoords.w); this.ContainerCoords[2][3] = ObjCoords.h;
		this.ContainerCoords[3][0] = 0; this.ContainerCoords[3][1] = ObjCoords.y+ObjCoords.h;
		this.ContainerCoords[3][2] = sP.bodyWidth; this.ContainerCoords[3][3] = sP.bodyHeight-(ObjCoords.y+ObjCoords.h);			
		} else {
			ObjCoords = this.coords;
		}
		
		for (var t = 0; t < 4; t++){
		this.ContainerTempCoords[t][0] = this.ContainerCoords[t][0];
		if (this.swipePos > this.ContainerCoords[t][1]) {
			 this.ContainerTempCoords[t][1] = this.ContainerCoords[t][1];
		} else {
			this.ContainerTempCoords[t][1] = -1;
		}
		this.ContainerTempCoords[t][2] = this.ContainerCoords[t][2]; 
		if (this.swipePos > (this.ContainerCoords[t][3]+this.ContainerCoords[t][1])) {
			this.ContainerTempCoords[t][3] = this.ContainerCoords[t][3];
		} else {
			this.ContainerTempCoords[t][3] = this.swipePos-this.ContainerCoords[t][1];
		}}

		try {
		for (var t = 0; t < 4; t++){
						
			if ((this.ContainerTempCoords[t][3] > 0)) {
				if ((this.ContainerTempCoords[t][2] > 0) && (this.ContainerTempCoords[t][3] > 0)) {
				this.Containers[t].style.left = this.ContainerTempCoords[t][0] + 'px';
				this.Containers[t].style.top = this.ContainerTempCoords[t][1] + 'px';	
				this.Containers[t].style.width = this.ContainerTempCoords[t][2] + 'px';
				this.Containers[t].style.height = this.ContainerTempCoords[t][3] + 'px';
					
				this.Containers[t].style.visibility = 'visible';} else {
				this.Containers[t].style.visibility = 'hidden';
				}
			} else {
				this.Containers[t].style.visibility = 'hidden';
			}
		}} catch(e){}
		
	}
	this.drawLens();
	if (isFake)
	document.getElementsByTagName("body").item(0).removeChild($(elementid));	
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.swipeIn = function() {
var fd = this;
if (this.swipePos < this.swipeEnd-3) {
	var iteratorStart = this.swipePos-this.swipeStart;
	var iteratorEnd = this.swipeEnd-this.swipeStart;	
	this.swipePos += ((iteratorStart/iteratorEnd)*700)+2;
	this.setEffect(this.lastID);
	setTimeout(function(){fd.swipeIn()}, 30);
} else {
	this.swipePos = nitobi.callout.Callout.permHeight;
	this.setEffect(this.lastID);
	
}
	
	
}




/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.swipeOut = function() {
var fd = this;
if (this.swipePos > (this.swipeStart+3)) {
	var iteratorStart = this.swipePos-this.swipeStart;
	var iteratorEnd = this.swipeEnd-this.swipeStart;	
	this.swipePos -= ((iteratorStart/iteratorEnd)*300)+5;
	this.setEffect(this.lastID);
	setTimeout(function(){fd.swipeOut()}, 30);
} else {
	var sP = nitobi.callout.Callout.getScrollPosition();
	this.swipePos = 0;
	for (var t = 0; t < 4; t++){
	this.Containers[t].style.visibility = "hidden";	
	}	
	this.setEffect(this.lastID);
	
	this.destroy();
	document.body.style.overflowX = this.bodyScroll;
	
}
	
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.initEffect = function() {
	var referenceStep = 0;
	for (var d = 0; d < this.stepArray.length; d++) {
		if (this.stepArray[d][3] == 'OBJID')
		{
			referenceStep = d;
			var elementid = this.stepArray[referenceStep][0];			
			break;
		}
		if (this.stepArray[d][3] == 'EXECFORMHELPER')
		{
			if ((this.firefox) || (this.opera))
			{
				
				if (this.stepArray[d][0].id.length == 0)
					this.stepArray[d][0].id = 'ff' + Math.random();
				var elementid = this.stepArray[d][0].id;
			}
			if (this.ie)
			{ 
				var elementid = this.stepArray[d][0].name;}
			referenceStep = d;
			break;
		}		
	}

	var sP = nitobi.callout.Callout.getScrollPosition();

	if ((this.effectMode == 'GREYSWIPE') || (this.effectMode == 'MODAL')) {
		for (var t = 0; t < 4; t++){
			this.Containers[t].style.opacity = this.masterOpacity;
			this.Containers[t].style.filter = 'alpha(opacity=' + (0.3*100) + ')';	
		}
		
		this.swipeStart = sP.scrollTop;
		this.swipePos = sP.scrollTop;
		this.swipeEnd = sP.scrollTop+sP.clientHeight;
		this.setEffect(elementid);
		this.swipeIn();

		for (var t = 0; t < 4; t++){
		this.Containers[t].style.visibility = "visible";	
		}		
		
	}
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.endEffect = function(effectName) {
	var referenceStep = 0;	
	if (this.effectMode == 'GREYSWIPE') {
		var sP = nitobi.callout.Callout.getScrollPosition();
		this.swipeStart = sP.scrollTop;
		this.swipeEnd = sP.scrollTop+sP.clientHeight;		
		this.swipePos = sP.scrollTop+sP.clientHeight;
		this.setEffect(this.lastID);		
		this.swipeOut();
	} else {
	this.destroy();
	document.body.style.overflowX = this.bodyScroll;

	}
	
}

/**
* @private
*/
nitobi.spotlight.Spotlight.prototype.runFormHelper = function(infoArray) {
	var ff = this;
	var passOK = true;	
	if (this.waitForMouse) {
		if (!this.mouseDone)
			passOK = false;
	}
	if (passOK) {
		
	if (typeof(infoArray[0]) == 'string') {
		infoArray[0] = document.forms[infoArray[0].split(':')[0]][[infoArray[0].split(':')[1]]];
	}
		
	if (infoArray[4] == "TYPETEXT") {
		if (this.textIterator == 0) {	
			infoArray[0].focus();
		}
	
		this.textIterator++;
		
		if (this.textIterator < infoArray[2].length+1) {
			
			infoArray[0].value = infoArray[2].substring(0,this.textIterator);
			if (infoArray[0].onkeydown != null)
				infoArray[0].onkeydown.call();
			if (infoArray[0].onkeyup != null)
				infoArray[0].onkeyup.call();
			if (infoArray[0].onkeypress != null)				
				infoArray[0].onkeypress.call();
			var mydelay = 80;
			if (Math.round((Math.random()*9)+1) > 7) {
				mydelay = Math.round((Math.random()*250)+1);
			}
			setTimeout(function() {ff.runFormHelper(infoArray)}, mydelay);
		} else
		{
			infoArray[0].blur();
		
			setTimeout(function() {ff.play()}, this.stepArray[this.currentStep][1]);
		}
		
	}
	} else {
	
		setTimeout(function(){ff.runFormHelper(infoArray)}, 250);
	
	}
	
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.easeInEaseOut = function(Velocity, MinVelocity, Iterator) {

	//var resultVelocity = ((Math.sin(Iterator*3.141592-3.141592/2)+1)/2)*Velocity;
	var NewIterator = 0.5;
	if (Iterator > 0.7)
	{
		NewIterator = (Iterator-0.4) / 0.6;
	}
	if (Iterator < 0.15)
	{
		NewIterator = Iterator / 0.3;
	}	
	
	var resultVelocity = (Math.sin((parseFloat(NewIterator)*180)*(3.141592/180)))*Velocity;

	if (resultVelocity < MinVelocity)
		resultVelocity = MinVelocity;

	return resultVelocity;
}

/**
 * @private
 */
nitobi.spotlight.Spotlight.prototype.moveMouseXY = function(TargetX, TargetY) {
	this.MouseTargetX = TargetX;
	this.MouseTargetY = TargetY;	
	var fk = this;
	clearTimeout(this.mouseTimerObj);
	var xdif = (TargetX-this.MouseOrigX);
	var ydif = (TargetY-this.MouseOrigY);
	var cxdif = (TargetX-this.MouseX)+0.0000000001;
	var cydif = (TargetY-this.MouseY);		
	var totalDistance = Math.round(Math.sqrt((xdif*xdif)+(ydif*ydif)))+0.001;
	var currentDistance = Math.round(Math.sqrt((cxdif*cxdif)+(cydif*cydif)));
	var currentIterator = ((totalDistance-currentDistance)/totalDistance);

	if ((Math.abs(TargetX-this.MouseX) > 3) || (Math.abs(TargetY-this.MouseY) > 3)) {
	var mySlope = cydif/cxdif;
	var myVelocity = this.easeInEaseOut((totalDistance/80)*5.5, 0, currentIterator)+1;
	var incx = 0;
	var incy = 0;
	if (mySlope <= 0) {
		
		if (TargetX >= this.MouseX) {
			incx = 1;
			incy = mySlope;
		} else {
			incx = -1;
			incy = -mySlope;		
		}
	
	} else {
		if (TargetX >= this.MouseX) {
			incx = 1;
			incy = mySlope;
		} else {
			incx = -1;
			incy = -mySlope;		
		}	
	}
	
	if (Math.abs(mySlope) > 1.0) {
		var tmpx = Math.abs(incx);
		var tmpy = Math.abs(incy);
		var newx,newy;
		if (tmpx < tmpy){
			if (incx > 0) {
				newx = tmpx/tmpy;} else {newx = -tmpx/tmpy;}
			if (incy > 0) {
				newy = 1;} else {newy = -1;}
		} else {
			if (incy > 0) {
				newy = tmpy/tmpx;} else {newy = -tmpy/tmpx;}
			if (incx > 0) {
				newx = 1;} else {newx = -1;}
		}
		incx = newx;
		incy = newy;
	}
	this.MouseX += incx*myVelocity;
	this.MouseY += incy*myVelocity;

	var arcAmp = Math.sin((currentIterator+0.01)*3.1415927) * (this.MouseDistance/100)*13;
	var ofscc = nitobi.lang.Math.rotateCoords(0, -arcAmp, this.MouseAngle);
	this.MouseIcon.style.left = this.MouseX + this.Mouse_offX + ofscc.x + "px";
	this.MouseIcon.style.top = this.MouseY + this.Mouse_offY + ofscc.y + "px";	
	//this.MouseIcon.style.left = this.MouseX + this.Mouse_offX;
	//this.MouseIcon.style.top = this.MouseY + this.Mouse_offY;	
	this.mouseTimerObj = setTimeout(function(){fk.moveMouseXY(fk.MouseTargetX, fk.MouseTargetY)}, 20);
	} else {

		if (this.waitForMouse) {
			this.mouseDone = true;
		}
		if (this.stepArray[this.currentStep][3] == "EXECFORMHELPER")
			this.setMouseIcon('ntbType');

		if (this.stepArray[this.currentStep][2] == "MOVETOOBJECT")
			setTimeout(function(){fk.play();},1);
		
		if ((this.stepArray[this.currentStep][2] == "CLICKONOBJECT") || (this.stepArray[this.currentStep][2] == "CLICKONOBJECTCALCED"))
		{
			this.setMouseIcon('ntbMouseClick');
			if (this.stepArray[this.currentStep][2] == "CLICKONOBJECTCALCED") {
				//var mynewobj = $();
			} else {
				if (typeof(this.stepArray[this.currentStep][0]) == "string")
					try { var mynewobj = $(this.stepArray[this.currentStep][0]); } catch(e){}
				if (typeof(this.stepArray[this.currentStep][0]) == "function")
					try { var mynewobj = $(this.stepArray[this.currentStep][0].call()); } catch(e){}				
			}
			
			try{
				mynewobj.onmouseover.call();
			} catch(e) {}		
			try{
				mynewobj.onmousedown.call();
			} catch(e) {}
						
			setTimeout(function(){fk.setMouseIcon("ntbMouse"); try{mynewobj.onmouseup.call();} catch(e) {}	try{ if (mynewobj.tagName != 'IMG'){mynewobj.onclick.call();}} catch(e) { try {if (mynewobj.href != null) {if (mynewobj.href != '#'){window.location=mynewobj.href;}}}catch(e){}} try{	mynewobj.onmouseout.call();} catch(e){}},100);
			setTimeout(function() {fk.play()}, 100+this.stepArray[this.currentStep][1]);
			
		}
			
			
	}
	

}

/**
 * Creates a simulated text field entry.  
 * @param {Object|String} formField A reference to the form field OR a hash 'myformname:myfieldname'
 * @param {String} myAction The action to take on the input field.  Currently only the following are supported: "TYPETEXT"
 * @param {Number} delayAfter How long to wait after it is finished before advancing to the next step.
 * @param {String} myText The text to type.
 * @param {Boolean} setFocus True to have the mouse and lens move to the text field.
 */
nitobi.spotlight.Spotlight.prototype.createFormHelperStep = function(formField, myAction, delayAfter, myText, setFocus) {
	this.stepArray[this.stepArray.length] = Array(6);
	this.stepArray[this.stepArray.length-1][0] = formField;
	if (delayAfter != null) {this.stepArray[this.stepArray.length-1][1] = delayAfter;} else {this.stepArray[this.stepArray.length-1][1] = 100;}
	this.stepArray[this.stepArray.length-1][2] = myText;	
	this.stepArray[this.stepArray.length-1][3] = "EXECFORMHELPER";	
	this.stepArray[this.stepArray.length-1][4] = myAction.toUpperCase();
	if (setFocus != null)
	{this.stepArray[this.stepArray.length-1][5] = setFocus} else {this.stepArray[this.stepArray.length-1][5] = true}
}

/**
 * Creates a simulated mouse movement.  
 * @param {String} myAction The type of mouse movement to simulate.  The currently supported options
 * are "APPEARONOBJECT", "CLICKONOBJECT", or "MOVETOOBJECT"
 * @param {Object|String} myObj A reference to the form field OR a hash 'myformname:myfieldname'
 * @param {Number} delayAfter How long to wait after it is finished before advancing to the next step.
 */
nitobi.spotlight.Spotlight.prototype.createMouseStep = function(myAction, myObj, delayAfter) {
	this.stepArray[this.stepArray.length] = Array(6);
	this.stepArray[this.stepArray.length-1][0] = myObj;
	if (delayAfter != null) {this.stepArray[this.stepArray.length-1][1] = delayAfter;} else {this.stepArray[this.stepArray.length-1][1] = 100;}
	this.stepArray[this.stepArray.length-1][2] = myAction.toUpperCase();		
	this.stepArray[this.stepArray.length-1][3] = "MOUSEACTION";		
}

/**
 * Executes some javascript in sequence.
 * @param {String} myCode Some source code to execute or a function reference.
 * @param {Number} delayAfter How long to wait after it is finished before advancing to the next step.
 */
nitobi.spotlight.Spotlight.prototype.createCodeStep = function(myCode, delayAfter) {
	this.stepArray[this.stepArray.length] = Array(6);
	this.stepArray[this.stepArray.length-1][0] = myCode;
	if (delayAfter != null) {this.stepArray[this.stepArray.length-1][1] = delayAfter;} else {this.stepArray[this.stepArray.length-1][1] = 100;}
	this.stepArray[this.stepArray.length-1][3] = "EXECCODE";		
}

/**
 * Creates a Callout on an object.  
 * @param {String} elementid The ID of a DOM element to attach to. 
 * @param {String} [stepTitle] What to make the callout title.
 * @param {String} [stepBody] What to make the callout body text.
 */
nitobi.spotlight.Spotlight.prototype.createCalloutStep = function(elementid, stepTitle, stepBody) {
	this.stepArray[this.stepArray.length] = Array(6);
	this.stepArray[this.stepArray.length-1][0] = elementid;
	this.stepArray[this.stepArray.length-1][1] = stepTitle;	
	this.stepArray[this.stepArray.length-1][2] = stepBody;	
	this.stepArray[this.stepArray.length-1][3] = "OBJID";		
}

/**
 * Sends the lens focus to an object.  
 * @param {String} elementid The ID of a DOM element to attach to. 
 * @param {Int} delayAfter How long to wait after it is finished before advancing to the next step.
 */
nitobi.spotlight.Spotlight.prototype.createFocusStep = function(elementid, delayAfter) {
	this.stepArray[this.stepArray.length] = Array(6);
	this.stepArray[this.stepArray.length-1][0] = elementid;
	this.stepArray[this.stepArray.length-1][3] = "FOCUSID";		
	if (delayAfter != null) {this.stepArray[this.stepArray.length-1][1] = delayAfter;} else {this.stepArray[this.stepArray.length-1][1] = 100;}
}

/**
 * Begins playback of the Spotlight tour.  
 */
nitobi.spotlight.Spotlight.prototype.play = function() {
	var ds = this;

	if (nitobi.html.Css.isPrecaching) {
		nitobi.ui.setWaitScreen(true);
		nitobi.html.Css.onPrecached.subscribe(function(){nitobi.ui.setWaitScreen(false);ds.play();});
		return;
	}
	

	this.currentStep++;
	//this.waitForMouse = false;
	this.mouseDone = false;
	document.body.style.overflowX = 'hidden';
	if (this.currentStep == 0)
		this.initEffect();
	if (this.currentStep < this.stepArray.length) {

		if (typeof(this.currentStep) == 'undefined') {
			setTimeout(function() {ds.play()},1);
		}
		if ((this.stepArray[this.currentStep][3] == "OBJID") && (typeof(this.currentStep) != 'undefined')) {
			
			
			this.setEffect(this.stepArray[this.currentStep][0]);		

			this.callout = new nitobi.callout.Callout(this.stylesheet);
			var myt = this.stepArray[this.currentStep][1];

			this.callout.HaltAttributes = true;
			this.callout.setTitle(this.stepArray[this.currentStep][1]);
			this.callout.setBody(this.stepArray[this.currentStep][2]  + "<br><div id='calloutclose" + this.uid + "'  onclick='nitobi.spotlight.Spotlight.continueTour = true; $(\"close" + this.callout.uid + "\").onmouseup.call(); return false;' class=ntb" + this.stylesheet + "Callout_next_off onmouseover='this.className=\"ntb" + this.stylesheet + "Callout_next_on\"' onmouseout='this.className=\"ntb" + this.stylesheet + "Callout_next_off\"' onmousedown='this.className=\"ntb" + this.stylesheet + "Callout_next_off\"' onmouseup='this.className=\"ntb" + this.stylesheet + "Callout_next_on\"; return false;'></div>");
			//onclick='$(\"close" + this.callout.uid + "\").onmouseup.call(); return false;'
			
			this.callout.setOnDestroy(function() {if (nitobi.spotlight.Spotlight.continueTour ==true) {ds.play()} else {ds.destroy();} nitobi.spotlight.Spotlight.continueTour = false;});
			try {
			this.callout.setOnScreenUpdate(function() {nitobi.callout.Callout.permHeight = 0; nitobi.callout.Callout.permWidth = 0; ds.lastID = ''; try {ds.setEffect(ds.stepArray[ds.currentStep][0])}catch(e){}});}catch(e){}
			this.callout.setExpire(25000);
			this.onfindscroll = function() { 

				if (ds.stepArray[ds.currentStep][0] == null)
				{
					ds.callout.setCalloutDirection(0);
					var cc = nitobi.callout.Callout.getScrollPosition();
					ds.callout.moveTo(cc.scrollLeft+(cc.clientWidth/2),cc.scrollTop+(cc.clientHeight/2));					
					} else {
						ds.callout.attachToElement(ds.stepArray[ds.currentStep][0]);
						} 
						
						ds.callout.show(); };
						
			var fd = this.callout;
			//this.callout = null;
			this.setMouseIcon('ntbMouse');
			if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt($(this.stepArray[this.currentStep][0]));} else {var ObjCoords = nitobi.callout.Callout.getCoords($(this.stepArray[this.currentStep][0])); }			
				ObjCoords = this.lensMagnify(ObjCoords);
				this.updateScroller(ObjCoords.x,ObjCoords.y,ObjCoords.x+ObjCoords.w, ObjCoords.y+ObjCoords.h);

			if (this.useMouse) { this.waitForMouse = true; this.mouseDone = false;
				
				this.MouseOrigX = this.MouseX; this.MouseOrigY = this.MouseY;
				this.MouseAngle = nitobi.lang.Math.returnAngle(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.MouseDistance = nitobi.lang.Math.returnDistance(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.moveMouseXY(ObjCoords.x+(ObjCoords.w*0.8), ObjCoords.y+(ObjCoords.h/2));
				
			}
			this.callout.HaltAttributes = false; this.callout.assignAttributes();
		}
		
		if (this.stepArray[this.currentStep][3] == "FOCUSID") {
			if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt($(this.stepArray[this.currentStep][0]));} else {var ObjCoords = nitobi.callout.Callout.getCoords($(this.stepArray[this.currentStep][0])); }			
			this.setEffect(this.stepArray[this.currentStep][0]);
			ObjCoords = this.lensMagnify(ObjCoords);
			this.updateScroller(ObjCoords.x,ObjCoords.y,ObjCoords.x+ObjCoords.w, ObjCoords.y+ObjCoords.h);
			setTimeout(function() {ds.play()}, this.stepArray[this.currentStep][1]);			

			}		
		
		if (this.stepArray[this.currentStep][3] == "EXECCODE") {
			
			eval(this.stepArray[this.currentStep][0]);
			setTimeout(function() {ds.play()}, this.stepArray[this.currentStep][1]);
			
		}
		
		if (this.stepArray[this.currentStep][3] == "EXECFORMHELPER") {
			var targetId = '';
			if ((this.firefox) || (this.opera))
			{
				if (typeof(this.stepArray[this.currentStep][0]) == 'string') {
					this.stepArray[this.currentStep][0] = document.forms[this.stepArray[this.currentStep][0].split(':')[0]][[this.stepArray[this.currentStep][0].split(':')[1]]];
				}
				//PhotoDetails:field_titleBox
				if (this.stepArray[this.currentStep][0].id.length == 0)
					this.stepArray[this.currentStep][0].id = 'ff' + Math.random();
					if (this.stepArray[this.currentStep][5])
						this.setEffect(this.stepArray[this.currentStep][0].id);
					targetId = this.stepArray[this.currentStep][0].id;
			}
			if (this.ie)
			{ 
				if (this.stepArray[this.currentStep][5])
					this.setEffect(this.stepArray[this.currentStep][0].name);
				targetId = this.stepArray[this.currentStep][0].name;
			}
			
			if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt($(targetId));} else {var ObjCoords = nitobi.callout.Callout.getCoords($(targetId)); }		
			ObjCoords = this.lensMagnify(ObjCoords);
			this.updateScroller(ObjCoords.x,ObjCoords.y,ObjCoords.x+ObjCoords.w, ObjCoords.y+ObjCoords.h);
			
			if (this.useMouse) {

				this.MouseOrigX = this.MouseX; this.MouseOrigY = this.MouseY;
				this.MouseAngle = nitobi.lang.Math.returnAngle(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.MouseDistance = nitobi.lang.Math.returnDistance(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.moveMouseXY(ObjCoords.x+(ObjCoords.w*0.8), ObjCoords.y+(ObjCoords.h/2));
				this.waitForMouse = true;
				
			}				
			this.textIterator = -1;
			this.runFormHelper(this.stepArray[this.currentStep]);
			
		}
		if (this.stepArray[this.currentStep][3] == "MOUSEACTION") {

		nitobi.callout.Callout.rewriteId(this.stepArray[this.currentStep][0]);
			if (!this.useMouse) {
				this.useMouse = true;
				this.MouseIcon.style.display = 'block';				
			}
			
			if (this.stepArray[this.currentStep][2] == "APPEARONOBJECT") {	
				this.setMouseIcon('ntbMouse');
				if (typeof(this.stepArray[this.currentStep][0]) == "string")
					try { var mynewobj = $(this.stepArray[this.currentStep][0]); } catch(e){}
				if (typeof(this.stepArray[this.currentStep][0]) == "function")
					try { 
					var mynewobj = $(this.stepArray[this.currentStep][0].call());
					} catch(e){}
					
				if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt(mynewobj);} else {var ObjCoords = nitobi.callout.Callout.getCoords(mynewobj); }
				this.MouseX = ObjCoords.x+(ObjCoords.w*0.8);
				this.MouseY = ObjCoords.y+(ObjCoords.h/3);
				this.MouseOrigX = this.MouseX; this.MouseOrigY = this.MouseY;
				this.MouseIcon.style.left = this.MouseX + this.Mouse_offX;
				this.MouseIcon.style.top = this.MouseY + this.Mouse_offY;
				setTimeout(function() {ds.play()}, this.stepArray[this.currentStep][1]);
				
			}
			
			if (this.stepArray[this.currentStep][2] == "MOVETOOBJECT") {	
				this.setMouseIcon('ntbMouse');	
				
				if (typeof(this.stepArray[this.currentStep][0]) == "string")
					try { var mynewobj = $(this.stepArray[this.currentStep][0]); } catch(e){}
				if (typeof(this.stepArray[this.currentStep][0]) == "function")
					try { 
					var mynewobj = $(this.stepArray[this.currentStep][0].call());
					} catch(e){}
					
				if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt(mynewobj);} else {var ObjCoords = nitobi.callout.Callout.getCoords(mynewobj); }
				ObjCoords = this.lensMagnify(ObjCoords);
				this.updateScroller(ObjCoords.x,ObjCoords.y,ObjCoords.x+ObjCoords.w, ObjCoords.y+ObjCoords.h);
				this.MouseOrigX = this.MouseX; this.MouseOrigY = this.MouseY;
				this.MouseAngle = nitobi.lang.Math.returnAngle(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.MouseDistance = nitobi.lang.Math.returnDistance(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.moveMouseXY(ObjCoords.x+(ObjCoords.w*0.8), ObjCoords.y+(ObjCoords.h/3));				
				
			}			

			if ((this.stepArray[this.currentStep][2] == "CLICKONOBJECT") || (this.stepArray[this.currentStep][2] == "CLICKONOBJECTCALCED")) {	
				this.setMouseIcon('ntbMouse');

				
				if (typeof(this.stepArray[this.currentStep][0]) == "string")
					try { var mynewobj = $(this.stepArray[this.currentStep][0]); } catch(e){}
				if (typeof(this.stepArray[this.currentStep][0]) == "function")
					try { 
					var mynewobj = $(this.stepArray[this.currentStep][0].call());
					} catch(e){}					

				if (this.opera) {var ObjCoords = nitobi.callout.Callout.getCoordsAlt(mynewobj);} else {var ObjCoords = nitobi.callout.Callout.getCoords(mynewobj); }
				ObjCoords = this.lensMagnify(ObjCoords);
				this.updateScroller(ObjCoords.x,ObjCoords.y,ObjCoords.x+ObjCoords.w, ObjCoords.y+ObjCoords.h);
				this.MouseOrigX = this.MouseX; this.MouseOrigY = this.MouseY;
				this.MouseAngle = nitobi.lang.Math.returnAngle(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.MouseDistance = nitobi.lang.Math.returnDistance(this.MouseX,this.MouseY,ObjCoords.x+(ObjCoords.w*0.8),ObjCoords.y+(ObjCoords.h/2));
				this.moveMouseXY(ObjCoords.x+(ObjCoords.w*0.8), ObjCoords.y+(ObjCoords.h/3));				
				
			}						
			
		}		
		
	} else {

		this.onfindscroll = function(){ds.endEffect();}
		this.updateScroller(0,0,0,0);
		
		
		//this.callout.destroy();
		
		
	}
	
	
}

