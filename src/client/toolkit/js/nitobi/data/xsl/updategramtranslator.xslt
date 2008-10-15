<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:eba="http://www.ebusinessapplications.ca/ebagrid#">
    <xsl:output method="xml" encoding="utf-8" omit-xml-declaration="yes"/>
    
    <xsl:param name="datasource-id" select="'_default'"></xsl:param>
    <xsl:param name="xkField" ></xsl:param>
    
    <xsl:template match="/">
        <root>
            <xsl:apply-templates select="//eba:datasource[@id=$datasource-id]/eba:data/eba:e" />
        </root>
    </xsl:template>
    
    <xsl:template match="eba:e">
        <xsl:choose>
            <xsl:when test="@xac='d'">
                <delete xi="{@xi}" xk="{@*[name() = $xkField]}"></delete>
            </xsl:when>
            <xsl:when test="@xac='i'">
                <insert><xsl:copy-of select="@*[not(name() = $xkField) and not(name() = 'xac')]" /><xsl:attribute name="xk"><xsl:value-of select="@*[name() = $xkField]" /></xsl:attribute></insert>
            </xsl:when>
            <xsl:when test="@xac='u'">
                <update><xsl:copy-of select="@*[not(name() = $xkField) and not(name() = 'xac')]" /><xsl:attribute name="xk"><xsl:value-of select="@*[name() = $xkField]" /></xsl:attribute></update>
            </xsl:when>
            
        </xsl:choose>
    </xsl:template>
    
</xsl:stylesheet>
