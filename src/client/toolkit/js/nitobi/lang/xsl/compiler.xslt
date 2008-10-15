<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="text" encoding="utf-8" omit-xml-declaration="yes"/>
	
	<xsl:template match="class">
		<xsl:variable name="class"><xsl:value-of select="@name" /></xsl:variable>
		
		<xsl:for-each select="./att">
			<xsl:call-template name="generate-accessors">
				<xsl:with-param name="class" select="$class"></xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="generate-accessors">
		<xsl:param name="class"></xsl:param>

		<xsl:variable name="type-name">
			<xsl:call-template name="get-type"> 
				<xsl:with-param name="type"><xsl:value-of select="@type"/></xsl:with-param>
			</xsl:call-template>
		</xsl:variable>	

		<xsl:value-of select="$class"/>.prototype.set<xsl:value-of select="@name"/> = function(value) 
		{
		
			<xsl:choose>
				<xsl:when test="@type != 'int' and @type != 'bool' and @type != 'string'">
					var profile = this.factory.registry.getProfileByTag(value.getXmlNode().nodeName);
					this.deleteChildObject(profile,value);
					this.addChildObject(profile,value);
					this.<xsl:value-of select="@name"/> = value;
				</xsl:when>
				<xsl:otherwise>	
					this.set<xsl:value-of select="$type-name"/>Attribute("<xsl:value-of select="@name"/>",value);
				</xsl:otherwise>
			</xsl:choose>
		}

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
	
		<xsl:value-of select="$class"/>.prototype.<xsl:value-of select="$accessor-prefix"/><xsl:value-of select="@name"/> = function() 
		{
			return this.<xsl:value-of select="@name"/>;
		}

	</xsl:template>
	
	<xsl:template name="get-type">
		<xsl:param name="type"/>
		<xsl:choose>
			<xsl:when test="$type='int'">Int</xsl:when>
			<xsl:when test="$type='bool'">Bool</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="text()"/>
</xsl:stylesheet>
