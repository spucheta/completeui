//*****************************************************************************
//* @Title: Javascript Lib for Main Page
//* @File: index.js
//* @Author: EBA_DC\ngentleman
//* @Date: 7/26/2005 11:03:28 AM
//* @Purpose: Javascript functions for the test framework main page; tree interaction and iframe handling
//* @Notes: 
//*****************************************************************************

// *****************************************************************************
// * descPopup
// *****************************************************************************
/// <function name="descPopup" access="public">
/// <summary>Shows a tooltip-type hint, getting content from an element on the page.</summary>
/// <param name="ContentID" type="string">ID of the element containing the content to display</param>
/// <param name="e" type="event">The calling event (For Gecko)</param><remarks></remarks></function>
function descPopup(ContentID, e)
{
	//Differing IE/Gecko event models handled here
	if (!e) e = window.event;
	if (e.pageY)
	{
		y = parseInt(e.pageY);
	}
	else
	{
		y = parseInt(e.clientY) + parseInt(document.body.scrollTop);
	}
	var div = document.getElementById('tooltip')
	div.innerHTML = document.getElementById('desc_' + ContentID).innerHTML;
	div.style.top = y + "px";
	div.style.display = "block";
}

// *****************************************************************************
// * descUnPopup
// *****************************************************************************
/// <function name="descUnPopup" access="public">
/// <summary>Removes the tooltip window</summary><remarks></remarks></function>
function descUnPopup()
{
	document.getElementById('tooltip').style.display = "none";
}

// *****************************************************************************
// * toggleGroup
// *****************************************************************************
/// <function name="toggleGroup" access="public">
/// <summary>Tracks visibility status and toggles visiblility of a element</summary>
/// <param name="id" type="">ID of the element</param>
/// <remarks>testsList.xsl places calls to this function for each test-group</remarks></function>
function toggleGroup(id)
{
	var style = document.getElementById(id).style;
	if (style.display == "none")
	{
		style.display = 'block';
	} 
	else 
	{
		style.display = 'none';
	}
}

// *****************************************************************************
// * toggleSidebar
// *****************************************************************************
/// <function name="toggleSidebar" access="public">
/// <summary>Toggle slim/full sidebar to see more of the test frame</summary><remarks></remarks></function>
var sidebarIsHidden = false;
function toggleSidebar() 
{
	if (sidebarIsHidden)
	{
		document.getElementById('list').style.display = 'block';
		document.getElementById('hider').innerHTML = "«";
		document.getElementById('hider').style.left = "185px";
	}
	else
	{
		document.getElementById('list').style.display = 'none';
		document.getElementById('hider').style.left = "0";
		document.getElementById('hider').innerHTML = "»";
	}
	sidebarIsHidden = !sidebarIsHidden;
	// this was the point of resizing, to see more of the test frame.
	sizeFrames();
}

// *****************************************************************************
// * sizeIFrame
// *****************************************************************************
/// <function name="sizeIFrame" access="public">
/// <summary>Resizes the iframe to fit page width and height</summary>
/// <remarks></remarks></function>
function sizeIFrame() 
{
	var root = document.documentElement.clientHeight ? document.documentElement : document.body;
	document.getElementById('test').style.height = (root.clientHeight - 129) + "px";
	
	if (sidebarIsHidden) 
	{
		document.getElementById('test').style.width = (root.clientWidth) + "px";
	}
	else
	{
		document.getElementById('test').style.width = (root.clientWidth - 188) + "px";
	}
}

// *****************************************************************************
// * sizeLog
// *****************************************************************************
/// <function name="sizeLog" access="public">
/// <summary>Resizes the log textarea to fit page width and height</summary><remarks></remarks></function>
function sizeLog() 
{
	var root = document.documentElement.clientHeight ? document.documentElement : document.body;
	if (sidebarIsHidden) 
	{
		//document.getElementById('log').style.width = (root.clientWidth) + "px";
	}
	else
	{
		//document.getElementById('log').style.width = (root.clientWidth - 188) + "px";
	}
}

//Shortcut to the real functions - also allows for if another frame gets added.
function sizeFrames()
{
	sizeIFrame();
	sizeLog();
}

// *****************************************************************************
// * windowInit
// *****************************************************************************
/// <function name="windowInit" access="public">
/// <summary>Called onload of the index page, sets the sizing of the frames</summary>
/// <remarks>Is a bit of an issue in that it waits until the page is fully loaded, so can have 
/// a half-loaded test page hidden by bad frame sizing until everything finishes</remarks></function>
function windowInit()
{
	sizeFrames();
	window.onresize = sizeFrames;
}