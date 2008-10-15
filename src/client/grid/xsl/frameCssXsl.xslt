<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:user="http://mycompany.com/mynamespace" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" omit-xml-declaration="yes"/>
<xsl:param name="IE" select="'false'"/>
<xsl:variable name="g" select="//state/nitobi.grid.Grid"></xsl:variable>
<xsl:variable name="u" select="//state/@uniqueID"></xsl:variable>
<xsl:key name="style" match="//s" use="@k" />

<xsl:template match = "/">
	<xsl:variable name="t" select="$g/@Theme"></xsl:variable>
	<xsl:variable name="showvscroll"><xsl:choose><xsl:when test="($g/@VScrollbarEnabled='true' or $g/@VScrollbarEnabled=1)">1</xsl:when><xsl:otherwise>0</xsl:otherwise></xsl:choose></xsl:variable>
	<xsl:variable name="showhscroll"><xsl:choose><xsl:when test="($g/@HScrollbarEnabled='true' or $g/@HScrollbarEnabled=1)">1</xsl:when><xsl:otherwise>0</xsl:otherwise></xsl:choose></xsl:variable>
	<xsl:variable name="showtoolbar"><xsl:choose><xsl:when test="($g/@ToolbarEnabled='true' or $g/@ToolbarEnabled=1)">1</xsl:when><xsl:otherwise>0</xsl:otherwise></xsl:choose></xsl:variable>		
	<xsl:variable name="frozen-columns-width">
		<xsl:call-template name="get-pane-width">
				<xsl:with-param name="start-column" select="number(1)"/>
				<xsl:with-param name="end-column" select="number($g/@FrozenLeftColumnCount)"/>
				<xsl:with-param name="current-width" select="number(0)"/>
			</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="unfrozen-columns-width">
		<xsl:call-template name="get-pane-width">
			<xsl:with-param name="start-column" select="number($g/@FrozenLeftColumnCount)+1"/>
			<xsl:with-param name="end-column" select="number($g/@ColumnCount)"/>
			<xsl:with-param name="current-width" select="number(0)"/>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="total-columns-width">
		<xsl:value-of select="number($frozen-columns-width) + number($unfrozen-columns-width)"/>
	</xsl:variable>
	<xsl:variable name="scrollerHeight" select="number($g/@Height)-(number($g/@scrollbarHeight)*$showhscroll)-(number($g/@ToolbarHeight)*$showtoolbar)" />
	<xsl:variable name="scrollerWidth" select="number($g/@Width)-(number($g/@scrollbarWidth)*number($g/@VScrollbarEnabled))" />

	<xsl:variable name="midHeight" select="number($g/@Height)-(number($g/@scrollbarHeight)*$showhscroll)-(number($g/@ToolbarHeight)*$showtoolbar)-number($g/@top)"/>

	#grid<xsl:value-of select="$u" />  {
		height:<xsl:value-of select="$g/@Height" />px;
		width:<xsl:value-of select="$g/@Width" />px;
		overflow:hidden;text-align:left;
	<xsl:if test="$IE='true'">
		position:relative;
	</xsl:if>
	}
	.hScrollbarRange<xsl:value-of select="$u" /> {
		width:<xsl:value-of select="$total-columns-width"/>px;
	}
	.vScrollbarRange<xsl:value-of select="$u" /> {}

	.ntb-grid-datablock, .ntb-grid-headerblock {
		table-layout:fixed;
	<xsl:if test="$IE='true'">
		width:0px;
	</xsl:if>
	}

	.<xsl:value-of select="$t"/> .ntb-cell {overflow:hidden;white-space:nowrap;}
	.<xsl:value-of select="$t"/> .ntb-cell, x:-moz-any-link, x:default {display: -moz-box;}
	.<xsl:value-of select="$t"/> .ntb-column-indicator, x:-moz-any-link, x:default {display: -moz-box;}
	.<xsl:value-of select="$t"/> .ntb-cell-border {overflow:hidden;white-space:nowrap;<xsl:if test="$IE='true'">height:auto;</xsl:if>}

	.ntb-grid-headershow<xsl:value-of select="$u" /> {padding:0px;<xsl:if test="not($g/@ColumnIndicatorsEnabled=1)">display:none;</xsl:if>}
	.ntb-grid-vscrollshow<xsl:value-of select="$u" /> {padding:0px;<xsl:if test="not($g/@VScrollbarEnabled=1)">display:none;</xsl:if>}
	#ntb-grid-hscrollshow<xsl:value-of select="$u" /> {padding:0px;<xsl:if test="not($g/@HScrollbarEnabled=1)">display:none;</xsl:if>}
	.ntb-grid-toolbarshow<xsl:value-of select="$u" /> {<xsl:if test="not($g/@ToolbarEnabled=1) and not($g/@ToolbarEnabled='true')">display:none;</xsl:if>}

	.ntb-grid-height<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@Height" />px;overflow:hidden;}
	.ntb-grid-width<xsl:value-of select="$u" /> {width:<xsl:value-of select="$g/@Width" />px;overflow:hidden;}
	.ntb-grid-overlay<xsl:value-of select="$u" /> {position:relative;z-index:1000;top:0px;left:0px;}

	.ntb-grid-scroller<xsl:value-of select="$u" /> {
		overflow:hidden;
		text-align:left;
		-moz-user-select: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		user-select: none;
	}
	.ntb-grid-scrollerheight<xsl:value-of select="$u" /> {height: <xsl:choose><xsl:when test="($total-columns-width &gt; $g/@Width)"><xsl:value-of select="$scrollerHeight"/></xsl:when><xsl:otherwise><xsl:value-of select="number($scrollerHeight) + number($g/@scrollbarHeight)"/></xsl:otherwise></xsl:choose>px;}
	.ntb-grid-scrollerwidth<xsl:value-of select="$u" /> {width:<xsl:value-of select="$scrollerWidth"/>px;}
	.ntb-grid-topheight<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@top" />px;overflow:hidden;<xsl:if test="$g/@top=0">display:none;</xsl:if>}
	.ntb-grid-midheight<xsl:value-of select="$u" /> {overflow:hidden;height:<xsl:choose><xsl:when test="($total-columns-width &gt; $g/@Width)"><xsl:value-of select="$midHeight"/></xsl:when><xsl:otherwise><xsl:value-of select="number($midHeight) + number($g/@scrollbarHeight)"/></xsl:otherwise></xsl:choose>px;}
	.ntb-grid-leftwidth<xsl:value-of select="$u" /> {width:<xsl:value-of select="$g/@left" />px;overflow:hidden;text-align:left;}
	.ntb-grid-centerwidth<xsl:value-of select="$u" /> {width:<xsl:value-of select="number($g/@Width)-number($g/@left)-(number($g/@scrollbarWidth)*$showvscroll)" />px;}
	.ntb-grid-scrollbarheight<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@scrollbarHeight" />px;}
	.ntb-grid-scrollbarwidth<xsl:value-of select="$u" /> {width:<xsl:value-of select="$g/@scrollbarWidth" />px;}
	.ntb-grid-toolbarheight<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@ToolbarHeight" />px;}
	.ntb-grid-surfacewidth<xsl:value-of select="$u" /> {width:<xsl:value-of select="number($unfrozen-columns-width)"/>px;}
	.ntb-grid-surfaceheight<xsl:value-of select="$u" /> {height:100px;}

	.ntb-grid {padding:0px;margin:0px;border:1px solid #cccccc}
	.ntb-scroller {padding:0px;}
	.ntb-scrollcorner {padding:0px;}

	.ntb-hscrollbar<xsl:value-of select="$u" /> {<xsl:choose><xsl:when test="($total-columns-width &gt; $g/@Width)">display:block;</xsl:when><xsl:otherwise>display:none;</xsl:otherwise></xsl:choose>}

	.ntb-input-border {
		table-layout:fixed;
		overflow:hidden;
		position:absolute;
		z-index:2000;
		top:-2000px;
		left:-2000px;
	}

	.ntb-column-resize-surface {
		filter:alpha(opacity=1);
		background-color:white;
		position:absolute;
		display:none;
		top:-1000px;
		left:-5000px;
		width:100px;
		height:100px;
		z-index:800;
	}

	.<xsl:value-of select="$t"/> .ntb-column-indicator {
		overflow:hidden;
		white-space: nowrap;    
	}

	.ntb-row<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@RowHeight" />px;line-height:<xsl:value-of select="$g/@RowHeight" />px;margin:0px;}
	.ntb-header-row<xsl:value-of select="$u" /> {height:<xsl:value-of select="$g/@HeaderHeight" />px;}

	<xsl:apply-templates select="state/nitobi.grid.Columns" />

</xsl:template>

<xsl:template name="get-pane-width">
	<xsl:param name="start-column"/>
	<xsl:param name="end-column"/>
	<xsl:param name="current-width"/>
	<xsl:choose>
		<xsl:when test="$start-column &lt;= $end-column">
			<xsl:call-template name="get-pane-width">
				<xsl:with-param name="start-column" select="$start-column+1"/>
				<xsl:with-param name="end-column" select="$end-column"/>
				<xsl:with-param name="current-width" select="number($current-width) + number(//state/nitobi.grid.Columns/nitobi.grid.Column[$start-column]/@Width)"/>
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:value-of select="$current-width"/>
		</xsl:otherwise>
	</xsl:choose>
		
</xsl:template>

<xsl:template match="nitobi.grid.Columns">
	<xsl:for-each select="*">
		<xsl:variable name="p"><xsl:value-of select="position()"/></xsl:variable>
		<xsl:variable name="w"><xsl:value-of select="@Width"/></xsl:variable>
		<xsl:variable name="colw"><xsl:value-of select="number($w)-number($g/@CellBorder)"/></xsl:variable>
		<xsl:variable name="coldataw"><xsl:value-of select="number($w)-number($g/@InnerCellBorder)"/></xsl:variable>
		#grid<xsl:value-of select="$u" /> .ntb-column<xsl:value-of select="$u" />_<xsl:number value="$p" /> {width:<xsl:value-of select="$colw" />px;}
		#grid<xsl:value-of select="$u" /> .ntb-column-data<xsl:value-of select="$u" />_<xsl:number value="$p" /> {width:<xsl:value-of select="$coldataw" />px;text-align:<xsl:value-of select="@Align"/>;}
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
