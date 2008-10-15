function openTestPage(testPage) {
	var path = window.location.pathname;
	var splitPath = path.split("/");
	if (splitPath[splitPath.length-1].indexOf(".") != -1) {
		splitPath[splitPath.length-1]="";
	}
	path = splitPath.join("/")+testPage;
	window.open(trim(PATH_Lib) + "Common/Test/Lib/jsunit/testRunner.html?testPage="+window.location.host+path+"&showTestFrame=true&autoRun=true",'mywindow');
}