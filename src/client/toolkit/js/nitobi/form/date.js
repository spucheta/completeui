/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class Number is a number editor class that is implemented using an HTML input.
 * @constructor
 * @extends nitobi.form.Text
 */
nitobi.form.Date = function()
{
	nitobi.form.Date.baseConstructor.call(this);
}

nitobi.lang.extend(nitobi.form.Date, nitobi.form.Text);