nitobi.lang.defineNs("nitobi.debug");

nitobi.debug.ALLOPTIONS = 0xFFFFFFF;
nitobi.debug.SHOWDOCTYPEICON = 1;
nitobi.debug.LOADJSUNIT = 1 << 1;

nitobi.debug.openPageWithDocType = function()
{
	var src = nitobi.testframework.frameworkBaseDir + "/switchdoctype.asp";
	src = src + "?" + window.location.pathname;
	src = src.replace(/([^:])(\/\/)/ig,function ($1, $2) {return ($1[0] + "/")});
	window.open(src)
}

nitobi.debug.addTools = function()
{
	document.writeln("<div style='width:100%;float:left;'><div style='float:right'><img src='http://help.eclipse.org/help31/topic/org.eclipse.wst.xmleditor.doc.user/images/doctype.gif' onclick='nitobi.debug.openPageWithDocType()' style='cursor:pointer' title='Open page with doctype'/></div></div>");
	
}

nitobi.debug.addTools();