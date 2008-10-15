/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
* An interactive ui element is defined by the fact it responds to user activity as
* opposed to being a static element. The HTML object that represents EBAInteractiveUIElement.
* @constructor
* @extends nitobi.ui.UiElement
* @param htmlObject {object} 
* @private
*/
nitobi.ui.InteractiveUiElement  = function(htmlObject)
{
	this.enable();
}

nitobi.lang.extend(nitobi.ui.InteractiveUiElement,nitobi.ui.UiElement);

/**
 * Puts the ui element in the enabled state.
 */
nitobi.ui.InteractiveUiElement.prototype.enable = function()
{
	this.m_Enabled=true;
}

/**
 * Puts the ui element in the disabled state.
 */
nitobi.ui.InteractiveUiElement.prototype.disable = function ()
{
	this.m_Enabled=false;
}