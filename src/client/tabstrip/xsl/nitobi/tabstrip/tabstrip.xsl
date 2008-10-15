<?xml version='1.0'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" />
	<xsl:param name="apply-id" select="''"></xsl:param>
	<xsl:param name="apply-template" select="''"></xsl:param>

<xsl:template match="/">
	<xsl:choose>
		<xsl:when test="$apply-template = 'tabs'">
			<xsl:apply-templates select="//ntb:tabs"/>
		</xsl:when>
		<xsl:when test="$apply-template = 'body'">
			<xsl:call-template name="body"><xsl:with-param name="tab-position"><xsl:value-of select="$apply-id"/></xsl:with-param></xsl:call-template>
		</xsl:when>
		<xsl:otherwise>
			<xsl:apply-templates select="//ntb:tabstrips/ntb:tabstrip|//ntb:tabstrip"/>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template name="write-id">
	<xsl:param name="local-name"/>
	<xsl:param name="id"/>
	<xsl:variable name="_id">
		<xsl:choose>
			<xsl:when test="$id">
				<xsl:value-of select="$id"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@id"/>
			</xsl:otherwise>
 		</xsl:choose>
	</xsl:variable>
	<xsl:attribute name="id"><xsl:value-of select="$_id"/><xsl:if test="$local-name!=''">.<xsl:value-of select="$local-name"/></xsl:if></xsl:attribute>
</xsl:template>

<xsl:template name="notify">
	<xsl:param name="id"/>
	<xsl:param name="cancel-bubble" select="'true'" />
	<xsl:param name="local-name"/>
	<xsl:variable name="_id">
		<xsl:choose>
			<xsl:when test="$id">
				<xsl:value-of select="$id"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@id"/>
			</xsl:otherwise>
 		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="_local-name">
		<xsl:choose>
			<xsl:when test="$local-name">
				<xsl:value-of select="concat('.',$local-name)"/>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	try
	{
	nitobi.TabStrip.handleEvent('<xsl:value-of select="//ntb:tabstrip/@id"/>',event, '<xsl:value-of select="concat($_id,$_local-name)"/>', <xsl:value-of select="$cancel-bubble" />);
	}
	catch(err)
	{
		nitobi.error.onError.notify(new nitobi.error.ErrorEventArgs(this,err + '[' +<xsl:value-of select="//ntb:tabstrip/@id"/> + ']' ,nitobi.tabstrip.TabStrip.profile.className));
	}	  
</xsl:template>

<xsl:template match="ntb:tabstrip">
	<div>
		<xsl:attribute name="class">
				ntb-tabstrip-reset 

			<xsl:choose>
			<xsl:when test="./@cssclass">
					<xsl:value-of select="./@cssclass"/>
			</xsl:when>
			<xsl:when test="./@theme">
					<xsl:value-of select="./@theme"/>
			</xsl:when>
			<xsl:otherwise>
				nitobi
			</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
		<xsl:attribute name="id"><xsl:value-of select="./@id"/></xsl:attribute>
		<xsl:attribute name="style">
			overflow:hidden;
			width:<xsl:value-of select="@width"/>;
			height:<xsl:value-of select="@height"/>;
			<xsl:value-of select="./@cssstyle"/>
		</xsl:attribute>
		
		<xsl:attribute name="onclick">
			<xsl:call-template name="notify">
				<xsl:with-param name="cancel-bubble" select="'false'" />
			</xsl:call-template>
		</xsl:attribute> 
		<xsl:attribute name="onmouseover">
			<xsl:call-template name="notify">
				<xsl:with-param name="cancel-bubble" select="'false'" />
			</xsl:call-template>
		</xsl:attribute> 
		<xsl:attribute name="onmouseout">
			<xsl:call-template name="notify">
				<xsl:with-param name="cancel-bubble" select="'false'" />
			</xsl:call-template>
		</xsl:attribute> 
	<table border="0" cellpadding="0" cellspacing="0">
		<xsl:attribute name="class">
				ntb-tab-strip
		</xsl:attribute>
		<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">secondarycontainer</xsl:with-param>
		</xsl:call-template>
	<tr class="ntb-tab-strip-max"><td class="ntb-tab-strip-max">	
		<table border="0" cellspacing="0" cellpadding="0" style="border-collapse: separate;" class="ntb-tab-mintable ntb-tab-strip-max">
			<tr class="ntb-tab-mintable ntb-tab-tabs-row">
				<td class="ntb-tab-mintable">
					<xsl:attribute name="class">
						ntb-tab-container
					</xsl:attribute>
					<xsl:attribute name="style">
						width:100%;
						<xsl:if test="ntb:tabs/@align='center'">
							text-align: center;
						</xsl:if>
					</xsl:attribute>
					<xsl:apply-templates select="ntb:tabs"/>
				</td>
			</tr>
	
	<tr class="ntb-tab-bodies-row ntb-tab-mintable">
		<td>
			<xsl:attribute name="class">
					ntb-tab-strip-body-container
			</xsl:attribute>
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">tabbodiescontainer</xsl:with-param>
			</xsl:call-template>
			 <div style="height:100%;overflow:hidden;">
			 <xsl:call-template name="write-id">
				<xsl:with-param name="local-name">tabbodiesdivcontainer</xsl:with-param>
			</xsl:call-template>
			<xsl:for-each select="./ntb:tabs/ntb:tab">
				<xsl:choose>
				<xsl:when test="child::body">
					<xsl:apply-templates select="./body"/> 
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="body">
						<xsl:with-param name="tab-position"><xsl:value-of select="position()"/></xsl:with-param>
					</xsl:call-template>
				</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
			</div>
		</td>
	</tr></table>
	</td></tr></table>
	</div>
</xsl:template> 

<xsl:template match="ntb:tabs">
	<xsl:variable name="percent-exists">
		<xsl:for-each select="./child::ntb:tab">
			<xsl:if test="contains(./@width,'%')">
				true
			</xsl:if>
		</xsl:for-each>
	</xsl:variable>
	<table>
	<xsl:attribute name="onclick">
			 <xsl:call-template name="notify"/>
	</xsl:attribute> 
	<xsl:attribute name="onmouseover">
		 <xsl:call-template name="notify"/>
	</xsl:attribute> 
	<xsl:attribute name="onmouseout">
		 <xsl:call-template name="notify"/>
	</xsl:attribute> 
	<xsl:call-template name="write-id"/>
	<xsl:attribute name="style">
		table-layout:fixed;border-collapse:collapse;padding:0px;margin:0px;width:100%;
		<xsl:if test="@align='center'">
			margin-left: auto;margin-right: auto;text-align: left;
		</xsl:if>
		<xsl:choose>
				<xsl:when test="@align='center'">
					
				</xsl:when>
				<xsl:when test="@align='left' or @align='right'">
					float:<xsl:value-of select="@align"/>
				</xsl:when>
			</xsl:choose>;
	</xsl:attribute>
	
	<tr><td style="margin:0px;padding:0px;">
	<div style="overflow:hidden;width:100%;position:relative;">
		<xsl:call-template name="write-id">
			<xsl:with-param name="local-name">container</xsl:with-param>
		</xsl:call-template>
	<table>
		<xsl:attribute name="class">
			ntb-tab-tabs
		</xsl:attribute>
		
		<xsl:attribute name="style">
		border:white-space:nowrap;table-layout:fixed;border-collapse:collapse;padding:0px;margin:0px; 
			<xsl:choose>
			<xsl:when test="$percent-exists!=''">
				width:<xsl:value-of select="../@width"/>;
			</xsl:when>
			<xsl:otherwise>
				width:100%; 
			</xsl:otherwise>
			</xsl:choose>
		<xsl:if test="@align='center'">
			margin-left: auto;margin-right: auto;text-align: left;
		</xsl:if>
		
			<xsl:choose>
				<xsl:when test="@align='center'">
					
				</xsl:when>
				<xsl:when test="@align='left' or @align='right'">
					float:<xsl:value-of select="@align"/>
				</xsl:when>
			</xsl:choose>;
		</xsl:attribute>
					
			<tr valign="bottom" style="padding:0px;margin:0px;">
				<xsl:if test="@align='center' or @align='right' or not(@align)">
					<td class="ntb-tab-before-tabs"></td>
				</xsl:if>
				
				<xsl:apply-templates select="ntb:tab"/> 
				<xsl:if test="@align='center' or @align='left' or not(@align)">
					<td class="ntb-tab-after-tabs"></td> 
				</xsl:if>
			</tr>
	</table>
	</div>
	</td>
	<td class="ntb-tab-scrollerbuttoncontainer">
		<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">scrollerbuttoncontainer</xsl:with-param>
		</xsl:call-template>
		<div style="position: relative; height: 28px;">
		<input class="ntb-tab-scrollerbutton ntb-tab-scrollerbutton-right" type="button">
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">scrollright</xsl:with-param>
			</xsl:call-template>
			<xsl:attribute name="onmousedown">
				<xsl:call-template name="notify">
					<xsl:with-param name="local-name">scrollright</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
			<xsl:attribute name="onmouseup">
				<xsl:call-template name="notify">
					<xsl:with-param name="local-name">scrollright</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
			<xsl:attribute name="onclick">
				<xsl:call-template name="notify">
					<xsl:with-param name="local-name">scrollright</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
		</input>
		<input class="ntb-tab-scrollerbutton ntb-tab-scrollerbutton-left" type="button" >
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">scrollleft</xsl:with-param>
			</xsl:call-template>
			<xsl:attribute name="onmousedown">
				<xsl:call-template name="notify">
						<xsl:with-param name="local-name">scrollleft</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
			<xsl:attribute name="onmouseup">
				<xsl:call-template name="notify">
						<xsl:with-param name="local-name">scrollleft</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
			<xsl:attribute name="onclick">
				<xsl:call-template name="notify">
						<xsl:with-param name="local-name">scrollleft</xsl:with-param>
				</xsl:call-template>
			</xsl:attribute> 
		</input>
		</div>
	</td>
	</tr></table>
</xsl:template>

<xsl:template match="ntb:tab">
	<xsl:variable name="active-tab-index">
		<xsl:choose>
			<xsl:when test="../@activetabindex">
				<xsl:value-of select="../@activetabindex"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="0"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<td>
		<xsl:attribute name="onclick">
			 <xsl:call-template name="notify"/>
		</xsl:attribute> 
		<xsl:attribute name="onmouseover">
			 <xsl:call-template name="notify"/>
		</xsl:attribute> 
		<xsl:attribute name="onmouseout">
			 <xsl:call-template name="notify"/>
		</xsl:attribute> 
		<xsl:attribute name="onfocus">
			 <xsl:call-template name="notify"/>
		</xsl:attribute> 
		<xsl:attribute name="onblur">
			 <xsl:call-template name="notify"/>
		</xsl:attribute> 
		
		<xsl:call-template name="write-id"/>
		<xsl:attribute name="label-index">
			<xsl:value-of select="position()"/>
		</xsl:attribute> 
		
		<xsl:attribute name="title">
			<xsl:value-of select="tooltip|@tooltip"/>
		</xsl:attribute>
		<xsl:attribute name="style">
padding:0px;margin:0px;	
			<xsl:choose>
				<xsl:when test="@width">
					width:<xsl:value-of select="@width"/>
				</xsl:when>
				<xsl:otherwise>

				</xsl:otherwise>
			</xsl:choose>;

			<xsl:choose>
				<xsl:when test="../@height">
					height:<xsl:value-of select="../@height"/>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>;
		</xsl:attribute>		
	
		<div>
		<xsl:if test="@cssclass">
			<xsl:attribute name="class">
				<xsl:value-of select="./@cssclass"/>
			</xsl:attribute>
		</xsl:if>
		<xsl:call-template name="write-id">
			<xsl:with-param name="local-name">customcss</xsl:with-param>
		</xsl:call-template>
		<div>
			<xsl:attribute name="class">
			<xsl:choose>
				<xsl:when test="position()-1 = $active-tab-index and @enabled!='false'">ntb-tab-active</xsl:when>
				<xsl:when test="@enabled='false'">ntb-tab-disabled</xsl:when>
				<xsl:when test="position()-1 = $active-tab-index">ntb-tab-active</xsl:when>
				<xsl:otherwise>ntb-tab-inactive</xsl:otherwise>
			</xsl:choose>
			</xsl:attribute>
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">activetabclassdiv</xsl:with-param>
			</xsl:call-template>
			
		<div>
			<xsl:attribute name="onmouseover">
				this.prevClassName = this.className;
				this.className = this.className+' ntb-tab-mouseover';		
			</xsl:attribute>
			<xsl:attribute name="onmouseout">
				this.className = this.prevClassName;
			</xsl:attribute>
		<table>
			<xsl:attribute name="class">
				ntb-tab-table
			</xsl:attribute>
			<xsl:variable name="overlap">
				<xsl:choose >
					<xsl:when test="ancestor::ntb:tabs[1]/@overlap">
							<xsl:value-of select="number(ancestor::ntb:tabs[1]/@overlap)"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="number(1)"/>
					</xsl:otherwise>
				</xsl:choose>

			</xsl:variable>
			<xsl:attribute name="style">
				;left:<xsl:value-of select="(position()-1) * (-1 * number($overlap))"/>px;
			</xsl:attribute> 
			<tr style="white-space:nowrap;overflow:visible;padding:0px;margin:0px;">
				<td>
				<xsl:attribute name="class">
					ntb-tab
					ntb-tab-left
				</xsl:attribute>
					<div class="ntb-pulse">
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">leftpulse</xsl:with-param>
						</xsl:call-template>
					</div>
				</td>
				<td>
					<xsl:attribute name="class">
						ntb-tab
						ntb-tab-body
					</xsl:attribute>
					<div class="ntb-pulse" style="position:absolute;width:100%;height:30px;">
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">bodypulse</xsl:with-param>
						</xsl:call-template><xsl:comment>not sure why this is here - empty xsl:comment seems to break safari</xsl:comment>
					</div>						
					<table>
						<xsl:attribute name="class">
							ntb-tab
							ntb-tab-label
						</xsl:attribute>
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">labeltable</xsl:with-param>
						</xsl:call-template>
						<tr>
							<td class="ntb-tab-icon-active">
								<xsl:if test="not(@icon)">
									<xsl:attribute name="style">
										width: 1px;
									</xsl:attribute>
								</xsl:if>
								<img>
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">icon</xsl:with-param>
									</xsl:call-template> 
									<xsl:choose>
									<xsl:when test="@icon">
										<xsl:attribute name="src"><xsl:value-of select="@icon"/></xsl:attribute>
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="style">display:none</xsl:attribute>
									</xsl:otherwise>
									</xsl:choose>
								</img>
							</td>
							<td style="white-space:nowrap;width:*">
								<a href="javascript:void(0)">
									<xsl:attribute name="onfocus">
										<xsl:call-template name="notify"/>
									</xsl:attribute>
									<xsl:attribute name="onblur">
										<xsl:call-template name="notify"/>
									</xsl:attribute>
									<xsl:if test="//ntb:tabstrip/@tabindex">
										<xsl:variable name="tindex" select="//ntb:tabstrip/@tabindex"/>
											<xsl:attribute name="tabindex">
												<xsl:value-of select="number($tindex) + position() - 1"/>
											</xsl:attribute>
									</xsl:if><xsl:call-template name="write-id"><xsl:with-param name="local-name">label</xsl:with-param></xsl:call-template> <xsl:value-of select="@label"/><xsl:apply-templates select="label|@label"/></a>
								</td>
							<td>
								<xsl:attribute name="style">
									
									<xsl:if test="not(@containertype='iframe')">
										display:none;
									</xsl:if>
								</xsl:attribute>
								<xsl:call-template name="write-id">
									<xsl:with-param name="local-name">activityindicator</xsl:with-param>
								</xsl:call-template> 
										<xsl:attribute name="class">
											ntb-tab-activityindicator
										</xsl:attribute>
								</td></tr>
					</table>
					
	
				</td>
				<td>
					<xsl:attribute name="class">
						ntb-tab
						ntb-tab-right
					</xsl:attribute>
					<div class="ntb-pulse">
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">rightpulse</xsl:with-param>
						</xsl:call-template>
					</div>
				</td>
			</tr>
		</table>
		</div>
		</div>
		</div>
	</td>
</xsl:template>

<xsl:template match="label|@label">
		<span type="tabspan">
			<xsl:call-template name="write-id"/>
			<xsl:apply-templates select="@* | node()"/>
		</span>
</xsl:template> 

<xsl:template name="body">
	<xsl:param name="tab-position"/>
	<xsl:variable name="dot" select="//ntb:tabs/ntb:tab[number($tab-position)]"/>
	
	<xsl:variable name="active-tab-index">
		<xsl:choose>
			<xsl:when test="$dot/../@activetabindex">
				<xsl:value-of select="$dot/../@activetabindex"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="0"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<div>
		<xsl:call-template name="write-id">
			<xsl:with-param name="id"><xsl:value-of select="$dot/@id"/></xsl:with-param>
			<xsl:with-param name="local-name">tabbody</xsl:with-param>
		</xsl:call-template> 
		<xsl:attribute name="style">
			overflow:auto;
			<xsl:choose>
				<xsl:when test="number($tab-position) -1 != $active-tab-index">
					width:0px;height:0px;position:relative;top:-1000px;left:-1000px;
				</xsl:when>
				<xsl:otherwise>
					width:100%;height:100%;
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="$dot/@hideoverflowenabled='true'">
				overflow:hidden;
			</xsl:if>
		</xsl:attribute>
		
		<xsl:attribute name="class">
			<xsl:choose>
				<xsl:when test="number($tab-position) -1 = $active-tab-index">
					ntb-tab-active
				</xsl:when>
				<xsl:otherwise>
					ntb-tab-inactive
				</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute> 
		<div style="height:100%;">
			<xsl:call-template name="write-id">
				<xsl:with-param name="id"><xsl:value-of select="$dot/@id"/></xsl:with-param>
				<xsl:with-param name="local-name">bodycontainer</xsl:with-param>
			</xsl:call-template>
			<xsl:choose>
			<xsl:when test="$dot/@source and $dot/@containertype='iframe'">
				<iframe class="ntb-tab-iframecontainer" frameborder="0">
					<xsl:attribute name="name">ntb-tab-<xsl:value-of select="//ntb:tabstrip/@id" />-<xsl:value-of select="$tab-position" /></xsl:attribute>
					<xsl:call-template name="write-id">
						<xsl:with-param name="id"><xsl:value-of select="$dot/@id"/></xsl:with-param>
						<xsl:with-param name="local-name">tabiframe</xsl:with-param>
					</xsl:call-template>
					<xsl:attribute name="onload">
						<xsl:call-template name="notify">
							<xsl:with-param name="id"><xsl:value-of select="$dot/@id"/></xsl:with-param>
						</xsl:call-template>
					</xsl:attribute>
					<xsl:attribute name="src">
					</xsl:attribute>&#160; 
				</iframe>
			</xsl:when>
			<xsl:otherwise>
				<div class="ntb-tab-bodycontainer">
					<xsl:call-template name="write-id">
						<xsl:with-param name="id"><xsl:value-of select="$dot/@id"/></xsl:with-param>
						<xsl:with-param name="local-name">tabnodeframe</xsl:with-param>
					</xsl:call-template>
					<xsl:apply-templates select="$dot/@* | $dot/node()"/>
				</div>
			</xsl:otherwise>
		</xsl:choose>
		</div>
	</div>	
</xsl:template>

<xsl:template match="body">
	<xsl:call-template name="body"/>
</xsl:template> 

<xsl:template match="node()|@*">
	<xsl:param name="this"/>
	<xsl:if test="name(.)!='id'">
		<xsl:copy>
			<xsl:apply-templates select="./* | text() | @*">
				<xsl:with-param name="this" select="$this"/>
			</xsl:apply-templates>
		</xsl:copy>
	</xsl:if>
</xsl:template> 

<xsl:template match="text()">
	<xsl:value-of select="."/>
</xsl:template>

</xsl:stylesheet>
