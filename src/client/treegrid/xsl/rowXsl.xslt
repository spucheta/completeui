<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com" xmlns:d="http://exslt.org/dates-and-times" xmlns:n="http://www.nitobi.com/exslt/numbers" extension-element-prefixes="d n">

<xsl:output method="xml" omit-xml-declaration="yes"/>   

<xsl:param name="showHeaders" select="'0'" />
<xsl:param name="firstColumn" select="'0'" />
<xsl:param name="lastColumn" select="'0'" />
<xsl:param name="uniqueId" select="'0'" />
<xsl:param name="rowHover" select="'0'" />
<xsl:param name="frozenColumnId" select="''" />

<xsl:param name="start" />
<xsl:param name="end" />
<xsl:param name="activeColumn" select="'0'" />
<xsl:param name="activeRow" select="'0'" />
<xsl:param name="sortColumn" select="'0'" />
<xsl:param name="sortDirection" select="'Asc'" />
<xsl:param name="dataTableId" select="'_default'" />

<xsl:param name="columnSet" select="'_default'"/>
<xsl:param name="columns" select="/ntb:root/ntb:columns/*/*" />
<xsl:param name="columnsId" select="/ntb:root/ntb:columns/ntb:columns/@id" />
<xsl:param name="surfaceKey" select="''"/>

<xsl:key name="data-source" match="//ntb:datasources/ntb:datasource" use="@id" />
<xsl:key name="group" match="ntb:e" use="@a" />

<!--
	<xsl:for-each select="ntb:e[count(. | key('group', @a)[1]) = 1]">
		<xsl:sort select="@a" />
		<xsl:value-of select="@a" />,<br />
		<xsl:for-each select="key('group', @a)">
			<xsl:sort select="@b" />
			<xsl:value-of select="@b" /> (<xsl:value-of select="@c" />)<br />
		</xsl:for-each>
	</xsl:for-each>
-->

<!--This is an incude for the date fromatting XSLT that gets replaced at compile time-->
<!--nitobi.grid.dateFormatTemplatesXslProc-->

<!--This is an incude for the number fromatting XSLT that gets replaced at compile time-->
<!--nitobi.grid.numberFormatTemplatesXslProc-->

<xsl:template match = "/">

	<div>
	<xsl:choose>
	<xsl:when test="$showHeaders = 1">
		<table cellpadding="0" cellspacing="0" border="0" class="ntb-grid-headerblock">
			<tr>
				<xsl:attribute name="class">ntb-header-row<xsl:value-of select="$uniqueId" /></xsl:attribute>

				<xsl:for-each select="$columns">
					<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">
						<td ebatype="columnheader" xi="{position()-1}" col="{position()-1}">
						<xsl:attribute name="id">columnheader_<xsl:value-of select="position()-1"/>_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/></xsl:attribute>
						<xsl:attribute name="path"><xsl:value-of select="$surfaceKey"></xsl:value-of></xsl:attribute>
						<xsl:attribute name="onmouseover">$('grid<xsl:value-of select="$uniqueId" />').jsObject.handleHeaderMouseOver(this);</xsl:attribute>
						<xsl:attribute name="onmouseout">$('grid<xsl:value-of select="$uniqueId" />').jsObject.handleHeaderMouseOut(this);</xsl:attribute>
						<!-- note that the ntb-columnUID_POSITION class is for a safari bug -->
						<xsl:attribute name="class">ntb-column-indicator-border<xsl:choose><xsl:when test="$sortColumn=position()-1 and $sortDirection='Asc'">ascending</xsl:when><xsl:when test="$sortColumn=position()-1 and $sortDirection='Desc'">descending</xsl:when><xsl:otherwise></xsl:otherwise></xsl:choose><xsl:text> </xsl:text>ntb-column<xsl:value-of select="$uniqueId"/><xsl:if test="$columnsId">_<xsl:value-of select="$columnsId"/></xsl:if>_<xsl:value-of select="position()" /></xsl:attribute>
							<div class="ntb-column-indicator">
								<xsl:choose>
									<xsl:when test="@Label and not(@Label = '') and not(@Label = ' ')"><xsl:value-of select="@Label" /></xsl:when>
									<xsl:when test="ntb:label and not(ntb:label = '') and not(ntb:label = ' ')"><xsl:value-of select="ntb:label" /></xsl:when>
									<xsl:otherwise>ATOKENTOREPLACE</xsl:otherwise>
								</xsl:choose>
							</div>

						</td>

					</xsl:if>
				</xsl:for-each>
			</tr>
			<xsl:call-template name="colgroup" />
		</table>
	</xsl:when>
	<xsl:otherwise>
	<table cellpadding="0" cellspacing="0" border="0" class="ntb-grid-datablock">
		<xsl:apply-templates select="key('data-source', $dataTableId)/ntb:data/ntb:e[@xi &gt;= $start and @xi &lt; $end]" >
			<xsl:sort select="@xi" data-type="number" />
		</xsl:apply-templates>
		<xsl:call-template name="colgroup" />
	</table>
	</xsl:otherwise>
	</xsl:choose>
	</div>
</xsl:template>

<xsl:template name="colgroup">
	<colgroup>
		<xsl:for-each select="$columns">
			<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">
				<col>
					<xsl:attribute name="class">ntb-column<xsl:value-of select="$uniqueId"/><xsl:if test="$columnsId">_<xsl:value-of select="$columnsId"/></xsl:if>_<xsl:value-of select="position()" /><xsl:text> </xsl:text><xsl:if test="not(@Editable='1')">ntb-column-readonly</xsl:if></xsl:attribute>
				</col>
			</xsl:if>
		</xsl:for-each>
	</colgroup>
</xsl:template>

<xsl:template match="ntb:e">

		<xsl:variable name="rowClass">
			<xsl:if test="@xi mod 2 = 0">ntb-row-alternate</xsl:if>
			<!--
			<xsl:if test="<xsl:value-of select="@rowselectattr=1"/>">ebarowselected</xsl:if>
			-->
		</xsl:variable>

		<xsl:variable name="xi" select="@xi" />    
		<xsl:variable name="row" select="." />

		<tr class="ntb-row {$rowClass} ntb-row{$uniqueId}" xi="{$xi}" path="{$surfaceKey}">
			<xsl:attribute name="id">row_<xsl:value-of select="$surfaceKey" />_<xsl:value-of select="$xi" /><xsl:value-of select="$frozenColumnId"/>_<xsl:value-of select="$uniqueId" /></xsl:attribute>

		<xsl:for-each select="$columns">

			<xsl:if test="@Visible = '1' and (position() &gt; $firstColumn and position() &lt;= $lastColumn)">

				<xsl:call-template name="render-cell">
					<xsl:with-param name="row" select="$row"/>
					<xsl:with-param name="xi" select="$xi"/>
				</xsl:call-template>

			</xsl:if>
		</xsl:for-each>
	</tr>
</xsl:template>

    <xsl:template name="render-cell">
        <xsl:param name="row" />
        <xsl:param name="xi" />

        <xsl:variable name="xdatafld" select="substring-after(@xdatafld,'@')"/>
        <xsl:variable name="pos" select="position()-1"/>
        <xsl:variable name="value"><xsl:choose><xsl:when test="not(@xdatafld = '')"><xsl:value-of select="$row/@*[name()=$xdatafld]" /></xsl:when><!-- @Value will actuall have some escaped XSLT in it like any other bound property --><xsl:otherwise><xsl:value-of select="@Value" /></xsl:otherwise></xsl:choose></xsl:variable>

        <td id="cell_{$xi}_{$pos}_{$uniqueId}_{$surfaceKey}" style="vertical-align:middle;" xi="{$xi}" col="{$pos}" path="{$surfaceKey}">
			<xsl:attribute name="style"><xsl:call-template name="CssStyle"><xsl:with-param name="row" select="$row"/></xsl:call-template></xsl:attribute>
            <!-- note the use of the ntb-column<xsl:value-of select="$uniqueId"/>_<xsl:value-of select="position()" /> class ... that is for a safari bug -->
            <xsl:attribute name="class">ntb-cell-border<xsl:text> </xsl:text>ntb-column-data<xsl:value-of select="$uniqueId"/>_<xsl:value-of select="position()" /><xsl:text> </xsl:text>ntb-column-<xsl:choose><xsl:when test="$sortColumn=$pos and $sortDirection='Asc'">ascending</xsl:when><xsl:when test="$sortColumn=$pos and $sortDirection='Desc'">descending</xsl:when><xsl:otherwise></xsl:otherwise></xsl:choose><xsl:text> </xsl:text><xsl:choose><xsl:when test="@DataType = 'expand'">ntb-column-collapsed</xsl:when><xsl:otherwise>ntb-column-<xsl:value-of select="@DataType"/></xsl:otherwise></xsl:choose><xsl:text> </xsl:text><xsl:call-template name="ClassName"><xsl:with-param name="row" select="$row"/></xsl:call-template><xsl:text> </xsl:text><xsl:if test="@type = 'NUMBER' and $value &lt; 0">ntb-cell-negativenumber</xsl:if>ntb-column<xsl:value-of select="$uniqueId"/><xsl:if test="$columnsId">_<xsl:value-of select="$columnsId"/></xsl:if>_<xsl:value-of select="position()" /></xsl:attribute>

			<xsl:choose>
        		<xsl:when test="@type = 'EXPAND'">
        			<xsl:attribute name="ebatype">expander</xsl:attribute>
        		</xsl:when>
        		<xsl:otherwise>
        			<xsl:attribute name="ebatype">cell</xsl:attribute>
        		</xsl:otherwise>
        	</xsl:choose>
            <div style="overflow:hidden;white-space:nowrap;">
            	<xsl:attribute name="class">ntb-row<xsl:value-of select="$uniqueId"/><xsl:text> </xsl:text>ntb-column-data<xsl:value-of select="$uniqueId"/>_<xsl:value-of select="position()" /><xsl:text> </xsl:text>ntb-cell</xsl:attribute>
	            <xsl:if test="@TooltipsEnabled='1'">
	            	<xsl:attribute name="title">
	            		<xsl:value-of select="$value"/>
	            	</xsl:attribute>
				</xsl:if>

                <xsl:call-template name="render-value">
                    <xsl:with-param name="value" select="$value"/>
                    <xsl:with-param name="mask" select="@Mask"/>
                    <xsl:with-param name="negativeMask" select="@NegativeMask"/>
                    <xsl:with-param name="groupseparator" select="@GroupingSeparator"/>
        			<xsl:with-param name="decimalseparator" select="@DecimalSeparator"/>
                    <xsl:with-param name="datasource" select="@DatasourceId"/>
                    <xsl:with-param name="valuefield" select="@ValueField"/>
                    <xsl:with-param name="displayfields" select="@DisplayFields"/>
                    <xsl:with-param name="checkedvalue" select="@CheckedValue"/>
                    <xsl:with-param name="imageurl" select="@ImageUrl"/>
                </xsl:call-template>

            </div>

        </td>        
    </xsl:template>

    <xsl:template name="render-value">

        <xsl:param name="value" />
        <xsl:param name="mask" />
        <xsl:param name="negativeMask" />
        <xsl:param name="groupseparator" />
        <xsl:param name="decimalseparator" />
        <xsl:param name="datasource" />
        <xsl:param name="valuefield" />
        <xsl:param name="displayfields" />
        <xsl:param name="checkedvalue" />
        <xsl:param name="imageurl" />

        <xsl:choose>
            <xsl:when test="@type = 'TEXT' or @type = ''">
                <xsl:call-template name="replaceblank">
                    <xsl:with-param name="value" select="$value" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="@type = 'NUMBER'">
                <xsl:variable name="number-mask">
                    <xsl:choose>
                        <xsl:when test="$mask"><xsl:value-of select="$mask" /></xsl:when>
                        <xsl:otherwise>#,###.00</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
				<xsl:variable name="negative-number-mask">
					<xsl:choose>
						<xsl:when test="$negativeMask and not($negativeMask='')"><xsl:value-of select="$negativeMask" /></xsl:when>
						<xsl:otherwise><xsl:value-of select="$number-mask" /></xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
                <xsl:variable name="number">
					<xsl:choose>
						<xsl:when test="$value &lt; 0">
		                    <xsl:call-template name="n:format">
		                        <xsl:with-param name="number" select="translate($value,'-','')" />
		                        <xsl:with-param name="mask" select="$negative-number-mask" />
								<xsl:with-param name="group" select="$groupseparator" />
								<xsl:with-param name="decimal" select="$decimalseparator" />
		                    </xsl:call-template>
		                </xsl:when>
		                <xsl:otherwise>
		                    <xsl:call-template name="n:format">
		                        <xsl:with-param name="number" select="$value" />
		                        <xsl:with-param name="mask" select="$number-mask" />
								<xsl:with-param name="group" select="$groupseparator" />
								<xsl:with-param name="decimal" select="$decimalseparator" />
		                    </xsl:call-template>
		                </xsl:otherwise>
					</xsl:choose>
                </xsl:variable>
                <xsl:call-template name="replaceblank">
                    <xsl:with-param name="value" select="$number" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="@type = 'LOOKUP'">
                <xsl:choose>
                    <xsl:when test="$valuefield = $displayfields">
                        <xsl:call-template name="replaceblank">
                            <xsl:with-param name="value" select="$value" />
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="replaceblank">
                            <xsl:with-param name="value">
                                
                                <xsl:choose>
                                    <xsl:when test="$datasource">
                                        <xsl:variable name="preset-value" >
                                            <xsl:for-each select="key('data-source',$datasource)//*">
                                                <xsl:if test="@*[name(.)=$valuefield and .=$value]">
                                                    <xsl:call-template name="print-displayfields">
                                                        <xsl:with-param name="field" select="$displayfields" />
                                                    </xsl:call-template>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </xsl:variable>
                                        <xsl:choose>
                                            <xsl:when test="$preset-value=''">
                                                <xsl:value-of select="$value"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="$preset-value"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="$value"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                                
                            </xsl:with-param>
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:when test="@type = 'LISTBOX'">
                <xsl:choose>
                    <xsl:when test="$datasource">
						<xsl:variable name="temp-value">
                        <xsl:for-each select="key('data-source',$datasource)//*">
                            <xsl:if test="@*[name(.)=$valuefield and .=$value]">
                               <xsl:call-template name="replaceblank">
                                   <xsl:with-param name="value">
                                       <xsl:call-template name="print-displayfields">
                                           <xsl:with-param name="field" select="$displayfields" />
                                       </xsl:call-template>
                                   </xsl:with-param>
                               </xsl:call-template>
                            </xsl:if>
                        </xsl:for-each>
						</xsl:variable>
						<xsl:choose>
							<xsl:when test="not($temp-value = '')">
								<xsl:value-of select="$temp-value"/>
							</xsl:when>
                    		<xsl:otherwise>
                        		<xsl:call-template name="replaceblank">
                            		<xsl:with-param name="value" select="$value" />
                        		</xsl:call-template>
                    		</xsl:otherwise>
						</xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="replaceblank">
                            <xsl:with-param name="value" select="$value" />
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:when test="@type = 'CHECKBOX'">
                <xsl:for-each select="key('data-source',$datasource)//*">
                    
                    <xsl:if test="@*[name(.)=$valuefield and .=$value]">
                        
                        <xsl:variable name="checkString">
                            <xsl:choose>
                                <xsl:when test="$value=$checkedvalue">checked</xsl:when>
                                <xsl:otherwise>unchecked</xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        
                        <div style="overflow:hidden;">
                            <div class="ntb-checkbox ntb-checkbox-{$checkString}" checked="{$value}" width="10" >ATOKENTOREPLACE</div>
							<div class="ntb-checkbox-text"><xsl:value-of select="@*[name(.)=$displayfields]" /></div>
                        </div>
                    </xsl:if>
                </xsl:for-each>
                
            </xsl:when>
            <xsl:when test="@type = 'IMAGE'">
                <xsl:variable name="url">
                    <xsl:choose>
                        <xsl:when test="$imageurl and not($imageurl='')"><xsl:value-of select="$imageurl" /></xsl:when>
                        <xsl:otherwise><xsl:value-of select="$value" /></xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <!-- image editor -->
                <img border="0" src="{$url}" align="middle" class="ntb-image" />
            </xsl:when>
            <xsl:when test="@type = 'DATE'">
                <xsl:variable name="date-mask">
                    <xsl:choose>
                        <xsl:when test="$mask"><xsl:value-of select="$mask" /></xsl:when>
                        <xsl:otherwise>MMM d, yy</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:variable name="date">
                    <xsl:call-template name="d:format-date">
                        <xsl:with-param name="date-time" select="$value" />
                        <xsl:with-param name="mask" select="$date-mask" />
                    </xsl:call-template>
                </xsl:variable>
                <xsl:call-template name="replaceblank">
                    <xsl:with-param name="value" select="$date" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="@type = 'TEXTAREA'">
                <xsl:call-template name="replace-break">
                    <xsl:with-param name="text">
                        <xsl:call-template name="replaceblank">
                            <xsl:with-param name="value" select="$value" />
                        </xsl:call-template>
                    </xsl:with-param>  
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="@type = 'PASSWORD'">*********</xsl:when>
            <xsl:when test="@type = 'LINK'">
                <span class="ntb-hyperlink-editor">
                    <xsl:call-template name="replaceblank">
                        <xsl:with-param name="value" select="$value" />
                    </xsl:call-template>
                </span>
            </xsl:when>	
            <xsl:when test="@type = 'EXPAND'">
		            <xsl:attribute name="style">height:1px;</xsl:attribute>
            </xsl:when>	    
            <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
        
    </xsl:template>

<xsl:template name="replaceblank">
   <xsl:param name="value" />

   <xsl:choose>
      <xsl:when test="not($value) or $value = '' or $value = ' '">ATOKENTOREPLACE</xsl:when>
      <xsl:otherwise><xsl:value-of select="$value" /></xsl:otherwise>
   </xsl:choose>
</xsl:template>

<xsl:template name="replace">
	<xsl:param name="text"/>
	<xsl:param name="search"/>
	<xsl:param name="replacement"/>
	<xsl:choose>
		<xsl:when test="contains($text, $search)">
			<xsl:value-of select="substring-before($text, $search)"/>
			<xsl:value-of select="$replacement"/>
			<xsl:call-template name="replace">
				<xsl:with-param name="text" select="substring-after($text,$search)"/>
				<xsl:with-param name="search" select="$search"/>
				<xsl:with-param name="replacement" select="$replacement"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$text"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="print-displayfields">
	<xsl:param name="field" />
	<xsl:choose>
		<xsl:when test="contains($field,'|')" >
			<!-- Here we hardcode a spacer ', ' - this should probably be moved elsewhere. -->
			<xsl:value-of select="concat(@*[name(.)=substring-before($field,'|')],', ')" />
			<xsl:call-template name="print-displayfields">
				<xsl:with-param name="field" select="substring-after($field,'|')" />
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="@*[name(.)=$field]" />
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="replace-break">
	<xsl:param name="text"/>
	<xsl:call-template name="replace">
		<xsl:with-param name="text" select="$text"/>
		<xsl:with-param name="search" select="'&amp;amp;#xa;'"/>
		<xsl:with-param name="replacement" select="'&amp;lt;br/&amp;gt;'"/>
	</xsl:call-template>
</xsl:template>

<xsl:template name="ClassName">
    <xsl:param name="row"/>
    <xsl:variable name="class" select="@ClassName"/>
    <xsl:variable name="value" select="$row/@*[name()=$class]"/>
    <xsl:choose>
        <xsl:when test="$value"><xsl:value-of select="$value"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="$class"/></xsl:otherwise>
    </xsl:choose>
</xsl:template>

<xsl:template name="CssStyle">
    <xsl:param name="row"/>
    <xsl:variable name="style" select="@CssStyle"/>
    <xsl:variable name="value" select="$row/@*[name()=$style]"/>
    <xsl:choose>
        <xsl:when test="$value"><xsl:value-of select="$value"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="$style"/></xsl:otherwise>
    </xsl:choose>
</xsl:template>

<!--This can be used as an insertion point for column templates-->	
<!--COLUMN-TYPE-TEMPLATES-->

</xsl:stylesheet>
