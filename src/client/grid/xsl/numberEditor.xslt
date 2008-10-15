<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n">

<xsl:output method="text" version="4.0" omit-xml-declaration="yes" />

<xsl:param name="number" select="0" />
<xsl:param name="mask" select="'#.00'" />
<xsl:param name="group" select="','" />
<xsl:param name="decimal" select="'.'" />

<!--nitobi.grid.numberFormatTemplatesXslProc-->

<xsl:template match="/">
	<xsl:call-template name="n:format">
		<xsl:with-param name="number" select="$number" />
		<xsl:with-param name="mask" select="$mask" />
		<xsl:with-param name="group" select="$group" />
		<xsl:with-param name="decimal" select="$decimal" />
	</xsl:call-template>
</xsl:template>

</xsl:stylesheet>