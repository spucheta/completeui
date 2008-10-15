<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes"/>
	<xsl:template match="interface">
		<xsl:call-template name="initJSDefaults"/>
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template name="initJSDefaults">
		var elem = this.Declaration.grid.documentElement;
		var valueFromHtml;
	</xsl:template>
	
	<xsl:template match="properties | events">
		<xsl:for-each select="*">
			valueFromHtml = <xsl:choose><xsl:when test="@htmltag">elem.getAttribute("<xsl:value-of select="@htmltag"/>")</xsl:when><xsl:otherwise>elem.getAttribute("<xsl:value-of select="@name"/>")</xsl:otherwise></xsl:choose>;
			if (valueFromHtml)
			{
				this.set<xsl:value-of select="@name"/>(valueFromHtml);
			}
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template match="text()"/>
</xsl:stylesheet>
