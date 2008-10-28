/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.callout");

/**
 * Creates a Hint object.
 * @class The Hint component allows you to create a rich tooltip to attach to an element.  You can customize
 * how long the mouse must remain on the element before showing the Hint, how long to wait before hiding the hint,
 * and what theme to apply to the Hint.
 * @constructor
 * @example
 * var hint = new nitobi.callout.Hint(1500, 1000, "clean");
 * hint.addHint("idOfElementToAttachTo", "Hint Title", "Hint Body");
 * @param {Number} [timerLength] How long to wait before showing the callout (on a mouseover).
 * @param {Number} [expireTimeout] How long to wait getting rid of the tooltip.
 * @param {String} [stylesheet] The callout stylesheet to use for the hints (XP by default).
 */
nitobi.callout.Hint = function(timerLength, expireTimeout, stylesheet, showOnMouseDown)
{
	/**
	 * @private
	 */
	this.uid = Math.random().toString().replace('.', '').replace('0', '');
	this.ver = '0.9';
	/**
	 * @private
	 */
	this.activeHints = Array();
	/**
	 * @private
	 */
	this.timerObj = null;
	/**
	 * @private
	 */
	this.timerLength = 1000;
	if (timerLength != null) 
	{
		this.timerLength = timerLength
	}
	this.showOnMouseDown = showOnMouseDown != false;
	
	if (expireTimeout != null) 
	{
		this.expireTimeout = expireTimeout
	}
	this.stylesheet = 'xp';
	if (stylesheet != null)
	{
		this.stylesheet = stylesheet;
	}
}


/**
 * @private
 */
nitobi.callout.Hint.prototype.runHint = function(objID, hintTitle, hintText) 
{
	var ff = this;
	clearTimeout(this.timerObj);
	
	if (this.activeHints[objID] != true) 
	{
		this.timerObj = setTimeout(function(){ff.execHint(objID,hintTitle,hintText)}, this.timerLength);
	}

}
/**
 * @private
 */
nitobi.callout.Hint.prototype.execHint = function(objID, hintTitle, hintText) 
{
	var TimeoutLength = 0;
	var athis = this;
	if (this.activeHints[objID] != true) 
	{
		this.activeHints[objID] = true;
		var myNtbCalloutObj = new nitobi.callout.Callout(this.stylesheet); 
		myNtbCalloutObj.attachToElement(objID); 
		myNtbCalloutObj.setTitle(hintTitle); 
		myNtbCalloutObj.setBody(hintText); 
		if (this.expireTimeout != null) 
		{
			TimeoutLength = this.expireTimeout;
		} 
		else 
		{
			TimeoutLength = 3000 + (hintText.split(" ").length*220);
		}
		myNtbCalloutObj.setExpire(TimeoutLength);
		myNtbCalloutObj.ondestroy = function() {athis.activeHints[objID] = false;}
		myNtbCalloutObj.show();
		myNtbCalloutObj = null;
	}
}

/**
 * Attach a callout hint to a particular DOM element (identified by id).  You must specify
 * either a hintTitle, a hintText or both.
 * @param {String} objID The id of the DOM element.
 * @param {String} [hintTitle] The title of the tooltip.
 * @param {String} [hintText] The body of the tooltip.
 */
nitobi.callout.Hint.prototype.addHint = function(objID, hintTitle, hintText) 
{
	var abd = this;
	try 
	{
		document.getElementById(objID).onmouseover = function() { abd.runHint(this.id, hintTitle, hintText);};
		document.getElementById(objID).onmouseout = function() { clearTimeout(abd.timerObj);}
		if(this.showOnMouseDown)
			document.getElementById(objID).onmousedown = function() { abd.execHint(this.id, hintTitle, hintText);};
		document.getElementById(objID).id = objID;
	} 
	catch(e) 
	{
		for(var i=0; i<document.forms.length; i++)
		{
			for(var b=0; b<document.forms[i].elements.length; b++)
			{
				if (document.forms[i].elements[b].name.toUpperCase() == objID.toUpperCase()) 
				{
					document.forms[i].elements[b].onmouseover = function() { abd.runHint(this.id, hintTitle, hintText);};
					document.forms[i].elements[b].onmouseout = function() { clearTimeout(abd.timerObj);}
					if(this.showOnMouseDown)
						document.forms[i].elements[b].onmousedown = function() { abd.execHint(this.id, hintTitle, hintText);};
					document.forms[i].elements[b].id = objID;
				}
			
			}
		}
	}
}