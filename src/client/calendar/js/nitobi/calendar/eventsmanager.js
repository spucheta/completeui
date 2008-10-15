/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.calendar');

/**
 * Creates the EventsManager used by the {@link nitobi.calendar.DatePicker} to manage all events dates and disabled dates.
 * @class The EventsManager allows the DatePicker to easily manage which dates have related event information
 * and which dates are disabled.  When the DatePicker is rendered, it uses the EventsManager to issue and XHR to the
 * server before rendering.
 * @constructor
 * @param {String} url The url that supplies the EventsManager with its event and disabled date information.
 * @see nitobi.calendar.DatePicker
 */
nitobi.calendar.EventsManager = function(url)
{
	/**
	 * Manages the xhr requests.
	 * @type nitobi.data.UrlConnector
	 */
	this.connector = new nitobi.data.UrlConnector(url);
	/**
	 * Fired when the data has been retrieved from the server.
	 * @type nitobi.base.Event
	 */
	this.onDataReady = new nitobi.base.Event();
	
	/**
	 * @private
	 */
	this.dates = {events: {}, disabled: {}};
	/**
	 * @private
	 */
	this.eventsCache = {};
	/**
	 * @private
	 */
	this.disabledCache = {};
}

/**
 * Returns true if the date has event information.
 * @param {Date} date The date to check for event information.
 * @type Boolean
 */
nitobi.calendar.EventsManager.prototype.isEvent = function(date)
{
	return (this.eventsCache[date.valueOf()]?true:false);
}

/**
 * Returns true if the date is disabled.
 * @param {Date} date The date to check if it's disabled.
 * @type Boolean
 */
nitobi.calendar.EventsManager.prototype.isDisabled = function(date)
{
	return (this.disabledCache[date.valueOf()]?true:false);
}

/**
 * Issues the XHR to the server.  If the EventsManager isn't connected to a url,
 * it simply notifies its onDataReady event.
 * @private
 */
nitobi.calendar.EventsManager.prototype.getFromServer = function()
{
	if (this.connector.url != null)
		this.connector.get({}, nitobi.lang.close(this, this.getComplete));
	else
		this.onDataReady.notify();	
}

/**
 * Parses the response from the server.
 * @private
 */
nitobi.calendar.EventsManager.prototype.getComplete = function(eventArgs)
{
	var data = eventArgs.result;
	var dm = nitobi.base.DateMath;
	var root = data.documentElement;
	var dates = nitobi.xml.getChildNodes(root);
	for (var i = 0; i < dates.length; i++)
	{
		var dateNode = dates[i];
		var type = dateNode.getAttribute("e");
		var parsedDate = {};
		if (type == "event")
		{
			var startDate = dateNode.getAttribute("a");
			startDate = dm.parseIso8601(startDate);
			parsedDate.startDate = startDate;
			var endDate = dateNode.getAttribute("b");
			if (endDate)
				endDate = dm.parseIso8601(endDate);
			else
				endDate = null;
			parsedDate.endDate = endDate;
			parsedDate.location = dateNode.getAttribute("c");
			parsedDate.description = dateNode.getAttribute("d");
			parsedDate.tooltip = dateNode.getAttribute("f");
			parsedDate.cssClass = dateNode.getAttribute("g");
			parsedDate.cssStyle = dateNode.getAttribute("h");

			var datesObj = this.dates.events[dm.resetTime(dm.clone(startDate)).valueOf()];
			if (datesObj)
			{
				datesObj.push(parsedDate);
			}
			else
			{
				datesObj = [parsedDate];
				this.dates.events[dm.resetTime(dm.clone(startDate)).valueOf()] = datesObj;
			}
			
			this.addEventDate(startDate, endDate);
		}
		else
		{
			var startDate = dm.parseIso8601(dateNode.getAttribute("a"))
			parsedDate.date = startDate;
			this.addDisabledDate(dm.clone(startDate));
		}
	}
	this.onDataReady.notify();
}

/**
 * Adds event information about a date.
 * @private
 */
nitobi.calendar.EventsManager.prototype.addEventDate = function(start, end)
{
	var dm = nitobi.base.DateMath;
	var startDate = dm.clone(start);
	startDate = dm.resetTime(startDate);
	if (!end)
		return this.eventsCache[startDate.valueOf()] = start;
	end = dm.clone(end);
	end = dm.resetTime(end);
	
	while (startDate.valueOf() <= end.valueOf())
	{
		this.eventsCache[startDate.valueOf()] = start;
		startDate = dm.add(startDate, 'd', 1);
	}
}

/**
 * Adds a date to disable.
 * @private
 */
nitobi.calendar.EventsManager.prototype.addDisabledDate = function(date)
{
	date = nitobi.base.DateMath.resetTime(date);
	return this.disabledCache[date.valueOf()] = true;
}

/**
 * Returns information about an event for some date.
 * @param {Date} date The date for which we'd like some event information.
 * @type Object
 */
nitobi.calendar.EventsManager.prototype.getEventInfo = function(date)
{
	var dm = nitobi.base.DateMath;
	var events = this.dates.events;
	date = dm.resetTime(date);
	return events[date.valueOf()];
}