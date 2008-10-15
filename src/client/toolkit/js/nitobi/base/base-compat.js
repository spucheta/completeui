/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
// THIS IS JUST FOR GRID / COMBO COMPAT.
nitobi.lang.defineNs("nitobi.base");

/**
 * The unique id counter.
 * @private
 */
nitobi.base.uid = 1;

/**
 * Returns a unique id.
 * @private
 */
nitobi.base.getUid = function()
{
	return "ntb__"+(nitobi.base.uid++);
}