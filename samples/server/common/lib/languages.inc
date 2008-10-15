//*****************************************************************************
//* @Title: Language utility
//* @File: languages.inc
//* @Author: EBA_DC\jgerard
//* @Date: 9/6/2005 11:46:11 AM
//* @Purpose: This file contains functions relating to human language handling.
//* @Notes: 
//*****************************************************************************

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
