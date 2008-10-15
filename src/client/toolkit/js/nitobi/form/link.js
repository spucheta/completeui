/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class A link editor class.
 * @extends nitobi.form.Control
 */
nitobi.form.Link = function()
{
}

/**
 * @extends nitobi.form.Control
 */
nitobi.lang.extend(nitobi.form.Link, nitobi.form.Control);

nitobi.form.Link.prototype.initialize = function()
{
	/**
	 * @private
	 */
	this.url = "";
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.bind = function(owner, cell)
{
	nitobi.form.Link.base.bind.apply(this, arguments);
	this.url = this.cell.getValue(); 
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.mimic = function()
{
  	if(false == eval(this.owner.getOnCellValidateEvent())) return;
	this.click();
	this.deactivate();
}

//	align is implemented in the super
/**
 * @ignore
 */
nitobi.form.Link.prototype.deactivate = function()
{
	this.afterDeactivate(this.value);
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.click = function()
{
	this.control = window.open(this.url);
	this.value = this.url;
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.hide = function()
{
	// NOTE: This is required since hide should do nothing.
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.attachToParent = function()
{
	// NOTE: This is required since attachToParent should do nothing (Because the
	// link editor is currently non-editable.
}

/**
 * @ignore
 */
nitobi.form.Link.prototype.dispose = function()
{
	this.metadata = null;
	this.owner = null;
	this.context = null;
}