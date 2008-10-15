/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class
 * @constructor
 */
nitobi.form.Checkbox = function()
{
}

/**
 * @extends nitobi.form.Control
 */
nitobi.lang.extend(nitobi.form.Checkbox, nitobi.form.Control);

/**
 * @ignore
 */
nitobi.form.Checkbox.prototype.mimic = function()
{
  	if(false == eval(this.owner.getOnCellValidateEvent())) return;
	this.toggle();
	this.deactivate();
}

//	align is implemented in the super
/**
 * @ignore
 */
nitobi.form.Checkbox.prototype.deactivate = function()
{
	this.afterDeactivate(this.value);
}

/**
 * 
 */
nitobi.form.Checkbox.prototype.attachToParent = function() 
{
	// This needs to override the base class method cause nothing should happen
}

/**
 * @ignore
 */
nitobi.form.Checkbox.prototype.toggle = function()
{
	var oColumn = this.cell.getColumnObject();
	var columnModelNode = oColumn.getModel();

	var checkedValue = columnModelNode.getAttribute('CheckedValue');
	if (checkedValue == '' || checkedValue == null)
		checkedValue = 1;

	var unCheckedValue = columnModelNode.getAttribute('UnCheckedValue');
	if (unCheckedValue == '' || unCheckedValue == null)
		unCheckedValue = 0;

	// get the value that is selected ...
	this.value = (this.cell.getData().value == checkedValue)?unCheckedValue:checkedValue;
}

/**
 * @ignore
 */
nitobi.form.Checkbox.prototype.hide = function()
{
	// NOTE: This is required since hide should do nothing.
}

/**
 * @ignore
 */
nitobi.form.Checkbox.prototype.dispose = function()
{
	this.metadata = null;
	this.owner = null;
	this.context = null;
}