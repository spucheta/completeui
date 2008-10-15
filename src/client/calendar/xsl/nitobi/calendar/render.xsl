<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" omit-xml-declaration="yes" />

	<xsl:strip-space elements="*"/>
	
	<xsl:template match="ntb:datepicker">
		<div id="{@id}">
			<xsl:attribute name="class">
				ntb-calendar-reset <xsl:value-of select="@theme"/>
			</xsl:attribute>
			
			<xsl:apply-templates select="ntb:dateinput"/>
			
			<xsl:if test="ntb:calendar and ntb:dateinput">
				<div id="{@id}.button" style="float:left;" class="ntb-calendar-button">
					<xsl:call-template name="dummy"></xsl:call-template>
				</div>
			</xsl:if>
			<div style="display:block;clear:both;float:none;height:0px;width:auto;overflow:hidden;"><xsl:comment>dummy</xsl:comment></div>
			<xsl:apply-templates select="ntb:calendar"/>
			
			<input id="{@id}.value" type="hidden" value="" name="{@id}"/>
		</div>
	</xsl:template>
	
	<xsl:template match="ntb:dateinput">
		<xsl:variable name="width">
			<xsl:choose>
				<xsl:when test="contains(@width, 'px')">
					<xsl:value-of select="substring-before(@width, 'px')"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@width" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<div id="{@id}" style="float:left;">
			<div id="{@id}.container" class="ntb-inputcontainer">
				<xsl:attribute name="style">
					<xsl:if test="@width">width:<xsl:value-of select="$width"/>px;</xsl:if>
				</xsl:attribute>
				<input id="{@id}.input" type="text" class="ntb-dateinput">
					<xsl:attribute name="style">
						font-size:100%;<xsl:if test="@cssstyle"><xsl:value-of select="@cssstyle"/></xsl:if>;
						<xsl:if test="@width">width: <xsl:value-of select="number($width) - 10"/>px;</xsl:if>
					</xsl:attribute>
					<xsl:if test="@editable = 'false'">
						<xsl:attribute name="disabled">true</xsl:attribute>
					</xsl:if>
				</input>
			</div>
		</div>
	</xsl:template>
	
	<xsl:template match="ntb:calendar">
		<div id="{@id}" onselectstart="return false;">
			<xsl:attribute name="style">
				<xsl:if test="../ntb:dateinput">position:absolute;z-index:1000;</xsl:if>overflow:hidden;
			</xsl:attribute>
			<xsl:attribute name="class">
				ntb-calendar-container nitobi-hide
			</xsl:attribute>
			<xsl:call-template name="dummy"/>
		</div>
	</xsl:template>
	
	<xsl:template name="dummy">
		<xsl:comment>dummy</xsl:comment>
	</xsl:template>
</xsl:stylesheet>