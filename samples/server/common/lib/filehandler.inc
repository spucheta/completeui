<!-- #include file="versionnumbers.inc" -->
<%
//*****************************************************************************
//* @Title: File Handling Library
//* @File: filehandlerlib.inc
//* @Author: EBA_DC\jgerard
//* @Date: 7/18/2005 12:49:10 PM
//* @Purpose: Various functions that deal with file handling.
//* @Notes: Automatically included in test.inc -- you don't need to call this directly.
//*****************************************************************************

// *****************************************************************************
// * OpenFile
// *****************************************************************************
/// <function name='OpenFile' access='public'><summary>
/// Returns the contents of a text file.
/// </summary>
/// <param name='FileName' type='string' >The path and filename.</param>
/// <remarks></remarks><returns type='void'></returns></function>
function OpenFile(FileName)
{
	var ForReading = 1, ForWriting = 2, ForAppending = 3;
	var TristateUseDefault = -2, TristateTrue = -1, TristateFalse = 0;

	// Create a filesystem object
	var FSO;
	FSO = Server.CreateObject("Scripting.FileSystemObject");

	// Map the logical path to the physical system path
	var Filepath;
	Filepath = Server.MapPath(FileName);
	var Contents;

	if (FSO.FileExists(Filepath)) 
	{
		TextStream = FSO.OpenTextFile(Filepath, ForReading, false, TristateUseDefault);

		// Read file in one hit
		Contents = TextStream.ReadAll();
		TextStream.Close();
		TextStream = null;
	}	
	else
	{
		throw "File does not exist";
	}

	FSO = null;
	return Contents;
}


// *****************************************************************************
// * MakeDirWritable
// *****************************************************************************
/// <function name='MakeDirWritable' access='public'><summary>
/// Makes all the files in a dir and its subdirs writable.
/// </summary>
/// <param name='Dir' type='string' >The directory.</param>
/// <remarks></remarks><returns type='void'></returns></function>
function MakeDirWritable(Dir)
{
	var FSO;
	FSO = Server.CreateObject("Scripting.FileSystemObject");
	var READONLY = 1;
	var files = FSO.GetFolder(Dir).Files;
	fc = new Enumerator(files);
	for (; !fc.atEnd(); fc.moveNext())
	{
		fc.item().Attributes = fc.item().Attributes & !(READONLY);
	}
	
	var folders = FSO.GetFolder(Dir).SubFolders;
	var folder = new Enumerator(folders);
	for (; !folder.atEnd(); folder.moveNext())
	{
		MakeDirWritable(folder.item());
	}
	
}

// *****************************************************************************
// * CopyDir
// *****************************************************************************
/// <function name='CopyDir' access='public'><summary>
/// Copies the *contents* of one dir to another dir.
/// </summary>
/// <param name='SourceDir' type='string' >The source directory.</param>
/// <param name='TargetDir' type='string' >The target directory.</param>
/// <remarks>This makes the target dir writable, so that copying read-only files repeatedly works.</remarks><returns type='void'></returns></function>
function CopyDir(SourceDir,TargetDir)
{
	var FSO;
	MakeDirWritable(Server.MapPath(TargetDir));
	FSO = Server.CreateObject("Scripting.FileSystemObject");
	FSO.CopyFolder (Server.MapPath(SourceDir),Server.MapPath(TargetDir),true);
}

// *****************************************************************************
// * DynamicInclude
// *****************************************************************************
/// <function name="DynamicInclude" access="public">
/// <summary>Includes an asp page, during runtime.</summary>
/// <param name="File" type="str">Path to the target file.</param>
/// <remarks></remarks>
/// <returns type="str">eval() the returned text in global scope.</returns>
/// </function>
function DynamicInclude(File)
{
	return FixInclude(OpenFile(File));
}
function FixInclude(Content)
{
	startTag = Content.indexOf("<" + "%");
	endTag = Content.indexOf("%" + ">");

	if (startTag > -1)
	{
		before = Content.substring(0, startTag);
		before = "Response.Write(\"" + before.replace(/\"/g,"\\\"").replace(/\n|\r|\t/g,"") + "\");";

		middle = Content.substring(startTag + 2, endTag);

		after = Content.substring(endTag + 2);

		return before + middle + FixInclude(after);
	}
	else
	{
		return "Response.Write(\"" + Content.replace(/\"/g,"\\\"").replace(/\n|\r|\t/g,"") + "\");";
	}
}

// *****************************************************************************
// * GetRoot
// *****************************************************************************
/// <function name="GetRoot" access="public">
/// <summary>Find the path to the root of Components-tree</summary>
/// <remarks></remarks>
/// <returns type="string">The path to the root directory [Components]</returns>
/// </function>
function GetRoot()
{
	var here = Server.MapPath(".").toLowerCase();
	here = here.substring(here.indexOf("eba"));
	var rootPath = "";
	for (var i = 0; i < here.length; i++)
	{
		if (here.charAt(i) == "\\") rootPath += "../";
	}
	return "../" + rootPath;

//return Server.MapPath("/");
}

// *****************************************************************************
// * GetLibRoot
// *****************************************************************************
/// <function name="GetLibRoot" access="public">
/// <summary>Returns the current URL to the correct version of the EBALib directory.</summary>
/// <remarks>You can modify the version numbers by modifying versionnumbers.inc</remarks>
/// <returns type="string">The current path to EBALib</returns>
/// </function>
function GetLibRoot()
{
	return (GetRoot() + 'EBALib/v' + LIB_VERSION);
}

// *****************************************************************************
// * GetComboRoot
// *****************************************************************************
/// <function name="GetComboRoot" access="public">
/// <summary>Returns the current URL to the correct version of the EBALib directory.</summary>
/// <remarks>You can modify the version numbers by modifying versionnumbers.inc. Use this
/// only if you are working in the lib directory. This should not be used inside the combo project.</remarks>
/// <returns type="string">The current path to combo.</returns>
/// </function>
function GetComboRoot()
{
	return (GetRoot() + 'EBACombo/v' + COMBO_VERSION);
}

// *****************************************************************************
// * XslTransform
// *****************************************************************************
/// <function name="XslTransform" access="public">
/// <summary>Transforms an XML document according to an XSL stylesheet</summary>
/// <param name="XML" type="string">Path to the file</param>
/// <param name="XSL" type="string">Path to the file</param>
/// <remarks>Writes directly to the output stream</remarks>
/// </function>
function XslTransform(XML, XSL)
{
	try
	{
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		xmlDoc.async = false;
		xmlDoc.load(Server.Mappath(XML));

		var xslDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		xslDoc.async = false;
		xslDoc.load(Server.Mappath(XSL));
		var out = xmlDoc.transformNode(xslDoc);
		if (out) Response.Write(out);
		else 
		{ %>
			<script type="text/javascript">
			alert("Error in XSL Transformation");
			</script>		
		<% }
	}
	catch(err)
	{ %>
		<script type="text/javascript">
		alert("Error in XSL Transformation\n <%= err.message %>");
		</script>
	<% }
}
%>