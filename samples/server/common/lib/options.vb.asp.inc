<%
'*****************************************************************************
'* @Author: EBA_DC\jgerard
'* @Date: 9/6/2005 11:46:11 AM
'* @Purpose: This file contains accessors for the settings in the framework option page.
'* @Notes: This is the vb version of options.js.asp.inc
'*****************************************************************************

' *****************************************************************************
' * GetLanguage
' *****************************************************************************
' <function name="GetLanguage" access="public">
' <summary>Returns the language type. If none is specified, en is returned.</summary>
' <returns type="string">The ISO language.</returns>
' </function>

Function GetLanguage()
	dim lang
	lang = Request.Cookies("productlanguage")
	if (lang = "") then
		lang = Request.QueryString("lang")
	end if
	if (lang = "") then
		GetLanguage="en"
	else
		GetLanguage=lang
	end if
End Function
%>