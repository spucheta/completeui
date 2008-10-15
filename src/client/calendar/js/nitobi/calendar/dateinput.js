/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.calendar');

/**
 * Creates the input portion of the DatePicker.
 * @class The input portion of the DatePicker allows the user the input dates directly.
 * To render, you must first instantiate a {@link nitobi.calendar.DatePicker} object.
 * @constructor
 * @example
 * var dp = new nitobi.calendar.DatePicker("myUniqueId");
 * var input = new nitobi.calendar.DateInput();
 * dp.setTheme("flex");
 * dp.setObject(input);
 * dp.render;
 * @param {Node} [element] The ntb:dateinput node from the component declaration.  If you are creating the component
 * from script, this parameter is optional.
 * @extends nitobi.ui.Element
 * @see nitobi.calendar.DatePicker
 */
nitobi.calendar.DateInput = function(element) 
{
	nitobi.calendar.DateInput.baseConstructor.call(this, element);
	
	/**
	 * Fires when the input if blurred.
	 * @type nitobi.base.Event
	 */
	this.onBlur = new nitobi.base.Event();
	this.eventMap["blur"] = this.onBlur;
	
	/**
	 * Fires when the input if focussed.
	 * @type nitobi.base.Event
	 */
	this.onFocus = new nitobi.base.Event();
	this.eventMap["focus"] = this.onFocus;
	
	/**
	 * Used to attach/detach html events.
	 * @private
	 */
	this.htmlEvents = [];
	
	this.subscribeDeclarationEvents();
}

nitobi.lang.extend(nitobi.calendar.DateInput, nitobi.ui.Element);

nitobi.calendar.DateInput.profile = new nitobi.base.Profile("nitobi.calendar.DateInput",null,false,"ntb:dateinput");
nitobi.base.Registry.getInstance().register(nitobi.calendar.DateInput.profile);

/**
 * Attachs the necessary html events to the input.
 * @private
 */
nitobi.calendar.DateInput.prototype.attachEvents = function()
{
	var he = this.htmlEvents;
	he.push({type: "focus", handler: this.handleOnFocus});
	he.push({type: "blur", handler: this.handleOnBlur});
	he.push({type: "keydown", handler: this.handleOnKeyDown});
	nitobi.html.attachEvents(this.getHtmlNode("input"), he, this);
}

/**
 * Detaches all html events from the input element.
 * @private
 */
nitobi.calendar.DateInput.prototype.detachEvents = function()
{
	nitobi.html.detachEvents(this.getHtmlNode("input"), this.htmlEvents);
}

/**
 * Sets the text value of the input.  Setting the input value this way will not
 * select a date.  You must use {@link nitobi.calendar.DatePicker#setSelectedDate} to both
 * set the date and update the input field.
 * @param {String} value The value to set for the input.
 */
nitobi.calendar.DateInput.prototype.setValue = function(value)
{
	var inputNode = this.getHtmlNode("input");
	inputNode.value = value;
}

/**
 * Returns the value of the input.  If you want the value of the input as a date,
 * use {@link nitobi.calendar.DatePicker#getSelectedDate}
 * @type String
 */
nitobi.calendar.DateInput.prototype.getValue = function()
{
	var inputNode = this.getHtmlNode("input");
	return inputNode.value;
}

/**
 * @private
 */
nitobi.calendar.DateInput.prototype.handleOnFocus = function()
{
	var inputMask = this.getEditMask();
	var datePicker = this.getParentObject();
	var selectedDate = datePicker.getSelectedDate();
	if (selectedDate)
	{
		var value = datePicker.formatDate(selectedDate, inputMask);
		this.setValue(value);
		var datePicker = this.getParentObject();
		datePicker.blurInput = true;
	}
	this.onFocus.notify(new nitobi.ui.ElementEventArgs(this, this.onFocus));
}

/**
 * @private
 */
nitobi.calendar.DateInput.prototype.handleOnBlur = function()
{
	var datePicker = this.getParentObject();
	var calendar = datePicker.getCalendar();
	if (datePicker.blurInput)
	{
		var editMask = this.getEditMask();
		var newDate = this.getValue();
		newDate = datePicker.parseDate(newDate, editMask);
		if (datePicker.validate(newDate))
		{
			datePicker._setSelectedDate(newDate, true);
			if (calendar)
				calendar.hide();
		}
		else
		{
			if (calendar)
				calendar.clearHighlight();
			datePicker.clear();
			this.setInvalidStyle(true);
		}
	}
	this.onBlur.notify(new nitobi.ui.ElementEventArgs(this, this.onBlur));
}

/**
 * Just to allow the user to hit "enter" to set the new date.
 * @private
 */
nitobi.calendar.DateInput.prototype.handleOnKeyDown = function(event)
{
	var key = event.keyCode;
	if (key == 13)
	{
		this.getHtmlNode("input").blur();
	}
}

/**
 * Sets the input to the invalid style.
 * @param {Boolean} isInvalid true to set the input to the invalid style, false to return the input to the normal style.
 */
nitobi.calendar.DateInput.prototype.setInvalidStyle = function(isInvalid)
{
	var Css = nitobi.html.Css;
	var container = this.getHtmlNode("container");
	if (isInvalid)
		Css.swapClass(container, "ntb-inputcontainer", "ntb-invalid");
	else
		Css.swapClass(this.getHtmlNode("container"), "ntb-invalid", "ntb-inputcontainer");

	var bgColor = Css.getStyle(container, "backgroundColor");
	var input = this.getHtmlNode("input");
	Css.setStyle(input, "backgroundColor", bgColor);
}

/**
 * Return the edit mask for the DateInput.  The edit mask is applied to the value in the input field when
 * the input if focussed.  This is to make date entry easier for the user.  Will default to the value of the display mask.
 * @see #setEditMask
 * @type String
 */
nitobi.calendar.DateInput.prototype.getEditMask = function()
{
	return this.getAttribute("editmask", this.getDisplayMask());
}

/**
 * Sets the edit mask.
 * <br/>
 * Date masking syntax is as follows (for the sample date January 30, 2009):
 * 	<ul>
 * 		<li>yyyy - 2009</li>
 * 		<li>yy - 09</li>
 * 		<li>M - 1</li>
 * 		<li>MM - 01</li>
 * 		<li>MMM - January</li>
 *		<li>NNN - Jan</li>
 * 		<li>d - 30</li>
 * 		<li>dd - 30</li>
 * 		<li>EE - Friday</li>
 * 		<li>E - Fri</li>
 * 	</ul>
 * @param {String} mask The edit mask to set.
 */
nitobi.calendar.DateInput.prototype.setEditMask = function(mask)
{
	this.setAttribute("editmask", mask);
}

/**
 * Returns the display mask for the DateInput.  The display mask is used to make the date in the input
 * more human readable.  Defaults to "MMM dd yyyy", e.g. "June 24 2008".
 * @see #setDisplayMask
 * @type String
 */
nitobi.calendar.DateInput.prototype.getDisplayMask = function()
{
	return this.getAttribute("displaymask", "MMM dd yyyy");
}

/**
 * Sets the display mask.
 * <br/>
 * Date masking syntax is as follows (for the sample date January 30, 2009):
 * 	<ul>
 * 		<li>yyyy - 2009</li>
 * 		<li>yy - 09</li>
 * 		<li>M - 1</li>
 * 		<li>MM - 01</li>
 * 		<li>MMM - January</li>
 *		<li>NNN - Jan</li>
 * 		<li>d - 30</li>
 * 		<li>dd - 30</li>
 * 		<li>EE - Friday</li>
 * 		<li>E - Fri</li>
 * 	</ul>
 * @param {String} mask The display mask to set.
 */
nitobi.calendar.DateInput.prototype.setDisplayMask = function(mask)
{
	this.setAttribute("displaymask", mask);
}

/**
 * Returns true if the input editing is disabled, false otherwise.
 * @type Boolean
 */
nitobi.calendar.DateInput.prototype.isEditable = function()
{
	this.getBoolAttribute("editable", true);
}

/**
 * Sets the the Input to either be editable or non-ediatble.
 * @param {String} editable True to have the input be editable, false otherwise.
 */
nitobi.calendar.DateInput.prototype.setEditable = function(dis)
{
	this.setBoolAttribute("editable", dis);
	this.getHtmlNode("input").disabled = dis;
}

/**
 * Returns the width of the input.  This can be defined either in the declaration or via css.  
 * The appropriate css selector is <code>ntb-dateinput</code>
 * @type Number
 */
nitobi.calendar.DateInput.prototype.getWidth = function()
{
	this.getIntAttribute("width");
}

/**
 * Sets the width of the input.  You must call {@link nitobi.calendar.DatePicker#render} to have
 * the change be visible.
 * @example
 * var dp = nitobi.getComponent("myDatePicker");
 * var input = dp.getInput();
 * input.setWidth("150px");
 * @param {String} width The width of the Input in px.
 */
nitobi.calendar.DateInput.prototype.setWidth = function(width)
{
	this.setAttribute("width", width);
}