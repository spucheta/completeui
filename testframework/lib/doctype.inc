<!-- #include file="filehandler.inc" -->
<%
function switchDocType(url)
{
	var path = Server.MapPath(url);
	var filename = path.substr(path.lastIndexOf("\\")+1);
	var name = filename.substr(filename,filename.lastIndexOf("."));
	var ext = filename.substr(filename.lastIndexOf(".")+1);
	var dir = path.substr(0,path.lastIndexOf("\\") + 1);
	
	var txt = OpenFile(url);
	txt = txt.replace(/<!DOCTYPE.*>/ig,"");
	
	
	var newFileName = name + ".nodoctype." + ext;
	WriteFile(dir + newFileName,txt);
	
	url = new String(url);
	url = url.substr(0,url.lastIndexOf("/")+1) + newFileName;
	return url;
}
%>