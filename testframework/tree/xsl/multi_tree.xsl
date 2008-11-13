<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!-- Writes out YAHOO javascript code that adds nodes to the tree. -->
	<!-- This assumes that the treeNodeOnClick is defined in the js. When a leaf is clicked
	 	 treeNodeOnClick is called when the id of the node. -->
 <xsl:output method="text"/>
 <xsl:param name="tree-name"/>
 <xsl:param name="tree-id"/>
 <xsl:template match="/">
 	<xsl:apply-templates select="//node"/>
 	onCompleteCallback();
 </xsl:template>

 <xsl:template match="node">
 	<xsl:choose>
		<xsl:when test="@isLeaf='true'">
       tmpNode = new YAHOO.widget.TaskNode('<xsl:value-of select="@label"/>', node, false);
    </xsl:when>
    <xsl:otherwise>
      tmpNode = new YAHOO.widget.TaskNode('<xsl:value-of select="@label"/>', node, false);
    </xsl:otherwise>
	</xsl:choose>
	tmpNode.multiExpand=true;
	tmpNode.data='<xsl:value-of select="@id"/>';

	<xsl:choose>
		<xsl:when test="@isLeaf='true'">
			tmpNode.href="javascript:YAHOO.widget.TreeView.getNode('<xsl:value-of select="$tree-name"/>',<xsl:value-of select="$tree-id"/>).qrOnClick('<xsl:value-of select="@id"/>')";
		</xsl:when>
		<xsl:otherwise>
			var _this = this;
			tmpNode.setDynamicLoad(function(node, onCompleteCallback){_this.onNodeRequest(node, onCompleteCallback)});
		</xsl:otherwise>
	</xsl:choose>

 </xsl:template>
</xsl:stylesheet>