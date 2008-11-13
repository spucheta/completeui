<%@ Language=Javascript %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- #include file="lib/filehandler.inc" -->
<%




function getRootUrl()
{
	var serverName = Request.ServerVariables("SERVER_NAME");
	var url = new String(Request.ServerVariables("URL"));
	var i = url.lastIndexOf("/");
	url = "http://" + serverName + url.substr(0,i+1) + "../"; 
	
	return url;
}

function getRootUrlDir()
{
	var serverName = Request.ServerVariables("SERVER_NAME");
	var url = new String(Request.ServerVariables("URL"));
	var i = url.lastIndexOf("/");
	url = url.substr(0,i+1) + ".."; 
	
	return url;
}

function normalizePath(path)
{
	path = path.replace(/\.*?\/\.\./ig,"");
}

function getRootFileDir()
{
	var serverName = Request.ServerVariables("SERVER_NAME");
	var url = new String(Request.ServerVariables("URL"));
	
	var dir = Server.MapPath(url);
	dir = dir.replace(/\\/g,"/");
	dir = dir.substr(0,dir.lastIndexOf("/"));
	dir = dir.substr(0,dir.lastIndexOf("/"));
	
	return dir;
}
%><html>
<head>
	<link type="text/css" rel="stylesheet" href="index.css" />
	
	<script src="index.js" type="text/javascript"></script>
	<link type="text/css" rel="stylesheet" href="Lib/fvlogger/logger.css"/>
	<script src="Lib/fvlogger/logger.js" type="text/javascript"></script>
	<title>Testing</title>
	
	<link rel="stylesheet" type="text/css" href="css/screen.css">
	<script type="text/javascript" src="lang/eba.inheritance.js" ></script>
	<script type="text/javascript" src="tree/script/YAHOO.js" ></script>
	<script type="text/javascript" src="tree/script/log.js"></script>
	<script type="text/javascript" src="tree/script/event.js"></script>
	<script type="text/javascript" src="tree/script/connect.js"></script>
	<script type="text/javascript" src="tree/script/animation.js"></script>
	<script type="text/javascript" src="tree/script/dom.js"></script>
	<script type="text/javascript" src="tree/script/nitobi.tree.js" ></script>
	
	<script type="text/javascript" src="tree/script/treeview.js" ></script>
	<script type="text/javascript" src="tree/script/TaskNode.js"></script>
	
	<script type="text/javascript" src="xml/eba.xml.js" ></script>
	<script type="text/javascript" src="http/eba.callback.js" ></script>
	<link rel="stylesheet" type="text/css" href="tree/css/folders/tree.css">	
	<style>
		body
		{
			font-size:8pt;
		}
	</style>
	
	<script type="text/javascript">
		

		function normalizePath(path)
		{
			path = path.replace(/\/[^\/]*\/\.\./ig,"");
			return path;
		}

		function onNodeClick(path)
		{
			
			<% 
			Response.Write("var mapPath = '" + getRootFileDir() + "';") 
			Response.Write("var root = '" + getRootUrl() + "';") 
			Response.Write("var urlDir = '" + getRootUrlDir() + "';") 
			
			// Response.Cookies("nitobi.testroot") = url;
			%>
			path = path.substr(mapPath.length);
			var frame = document.getElementById("test");
			
			var src;
			if (path.indexOf(".jsunit.") > -1)
			{
				path = root + "testframework/jsunit/testRunner.html?autorun=true&testpage=" + urlDir + path; 
				src = normalizePath(path);
				window.open(src)
			}
			else
			{
				src = root + path; 
				frame.src = src;
			}
		}
		
		function addTest(id,path)
		{
			eval(id + 'tree = new Qr.Tree(id,id,true,"treeprovider.asp","tree/xsl/multi_tree.xsl","<%=getRootFileDir() %>" + path ,onNodeClick,null)');
			eval(id + 'tree.render()');	
		}
		
		function runUnitTests(path)
		{
			<% 
			Response.Write("var mapPath = '" + getRootFileDir() + "';") 
			Response.Write("var root = '" + getRootUrl() + "';") 
			Response.Write("var urlDir = '" + getRootUrlDir() + "';") 
			
			// Response.Cookies("nitobi.testroot") = url;
			%>
			//path = path.substr(mapPath.length);
			
			
			var src;
			path = root + "testframework/runallunittests.asp?" + (urlDir + "/" + path); 
			src = normalizePath(path);
			window.open(src)
			
		}


	</script>
	
</head>
<body onload="windowInit();">
	<div id="hider" onclick="toggleSidebar();">«</div>
	<div id="list">
		<div style="width:400px">
		<div><a href="#" onclick="runUnitTests('.')"> <img border="0" src="checkmark.gif">All</a></div>		
		<!-- component trees -->
		<!-- add new products here, and if versioning EBALib, remove ones that depend on the old version -->
		<!-- Re-add when combo the new version of combo is ready. -->
		<div><a href="#" onclick="runUnitTests('tabstrip/test')"> <img border="0" src="checkmark.gif">TabStrip</a></div>		
		<div id="tabstrip"></div>
		<script>addTest("tabstrip","/tabstrip/test");</script>
		
		<div><a href="#" onclick="runUnitTests('tree/test')"> <img border="0" src="checkmark.gif">Tree</a></div>		
		<div id="tree"></div>
		<script>addTest("tree","/tree/test");</script>

		<div><a href="#" onclick="runUnitTests('datepicker/test')"> <img border="0" src="checkmark.gif">DatePicker</a></div>		
		<div id="datepicker"></div>
		<script>addTest("datepicker","/datepicker/test");</script>
		
		<div><a href="#" onclick="runUnitTests('toolkit/test')"> <img border="0" src="checkmark.gif">Toolkit</a></div>		
		<div id="toolkit" style="overflow:auto;"></div>
		<script>addTest("toolkit","/toolkit/test");</script>
		</div>
		
		<div><a href="#" onclick="runUnitTests('toolkit/test')"> <img border="0" src="checkmark.gif">TreeGrid</a></div>		
		<div id="treegrid" style="overflow:auto;"></div>
		<script>addTest("treegrid","/treegrid/test");</script>
		</div>
	</div>
	
	<iframe style="float:left" id="test" name="test" frameborder="0"></iframe>
	
	<div id="fvlogger" style="width:800px;float:left;overflow:auto;height:100px">
  <dl>
    <dt>fvlogger</dt>
    <dd class="all">
      <a href="#fvlogger" onclick="showAll();" 
        title="show all">all</a>
    </dd>
    <dd class="debug">
      <a href="#fvlogger" onclick="showDebug();" 
        title="show debug">debug</a>
    </dd>
    <dd class="info">
      <a href="#fvlogger" onclick="showInfo();" 
        title="show info">info</a>
    </dd>
    <dd class="warn">
      <a href="#fvlogger" onclick="showWarn();" 
        title="show warnings">warn</a>
    </dd>
    <dd class="error">
      <a href="#fvlogger" onclick="showError();" 
        title="show errors">error</a>
    </dd>
    <dd class="fatal">
      <a href="#fvlogger" onclick="showFatal();" 
        title="show fatals">fatal</a>
    </dd>
    <dd>
      <a href="#fvlogger" onclick="eraseLog(true);" 
        title="erase">erase</a>
      </dd>
  </dl>
</div>
	<!-- <textarea id="log" name="log"></textarea> -->
	<div id="tooltip"></div> 
</body>
</html>