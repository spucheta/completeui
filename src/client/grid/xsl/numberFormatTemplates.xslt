<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n">
	
<!--http://www.w3schools.com/xsl/func_formatnumber.asp-->

<!--
	<xsl:decimal-format
	name="name"
	decimal-separator="char" 
	grouping-separator="char" 
	infinity="string"
	minus-sign="char"
	NaN="string"
	percent="char"
	per-mille="char"
	zero-digit="char"
	digit="char"
	pattern-separator="char"/> 
-->
<xsl:decimal-format name="NA" decimal-separator="." grouping-separator="," />
<xsl:decimal-format name="EU" decimal-separator="," grouping-separator="." />

<xsl:template name="n:format">
	<xsl:param name="number" select="0" />
	<xsl:param name="mask" select="'#.00'" />
	<xsl:param name="group" select="','" />
	<xsl:param name="decimal" select="'.'" />

	<xsl:variable name="formattedNumber">
		<xsl:choose>
			<xsl:when test="$group='.' and $decimal=','">
				<xsl:value-of select="format-number($number, $mask, 'EU')" />				
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="format-number($number, $mask, 'NA')" />				
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:if test="not(string($formattedNumber) = 'NaN')">
		<xsl:value-of select="$formattedNumber" />
	</xsl:if>
</xsl:template>

</xsl:stylesheet>