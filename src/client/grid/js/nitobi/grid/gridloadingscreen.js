/**
 * @class
 * @private
 */
nitobi.grid.LoadingScreen = function(grid)
 {
 	this.loadingScreen = null;
 	this.grid = grid;
	this.loadingImg = null;
 
 }
nitobi.grid.LoadingScreen.prototype.initialize = function()
{
	this.loadingScreen = document.createElement("div");
	var cssUrl = this.findCssUrl();
	var msg="";
	if (cssUrl == null)
	{
		msg = "Loading...";	
	}
	else
	{
		msg = "<img src='"+cssUrl+"loading.gif'  class='ntb-loading-Icon' valign='absmiddle'></img>"; 
	}
	this.loadingScreen.innerHTML = "<table style='padding:0px;margin:0px;' border='0' width='100%' height='100%'><tr style='padding:0px;margin:0px;'><td style='padding:0px;margin:0px;text-align:center;font:verdana;font-size:10pt;'>"+msg+"</td></tr></table>";
	this.loadingScreen.className = 'ntb-loading';
	var lss = this.loadingScreen.style;
	lss.verticalAlign="middle";
	lss.visibility = 'hidden';
	lss.position = "absolute";
	lss.top = "0px";
	lss.left = "0px";
}

nitobi.grid.LoadingScreen.prototype.attachToElement = function(element)
{
	element.appendChild(this.loadingScreen);
}

nitobi.grid.LoadingScreen.prototype.findCssUrl = function()
{
	var sheet = nitobi.html.findParentStylesheet(".ntb-loading-Icon");
	if (sheet==null)
	{
		return null;
	}
	var retVal = nitobi.html.normalizeUrl(sheet.href);
	if (nitobi.browser.IE)
	{
		while (sheet.parentStyleSheet)
		{
			sheet = sheet.parentStyleSheet;
			retVal = nitobi.html.normalizeUrl(sheet.href) + retVal;
		}
	}
	return retVal;
}
 
nitobi.grid.LoadingScreen.prototype.show = function()
{
	try
	{
		this.resize();

		this.loadingScreen.style.visibility="visible";
		this.loadingScreen.style.display="block";
	}
	catch(e)
	{
		
	}
}

nitobi.grid.LoadingScreen.prototype.resize = function()
{
	this.loadingScreen.style.width = this.grid.getWidth() + "px";
	this.loadingScreen.style.height = this.grid.getHeight() + "px";
}

nitobi.grid.LoadingScreen.prototype.hide = function()
{
	this.loadingScreen.style.display="none";
}

