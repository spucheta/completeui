<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com">

	<xsl:output method="xml" omit-xml-declaration="yes"/>
	
	<xsl:param name="size"></xsl:param>
	<xsl:param name="DisplayFields" select="''"></xsl:param>
	<xsl:param name="ValueField" select="''"></xsl:param>
	<xsl:param name="val" select="''"></xsl:param>

	<xsl:template match="/">
		<!--<xsl:variable name="cell" select="/root/metadata/r[@xi=$row]/*[@xi=$col]"></xsl:variable>-->
		<select id="ntb-listbox" class="ntb-input ntb-lookup-options">
		<xsl:if test="$size">
			<xsl:attribute name="size">6</xsl:attribute>
		</xsl:if>
		<!--<xsl:choose>
			<xsl:when test="$DatasourceId">-->
				<xsl:for-each select="/ntb:datasource/ntb:data/*">
					<xsl:sort select="@*[name(.)=substring-before($DisplayFields,'|')]" data-type="text" order="ascending" /> 
						<option>
							<xsl:attribute name="value">
								<xsl:value-of select="@*[name(.)=$ValueField]"></xsl:value-of>
							</xsl:attribute>
							<xsl:attribute name="rn">
								<xsl:value-of select="position()"></xsl:value-of>
							</xsl:attribute>
							<xsl:if test="@*[name(.)=$ValueField and .=$val]">
								<xsl:attribute name="selected">true</xsl:attribute>
							</xsl:if>
							<xsl:call-template name="print-displayfields">
								<xsl:with-param name="field" select="$DisplayFields" />
							</xsl:call-template>
						</option>
				</xsl:for-each>
			<!--</xsl:when>
			<xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>-->
		</select>
	</xsl:template>

	<xsl:template name="print-displayfields">
		<xsl:param name="field" />
		<xsl:choose>
			<xsl:when test="contains($field,'|')" >
				<!-- Here we hardcode a spacer ', ' - this should probably be moved elsewhere. -->
				<xsl:value-of select="concat(@*[name(.)=substring-before($field,'|')],', ')"></xsl:value-of>
				<xsl:call-template name="print-displayfields">
					<xsl:with-param name="field" select="substring-after($field,'|')" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@*[name(.)=$field]"></xsl:value-of>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>
