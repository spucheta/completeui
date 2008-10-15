<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" omit-xml-declaration="yes" />

	<xsl:template match="/">
		<ntb:treegrid xmlns:ntb="http://www.nitobi.com">
			<ntb:columns>
				<xsl:apply-templates select="//ntb:columndefinition" mode="columndef" />
			</ntb:columns>
			<ntb:datasources>
				<xsl:apply-templates select="//ntb:columndefinition" mode="datasources" />
			</ntb:datasources>
		</ntb:treegrid>
	</xsl:template>
	<xsl:template match="ntb:columndefinition" mode="columndef">
		<xsl:choose>
		<xsl:when test="@type='TEXT' or @type='TEXTAREA' or @type='LISTBOX' or @type='LOOKUP' or @type='CHECKBOX' or @type='LINK' or @type='IMAGE' or @type='' or not(@type)">
			<ntb:textcolumn>
				<xsl:copy-of select="@*" />
				<xsl:choose>
				<xsl:when test="@type='TEXT'">
					<ntb:texteditor><xsl:copy-of select="@*" /></ntb:texteditor>
				</xsl:when>
				<xsl:when test="@type='TEXTAREA'">
					<ntb:textareaeditor><xsl:copy-of select="@*" /></ntb:textareaeditor>
				</xsl:when>
				<xsl:when test="@type='LISTBOX'">
					<ntb:listboxeditor>
						<xsl:copy-of select="@*" />
						<xsl:attribute name="DatasourceId">id_<xsl:value-of select="position()"/></xsl:attribute>
						<xsl:attribute name="DisplayFields">
							<xsl:choose>
								<xsl:when test="@show='value'">b</xsl:when>
								<xsl:when test="@show='key'">a</xsl:when>
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:attribute name="ValueField">
							<xsl:choose>
								<xsl:when test="@show">a</xsl:when>
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</ntb:listboxeditor>
				</xsl:when>
				<xsl:when test="@type='CHECKBOX'">
					<ntb:checkboxeditor>
						<xsl:copy-of select="@*" />
						<xsl:attribute name="DatasourceId">id_<xsl:value-of select="position()"/></xsl:attribute>
						<xsl:attribute name="DisplayFields">
							<xsl:choose>
								<xsl:when test="@show='value'">b</xsl:when>
								<xsl:when test="@show='key'">a</xsl:when>
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose></xsl:attribute>
						<xsl:attribute name="ValueField">a</xsl:attribute>
					</ntb:checkboxeditor>
				</xsl:when>
				<xsl:when test="@type='LOOKUP'">
					<ntb:lookupeditor>
						<xsl:copy-of select="@*" />
						<xsl:attribute name="DatasourceId">id_<xsl:value-of select="position()"/></xsl:attribute>
						<xsl:attribute name="DisplayFields">
							<xsl:choose>
								<xsl:when test="@show='key'">a</xsl:when>
								<xsl:when test="@show='value'">b</xsl:when>
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose></xsl:attribute>
						<xsl:attribute name="ValueField">
							<xsl:choose>
								<xsl:when test="@show">a</xsl:when>
								<xsl:otherwise></xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
					</ntb:lookupeditor>
				</xsl:when>
				<xsl:when test="@type='LINK'">
					<ntb:linkeditor><xsl:copy-of select="@*" /></ntb:linkeditor>
				</xsl:when>
				<xsl:when test="@type='IMAGE'">
					<ntb:imageeditor><xsl:copy-of select="@*" /></ntb:imageeditor>
				</xsl:when>
				</xsl:choose>
			</ntb:textcolumn>
		</xsl:when>
		<xsl:when test="@type='NUMBER'">
			<ntb:numbercolumn><xsl:copy-of select="@*" /></ntb:numbercolumn>
		</xsl:when>
		<xsl:when test="@type='DATE' or @type='CALENDAR'">
			<ntb:datecolumn>
				<xsl:copy-of select="@*" />
				<xsl:choose>
				<xsl:when test="@type='DATE'">
					<ntb:dateeditor><xsl:copy-of select="@*" /></ntb:dateeditor>
				</xsl:when>
				<xsl:when test="@type='CALENDAR'">
					<ntb:calendareditor><xsl:copy-of select="@*" /></ntb:calendareditor>
				</xsl:when>
				</xsl:choose>
			</ntb:datecolumn>
		</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="ntb:columndefinition" mode="datasources">
		<xsl:if test="@values and @values!=''">
			<ntb:datasource>
				<xsl:attribute name="id">id_<xsl:value-of select="position()" /></xsl:attribute>
				<ntb:datasourcestructure>
					<xsl:attribute name="id">id_<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="FieldNames">a|b</xsl:attribute>
					<xsl:attribute name="Keys">a</xsl:attribute>
				</ntb:datasourcestructure>
				<ntb:data>
					<xsl:attribute name="id">id_<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:call-template name="values">
						<xsl:with-param name="valuestring" select="@values" />
					</xsl:call-template>
				</ntb:data>
			</ntb:datasource>
		</xsl:if>
	 </xsl:template>		
	 <xsl:template name="values">
		<xsl:param name="valuestring" />

		<xsl:variable name="bstring">
			<xsl:choose>
				<xsl:when test="contains($valuestring,',')"><xsl:value-of select="substring-after(substring-before($valuestring,','),':')" /></xsl:when>
				<xsl:otherwise><xsl:value-of select="substring-after($valuestring,':')" /></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
	 	<ntb:e>
	 		<xsl:attribute name="a"><xsl:value-of select="substring-before($valuestring,':')" /></xsl:attribute>
	 		<xsl:attribute name="b"><xsl:value-of select="$bstring" /></xsl:attribute>
	 	</ntb:e>
	 	<xsl:if test="contains($valuestring,',')">
	 		<xsl:call-template name="values">
	 			<xsl:with-param name="valuestring" select="substring-after($valuestring,',')" />
	 		</xsl:call-template>
	 	</xsl:if> 
	 </xsl:template>
	 		
</xsl:stylesheet>