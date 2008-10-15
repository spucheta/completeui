/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * Event arguments for after a save event.
 * @param {nitobi.data.DataTable} source
 * @param {XMLDocument} responseData
 * @param {Boolean} success
 */
nitobi.data.OnAfterSaveEventArgs = function(source, responseData, success)
{
	nitobi.data.OnAfterSaveEventArgs.baseConstructor.call(this,source);
	this.success = success;
	this.responseData = responseData;
};

nitobi.lang.extend(nitobi.data.OnAfterSaveEventArgs, nitobi.data.DataTableEventArgs);

/**
 * Returns the XML Document that was returned by the save handler.
 * @type XMLDocument
 */
nitobi.data.OnAfterSaveEventArgs.prototype.getResponseData = function()
{
	return this.responseData;
};

/**
 * Returns a boolean signifying whether or not the save was successful.
 * @type Boolean 
 */
nitobi.data.OnAfterSaveEventArgs.prototype.getSuccess = function()
{
	return this.success;
};