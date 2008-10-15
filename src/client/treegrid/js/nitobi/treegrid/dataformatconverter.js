/**
 * @class This class is responsible for converting data formats used in nitobi.data.FormatConverterr
 */
nitobi.data.FormatConverter = {};

/**
 * Builds a well formed UTF-8 eba XML document based on the input parameters.  Extra column data will be truncated.
 * @param {String} htmlTable - A set of data that is formated in TABLE, TR, TD HTML elements.
 * @param {Array} columns - a set of contigious columns that describe the table data
 * @startRow {int} the first zero-based row to add to the table results.  
 * @return {xmlDoc}correctly formated well formed eba xml based on paramters.  Extra column data will be truncated.   
 *
 * For now merged table data are out of scope. The eba xml created will only have attributes for columns that are in column param and has a column in the table.  The eba xml created will not have an datasourcestructure tag
 */
nitobi.data.FormatConverter.convertHtmlTableToEbaXml = function(htmlTable, columns, startRow)
{
	var s='<xsl:stylesheet version="1.0" xmlns:ntb="http://www.nitobi.com" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output encoding="UTF-8" method="xml" omit-xml-declaration="no" />';
	s+='<xsl:template match="//TABLE"><ntb:data id="_default">';
    s+='<xsl:apply-templates /></ntb:data> </xsl:template>';
   	s+='<xsl:template match = "//TR">  <xsl:element name="ntb:e"> <xsl:attribute name="xi"><xsl:value-of select="position()-1+' + parseInt(startRow) + '"/></xsl:attribute>';	
	for (var index=0; index < columns.length; index++) 
	{
		s+='<xsl:attribute name="'+ columns[index] + '\" ><xsl:value-of select="TD['+parseInt(index+1)+']"/></xsl:attribute>';
	}
	s+='</xsl:element></xsl:template>';
	s+='</xsl:stylesheet>';

	var tableDataXmlDoc = nitobi.xml.createXmlDoc(htmlTable);
	var xsltProcessor 	= nitobi.xml.createXslProcessor(s);
	var result = nitobi.xml.transformToXml(tableDataXmlDoc, xsltProcessor);
	return result;
}

/**
 * Builds a valid well formed UTF-8 XML document based on the input parameters.  Extra column data will be truncated.
 * @note For now lookup fields are out of scope
 * @param tsv {String}- tab seperated list of data to be converted to EBA xml
 * @param columns {Array} - a set of contigious columns that describe the table data
 * @startRow {int} the first zero-based row to add to the table results.  
 * @return {xmlDoc}correctly formated well formed eba xml based on paramters.  Extra column data will be truncated.   
 */
nitobi.data.FormatConverter.convertTsvToEbaXml = function(tsv, columns, startRow)
{
	if (!nitobi.browser.IE && tsv[tsv.length-1]!="\n") {
		tsv =tsv+'\n';
	}
	var htmlTableFormattedData = "<TABLE><TBODY>"
	+tsv.replace(/[\&\r]/g,"")
   .replace(/([^\t\n]*)[\t]/g,"<TD>$1</TD>")
   .replace(/([^\n]*?)\n/g,"<TR>$1</TR>")
   .replace(/\>([^\<]*)\<\/TR/g,"><TD>$1</TD></TR")+"</TBODY></TABLE>";

	// This will handle single-cell paste.
	if (htmlTableFormattedData.indexOf("<TBODY><TR>") == -1)
	{
		htmlTableFormattedData = htmlTableFormattedData.replace(/TBODY\>(.*)\<\/TBODY/,"TBODY><TR><TD>$1</TD></TR></TBODY");
	}

	return nitobi.data.FormatConverter.convertHtmlTableToEbaXml(htmlTableFormattedData, columns, startRow);
}


/**
 * Builds 2*2 JavaScript array from the tab separated data. Extra column data will be truncated.
 * @param tsv {String}- tab seperated list of data to be converted to EBA xml
 * @param columns {Array} - a set of contigious columns that describe the table data
 * @startRow {int} the first zero-based row to add to the table results.  
 * @return {xmlDoc}correctly formated well formed eba xml based on paramters.  Extra column data will be truncated.   
 */
nitobi.data.FormatConverter.convertTsvToJs = function(tsv)
{
	var jsFormattedData = "["
	+tsv.replace(/[\&\r]/g,"")
	.replace(/([^\t\n]*)[\t]/g,"$1\",\"")
	.replace(/([^\n]*?)\n/g,"[\"$1\"],") + "]";

	return jsFormattedData;
}


/**
 * Builds a data set that is formatted using HTML Elements TABLE, TR, TD based on the parameters. 
 * A best effort will be made to add the correct data.  
 * For now lookup fields are out of scope
 *
 * @param ebaXmlDocument {xmlDoc} the set of data from the grid (do we need a grid id?)
 * @param columns {Array} a array of columns to be added to the table
 * @param startRow {int}  the first zero-based row to be added to the table results.  
 * @param endRow {int}    the last zero-based row to be added to the table results.  
 * @return {String} well formed HTML table with UTF-8 encocding
 */
nitobi.data.FormatConverter.convertEbaXmlToHtmlTable = function(ebaXmlDocument, columns, startRow, endRow)
{
	var s='<xsl:stylesheet version="1.0" xmlns:ntb="http://www.nitobi.com" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output encoding="UTF-8" method="html" omit-xml-declaration="yes" /><xsl:template match = "*"><xsl:apply-templates /></xsl:template><xsl:template match = "/">';
	s+='<TABLE><TBODY><xsl:for-each select="//ntb:e[@xi>' + parseInt(startRow - 1) + ' and @xi &lt; ' + parseInt(endRow + 1) + ']" ><TR>';
	for (var index=0; index < columns.length; index++) 
	{
		s+='<TD><xsl:value-of select=\"@' + columns[index] + '\" /></TD>';
	}
	s+='</TR></xsl:for-each></TBODY></TABLE></xsl:template></xsl:stylesheet>'

	var xsltProcessor = nitobi.xml.createXslProcessor(s);
    return nitobi.xml.transformToXml(ebaXmlDocument, xsltProcessor).xml.replace(/xmlns:ntb="http:\/\/www.nitobi.com"/,"");
}

nitobi.data.FormatConverter.convertEbaXmlToTsv = function(ebaXmlDocument, columns, startRow, endRow)
{
	var s='<xsl:stylesheet version="1.0" xmlns:ntb="http://www.nitobi.com" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output encoding="UTF-8" method="text" omit-xml-declaration="yes" /><xsl:template match = "*"><xsl:apply-templates /></xsl:template><xsl:template match = "/">';
	s+='<xsl:for-each select="//ntb:e[@xi>' + parseInt(startRow - 1) + ' and @xi &lt; ' + parseInt(endRow + 1) + ']" >\n';
	for (var index=0; index < columns.length; index++) 
	{
		s+='<xsl:value-of select=\"@' + columns[index] + '\" />';
		if (index < columns.length-1)
		{
			s+='<xsl:text>&#x09;</xsl:text>';
		}
	}
	s+='<xsl:text>&#xa;</xsl:text></xsl:for-each></xsl:template></xsl:stylesheet>'

	var xsltProcessor = nitobi.xml.createXslProcessor(s);
    return nitobi.xml.transformToString(ebaXmlDocument, xsltProcessor).replace(/xmlns:ntb="http:\/\/www.nitobi.com"/,"");
}

/*
 * Returns the number of columns in some TSV or TABLE based data.
 */
nitobi.data.FormatConverter.getDataColumns = function(data)
{
	var retVal = 0;
	if (data != null && data != '')
	{
		if (data.substr(0,1) == '<')
		{
			retVal = data.toLowerCase().substr(0, data.toLowerCase().indexOf('</tr>')).split('</td>').length-1;
		}
		else
		{
			retVal = data.substr(0, data.indexOf('\n')).split('\t').length;
		}
	}
	else
	{
		retVal = 0;
	}
	return retVal;
}

/*
 * Returns the number of rows in some TSV or TABLE based data.
 */
nitobi.data.FormatConverter.getDataRows = function(data)
{
	var retVal = 0;
	if (data != null && data != '')
	{
		if (data.substr(0,1) == '<')
		{
			retVal = data.toLowerCase().split('</tr>').length-1;
		}
		else
		{
			retValArray = data.split('\n');
			retVal = retValArray.length;
			if (retValArray[retValArray.length-1] == "")
			{
				retVal--;
			}
		}
	}
	else
	{
		retVal = 0;
	}
	return retVal;
}
