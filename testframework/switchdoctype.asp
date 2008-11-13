<%@ Language=Javascript %>
<!-- #include file="lib/doctype.inc" -->
<%
	Response.Expires=0;
	Response.Buffer = true;
	Response.Clear();
%>

<%
var url = Request.ServerVariables("QUERY_STRING"); 
if (url =="")
{
	url = "/dev/trunk/framework";
}
var serverName = Request.ServerVariables("SERVER_NAME");

url = switchDocType(url);

Response.Redirect(url);

%>
