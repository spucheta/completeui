<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:ntb="http://www.nitobi.com" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" omit-xml-declaration="yes"/>
<xsl:param name="IE" select="'false'"/>
<xsl:param name="scrollbarWidth" select="17" />
<xsl:param name="isSubgroup" select="'false'" />
<xsl:param name="uniqueId" />
<xsl:param name="surfaceKey" select="0" />
<xsl:param name="columnsId" />
<xsl:param name="groupOffset"/>

<xsl:template match = "/">
	&lt;div id="<xsl:value-of select="$surfaceKey"/>_surface<xsl:value-of select="$uniqueId"/>" class="ntb-surface<xsl:if test="$isSubgroup='true'"> nitobi-hide</xsl:if>" style="overflow:hidden;">
	&lt;table cellpadding="0" cellspacing="0" border="0" <xsl:choose><xsl:when test="$isSubgroup='true'">class="ntb-grid-subgroup" style="left:<xsl:value-of select="$groupOffset"/>px;position:relative;"</xsl:when><xsl:otherwise>class="ntb-grid-scroller"</xsl:otherwise></xsl:choose>&gt;
	    <!-- &lt;tr class="ntb-grid-topheight<xsl:value-of select="$uniqueId" /> " &gt; -->
	    &lt;tr id="ntb-grid-header<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey" />" class="ntb-grid-topheight<xsl:value-of select="$uniqueId" /> "&gt;
	        &lt;td class="ntb-scroller ntb-grid-topheight<xsl:value-of select="$uniqueId" />" &gt;
	            &lt;div id="gridvp_0_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" class="ntb-grid-topheight<xsl:value-of select="$uniqueId" /> ntb-grid-leftwidth<xsl:value-of select="$uniqueId" />"&gt;
	                &lt;div id="gridvpsurface_0_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;
	                    &lt;div id="gridvpcontainer_0_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;&lt;/div&gt;
	                &lt;/div&gt;
	            &lt;/div&gt;
	        &lt;/td&gt;
	        &lt;td class="ntb-scroller" &gt;
        	    &lt;div id="gridvp_1_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" class="ntb-grid-topheight<xsl:value-of select="$uniqueId" /> ntb-grid-centerwidth<xsl:value-of select="$uniqueId" />-<xsl:value-of select="$surfaceKey" /> ntb-grid-header"&gt;
	                &lt;div id="gridvpsurface_1_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" class="ntb-grid-surfacewidth<xsl:value-of select="$uniqueId" />-<xsl:value-of select="$columnsId"/>" &gt;
	                    &lt;div id="gridvpcontainer_1_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;&lt;/div&gt;
	                &lt;/div&gt;
	            &lt;/div&gt;
	        &lt;/td&gt;
	    &lt;/tr&gt;
	    <xsl:if test="$surfaceKey=0">
		    &lt;tr class="ntb-grid-subheader-container"&gt;
		    	&lt;td&gt;
		    		
		    	&lt;/td&gt;
		    	&lt;td&gt;
		    		&lt;div id="ntb-grid-subheader-container<xsl:value-of select="$uniqueId"/>" class="ntb-grid-centerwidth<xsl:value-of select="$uniqueId"/>-0" style="display:none;overflow: hidden; position: absolute; z-index: 100;"&gt;&lt;/div&gt;
		    	&lt;/td&gt;
		    &lt;/tr&gt;
		</xsl:if>
	    &lt;tr id="ntb-grid-data<xsl:value-of select="$uniqueId" />" class="ntb-grid-scroller" &gt;
	    <!-- &lt;tr class="ntb-grid-scroller" &gt; -->
	        &lt;td class="ntb-scroller" &gt;
	            &lt;div style="position:relative;"&gt;
	                <!--&lt;div id="ntb-frozenshadow<xsl:value-of select="$uniqueId" />" class="ntb-frozenshadow"&gt;&lt;/div&gt;-->
	                &lt;div id="gridvp_2_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>"  class="ntb-grid-midheight<xsl:value-of select="$uniqueId" />-<xsl:value-of select="$surfaceKey" /> ntb-grid-leftwidth<xsl:value-of select="$uniqueId" />" style="position:relative;"&gt;
	                    &lt;div id="gridvpsurface_2_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;
	                        &lt;div id="gridvpcontainer_2_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;&lt;/div&gt;
	                    &lt;/div&gt;
	                &lt;/div&gt;
	            &lt;/div&gt;
	        &lt;/td&gt;
	        &lt;td class="ntb-scroller" &gt;
	            &lt;div id="gridvp_3_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" class="ntb-grid-midheight<xsl:value-of select="$uniqueId"/>-<xsl:value-of select="$surfaceKey" /> ntb-grid-centerwidth<xsl:value-of select="$uniqueId" />-<xsl:value-of select="$surfaceKey" />" style="position:relative;"&gt;
	                &lt;div id="gridvpsurface_3_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" class="ntb-grid-surfacewidth<xsl:value-of select="$uniqueId" />-<xsl:value-of select="$columnsId"></xsl:value-of>" &gt;
	                    &lt;div id="gridvpcontainer_3_<xsl:value-of select="$uniqueId" />_<xsl:value-of select="$surfaceKey"/>" &gt;&lt;/div&gt;
	                &lt;/div&gt;
	            &lt;/div&gt;
	        &lt;/td&gt;
	    &lt;/tr&gt;
	&lt;/table&gt;
	&lt;/div&gt;
</xsl:template>
</xsl:stylesheet>