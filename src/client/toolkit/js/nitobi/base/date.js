/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// Not used anywhere...

/**
 * @private
 * @constructor
 * @extends	nitobi.Object
 */
nitobi.base.Date = function() 
{
	this.Day;
	this.Month;
	this.Year;
	this.Week;
	
}

//nitobi.lang.extend(nitobi.base.Date,nitobi.base.ISerializable);

/**
 * Adds date
 * @param year {Number}
 * @param month {Number}
 * @param day {Number} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.add = function(year,month,day)
{	
	//perform addition
	
	//recalculate 
	
	
}


/**
 * Get day
 * @returns {nitobi.base.Day}
 * 
 */
nitobi.base.Date.prototype.getDay = function()
{
	return this.Day;	
}


/**
 * 
 * @param element {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.getMonth = function()
{	
	return this.Month;
}

/**
 * 
 * @param element {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.getWeek = function()
{
		return this.Week;	
}

/**
 * 
 * @param element {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.getYear = function()
{	
		return this.Year;
}

/**
 * 
 * @returns {void}
 */
nitobi.base.Date.prototype.isToday = function()
{	
}

/**
 * Parses a string as a date
 * @param date {String} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.parse = function(date)
{		
}

/**
 * Sets Day
 * @param element {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.setDay = function(Day)
{
	this.Day = Day;
}

/**
 * Sets the Month
 * @param Month {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.setMonth = function(Month)
{	
	this.Month = Month;
}

/**
 * Sets the Year
 * @param Year {object} 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.setYear = function(Year)
{	
	this.Year = Year;
}

/**
 * Subtracts date
 * @param year {Number} 
 * @param month {Number} 
 * @param day {Number} 
 * 
 * @returns {void}
 * 
 */
nitobi.base.Date.prototype.subtract = function(year,month,day)
{	
	this.Month = Month;
}

/**
 * Get today's date
 * @returns {nitobi.base.Date}
 */
nitobi.base.Date.today = function()
{	
	
}