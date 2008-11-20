/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.ui");
if (false)
{
	/**
	 * @namespace The nitobi.ui namespace contains classes for building Ajax components.
	 * @constructor
	 */
	nitobi.ui = function(){};
}

/**
 * @private
 */
nitobi.ui.setWaitScreen = function(onOff) {
	
	if (onOff) {
	var sc = nitobi.html.getBodyArea();
	var me = nitobi.html.createElement('div', {"id":"NTB_waitDiv"}, {"verticalAlign":"middle","color":"#000000","font":"12px Trebuchet MS, Georgia, Verdana","textAlign":"center","background":"#ffffff","border":"1px solid #000000","padding":"0px","position":"absolute", "top":(sc.clientHeight/2)+sc.scrollTop-30+"px", "left":(sc.clientWidth/2)+sc.scrollLeft-100+"px", "width":"200px", "height":"60px"});
	me.innerHTML = "<table height=60 width=200><tr><td valign=center height=60 align=center>Please wait..</td></tr></table>";
	document.getElementsByTagName('body').item(0).appendChild(me);
	} else {
		
		var me = $ntb('NTB_waitDiv');
		try {
		document.getElementsByTagName('body').item(0).removeChild(me);	
		} catch(e) {}
		
	}
	
}