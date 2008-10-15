<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:ntb="http://www.nitobi.com">
   <xsl:output method="xml" omit-xml-declaration="yes" />

   <xsl:param name="column" select="@xi">
   </xsl:param>

   <xsl:param name="dir" select="'ascending'">
   </xsl:param>

   <xsl:param name="type" select="'text'">
   </xsl:param>
   
   <xsl:template match="*|@*">
   	<xsl:copy>
   		<xsl:apply-templates select="@*|node()" />
   	</xsl:copy>
   </xsl:template>
 
   <xsl:template match="ntb:data">
        <xsl:copy>
			<xsl:apply-templates select="@*"/>
            <xsl:for-each select="ntb:e">
             	<xsl:sort select="@*[name() =$column]" order="{$dir}" data-type="{$type}"/>
             	<xsl:copy>
					<xsl:attribute name="xi">
						<xsl:value-of select="position()-1" />
					</xsl:attribute>
	             	<xsl:apply-templates select="@*" />
	             </xsl:copy>
            </xsl:for-each>
        </xsl:copy>
   </xsl:template>

<xsl:template match="@xi" />

</xsl:stylesheet>
