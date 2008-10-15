<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:ntb="http://www.nitobi.com">
	<xsl:output method="xml" omit-xml-declaration="yes" />

	<xsl:strip-space elements="*"/>
	
	<xsl:param name="iequirks" select="'false'"></xsl:param>
	<xsl:param name="sidebar" select="/ntb:tree/@sidebarenabled"></xsl:param>
	<xsl:param name="cssclass" select="/ntb:tree/@cssclass"></xsl:param>
	<xsl:param name="theme" select="/ntb:tree/@theme"></xsl:param>	
	<xsl:param name="style" select="/ntb:tree/@cssstyle"></xsl:param>
	<xsl:param name="expanded" select="/ntb:tree/@expanded"></xsl:param>
	<xsl:param name="hierarchy" select="notanode"></xsl:param>
	<xsl:param name="locator"></xsl:param>
	<xsl:param name="apply-id" select="''"></xsl:param>
	<xsl:param name="apply-template" select="''"></xsl:param>
	
	<xsl:variable name="tabindex" >
		<xsl:variable name="temp" select="/ntb:tree/@tabindex" />
		<xsl:choose>
			<xsl:when test="$temp and $temp != ''">
				<xsl:value-of select="$temp" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="1000" />
			</xsl:otherwise>		
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="root-locator" select="concat('$(',&quot;'&quot;,/ntb:tree/@id,&quot;'&quot;,').jsObject')" />
	<xsl:variable name="expanded-default">
		<xsl:choose>
			<xsl:when test="$expanded and ($expanded = 'false')">
				<xsl:value-of select="'collapsed'" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="'expanded'" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="hierarchy-proper">
		<xsl:choose>
			<xsl:when test="$hierarchy">
				<xsl:for-each select="$hierarchy/*">
					<xsl:copy>
						<xsl:copy-of select="@*" />
						<xsl:call-template name="dummy" />
					</xsl:copy>
				</xsl:for-each>
				<xsl:call-template name="dummy" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="dummy" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:template match="/">
		
		<xsl:choose>
			<xsl:when test="$apply-id = ''">
				<xsl:apply-templates>
					<xsl:with-param name='locator'>
						<xsl:call-template name="parent-locator" />
					</xsl:with-param>
					<xsl:with-param name="hierarchy" select="$hierarchy-proper" />
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$apply-template = ''">
						<xsl:for-each select="//*[@id=$apply-id]">
							<xsl:apply-templates select=".">
								<xsl:with-param name='locator'>
									<xsl:call-template name="parent-locator" />
								</xsl:with-param>
								<xsl:with-param name="hierarchy" select="$hierarchy-proper" />
								<xsl:with-param name="expanded" select="$expanded-default" />
							</xsl:apply-templates>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<xsl:for-each select="//*[@id=$apply-id]">
							<xsl:choose>
								<xsl:when test="$apply-template = 'node-template'">
									<xsl:call-template name='node-template' >
										<xsl:with-param name='hierarchy' select="$hierarchy-proper" />
										<xsl:with-param name='locator'>
											<xsl:call-template name="parent-locator" />
										</xsl:with-param>
									</xsl:call-template>
								</xsl:when>
								<xsl:when test="$apply-template ='leaf-template'">
									<xsl:call-template name='leaf-template' >
										<xsl:with-param name='hierarchy' select="$hierarchy-proper" />
										<xsl:with-param name='locator'>
											<xsl:call-template name="parent-locator" />
										</xsl:with-param>
									</xsl:call-template>									
								</xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="inner-tree">
		<xsl:apply-templates select="ntb:children">
			<xsl:with-param name="locator">$('<xsl:value-of select="@id" />').jsObject</xsl:with-param>
			<xsl:with-param name="hierarchy">
				<xsl:call-template name="dummy" />
			</xsl:with-param>
			<xsl:with-param name="child-hierarchy" select="''" />
		</xsl:apply-templates>		
	</xsl:template>
	<xsl:template match="ntb:tree">
		<div>
			<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
			<xsl:attribute name="class">
				ntb-tree-reset
				<xsl:choose>
					<xsl:when test="$theme">
						<xsl:value-of select="$theme" />
					</xsl:when>
					<xsl:when test="$cssclass">
						<xsl:value-of select="$cssclass" />
					</xsl:when>
					<xsl:otherwise></xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
<!--			<xsl:if test="$iequirks = 'true'">
				<xsl:attribute name="style"><xsl:value-of select="$style" /></xsl:attribute>
			</xsl:if>
-->			<div>
				<xsl:call-template name="write-id">
					<xsl:with-param name="local-name">scroller</xsl:with-param>
				</xsl:call-template>
				<xsl:attribute name="style">
					<xsl:if test="$style">
						<xsl:choose>
							<xsl:when test="$iequirks='true'">
								<xsl:value-of select="$style" />
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="$style" />
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>
				</xsl:attribute>
				<xsl:attribute name="class">tree<xsl:if test="$sidebar = 'true'"> sidebar-background</xsl:if></xsl:attribute>
				<xsl:attribute name="tabindex"><xsl:value-of select="$tabindex" /></xsl:attribute>
				<xsl:attribute name="onkeydown">
					<xsl:call-template name="notify">
						<xsl:with-param name="bubble" select="'false'" />
					</xsl:call-template>
				</xsl:attribute>
				<div style="overflow:hidden;">
					<xsl:call-template name="write-id">
						<xsl:with-param name="local-name">scrollsize</xsl:with-param>
					</xsl:call-template>
					<div style="width:8000px;">
						<xsl:choose>
							<xsl:when test="$iequirks='true'">
								<table border="0" cellpadding="0" cellspacing="0">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">realsize</xsl:with-param>
									</xsl:call-template>
									<tr><td>
									<nowrap>
										<xsl:call-template name="inner-tree" />
									</nowrap>
									</td></tr>
								</table>
							</xsl:when>
							<xsl:otherwise>
								<div style="float:left;">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">realsize</xsl:with-param>
									</xsl:call-template>
									<xsl:call-template name="inner-tree" />
								</div>
								<div style="display:block;clear:both;float:none;height:0px;width:auto;overflow:hidden;"><xsl:call-template name="dummy" /></div>
							</xsl:otherwise>
						</xsl:choose>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>
	<xsl:template match="ntb:children">
		<xsl:param name="hierarchy" select="''" />
		<xsl:param name="locator"></xsl:param>
		<xsl:param name="child-hierarchy"><xsl:call-template name="hierarchy" /></xsl:param>
		<xsl:param name="expanded" select="'expanded'" />
		<div>
			<xsl:attribute name="class">children<xsl:if test="$expanded = 'collapsed'"> nitobi-hide</xsl:if></xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
			<div>
				<xsl:call-template name="write-id">
					<xsl:with-param name="local-name" select="'container'" />
				</xsl:call-template>
				<xsl:call-template name="dummy" /><!-- For the empty div problem -->
				<xsl:apply-templates select="ntb:node" >
					<xsl:with-param name="hierarchy"><xsl:copy-of select="$hierarchy" /><xsl:copy-of select="$child-hierarchy" /></xsl:with-param>
					<xsl:with-param name="locator" select="concat($locator,'.getChildren()')" />
				</xsl:apply-templates>
			</div>	
		</div>		
	</xsl:template>

	<xsl:template match="ntb:node">
		<xsl:param name="hierarchy" select="''" />
		<xsl:param name="locator" />
		<xsl:param name="expanded" />

		<div class="treenode">
			<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
			<xsl:choose>
				<xsl:when test="ntb:children or @nodetype='node'">
					<xsl:call-template name="node-template">
						<xsl:with-param name="hierarchy" select="$hierarchy" />
						<xsl:with-param name="expanded" select="$expanded" />
						<xsl:with-param name="locator" select="concat($locator,'.getById(',&quot;'&quot;,@id,&quot;'&quot;,')')" />
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="leaf-template">
						<xsl:with-param name="hierarchy" select="$hierarchy" />
						<xsl:with-param name="expanded" select="$expanded" />
						<xsl:with-param name="locator" select="concat($locator,'.getById(',&quot;'&quot;,@id,&quot;'&quot;,')')" />
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</div>
	</xsl:template>
	
	<xsl:template name="node-template">
		<xsl:param name="hierarchy" select="''" />
		<xsl:param name="locator" />
		<div>
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">css</xsl:with-param>
			</xsl:call-template>				
			<xsl:attribute name="class">
				<xsl:if test="@rootenabled = 'true'">root </xsl:if>
				<xsl:if test="@cssclass"><xsl:value-of select="@cssclass" /></xsl:if>
			</xsl:attribute>			
			<xsl:attribute name="style">
				<xsl:if test="@cssstyle"><xsl:value-of select="@cssstyle" /></xsl:if>
			</xsl:attribute>						
			<div>
				<xsl:call-template name="write-id">
					<xsl:with-param name="local-name">expander</xsl:with-param>
				</xsl:call-template>
				<xsl:attribute name="class">
					<xsl:if test="$locator and (ntb:children/ntb:node or @haschildren = 'true')">
						<xsl:call-template name="expanded-proper" />
					</xsl:if>
				</xsl:attribute>
				<div>
					<xsl:call-template name="write-id">
						<xsl:with-param name="local-name">selector</xsl:with-param>
					</xsl:call-template>
					<xsl:if test="number(@tabindex) > -1">
						<xsl:attribute name="tabindex"><xsl:value-of select="@tabindex" /></xsl:attribute> 
					</xsl:if>
					<xsl:attribute name="class">
						<xsl:if test="@selected and @selected='true'">selected</xsl:if>
					</xsl:attribute>
					<div class="node">
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">node</xsl:with-param>
						</xsl:call-template>
						<xsl:attribute name="onmousedown">
							<xsl:call-template name="notify" >
								<xsl:with-param name="local-name" select="'chooser'" />
							</xsl:call-template>
						</xsl:attribute>
						<xsl:attribute name="onmouseover">
							<xsl:call-template name="notify" />
						</xsl:attribute>
						<xsl:attribute name="onmouseout">
							<xsl:call-template name="notify" />
						</xsl:attribute>
						<div>
							<xsl:if test="$sidebar = 'true'">
								<div class="sidebar">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">sidebar</xsl:with-param>
									</xsl:call-template>
									<div>
										<xsl:call-template name="write-id">
											<xsl:with-param name="local-name">flag</xsl:with-param>
										</xsl:call-template>
										<xsl:attribute name="class">flag <xsl:value-of select="@flag" /></xsl:attribute>
										<xsl:call-template name="dummy" />
									</div>	
								</div>
							</xsl:if>
							<div>
								<xsl:call-template name="write-id">
									<xsl:with-param name="local-name">hierarchy</xsl:with-param>
								</xsl:call-template>
								<xsl:copy-of select="$hierarchy" />
							</div>
							<xsl:if test="not(@rootenabled) or @rootenabled != 'true'">
								<xsl:call-template name="junction">
									<xsl:with-param name="locator" select="$locator" />
								</xsl:call-template>
							</xsl:if>
							<div>
								<xsl:call-template name="write-id">
									<xsl:with-param name="local-name">chooser</xsl:with-param>
								</xsl:call-template>
								<xsl:attribute name="class">
									<xsl:value-of select="'chooser'" />
								</xsl:attribute>
								<div class="icon">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">icon</xsl:with-param>
									</xsl:call-template>
									<xsl:if test="@icon and @icon != ''"><xsl:attribute name="style">background-image:url(<xsl:value-of select="@icon" />);</xsl:attribute></xsl:if>
									<xsl:call-template name="dummy" />
								</div>
								<div>
									<span class="label">
										<xsl:call-template name="write-id">
											<xsl:with-param name="local-name">label</xsl:with-param>
										</xsl:call-template>
										<xsl:value-of select="@label"/>
									</span>
								</div>
							</div>&#160;
							<div style="display:block;clear:both;float:none;height:0px;width:auto;overflow:hidden;"><xsl:call-template name="dummy" /></div>
						</div>
					</div>
				</div>
			</div>
		</div>		
		<xsl:choose>
			<xsl:when test="@rootenabled='true'">
				<xsl:apply-templates select="ntb:children" >
					<xsl:with-param name="hierarchy" select="$hierarchy" />
					<xsl:with-param name="locator" select="$locator" />
					<xsl:with-param name="child-hierarchy" select="''" />
					<xsl:with-param name="expanded"><xsl:call-template name="expanded-proper" /></xsl:with-param>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="ntb:children" >
					<xsl:with-param name="hierarchy" select="$hierarchy" />
					<xsl:with-param name="locator" select="$locator" />
					<xsl:with-param name="expanded"><xsl:call-template name="expanded-proper" /></xsl:with-param>
				</xsl:apply-templates>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="leaf-template">
		<xsl:param name="hierarchy" select="''" />
		<xsl:param name="locator" />
		<div>
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">css</xsl:with-param>
			</xsl:call-template>				
			<xsl:attribute name="class">
				<xsl:if test="@rootenabled = 'true'">root </xsl:if>
				<xsl:if test="@cssclass"><xsl:value-of select="@cssclass" /></xsl:if>
			</xsl:attribute>			
			<xsl:attribute name="style">
				<xsl:if test="@cssstyle"><xsl:value-of select="@cssstyle" /></xsl:if>
			</xsl:attribute>						
			<div>
				<xsl:call-template name="write-id">
					<xsl:with-param name="local-name">expander</xsl:with-param>
				</xsl:call-template>
				<div>
					<xsl:call-template name="write-id">
						<xsl:with-param name="local-name">selector</xsl:with-param>
					</xsl:call-template>
					<xsl:if test="number(@tabindex) > -1">
						<xsl:attribute name="tabindex"><xsl:value-of select="@tabindex" /></xsl:attribute> 
					</xsl:if>
					<xsl:attribute name="class">
						<xsl:if test="@selected and @selected='true'">selected</xsl:if>
					</xsl:attribute>
					<div class="leaf">
						<xsl:call-template name="write-id">
							<xsl:with-param name="local-name">node</xsl:with-param>
						</xsl:call-template>
						<xsl:attribute name="onmousedown">
							<xsl:call-template name="notify">
								<xsl:with-param name="local-name" select="'chooser'" />
							</xsl:call-template>
						</xsl:attribute>
						<xsl:attribute name="onmouseover">
							<xsl:call-template name="notify" />
						</xsl:attribute>
						<xsl:attribute name="onmouseout">
							<xsl:call-template name="notify" />
						</xsl:attribute>
						<div>
							<xsl:if test="$sidebar = 'true'">
								<div class="sidebar">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">sidebar</xsl:with-param>
									</xsl:call-template>
									<div>
										<xsl:call-template name="write-id">
											<xsl:with-param name="local-name">flag</xsl:with-param>
										</xsl:call-template>
										<xsl:attribute name="class">flag <xsl:value-of select="@flag" /></xsl:attribute>
										<xsl:call-template name="dummy" />
									</div>	
								</div>
							</xsl:if>
							<div>
								<xsl:call-template name="write-id">
									<xsl:with-param name="local-name">hierarchy</xsl:with-param>
								</xsl:call-template>
								<xsl:copy-of select="$hierarchy" />
							</div>
							<xsl:if test="not(@rootenabled) or @rootenabled != 'true'">
								<xsl:call-template name="junction" />	
							</xsl:if>
							<div>
								<xsl:call-template name="write-id">
									<xsl:with-param name="local-name">chooser</xsl:with-param>
								</xsl:call-template>
								<xsl:attribute name="class">
									<xsl:value-of select="'chooser'" />
								</xsl:attribute>
								<div class="icon">
									<xsl:call-template name="write-id">
										<xsl:with-param name="local-name">icon</xsl:with-param>
									</xsl:call-template>
									<xsl:if test="@icon and @icon != ''"><xsl:attribute name="style">background-image:url(<xsl:value-of select="@icon" />);</xsl:attribute></xsl:if>
									<xsl:call-template name="dummy" />
								</div>
								<div>
									<span class="label">
										<xsl:call-template name="write-id">
											<xsl:with-param name="local-name">label</xsl:with-param>
										</xsl:call-template>
										<xsl:value-of select="@label"/>
									</span>
								</div>
							</div>&#160;
							<div style="display:block;clear:both;float:none;height:0px;width:auto;overflow:hidden;"><xsl:call-template name="dummy" /></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<xsl:apply-templates select="ntb:children" >
			<xsl:with-param name="hierarchy" select="$hierarchy" />
			<xsl:with-param name="locator" select="$locator" />
			<xsl:with-param name="expanded"><xsl:call-template name="expanded-proper" /></xsl:with-param>
		</xsl:apply-templates>		
	</xsl:template>
	
	<xsl:template name="hierarchy">
		<xsl:choose>
			<xsl:when test="../following-sibling::node()">
				<div class="pipe"><xsl:call-template name="dummy" /></div>
			</xsl:when>
			<xsl:otherwise>
				<div class="spacer"><xsl:call-template name="dummy" /></div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="junction">
		<xsl:param name="locator" />
		<div>
			<xsl:call-template name="write-id">
				<xsl:with-param name="local-name">junction</xsl:with-param>
			</xsl:call-template> 
				
			<xsl:attribute name="class">
				<xsl:choose>
					<xsl:when test="parent::node() and ../child::node() and following-sibling::node()">tee</xsl:when>
					<xsl:otherwise>ell</xsl:otherwise>
				</xsl:choose>			
			</xsl:attribute>				
			
			<xsl:if test="$locator and (ntb:children/ntb:node or @haschildren != 'false')">
				<xsl:attribute name="onmousedown">
					<xsl:call-template name="notify">
						<xsl:with-param name="local-name">junction</xsl:with-param>
					</xsl:call-template>
				</xsl:attribute>
			</xsl:if>
			<xsl:call-template name="dummy" />
		</div>
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
		<xsl:param name="bubble" select="'null'" />
		<xsl:param name="local-name"/>
		<xsl:variable name="_id">
			<xsl:choose>
				<xsl:when test="$local-name">
					<xsl:value-of select="concat(@id,'.',$local-name)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@id"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		var tree = $('<xsl:value-of select="//ntb:tree/@id"/>');
		if (tree == null)
		{
		nitobi.lang.throwError("The tree event could not find the component object.  The element with the specified id could not be found on the page.");
		}
		tree = tree.jsObject;
		tree.notify(event,'<xsl:value-of select="$_id"/>',null,<xsl:value-of select="$bubble" />);
	</xsl:template>
	<xsl:template match="ntb:tree" mode="locator">
		<xsl:value-of select="concat('$(',&quot;'&quot;,@id,&quot;'&quot;,').jsObject')" />
	</xsl:template>
	<xsl:template match="ntb:children" mode="locator">
		<xsl:apply-templates select="parent::node()" mode="locator" />
		<xsl:value-of select="'.getChildren()'" />		
	</xsl:template>
	<xsl:template match="ntb:node" mode="locator">
		<xsl:apply-templates select="parent::node()" mode="locator" />
		<xsl:value-of select="concat('.getById(',&quot;'&quot;,@id,&quot;'&quot;,')')" />
	</xsl:template>
	<xsl:template name="parent-locator">
		<xsl:apply-templates select="parent::node()" mode="locator" />
	</xsl:template>
	<xsl:template name="dummy">
		<xsl:comment>dummy</xsl:comment>
	</xsl:template>
	<xsl:template name="expanded-proper">
		<xsl:choose>
			<xsl:when test="(@expanded and (@expanded = 'false')) or (not(ntb:children) and @haschildren='true')">
				<xsl:value-of select="'collapsed'" />
			</xsl:when>			
			<xsl:when test="@expanded and (@expanded = 'true')">
				<xsl:value-of select="'expanded'" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$expanded-default" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>