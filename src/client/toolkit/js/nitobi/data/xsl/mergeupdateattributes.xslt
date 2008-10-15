<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template name="xmlUpdate">
        <update></update>
    </xsl:template>		
    
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="//update//@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
    
    <!-- update the number of rows does not account for inserts! -->
    <xsl:template match="//metadata/@numrows">
        <xsl:attribute name="{name(.)}"><xsl:value-of select=". - count((document('')//data[@id='_default']/e[@xac='d']))" /></xsl:attribute>
    </xsl:template>
    
    <!-- merge the updated attributes for each row  -->	
    <xsl:template match="@*">
        <xsl:variable name="currentXI"  select="../@xi"/>
        <xsl:variable name="parentID"   select="../../@id"/>
        <xsl:variable name="parentXI"   select="../../@xi"/>
        <xsl:variable name="targetNode" select="(document('')//*[@id=$parentID  or @xi=$parentXI]/*[@xi=$currentXI and @xac='u'])" />
        <xsl:choose>
            <xsl:when test="($targetNode)   and (name($targetNode)=name(..))  and (../@xi = $targetNode/@xi) and (name(../..) = name($targetNode/..))">
                <xsl:copy>
                    <xsl:apply-templates select="node()|@*"/>
                </xsl:copy>
                <xsl:apply-templates select="$targetNode/@*" />								
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy>
                    <xsl:apply-templates select="node()|@*"/>
                </xsl:copy>
            </xsl:otherwise>
        </xsl:choose>																	
    </xsl:template>
    
    <!-- delete rows  -->	
    <xsl:template match="//root/*//node()">
        <xsl:variable name="currentXI"  select="@xi"/>
        <xsl:variable name="parentID"   select="../@id"/>
        <xsl:variable name="parentXI"   select="../@xi"/>				
        <xsl:variable name="targetNode" select="(document('')//*[@id=$parentID or @xi=$parentXI]/*[@xi=$currentXI and @xac='d'])" />
        <xsl:choose>
            <xsl:when test="($targetNode) and (name($targetNode/..)=name(..))  and (name() = name($targetNode))">							
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy>
                    <xsl:apply-templates select="node()|@*"/>
                </xsl:copy>
            </xsl:otherwise>
        </xsl:choose>																	
    </xsl:template>
    
</xsl:stylesheet>