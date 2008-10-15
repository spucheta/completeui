// *****************************************************************************
// * GetLanguage
// *****************************************************************************
/// <function name="GetLanguage" access="public">
/// <summary>Returns the language type. If none is specified, en is returned.</summary>
/// <returns type="string">The ISO language.</returns>
/// </function>
function GetLanguage() 
{
	var lang = Request.Cookies('productlanguage');
	if (lang.Count > 0)
	{
		return lang;
	}
	else
	{
		return "en";
	}
	
}
