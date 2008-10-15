<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="text" />
	<xsl:param name="component" />

	<xsl:template match="/">
		<xsl:apply-templates select="includes/*" />
	</xsl:template>

	<xsl:template match="xslfile">
		../temp/<xsl:value-of select="$component"/>/<xsl:value-of select="concat(@namespace, '.', @name,'.js')"/><xsl:text> </xsl:text>
	</xsl:template>

</xsl:stylesheet>