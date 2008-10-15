<?xml version='1.0'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" />
	

<xsl:template match="//ntb:fisheye">
	<div>
		<xsl:attribute name="id">
			<xsl:value-of select="@id" />
		</xsl:attribute>
			<xsl:attribute name="class">
				ntb-fisheye-reset 
			<xsl:choose>
			<xsl:when test="./@theme">
					<xsl:value-of select="./@theme"/>
			</xsl:when>
			<xsl:otherwise>
				nitobi
			</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
	 &#160;
	 </div>
</xsl:template>

</xsl:stylesheet>