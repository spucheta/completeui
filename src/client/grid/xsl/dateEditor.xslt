<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" extension-element-prefixes="d">
    
<xsl:output method="text" version="4.0" omit-xml-declaration="yes" />

<!--nitobi.grid.dateFormatTemplatesXslProc-->    

<xsl:template match="/">
	<xsl:call-template name="d:format-date">
		<xsl:with-param name="date-time" select="//date" />
        <xsl:with-param name="date-year" select="//year" />
		<xsl:with-param name="mask" select="//mask" />
	</xsl:call-template>
</xsl:template>

</xsl:stylesheet>