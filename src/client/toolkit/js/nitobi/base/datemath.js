/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.base");

/**
 * DateMath provides static methods to deal with Date objects
 * @namespace
 * @constructor
 */
nitobi.base.DateMath = {
	DAY:'d',
	WEEK:'w',
	MONTH:'m',
	YEAR:'y',
	ONE_DAY_MS:86400000
}

/**
 * Common function for add and subtract
 * @param {Date} date The javascript date object
 * @param {String} unit The unit 
 * @param {Number} amount The amount of unit
 * @return the result
 * @type Date
 * @private
 */
nitobi.base.DateMath._add = function(date,unit,amount){	
	if(unit == this.DAY)	date.setDate(date.getDate()+amount);
	else if(unit==this.WEEK) date.setDate(date.getDate()+7*amount);		
	else if(unit==this.MONTH) date.setMonth(date.getMonth()+amount);
	else if(unit==this.YEAR) date.setFullYear(date.getFullYear()+amount);
	return date;
}
/**
 * Increments a date by some given amount.
 * @example
 * var today = new Date();
 * nitobi.base.DateMath.add(today, "d", 5);
 * @param {Date} date The date to add.
 * @param {String} unit The unit of time to add.  Can either be "d", "m", "w" or "y"
 * @param {Number} amount How many units of time to add.
 * @type Date
 * @static
 */
nitobi.base.DateMath.add = function(date,unit,amount){
	return this._add(date,unit,amount);
}
/**
 * Decrement a date by an amount
 * @param {Date} date The date to subtract.
 * @param {String} unit The unit of time to add.  Can either be "d", "m", "w" or "y"
 * @param {Number} amount How many units of time to add.
 * @type Date
 * @static
 */
nitobi.base.DateMath.subtract = function(date,unit,amount){
	return this._add(date,unit,-1*amount);
}
/**
 * Determines whether a date is exclusively after another date
 * @param {Date} date The date to check
 * @param {Date} compareTo The date to compare against
 * @type Boolean
 * @static
 */
nitobi.base.DateMath.after = function(date,compareTo){
	return (date-compareTo)>0;
}
/**
 * Determines whether a date is inclusively between two dates
 * @param {Date} date The date to check
 * @param {Date} start The start date of the comparison
 * @param {Date} end The end date of the comparison
 * @type Boolean
 * @static
 */
nitobi.base.DateMath.between = function(date,start,end){
	return (date-start)>=0 && (end-date)>=0;
}
/**
 * Determines whether a date is exclusively before another date
 * @param {Date} date The javascript date object to check
 * @param {Date} compareTo The date to compare
 * @type Boolean
 * @static
 */
nitobi.base.DateMath.before = function(date,compareTo){
	return (date-compareTo)<0;
}

/**
 * Creates a copy of a date object
 * @param {Date} date The date to clone.
 * @type Date
 * @static
 */
nitobi.base.DateMath.clone = function(date){
	var n = new Date(date.toString());
	return n;
}
/**
 * Determines whether the year in the Date object is a leap year.
 * @param {Date} date The date to check.
 * @type Boolean
 * @static
 */
nitobi.base.DateMath.isLeapYear = function(date){
	var y = date.getFullYear();
	var	_1 = String(y/4).indexOf('.') == -1; 
	var _2 = String(y/100).indexOf('.') == -1;
	var _3 = String(y/400).indexOf('.') == -1;
	return (_3)?true:(_1 && !_2)?true:false;
}	
/**
 * Get the number of days in a month for a given date.
 * @param {Date} date The date to check.
 * @type Number
 * @static
 */
nitobi.base.DateMath.getMonthDays = function(date){
	return [31,(this.isLeapYear(date))?29:28,31,30,31,30,31,31,30,31,30,31][date.getMonth()];		
}
/**
 * Get the date that corresponds to the end of the month.
 * @param {Date} date The date to check.
 * @type Date
 * @static
 */
nitobi.base.DateMath.getMonthEnd = function(date){
	return new Date(date.getFullYear(),date.getMonth(),this.getMonthDays(date));
}
/**
 * Get the date that corresponds to the start of the month.
 * @param {Date} date The date to check.
 * @type Date
 * @static
 */
nitobi.base.DateMath.getMonthStart = function(date){
	return new Date(date.getFullYear(),date.getMonth(),1);
}
/**
 * Checks if the date is today
 * @param {Date} date The date to check.
 * @type Boolean
 * @static
 */
nitobi.base.DateMath.isToday = function(date){
	var start = this.resetTime(new Date());
	var end = this.add(this.clone(start),this.DAY,1);
	return this.between(date,start,end);
}	

/**
 * Returns true if the two dates have the same day, month, and year (irrespective of time).
 * @param {Date} date The first date in the comparison.
 * @param {Date} compare The second date in the comparison.
 */
nitobi.base.DateMath.isSameDay = function(date, compare)
{
	date = this.resetTime(this.clone(date));
	compare = this.resetTime(this.clone(compare));
	return date.valueOf() == compare.valueOf();
}

/**
 * Parses a string as a date
 * @param {String} str The string to be parsed
 * @return Object
 * @type Date
 * @static
 * @private
 */
nitobi.base.DateMath.parse = function(str){

}	

/**
 * Calculates the week number of the given date in that year.
 * Week numbering starts from 0
 * @param {Date} date The date to check.
 * @type Number
 * @static
 */
nitobi.base.DateMath.getWeekNumber = function(date){
	var january = this.getJanuary1st(date);
	return Math.ceil(this.getNumberOfDays(january,date) / 7);
}

/**
 * Calculates the number of days from start date to end date.
 * Both start and end date are inclusive.
 * @param {Date} start The start date of the range.
 * @param {Date} end The end date of the range.
 * @type Number
 * @static
 */
nitobi.base.DateMath.getNumberOfDays = function(start,end){
	var duration = this.resetTime(this.clone(end)).getTime() - this.resetTime(this.clone(start)).getTime();
//	alert(duration/this.ONE_DAY_MS+1);
	return Math.round(duration/this.ONE_DAY_MS)+1;
}	

/**
 * Returns the date corresponding to the first day of the year.
 * @param {Date} date The date with which to base the start of year.
 * @type Date
 * @static
 */
nitobi.base.DateMath.getJanuary1st = function(date){
	return new Date(date.getFullYear(),0,1);
}

/**
 * Resets the time to 00:00:00
 * @param {Date} date The date to reset.
 * @type Date
 * @static
 */
nitobi.base.DateMath.resetTime = function(date){
	if (nitobi.base.DateMath.invalid(date))
		return date;
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);		
	date.setMilliseconds(0);		
	return date;
}

/**
 * Returns date from a given ISO 8601 date string.
 * @param {String} date an ISO 8601 date string eg. 1980-12-21 08:30:12
 * @type Date
 */
nitobi.base.DateMath.parseIso8601 = function(date) {
	return new Date(date.replace(/^(....).(..).(..)(.*)$/, "$1/$2/$3$4"));
};

/**
 * Returns an ISO 8601 formatted date string from a javascript Date object.
 * @param {Date} date The date to format.
 * @type String
 */
nitobi.base.DateMath.toIso8601 = function(date) {
	if (nitobi.base.DateMath.invalid(date)) return "";
	var pz = nitobi.lang.padZeros;	
	return date.getFullYear()+"-"+pz(date.getMonth()+1)+"-"+pz(date.getDate())+" "+pz(date.getHours())+":"+pz(date.getMinutes())+":"+pz(date.getSeconds());	
};

/**
 * Returns true if the given date is invalid or null.
 * @param {Date} date a Javascript date object
 * @type Boolean
 */
nitobi.base.DateMath.invalid = function(date) {
	return (!date) || (date.toString() == 'Invalid Date'); 
}

