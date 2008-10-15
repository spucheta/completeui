//*****************************************************************************
//* @Title: Global JavaScript Includes
//* @File: test.js
//* @Author: EBA_DC\ngentleman
//* @Date: 5/31/2005 4:29:43 PM
//* @Purpose: All tests have access to these functions. Nothing product-specific belongs here.
//* @Notes: 
//*****************************************************************************

// *****************************************************************************
// * writeLog
// *****************************************************************************
/// <function name="writeLog" access="public">
/// <summary>Takes a string and puts it in the log pane of the main test page. Use for critical errors and the like.</summary>
/// <param name="Message" type="String">The message to write in the log</param>
/// <remarks>TODO: These need rethinking; perhaps a second box for non-critical messages.</remarks></function>
//To keep messages constistent:
var LOG_TestSuccess = "Test Successful";
var LOG_TestFailure = "Test Failed";
var LOG_TestComplete = "Test Complete";
var LOG_TestContinues = "Going to next section...";

//These both need to get re-thought once combo acquires a new debug class interface
function writeLog(Message)
{
	try
	{
		log = window.top.document.getElementById('log');
		if (log == null)
		{
			Eba.addDebugTools();
		}
		log = window.top.document.getElementById('log');
		log.value = Message + '\n' + log.value;
	}
	catch(e)
	{
		try
		{
			log.value = Message + '\n' + log.value;
		}
		catch(e)
		{
		}	
	}
	
	return false;
}
function writeError(Message)
{
	log = window.top.document.getElementById('log');
	log.value = '<< ' + Message + ' >>\n' + log.value;
	return false;
}

// *****************************************************************************
// * dumpHTMLContent
// *****************************************************************************
/// <function name="dumpHTMLContent" access="public">
/// <summary>For pages with dynamic HTML source, opens a window with the source code at that instance.</summary>
/// <remarks></remarks></function>
function dumpHTMLContent()
{
	// the functional code is in the page dump.html
	window.open(PATH_Lib + "/Common/Test/Lib/dump.html","sourceWindow","resizable=yes scrollbars=no menubar=no");
	return false;
}
// *****************************************************************************
// * setCookie
// *****************************************************************************
/// <function name="setCookie" access="public">
/// <summary>Creates a cookie of name name and value value.</summary>
/// <param name="name" type="string">The name of the cookie you wish to set</param>
/// <param name="value" type="string">The value you wish to set that cookie to</param></function>
function setCookie(Name, Value)
{
	document.cookie = Name + "=" + escape(Value) + "; path=/";
	return false;
}
// *****************************************************************************
// * getCookie
// *****************************************************************************
/// <function name="getCookie" access="public">
/// <summary>Gets the value of a named cookie</summary>
/// <param name="name" type="string">The name of the cookie</param>
/// <returns type="string">Value of the cookie</returns></function>
function getCookie(Name)
{
	cookie = document.cookie;
	start = cookie.indexOf(Name + "=");
	if (start == -1) return null;
	
	// Don't include the name= portion.
	start += Name.length + 1;
	
	end = cookie.indexOf(";", start);
	if (end == -1) end = cookie.length;
	
	return cookie.substring(start, end);
}

// *****************************************************************************
// * GetRoot
// *****************************************************************************
/// <function name="GetRoot" access="public">
/// <summary>Find the path to the root of Components-tree</summary><remarks></remarks>
/// <returns type="string">The path to the root directory [Components]</returns></function>
function GetRoot()
{
	//var here = new String(document.location).toLowerCase();
	//TODO: check if this breaks when mapping folder/ transparently to folder/index.htm
	//here = here.substring(here.indexOf("components"));
	/*
	var rootPath = "";
	for (var i = 0; i < here.length; i++)
	{
		if (here.charAt(i) == "/") rootPath += "../";
	}
	//This returns one too many levels because it counts a /file.ext that Server.MapPath missses.
	return rootPath.substring(3);
	*/
	var path = window.location.pathname;
	var splitPath = path.split("/");
	return "/"+splitPath[1]+"/";
}

// *****************************************************************************
// * MantisLink
// *****************************************************************************
/// <function name="MantisLink" access="public">
/// <summary>Appends the location of the page and open the given url in a new window.</summary>
/// <param name="UrlString" type="string">The url to open</param></function>
function MantisLink(UrlString)
{
	var location = new String(window.top.location).toLowerCase();
	location = location.substring(location.indexOf("components"));
	
	var description = "A test in the test framework failed.\nSee it on QA:\nhttp://qa/tests/" + location;
	description = description + "\nor on your local machine:\nhttp://localhost/vss/" + location;
	
	UrlString = UrlString + "&description=" + escape(description);
	window.open(UrlString, "MantisWindow", "location=no,menubar=no,toolbar=no,width=780,height=270");
	return false;
}