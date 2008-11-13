<?xml version='1.0'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
	<xsl:output method="html" />

<xsl:template match="//tests">
	

<html>
<head>
    <title>JsUnit Test Suite</title>
    <link rel="stylesheet" type="text/css" href="jsunit/css/jsUnitStyle.css"/>
    <script language="JavaScript" type="text/javascript" src="http://www.jsunit.net/runner/app/jsUnitCore.js"></script>
    <script language="JavaScript" type="text/javascript">

        function coreSuite() {
            var result = new top.jsUnitTestSuite();
            <xsl:apply-templates select="test"/>
            return result;
        }

       function suite() {
            var newsuite = new top.jsUnitTestSuite();
            newsuite.addTestSuite(coreSuite());
            return newsuite;
        }
    </script>
</head>

<body>
<h1>JsUnit Test Suite</h1>

<p>This page contains a suite of tests for testing.</p>
</body>
</html>	
</xsl:template>


<xsl:template match="test">
	result.addTestPage("<xsl:value-of select="@url"/>");
</xsl:template>


</xsl:stylesheet>