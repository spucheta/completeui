<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:output method="text" />

	<xsl:param name="component" />
    
    <xsl:template match="/">
        <xsl:apply-templates select="includes/*" />
    </xsl:template>
    
    <xsl:template match="xmlfile">
        stringify("../src/client/<xsl:value-of select="$component" />/<xsl:value-of select="@path" />", "../temp/<xsl:value-of select="$component"/>/<xsl:value-of select="concat(@namespace, '.', @name, '.js')"/>", "<xsl:value-of select="@name" />", "<xsl:value-of select="@namespace" />");
    </xsl:template>
    
</xsl:stylesheet>