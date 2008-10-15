/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.calendar");

/**
 * Creates a a renderer for the Calendar class.
 * @class This class provides the renderToString function necessary to render 
 * the DatePicker.  The renderer expects its datePicker to return itself (<code>this</code>) 
 * from the <code>getState</code> function.
 * @private
 * @constructor
 * @extends nitobi.html.IRenderer
 */
nitobi.calendar.CalRenderer = function()
{
	nitobi.html.IRenderer.call(this);
};

nitobi.lang.implement(nitobi.calendar.CalRenderer, nitobi.html.IRenderer);

/**
 * Transform the given data with the template.
 * @param {XMLDocument|String} data the data to transform.
 * @return The result of the transformation as a string.
 * @type String
 */
nitobi.calendar.CalRenderer.prototype.renderToString = function(calendar)
{
	var datePicker = calendar.getParentObject();
	var eventsManager = datePicker.getEventsManager();
	
	var dm = nitobi.base.DateMath;
	var sb = new nitobi.lang.StringBuilder();
	var id = calendar.getId();
	
	var monthColumns = calendar.getMonthColumns();
	var monthRows = calendar.getMonthRows();
	
	var isMultiMonth = monthColumns > 1 || monthRows > 1;
	
	// Reset time so it is easier to compare date values directly
	var startDate = dm.resetTime(dm.clone(datePicker.getStartDate()));
	var selectedDate = datePicker.getSelectedDate();
	if (selectedDate != null)
		selectedDate = dm.resetTime(datePicker.getSelectedDate());
	var today = dm.resetTime(new Date());
	var minDate = datePicker.getMinDate();
	var maxDate = datePicker.getMaxDate();
	
	var lastMonth = dm.subtract(dm.clone(startDate), 'd', 1);
	var nextMonth = dm.add(dm.clone(startDate), 'm', monthColumns * monthRows);
	
	datePicker.disPrev = (minDate && dm.before(lastMonth, minDate)?true:false);
	datePicker.disNext = (maxDate && dm.after(nextMonth, maxDate)?true:false);
	
	var monthNames = datePicker.getLongMonthNames();
	var dayNames = datePicker.getLongDayNames();
	var weekDays = datePicker.getMinDayNames();
	
	var monthTooltip = datePicker.getQuickNavTooltip();
	
	// Enable shim only for FF2 on Mac and IE6
	var enableShim = (((nitobi.browser.MOZ && !document.getElementsByClassName && navigator.platform.indexOf("Mac") >= 0) || nitobi.browser.IE6) && datePicker.isShimEnabled())?true:false;
	if (enableShim)
		sb.append("<iframe id=\"" + id + ".shim\" style='position:absolute;top:0px;z-index:19999;'><!-- dummy --></iframe>");
	sb.append("<div id=\"" + id + ".calendar\" style=\"" + (enableShim?"position:relative;z-index:20000;":"") + "\">");
	
	sb.append("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
		if (isMultiMonth)
		{
			sb.append("<tr id=\"" + id + ".header\"><td>");
			var startMonth = monthNames[startDate.getMonth()];
			var startYear = startDate.getFullYear();
			var endDate = dm.add(dm.clone(startDate), 'm', (monthColumns * monthRows) - 1);
			var endMonth = monthNames[endDate.getMonth()];
			var endYear = endDate.getFullYear();
			sb.append("<div class=\"ntb-calendar-header\">");
				sb.append("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"height:100%;width:100%;\"><tbody>");
				sb.append("<tr><td><a id=\"" + id + ".prevmonth\" onclick=\"return false;\" href=\"#\" class=\"ntb-calendar-prev" + (datePicker.disPrev?" ntb-calendar-prevdis":"") + "\"></a</td>");
				sb.append("<td style=\"width:70%;\"><span class=\"ntb-calendar-title\" title=\"" + monthTooltip + "\" id=\"" + id + ".nav\">" + startMonth + " " + startYear + " - " + endMonth + " " + endYear + "</span></td>");
				sb.append("<td><a id=\"" + id + ".nextmonth\" onclick=\"return false;\" href=\"#\" class=\"ntb-calendar-next" + (datePicker.disNext?" ntb-calendar-nextdis":"") + "\"></a></td></tr>");
				sb.append("</tbody></table></div></td></tr>")
		}
		
		sb.append("<tr id=\"" + id + ".body\"><td>");
		sb.append("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>");
		for (var i = 0; i < monthRows; i++)
		{
			sb.append("<tr>");
			for (var j = 0; j < monthColumns; j++)
			{
				var calDate = dm.subtract(dm.clone(startDate), 'd', startDate.getDay());
				var currentMonth = startDate.getMonth();
				var currentYear = startDate.getFullYear();
				
				sb.append("<td>");
				sb.append("<div class=\"ntb-calendar\">");
					sb.append("<div><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width:100%;\"><tbody>");
						sb.append("<tr class=\"ntb-calendar-monthheader\">");
							if (!isMultiMonth)
								sb.append("<td><a id=\"" + id + ".prevmonth\" onclick=\"return false;\" href=\"#\" class=\"ntb-calendar-prev" + (datePicker.disPrev?" ntb-calendar-prevdis":"") + "\"></a></td>");
							sb.append("<td style=\"width:70%;\"><span title=\"" + monthTooltip + "\" " + (!isMultiMonth?"id=\"" + id + ".nav\"":"") + "><a onclick=\"return false;\" href=\"#\" style=\"" + (isMultiMonth?"cursor:default;":"") + "\" class=\"ntb-calendar-month\">" + monthNames[currentMonth] + "</a>");
							sb.append("<a onclick=\"return false;\" href=\"#\" style=\"" + (isMultiMonth?"cursor:default;":"") + "\" class=\"ntb-calendar-year\">" + " " + currentYear + "</a></span></td>");
							if (!isMultiMonth)
								sb.append("<td><a id=\"" + id + ".nextmonth\" onclick=\"return false;\" href=\"#\" class=\"ntb-calendar-next" + (datePicker.disNext?" ntb-calendar-nextdis":"") + "\"></a></td>");
					sb.append("</tbody></table></div>");
					sb.append("<div><table id=\"" + id + "." + currentMonth + "." + currentYear + "\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width: 100%;\"><tbody>");
					sb.append("<tr>");
					for (var k = 0; k < 7; k++)
					{
						sb.append("<th class=\"ntb-calendar-dayheader\">" + weekDays[k] + "</th>");
					}
					sb.append("</tr>");
					for (var m = 0; m < 6; m++)
					{
						sb.append("<tr>");
						for (var n = 0; n < 7; n++)
						{
							sb.append("<td>");
							var title = dayNames[calDate.getDay()] + ", " + monthNames[calDate.getMonth()] + " " + calDate.getDate() + ", " + calDate.getFullYear();
							var dayEvents = null;
							var extraStyle = "";
							if(eventsManager && calDate.getMonth() == startDate.getMonth())
							{
								var dayEvents = eventsManager.dates.events[calDate.valueOf()];
								if(dayEvents != null)
								{
									var nt = "";
									for(var p = 0; p < dayEvents.length; p++)
									{
										if(dayEvents[p].tooltip != null)
											nt+=dayEvents[p].tooltip + "\n";
										else if(dayEvents[p].location != null)
										{
											nt+=dayEvents[p].location +  "\n";
											if(dayEvents[p].description != null)
												nt+= dayEvents[p].description;
										}
										if(dayEvents[p].cssStyle != null)
											extraStyle+=dayEvents[p].cssStyle;
									}
									if(nt.length != 0)
										title = nt;		
								}
							}
							
							sb.append("<a ebatype=\"date\" ebamonth=\"" + calDate.getMonth() + "\" ebadate=\"" + calDate.getDate() + "\" ebayear=\"" + calDate.getFullYear() + "\" title=\"" + title + "\" href=\"#\" onclick=\"return false;\" style=\"display:block;text-decoration:none;" + extraStyle + "\" class=\"");
							if (selectedDate && calDate.valueOf() == selectedDate.valueOf() && calDate.getMonth() == startDate.getMonth())
								sb.append("ntb-calendar-currentday ");
							
							if (calDate.getMonth() < startDate.getMonth() || (minDate && calDate.valueOf() < minDate.valueOf())) sb.append("ntb-calendar-lastmonth ");
							else if (calDate.getMonth() > startDate.getMonth() || (maxDate && calDate.valueOf() > maxDate.valueOf())) sb.append("ntb-calendar-nextmonth ");
							else if (calDate.getMonth() == startDate.getMonth()) sb.append("ntb-calendar-thismonth ");
							
							if (eventsManager && eventsManager.isDisabled(calDate) && calDate.getMonth() == startDate.getMonth())
							{	
								sb.append("ntb-calendar-disabled ");
							}
							else if (eventsManager && eventsManager.isEvent(calDate) && calDate.getMonth() == startDate.getMonth())
							{
								sb.append("ntb-calendar-event ");	
							}
							
							if (today.valueOf() == calDate.valueOf())
								sb.append("ntb-calendar-today");
							
							sb.append(" ntb-calendar-day");
							
							// Why are we looping through the events again?
							if(dayEvents != null)
								for(var p = 0; p < dayEvents.length; p++)
									if(dayEvents[p].cssClass != null)
										sb.append(" " + dayEvents[p].cssClass + " ");

							sb.append("\">"+calDate.getDate()+"</a></td>");
							
							calDate = dm.add(calDate, 'd', 1);
						}
						sb.append("</tr>"); 
					}
					sb.append("</tbody></table></div></div></td>");
				
				startDate = dm.resetTime(dm.add(startDate, 'm', 1));
			}
			sb.append("</tr>");
		}
		sb.append("</tbody></table></td></tr></tbody></table></div></div>");
	sb.append("</tbody><colgroup span=\"7\" style=\"width:17%\"></colgroup></table></div>");
	sb.append("<div id=\"" + id + ".overlay\" class=\"ntb-calendar-overlay\" style=\"" + (enableShim?"z-index:20001;":"") + "top:0px;left:0px;display:none;position:absolute;background-color:gray;filter:alpha(opacity=40);-moz-opacity:.50;opacity:.50;\"></div>");
	sb.append(this.renderNavPanel(calendar));
	sb.append("</div></div>");
	return sb.toString();
}

/**
 * Renders the quick nav panel.
 * @param {nitobi.calendar.Calendar} calendar The Calendar object that the nav panel is bound to.
 */
nitobi.calendar.CalRenderer.prototype.renderNavPanel = function(calendar)
{
	var sb = new nitobi.lang.StringBuilder();
	var datePicker = calendar.getParentObject();

	var monthNames = datePicker.getLongMonthNames();
	var id = calendar.getId();
	var enableShim = (nitobi.browser.MOZ && !nitobi.browser.MOZ3) || (nitobi.browser.IE6 && !nitobi.browser.IE7)?true:false;
	
	sb.append("<div id=\"" + id + ".navpanel\" style=\"" + (enableShim?"z-index:20002;":"") + "position:absolute;top:0px;left:0px;overflow:hidden;\" class=\"ntb-calendar-navcontainer nitobi-hide\">");
		sb.append("<div class=\"ntb-calendar-monthcontainer\">");
			sb.append("<label style=\"display:block;\" for=\"" + id + ".months\">" + datePicker.getNavSelectMonthText() + "</label>");
			sb.append("<select id=\"" + id + ".months\" class=\"ntb-calendar-navms\" style=\"\" tabindex=\"1\">");
			for (var i = 0; i < monthNames.length; i++)
			{
				sb.append("<option value=\"" + i + "\">" + monthNames[i] + "</option>");
			}
			sb.append("</select>");
		sb.append("</div>");
		sb.append("<div class=\"ntb-calendar-yearcontainer\">");
			sb.append("<label style=\"display:block;\" for=\"" + id + ".year\">" + datePicker.getNavSelectYearText() + "</label>");
			sb.append("<input size=\"4\" maxlength=\"4\" id=\"" + id + ".year\" class=\"ntb-calendar-navinput\" style=\"-moz-user-select: normal;\" tabindex=\"2\"/>");
		sb.append("</div>");
		sb.append("<div class=\"ntb-calendar-controls\">");
			sb.append("<button id=\"" + id + ".navconfirm\" type=\"button\">" + datePicker.getNavConfirmText() + "</button>");
			sb.append("<button id=\"" + id + ".navcancel\" type=\"button\">" + datePicker.getNavCancelText() + "</button>");
		sb.append("</div>");
		sb.append("<div id=\"" + id + ".warning\" style=\"display:none;\" class=\"ntb-calendar-navwarning\">You must enter a valid year.</div>");
	sb.append("</div>");
	return sb.toString();
}