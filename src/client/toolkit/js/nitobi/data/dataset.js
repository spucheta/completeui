/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.data');

if (false)
{
	/**
	 * @namspace The namespace that contains classes to manage sets of data.
	 * @constructor
	 */
	nitobi.data = function(){};
}

nitobi.data.DATAMODE_UNBOUND="unbound";
nitobi.data.DATAMODE_LOCAL="local";
nitobi.data.DATAMODE_REMOTE="remote";
nitobi.data.DATAMODE_CACHING="caching";
nitobi.data.DATAMODE_STATIC="static";
nitobi.data.DATAMODE_PAGING="paging";

nitobi.data.DataSet=function()
{
	var ebans="http://www.nitobi.com"; // This string shouldn't be hard-coded
	this.doc = nitobi.xml.createXmlDoc('<'+nitobi.xml.nsPrefix+'datasources xmlns:ntb="'+ebans+'"></'+nitobi.xml.nsPrefix+'datasources>');
}
nitobi.data.DataSet.prototype.initialize= function()
	{
		this.tables = new Array();
	}
nitobi.data.DataSet.prototype.add= function(tableDataSource)
	{
		ntbAssert(!this.tables[tableDataSource.id], "This table data source has already been added.", '', EBA_THROW);
		this.tables[tableDataSource.id] = tableDataSource;
	}
nitobi.data.DataSet.prototype.getTable= function(tableId)
	{
		return this.tables[tableId];
	}
nitobi.data.DataSet.prototype.xmlDoc= function()
	{
		var root = this.doc.documentElement;
		while (root.hasChildNodes())
			root.removeChild(root.firstChild);
		for (var i in this.tables)
		{
			if (this.tables[i].xmlDoc && this.tables[i].xmlDoc.documentElement)
			{
				var cloned = this.tables[i].xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource').cloneNode(true);
				this.doc.selectSingleNode('/'+nitobi.xml.nsPrefix+'datasources').appendChild(nitobi.xml.importNode(this.doc, cloned, true));
			}
		}
		return this.doc;
	}
nitobi.data.DataSet.prototype.dispose= function()
	{
		for (var table in this.tables)
		{
			this.tables[table].dispose();
		}
	}