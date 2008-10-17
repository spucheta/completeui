<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
	<xsl:output method="text" omit-xml-declaration="yes"/>
	<xsl:param name="basedir" select="'.'" />
	<xsl:param name="rand"/>

<xsl:template match="//includes">
		&lt;script&gt;
		
			if (typeof(nitobi) == "undefined")
			{
				nitobi = {};
			}
			
			if (typeof(nitobi.testframework) == "undefined")
			{
				nitobi.testframework = {};
			}
			
			
		&lt;/script&gt;
	<xsl:apply-templates/> 
</xsl:template> 

<xsl:template match="jsfile">
	&lt;script	type="text/javascript"  src="<xsl:value-of select="concat($basedir,'/',@path,'?cachebuster=',generate-id(@path),$rand)"/>" &gt;&lt;/script&gt;
</xsl:template>

<xsl:template match="cssfile">
	&lt;link rel="stylesheet" type="text/css"  href="<xsl:value-of select="concat($basedir,'/',@path,'?cachebuster=',generate-id(@path),$rand)"/>" &gt;&lt;/link&gt;
</xsl:template>

<xsl:template match="xslfile">
	&lt;script&gt;

	nitobi.testframework.defineNs('nitobi.temp');
	nitobi.testframework.defineNs('<xsl:value-of select="@namespace"/>');
	<xsl:value-of select="concat(@namespace,'.',@name)"/> = nitobi.testframework.createXslDoc();
	<xsl:value-of select="concat(@namespace,'.',@name)"/>.async=false;
	<xsl:value-of select="concat(@namespace,'.',@name)"/>.load('<xsl:value-of select="concat($basedir,'/',@path,'?cachebuster=',generate-id(@path),$rand)"/>');

	nitobi.temp.xsl1 = <xsl:value-of select="concat(@namespace,'.',@name)"/>.xml;

	// Do a replace on <!--nitobi.grid.xslProcessorName--> and merge the contents
	// The second block does this for escaped XSL
	var re = new RegExp('\&lt;\!--(.*?)--\&gt;', 'gi');
	var exprMatches = nitobi.temp.xsl1.match(re);

	nitobi.temp.xsl2 = "";
	if (exprMatches != null)
	{
		for (var i=0; i&lt;exprMatches.length; i++)
		{
			var incl = exprMatches[i].replace("&lt;!--","").replace("--&gt;","");
			// Get the imported stylesheet and remove the outer stylesheet element
			try {
				nitobi.temp.xsl2 = eval(incl).stylesheet.xml;
			} catch(e) {
				continue;
			}
			nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;xsl:stylesheet.*?\&gt;/g,'');
			nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;\/xsl:stylesheet\&gt;/g,'');

			nitobi.temp.xsl1 = nitobi.temp.xsl1.replace('&lt;!--'+incl+'--&gt;', nitobi.temp.xsl2);
		}
	}

	var re = new RegExp('\&amp;lt;\!--(.*?)--\&amp;gt;', 'gi');
	var exprMatches = nitobi.temp.xsl1.match(re);
	
	if (exprMatches != null)
	{
		for (var i=0; i&lt;exprMatches.length; i++)
		{
			var incl = exprMatches[i].replace("&amp;lt;!--","").replace("--&amp;gt;","");

			// Get the imported stylesheet and remove the outer stylesheet element
			try {
				nitobi.temp.xsl2 = eval(incl).stylesheet.xml;
			} catch(e) {
				continue;
			}

			nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;xsl:stylesheet.*?\&gt;/g,'');
			nitobi.temp.xsl2 = nitobi.temp.xsl2.replace(/\&lt;\/xsl:stylesheet\&gt;/g,'');
			nitobi.temp.xsl2 = nitobi.testframework.escapeXslt(nitobi.temp.xsl2);
			nitobi.temp.xsl1 = nitobi.temp.xsl1.replace('&amp;lt;!--'+incl+'--&amp;gt;', nitobi.temp.xsl2);
		}
	}

	<xsl:value-of select="concat(@namespace,'.',@name)"/> = nitobi.testframework.createXslProcessor(nitobi.temp.xsl1.replace(/\n/g,''));
	&lt;/script&gt;
</xsl:template>

<xsl:template match="xmlfile">
	&lt;script&gt;
	
	nitobi.testframework.defineNs('<xsl:value-of select="@namespace"/>');
	<xsl:value-of select="concat(@namespace,'.',@name)"/> = nitobi.testframework.createXmlDoc();
	<xsl:value-of select="concat(@namespace,'.',@name)"/>.async=false;
	<xsl:value-of select="concat(@namespace,'.',@name)"/>.load('<xsl:value-of select="concat($basedir,'/',@path,'?cachebuster=',generate-id(@path),$rand)"/>');
	nitobi.testframework.loadXml(<xsl:value-of select="concat(@namespace,'.',@name)"/>, <xsl:value-of select="concat(@namespace,'.',@name)"/>.xml.replace(/\n/g,''));
	&lt;/script&gt;
</xsl:template>

</xsl:stylesheet>