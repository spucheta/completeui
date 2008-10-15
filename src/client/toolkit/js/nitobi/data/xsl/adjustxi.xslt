<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:eba="http://www.ebusinessapplications.ca/ebagrid#">
    <xsl:output method="xml" omit-xml-declaration="yes" />
    
    <xsl:param name="startingIndex" select="5">
    </xsl:param>
    
    <xsl:param name="adjustment" select="-1">
    </xsl:param>
    
    <xsl:template match="*|@*">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="//eba:data[@id='_default']/eba:e|@*">
        <xsl:choose>
            <xsl:when test="number(@xi) &gt;= number($startingIndex)">
                <xsl:copy>
                    <xsl:apply-templates select="@*|node()" />
                    
                    <xsl:call-template name="increment-xi" />
                </xsl:copy>
            </xsl:when>
            
            <xsl:otherwise>
                <xsl:copy>
                    <xsl:apply-templates select="@*|node()" />
                </xsl:copy>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="increment-xi">
        <xsl:attribute name="xi">
            <xsl:value-of select="number(@xi) + number($adjustment)" />
        </xsl:attribute>
    </xsl:template>
</xsl:stylesheet>

