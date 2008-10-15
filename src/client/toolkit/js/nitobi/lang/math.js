/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */

nitobi.lang.defineNs("nitobi.lang");

/**
 * @constructor
 * @class
 * @private
 */
nitobi.lang.Math = function() {};

/**
 * @private
 */
nitobi.lang.Math.sinTable = Array();

/**
 * @private
 */
nitobi.lang.Math.cosTable = Array();

/**
 * Rotates some coordinates centered around 0,0 in euler space
 * provide x,y coords and a rotation in degrees (will convert to rad)
 * @private
 */
nitobi.lang.Math.rotateCoords = function(oldx,oldy,rotation)
{
	
	//(3.1415927/180) = 0.01745329277777778
	var RotationRads = rotation*0.01745329277777778;
	if (nitobi.lang.Math.sinTable[RotationRads] == null ) {
		nitobi.lang.Math.sinTable[RotationRads] = Math.sin(RotationRads);
		nitobi.lang.Math.cosTable[RotationRads] = Math.cos(RotationRads);
	}
	var cR = nitobi.lang.Math.cosTable[RotationRads];
	var sR = nitobi.lang.Math.sinTable[RotationRads];
	var x = oldx*cR - oldy*sR;
	var y = oldy*cR + oldx*sR;	
	return {x : x, y : y};
}

/**
 * Returns a calculated angle between two vertices
 * Value is in degrees
 * @private
 */
nitobi.lang.Math.returnAngle = function(oldx,oldy,newx,newy)
{
	// (3.1415927/180) = 0.01745329277777778
	return Math.atan2(newy-oldy,newx-oldx)/0.01745329277777778;
}

/**
 * Returns a calculated distance between two vertices
 * Value is in pixels
 * @private
 */
nitobi.lang.Math.returnDistance = function(x1,y1,x2,y2)
{
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}