/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.calendar');

if (false)
{
	/**
	 * @namespace namespace for classes that make up the Nitobi Calendar component.
	 * @constructor
	 */
	nitobi.calendar = {};
}

/**
 * Normally, you'd instantiate it 
 * using the declaration tag (ntb:datepicker), but you can optionally instantiate it through javascript.
 * To properly initialize the the component, you need to also instantiate a {@link nitobi.calendar.Calendar} object
 * and/or a {@link nitobi.calendar.DateInput} object and reference either of these in the instantiated DatePicker object.
 * @class The DatePicker class is the base class for the Nitobi Calendar component.  
 * @constructor
 * @param {String} [id] The id of the control's declaration, or an xml node that describes the Calendar. 
 * If you do not specify an id, one is created for you.
 * @example
 * var dp = new nitobi.calendar.DatePicker("someUniqueId");
 * var cal = new nitobi.calendar.Calendar();
 * dp.setObject(cal);
 * dp.setTheme("flex");
 * dp.setContainer(document.getElementById("id_of_container_to_render_in"));
 * dp.render();
 * @extends nitobi.ui.Element
 */
nitobi.calendar.DatePicker = function(id) 
{
	nitobi.calendar.DatePicker.baseConstructor.call(this, id);
	
	this.renderer.setTemplate(nitobi.calendar.datePickerTemplate);
	
	/**
	 * Used to properly handle blurring on the input.
	 * @private
	 */
	this.blurInput = true;
	
	/**
	 * Fires when a date is selected.
	 * @type nitobi.base.Event
	 */
	this.onDateSelected = new nitobi.base.Event();
	this.eventMap["dateselected"] = this.onDateSelected;
	
	/**
	 * Fires when the user attempts to set an invalid date as the selected date.
	 * @type nitobi.base.Event
	 */
	this.onSetInvalidDate = new nitobi.base.Event();
	this.eventMap["setinvaliddate"] = this.onSetInvalidDate;
	
	/**
	 * Fires when the user attempts to set a date that is specified as disabled as the selected date.
	 * @type nitobi.base.Event
	 */
	this.onSetDisabledDate = new nitobi.base.Event();
	this.eventMap["setdisableddate"] = this.onSetDisabledDate;
	
	/**
	 * Fires when the user attempts to set a date beyond the range defined by the mindate/maxdate attributes
	 * as the selected date.
	 * @type nitobi.base.Event
	 */
	this.onSetOutOfRangeDate = new nitobi.base.Event();
	this.eventMap["setoutofrangedate"] = this.onSetOutOfRangeDate;
	
	/**
	 * Fires when the user selects a date with event information.
	 * @type nitobi.base.Event
	 */
	this.onEventDateSelected = new nitobi.base.Event();
	this.eventMap["eventdateselected"] = this.onEventDateSelected;

	/**
	 * The Events Manager encapsulates special days (i.e. days with events or disabled days).
	 * @private
	 */
	this.eventsManager = new nitobi.calendar.EventsManager(this.getEventsUrl());
	this.eventsManager.onDataReady.subscribe(this.renderChildren, this);
	
	var selectedDate = this.getSelectedDate();
	// If the selected date is within range, and is a valid date, we can use it, otherwise we need to clear
	// it out and set the mindate and startdate properly
	if (selectedDate && !this.isOutOfRange(selectedDate) && !nitobi.base.DateMath.invalid(selectedDate))
	{
		this.setStartDate(nitobi.base.DateMath.getMonthStart(selectedDate));
	}
	else
	{
		this.setDateAttribute("selecteddate", null);
		var minDate = this.getMinDate();
		var start;
		if (minDate)
			start = minDate;
		else
			start = new Date();
		this.setStartDate(nitobi.base.DateMath.getMonthStart(start));
	}
	this.subscribeDeclarationEvents();
};

nitobi.lang.extend(nitobi.calendar.DatePicker, nitobi.ui.Element);

nitobi.base.Registry.getInstance().register(
		new nitobi.base.Profile("nitobi.calendar.DatePicker",null,false,"ntb:datepicker")
);

/**
 * Render the calendar into the container specified either by the location of the declaration, or
 * by {@link nitobi.calendar.Datepicker#setContainer}. Call render after changing the currently
 * selected date with {@link nitobi.calendar.DatePicker#setDate}.
 */
nitobi.calendar.DatePicker.prototype.render = function()
{
	var input = this.getInput();
	if (input)
		input.detachEvents();
	nitobi.calendar.DatePicker.base.render.call(this);
	if (input)
		input.attachEvents();
	if (nitobi.browser.IE && input)
	{
		// Total hack.  IE renders two extra pixels in the height, AS IF FROM NOWHERE.
		var inputNode = input.getHtmlNode("input");
		var height = nitobi.html.Css.getStyle(inputNode, "height");
		nitobi.html.Css.setStyle(inputNode, "height", parseInt(height) - 2 + "px");
	}
	if (this.eventsManager)
		this.eventsManager.getFromServer();
	else
		this.renderChildren();
};

/**
 * Finishes the render of the control.  If the calendar is databound, we delay 
 * rendering the calendar until after we get a response from the server.
 * @private
 */
nitobi.calendar.DatePicker.prototype.renderChildren = function()
{
	var cal = this.getCalendar();
	var input = this.getInput();
	if (cal)
	{
		cal.render();
		if (!input)
		{
			// If there is no input, we need to set the width explicitly on the calendar container because it is no
			// longer absolutely positioned.
			var C = nitobi.html.Css;
			var calNode = cal.getHtmlNode();
			var body = cal.getHtmlNode("body");
			C.swapClass(calNode, "nitobi-hide", NTB_CSS_SMALL);
			cal.getHtmlNode().style.width = body.offsetWidth + "px";
			C.removeClass(calNode, NTB_CSS_SMALL);
		}
	}
	
	if (this.getSelectedDate() && input)
	{
		input.setValue(this.formatDate(this.getSelectedDate(), input.getDisplayMask()));
	}
	if (this.getSelectedDate())
	{
		var hidden = this.getHtmlNode('value');
		if (hidden) hidden.value = this.formatDate(this.getSelectedDate(), this.getSubmitMask());
	}
	
	this.enableButton();
}

/**
 * Returns the Calendar of the DatePicker component.
 * @example
 * var dp = nitobi.getComponent("myDatePicker");
 * var cal = dp.getCalendar();
 * cal.show();
 * @type nitobi.calendar.Calendar
 */
nitobi.calendar.DatePicker.prototype.getCalendar = function()
{
	return this.getObject(nitobi.calendar.Calendar.profile);
}

/**
 * Returns the Input of the DatePicker component.
 * @example
 * var dp = nitobi.getComponent("myDatePicker");
 * var input = dp.getInput();
 * input.setEditable(false);
 * @type nitobi.calendar.DateInput
 */
nitobi.calendar.DatePicker.prototype.getInput = function()
{
	return this.getObject(nitobi.calendar.DateInput.profile);
}

/**
 * Returns the selected date.
 * @type Date
 */
nitobi.calendar.DatePicker.prototype.getSelectedDate = function()
{
	return this.getDateAttr("selecteddate");	
}

/**
 * Gets the date value from an attribute and parses the date if need be.
 * @param {String} attr The name of the attribute
 * @type Date
 * @private
 */
nitobi.calendar.DatePicker.prototype.getDateAttr = function(attr)
{
	var dateAttr = this.getAttribute(attr, null);
	if (dateAttr)
	{
		if (typeof(dateAttr) == "string")
			return this.parseLanguage(dateAttr);
		else
			return new Date(dateAttr);
	}
	return null;
}

/**
 * Set the selected date. Call {@link nitobi.calendar.Calendar#render} for the visible calendar to be updated.
 * @param {Date} date The new selected date - <code>date</code> can be also be any string that <code>Date.parse()</code> accepts
 */
nitobi.calendar.DatePicker.prototype.setSelectedDate = function(date)
{
	// TODO: Should parse the date first...
	if (typeof(date) != "object")
		date = new Date(date);
	if (this.validate(date))
		this._setSelectedDate(date);
}

/**
 * Sets the selected date.
 * @param {Date} date The date to set as the selected date.
 * @type Boolean
 * @private
 */
nitobi.calendar.DatePicker.prototype._setSelectedDate = function(date, forceRender)
{
	this.setDateAttribute("selecteddate", date); 
	
	var hidden = this.getHtmlNode('value');
	if (hidden) hidden.value = this.formatDate(date, this.getSubmitMask());
	
	var input = this.getInput();
	if (input)
	{
		var inputMask = input.getDisplayMask();
		var inputValue = this.formatDate(date, inputMask);
		input.setValue(inputValue);
		input.setInvalidStyle(false);
	}
	
	// Set the highlighted date for the calendar now
	var calendar = this.getCalendar();
	if (calendar)
	{
		calendar.clearHighlight(date);
		var dm = nitobi.base.DateMath;
		var startDate = dm.getMonthStart(this.getStartDate());
		var months = calendar.getMonthColumns() * calendar.getMonthRows() - 1;
		var endDate = dm.getMonthEnd(dm.add(dm.clone(startDate), 'm', months));
		if (dm.between(date, startDate, endDate))
		{
			calendar.highlight(date);
		}
		if (forceRender)
		{
			this.setStartDate(dm.getMonthStart(dm.clone(date)));
			calendar.render();
		}
	}
	
	var eventsManager = this.getEventsManager();
	if (eventsManager.isEvent(date))
	{
		var startDate = eventsManager.eventsCache[date.valueOf()];
		var eventInfo = this.eventsManager.getEventInfo(startDate);
		this.onEventDateSelected.notify({events: eventInfo});
	}
	this.onDateSelected.notify(new nitobi.ui.ElementEventArgs(this, this.onDateSelected));
}

/**
 * Validates the date and fires the appropriate events if it isn't valid.  Returns true if the date is valid,
 * false otherwise.
 * @param {Date} date The date to validate against.
 * @type Boolean
 * @private
 */
nitobi.calendar.DatePicker.prototype.validate = function(newDate)
{
	var E = nitobi.ui.ElementEventArgs;
	if (nitobi.base.DateMath.invalid(newDate))
	{
		this.onSetInvalidDate.notify(new E(this, this.onSetInvalidDate));
		return false;
	}
	if (this.isOutOfRange(newDate))
	{
		this.onSetOutOfRangeDate.notify(new E(this, this.onSetOutOfRangeDate));
		return false;
	}
	if (this.isDisabled(newDate))
	{
		this.onSetDisabledDate.notify(new E(this, this.onSetDisabledDate));
		return false;
	}
	return true;
}

/**
 * Returns true if the given date is disabled, false otherwise.  Disabled dates are defined by the data
 * returned from the eventsurl.
 * @see #getEventsUrl
 * @param {Date} date The date to check.
 */
nitobi.calendar.DatePicker.prototype.isDisabled = function(date)
{
	return this.getEventsManager().isDisabled(date);
}

/**
 * Disables the calendar toggling button.
 */
nitobi.calendar.DatePicker.prototype.disableButton = function()
{
	var button = this.getHtmlNode("button");
	var cal = this.getCalendar();
	if (button)
	{
		nitobi.html.Css.swapClass(button, "ntb-calendar-button", "ntb-calendar-button-disabled");
		nitobi.html.detachEvent(button, "click", cal.handleToggleClick, cal);
	}
}

/**
 * Enables the calendar toggling button.
 */
nitobi.calendar.DatePicker.prototype.enableButton = function()
{
	var button = this.getHtmlNode("button");
	var cal = this.getCalendar();
	if (button)
	{
		nitobi.html.Css.swapClass(button, "ntb-calendar-button-disabled", "ntb-calendar-button");
		nitobi.html.attachEvent(button, "click", cal.handleToggleClick, cal);
	}
}

/**
 * Returns true if the given date is within the range specified by the mindate and maxdate attributes.
 * @param {Date} date The date to check.
 */
nitobi.calendar.DatePicker.prototype.isOutOfRange = function(date)
{
	var dm = nitobi.base.DateMath;
	var minDate = this.getMinDate();
	var maxDate = this.getMaxDate();
	var isOutOfRange = false;
	if (minDate && maxDate) isOutOfRange = !dm.between(date, minDate, maxDate);
	else if (minDate && maxDate == null) isOutOfRange = dm.before(date, minDate);
	else if (minDate == null && maxDate) isOutOfRange = dm.after(date, maxDate);
	return isOutOfRange;
}

/**
 * Clears the DatePicker.  After clearing, the DatePicker no longer has a selected date and the
 * hidden input is cleared.
 */
nitobi.calendar.DatePicker.prototype.clear = function()
{
	// Clear value from hidden input
	var hidden = this.getHtmlNode('value')
	if (hidden) hidden.value = "";
	
	// Clear selected date from xml
	this.setDateAttribute("selecteddate", null);
}

/**
 * Returns the theme used by the DatePicker.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getTheme = function()
{
	return this.getAttribute("theme", "");
}

/**
 * Returns the mask used by the DatePicker to format dates for the hidden field available for use in a form.  If you include
 * the DatePicker in a form, you can optionally use this hidden input as the actual submit value (as opposed to the value that is
 * displayed in the visible input field).  The hidden input has the same name as the id given to the DatePicker component.
 * @see #setSubmitMask
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getSubmitMask = function()
{
	return this.getAttribute("submitmask", "yyyy-MM-dd");
}

/**
 * Sets the submit mask for the DatePicker.
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
 * @param {String} mask The mask to apply to the hidden field.
 */
nitobi.calendar.DatePicker.prototype.setSubmitMask = function(mask)
{
	this.setAttribute("submitmask", mask);
}

/**
 * Sets the startdate attribute.
 * @private
 */
nitobi.calendar.DatePicker.prototype.getStartDate = function()
{
	return this.getDateAttribute("startdate");
}

/**
 * @private
 */
nitobi.calendar.DatePicker.prototype.setStartDate = function(date)
{
	this.setDateAttribute("startdate", date);
}

/**
 * Returns the eventsurl from the DatePicker.  The eventsurl defines the server location where the DatePicker
 * can get information on events and disabled dates.  When the component loads initially, it fetches data from the eventsurl
 * and stores it in a {@link nitobi.calendar.EventsManager}.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getEventsUrl = function()
{
	return this.getAttribute("eventsurl", "");
}

/**
 * Sets the eventsurl.  Call render to rebind the DatePicker to the new eventsurl.
 * @param {String} url The url to set as the eventsurl.
 */
nitobi.calendar.DatePicker.prototype.setEventsUrl = function(url)
{
	this.setAttribute("eventsurl", url);
}

/**
 * Returns the EventsManager for the DatePicker.  The events manager is responsible for handling
 * dates that are defined as disabled or defined to have event information associated with it.  Defining
 * which dates are disabled or special is done through the eventsurl defined as an attribute on the &lt;ntb:datepicker&gt; tag.
 * @see #getEventsUrl
 * @type nitobi.calendar.EventsManager
 */
nitobi.calendar.DatePicker.prototype.getEventsManager = function()
{
	return this.eventsManager;
}

/**
 * Returns true if the shimenabled attribute is set to true AND if the browser is FF 2 on Mac or IE 6.
 * The shim is used to smoothly show/hide the calendar.
 * @type Boolean
 */
nitobi.calendar.DatePicker.prototype.isShimEnabled = function()
{
	return this.getBoolAttribute("shimenabled", false);
}

/**
 * Returns the earliest selectable date for the DatePicker.
 * @type Date
 */
nitobi.calendar.DatePicker.prototype.getMinDate = function()
{
	return this.getDateAttr("mindate");
}

/**
 * Sets the earliest selectable date in the DatePicker.  
 * @param {String} minDate The date to set as the min date.  Some natural language dates are acceptable:
 * yesterday, today, tomorrow, lastweek, nextweek, lastmonth, nextmonth, lastyear, and nextyear.
 */
nitobi.calendar.DatePicker.prototype.setMinDate = function(minDate)
{
	this.setAttribute("mindate", minDate);
}

/**
 * Returns the latest selected date in the DatePicker.
 * @type Date
 */
nitobi.calendar.DatePicker.prototype.getMaxDate = function()
{
	return this.getDateAttr("maxdate");
}

/**
 * Sets the latest selectable date in the DatePicker.
 * @param {String} maxDate The date to set as the max date.  Some natural language dates are acceptable:
 * yesterday, today, tomorrow, lastweek, nextweek, lastmonth, nextmonth, lastyear, and nextyear.
 */
nitobi.calendar.DatePicker.prototype.setMaxDate = function(maxDate)
{
	 this.setAttribute("maxdate", maxDate);
}

/**
 * Parses a natural language expression and returns a the corresponding date.
 * Allowable expressions include: yesterday, today, tomorrow, lastweek, nextweek, lastmonth, nextmonth, lastyear, and nextyear.
 * @type Date
 * @private
 */
nitobi.calendar.DatePicker.prototype.parseLanguage = function(date)
{
	var dm = nitobi.base.DateMath;
	var parsedDate = Date.parse(date);
	if (parsedDate && typeof(parsedDate) == "object" && !isNaN(parsedDate) && !dm.invalid(parsedDate))
	{
		// Then there is some sort of date lib included in the page.
		return parsedDate;
	}
	if (date == "" || date == null)
		return null;

	date = date.toLowerCase();
	var today = dm.resetTime(new Date());
	switch (date)
	{
		case "today":
			date = today;
			break;
		case "tomorrow":
			date = dm.add(today, 'd', 1);
			break;
		case "yesterday":
			date = dm.subtract(today, 'd', 1);
			break;
		case "last week":
			date = dm.subtract(today, 'd', 7);
			break;
		case "next week":
			date = dm.add(today, 'd', 7);
			break;
		case "last year":
			date = dm.subtract(today, 'y', 1);
			break;
		case "last month":
			date = dm.subtract(today, 'm', 1);
			break;
		case "next month":
			date = dm.add(today, 'm', 1);
			break;
		case "next year":
			date = dm.add(today, 'y', 1);
			break;
		default:
			date = dm.resetTime(new Date(date));
			break;
	}
	if (dm.invalid(date))
		return null;
	else
		return date;
}

/**
 * An array defining the long names for days of the week, e.g "Sunday", "Monday", "Tuesday", etc.
 * You can use this static value to localize all the Calendar components on a page.
 * @example
 * nitobi.calendar.DatePicker.longDayNames = ["Dimanche", "Lundi", "Mardi", "Mecredi", "Jeudi", "Vendredi", "Samedi"];
 * nitobi.loadComponent("myFrenchCalendar");
 * @type Array
 * @static
 */
nitobi.calendar.DatePicker.longDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
/**
 * An array defining the abbreviated names for days of the week, e.g "Sun", "Mon", "Tue", etc.
 * You can use this static value to localize all the Calendar components on a page.
 * @example
 * nitobi.calendar.DatePicker.shortDayNames = ["Dim", "Lun", "Mar", "Mec", "Jeu", "Ven", "Sam"];
 * nitobi.loadComponent("myFrenchCalendar");
 * @type Array
 * @static
 */
nitobi.calendar.DatePicker.shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/**
 * An array defining the shortest names for days of the week, e.g "S", "M", "T", etc.
 * You can use this static value to localize all the Calendar components on a page.
 * @example
 * nitobi.calendar.DatePicker.minDayNames = ["D", "L", "M", "M", "J", "V", "S"];
 * nitobi.loadComponent("myFrenchCalendar");
 * @type Array
 * @static
 */
nitobi.calendar.DatePicker.minDayNames = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * An array defining the full names of months, e.g "January", "February", "March", etc.
 * You can use this static value to localize all the Calendar components on a page.
 * @example
 * nitobi.calendar.DatePicker.longMonthNames = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Julliet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
 * nitobi.loadComponent("myFrenchCalendar");
 * @type Array
 * @static
 */
nitobi.calendar.DatePicker.longMonthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
/**
 * An array defining the abbreviated names of months, e.g "Jan", "Feb", "Mar", etc.
 * You can use this static value to localize all the Calendar components on a page.
 * @example
 * nitobi.calendar.DatePicker.shortMonthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
 * nitobi.loadComponent("myFrenchCalendar");
 * @type Array
 * @static
 */
nitobi.calendar.DatePicker.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The text shown in the quick nav panel to confirm the date.
 * Use this static value to localize the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navConfirmText = "OK";
/**
 * The text shown in the quick nav panel to cancel and hide the panel.
 * Use this static value to localize the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navCancelText = "Cancel";

/**
 * The error message displayed when the user attempts to use the quick nav panel to change the 
 * month beyond the limits defined by the mindate and maxdate of the component.
 * Use this static value to localize the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navOutOfRangeText = "That date is out of range.";
/**
 * The error message displayed when the user enters an invalid year.
 * Use this static value to localize the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navInvalidYearText = "You must enter a valid year.";

/**
 * The tooltip displayed when the user places her/his mouse over the month header of the Calendar.
 * Use this static value to localize the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.quickNavTooltip = "Click to change month and/or year";

/**
 * The text label applied to the month field in the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navSelectMonthText = "Choose Month";

/**
 * The text label applied to the month field in the quick nav panel.
 * @type String
 * @static
 */
nitobi.calendar.DatePicker.navSelectYearText = "Enter Year";

/**
 * Returns the text for the quick nav tooltip.
 * Can be localized using either the <code>quicknavtooltip</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.quicknavtooltip} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getQuickNavTooltip = function()
{
	return this.initLocaleAttr("quickNavTooltip");
}

/** 
 * Returns an array of mimimized day names, e.g S, M, T, W, T, F, S.
 * Can be localized using either the <code>mindaynames</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.minDayNames} static member.
 * @type Array
 */
nitobi.calendar.DatePicker.prototype.getMinDayNames = function()
{
	return this.initJsAttr("minDayNames");
}

/**
 * Returns an array of full day names e.g Sunday, Monday, etc.
 * Can be localized using either the <code>longdaynames</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.longDayNames} static member.
 * @type Array
 */
nitobi.calendar.DatePicker.prototype.getLongDayNames = function()
{
	return this.initJsAttr("longDayNames");
}

/**
 * Returns an array of abbreviated day names, e.g Sun, Mon, Tue, etc.
 * Can be localized using either the <code>shortdaynames</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.shortDayNames} static member.
 * @type Array
 */
nitobi.calendar.DatePicker.prototype.getShortDayNames = function()
{
	return this.initJsAttr("shortDayNames");
}

/**
 * Returns an array of full month names, e.g Januaray, February, March, etc.
 * Can be localized using either the <code>longmonthnames</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.longMonthNames} static member.
 * @type Array
 */
nitobi.calendar.DatePicker.prototype.getLongMonthNames = function()
{
	return this.initJsAttr("longMonthNames");
}

/**
 * Returns an array of abbreviated month names, e.g Jan, Feb, Mar, etc.
 * Can be localized using either the <code>shortmonthnames</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.shortMonthNames} static member.
 */
nitobi.calendar.DatePicker.prototype.getShortMonthNames = function()
{
	return this.initJsAttr("shortMonthNames");
}

/**
 * Returns the text for the confirm button on the quick nav panel.
 * Can be localized using either the <code>navconfirmtext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navConfirmText} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavConfirmText = function()
{
	return this.initLocaleAttr("navConfirmText");
}

/**
 * Returns the text for the cancel button on the quick nav panel.
 * Can be localized using either the <code>navcanceltext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navCancelText} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavCancelText = function()
{
	return this.initLocaleAttr("navCancelText");
}

/**
 * Returns the text for the date out of range error for the quick nav panel.
 * Can be localized using either the <code>navoutofrangetext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navOutOfRangeText} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavOutOfRangeText = function()
{
	return this.initLocaleAttr("navOutOfRangeText");
}

/**
 * Returns the text for the invalid year error for the quick nav panel.
 * Can be localized using either the <code>navinvalidyeartext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navInvalidYear} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavInvalidYearText = function()
{
	return this.initLocaleAttr("navInvalidYearText");
}

/**
 * Returns the text label applied to the month field in the quick nav panel.
 * Can be localized using either the <code>navselectmonthtext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navSelectMonthText} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavSelectMonthText = function()
{
	return this.initLocaleAttr("navSelectMonthText");
}

/**
 * Returns the text label applied to the year field in the quick nav panel.
 * Can be localized using either the <code>navselectyeartext</code> attribute or using the
 * {@link nitobi.calendar.DatePicker.navSelectYearText} static member.
 * @type String
 */
nitobi.calendar.DatePicker.prototype.getNavSelectYearText = function()
{
	return this.initLocaleAttr("navSelectYearText");
}

/**
 * Initializes an attribute that is either a reference to a js object or a json string.
 * @param {String} jsName The name of the attribute, camel-cased.  E.g. "shortMonthNames"
 * @private
 */
nitobi.calendar.DatePicker.prototype.initJsAttr = function(jsName)
{
	if (this[jsName])
		return this[jsName];
		
	var attr = this.getAttribute(jsName.toLowerCase(), "");
	if (attr != "")
	{
		attr = eval('(' + attr + ')');
		return this[jsName] = attr;
	}
	return this[jsName] = nitobi.calendar.DatePicker[jsName];
}

/**
 * Initializes a locale attribute and either returns the value from that attribute or a default value.
 * @param {String} jsName The name of the attribute to initialize.
 * @private
 */
nitobi.calendar.DatePicker.prototype.initLocaleAttr = function(jsName)
{
	if (this[jsName])
		return this[jsName];
	
	var text = this.getAttribute(jsName.toLowerCase(), "");
	if (text != "")
		return this[jsName] = text;
	else
		return this[jsName] = nitobi.calendar.DatePicker[jsName];
}

/**
 * @private
 */
nitobi.calendar.DatePicker.prototype.parseDate = function(date, mask)
{
	var parsedValues = {};
	while (mask.length > 0)
	{
		var c = mask.charAt(0);
		var testExp = new RegExp(c + "+");
		var format = testExp.exec(mask)[0];
		if (c != "d" && c != "y" && c != "M" && c != "N" && c != "E")
		{
			mask = mask.substring(format.length);
			date = date.substring(format.length);
		}
		else
		{
			var separator = mask.charAt(format.length);
			var currentValue = (separator == ""?date:date.substring(0, date.indexOf(separator)));
			var validatedDate = this.validateFormat(currentValue, format);
			if (validatedDate.valid)
			{
				parsedValues[validatedDate.unit] = validatedDate.value;
			}
			else
			{
				return null;
			}
			mask = mask.substring(format.length);
			date = date.substring(currentValue.length);
		}
	}
	var date = new Date(parsedValues.y, parsedValues.m, parsedValues.d);
	return date;
}

/**
 * @private
 */
nitobi.calendar.DatePicker.prototype.validateFormat = function(value, format)
{
	var validated = {valid: false, unit: "", value: ""};
	switch (format)
	{
		case "d":
		case "dd":
			var parsedValue = parseInt(value);
			var isValid;
			if (format == "d") isValid = !isNaN(value) && value.charAt(0) != "0" && value.length <= 2;
			else isValid = !isNaN(value) && value.length == 2
			if (isValid)
			{
				validated.valid = true;
				validated.unit = 'd';
				validated.value = value;
			}
			else
			{
				validated.valid = false;
			}
			break;
		case "y":
		case "yyyy":
			if (isNaN(value))
			{
				validated.valid = false;
			}
			else
			{
				validated.valid = true;
				validated.unit = 'y';
				validated.value = value;
			}
			break;
		case "M":
		case "MM":
			var parsedValue = parseInt(value, 10);
			var isValid;
			if (format == "M") isValid = !isNaN(value) && value.charAt(0) != "0" && value.length <= 2 && parsedValue >= 1 && parsedValue <= 12;
			else isValid = !isNaN(value) & value.length == 2 && parsedValue >= 1 && parsedValue <= 12;
			
			if (isValid)
			{
				validated.valid = true;
				validated.unit = 'm';
				validated.value = parsedValue - 1;
			}
			else
			{
				validated.valid = false;
			}
			break;
		case "MMM":
		case "NNN":
		case "E":
		case "EE":
			var names;
			if (format == "MMM") names = this.getLongMonthNames();
			else if (format == "NNN") names = this.getShortMonthNames();
			else if (format == "E") names = this.getShortDayNames();
			else names = this.getLongDayNames();
			var i;
			for (i = 0; i < names.length; i++)
			{
				var dateName = names[i];
				if (value.toLowerCase() == dateName.toLowerCase())
					break;
			}
			if (i < names.length)
			{
				validated.valid = true;
				if (format == "MMM" || format == "NNN") validated.unit = 'm';
				else validated.unit = 'dl';
				validated.value = i;
			}
			else
			{
				validated.valid = false;
			}
			break;
	}
	return validated;
}

/**
 * @private
 */
nitobi.calendar.DatePicker.prototype.formatDate = function(date, mask)
{
	var parsedMask = {};	
	var year = date.getFullYear() + "";
	var month = date.getMonth() + 1 + "";
	var numDate = date.getDate() + "";
	var day = date.getDay();
	
	parsedMask["y"] = parsedMask["yyyy"] = year;
	parsedMask["yy"] = year.substring(2,4);
	
	parsedMask["M"] = month + "";
	parsedMask["MM"] = nitobi.lang.padZeros(month,2);
	parsedMask["MMM"] = this.getLongMonthNames()[month - 1];
	parsedMask["NNN"] = this.getShortMonthNames()[month - 1];
	
	parsedMask["d"] = numDate;
	parsedMask["dd"] = nitobi.lang.padZeros(numDate,2);
	
	parsedMask["EE"] =  this.getLongDayNames()[day];
	parsedMask["E"] = this.getShortDayNames()[day];
	
	var formattedDate = "";
	while (mask.length > 0)
	{
		var c = mask.charAt(0);
		var testExp = new RegExp(c + "+");
		// No check because we're guaranteed to get a result
		var currentMask = testExp.exec(mask)[0];
		formattedDate += parsedMask[currentMask] || currentMask;
		mask = mask.substring(currentMask.length);
	}
	return formattedDate;
}