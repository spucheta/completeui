<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	<xsl:param name="defaultAction"></xsl:param>
	<xsl:param name="startXid" select="100" ></xsl:param>
	<xsl:key name="newData" match="/ntb:treegrid/ntb:newdata/ntb:data/ntb:e" use="@xid" />
	<xsl:key name="oldData" match="/ntb:treegrid/ntb:datasources/ntb:datasource/ntb:data/ntb:e" use="@xid" />

	
	<xsl:template match="@* | node()" >
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />			
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="/ntb:treegrid/ntb:datasources/ntb:datasource/ntb:data/ntb:e">
		<xsl:if test="not(key('newData',@xid))">
			<xsl:copy>
				<xsl:copy-of select="@*" />
			</xsl:copy>
		</xsl:if>
	</xsl:template>
	<xsl:template match="/ntb:treegrid/ntb:datasources/ntb:datasource/ntb:data">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()" />
			<xsl:for-each select="/ntb:treegrid/ntb:newdata/ntb:data/ntb:e">
				<xsl:copy>
					<xsl:copy-of select="@*" />
					<xsl:if test="$defaultAction">
						<xsl:variable name="oldNode" select="key('oldData',@xid)" />
						<xsl:choose>
							<xsl:when test="$oldNode">
								<xsl:variable name='xid' select="@xid" />
								<xsl:attribute name="xac"><xsl:value-of select="$oldNode/@xac" /></xsl:attribute>
							</xsl:when>
							<xsl:otherwise>
								<xsl:attribute name="xac"><xsl:value-of select="$defaultAction" /></xsl:attribute>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>
				</xsl:copy>
			</xsl:for-each>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>
    