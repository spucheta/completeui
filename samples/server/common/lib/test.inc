<!-- #include file="filehandler.inc" -->
<%
//*****************************************************************************
//* @Title: Global ASP Includes
//* @File: test.inc
//* @Author: EBA_DC\ngentleman
//* @Date: 5/31/2005 4:35:12 PM
//* @Purpose: All tests have access to these functions. Noting product-specific belongs here.
//* @Notes: More general file-system functions are separate in filehandler.inc
//*****************************************************************************

// *****************************************************************************
// * includeTestGlobals
// *****************************************************************************
/// <function name="includeTestGlobals" access="public">
/// <summary>Shortcut to including the Global CSS and JS</summary>
/// <remarks>Use this function rather than including them manually, as this list may change.</remarks></function>
function IncludeTestGlobals()
{
	Response.Write('<link type="text/css" rel="stylesheet" href="' + PATH_LibTest + 'Lib/test.css"></link>\n');
	Response.Write('<script type="text/javascript" src="' + PATH_LibTest + 'Lib/test.js"></script>\n');

	//Automatic Test Framework.
	Response.Write('<script type="text/javascript" src="' + PATH_LibTest + 'Lib/testgroup.js"></script>\n');
	Response.Write('<script type="text/javascript" src="' + PATH_LibTest + 'Lib/testitem.js"></script>\n');

	//Timer Class
	Response.Write('<script type="text/javascript" src="' + PATH_LibTest + 'Lib/timer.js"></script>\n');
}

// *****************************************************************************
// * WriteGlobalTestHeader
// *****************************************************************************
/// <function name="WriteGlobalTestHeader" access="private">
/// <summary>Writes title, descripion, tools, etc to the page</summary>
/// <param name="Title" type="string">Title of the page</param>
/// <param name="Description" type="string">Page's description</param>
/// <param name="Tools" type="string">Items to add to the default toolbar</param>
/// <param name="FailureString" type="string">Mantis link string containing summary, category and project_id.
/// See combotest.inc's WriteComboTestHeader for example.</param>
/// <remarks>Don't call this function directly from a test page. Instead, have a product-specific version
/// catch your request and call this. For example, see WriteComboTestHeader in combotest.inc.</remarks></function>
function WriteGlobalTestHeader(Title, Description, Tools, FailureString)
{
	Response.Write("<h1>" + Title + "</h1>\n");
	Response.Write("<p>" + Description + "\n");
	// Don't HAVE to write the Mantis integration link, being friendly to the test author.
	if (FailureString != -1)
	{
		if (Description != "")
		{
			Response.Write("<br>");
		}
		Response.Write("<a href=\"#\" onclick=\"return MantisLink('http://qa/defects/bug_report_reduced_page.php?severity=60" + FailureString + "');\">Submit Failure Report</a>\n");
	}
	Response.Write("</p>\n");
	// Don't HAVE to write the toolbar.
	if (Tools != -1)
	{
		Response.Write("<p class=\"tools\">" + Tools + "<a href=\"#\" onclick=\"dumpHTMLContent(); return false;\">Dump HTML</a></p>\n");
	}
}
%>