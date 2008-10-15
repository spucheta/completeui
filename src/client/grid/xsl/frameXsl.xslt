<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:ntb="http://www.nitobi.com" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" omit-xml-declaration="yes"/>
<xsl:param name="browser" select="'IE'"/>
<xsl:param name="scrollbarWidth" select="17" />

<xsl:template match = "/">
<xsl:variable name="u" select="state/@uniqueID" />
<xsl:variable name="Id" select="state/@ID" />
<xsl:variable name="resizeEnabled" select="state/nitobi.grid.Grid/@GridResizeEnabled" />
<xsl:variable name="frozenLeft" select="state/nitobi.grid.Grid/@FrozenLeftColumnCount" />
<xsl:variable name="offset">
    <xsl:choose>
        <xsl:when test="$browser='IE'">1</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
    </xsl:choose>
</xsl:variable>    

    &lt;div id="grid<xsl:value-of select="$u" />" class="ntb-grid ntb-grid-reset <xsl:value-of select="state/nitobi.grid.Grid/@Theme" />" style="overflow:visible;"&gt;
        &lt;div style="height:0px;width:0px;position:relative;"&gt;
                &lt;div id="ntb-grid-overlay<xsl:value-of select="$u" />" class="ntb-grid-overlay<xsl:value-of select="$u" />"&gt;&lt;/div&gt;
                <!-- Firefox or IE just uses a hidden div for keynav since on Mac at least it doesn't capture the paste event on an input -->
				<xsl:if test="not($browser='SAFARI')">&lt;div id="ntb-grid-keynav<xsl:value-of select="$u" />" tabindex="1" style="position:absolute;left:-3000px;width:1px;height:1px;border:0px;background-color:transparent;"&gt;&lt;/div&gt;</xsl:if>
				<!-- Safari can't capture key events on divs so need to use an input -->
                <xsl:if test="$browser='SAFARI'">&lt;input type="text" id="ntb-grid-keynav<xsl:value-of select="$u" />" tabindex="1" style="position:absolute;left:-3000px;width:1px;height:1px;border:0px;background-color:transparent;"&gt;&lt;/input&gt;</xsl:if>
        &lt;/div&gt;

    &lt;table cellpadding="0" cellspacing="0" border="0"&gt;
        &lt;tr&gt;
            &lt;td id="ntb-grid-scroller<xsl:value-of select="$u" />" class="ntb-grid-scrollerheight<xsl:value-of select="$u" /> ntb-grid-scrollerwidth<xsl:value-of select="$u" />" &gt;
                &lt;div id="ntb-grid-scrollerarea<xsl:value-of select="$u" />" class="ntb-grid-scrollerheight<xsl:value-of select="$u" />" style="overflow:hidden;" &gt;
                    &lt;div tabindex="2" class="ntb-grid-scroller<xsl:value-of select="$u" /> ntb-grid-scrollerheight<xsl:value-of select="$u" />" &gt;
                        &lt;table class="ntb-grid-scroller" cellpadding="0" cellspacing="0" border="0" &gt;
                            &lt;tr id="ntb-grid-header<xsl:value-of select="$u" />" class="ntb-grid-topheight<xsl:value-of select="$u" /> " &gt;
                                &lt;td class="ntb-scroller ntb-grid-topheight<xsl:value-of select="$u" /> ntb-grid-leftwidth<xsl:value-of select="$u" />" &gt;
                                    &lt;div id="gridvp_0_<xsl:value-of select="$u" />" class="ntb-grid-topheight<xsl:value-of select="$u" /> ntb-grid-leftwidth<xsl:value-of select="$u" /> ntb-grid-header"&gt;
                                        &lt;div id="gridvpsurface_0_<xsl:value-of select="$u" />" &gt;
                                            &lt;div id="gridvpcontainer_0_<xsl:value-of select="$u" />" &gt;&lt;/div&gt;
                                        &lt;/div&gt;
                                    &lt;/div&gt;
                                &lt;/td&gt;
                                &lt;td class="ntb-scroller" &gt;
                                    &lt;div id="gridvp_1_<xsl:value-of select="$u" />" class="ntb-grid-topheight<xsl:value-of select="$u" /> ntb-grid-centerwidth<xsl:value-of select="$u" /> ntb-grid-header"&gt;
                                        &lt;div id="gridvpsurface_1_<xsl:value-of select="$u" />" class="ntb-grid-surfacewidth<xsl:value-of select="$u" />" &gt;
                                            &lt;div id="gridvpcontainer_1_<xsl:value-of select="$u" />" &gt;&lt;/div&gt;
                                        &lt;/div&gt;
                                    &lt;/div&gt;
                                &lt;/td&gt;
                            &lt;/tr&gt;
                            &lt;tr id="ntb-grid-data<xsl:value-of select="$u" />"class="ntb-grid-scroller" &gt;
                                &lt;td class="ntb-scroller ntb-grid-leftwidth<xsl:value-of select="$u" />" &gt;
                                    &lt;div style="position:relative;"&gt;
										<xsl:if test="not($browser='IE') and not($frozenLeft='0')">
                                        	&lt;div style="z-index:100;position:absolute;height:100%;top:0px;overflow:hidden;" id="ntb-frozenshadow<xsl:value-of select="$u" />" class="ntb-frozenshadow"&gt;&lt;/div&gt;
                                        </xsl:if>
										&lt;div id="gridvp_2_<xsl:value-of select="$u" />"  class="ntb-grid-midheight<xsl:value-of select="$u" /> ntb-grid-leftwidth<xsl:value-of select="$u" />" style="position:relative;"&gt;
                                            &lt;div id="gridvpsurface_2_<xsl:value-of select="$u" />" &gt;
                                                &lt;div id="gridvpcontainer_2_<xsl:value-of select="$u" />" &gt;&lt;/div&gt;
                                            &lt;/div&gt;
                                        &lt;/div&gt;
                                    &lt;/div&gt;
                                &lt;/td&gt;
                                &lt;td class="ntb-scroller" &gt;
                                    &lt;div id="gridvp_3_<xsl:value-of select="$u" />" class="ntb-grid-midheight<xsl:value-of select="$u"/> ntb-grid-centerwidth<xsl:value-of select="$u" />" style="position:relative;"&gt;
                                        &lt;div id="gridvpsurface_3_<xsl:value-of select="$u" />" class="ntb-grid-surfacewidth<xsl:value-of select="$u" />" &gt;
                                            &lt;div id="gridvpcontainer_3_<xsl:value-of select="$u" />" &gt;&lt;/div&gt;
                                        &lt;/div&gt;
                                    &lt;/div&gt;
                                &lt;/td&gt;
                            &lt;/tr&gt;
                        &lt;/table&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/td&gt;
            &lt;td id="ntb-grid-vscrollshow<xsl:value-of select="$u" />" class="ntb-grid-scrollerheight<xsl:value-of select="$u" />"&gt;&lt;div id="vscrollclip<xsl:value-of select="$u" />" class="ntb-grid-scrollerheight<xsl:value-of select="$u" /> ntb-grid-scrollbarwidth<xsl:value-of select="$u"/> ntb-scrollbar" style="overflow:hidden;" &gt;&lt;div id="vscroll<xsl:value-of select="$u" />" class="ntb-scrollbar" style="height:100%;width:<xsl:value-of select="number($offset)+number(state/nitobi.grid.Grid/@scrollbarWidth)"/>px;position:relative;top:0px;left:-<xsl:value-of select="$offset"/>px;overflow-x:hidden;overflow-y:scroll;" &gt;&lt;div class="vScrollbarRange<xsl:value-of select="$u" />" style="WIDTH:1px;overflow:hidden;"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;/td&gt;    
        &lt;/tr&gt;
        &lt;tr id="ntb-grid-hscrollshow<xsl:value-of select="$u" />" &gt;
            &lt;td &gt;&lt;div id="hscrollclip<xsl:value-of select="$u" />" class="ntb-grid-scrollbarheight<xsl:value-of select="$u" /> ntb-grid-scrollerwidth<xsl:value-of select="$u" /> ntb-hscrollbar<xsl:value-of select="$u" />" style="overflow:hidden;" &gt;
                &lt;div id="hscroll<xsl:value-of select="$u" />" class="ntb-grid-scrollbarheight<xsl:value-of select="$u" /> ntb-grid-scrollerwidth<xsl:value-of select="$u" /> ntb-scrollbar" style="overflow-x:scroll;overflow-y:hidden;height:<xsl:value-of select="number($offset)+number(state/nitobi.grid.Grid/@scrollbarHeight)"/>px;position:relative;top:-<xsl:value-of select="$offset"/>px;left:0px;" &gt;
                    &lt;div class="hScrollbarRange<xsl:value-of select="$u" />" style="HEIGHT:1px;overflow:hidden;"&gt;
                &lt;/div&gt;
            &lt;/td&gt;
            &lt;td class="ntb-grid-vscrollshow<xsl:value-of select="$u" /> ntb-scrollcorner" &gt;&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;

		&lt;div id="toolbarContainer<xsl:value-of select="$u" />" style="overflow:hidden;" class="ntb-grid-toolbarshow<xsl:value-of select="$u" /> ntb-grid-toolbarheight<xsl:value-of select="$u" /> ntb-grid-width<xsl:value-of select="$u" /> ntb-toolbar<xsl:value-of select="$u" /> ntb-toolbar"&gt;&lt;/div&gt;

        &lt;div id="ntb-grid-toolscontainer<xsl:value-of select="$u"/>" style="height:0px;position:relative;"&gt;
			<!-- In IE quirks the textarea has a forced height so need it to have a relative positioned container -->
	        &lt;div style="position:relative;overflow:hidden;height:0px;"&gt;
	            &lt;textarea id="ntb-clipboard<xsl:value-of select="$u"/>" class="ntb-clipboard" &gt;&lt;/textarea&gt;
	        &lt;/div&gt;
	        &lt;div style="position:relative;"&gt;
	            &lt;div id="ntb-column-resizeline<xsl:value-of select="$u" />" class="ntb-column-resizeline"&gt;&lt;/div&gt;
	            &lt;div id="ntb-grid-resizebox<xsl:value-of select="$u" />" class="ntb-grid-resizebox"&gt;&lt;/div&gt;
			&lt;/div&gt;
        &lt;/div&gt;

		<xsl:if test="$resizeEnabled = 1">
	        &lt;div id="ntb-grid-resizecontainer<xsl:value-of select="$u"/>" style="height:0px;position:relative;"&gt;
	        	&lt;div id="ntb-grid-resizeright<xsl:value-of select="$u" />" class="ntb-resize-indicator-right"&gt;&lt;/div&gt;
	        	&lt;div id="ntb-grid-resizebottom<xsl:value-of select="$u" />" class="ntb-resize-indicator-bottom"&gt;&lt;/div&gt;
	        &lt;/div&gt;
		</xsl:if>

    &lt;/div&gt;

</xsl:template>

</xsl:stylesheet>
