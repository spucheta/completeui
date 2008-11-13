<%@ Language=Javascript %>
<!-- #include file="lib/doctype.inc" -->
<%
	Response.Expires=0;
	Response.Buffer = true;
	Response.Clear();
	//Response.ContentType="text/xml";
%>

<%
function getRootUrl()
{
	var serverName = Request.ServerVariables("SERVER_NAME");
	var url = new String(Request.ServerVariables("URL"));
	var i = url.lastIndexOf("/");
	url = "http://" + serverName + url.substr(0,i+1) + "../"; 
	
	return url;
}

var s ="<tests>";
function showAll(dir, url)
{
	var fs,fo;
	fs=Server.CreateObject("Scripting.FileSystemObject");
	fo=fs.GetFolder(dir);
	var fc = new Enumerator(fo.Files);
	for (; !fc.atEnd(); fc.moveNext())
	{
		var x = fc.item();
		
		//Print the name of all files in the test folder
		if (x.name.indexOf(".jsunit.") > 0 && x.name.indexOf(".nodoctype.") == -1)
		{
			var name = url + "/" + x.Name;
			s+="<test url='" +  name + "'/>";
			var urlDir = "/" + name.replace(/http:\/\/.*?\//i,"");
			s+="<test url='" +  switchDocType(urlDir) + "'/>";
		}
	}
	
	fc = new Enumerator(fo.SubFolders);
	fc.moveFirst();
	for (; !fc.atEnd(); fc.moveNext())
	{
		var x = fc.item();
		
		//Print the name of all files in the test folder
		if (x.name.indexOf("svn") == -1)
		{
			showAll(dir + "\\" + x.Name,url + "/" + x.Name);
		}
	}


}

var dir;
var url = Request.ServerVariables("QUERY_STRING"); //Request.QueryString("url");
if (url =="")
{
	url = "/dev/trunk/framework";
}
var serverName = Request.ServerVariables("SERVER_NAME");
dir = Server.MapPath(url);
//Response.Write(dir);
showAll(dir,"http://" + serverName + url);
s+="</tests>";
var htm = XslTransformFromString(s, 'runallunittests.xsl');
Response.Write(htm);
WriteFile(dir + "\\tests.htm",htm);
Response.Redirect(getRootUrl()+"testframework/jsunit/testrunner.html?autorun=true&testpage="+url + "/tests.htm");
%>
