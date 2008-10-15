/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * Number is a number editor class that is implemented using an HTML <input> tag.
 * @class
 * @constructor
 */
nitobi.form.Number = function()
{
	nitobi.form.Number.baseConstructor.call(this);
	this.defaultValue = 0;
}

nitobi.lang.extend(nitobi.form.Number, nitobi.form.Text);

nitobi.form.Number.prototype.handleKey = function(evt)
{
	nitobi.form.Number.base.handleKey.call(this, evt);

	var k = evt.keyCode;
	if (!this.isValidKey(k))
	{
		nitobi.html.cancelEvent(evt);
		return false;
	}
}


nitobi.form.Number.prototype.isValidKey = function (k)
{
	
	if ((k < 48 || k > 57) && (k < 37 || k > 40) && (k < 96 || k > 105) && k != 190 && k != 110 && k != 189 && k != 109 && k != 9 && k != 45 && k != 46 && k != 8)
	{
		return false;
	}
	return true;
}

nitobi.form.Number.prototype.bind = function(owner, cell, initialKeyChar)
{
	var charCode = initialKeyChar.charCodeAt(0);
	if (charCode >= 97) charCode = charCode - 32;
	var k = this.isValidKey(charCode) ? initialKeyChar : "";
	nitobi.form.Number.base.bind.call(this, owner, cell, k);
}
