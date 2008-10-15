/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.form.Password = function()
{
	nitobi.form.Password.baseConstructor.call(this, true);

	this.control.type = 'password';
}

nitobi.lang.extend(nitobi.form.Password, nitobi.form.Text);

//	everything else is in the base class