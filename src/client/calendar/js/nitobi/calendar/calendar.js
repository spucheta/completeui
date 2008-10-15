/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.calendar');

/**
 * Creates the calendar portion of the DatePicker.
 * @class The calendar portion of the DatePicker allows users to choose a date visually from a rendered calendar.
 * To render, you must first instantiate a {@link nitobi.calendar.DatePicker} object.
 * @constructor
 * @example
 * var dp = new nitobi.calendar.DatePicker("myUniqueId");
 * var cal = new nitobi.calendar.Calendar();
 * dp.setTheme("flex");
 * dp.setObject(cal);
 * dp.render;
 * @param {Node} [element] The ntb:calendar node from the component declaration.  If you are creating the component
 * from script, this parameter is optional.
 * @extends nitobi.ui.Element
 */
nitobi.calendar.Calendar = function(element) 
{
	nitobi.calendar.Calendar.baseConstructor.call(this, element);
	
	/**
	 * The date that is currently selected in the Calendar.  Not necessarily the same
	 * as the selectedDate of the DatePicker.
	 * @private
	 */
	this.selectedDate;

	/**
	 * The rendering class for Calendar.
	 * @type nitobi.calendar.Renderer()
	 * @private
	 */
	this.renderer = new nitobi.calendar.CalRenderer();
	
	/**
	 * Fires when the Calendar's visibility is toggled to hidden.
	 * @see #hide
	 * @type nitobi.base.Event
	 */
	this.onHide = new nitobi.base.Event();
	this.eventMap["hide"] = this.onHide;
	
	/**
	 * Fires when the Calendar's visibility is toggled to visible.
	 * @see #show
	 * @type nitobi.base.Event
	 */
	this.onShow = new nitobi.base.Event();
	this.eventMap["show"] = this.onShow;
	
	/**
	 * Fires when a date in the Calendar is clicked.
	 * @type nitobi.base.Event
	 */
	this.onDateClicked = new nitobi.base.Event();
	this.eventMap["dateclicked"] = this.onDateClicked;
	
	/**
	 * Fires when the month is changed, either by the user clicking the "next" button
	 * or via the quick nav panel.
	 * @type nitobi.base.Event
	 */
	this.onMonthChanged = new nitobi.base.Event();
	this.eventMap["monthchanged"] = this.onMonthChanged;
	
	/**
	 * Fires when the year is changed, either by the user clicking the "next" button
	 * or via the quick nav panel.
	 * @type nitobi.base.Event
	 */
	this.onYearChanged = new nitobi.base.Event();
	this.eventMap["yearchanged"] = this.onYearChanged;
	
	/**
	 * Fires when the Calendar is done rendering.
	 * @see #render
	 * @type nitobi.base.Event
	 */
	this.onRenderComplete = new nitobi.base.Event();
	
	this.onSetVisible.subscribe(this.handleToggle, this);
	
	/**
	 * The effect class to use when showing the Calendar.
	 * Default: {@link nitobi.effects.ShadeDown}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.showEffect = (this.isEffectEnabled()?nitobi.effects.families["shade"].show:null);
	/**
	 * The effect class to use when hiding the Calendar.
	 * Default: {@link nitobi.effects.ShadeUp}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.hideEffect = (this.isEffectEnabled()?nitobi.effects.families["shade"].hide:null);
	
	/**
	 * Use this to keep track of events we've attached to html elements so we can properly 
	 * detach them.
	 * @private
	 */
	this.htmlEvents = {'body': [], 'nav': [], 'navconfirm': [], 'navcancel': [], 'navpanel': [], 'nextmonth': [], 'prevmonth': []};
	
	this.subscribeDeclarationEvents();
}

nitobi.lang.extend(nitobi.calendar.Calendar, nitobi.ui.Element);

nitobi.calendar.Calendar.profile = new nitobi.base.Profile("nitobi.calendar.Calendar",null,false,"ntb:calendar");
nitobi.base.Registry.getInstance().register(nitobi.calendar.Calendar.profile);

/**
 * Renders the Calendar portion of the component only.
 */
nitobi.calendar.Calendar.prototype.render = function()
{
	this.detachEvents();
	
	this.setContainer(this.getHtmlNode());
	nitobi.calendar.Calendar.base.render.call(this);
	
	this.selectedDate = this.getParentObject().getSelectedDate();
	var he = this.htmlEvents;
	var H = nitobi.html;
	
	// Attach Body events
	var calBody = this.getHtmlNode("body");
	H.attachEvent(calBody,"click", this.handleBodyClick, this);
	H.attachEvent(calBody, "mousedown", this.handleMouseDown, this);
	
	he.body.push({type: "click", handler: this.handleBodyClick});
	he.body.push({type: "mousedown", handle: this.handleMouseDown});
	
	// Attach quick nav panel events
	var nav = this.getHtmlNode("nav");
	var navConfirm = this.getHtmlNode("navconfirm");
	var navCancel = this.getHtmlNode("navcancel");
	H.attachEvent(nav, "click", this.showNav, this);
	H.attachEvent(navCancel, "click", this.handleNavCancel, this);
	H.attachEvent(navConfirm, "click", this.handleNavConfirm, this);
	H.attachEvent(this.getHtmlNode("navpanel"), "keypress", this.handleNavKey, this);
	
	he.nav.push({type: "click", handler: this.showNav});
	he.navcancel.push({type: "click", handler: this.handleNavCancel});
	he.navconfirm.push({type: "click", handler: this.handleNavConfirm});
	he.navpanel.push({type: "keypress", handler: this.handleNavKey});
	
	// Attach next/prev events
	H.attachEvent(this.getHtmlNode("nextmonth"),"click",this.nextMonth,this);
	H.attachEvent(this.getHtmlNode("prevmonth"),"click",this.prevMonth,this);
	
	he.nextmonth.push({type: "click", handler: this.nextMonth});
	he.prevmonth.push({type: "click", handler: this.prevMonth});
	
	var calNode = this.getHtmlNode();
	var shim = this.getHtmlNode("shim");
	var Css = nitobi.html.Css;
	// If we are in IE 6 or FF 2 on Mac, we need an iframe backer so that scrollbars underneath
	// the Calendar are hidden properly.
	if (shim)
	{
		var hidden = Css.hasClass(calNode, "nitobi-hide");
		if (hidden)
		{
			Css.removeClass(calNode, "nitobi-hide");
			calNode.style.top = "-1000px";
		}
		var width = calNode.offsetWidth;
		var height = calNode.offsetHeight;
		shim.style.height = height + "px";
		shim.style.width = width - 1 + "px";
		if (hidden)
		{
			Css.addClass(calNode, "nitobi-hide");
			calNode.style.top = "";
		}
	}
	
	this.onRenderComplete.notify(new nitobi.ui.ElementEventArgs(this, this.onRenderComplete));
}

/**
 * Detachs html events from the Calendar.
 * @private
 */
nitobi.calendar.Calendar.prototype.detachEvents = function()
{
	var he = this.htmlEvents;
	for (var name in he)
	{
		var events = he[name];
		var node = this.getHtmlNode(name);
		nitobi.html.detachEvents(node, events);
	}
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.handleMouseDown = function(event)
{
	var datePicker = this.getParentObject();
	var activeDate = this.findActiveDate(event.srcElement);
	if (activeDate && nitobi.html.Css.hasClass(activeDate, "ntb-calendar-thismonth"))
		datePicker.blurInput = false;
	else
		datePicker.blurInput = true;
}

/**
 * Handles the case where the user clicks on a date in the Calendar.
 * @private
 */
nitobi.calendar.Calendar.prototype.handleBodyClick = function(event)
{
	var activeDate = this.findActiveDate(event.srcElement);
	if (!activeDate || nitobi.html.Css.hasClass(activeDate, "ntb-calendar-lastmonth") || nitobi.html.Css.hasClass(activeDate, "ntb-calendar-nextmonth"))
		return;
	var datePicker = this.getParentObject();
	
	var day = activeDate.getAttribute("ebadate");
	var month = activeDate.getAttribute("ebamonth");
	var year = activeDate.getAttribute("ebayear");
	var date = new Date(year, month, day);

	var eventsManager = datePicker.getEventsManager();
	if (eventsManager.isDisabled(date))
		return;

	datePicker._setSelectedDate(date);
	this.onDateClicked.notify(new nitobi.ui.ElementEventArgs(this, this.onDateClicked));
	this.toggle();
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.handleNavKey = function(e)
{
	var code = e.keyCode;
	if (code == 27)
		this.handleNavCancel();
	if (code == 13)
		this.handleNavConfirm();
}

/**
 * Handles the calendar toggling when the calendar button is clicked.
 * @private
 */
nitobi.calendar.Calendar.prototype.handleToggleClick = function(e)
{
	this.toggle();
}

/**
 * Clears the currently highlighted date.  This only removes the visual highlight.  The parent
 * DatePicker will still have a selected date set.
 */
nitobi.calendar.Calendar.prototype.clearHighlight = function()
{
	if (this.selectedDate)
	{
		var dateCell = this.findDateElement(this.selectedDate);
		if (dateCell)
			nitobi.html.Css.removeClass(dateCell, "ntb-calendar-currentday");
		this.selectedDate = null;
	}
}

/**
 * Highlight a date in the Calendar.  Applies the ntb-calendar-currentday style to that date.
 * @param {Date} date The date to highlight.
 */
nitobi.calendar.Calendar.prototype.highlight = function(date)
{
	this.selectedDate = date;
	var dateCell = this.findDateElement(date);
	if (dateCell)
		nitobi.html.Css.addClass(dateCell, "ntb-calendar-currentday");
}

/**
 * Returns the html element in the Calendar corresponding to a given date.  Returns null
 * if that date is not currently rendered.
 * @param {Date} date The date to search for.
 * @type HTMLElement
 */
nitobi.calendar.Calendar.prototype.findDateElement = function(date)
{
	var table = this.getHtmlNode(date.getMonth() + "." + date.getFullYear());
	var dm = nitobi.base.DateMath;
	if (table)
	{
		var startDate = dm.getMonthStart(dm.clone(date));
		startDate = dm.subtract(startDate,'d',startDate.getDay());
		var days = dm.getNumberOfDays(startDate, date) - 1;
		if (days >=0 && days < 42)
		{
			var row = 1 + Math.floor(days / 7);
			var col = days % 7;
			var dateCell = nitobi.html.getFirstChild(table.rows[row].cells[col])
			return dateCell;
		}
	}
	return null;
}

/**
 * Shows the quick nav panel.
 */
nitobi.calendar.Calendar.prototype.showNav = function()
{
	var datePicker = this.getParentObject();
	var startDate = datePicker.getStartDate();
	var monthsSelect = this.getHtmlNode("months");
	monthsSelect.selectedIndex = startDate.getMonth();
	this.getHtmlNode("year").value = startDate.getFullYear();
	this.getHtmlNode("warning").style.display = "none";
	var overlay = this.getHtmlNode("overlay");
	var panel = this.getHtmlNode("navpanel");
	
	var effect = new nitobi.effects.BlindDown(panel, {duration: 0.3});
	var alignTarget = this.getHtmlNode("nav");
	this.fitOverlay();
	overlay.style.display = "block";
	var D = nitobi.drawing;
	D.align(panel, alignTarget, D.align.ALIGNMIDDLEHORIZ);
	D.align(panel, this.getHtmlNode("body"), D.align.ALIGNTOP);
	D.align(overlay, this.getHtmlNode("body"), D.align.ALIGNTOP | D.align.ALIGNLEFT);
	effect.callback = 
		function() 
		{
			monthsSelect.focus();
		};
	effect.start();
}

/**
 * Hides the quick nav panel.
 */
nitobi.calendar.Calendar.prototype.hideNav = function(callback)
{
	var panel = this.getHtmlNode("navpanel");
	var effect = new nitobi.effects.BlindUp(panel, {duration: 0.2});
	effect.callback = callback || nitobi.lang.noop();
	effect.start();
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.hideOverlay = function()
{
	var overlay = this.getHtmlNode("overlay");
	overlay.style.display = "none";
}

/**
 * Fits the overlay used to obscure the Calendar to the Calendar container.
 * @private
 */
nitobi.calendar.Calendar.prototype.fitOverlay = function()
{
	var calNode = this.getHtmlNode("body");
	var overlay = this.getHtmlNode("overlay");
	var width = calNode.offsetWidth;
	var height = calNode.offsetHeight;
	overlay.style.height = height + "px";
	overlay.style.width = width + "px";
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.handleNavConfirm = function(event)
{
	var datePicker = this.getParentObject();
	
	var monthsList = this.getHtmlNode("months");
	var month = monthsList.options[monthsList.selectedIndex].value;
	var year = this.getHtmlNode("year").value;
	
	if (isNaN(year))
	{
		var warning = this.getHtmlNode("warning");
		warning.style.display = "block";
		warning.innerHTML = datePicker.getNavInvalidYearText();
		return;
	}
	year = parseInt(year);
	var newDate = new Date(year, month, 1);
	if (datePicker.isOutOfRange(newDate))
	{
		var warning = this.getHtmlNode("warning");
		warning.style.display = "block";
		warning.innerHTML = datePicker.getNavOutOfRangeText();
		return;
	}
	var startDate = datePicker.getStartDate();
	var monthChanged = false;
	var yearChanged = false;
	if (year != startDate.getFullYear()) yearChanged = true;
	if (parseInt(month) != startDate.getMonth()) monthChanged = true;
	datePicker.setStartDate(newDate);
	var callback = nitobi.lang.close(this, this.render);
	this.onRenderComplete.subscribeOnce(nitobi.lang.close(this, 
		function() {
			if (monthChanged) this.onMonthChanged.notify(new nitobi.ui.ElementEventArgs(this, this.onMonthChanged));
			if (yearChanged) this.onYearChanged.notify(new nitobi.ui.ElementEventArgs(this, this.onYearChanged));
		}
	));
	this.hideNav(callback);
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.handleNavCancel = function(event)
{
	var callback = nitobi.lang.close(this, this.hideOverlay);
	this.hideNav(callback);
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.findActiveDate = function(element)
{
	var breakOut = 5;
	for (var i = 0; i < breakOut && element.getAttribute; i++) 
	{
		var t = element.getAttribute('ebatype');
		if (t == 'date') return element;
		element = element.parentNode;
	}
	return null;
}

/**
 * Used to plug into the toolkit rendering framework.
 * @private
 */
nitobi.calendar.Calendar.prototype.getState = function()
{
	return this;
}

/**
 * Moves the start month of the Calendar forward by one month.
 */
nitobi.calendar.Calendar.prototype.nextMonth = function()
{
	var datePicker = this.getParentObject();
	if (!datePicker.disNext)
	{
		var totalMonths = this.getMonthColumns() * this.getMonthRows();
		this.changeMonth(totalMonths);
	}
}

/**
 * Moves the start month of the Calendar back by one month.
 */
nitobi.calendar.Calendar.prototype.prevMonth = function()
{
	if (!this.getParentObject().disPrev)
	{
		var totalMonths = this.getMonthColumns() * this.getMonthRows();
		this.changeMonth(0 - totalMonths);
	}
}

/**
 * Changes the start month of the Calendar.
 * @param {Number} unit The number of months so change the start month by.  Negative numbers goes back in time,
 * positive number go forward.
 */
nitobi.calendar.Calendar.prototype.changeMonth = function(unit)
{
	var datePicker = this.getParentObject();
	var date = datePicker.getStartDate();
	var dm = nitobi.base.DateMath;
	date = dm._add(dm.clone(date), 'm', unit);
	var startDate = datePicker.getStartDate();
	var yearChanged = false;
	if (startDate.getFullYear() != date.getFullYear())
		yearChanged = true;
	datePicker.setStartDate(date);
	this.render();
	
	this.onMonthChanged.notify(new nitobi.ui.ElementEventArgs(this, this.onMonthChanged));
	if (yearChanged) this.onYearChanged.notify(new nitobi.ui.ElementEventArgs(this, this.onYearChanged));
}

/**
 * Toggles the visibility of the Calendar.
 * @param {Function} callback The function to call after the toggling has completed.
 */
nitobi.calendar.Calendar.prototype.toggle = function(callback)
{
	var datePicker = this.getParentObject();
	if (datePicker.getInput())
		this.setVisible(!this.isVisible(), (this.isVisible()?this.hideEffect:this.showEffect), callback, {duration: 0.3});
}

/**
 * Shows the Calendar.
 * @param {Function} callback The function to call after the toggling has completed.
 */
nitobi.calendar.Calendar.prototype.show = function(callback)
{
	var datePicker = this.getParentObject();
	if (datePicker.getInput())
		this.setVisible(true, this.showEffect, callback, {duration: 0.3});
}

/**
 * Hides the Calendar.
 * @param {Function} callback The function to call after the toggling has completed.
 */
nitobi.calendar.Calendar.prototype.hide = function(callback)
{
	var datePicker = this.getParentObject();
	if (datePicker.getInput())
		this.setVisible(false, this.hideEffect, callback, {duration: 0.3});
}

/**
 * @private
 */
nitobi.calendar.Calendar.prototype.handleToggle = function()
{
	if (this.isVisible())
		this.onShow.notify(new nitobi.ui.ElementEventArgs(this, this.onShow));
	else
		this.onHide.notify(new nitobi.ui.ElementEventArgs(this, this.onHide));
}

/**
 * Returns the number of month columns to render.  Together with {@link #getMonthRows} it
 * defines the number of calendars to render in total.
 * @type Number
 */
nitobi.calendar.Calendar.prototype.getMonthColumns = function()
{
	return this.getIntAttribute("monthcolumns", 1);
}

/**
 * Sets the number of month columns to render.
 * @param {Number} columns The number of month columns.
 */
nitobi.calendar.Calendar.prototype.setMonthColumns = function(columns)
{
	this.setAttribute("monthcolumns", columns);
}

/**
 * Returns the number of month rows to render.  Together with {@link #getMonthColumns} it
 * defines the number of calendars to render in total.
 * @type Number
 */
nitobi.calendar.Calendar.prototype.getMonthRows = function()
{
	return this.getIntAttribute("monthrows", 1);
}

/**
 * Sets the number of month rows to render.
 * @param {Number} rows The number of month rows.
 */
nitobi.calendar.Calendar.prototype.setMonthRows = function(rows)
{
	this.setAttribute("monthrows", rows);
}

/**
 * Returns true if the Calendar has effects enabled, false otherwise.
 * @type Boolean
 */
nitobi.calendar.Calendar.prototype.isEffectEnabled = function()
{
	return this.getBoolAttribute("effectenabled", true);
}

/**
 * Sets whether or not to use an effect when showing/hiding the Calendar.
 * @param {Boolean} enableEffect Use true to enable effects, false to disable.
 */
nitobi.calendar.Calendar.prototype.setEffectEnabled = function(enableEffect)
{
	this.setAttribute("effectenabled", isEffectEnabled);
}