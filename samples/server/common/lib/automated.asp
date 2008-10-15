<%@ Language=Javascript %><% Response.ContentType = "text/xml"; %><?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!--
//*****************************************************************************
//* @Title: Run All Automatic Tests XSLT
//* @File: automated.xsl.asp
//* @Author: EBA_DC\ngentleman
//* @Date: 7/26/2005 1:44:55 PM
//* @Purpose: Writes a series of iframes containing all automatic tests.
//* @Notes: Wrapped in asp to allow for includes
//*****************************************************************************
-->
<xsl:output omit-xml-declaration="yes" method="html"/>

<xsl:template match="/">
<html>
	<head>
		<style type="text/css"><!-- #include file="test.css" --></style>
	</head>
	<body>
		<h1>All Automatic Tests</h1>
		<xsl:apply-templates/>
	</body>
</html>
</xsl:template>

<xsl:template match="test">
	<xsl:if test="@automatic">
		<iframe>
			<xsl:attribute name="src">../../../<xsl:value-of select="@src"/></xsl:attribute>
			if there's no text here, the iframe tag will collapse to &lt;iframe /&gt;, which does not work correctly.
		</iframe>
	</xsl:if>
</xsl:template>

<xsl:template match="test-group">
	<xsl:apply-templates/>
</xsl:template>

</xsl:stylesheet>