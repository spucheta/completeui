<script runat="server" language="c#">
string GetCookie(string cookiename)
{
	string cookyval="";
	try
	{
	cookyval= Request.Cookies[cookiename].Value;
	}
	catch(Exception e)
	{
		cookyval="";
	}
	return cookyval;
}

string GetLanguage()
{
	string lang = GetCookie("productlanguage");
	if (lang=="") lang="en";
	return(lang);
}
</script>