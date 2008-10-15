<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:ntb="http://www.nitobi.com">
	
	<xsl:output method="xml" omit-xml-declaration="no" />
	<xsl:param name="startRowIndex" select="0" ></xsl:param>
	<xsl:param name="endRowIndex" select="10000" ></xsl:param>
	<xsl:param name="value" select="test"></xsl:param>
	<xsl:param name="column" select="a"></xsl:param>
	<xsl:template match="@* | node()" >
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />			
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="/ntb:grid/ntb:datasources/ntb:datasource/ntb:data/ntb:e">
		<xsl:choose>
			<xsl:when test="(number(@xi) &gt;= $startRowIndex) and (number(@xi) &lt;= $endRowIndex)">
				<xsl:copy>
					<xsl:copy-of select="@*" />
					<xsl:attribute name="{$column}"><xsl:value-of select="$value" /></xsl:attribute>
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="@*|node()" />
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
    