<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:ntb="http://www.nitobi.com">
	<xsl:param name="guid" select="0"/>

<xsl:template match="/">
	<xsl:apply-templates/>
</xsl:template>


<xsl:template match="node()|@*">
	<xsl:copy>
		<xsl:if test="not(@xid)">
			<xsl:attribute name="xid" ><xsl:value-of select="generate-id(.)"/><xsl:value-of select="position()"/><xsl:value-of select="$guid"/></xsl:attribute>
		</xsl:if>
		<xsl:apply-templates select="./* | text() | @*">
		</xsl:apply-templates>
	</xsl:copy>
</xsl:template> 

<xsl:template match="text()">
	<xsl:value-of select="."/>
</xsl:template>
</xsl:stylesheet>
    