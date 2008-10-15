/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class
 * @constructor
 * @extends nitobi.form.Text
 */
nitobi.form.TextArea = function()
{
	nitobi.form.TextArea.baseConstructor.call(this);

	var div = nitobi.html.createElement('div');
	div.innerHTML = 
			"<table border='0' cellpadding='0' cellspacing='0' class='ntb-input-border'><tr><td></td></table>";

	var ph = this.placeholder = div.firstChild;
	ph.style.top="-3000px";
	ph.style.left="-3000px";

	// We need this initial width so that we can fit the textarea to it's parent node width
	this.control = nitobi.html.createElement('textarea', {}, {width:"100px"});
}

nitobi.lang.extend(nitobi.form.TextArea, nitobi.form.Text);

/**
 * @private
 */
nitobi.form.TextArea.prototype.initialize = function()
{
	this.placeholder.rows[0].cells[0].appendChild(this.control);
	document.body.appendChild(this.placeholder);

	nitobi.html.attachEvents(this.control, this.events, this);
}

/**
 * @private
 */
nitobi.form.TextArea.prototype.mimic = function()
{
	nitobi.form.TextArea.base.mimic.call(this);
	// TODO: this needs to be parameterized...
	var phs = this.placeholder.style;
}

/**
 * @private
 */
nitobi.form.TextArea.prototype.handleKey = function(evt)
{
	var k = evt.keyCode;

	// Textarea needs to support arrow keys to navigate through the text
	if (k==40 || k==38 || k==37 || k==39 || (k==13 && evt.shiftKey)) {
		//not sure why we were doing this, but it causes the event to get fired twice
		/*
		if (k==13 && evt.shiftKey) {
			if (nitobi.browser.MOZ) // We are using Mozilla and the keyCode is read-only
				nitobi.html.createEvent("KeyEvents", "keypress", evt, {'keyCode':13, 'charCode':0});
			if(this.control.createTextRange)
			{
				// Make sure the object has the focus, otherwise you select the whole page.
				this.control.focus();
				var textarea = document.selection.createRange(); //.duplicate();
				textarea.text = "\n";
				textarea.collapse(false);
				textarea.select();
			}
		}
		*/
	}
	else { // If it was not a special textarea key then just call the parent handleKey method
		nitobi.form.TextArea.base.handleKey.call(this, evt);
	}
};


//	setEditCompleteHandler is implemented in the super class ....
//	dispose is in the base class