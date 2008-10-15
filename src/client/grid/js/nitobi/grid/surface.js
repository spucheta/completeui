/**
 * @private
 */
nitobi.grid.Surface = function(height,width,element)
{
	this.height=width;
	this.width=height;
	this.element=element;
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.dispose = function()
{
	this.element = null;
}