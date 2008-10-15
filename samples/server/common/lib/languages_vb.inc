<%
'*****************************************************************************
'* @Title: Language utility
'* @File: languages_vb.inc
'* @Author: EBA_DC\jgerard
'* @Date: 9/6/2005 11:46:11 AM
'* @Purpose: This file contains functions relating to human language handling.
'* @Notes: This is the vb version of languages.inc
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
		GetLanguage="en"
	else
		GetLanguage=lang
	end if
End Function
%>