<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="text" />
	
	<xsl:param name="component" />

	<xsl:template match="/">
		<xsl:apply-templates select="includes/*" />
	</xsl:template>
	
	<xsl:template match="jsfile">
		../src/client/<xsl:value-of select="$component"/>/<xsl:value-of select="@path"/><xsl:text> </xsl:text>
	</xsl:template>
</xsl:stylesheet>