<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes"/>
	<xsl:template match="interface">
		<xsl:call-template name="initJSDefaults"/>
		<xsl:apply-templates/>
		
	</xsl:template>

	<xsl:template name="initJSDefaults">
 	</xsl:template>

	<xsl:template match="interface/properties">
		<xsl:variable name="object"><xsl:value-of select="ancestor::interface/@name" /></xsl:variable>
		<xsl:for-each select="property">
			<xsl:call-template name="generate-accessors">
				<xsl:with-param name="object" select="$object"></xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="interface/methods">
		<xsl:for-each select="method">
			<xsl:if test="@code">
				this.<xsl:value-of select="@name"/>= function(<xsl:for-each select="parameters/parameter"><xsl:value-of select="@name" /><xsl:if test="not(last())">,</xsl:if></xsl:for-each>) {<xsl:value-of select="@code"/>};
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="interface/events">
		<xsl:variable name="object"><xsl:value-of select="ancestor::interface/@name" /></xsl:variable>
		<xsl:for-each select="event">
			<xsl:call-template name="generate-accessors">
				<xsl:with-param name="object" select="$object"></xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="generate-accessors">
		<xsl:param name="object"></xsl:param>

		<xsl:variable name="name">
		<xsl:if test="@xml"><xsl:value-of select="$object"/>/<xsl:value-of select="@xml" /></xsl:if>
		<xsl:if test="not(@xml)"><xsl:value-of select="$object"/>/@<xsl:value-of select="@name" /></xsl:if>
		</xsl:variable>

			<xsl:if test="'a'='a'">
				this.set<xsl:value-of select="@name"/> = function() {
				<xsl:value-of select="@precode"/>

				<xsl:if test="contains(@persist,'event')">this.eSET("<xsl:value-of select="@name"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'js')">this.jSET("<xsl:value-of select="@name"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'xml')">this.xSET("<xsl:value-of select="$name"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'data')">this.SETDATA("<xsl:value-of select="$name"/>",arguments);</xsl:if>
				<!-- <xsl:if test="contains(@persist,'meta')">this.xSETMETA("<xsl:value-of select="@short"/>",arguments);</xsl:if> -->
				<xsl:if test="contains(@persist,'model')">this.xSETMODEL("<xsl:value-of select="@model"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'css')">this.xSETCSS("<xsl:value-of select="@htmltag"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'dom')">this.SETDOM("<xsl:value-of select="@name"/>",arguments);</xsl:if>
				<xsl:if test="contains(@persist,'tag')">this.SETTAG("<xsl:value-of select="@name"/>",arguments);</xsl:if>
				<xsl:value-of select="@code"/>

				if (EBAAutoRender) {
				<xsl:if test="not($object='nitobi.grid.Grid')">
					<xsl:if test="contains(@impact,'config')">this.grid.initializeModelFromDeclaration();</xsl:if>
					<xsl:if test="contains(@impact,'bind')">this.grid.bind();</xsl:if>
					<xsl:if test="contains(@impact,'css')">this.grid.generateCss();</xsl:if>
					<xsl:if test="contains(@impact,'frame')">this.grid.renderFrame();</xsl:if>
					<xsl:if test="contains(@impact,'align')">this.grid.Scroller.alignSurfaces();</xsl:if>
					<xsl:if test="contains(@impact,'size')">this.grid.resize();</xsl:if>
					<xsl:if test="contains(@impact,'xsl')">this.grid.makeXSL();</xsl:if>
					<xsl:if test="contains(@impact,'row')">this.grid.refilter();</xsl:if>
				</xsl:if>

				<xsl:if test="$object='nitobi.grid.Grid'">
					<xsl:if test="contains(@impact,'config')">this.initializeModelFromDeclaration();</xsl:if>
					<xsl:if test="contains(@impact,'bind')">this.bind();</xsl:if>
					<xsl:if test="contains(@impact,'css')">this.generateCss();</xsl:if>
					<xsl:if test="contains(@impact,'frame')">this.renderFrame();</xsl:if>
					<xsl:if test="contains(@impact,'xsl')">this.makeXSL();</xsl:if>
					<xsl:if test="contains(@impact,'row')">this.refilter();</xsl:if>
				</xsl:if>
				};
				};
			</xsl:if>
			
			<xsl:variable name="accessor-prefix">
				<xsl:choose>
					<xsl:when test="@type='bool'">
						<xsl:value-of select="'is'"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="'get'"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>

			<xsl:if test="contains(@persist,'js') or contains(@persist,'event')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return this.<xsl:value-of select="@name"/>;};</xsl:if>
			<xsl:if test="contains(@persist,'xml')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return <xsl:call-template name="cast-type"><xsl:with-param name="type" select="@type"/><xsl:with-param name="expression">this.xGET("<xsl:value-of select="$name"/>",arguments)</xsl:with-param><xsl:with-param name="default" select="@default" /></xsl:call-template>;};</xsl:if>
			<xsl:if test="contains(@persist,'data')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return <xsl:call-template name="cast-type"><xsl:with-param name="type" select="@type"/><xsl:with-param name="expression">this.GETDATA("<xsl:value-of select="$name"/>",arguments)</xsl:with-param><xsl:with-param name="default" select="@default" /></xsl:call-template>;};</xsl:if>
			<xsl:if test="contains(@persist,'meta')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return <xsl:call-template name="cast-type"><xsl:with-param name="type" select="@type"/><xsl:with-param name="expression">this.xGETMETA("<xsl:value-of select="@short"/>",arguments)</xsl:with-param><xsl:with-param name="default" select="@default" /></xsl:call-template>;};</xsl:if>
			<xsl:if test="contains(@persist,'model')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return <xsl:call-template name="cast-type"><xsl:with-param name="type" select="@type"/><xsl:with-param name="expression">this.xGETMODEL("<xsl:value-of select="@model"/>",arguments)</xsl:with-param><xsl:with-param name="default" select="@default" /></xsl:call-template>;};</xsl:if>
			<xsl:if test="contains(@persist,'dom')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return this.dGET("<xsl:value-of select="@name"/>",arguments);};</xsl:if>
			<xsl:if test="contains(@persist,'tag')">this.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() {return this.GETTAG("<xsl:value-of select="@name"/>",arguments);};</xsl:if>

	</xsl:template>
	
	<xsl:template name="cast-type">
		<xsl:param name="type"/>
		<xsl:param name="expression"/>
		<xsl:param name="default" select="'true'"/>
		<xsl:choose>
			<xsl:when test="$type='int'">Number(<xsl:value-of select="$expression"/>)</xsl:when>
			<xsl:when test="$type='bool'">nitobi.lang.toBool(<xsl:value-of select="$expression"/>, <xsl:value-of select="$default"/>)</xsl:when>
			<xsl:otherwise><xsl:value-of select="$expression"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="text()"/>
</xsl:stylesheet>
