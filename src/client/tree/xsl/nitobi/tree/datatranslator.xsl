<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" omit-xml-declaration="yes" />

	<xsl:key name="att-lookup" match="/root/fields/@*" use="name()" />
	
	<xsl:template match="/root">
		<ntb:children>
			<xsl:apply-templates />
		</ntb:children>
	</xsl:template>

	<xsl:template match="e">
		<ntb:node>
			<xsl:for-each select="@*">
				<xsl:if test="key('att-lookup',name())">
					<xsl:attribute name="{key('att-lookup',name())}"><xsl:value-of select="." /></xsl:attribute>
				</xsl:if>
			</xsl:for-each>
		</ntb:node>
	</xsl:template>
</xsl:stylesheet>