<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n">

<xsl:output method="text" omit-xml-declaration="yes"/>

<xsl:param name="showIndicators" select="'0'" />
<xsl:param name="showHeaders" select="'0'" />
<xsl:param name="firstColumn" select="'0'" />
<xsl:param name="lastColumn" select="'0'" />
<xsl:param name="uniqueId" select="'0'" />
<xsl:param name="rowHover" select="'0'" />
<xsl:param name="frozenColumnId" select="''" />

<xsl:template match = "/">
&lt;xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n"&gt;

&lt;!--nitobi.grid.dateFormatTemplatesXslProc--&gt;

&lt;!--nitobi.grid.numberFormatTemplatesXslProc--&gt;

&lt;xsl:output method="xml" omit-xml-declaration="yes"/&gt;

&lt;xsl:param name="start" /&gt;
&lt;xsl:param name="end" /&gt;
&lt;xsl:param name="activeColumn" select="'0'" /&gt;
&lt;xsl:param name="activeRow" select="'0'" /&gt;
&lt;xsl:param name="sortColumn" select="'0'" /&gt;
&lt;xsl:param name="sortDirection" select="'Asc'" /&gt;
&lt;xsl:param name="dataTableId" select="'_default'" /&gt;

&lt;xsl:key name="data-source" match="//ntb:datasources/ntb:datasource" use="@id" /&gt;

&lt;xsl:template match = "/"&gt;

	&lt;div&gt;
	<xsl:if test="$showHeaders">
		&lt;table cellpadding="0" cellspacing="0" border="0" class="ntb-grid-headerblock" &gt;
			&lt;tr class="ntb-header-row<xsl:value-of select="$uniqueId" />"&gt;
				<xsl:if test="$showIndicators">
					&lt;td ebatype="columnheader" xi="<xsl:value-of select="position()-1"/>" class="ntb-column"&gt;
						&lt;a href="#" class="ntb-row-indicator" onclick="return false;" style=";float:left;"&gt;
							&lt;xsl:value-of select="@xi"/&gt;
						&lt;/a&gt;
					&lt;/td&gt;
				</xsl:if>
				<xsl:for-each select="*/*">
					<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">
						&lt;td id="columnheader_<xsl:value-of select="position()-1"/>_<xsl:value-of select="$uniqueId" />" ebatype="columnheader" xi="<xsl:value-of select="position()-1"/>" col="<xsl:value-of select="position()-1"/>" onmouseover="$('grid<xsl:value-of select="$uniqueId" />').jsObject.handleHeaderMouseOver(this);" onmouseout="$('grid<xsl:value-of select="$uniqueId" />').jsObject.handleHeaderMouseOut(this);"&gt;
							&lt;xsl:variable name="sortString<xsl:value-of select="position()-1"/>"&gt;
								&lt;xsl:choose&gt;
									&lt;xsl:when test="$sortColumn=<xsl:value-of select="position()-1"/> and $sortDirection='Asc'"&gt;ascending&lt;/xsl:when&gt;
									&lt;xsl:when test="$sortColumn=<xsl:value-of select="position()-1"/> and $sortDirection='Desc'"&gt;descending&lt;/xsl:when&gt;
									&lt;xsl:otherwise&gt;&lt;/xsl:otherwise&gt;
								&lt;/xsl:choose&gt;
							&lt;/xsl:variable&gt;
	
							&lt;xsl:attribute name="class"&gt;ntb-column-indicator-border&lt;xsl:value-of select="$sortString<xsl:value-of select="position()-1"/>" /&gt;&lt;/xsl:attribute&gt;
							&lt;div class="ntb-column-indicator"&gt;
								<xsl:choose>
									<xsl:when test="@Label and not(@Label = '') and not(@Label = ' ')"><xsl:value-of select="@Label" /></xsl:when>
									<xsl:when test="ntb:label and not(ntb:label = '') and not(ntb:label = ' ')"><xsl:value-of select="ntb:label" /></xsl:when>
									<xsl:otherwise>ATOKENTOREPLACE</xsl:otherwise>
								</xsl:choose>
							&lt;/div&gt;

						&lt;/td&gt;

					</xsl:if>
				</xsl:for-each>
			&lt;/tr&gt;
			&lt;colgroup&gt;
				<xsl:for-each select="*/*">
					<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">
						&lt;col class="ntb-column<xsl:value-of select="$uniqueId" />_<xsl:value-of select="position()" />"&gt;&lt;/col&gt;
					</xsl:if>
				</xsl:for-each>
			&lt;/colgroup&gt; 
		&lt;/table&gt;
	</xsl:if>

		&lt;table cellpadding="0" cellspacing="0" border="0" class="ntb-grid-datablock"&gt;
		&lt;xsl:apply-templates select="key('data-source', $dataTableId)/ntb:data/ntb:e[@xi&amp;gt;=$start and @xi&amp;lt; $end]" &gt;
			&lt;xsl:sort select="@xi" data-type="number" /&gt;
		&lt;/xsl:apply-templates&gt;
		&lt;colgroup&gt;
		<xsl:for-each select="*/*">
			<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">
				&lt;col class="ntb-column<xsl:value-of select="$uniqueId"/>_<xsl:value-of select="position()" />"&gt;&lt;/col&gt;
			</xsl:if>
		</xsl:for-each>
		&lt;/colgroup&gt;
		&lt;/table&gt;
	&lt;/div&gt;

&lt;/xsl:template&gt;

&lt;xsl:template match="ntb:e"&gt;
	&lt;xsl:variable name="xi" select="@xi" /&gt;

		&lt;xsl:variable name="rowClass"&gt;
			&lt;xsl:if test="@xi mod 2 = 0"&gt;ntbalternaterow&lt;/xsl:if&gt;
			&lt;xsl:if test="<xsl:value-of select="@rowselectattr=1"/>"&gt;ebarowselected&lt;/xsl:if&gt;
		&lt;/xsl:variable&gt;

		&lt;tr class="ntb-row {$rowClass} ntb-row<xsl:value-of select="$uniqueId"/>" xi="{$xi}"&gt;
			&lt;xsl:attribute name="id"&gt;row_&lt;xsl:value-of select="$xi" /&gt;<xsl:value-of select="$frozenColumnId"/>_<xsl:value-of select="$uniqueId" />&lt;/xsl:attribute&gt;

		<xsl:for-each select="*/*">
			<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">

				&lt;xsl:variable name="sortString<xsl:value-of select="position()-1"/>"&gt;
					&lt;xsl:choose&gt;
						&lt;xsl:when test="$sortColumn=<xsl:value-of select="position()-1"/> and $sortDirection='Asc'"&gt;ascending&lt;/xsl:when&gt;
						&lt;xsl:when test="$sortColumn=<xsl:value-of select="position()-1"/> and $sortDirection='Desc'"&gt;descending&lt;/xsl:when&gt;
						&lt;xsl:otherwise&gt;&lt;/xsl:otherwise&gt;
					&lt;/xsl:choose&gt;
				&lt;/xsl:variable&gt;

				&lt;xsl:variable name="value<xsl:value-of select="position()"/>" &gt;
					<xsl:choose>
						<xsl:when test="not(@xdatafld = '')">&lt;xsl:value-of select="<xsl:value-of select="@xdatafld" />" /&gt;</xsl:when>
						<!-- @Value will actuall have some escaped XSLT in it like any other bound property -->
						<xsl:otherwise><xsl:value-of select="@Value" /></xsl:otherwise>
					</xsl:choose>
				&lt;/xsl:variable&gt;
	
				&lt;td ebatype="cell" xi="{$xi}" col="<xsl:value-of select="position()-1"/>" value="{$value<xsl:value-of select="position()"/>}" &gt;
					&lt;xsl:attribute name="style"&gt;<xsl:value-of select="@CssStyle"/>;&lt;/xsl:attribute&gt;
					&lt;xsl:attribute name="id"&gt;cell_&lt;xsl:value-of select="$xi" /&gt;_<xsl:value-of select="position()-1" />_<xsl:value-of select="$uniqueId" />&lt;/xsl:attribute&gt;
				&lt;xsl:attribute name="class"&gt;ntb-cell-border<xsl:value-of select="$uniqueId"/> ntb-column-data<xsl:value-of select="$uniqueId"/>_<xsl:value-of select="position()" /> ntb-column&lt;xsl:value-of select="$sortString<xsl:value-of select="position()-1"/>" /&gt;<xsl:text> </xsl:text>&lt;xsl:text&gt; &lt;/xsl:text&gt;<xsl:value-of select="@ClassName"/><xsl:text> </xsl:text>&lt;xsl:text&gt; &lt;/xsl:text&gt;<xsl:if test="@type = 'NUMBER'">&lt;xsl:if test="$value<xsl:value-of select="position()"/> &amp;lt; 0"&gt;ntb-grid-numbercellnegative&lt;/xsl:if&gt;</xsl:if>&lt;/xsl:attribute&gt;

					&lt;div style="overflow:hidden;white-space:nowrap;"&gt;
						&lt;xsl:attribute name="class"&gt;ntb-cell&lt;/xsl:attribute&gt;
						&lt;xsl:attribute name="title"&gt;&lt;xsl:value-of select="$value<xsl:value-of select="position()"/>"/&gt;&lt;/xsl:attribute&gt;
						&lt;xsl:call-template name="<xsl:choose><xsl:when test="@type and not(@type='')"><xsl:value-of select="@type" /></xsl:when><xsl:otherwise>TEXT</xsl:otherwise></xsl:choose>"&gt;
&lt;xsl:with-param name="value" select="$value<xsl:value-of select="position()"/>" /&gt;
&lt;xsl:with-param name="mask" &gt;<xsl:value-of select="@Mask"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="negativeMask" &gt;<xsl:value-of select="@NegativeMask"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="datasource" &gt;<xsl:value-of select="@DatasourceId"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="valuefield" &gt;<xsl:value-of select="@ValueField"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="displayfields" &gt;<xsl:value-of select="@DisplayFields"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="checkedvalue" &gt;<xsl:value-of select="@CheckedValue"/>&lt;/xsl:with-param&gt;
&lt;xsl:with-param name="imageurl" &gt;<xsl:value-of select="@ImageUrl"/>&lt;/xsl:with-param&gt;
						&lt;/xsl:call-template&gt;
					&lt;/div&gt;

				&lt;/td&gt;
			</xsl:if>
		</xsl:for-each>
	&lt;/tr&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="replaceblank"&gt;
   &lt;xsl:param name="value" /&gt;

   &lt;xsl:choose&gt;
      &lt;xsl:when test="not($value) or $value = '' or $value = ' '"&gt;ATOKENTOREPLACE&lt;/xsl:when&gt;
      &lt;xsl:otherwise&gt;&lt;xsl:value-of select="$value" /&gt;&lt;/xsl:otherwise&gt;
   &lt;/xsl:choose&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="replace"&gt;
	&lt;xsl:param name="text"/&gt;
	&lt;xsl:param name="search"/&gt;
	&lt;xsl:param name="replacement"/&gt;
	&lt;xsl:choose&gt;
		&lt;xsl:when test="contains($text, $search)"&gt;
			&lt;xsl:value-of select="substring-before($text, $search)"/&gt;
			&lt;xsl:value-of select="$replacement"/&gt;
			&lt;xsl:call-template name="replace"&gt;
				&lt;xsl:with-param name="text" select="substring-after($text,$search)"/&gt;
				&lt;xsl:with-param name="search" select="$search"/&gt;
				&lt;xsl:with-param name="replacement" select="$replacement"/&gt;
			&lt;/xsl:call-template&gt;
		&lt;/xsl:when&gt;
		&lt;xsl:otherwise&gt;
			&lt;xsl:value-of select="$text"/&gt;
		&lt;/xsl:otherwise&gt;
	&lt;/xsl:choose&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="print-displayfields"&gt;
	&lt;xsl:param name="field" /&gt;
	&lt;xsl:choose&gt;
		&lt;xsl:when test="contains($field,'|')" &gt;
			&lt;!-- Here we hardcode a spacer ', ' - this should probably be moved elsewhere. --&gt;
			&lt;xsl:value-of select="concat(@*[name(.)=substring-before($field,'|')],', ')" /&gt;
			&lt;xsl:call-template name="print-displayfields"&gt;
				&lt;xsl:with-param name="field" select="substring-after($field,'|')" /&gt;
			&lt;/xsl:call-template&gt;
		&lt;/xsl:when&gt;
		&lt;xsl:otherwise&gt;
			&lt;xsl:value-of select="@*[name(.)=$field]" /&gt;
		&lt;/xsl:otherwise&gt;
	&lt;/xsl:choose&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="replace-break"&gt;
	&lt;xsl:param name="text"/&gt;
	&lt;xsl:call-template name="replace"&gt;
		&lt;xsl:with-param name="text" select="$text"/&gt;
		&lt;xsl:with-param name="search" select="'&amp;amp;#xa;'"/&gt;
		&lt;xsl:with-param name="replacement" select="'&amp;lt;br/&amp;gt;'"/&gt;
	&lt;/xsl:call-template&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="TEXT"&gt;
	&lt;xsl:param name="value" /&gt;	
	&lt;xsl:call-template name="replaceblank"&gt;
	   &lt;xsl:with-param name="value" select="$value" /&gt;
	&lt;/xsl:call-template&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="PASSWORD"&gt;
	&lt;xsl:param name="value" /&gt;
	*********
&lt;/xsl:template&gt;

&lt;xsl:template name="TEXTAREA"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:call-template name="replace-break"&gt;
	   &lt;xsl:with-param name="text"&gt;
         &lt;xsl:call-template name="replaceblank"&gt;
            &lt;xsl:with-param name="value" select="$value" /&gt;
         &lt;/xsl:call-template&gt;
       &lt;/xsl:with-param&gt;  
	&lt;/xsl:call-template&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="NUMBER"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="mask" /&gt;
	&lt;xsl:param name="negativeMask" /&gt;

	&lt;xsl:variable name="number-mask"&gt;
		&lt;xsl:choose&gt;
			&lt;xsl:when test="$mask"&gt;&lt;xsl:value-of select="$mask" /&gt;&lt;/xsl:when&gt;
			&lt;xsl:otherwise&gt;#,###.00&lt;/xsl:otherwise&gt;
		&lt;/xsl:choose&gt;
	&lt;/xsl:variable&gt;
	&lt;xsl:variable name="negative-number-mask"&gt;
		&lt;xsl:choose&gt;
			&lt;xsl:when test="$negativeMask"&gt;&lt;xsl:value-of select="$negativeMask" /&gt;&lt;/xsl:when&gt;
			&lt;xsl:otherwise&gt;&lt;xsl:value-of select="$mask" /&gt;&lt;/xsl:otherwise&gt;
		&lt;/xsl:choose&gt;
	&lt;/xsl:variable&gt;
	&lt;xsl:variable name="number"&gt;
		&lt;xsl:choose&gt;
			&lt;xsl:when test="$value &amp;lt; 0"&gt;
				&lt;xsl:call-template name="n:format"&gt;
					&lt;xsl:with-param name="number" select="translate($value,'-','')" /&gt;
					&lt;xsl:with-param name="mask" select="$negative-number-mask" /&gt;
				&lt;/xsl:call-template&gt;
			&lt;/xsl:when&gt;
			&lt;xsl:otherwise&gt;
				&lt;xsl:call-template name="n:format"&gt;
					&lt;xsl:with-param name="number" select="$value" /&gt;
					&lt;xsl:with-param name="mask" select="$number-mask" /&gt;
				&lt;/xsl:call-template&gt;
			&lt;/xsl:otherwise&gt;
		&lt;/xsl:choose&gt;
	&lt;/xsl:variable&gt;
	&lt;xsl:call-template name="replaceblank"&gt;
	   &lt;xsl:with-param name="value" select="$number" /&gt;
	&lt;/xsl:call-template&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="IMAGE"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="imageurl" /&gt;
	&lt;xsl:variable name="url"&gt;
		&lt;xsl:choose&gt;
			&lt;xsl:when test="$imageurl"&gt;&lt;xsl:value-of select="$imageurl" /&gt;&lt;/xsl:when&gt;
			&lt;xsl:otherwise&gt;&lt;xsl:value-of select="$value" /&gt;&lt;/xsl:otherwise&gt;
		&lt;/xsl:choose&gt;
	&lt;/xsl:variable&gt;
	<!-- image editor -->
	&lt;img border="0" src="{$url}" /&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="DATE"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="mask" /&gt;
	&lt;xsl:variable name="date-mask"&gt;
		&lt;xsl:choose&gt;
			&lt;xsl:when test="$mask"&gt;&lt;xsl:value-of select="$mask" /&gt;&lt;/xsl:when&gt;
			&lt;xsl:otherwise&gt;MMM d, yy&lt;/xsl:otherwise&gt;
		&lt;/xsl:choose&gt;
	&lt;/xsl:variable&gt;
	&lt;xsl:variable name="date"&gt;
		&lt;xsl:call-template name="d:format-date"&gt;
			&lt;xsl:with-param name="date-time" select="$value" /&gt;
			&lt;xsl:with-param name="mask" select="$date-mask" /&gt;
		&lt;/xsl:call-template&gt;
	&lt;/xsl:variable&gt;
	&lt;xsl:call-template name="replaceblank"&gt;
		&lt;xsl:with-param name="value" select="$date" /&gt;
	&lt;/xsl:call-template&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="LISTBOX"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="datasource" /&gt;
	&lt;xsl:param name="valuefield" /&gt;
	&lt;xsl:param name="displayfields" /&gt;

	&lt;xsl:choose&gt;
		&lt;xsl:when test="$datasource"&gt;
			&lt;xsl:for-each select="key('data-source',$datasource)//*"&gt;
				&lt;xsl:if test="@*[name(.)=$valuefield and .=$value]"&gt;
					&lt;xsl:call-template name="replaceblank"&gt;
						&lt;xsl:with-param name="value"&gt;
							&lt;xsl:call-template name="print-displayfields"&gt;
								&lt;xsl:with-param name="field" select="$displayfields" /&gt;
							&lt;/xsl:call-template&gt;
						&lt;/xsl:with-param&gt;
					&lt;/xsl:call-template&gt;
				&lt;/xsl:if&gt;
			&lt;/xsl:for-each&gt;
		&lt;/xsl:when&gt;
		&lt;xsl:otherwise&gt;
			&lt;xsl:call-template name="replaceblank"&gt;
				&lt;xsl:with-param name="value" select="$value" /&gt;
			&lt;/xsl:call-template&gt;
		&lt;/xsl:otherwise&gt;
	&lt;/xsl:choose&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="LOOKUP"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="datasource" /&gt;
	&lt;xsl:param name="valuefield" /&gt;
	&lt;xsl:param name="displayfields" /&gt;
	
	&lt;xsl:choose&gt;
		&lt;xsl:when test="$valuefield = $displayfields"&gt;
			&lt;xsl:call-template name="TEXT"&gt;
				&lt;xsl:with-param name="value" select="$value" /&gt;
			&lt;/xsl:call-template&gt;
		&lt;/xsl:when&gt;
		&lt;xsl:otherwise&gt;
		   &lt;xsl:call-template name="replaceblank"&gt;
		      &lt;xsl:with-param name="value"&gt;
		   
		      	&lt;xsl:choose&gt;
		      		&lt;xsl:when test="$datasource"&gt;
		      			&lt;xsl:variable name="preset-value" &gt;
		      			&lt;xsl:for-each select="key('data-source',$datasource)//*"&gt;
		      				&lt;xsl:if test="@*[name(.)=$valuefield and .=$value]"&gt;
		      					&lt;xsl:call-template name="print-displayfields"&gt;
		      						&lt;xsl:with-param name="field" select="$displayfields" /&gt;
		      					&lt;/xsl:call-template&gt;
		      				&lt;/xsl:if&gt;
		      			&lt;/xsl:for-each&gt;
		      			&lt;/xsl:variable&gt;
		      			&lt;xsl:choose&gt;
		      				&lt;xsl:when test="$preset-value=''"&gt;
		      					&lt;xsl:value-of select="$value"/&gt;
		      				&lt;/xsl:when&gt;
		      				&lt;xsl:otherwise&gt;
		      					&lt;xsl:value-of select="$preset-value"/&gt;
		      				&lt;/xsl:otherwise&gt;
		      			&lt;/xsl:choose&gt;
		      		&lt;/xsl:when&gt;
		      		&lt;xsl:otherwise&gt;
		      			&lt;xsl:value-of select="$value"/&gt;
		      		&lt;/xsl:otherwise&gt;
		      	&lt;/xsl:choose&gt;
		
		      &lt;/xsl:with-param&gt;
		   &lt;/xsl:call-template&gt;
   		&lt;/xsl:otherwise&gt;
   	&lt;/xsl:choose&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="CHECKBOX"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;xsl:param name="datasource" /&gt;
	&lt;xsl:param name="valuefield" /&gt;
	&lt;xsl:param name="displayfields" /&gt;
	&lt;xsl:param name="checkedvalue" /&gt;

	&lt;xsl:for-each select="key('data-source',$datasource)//*"&gt;

		&lt;xsl:if test="@*[name(.)=$valuefield and .=$value]"&gt;

			&lt;xsl:variable name="checkString"&gt;
				&lt;xsl:choose&gt;
					&lt;xsl:when test="$value=$checkedvalue"&gt;checked&lt;/xsl:when&gt;
					&lt;xsl:otherwise&gt;unchecked&lt;/xsl:otherwise&gt;
				&lt;/xsl:choose&gt;
			&lt;/xsl:variable&gt;

			&lt;div style="overflow:hidden;"&gt;
	&lt;div style="float:left;" class="ntb-checkbox ntb-checkbox-{$checkString}" checked="{$value}" width="10" &gt;ATOKENTOREPLACE&lt;/div&gt;&lt;span&gt;&lt;xsl:value-of select="@*[name(.)=$displayfields]" /&gt;&lt;/span&gt;
			&lt;/div&gt;
		&lt;/xsl:if&gt;
	&lt;/xsl:for-each&gt;
&lt;/xsl:template&gt;

&lt;xsl:template name="LINK"&gt;
	&lt;xsl:param name="value" /&gt;
	&lt;span class="ntb-hyperlink-editor"&gt;
      &lt;xsl:call-template name="replaceblank"&gt;
         &lt;xsl:with-param name="value" select="$value" /&gt;
      &lt;/xsl:call-template&gt;
   &lt;/span&gt;
&lt;/xsl:template&gt;

<!--This can be used as an insertion point for column templates-->	
&lt;!--COLUMN-TYPE-TEMPLATES--&gt;

&lt;/xsl:stylesheet&gt;
</xsl:template>

</xsl:stylesheet>
