/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.form");

if (false)
{
	/**
	 * @namespace This namespace contains the various types of form controls used by {@link nitobi.grid.Grid}
	 * @constructor
	 */
	nitobi.form = function(){};
}

/**
 * Creates a form Control.
 * @class Base provides the basic interface expected for a Nitobi editor such as binding, hiding and handling key presses.
 * @constructor
 */
nitobi.form.Control = function()
{
	/**
	 * @private
	 */
	this.owner = null;

	/** 
	 * @private
	 * @type HTMLElement
	 * The HTML element that is the root of the editor.
	 */
	this.placeholder = null;

	var div = nitobi.html.createElement("div");
	div.innerHTML = 
			"<table border='0' cellpadding='0' cellspacing='0' class='ntb-input-border'><tr><td></td></tr></table>";
	var ph = this.placeholder = div.firstChild;

	/**
	 * @private
	 */
	this.cell = null;
	
	/**
	 * @private
	 */
	this.ignoreBlur = false;

	/**
	 * @private
	 */
	this.editCompleteHandler = function() {};

	// TODO: These need to be documented, tested
	this.onKeyUp = new nitobi.base.Event();

	this.onKeyDown = new nitobi.base.Event();

	this.onKeyPress = new nitobi.base.Event();

	this.onChange = new nitobi.base.Event();

	this.onCancel = new nitobi.base.Event();

	this.onTab = new nitobi.base.Event();

	this.onEnter = new nitobi.base.Event();
}

/**
 * This is called each time the editor is ready to be used.
 */
nitobi.form.Control.prototype.initialize = function()
{
}

/**
 * Mimic is responsible for placing and sizing the editor control
 * to the desired position on the screen.
 */
nitobi.form.Control.prototype.mimic = function() {};

/**
 * @private
 */
nitobi.form.Control.prototype.deactivate = function(evt)
{
	// check if we hav already blurred ... ther are two entry points for this from
	// the key down event and from the blur event - but of course only use one of them
	// TODO: add this to all editors.
	if (this.ignoreBlur)
		return false;
	this.ignoreBlur = true;
};

/**
 * 
 */
nitobi.form.Control.prototype.bind = function(owner, cell)
{
	this.owner = owner;
	this.cell = cell;
	this.ignoreBlur = false;
};

/**
 * Hides the form control.
 */
nitobi.form.Control.prototype.hide = function()
{
	this.placeholder.style.left="-2000px";
};

/**
 * Attaches the Control to a different parent DOM element. This is useful for
 * position of the control.
 * @private
 */
nitobi.form.Control.prototype.attachToParent = function(element)
{
	element.appendChild(this.placeholder);
}

/**
 * Reveals the control.
 */
nitobi.form.Control.prototype.show = function()
{
	this.placeholder.style.display='block';
};

/**
 * Places focus on the control.
 */
nitobi.form.Control.prototype.focus = function()
{
	this.control.focus();
	this.ignoreBlur = false;
}

/**
 * @private
 */
nitobi.form.Control.prototype.align = function()
{
	var oY = 1, oX = 1, oH = 1, oW = 1;

	if (nitobi.browser.MOZ) 
	{
		var scollSurface = this.owner.getScrollSurface();
		var activeRegion = this.owner.getActiveView().region;
		if (activeRegion == 3 || activeRegion == 4)
		{
			oY = scollSurface.scrollTop - nitobi.form.EDITOR_OFFSETY;
		}
		if (activeRegion == 1 || activeRegion == 4)
		{
			oX = scollSurface.scrollLeft - nitobi.form.EDITOR_OFFSETX;
		}
	}

	nitobi.drawing.align(this.placeholder, this.cell.getDomNode(), 0x11101000, oH, oW, -oY, -oX);	
}

/**
 * @private
 */
nitobi.form.Control.prototype.selectText = function() {

	this.focus();

	if(this.control && this.control.createTextRange) {
		var textRange = this.control.createTextRange();
		textRange.collapse(false);
		textRange.select();	
	}
}

/**
 * @private
 */
nitobi.form.Control.prototype.checkValidity = function(evt)
{
	// Dont think we need this.
	//nitobi.html.detachEvent(this.control, "blur", this.deactivate);
	var validationResult = this.deactivate(evt);

	// if it doesn't validate, clean up and return false
	if (validationResult == false){
		nitobi.html.cancelBubble(evt);
		return false;
	}
	return true;
}

/**
 * @private
 */
nitobi.form.Control.prototype.handleKey = function(evt)
{
	var k = evt.keyCode;

	if (this.onKeyDown.notify(evt) == false) return;

	var K = nitobi.form.Keys;

	var y=0;
	var x=0;
	if (k==K.UP){//up
		y=-1;
	}else if(k==K.DOWN){//down
		y=1;
	}else if(k==K.TAB){//tab
		x=1;
		if (evt.shiftKey) x=-1;

		// tab is a special case and the keyCode needs to be clear for nitobi.browser.IE.
		// in nitobi.browser.MOZ this causes the following error:
		//Error ``setting a property that has only a getter'' 
		if(nitobi.browser.IE)
			evt.keyCode="";
	}else if(k==K.ENTER){//enter
		y=1;
	}else{
		if (k==K.ESC){//esc
			// TODO: Figure this out once and for all!
			// nitobi.html.detachEvent(this.control, "blur", this.deactivate);
			this.ignoreBlur = true;
			this.hide();
			this.owner.focus();
			this.onCancel.notify(this);
		}
		return;
	}

	if (!this.checkValidity(evt)) return;

	this.owner.move(x,y);
	nitobi.html.cancelBubble(evt);

	//this.onEnter.notify(this);
	//this.onKeyPress.notify();
};

/**
 * @private
 */
nitobi.form.Control.prototype.handleKeyUp = function(evt)
{
	this.onKeyUp.notify(evt);
};

/**
 * @private
 */
nitobi.form.Control.prototype.handleKeyPress = function(evt)
{
	this.onKeyPress.notify(evt);
};

/**
 * @private
 */
nitobi.form.Control.prototype.handleChange = function(evt)
{
	this.onChange.notify(evt);
};

/**
 * @private
 */
nitobi.form.Control.prototype.setEditCompleteHandler = function(method)
{
	this.editCompleteHandler = method;
};

/**
 * @private
 * This is only for declaration use. Any subscription through this should have a name like "OnSomethingEvent".
 * Then this.Something becomes the GUID of the event for unsubscribing if need by.
 */
nitobi.form.Control.prototype.eSET=function(name, args)
{
	var oFunction = args[0];
	var funcRef = oFunction;

	var subName = name.substr(2);
	subName = subName.substr(0,subName.length-5);

	if (typeof(oFunction) == 'string')
	{
		funcRef = function() {return nitobi.event.evaluate(oFunction,arguments[0])};
	}
	
	// Get rid of the subscribed function if it is already there ... this is only for declarations
	if (this[subName] != null)
	{
		this[name].unSubscribe(this[subName]);
	}

	// name should be OnCellClickEvent but we just expect CellClick for firing
	var guid = this[name].subscribe(funcRef);
	this.jSET(subName, [guid]);
	return guid;
}

/**
 * @private
 */
nitobi.form.Control.prototype.afterDeactivate = function(text, value) {
	// Accept either one or two params, if one param then text and value are assumed the same.
	value = value || text;
	if (this.editCompleteHandler != null) {
		var eventArgs = new nitobi.grid.EditCompleteEventArgs(this, text, value, this.cell);
		var result =  this.editCompleteHandler.call(this.owner, eventArgs);
		if(!result){
			this.ignoreBlur = false;
		}
		return result;
	}
}

/**
 * @private
 */
nitobi.form.Control.prototype.jSET= function(name, val)
{
	this[name] = val[0];
}

/**
 * @ignore
 */
nitobi.form.Control.prototype.dispose = function()
{
	for (var item in this)
	{
	}
};