/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// TODO: We could also take an approach that instead takes the root element of the composite control 
// and attaches a blur and mousedown event and tracks based on just those ... that would depend on events
// being allowed to bubble etc...

/**
 * @class
 * @constructor
 */
nitobi.form.IBlurable = function(elems, blurFunc) {
	// in the onmousedown handler we set a boolean that says we are bluring 
	// some sub component in favour of another sub component - so dont blur the entire component
	/**
	 * This is for tracking if the blur is a result of the user bluring the field by
	 * clicking on some other element or by clicking on another element that is part of the control.
	 * @type Boolean
	 * @private
	 */
	this.selfBlur = false;

	/**
	 * Contains the list of elements that make up the composite control.
	 * @private
	 */
	this.elements = elems;

	// for each element add an onmousedown handler, blur, focus, and mouseup handler
	var H = nitobi.html;
	for (var i=0; i<this.elements.length; i++) {
		var e = this.elements[i];
		H.attachEvent(e, "mousedown", this.handleMouseDown, this);
		H.attachEvent(e, "blur", this.handleBlur, this);
		H.attachEvent(e, "focus", this.handleFocus, this);
		H.attachEvent(e, "mouseup", this.handleMouseUp, this);
	}

	/**
	 * A pointer to the method that is be executed when the composite control is completely blurred.
	 * @private
	 */ 
	this.blurFunc = blurFunc;

	/**
	 * Track the last element that had focus so that we can handle the case when 
	 * the user clicks on the already focused element properly in handleMouseDown
	 * @private
	 */
	this.lastFocus = null;
}

/**
 * Removes the blurable interface from a control
 * TODO: should this just be dispose?
 * @private
 */
nitobi.form.IBlurable.prototype.removeBlurable = function() {
	for (var i=0; i<elems.length; i++) {
		nitobi.html.detachEvent(elems[i], "mousedown", this.handleMouseDown, this);
	}
}

/**
 * Fired when any element that is part of the composite control fires the mousedown event.
 * @private
 */
nitobi.form.IBlurable.prototype.handleMouseDown = function(evt) {
	// Compare the last focused event to the newly focused event.
	// TODO: there is still some bug here ...
	if (this.lastFocus != evt.srcElement) {
		this.selfBlur = true;
	} else {
		this.selfBlur = false;
	}
	this.lastFocus = evt.srcElement;
}

/**
 * Fired when any element that is part of the composite control fires the blur event.
 * @private
 */
nitobi.form.IBlurable.prototype.handleBlur = function(evt) {
	// check if we are able to blur and if so then call the blurFunc
	if (!this.selfBlur)
		this.blurFunc(evt);
	this.selfBlur = false;
}

/**
 * Fired when any element that is part of the composite control fires the focus event.
 * @private
 */
nitobi.form.IBlurable.prototype.handleFocus = function() {
	this.selfBlur = false;
}

/**
 * Fired when any element that is part of the composite control fires the mouseup event.
 * @private
 */
nitobi.form.IBlurable.prototype.handleMouseUp = function() {
	this.selfBlur = false;
}