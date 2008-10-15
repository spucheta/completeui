<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com">

	<!--
		This template takes a schema and a decl and sets all the defaults on unspecified attributes.  The xml should
		look something like this:
		
		<?xml version="1.0" encoding="utf-8" ?>
		<root xmlns:ntb="http://www.nitobi.com">
		<schema>
			<class name="nitobi.ui.Button" html="ntb:button">  
				<inherits from="nitobi.ui.Control"/>
				<att name="OnClickEvent" type="string" access="public" readwrite="readwrite"/>
				<att name="Top" type="int"/>
				<att name="Visibile" type="bool" default="true"/>
			</class>
		</schema>
		<declaration>
			<ntb:lookup xmlns:ntb="http://www.nitobi.com">
				<ntb:button />
			</ntb:lookup>
		</declaration>
		</root>
	-->

	<xsl:output method="xml" omit-xml-declaration="yes" />
	<xsl:key name="class-attributes" match="//schema/class" use="@html"/>
	<xsl:key name="class-attributes-byname" match="//schema/class" use="@name"/>
	
	<xsl:variable name="lcletters">abcdefghijklmnopqrstuvwxyz</xsl:variable>
	<xsl:variable name="ucletters">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>

	
	<xsl:template match="schema">
	</xsl:template>
	
	<xsl:template match="declaration">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="root">
		<xsl:apply-templates/>
	</xsl:template>
		
	<xsl:template match="node()|@*">
	
		<!-- By default just copy over the decl -->
		<xsl:copy>
			<xsl:variable name="tagName" select="name(.)"/>
			<xsl:apply-templates select="@*"/>
			
			<!-- Now loop through the schema for the node in the decl to make sure nothing was left 
				out. -->
			<xsl:apply-templates select="key('class-attributes',$tagName)/att">
				<xsl:with-param name="this" select="."/>
			</xsl:apply-templates>
			
			 <xsl:apply-templates /> 
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="schema/class/att">
		<xsl:param name="this"/>
		
		<!-- The decl tag name -->
		<xsl:variable name="declNodeName" select="name($this)"/>
		<!-- All this decl attributes -->
		<xsl:variable name="declNodeAtts" select="$this/@*"/>
		
		<!-- The name of the att in the schema we are looking at. -->
		<xsl:variable name="schemaAtt">
			<xsl:call-template name='tolower'>
                  <xsl:with-param name='toconvert' select='./@name' />
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="attType" select="./@type"/>

		<!-- If the attribute is not in the decl, create it -->
			<xsl:choose>
				<!-- Is this a simple type? -->
				<xsl:when test="./@default and (@type='string' or @type='int' or @type='bool')">
					<!-- Check to see if this attribute is in the tag. -->	
					<xsl:variable name="found">
						<xsl:for-each select="$declNodeAtts">
							<xsl:if test="name(.) = $schemaAtt">
								<xsl:value-of select="$schemaAtt"/> 
							</xsl:if>
						</xsl:for-each>
					</xsl:variable>
					<!-- There is no att on the tag and it is required. Create it. -->
					<xsl:if test="$found != $schemaAtt">
						<xsl:attribute name="{$schemaAtt}">	
							<xsl:value-of select="./@default"/>
						</xsl:attribute>
					</xsl:if>
				</xsl:when>
				<!-- Is this a complex type -->
				<xsl:when test="./@default='new' and @type!='string' and @type!='int' and @type!='bool'">
					<xsl:variable name="newName" select="key('class-attributes-byname',$attType)/@html"/>
					
					<!-- Does the decl have the complex type already? -->
					<xsl:variable name="found">
						<xsl:value-of select="name($this/child::*[name(.) = $newName])"/>	
					</xsl:variable>
					
					<!-- If the decl didn't have a tag representing this complex type, and it is required, then 
					create the element and set its defaults. -->
					<xsl:if test="$found = ''">
						<xsl:element name="{$newName}">
						<xsl:apply-templates select="key('class-attributes',$newName)/*">
							<xsl:with-param name="this" select="."/>
						</xsl:apply-templates>
						</xsl:element>
					</xsl:if>
				</xsl:when>
			</xsl:choose>
	</xsl:template>
	
	<xsl:template name='tolower'>
    	<xsl:param name='toconvert' />
        <xsl:value-of select="translate($toconvert,$ucletters,$lcletters)" />
	</xsl:template>
	
</xsl:stylesheet>