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
 * @extends nitobi.form.Control
 */
nitobi.form.Calendar = function()
{
	nitobi.form.Calendar.baseConstructor.call(this);

	var div = nitobi.html.createElement('div');
	div.innerHTML = 
			"<table border='0' cellpadding='0' cellspacing='0' style='table-layout:fixed;' class='ntb-input-border'><tr><td>" +
			"<input id='ntb-datepicker-input' type='text' maxlength='255' style='width:100%;' />" +
			"</td><td class='ntb-datepicker-button'><a id='ntb-datepicker-button' href='#' onclick='return false;'></a></td></tr><tr><td colspan='2' style='width:1px;height:1px;position:relative;'><!-- --></td></tr><colgroup><col></col><col style='width:20px;'></col></colgroup></table>";

	this.control = div.getElementsByTagName('input')[0];

	var ph = this.placeholder = div.firstChild;
	ph.setAttribute("id","calendar_span");
	// TODO: these are needed for when we call align
	ph.style.top="-3000px";
	ph.style.left="-3000px";
	var pd = this.pickerDiv = nitobi.html.createElement('div',{},{position:"absolute"});
	this.isPickerVisible = false;
	nitobi.html.Css.addClass(pd, NTB_CSS_HIDE);
	ph.rows[1].cells[0].appendChild(pd);
}

nitobi.lang.extend(nitobi.form.Calendar, nitobi.form.Control);

/**
 * This is called each time the editor is ready to be used.
 */
nitobi.form.Calendar.prototype.initialize = function()
{
	var dp = this.datePicker = new nitobi.calendar.DatePicker(nitobi.component.getUniqueId());
	dp.setAttribute("theme", "flex");
	dp.setObject(new nitobi.calendar.Calendar());
	dp.onDateSelected.subscribe(this.handlePick,this);
	dp.setContainer(this.pickerDiv);

	var tc = this.control;
	var H = nitobi.html;
	H.attachEvent(tc, 'keydown', this.handleKey, this, false);
	H.attachEvent(tc, 'blur', this.deactivate, this, false);

	H.attachEvent(this.pickerDiv, 'mousedown', this.handleCalendarMouseDown, this);
	H.attachEvent(this.pickerDiv, 'mouseup', this.handleCalendarMouseUp, this);

	var a = this.placeholder.getElementsByTagName('a')[0];
	H.attachEvent(a, 'mousedown', this.handleClick, this);
	H.attachEvent(a, 'mouseup', this.handleMouseUp, this);
}

//cell, xModel, xData, initialKeyChar
/**
 * @private
 */
nitobi.form.Calendar.prototype.bind = function(owner, cell, initialKeyChar)
{	
	this.isPickerVisible = false;
	nitobi.html.Css.addClass(this.pickerDiv, NTB_CSS_HIDE);

	nitobi.form.Calendar.base.bind.apply(this, arguments);

	if(initialKeyChar != null && initialKeyChar != '')
		this.control.value = initialKeyChar;
	else
		this.control.value = cell.getValue();

	this.column = this.cell.getColumnObject();
	this.control.maxlength = this.column.getModel().getAttribute('MaxLength');
}

/**
 * Mimic is responsible for placing and sizing the editor control
 * to the desired position on the screen.
 */
nitobi.form.Calendar.prototype.mimic = function()
{
	this.align();

	// Now we need to adjust the editor width for padding/borders etc
	//nitobi.html.fitWidth(this.placeholder, this.control);

	// Hack-y fix.
	var tableWidth = this.placeholder.offsetWidth;
	var iconWidth = this.placeholder.rows[0].cells[1].offsetWidth;
	this.control.style.width = tableWidth - iconWidth - (document.compatMode == "BackCompat"?0:8) + "px";
	
	this.selectText();
}

/**
 * @private
 */
nitobi.form.Calendar.prototype.deactivate = function()
{
	if (nitobi.form.Calendar.base.deactivate.apply(this, arguments) == false) return;

	this.afterDeactivate(this.control.value);
}

/**
 * @private
 */
nitobi.form.Calendar.prototype.handleClick = function(evt)
{
	if (!this.isPickerVisible)
	{
		var dp = this.datePicker;
		dp.setSelectedDate(nitobi.base.DateMath.parseIso8601(this.control.value));
		dp.render();
		dp.getCalendar().getHtmlNode().style.width = "";
		nitobi.html.Css.setStyle(dp.getCalendar().getHtmlNode(), "position", "absolute");
	}

	this.ignoreBlur = true;
	//node.innerHTML = !this.isPickerVisible ? "&#9650;" : "&#9660;";
	nitobi.ui.Effects.setVisible(this.pickerDiv, !this.isPickerVisible, "none", this.setVisibleComplete, this);
};

/**
 * @private
 * Handles the <code>mouseup</code> event on the calendar button.
 */
nitobi.form.Calendar.prototype.handleMouseUp = function(evt) 
{
	this.control.focus()
	this.ignoreBlur = false;
}

/**
 * @private
 * Handles the <code>mousedown</code> event on the calendar.
 */
nitobi.form.Calendar.prototype.handleCalendarMouseDown = function(evt)
{
	this.ignoreBlur = true;
}

/**
 * @private
 * Handles the <code>mouseup</code> event on the calendar.
 */
nitobi.form.Calendar.prototype.handleCalendarMouseUp = function(evt)
{
	this.handleMouseUp(evt);
}

/**
  @ignore
 */
nitobi.form.Calendar.prototype.setVisibleComplete = function()
{
	this.isPickerVisible = !this.isPickerVisible;
};

nitobi.form.Calendar.prototype.handlePick = function()
{
	var date = this.datePicker.getSelectedDate();
	var fDate = nitobi.base.DateMath.toIso8601(date);
	this.control.value = fDate;
	this.datePicker.hide();
};

//	setEditCompleteHandler is implemented in the super class ....
/**
 * @private
 */
nitobi.form.Calendar.prototype.dispose = function()
{
	//this.control.onkeydown = null;
	nitobi.html.detachEvent(this.control, 'keydown', this.handleKey);
	//this.control.onblur = null;
	nitobi.html.detachEvent(this.control, 'blur', this.deactivate);
	var parent = this.placeholder.parentNode;
	parent.removeChild(this.placeholder);
	this.control = null;
	this.placeholder = null;
	this.owner = null;
	this.cell = null;
}
