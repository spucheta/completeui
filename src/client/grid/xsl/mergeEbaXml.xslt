<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:ntb="http://www.nitobi.com">
	
	<xsl:output method="xml" omit-xml-declaration="no" />
	<xsl:param name="startRowIndex" select="100" ></xsl:param>
	<xsl:param name="endRowIndex" select="200" ></xsl:param>
	<xsl:param name="guid" select="1"></xsl:param>
	<xsl:key name="newData" match="/ntb:grid/ntb:newdata/ntb:data/ntb:e" use="@xi" />
	<xsl:key name="oldData" match="/ntb:grid/ntb:datasources/ntb:datasource/ntb:data/ntb:e" use="@xi" />
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
					<xsl:copy-of select="key('newData',@xi)/@*" />
				</xsl:copy>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="@*|node()" />
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="/ntb:grid/ntb:datasources/ntb:datasource/ntb:data">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
			<xsl:for-each select="/ntb:grid/ntb:newdata/ntb:data/ntb:e">
				<xsl:if test="not(key('oldData',@xi))"> 
					<xsl:element name="ntb:e" namespace="http://www.nitobi.com">
						<xsl:copy-of select="@*" />
						<xsl:attribute name="xid"><xsl:value-of select="generate-id(.)"/><xsl:value-of select="position()"/><xsl:value-of select="$guid"/></xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="/ntb:grid/ntb:newdata/ntb:data/ntb:e">
		<xsl:copy>
			<xsl:copy-of select="@*" />
			<xsl:variable name="oldData" select="key('oldData',@xi)"/>
			<xsl:choose>
				<xsl:when test="$oldData">
					<xsl:copy-of select="$oldData/@*" />
					<xsl:copy-of select="@*" />					
					<xsl:attribute name="xac">u</xsl:attribute>
					<xsl:if test="$oldData/@xac='i'">
						<xsl:attribute name="xac">i</xsl:attribute>
					</xsl:if>					
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="xid"><xsl:value-of select="generate-id(.)"/><xsl:value-of select="position()"/><xsl:value-of select="$guid"/></xsl:attribute>
					<xsl:attribute name="xac">i</xsl:attribute>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:copy>
	</xsl:template>	 
</xsl:stylesheet>
    