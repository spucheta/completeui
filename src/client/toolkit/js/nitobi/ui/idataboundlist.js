/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.ui');

/**
 * Constructor for IDataBoundList
 * @class A UI control that is bound to a data source.  Used primarily by {@link nitobi.form.Lookup} to manage it's
 * remote data.  The data it manages is columnar.  Like an html list control, you can define which fields are visible in the
 * control (the display fields) and which fields relate to the value (value field).
 * @constructor
 */
nitobi.ui.IDataBoundList = function()
{
}

/**
 * Returns the gethandler name.  The gethandler is the url that returns data to the list.
 * @type String
 */
nitobi.ui.IDataBoundList.prototype.getGetHandler = function()
{
	return this.getHandler;
}

/**
 * Sets the gethandler url for the list.
 * @param {String} getHandler The url that returns data to the list.
 */
nitobi.ui.IDataBoundList.prototype.setGetHandler = function(getHandler)
{
	this.column.getModel().setAttribute("GetHandler", getHandler);
	this.getHandler = getHandler;
}

/**
 * Returns the id of the datasource used to manage the list's data.
 * @type String
 */
nitobi.ui.IDataBoundList.prototype.getDataSourceId = function()
{
	return this.datasourceId;
}

/**
 * Sets the id for the datasource.
 * @param {String} dataSourceId The id to use.
 */
nitobi.ui.IDataBoundList.prototype.setDataSourceId = function(dataSourceId)
{
	this.column.getModel().setAttribute("DatasourceId", dataSourceId);
	this.datasourceId = dataSourceId;
}

/**
 * Returns the display fields for the list.
 * @type String
 */
nitobi.ui.IDataBoundList.prototype.getDisplayFields = function()
{
	return this.displayFields;
}

/**
 * Sets the display fields for the list.
 * @param {String} displayFields The display fields to set.
 */
nitobi.ui.IDataBoundList.prototype.setDisplayFields = function(displayFields)
{
	this.column.getModel().setAttribute("DisplayFields", displayFields);
	this.displayFields = displayFields;
}

/**
 * Returns the value field for the list.
 * @type String
 */
nitobi.ui.IDataBoundList.prototype.getValueField = function()
{
	return this.valueField;
}

/**
 * Sets the value field for the list.
 * @param {String} valueField The field to set as the value field.
 */
nitobi.ui.IDataBoundList.prototype.setValueField = function(valueField)
{
	this.column.getModel().setAttribute("ValueField", valueField);
	this.valueField = valueField;
}