/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * Text is a text editor class that is implemented using an HTML input tag
 * @class
 * @constructor
 */
nitobi.form.Text = function()
{
	nitobi.form.Text.baseConstructor.call(this);

	var ph = this.placeholder;
	ph.setAttribute("id","text_span");
	// TODO: this is required for proper aligment of the editor
	ph.style.top="0px";
	ph.style.left="-5000px";

	// width is required to be able to fit the textbox to its parent width the first time
	var tc = this.control = nitobi.html.createElement('input', {"id":"ntb-textbox"}, {width:"100px"});
	//align
	//maxlength
	tc.setAttribute("maxlength", 255);

	this.events = [{type:"keydown", handler:this.handleKey},
					{type:"keyup", handler:this.handleKeyUp},
					{type:"keypress", handler:this.handleKeyPress},
					{type:"change", handler:this.handleChange},
					{type:"blur", handler:this.deactivate}];
}

nitobi.lang.extend(nitobi.form.Text, nitobi.form.Control);

/**
 * @private
 */
nitobi.form.Text.prototype.initialize = function()
{
	// The text control needs to be attached here such that the password editor can change the input field type in the constructor
	var container = this.placeholder.rows[0].cells[0];
	container.appendChild(this.control);
	nitobi.html.attachEvents(this.control, this.events, this);
}

//cell, xModel, xData, initialKeyChar
/**
 * @private
 */
nitobi.form.Text.prototype.bind = function(owner, cell, initialKeyChar)
{	
	nitobi.form.Text.base.bind.apply(this, arguments);

	// All these events are complicated in the different browsers ... understand this better when we have time.
	if(initialKeyChar != null && initialKeyChar != '') {
		this.control.value = initialKeyChar;
	} else {
		this.control.value = cell.getValue();
	}

	var columnModel = this.cell.getColumnObject().getModel();

	this.eSET("onKeyPress", [columnModel.getAttribute('OnKeyPressEvent')]);
	this.eSET("onKeyDown", [columnModel.getAttribute('OnKeyDownEvent')]);
	this.eSET("onKeyUp", [columnModel.getAttribute('OnKeyUpEvent')]);
	this.eSET("onChange", [columnModel.getAttribute('OnChangeEvent')]);

	this.control.setAttribute("maxlength", columnModel.getAttribute('MaxLength'));

	// Add the column specific styles to the editor
	// Remember to remove it when we deactivate
	nitobi.html.Css.addClass(this.control, "ntb-column-data"+this.owner.uid+"_"+(this.cell.getColumn()+1));
}

/**
 * Mimic is responsible for placing and sizing the editor control
 * to the desired position on the screen.
 */
nitobi.form.Text.prototype.mimic = function()
{
	this.align();

	// Now we need to adjust the editor width for padding / borders etc
	nitobi.html.fitWidth(this.placeholder, this.control);

	this.selectText();
}

/**
 * Sets the focus to the editor.
 */
nitobi.form.Text.prototype.focus = function() {
	this.control.focus();
}

/**
 * @private
 */
nitobi.form.Text.prototype.deactivate = function(evt)
{
	if (nitobi.form.Text.base.deactivate.apply(this, arguments) == false) return;

	nitobi.html.Css.removeClass(this.control, "ntb-column-data"+this.owner.uid+"_"+(this.cell.getColumn()+1));

	return this.afterDeactivate(this.control.value);
}

//	setEditCompleteHandler is implemented in the super class ....
/**
 * @private
 */
nitobi.form.Text.prototype.dispose = function()
{
	nitobi.html.detachEvents(this.control, this.events);
	var parent = this.placeholder.parentNode;
	parent.removeChild(this.placeholder);
	this.control = null;
	this.owner = null;
	this.cell = null;
}




