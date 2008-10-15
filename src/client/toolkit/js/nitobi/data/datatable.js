/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs('nitobi.data');

/**
 * The DataTable represents a client side XML based datasource.
 * @param {Boolean} estimateRowCount If true, the datatable will actively try and find the last row of data.
 * @param {AssociativeArray} saveHandlerArgs Extra arguments that are attached to the saveHandler.
 * @param {AssociativeArray} getHandlerArgs Extra arguments that are attached to the getHandler.
 * @param {Boolean} autoKeyEnabled True if the datatable expects to parse the response and adjust keys 
 * assigned by the db server.
 */
nitobi.data.DataTable = function(mode, estimateRowCount, saveHandlerArgs, getHandlerArgs, autoKeyEnabled)
{
	if (estimateRowCount == null)
	{
		ntbAssert(false,"Table needs estimateRowCount param");
	}
	this.estimateRowCount = estimateRowCount;
	this.version = 3.0;
	this.uid = nitobi.base.getUid();
	/**
	 * 
	 */
	this.mode = mode || "caching"; // Options: unbound | static | paging | caching
	
	this.setAutoKeyEnabled(autoKeyEnabled);

	this.columns = new Array();
	this.keys = new Array();
	this.types = new Array();
	this.defaults = new Array();

	this.columnsConfigured = false;
	this.pagingConfigured = false;
	
	this.id = '_default';
	this.fieldMap = {};
	if (saveHandlerArgs)
	{
		this.saveHandlerArgs = saveHandlerArgs;
	}
	else
	{
		this.saveHandlerArgs = {};
	}
	if (getHandlerArgs)
	{
		this.getHandlerArgs = getHandlerArgs;
	}
	else
	{
		this.getHandlerArgs = {};
	}
	
	this.setGetHandlerParameter("RequestType","GET");
	this.setSaveHandlerParameter("RequestType","SAVE");

	// We can do a batch insert by calling the beginBatchInsert() method. To finish the insert
	// the commitBatchInsert() method is called.
	this.batchInsert = false;
	this.batchInsertRowCount = 0;
}

nitobi.data.DataTable.DEFAULT_LOG = '<'+nitobi.xml.nsPrefix+'grid '+nitobi.xml.nsDecl+'><'+nitobi.xml.nsPrefix+'datasources id=\'id\'><'+nitobi.xml.nsPrefix+'datasource id="{id}"><'+nitobi.xml.nsPrefix+'datasourcestructure /><'+nitobi.xml.nsPrefix+'data id="_default"></'+nitobi.xml.nsPrefix+'data></'+nitobi.xml.nsPrefix+'datasource></'+nitobi.xml.nsPrefix+'datasources></'+nitobi.xml.nsPrefix+'grid>';

nitobi.data.DataTable.DEFAULT_DATA = '<'+nitobi.xml.nsPrefix+'datasource '+nitobi.xml.nsDecl+' id="{id}"><'+nitobi.xml.nsPrefix+'datasourcestructure FieldNames="{fields}" Keys="{keys}" types="{types}" defaults="{defaults}"></'+nitobi.xml.nsPrefix+'datasourcestructure><'+nitobi.xml.nsPrefix+'data id="{id}"></'+nitobi.xml.nsPrefix+'data></'+nitobi.xml.nsPrefix+'datasource>';

//
// CORE METHODS
//

/**
 * This method initializes the DataTable and gets it ready for use.
 * @param {string} tableId
 * @param {object} getHandler The getHandler argument can be either a String 
 * that is the URL of a server based datasource or an XML DOM Document.
 * @param {string} postHandler The postHandler argument is the URL of a server
 * resource that can be used to save changes to data in the client side DataTable
 * on the server.
 * @param {int} start The index of the first record in the DataTable.
 * @param {int} pageSize The pageSize argument specifies the default number of records
 * to return from any given request for data using the get method.
 * @param {string} sort The sort argument specifies the default field to sort by.
 * @param {string} sortDir The sortDir argument specifies the default direction of 
 * the data sorting.
 * @param {Function} onGenerateKey The onGenerateKey arguments is a reference
 * @param {string} filter The filter criteria for the data
 * to a function that is used to create record keys when new records are created in the DataTable.
 */
nitobi.data.DataTable.prototype.initialize = function(tableId, getHandler, postHandler, start, pageSize, sort, sortDir, onGenerateKey, filter) 
    {
//	When sort is called on this thing we need to clear the cachemap and start getting data a new
//	To return data from this what do we need to do???
//	For the grid we just return the data based on xi values which are the record numbers ...
//	We also need to consider the case where we dont page and just return it all!!!
//	that is the case for the lookup data sources
//	We need to grab the lookup data sources and merge those into the XSLT for displaying the data
		this.setGetHandlerParameter("TableId",tableId);
		this.setSaveHandlerParameter("TableId",tableId);
		this.id = tableId;

		this.datastructure = null;
		this.descriptor = new nitobi.data.DataTableDescriptor(this, nitobi.lang.close(this, this.syncRowCount),this.estimateRowCount);
		
		// Mode = unbound
		// Mode = static
		// Mode = paging
		this.pageFirstRow = 0; // Note: applies only to mode=paging
		this.pageRowCount = 0; // Note: applies only to mode=paging
		this.pageSize = pageSize;
		this.minPageSize = 10;

		// Mode = caching
		this.requestCache = new nitobi.collections.CacheMap(-1,-1);

		// Mode = paging or caching
		this.dataCache = new nitobi.collections.CacheMap(-1,-1); //Note: applies only to mode=caching

		this.flush();

		this.sortColumn = sort;
		this.sortDir = sortDir || 'Asc';

		this.filter = new Array();
		
		this.onGenerateKey = onGenerateKey;

		this.remoteRowCount = 0; //Note: applies to paging and caching modes
		this.setRowCountKnown(false); //Note: if row count is not known then external pageNext should increment startRow until less than pageSize rows are returned


		//	Check if start and or pageSize are null ...
		if (start == null)
			start = 0;

		if (this.mode != "unbound") {
			ntbAssert(getHandler!=null&&typeof(getHandler)!="undefined","getHandler is not specified for the nitobi.data.DataTable",'',EBA_THROW);
	
			if (getHandler != null)
			{
				this.ajaxCallbackPool = new nitobi.ajax.HttpRequestPool(nitobi.ajax.HttpRequestPool_MAXCONNECTIONS);
				this.ajaxCallbackPool.context = this;
				this.setGetHandler(getHandler);
				this.setSaveHandler(postHandler);
			}
			this.ajaxCallback = new nitobi.ajax.HttpRequest();
			this.ajaxCallback.responseType = "xml";
		} else {
			if (getHandler != null && typeof(getHandler) != "string")
			{
				// TODO: this is deprecated - call initializeColumns from outside and pass in the data ... 
				this.initializeXml(getHandler);
//				this.xmlDoc = getHandler;
//				ntbAssert(typeof(this.xmlDoc.xml)!="undefined","Valid XML required for new tabledatasource.",'',EBA_THROW);
				//	parse out the various things like the fields etc ...
//				this.datastructure = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\'' + this.id + '\']/'+nitobi.xml.nsPrefix+'datasourcestructure');
//				this.makeFieldMap();
			}
		}

		// TODO: Figure out how to remove paramters from XSLT's in IE then we can get rid of this...
		this.sortXslProc = nitobi.xml.createXslProcessor(nitobi.data.sortXslProc.stylesheet);

		this.requestQueue = new Array();
		
		/**
		 * Specifies if the requests to the server are synchronous or asynchronous by default.
		 */
		this.async = true;
}

/**
 * Set the onGenerateKey event handler.
 * @param {String} Javascript code that is evaluated to retrieve the new key.
 */
nitobi.data.DataTable.prototype.setOnGenerateKey = function(onGenerateKey)
{
	this.onGenerateKey = onGenerateKey;
}

/**
 * Returns the onGenerateKey event handler.
 * @return String Javascript code that is evaluated to retrieve the new key.
 */
nitobi.data.DataTable.prototype.getOnGenerateKey = function()
{
	return this.onGenerateKey;
}


/**
 * @private
 */
nitobi.data.DataTable.prototype.setAutoKeyEnabled = function(val)
{
	this.autoKeyEnabled = val;
}

/**
 * @private
 */
nitobi.data.DataTable.prototype.isAutoKeyEnabled = function()
{
	return this.autoKeyEnabled;
}


/**
 * Initializes a DataTable based on the fields, keys, defaults and types arrays.
 * @param {object} xml XML data from which the DataTable can be initialized.
 */
nitobi.data.DataTable.prototype.initializeXml = function(oXml)
{
	this.replaceData(oXml);

	// in the case that the xml also has actual data in it (not just schema)
	// then we need to setup the data
	var rows = this.xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'e').length;
	if (rows>0)
	{
		// TODO: Fix this to string then loading the xml crap
		var s = this.xmlDoc.xml;
//		if (this.mode != "paging")
//		{
			s = nitobi.xml.transformToString(this.xmlDoc, this.sortXslProc, "xml");
//		}
console.log(this.uid + ' initializeXml');
		this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, s);

		this.dataCache.insert(0, rows-1);
		if (this.mode == 'local')
		{
			this.setRowCountKnown(true);
		}
	}

	// TODO: this should be integrated back into the descriptor
	this.setRemoteRowCount(rows);
	this.fire("DataInitalized");
}

/**
 * Loads valid XML data from either a string or an XML document in the Nitobi Grid format. The data must have 
 * &lt;ntb:grid&gt; and &lt;ntb:datasources&gt; tags.
 * @param {String | XmlDocument} oXml Either a string or XML document of valid XML.
 * @private
 */
nitobi.data.DataTable.prototype.initializeXmlData = function(oXml)
{
	var sXml = oXml;
	// accept either an xml doc or a string of xml
	if (typeof(oXml) == "object")
	{
		sXml = oXml.xml;
	}

	// load up the xml
	sXml = sXml.replace(/fieldnames=/g,"FieldNames=").replace(/keys=/g,"Keys=")//.replace(/defaults=/g,"Defaults=").replace(/types=/g,"Types=");
console.log(this.uid + ' initializeXmlData');
	this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, sXml);

	this.datastructure = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\'' + this.id + '\']/'+nitobi.xml.nsPrefix+'datasourcestructure');
}

nitobi.data.DataTable.prototype.replaceData = function(oXml)
{
	this.initializeXmlData(oXml);

	// get the datasroucestructure information to initialize the column 
	// array definitions
	var fields = this.datastructure.getAttribute("FieldNames");
	var keys = this.datastructure.getAttribute("Keys");
	var defaults = this.datastructure.getAttribute("Defaults");
	var types = this.datastructure.getAttribute("Types");

	// initialize the columns with that data specified in the xml schema.
	this.initializeColumns(fields,keys,types,defaults);
}

/**
 * Initializes the DataTable xmlDoc from the default structure with the 
 * defined fields from the this.columns property. Columns and keys are generally
 * first defined by calling initializeColumns.
 */
nitobi.data.DataTable.prototype.initializeSchema = function()
{
	var fields = this.columns.join("|");
	var keys = this.keys.join("|");
	var defaults = this.defaults.join("|");
	var types = this.types.join("|");

	this.dataCache.flush();
console.log(this.uid + ' initializeSchema');
	this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, nitobi.data.DataTable.DEFAULT_DATA.replace(/\{id\}/g,this.id).replace(/\{fields\}/g,fields).replace(/\{keys\}/g,keys).replace(/\{defaults\}/g,defaults).replace(/\{types\}/g,types));

	this.datastructure = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\'' + this.id + '\']/'+nitobi.xml.nsPrefix+'datasourcestructure');
}

/**
 * Defines the columns structure for the table including keys, datatypes and initial default values when rows are inserted.
 * @param {string} fields A pipe ("|") separated list of fields that are in the Datasource
 * @param {string} keys A pipe ("|") separated list of the key fields in the Datasource
 * @param {string} types A pipe ("|") separated list of the field types in the Datasource
 * @param {string} default A pipe ("|") separated list of the default values for each of the fields in the Datasource
 */
nitobi.data.DataTable.prototype.initializeColumns = function(fields,keys,types,defaults)
{
	if (null != fields) 
	{
		// check if we are actually changing the columns
		// if not then just return as there is no need
		var sColumns = this.columns.join('|');
		if (sColumns == fields)
			return;
		this.columns = fields.split("|");
	}
	if (null != keys)
	{
		this.keys = keys.split("|");
	}
	if (null != types)
	{
		this.types = types.split("|");
	}
	if (null != defaults)
	{
		this.defaults = defaults.split("|");
	}
	// if the xmldoc is null then we have not been called from inisitalizeXml ...
	// this seems a bit weird
	if (this.xmlDoc.documentElement == null) {
		// initializeSchema will use the internal columns etc arrays as defined just above.
		this.initializeSchema();
	}
	// not really any need to set the datastructure pointer as it should alreay be set.
	this.datastructure = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\'' + this.id + '\']/'+nitobi.xml.nsPrefix+'datasourcestructure');
	var ds = this.datastructure;
	if (fields) ds.setAttribute("FieldNames",fields);
	if (keys) ds.setAttribute("Keys",keys);
	if (defaults) ds.setAttribute("Defaults",defaults);
	if (types) ds.setAttribute("Types",types);

//	this.flush();
//	this.initializeXml(xml);
	this.makeFieldMap();
	this.fire("ColumnsInitialized");
}
/**
 * Creates a prototype xml node for use in insert operations
 * @param {array} values An array of values used as the new node. Optional.  If this is
 * not specified, the defaults are used instead.
 * @returns {XMLNode} Returns the XMLNode that can be used to insert data into the DataTable.
 */
nitobi.data.DataTable.prototype.getTemplateNode = function(values)
{
	var templateNode = null;
	if (values == null)
	{
		values=this.defaults;
	}

	templateNode = nitobi.xml.createElement(this.xmlDoc, "e");
	for (var i=0;i<this.columns.length;i++) {
		var keyAttribute = (i>25?String.fromCharCode(Math.floor(i/26)+97):"")+(String.fromCharCode(i%26+97));
		if (this.defaults[i] == null)
		{
		    templateNode.setAttribute(keyAttribute,"");
		}
		else
		{
		    templateNode.setAttribute(keyAttribute,this.defaults[i]);
		}
	}
	return templateNode;
}
/**
 * Clear the data and data log.
 * @public
*/
nitobi.data.DataTable.prototype.flush = function()
{
	// TODO: This should be here but causes some unknowns 
	// regarding the refresh function.
	//this.descriptor.reset();
	this.flushCache();
	this.flushLog();
console.log(this.uid + ' flush');
	this.xmlDoc = nitobi.xml.createXmlDoc();
}

/**
 * Clears the cache, flushes the log and clears the data.  Differs
 * from {@link #flush} in that it will not reset the data to a blank
 * XML document, but simply clear the data from the existing XML document.
 * @private
 */
nitobi.data.DataTable.prototype.clearData = function()
{
	this.flushCache();
	this.flushLog();
	if (this.xmlDoc)
   	{
   		var parentDataNode = this.xmlDoc.selectSingleNode("//ntb:data");
   		nitobi.xml.removeChildren(parentDataNode);
   	}
}

/**
 * Clears out the data and request caches.
 * @private
 */
nitobi.data.DataTable.prototype.flushCache = function()
{
	if (this.mode=="caching" || this.mode=="paging")
		this.dataCache.flush();
	if (this.mode!="unbound")
		this.requestCache.flush();
}

/**
 * join
 * @private
 */
nitobi.data.DataTable.prototype.join = function(start, pageSize, otherDataSource, field)
	{
	}
/**
 * merge - see mergeFromXml
 * @private
 */
nitobi.data.DataTable.prototype.merge = function(xd)
	{
	}

/**
 * Returns the data residing in the specified row at the specified column.
 * @param {Number} index The row index.
 * @param {String} columnName The name of the column.
 */	
nitobi.data.DataTable.prototype.getField = function(index, columnName)
{
	var r = this.getRecord(index);
	var a = this.fieldMap[columnName];
	if (a && r)
	{
		return r.getAttribute(a.substring(1));
	}
	else
	{
		return null;
	}
};
 
/**
 * Returns the requested record from the DataTable.
 * @param {Number} index The index of the requested record in the DataTable.
 * @returns {XmlElement} Returns the XML element from the DataTable.
 */
nitobi.data.DataTable.prototype.getRecord = function(index)
{
	var data = this.xmlDoc.selectNodes("//"+nitobi.xml.nsPrefix+"datasource[@id='"+this.id+"']/"+nitobi.xml.nsPrefix+"data/"+nitobi.xml.nsPrefix+"e[@xi='" + index + "']");
	if (data.length == 0)
	{
		return null;
	}
	return data[0];
}

/**
 * Starts a batch insert. After calling beginBatchInsert no events will be fired due to insert 
 * events until commitBatchInsert is called.
 */
nitobi.data.DataTable.prototype.beginBatchInsert = function()
{
	this.batchInsert = true;
	this.batchInsertRowCount = 0;
}
/**
 * Ends a batch insert. The RowInserted event will be fired if there were any rows inserted after 
 * beginBatchInsert was called and before commitBatchInsert is called.
 */
nitobi.data.DataTable.prototype.commitBatchInsert = function()
{
	// TODO: this should change so that the createRecord method will not actually
	// do the insert in batch mode but instead create a list of all the records to 
	// create and then use some xsl.

	this.batchInsert = false;
	var insertedRowCount = this.batchInsertRowCount;
	this.batchInsertRowCount = 0;

	this.setRemoteRowCount(this.remoteRowCount+insertedRowCount);

	if (insertedRowCount > 0)
	{
		this.fire("RowInserted", insertedRowCount);
	}
}

/**
 * Creates a new row record in the table
 * @param {XMLNode} templateNode A prototype of the row record that contains the structure and defaults for the new row.
 * @param {int} rowIndex Index of the row to insert after.
 * @returns {XMLNode} Returns the newly inserted XMLNode.
 */
nitobi.data.DataTable.prototype.createRecord = function(templateNode, rowIndex)
{
  	var xi = rowIndex;
	this.adjustXi(parseInt(xi), 1);

	var data = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	var rowDataTemplate = templateNode || this.getTemplateNode();
	
	var lastXid = nitobi.component.getUniqueId()
	var xNode = rowDataTemplate.cloneNode(true);
	xNode.setAttribute("xi", xi);
	xNode.setAttribute("xid", lastXid);
	xNode.setAttribute("xac", "i");

	// If a key generation function is specified, add keys to the key fields in 
	// the grid and in the updategram
	if (this.onGenerateKey)
	{
		var keyCols = this.xmlDoc.selectSingleNode("//"+nitobi.xml.nsPrefix+"datasourcestructure").getAttribute("Keys").split("|");
		var xml = null;
		for (var j=0; j < keyCols.length; j++)
		{
			var keyField = this.fieldMap[keyCols[j]].substring(1);
			var keyValue = xNode.getAttribute(keyField);
			/*
			* I added undefined here, since this is the value that is passed
			* when the xk column isn't set.
			*/
			if (!keyValue || keyValue == "")
			{
				if (!xml)
				{
					xml = eval(this.onGenerateKey);
				}
				if (typeof(xml) == 'string' || typeof(xml) == 'number')
				{
					xNode.setAttribute(keyField, xml);
				}
				else
				{
					try 
					{
						var ck1 = j%26;
						var ck2 = Math.floor(j/26);
						var keyAttribute = (ck2>0?String.fromCharCode(96+ck2):"")+String.fromCharCode(97+ck1);
						xNode.setAttribute(keyField, xml.selectSingleNode("//"+nitobi.xml.nsPrefix+"e").getAttribute(keyAttribute));
					}
					catch (e)
					{
						ntbAssert(false,"Key generation failed.",'',EBA_THROW);
					}
				}
			}
		}
	}

	data.appendChild(nitobi.xml.importNode(data.ownerDocument, xNode, true));
	
	if (this.log !=null)
	{
		var xLogNode = xNode.cloneNode(true);
		xLogNode.setAttribute("xac", "i");
		xLogNode.setAttribute("xid", lastXid);

		this.logData.appendChild(nitobi.xml.importNode(this.logData.ownerDocument,xLogNode, true));
	}

	this.dataCache.insertIntoRange(rowIndex);	

	this.batchInsertRowCount ++;

	if (!this.batchInsert)
	{
		// If we are not doing a batch insert then just call commitBatchInsert 
		// which will increment the row count and fire the rowinserted event
		this.commitBatchInsert();
	}

	return xNode;
}
/**
 * Updates a single column value for a single record in the table. If AutoSave is true then updates will automatically be sent to the server.
 * @param {int} xi The index of the row to update.
 * @param {string} field Name of the column to be updated.
 * @param {string} value New value for the field.
 */
nitobi.data.DataTable.prototype.updateRecord = function(xi, field, value)
{
	// todo refactor this into a new method or object
	var editedNode = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@xi=\'' + xi + '\']');

    ntbAssert((null != editedNode),'Could not find the specified node in the data source.\nTableDataSource: '+this.id+'\nRow: '+xi,'',EBA_THROW);
    var xid = editedNode.getAttribute("xid") || "error - unknown xid";
    ntbAssert(("error - unknown xid" != xid),'Could not find the specified node in the update log.\nTableDataSource: '+this.id+'\nRow: '+xi,'',EBA_THROW);

	// TODO: this delta only checks for if the delta exists based on the field 
	// argument being an ebaxml attribute name not a friendly name.
	var deltaExists 	= (editedNode.getAttribute(field) != value);

	if(!deltaExists)
	{
		//no changes made
		return;
	}

	// we found the row node that contains the updated cell	
	// What happens if the row is deleted?

	var oldValue = "";
	var mappedField = field;
	//	Check if the field name provided actually exists on the node
	if (editedNode.getAttribute(field) == null && this.fieldMap[field] != null)
		mappedField = this.fieldMap[field].substring(1)

	oldValue = editedNode.getAttribute(mappedField);
	editedNode.setAttribute(mappedField, value);

	// if null create the new row and set xac to i
	var rowXacAttr = "u"; // for updategram
	var columnXacAttr = "u"; // for updategram

	/**
		we want the updategram to be created and assigned to this.log
		The following format will be used:
		<root> <data id="_default">

				<e a="Cat and dogs" xi="0" xac="u" />
		</data>
		<gridmeta id="_defaultDataModel?" numcols="1" numrows="1">
		</gridmeta>
		</root>
	*/
	// if null then we need to assign this.log to a new xml doc 

	if(null == this.log)
		this.flushLog();

	var updatedNode = editedNode.cloneNode(true);

	updatedNode.setAttribute("xac","u");

	// TODO: consider if we need to check for a delete before setting the xac attribute to update

	this.logData = this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');

	// This will get the node in the DataTable log with the given xi - if it exists
	var logNode = this.logData.selectSingleNode('./'+nitobi.xml.nsPrefix+'e[@xid=\''+xid+'\']');

	updatedNode = nitobi.xml.importNode(this.logData.ownerDocument, updatedNode, true);

	if(null == logNode)
	{
		// If there is not already a node in the log for this xi then append the cloned data node
		updatedNode = nitobi.xml.importNode(this.logData.ownerDocument, updatedNode, true);
		this.logData.appendChild(updatedNode);
		updatedNode.setAttribute("xid",xid);
	}
	else
	{
		// keep the old xac value  This makes sure that "d" and "i" are not replaced by "u"
		updatedNode.setAttribute("xac", logNode.getAttribute("xac"));
		this.logData.replaceChild(updatedNode, logNode);
	}

	//now update the value
	if((true == this.AutoSave)) // also need to check for metadata deltas && deltaExists)	
	{
		this.save();
	}

	this.fire("RowUpdated", {"field":field,"newValue":value,"oldValue":oldValue,"record":updatedNode});
}
/**
 * Deletes a single row from the table.
 * @param index The index of the row to be deleted.
 */
nitobi.data.DataTable.prototype.deleteRecord = function(index)
{
	var data = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	this.logData = this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	// Delete the XML Data node.
	var xNode = data.selectSingleNode("*[@xi = '"+index+"']");

	this.removeRecordFromXml(index, xNode, data);

	this.setRemoteRowCount(this.remoteRowCount-1);

	this.fire("RowDeleted");
}

/**
 * 
 * @param indices - sorted array of indices of records to delete
 */
nitobi.data.DataTable.prototype.deleteRecordsArray = function(indices)
{
	var data = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	this.logData = this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	// Delete the XML Data node.
	var xNode = null;
	var index = null;
	
	for (var i=0; i<indices.length; i++) {
		var data = this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
		index = indices[i] - i;
		xNode = data.selectSingleNode("*[@xi = '"+index+"']");
		this.removeRecordFromXml(index, xNode, data);
	}

	this.setRemoteRowCount(this.remoteRowCount-indices.length);

	this.fire("RowDeleted");	
}

/**
 * Private - Refactored out to delete individual records, so it can be used for array
 */
nitobi.data.DataTable.prototype.removeRecordFromXml = function(index, xNode, data)
{
	if (xNode == null)
	{
		throw "Index out of bounds in delete.";
	}
	
	// Check the updategram log to see if this cell is already in there.
	// If it was an inserted record, delete the Insert log entry, otherwise make a note
	// in the log that this record was deleted.
	var xid = xNode.getAttribute("xid");
	var xDel = this.logData.selectSingleNode("*[@xid='" + xid + "']");
	var sTag="";
	// refactor replaceChild could make this code cleaner
	if (xDel != null) {
		sTag = xDel.getAttribute("xac");
		this.logData.removeChild(xDel);
	}
	if (sTag != "i") {
		var xDelNode = xNode.cloneNode(true);
		xDelNode.setAttribute("xac", "d");
		this.logData.appendChild(xDelNode);
	}
	
	data.removeChild(xNode);

	this.adjustXi(parseInt(index)+1, -1);

	this.dataCache.removeFromRange(index);	
}

/**
 * Adjusts the XI's of all records after the specified record by some adjustment value.
 * @param {Number} iStart The start index to increment / decrement XI values from.
 * @param {Number} iAdjust The number by which to increment / decrement the XI values.
 */
nitobi.data.DataTable.prototype.adjustXi = function(iStart, iAdjust)
{
	nitobi.data.adjustXiXslProc.addParameter("startingIndex",iStart,"");
	nitobi.data.adjustXiXslProc.addParameter("adjustment",iAdjust,"");
	this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, nitobi.xml.transformToString(this.xmlDoc, nitobi.data.adjustXiXslProc, "xml"));
	if (this.log != null)
	{
		this.log = nitobi.xml.loadXml(this.log, nitobi.xml.transformToString(this.log, nitobi.data.adjustXiXslProc, "xml"));
		this.logData = this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
	}
}

/**
 * The URL to which get requests will be sent.
  @param {string} val The URL.
 */
nitobi.data.DataTable.prototype.setGetHandler = function(val)
{
	this.getHandler = val;
	for(var name in this.getHandlerArgs)
	{
		this.setGetHandlerParameter(name,this.getHandlerArgs[name]);
	}
}

/**
 * The URL to which get requests will be sent.
  @return string The URL.
 */
nitobi.data.DataTable.prototype.getGetHandler = function()
{
	return this.getHandler;
}


/**
 * The URL to which save requests will be sent.
  @param {string} val The URL.
 */
nitobi.data.DataTable.prototype.setSaveHandler = function(val)
{
	this.postHandler = val;
	for(var name in this.saveHandlerArgs)
	{
		this.setSaveHandlerParameter(name,this.saveHandlerArgs[name]);
	}
}

/**
 * The URL to which save requests will be sent.
  @return string The URL.
 */
nitobi.data.DataTable.prototype.getSaveHandler = function()
{
	return this.postHandler;
}


/**
 * Commits the changes in the log back to the remote save handler. This method will generate 
 * keys for inserted rows, convert the data format to match the old backend, send the data
 * to the server asynchronously.
 * @param {Function} callback The function to be called when data has been saved to the server.
 * @param {string} beforeSaveEvent JavaScript code to be evaluated before proceeding with the save.
 */
nitobi.data.DataTable.prototype.save = function(callback, beforeSaveEvent)
	{

		//	Send the updates to the server now...

   		//
  		// the updategram is retained but save operation is postponed.
  		// This will means the client and server are now split brain
		// 
  		//
  		// It is best if a get from the server is done to ensure the
  		// client grid is consistent
  		
  		//	TODO: Maybe this should be elsewehre???

/*
		this.subscribe("BeforeSave",beforeSaveEvent); // this is wierd... passing in the function to call as a parameter
		if (!this.fire("BeforeSave")) {
			return;
		}
*/

		ntbAssert(this.postHandler!=null && this.postHandler != "",'A postHandler must be defined on the DataTable for saving to work.','',EBA_THROW);

		if (!eval(beforeSaveEvent || "true"))
		{
			return;
		}

		try
		{

			//	Check which version of the backend we are using ...
			if (this.version == 2.8)
			{
				//	That means we are using the old backend ...
				var fields = this.xmlDoc.selectSingleNode("//"+nitobi.xml.nsPrefix+"datasourcestructure").getAttribute("FieldNames").split("|");
				var insertNodes = this.log.selectNodes("//"+nitobi.xml.nsPrefix+"e[@xac = 'i']");
				for (var i = 0; i < insertNodes.length; i++)
				{
					for (var j = 0; j < fields.length; j++)
					{
						var currentValue = insertNodes[i].getAttribute(this.fieldMap[fields[j]].substring(1));
						if (!currentValue)
						{
							insertNodes[i].setAttribute(this.fieldMap[fields[j]].substring(1),"");
						}
					}
					insertNodes[i].setAttribute("xf", this.parentValue);
				}
				var updateNodes = this.log.selectNodes("//"+nitobi.xml.nsPrefix+"e[@xac = 'u']");
				for (var i = 0; i < updateNodes.length; i++)
				{
					for (var j = 0; j < fields.length; j++)
					{
						var currentValue = updateNodes[i].getAttribute(this.fieldMap[fields[j]].substring(1));
						if (!currentValue)
						{
							updateNodes[i].setAttribute(this.fieldMap[fields[j]].substring(1),"");
						}
					}
				}

				nitobi.data.updategramTranslatorXslProc.addParameter('xkField', this.fieldMap['_xk'].substring(1), '');
				nitobi.data.updategramTranslatorXslProc.addParameter('fields', fields.join("|").replace(/\|_xk/,""));
				nitobi.data.updategramTranslatorXslProc.addParameter("datasourceId", this.id, "");
				this.log = nitobi.xml.transformToXml(this.log, nitobi.data.updategramTranslatorXslProc);
			}
			// After this point, this.log can be in the old format or the new format, be careful.

			var postHandler = this.getSaveHandler();
			//	TODO: this should be a handlerResolver object or something ...
			(postHandler.indexOf('?') == -1) ? postHandler += '?' :  postHandler += '&';
			// TODO: Need this id.
			//postHandler += 'GridId=' + '&';
			postHandler += 'TableId=' + this.id;
			postHandler += '&uid=' + (new Date().getTime());

  			this.ajaxCallback = this.ajaxCallbackPool.reserve();


			ntbAssert(Boolean(this.ajaxCallback),"The datasource is serving too many connections. Please try again later. # current connections: " + this.ajaxCallbackPool.inUse.length );
			this.ajaxCallback.handler = postHandler;
			this.ajaxCallback.responseType = "xml";
			this.ajaxCallback.context = this;
			this.ajaxCallback.completeCallback = nitobi.lang.close(this,this.saveComplete);
			//this.ajaxCallback.onPostComplete.subscribeOnce(this.saveComplete, this);
			this.ajaxCallback.params = new nitobi.data.SaveCompleteEventArgs(callback);

			if (this.version > 2.8 && this.log.selectNodes("//"+nitobi.xml.nsPrefix+"e[@xac='i']").length > 0 && this.isAutoKeyEnabled())
			{
				this.ajaxCallback.async = false;
			}
			
			if (this.log.documentElement.nodeName == "root")
			{
				this.log = nitobi.xml.loadXml(this.log, this.log.xml.replace(/xmlns:ntb=\"http:\/\/www.nitobi.com\"/g,""));
				
				var fields = this.xmlDoc.selectSingleNode("//"+nitobi.xml.nsPrefix+"datasourcestructure").getAttribute("FieldNames").split('|');
				fields.splice(fields.length-1,1);
				fields = fields.join('|');
				this.log.documentElement.setAttribute("fields",fields);
				this.log.documentElement.setAttribute("keys",fields);
			}

			if (this.isAutoKeyEnabled() && this.version < 3)
			{
				console.log("AutoKey is not supported in this schema version. You must upgrade to Nitobi Grid Xml Schema version 3 or greater.");
			}
			
			this.ajaxCallback.post(this.log);
			this.flushLog();
		}
		catch(err)
		{
			throw err;
  			//_ntbAssert(false,"save : " + err.message);
		}

	}
/**
 * Clears the log.
 */
nitobi.data.DataTable.prototype.flushLog = function()
{
	//	TODO: integrate the response back into our client model
	//	For now we can leave it at assuming all operations succesful ...
	//	so clear the log and the response should just be the new grid xml
	this.log = nitobi.xml.createXmlDoc(nitobi.data.DataTable.DEFAULT_LOG.replace(/\{id\}/g,this.id).replace(/\{fields\}/g,this.columns).replace(/\{keys\}/g,this.keys).replace(/\{defaults\}/g,this.defaults).replace(/\{types\}/g,this.types));
	this.logData = this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data');
}

/**
 * @private
 * Takes all the inserts from a server insert and 
 * sets the keys for autokey
 * @param {XmlDocument} xmlDoc The xml document from the server.
 */
nitobi.data.DataTable.prototype.updateAutoKeys = function(xmlDoc)
{

	try
	{
		var inserts = xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e[@xac=\'i\']');
		if (typeof(inserts) == "undefined" || inserts == null)
		{
			nitobi.lang.throwError("When updating keys from the server for AutoKey support, the inserts could not be parsed.");
		}
		var keys = xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+"datasourcestructure")[0].getAttribute("keys").split("|");
		if (typeof(keys) == "undefined" || keys == null || keys.length == 0)
		{
			nitobi.lang.throwError("When updating keys from the server for AutoKey support, no keys could be found. Ensure that the keys are sent in the request response.");
		}
		for (var i = 0; i < inserts.length; i++)
		{
			var record = this.getRecord(inserts[i].getAttribute("xi"));
			for (var j = 0; j < keys.length; j++)
			{
				var att = this.fieldMap[keys[j]].substring(1);
				record.setAttribute(att, inserts[i].getAttribute(att));
			}
		}
	}	
	catch(err)
	{
		nitobi.lang.throwError("When updating keys from the server for AutoKey support, the inserts could not be parsed.", err);
	}
}

/**
 * Handles the response from the save handler.
 * @param {XMLDocument} xd An XMLDocument containing the response from the save handler
 * @param {nitobi.data.SaveCompleteEventArgs} evtArgs Event arguments
 * @private
 */
nitobi.data.DataTable.prototype.saveComplete = function(evtArgs)
	{
		var xd = evtArgs.response;
		var evtArgs = evtArgs.params;
		// TODO: Empty try catch.

		try
		{
			if (this.isAutoKeyEnabled() && this.version > 2.8)
			{
				this.updateAutoKeys(xd);
			}
			if (this.version == 2.8 && !this.onGenerateKey)
			{
				var rows = xd.selectNodes("//insert");
				for (var i=0; i < rows.length; i++)
				{
					var xk = rows[i].getAttribute("xk");
					if (xk != null)
					{
						var record = this.findWithoutMap("xid", rows[i].getAttribute("xid"))[0];
						//var key = this.fieldMap["_xk"].substring(1);
						//record.setAttribute(key, xk);
						record.setAttribute("xk", xk);
					}
				}
			}
			if(null != evtArgs.result)
			{
				ntbAssert((null == errorMessage), "Data Save Error:" + errorMessage, EBA_EM_ATTRIBUTE_ERROR, EBA_ERROR);
			}
			
			var node = xd.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource') || xd.selectSingleNode('/root');
			var e = null;
			if (node)
			{
				e = node.getAttribute('error');
			}
			if (e)
			{
				this.setHandlerError(e);
			}
			else
			{
				this.setHandlerError(null);
			}
			this.ajaxCallbackPool.release(this.ajaxCallback);
			var afterSaveArgs = new nitobi.data.OnAfterSaveEventArgs(this, xd); 
			evtArgs.callback.call(this, afterSaveArgs);
			//	TODO: need to restore state - ie set focus on the appropriate cell ...		
		}
		catch(err)
		{
			this.ajaxCallbackPool.release(this.ajaxCallback);
			ebaErrorReport(err,"",EBA_ERROR);
		}
	}
/**
 * Makes a hash for relating column names to XML nodes in the data.
 */
nitobi.data.DataTable.prototype.makeFieldMap = function()
	{
		var oXMLs=this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource');
		var cf = 0;
		var ck = 0;
		this.fieldMap = new Array();

		//	This needs to be changed to transform some XML into JavaScript that is then eval'ed ...

		var cF = this.columns.length;

		for (var i=0; i<cF; i++) 
		{
			var fname = this.columns[i];
			this.fieldMap[fname] = this.getFieldName(ck);
			ck++;
		}
	}

/**
 * Returns the XPath for the column data at the given column index.
 */
nitobi.data.DataTable.prototype.getFieldName = function(columnIndex) 
{
	var ck1 = columnIndex%26;
	var ck2 = Math.floor(columnIndex/26);
	return "@"+(ck2>0?String.fromCharCode(96+ck2):"")+String.fromCharCode(97+ck1);
}
/**
 * Returns the set of records with the given value at the given field.
 * @param {String} fieldName the field to search at
 * @param {String} value the value to search for
 * @type Array
 */
nitobi.data.DataTable.prototype.find = function(fieldName, value)
{
	var field = this.fieldMap[fieldName];
	if (field)
	{
		return this.findWithoutMap(field,value);
	}
	else
	{
		return new Array();
	}
};
/**
 * @private
 */
nitobi.data.DataTable.prototype.findWithoutMap = function(field, value)
{
	if (field.charAt(0) != "@")
		field = "@"+field;
	return this.xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'e['+field+'="'+value+'"]');
};

/**
 * Performs a local sort of the data
 * Note: This way of sorting is only useful when we have all the data residing in the XML, otherwise data should be sorted remotely
 * @param {String} column the identifier of the column to sort by
 * @param {String} dir the direction to sort 'Desc'|'Asc'
 * @param {String} type the type of sort to perform 'number'|'text'
 * @param {Boolean} local whether the sort is local or remote - if remote, the column 
 * and direction will be set for the next server request
 * @public
 */
nitobi.data.DataTable.prototype.sort = function(column,dir,type,local)
{
	if (local)
	{
		//this.filter = null;
		column = this.fieldMap[column];
		column = column.substring(1);
		dir = (dir=="Desc")?"descending":"ascending";
		type = (type=="number")?"number":"text";
		this.sortXslProc.addParameter("column",column,"");
		this.sortXslProc.addParameter("dir",dir,"");
		this.sortXslProc.addParameter("type",type,"");
		console.log(this.uid + ' sort');
		this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, nitobi.xml.transformToString(this.xmlDoc, this.sortXslProc, "xml"));
		this.fire("DataSorted");
	}
	else
	{
		this.sortColumn = column;
		this.sortDir = dir || 'Asc';
	}
}

/**
 * Sets the number of rows that are in the remote datasource 
 * Note: We consider adding rows locally to increase the remote datasource size even if they haven't been saved yet. Same true for deletes
 * @private
 */
nitobi.data.DataTable.prototype.syncRowCount = function()
{
	this.setRemoteRowCount(this.descriptor.estimatedRowCount);
}
/**
 * Sets the number of rows that are in the remote datasource 
 * Note: We consider adding rows locally to increase the remote datasource size even if they haven't been saved yet. Same true for deletes
 * @private
 */
nitobi.data.DataTable.prototype.setRemoteRowCount = function(rows)
{
	var previousCount = this.remoteRowCount;
	this.remoteRowCount = rows;
  	if (this.remoteRowCount != previousCount) {
		this.fire("RowCountChanged",rows);
  	}
}
/**
 * Gets the number of rows that are in the remote datasource 
 * Note: We consider adding rows locally to increase the remote datasource size even if they haven't been saved yet. Same true for deletes
 * @public
 * @returns {int}
 */
nitobi.data.DataTable.prototype.getRemoteRowCount = function()
{
	return this.remoteRowCount;
}
/**
 * Returns the number of rows that are actually in the local recordset. This number is not used in caching mode.
 * @returns {int}
 */
nitobi.data.DataTable.prototype.getRows = function()
{
	return this.xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e').length;
}

nitobi.data.DataTable.prototype.getXmlDoc = function()
{
	return this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']');
}
	
/**
 * @private
 */
nitobi.data.DataTable.prototype.getRowNodes = function()
{
	return this.xmlDoc.selectNodes('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e');
}
/**
 * Returns the number of columns in the DataTable.
 * @returns {int}
 */
nitobi.data.DataTable.prototype.getColumns = function()
	{
		return this.fieldMap.length;
	}


		
	
/**
 * Appends the given parameter to the GetHandler value when requests for data are made to the server.
 * @param {string} name The name of the parameter to be appended to the querystring.
 * @param {string} value The value of the parameter to be appended to the querystring.
 */
nitobi.data.DataTable.prototype.setGetHandlerParameter = function(name, value)
{
	if (this.getHandler != null && this.getHandler != "")
	{
		this.getHandler = nitobi.html.setUrlParameter(this.getHandler,name,value);
	}
	this.getHandlerArgs[name] = value;
}

/**
 * Appends the given parameter to the SaveHandler value when requests for data are made to the server.
 * @param {string} name The name of the parameter to be appended to the querystring.
 * @param {string} value The value of the parameter to be appended to the querystring.
 */
nitobi.data.DataTable.prototype.setSaveHandlerParameter = function(name, value)
{
	if (this.postHandler != null && this.postHandler != "")
	{
		this.postHandler = nitobi.html.setUrlParameter(this.getSaveHandler(),name,value);
	}
	this.saveHandlerArgs[name] = value;
}

/**
 * Returns the number of entries in the change log.
 * @returns {int}
 */
nitobi.data.DataTable.prototype.getChangeLogSize = function()
{
	if (null == this.log)
	{
		return 0;
	}
	return this.log.selectNodes("//"+nitobi.xml.nsPrefix+"e").length;
}

/**
 * Returns the change log XML document.
 * @returns {XMLDocument}
 */
nitobi.data.DataTable.prototype.getChangeLogXmlDoc = function()
{
	return this.log;	
}

/**
 * Returns the data in the DataTable as an XML document.
 * @returns {XMLDocument}
 */
nitobi.data.DataTable.prototype.getDataXmlDoc = function()
{
	return this.xmlDoc;
}

/**
 * @ignore
 */
nitobi.data.DataTable.prototype.dispose = function()
{
	this.flush();
	this.ajaxCallbackPool.context = null;

	for (var item in this)
	{
		if (this[item] != null && this[item].dispose instanceof Function)
			this[item].dispose();
		this[item] = null;
	}
}


//
// BOUND
//
/**
 * Makes a request to the server with no start or pagesize parameters.
 * @param {object} context
 * @param {function} callback
 * @param {function} errorCallback
 * @public
 */
nitobi.data.DataTable.prototype.getTable = function(context, callback, errorCallback)
{
	this.errorCallback = errorCallback;

	var ajaxCallback = this.ajaxCallbackPool.reserve();

	ntbAssert(Boolean(ajaxCallback),"The datasource is serving too many connections. Please try again later. # current connections: " + this.ajaxCallbackPool.inUse.length );

	// This is an editor's gethandler
	var getHandler = this.getGetHandler();
	ajaxCallback.handler = getHandler;
	ajaxCallback.responseType = "xml";
	ajaxCallback.context = this;
	ajaxCallback.completeCallback = nitobi.lang.close(this,this.getComplete);
//	ajaxCallback.onGetComplete.subscribeOnce(this.getComplete, this);
	// TODO: Is this right, 4th null. What is the pagesize here?
	ajaxCallback.async = this.async;
	// StartXi is supposed to 0 in a getTable request ... when are these even used?
	ajaxCallback.params = new nitobi.data.GetCompleteEventArgs(null, null, 0, null,ajaxCallback, this, context, callback);

	if (typeof(callback) != 'function' || this.async == false)
	{
		ajaxCallback.async = false;
		return this.getComplete({"response":ajaxCallback.get(), "params":ajaxCallback.params});
	}
	else
	{
		ajaxCallback.get();
	}
			
}

/**
 * This function is executed as the callback function when data has returned from the paging request.
 * This method will check the response for validity, check the data format for backwards compatibility, 
 * create a new XML doc if necessary, adjust the row #'s (xi's), remove the range from the request cache,
 * update the cachemap.
 * @param {XmlElement} xd The xml document payload returned by the paging request
 * @param {nitobi.data.GetCompleteEventArgs} getCompleteEvtArgs The event arguments such as startXi returned along with the response payload
 */
nitobi.data.DataTable.prototype.getComplete = function(evtArgs)
{
	var xd = evtArgs.response;
	var getCompleteEvtArgs = evtArgs.params;
	
		// Used only by mode != unbound
		if (this.mode!="caching") //(this.id != "_default")
		{
			// Clear existing data if mode is non-caching
			console.log(this.uid + ' getComplete');
			this.xmlDoc=nitobi.xml.createXmlDoc();
		}
		if (null == xd || null == xd.xml || '' == xd.xml)
		{
			var error = "No parse error.";
			if (nitobi.xml.hasParseError(xd))
			{
			    if (xd == null)
			    {
			        error = "Blank Response was Given";
			    }
			    else
			    {
				    error = nitobi.xml.getParseErrorReason(xd);
				}				   
			}
			ntbAssert(null!=this.errorCallback,"The server returned either an error or invalid XML but there is no error handler in the DataTable.\nThe parse error content was:\n"+error);
			if (this.errorCallback)	
			{
				this.errorCallback.call(this.context);
			}
			this.fire("DataReady",getCompleteEvtArgs);
			return getCompleteEvtArgs;
		}
		else
		{
			if (typeof(this.successCallback) == 'function')
			{
				this.successCallback.call(this.context);
			}
		}
		// If this is our first encounter with the data then autoconfigure the datatable parameters (paging stuff, columns, #rows, etc)
		if (!this.configured) {
			this.configureFromData(xd);
		}

		xd = this.parseResponse(xd, getCompleteEvtArgs);
		
		xd = this.assignRowIds(xd);

		var rowNodes = null;
		rowNodes = xd.selectNodes("//"+nitobi.xml.nsPrefix+"datasource[@id='" + this.id + "']/"+nitobi.xml.nsPrefix+"data/"+nitobi.xml.nsPrefix+"e");

		// This gets set to the index of the last row that was returned.
		var lastRowReturned;
		// This gets set to the number of rows returned.
		var numRowsReturned = rowNodes.length;

		// If the pagesize is null, we got whatever the server would give us.
		// Update the evt args according to what was delievered by the server.
		if (getCompleteEvtArgs.pageSize == null)
		{
			getCompleteEvtArgs.pageSize = numRowsReturned;
			getCompleteEvtArgs.lastRow = getCompleteEvtArgs.startXi + getCompleteEvtArgs.pageSize - 1;
			getCompleteEvtArgs.firstRow = getCompleteEvtArgs.startXi;
		}


		if (0 != numRowsReturned)
		{
			ntbAssert(rowNodes[0].getAttribute("xi") == (getCompleteEvtArgs.startXi),"The gethandler returned a different first row than requested.");

//			lastRowReturned = getCompleteEvtArgs.lastRow;
			//	Here we check if the zero based index (xi) of the last record returned from the server 
			//	is equal to the requested pageSize plus the starting xi minus 1...
	//			if (rowNodes[rowNodes.length-1].getAttribute("xi") != (getCompleteEvtArgs.pageSize+getCompleteEvtArgs.startXi-1))
	//			{
				lastRowReturned = parseInt(rowNodes[rowNodes.length-1].getAttribute("xi"));

				// lastRowReturned is used in descriptor to determine if we 
				// did not receive all the expected rows and are thus on the last page.
	//				getCompleteEvtArgs.lastRowReturned = lastRowReturned;
	
				// This is the last page.
//				getCompleteEvtArgs.lastPage=true;
//	  			this.fire("RowCountKnown",actualLastRow);
//			}

			//	Add the range to the cache map.
			if (this.mode == "paging")
			{
				this.dataCache.insert(0, getCompleteEvtArgs.pageSize-1);				
			}
			else
			{
				this.dataCache.insert(getCompleteEvtArgs.firstRow, lastRowReturned);
			}
		}
		else
		{
			lastRowReturned = -1;
			getCompleteEvtArgs.pageSize=0;
			if (this.totalRowCount == null)
			{
				var pct = this.descriptor.lastKnownRow/this.descriptor.estimatedRowCount || 0;
				this.fire("PastEndOfData",pct);
			}
		}

		getCompleteEvtArgs.numRowsReturned = numRowsReturned;
		getCompleteEvtArgs.lastRowReturned = lastRowReturned;
		
		// Remove the received request from the cache.
		var startXi = getCompleteEvtArgs.startXi;
		var pageSize = getCompleteEvtArgs.pageSize;
		if (!isNaN(startXi) && !isNaN(pageSize) && startXi != 0)
		{
			this.requestCache.remove(startXi,startXi + pageSize - 1);
		}
		
		if (this.mode!="caching") 
		{
			// in both static and paging modes we just take the data from the server 
			// and put it into our local xml document.

			// Use replaceData which will _only_ replace the data and no events will be fired
			// or row counts being set ... this happens later by the descriptor.
			this.replaceData(xd);

		} else {
			//	Otherwise we need to merge the data from the request with that in our datasource
			this.mergeData(xd);

/*
			// Added by james 
			var previousCount = this.remoteRowCount;
			var previousKnown = this.rowCountKnown;
		  	this.descriptor.update(getCompleteEvtArgs);
		  	
		  	this.remoteRowCount = this.descriptor.estimatedRowCount;
		  	this.rowCountKnown = this.descriptor.isAtEndOfTable;
		  	if (this.remoteRowCount != previousCount) {
		  			this.fire("RowCountChanged",this.remoteRowCount);
		  	}
		  	if (this.rowCountKnown != previousKnown) {
		  			this.fire("RowCountKnown",this.remoteRowCount);
		  	}
	*/
		}
	
		if (!this.totalRowCount)
		{
			var totalRowCount = this.xmlDoc.selectSingleNode("//ntb:datasource").getAttribute("totalrowcount");
			totalRowCount = parseInt(totalRowCount);
			if (!isNaN(totalRowCount))
			{
				this.totalRowCount = totalRowCount;
			}
			// TODO: Should fire an event here to notify all interested parties that we have
			// all the rows
			this.fire("TotalRowCountReady", this.totalRowCount);
		}
	
		var parentField = this.xmlDoc.selectSingleNode("//ntb:datasource").getAttribute("parentfield");
		var parentValue = this.xmlDoc.selectSingleNode("//ntb:datasource").getAttribute("parentvalue");
		this.parentField = parentField || "";
		this.parentValue = parentValue || "";
		
		this.updateFromDescriptor(getCompleteEvtArgs)
		
		this.fire("RowCountReady",getCompleteEvtArgs);
		if (null != getCompleteEvtArgs.ajaxCallback)
		{
			//	We need to check that the ajaxCallback is not null before relaesing it
			//	It could be the case the ajaxCallback object was not needed because the
			//	data was already present in the DataSource
			this.ajaxCallbackPool.release(getCompleteEvtArgs.ajaxCallback);
		}

		this.executeRequests();
		
		var node = xd.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource');
		var e = null;
		if (node)
		{
			e = node.getAttribute('error');
		}
		if (e)
		{
			this.setHandlerError(e);
		}
		else
		{
			this.setHandlerError(null);
		}
		
		this.fire("DataReady",getCompleteEvtArgs);

		if (null != getCompleteEvtArgs.callback && null != getCompleteEvtArgs.context)
		{
			getCompleteEvtArgs.callback.call(getCompleteEvtArgs.context, getCompleteEvtArgs);
			getCompleteEvtArgs.dispose();
			getCompleteEvtArgs = null;
		}
		else
		{
			// return the getCompleteEvtArgs to the caller ... 
			return getCompleteEvtArgs;
		}

	}

/**
 * @private
 */
nitobi.data.DataTable.prototype.executeRequests = function() 
{
	// Execute all the functions on the request queue, then reset the queue.
	var oldRequests = this.requestQueue;
	this.requestQueue = new Array();
	for (var i=0; i < oldRequests.length; i++)
	{
		oldRequests[i].call();
	}
}
/**
 * @private
 * Updates information related to paging such as whether the number of records on the server is known and what the currently estimated rowcount is.
 */
nitobi.data.DataTable.prototype.updateFromDescriptor = function(getCompleteEvtArgs) 
{
	if (this.totalRowCount == null)
  		this.descriptor.update(getCompleteEvtArgs);
  	if (this.mode == "paging")
  	{
  		this.setRemoteRowCount(getCompleteEvtArgs.numRowsReturned);
  	}
  	else
  	{
  		if (this.totalRowCount != null)
  			this.setRemoteRowCount(this.getTotalRowCount());
  		else
  			this.setRemoteRowCount(this.descriptor.estimatedRowCount);
  	}
  	this.setRowCountKnown(this.descriptor.isAtEndOfTable);
}

nitobi.data.DataTable.prototype.setRowCountKnown = function(known)
{
	// TODO: this has to be merged with the fireProjectionUpdatedEvent stuff in descriptor
	var previousKnown = this.rowCountKnown;
	this.rowCountKnown = known
  	if (known && this.rowCountKnown != previousKnown) 
  	{
		this.fire("RowCountKnown",this.remoteRowCount);
  	}
}
nitobi.data.DataTable.prototype.getRowCountKnown = function()
{
	return this.rowCountKnown;
}
/**
 * @private
 */
nitobi.data.DataTable.prototype.configureFromData = function(xd)
{
	this.version=this.inferDataVersion(xd);

	// Get columns out of data
	// Get total records on server
	
	if (this.mode=="unbound") {
	}
	if (this.mode=="static") {
	}
	if (this.mode=="paging") {
	}
	if (this.mode=="caching") {
	}
			//firstResponseRowXi
			//lastResponseRowXi
			//rowsInResponse
			//rowsRequested
			//firstRequestRowXi
			//laststRequestRowXi
			//firstPageRow
			//lastPageRow
			//ActualTotalRows
			//PredictedTotalRows
			//lastPage
}

/**
 * Merges the data from an XML document into the DataTable XML. DEPRECATED???
 * @private
 * @param {XMLNode} xd
 */
nitobi.data.DataTable.prototype.mergeData = function(xd)
{
	if (this.xmlDoc.xml == "")
	{
		this.initializeXml(xd);
		return;
	}
	var p = nitobi.xml.nsPrefix;
	var xpath = "//"+p+"datasource[@id = '"+this.id+"']/"+p+"data";

	//	We need to merge the new data into our dataset because we are in caching mode ...
	//	Need to be able to generate some XSL based on the returned data ...
	var newData = xd.selectNodes(xpath+"//"+p+"e");

	//	this shoudl be abstracted into something like this.getDataSourceNode so that we can override it easily...
	//	or it should use an object like a data source connector/resolver to do that!!!
	var oldData = this.xmlDoc.selectSingleNode(xpath);

	//	TODO: somehow, despite having our request cache, we are getting duplicate xi values...
	//	To fix this i moved the request cache into the viewport itself ...

	var len = newData.length;
	for (var i=0; i<len; i++)
	{
		//	importNode???? namespaces????
		if (this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.id+'\']/'+nitobi.xml.nsPrefix+'data/'+nitobi.xml.nsPrefix+'e[@xi=\''+newData[i].getAttribute('xi')+'\']'))
		{
			continue;
		}
		oldData.appendChild(nitobi.xml.importNode(oldData.ownerDocument, newData[i], true));
	}
}

/**
 * @private
 */
nitobi.data.DataTable.prototype.assignRowIds = function(xd)
{
	nitobi.data.addXidXslProc.addParameter('guid', nitobi.component.getUniqueId(), '');
	var doc = nitobi.xml.loadXml(xd, nitobi.xml.transformToString(xd, nitobi.data.addXidXslProc, "xml"));
	return doc;
}

/**
 * @private
 */
nitobi.data.DataTable.prototype.inferDataVersion = function(xd)
{
	if (xd.selectSingleNode("/root")) return 2.8;
	return 3.0;
}

/**
 * @private
 */
nitobi.data.DataTable.prototype.parseResponse = function(xd, getCompleteEvtArgs)
{
	//	First check the version that we are working with
	if (this.version==2.8)
	{
		return this.parseLegacyResponse(xd, getCompleteEvtArgs);
	}
	else
	{
		return this.parseStructuredResponse(xd, getCompleteEvtArgs);
	}
}
/**
 * Parses a response from an Grid V2.8 server handler.
 * @private
 */
nitobi.data.DataTable.prototype.parseLegacyResponse = function(xd, getCompleteEvtArgs)
{
	var startXi = this.mode == "paging" ? 0 : getCompleteEvtArgs.startXi;
	nitobi.data.dataTranslatorXslProc.addParameter('start', startXi, '');
	nitobi.data.dataTranslatorXslProc.addParameter('id', this.id, '');
	var fieldsNode = xd.selectSingleNode("/root").getAttribute("fields");
	var fields = fieldsNode.split("|");
	var i = fields.length;
	var xkField = (i>25 ? String.fromCharCode(Math.floor(i/26)+96):"")+(String.fromCharCode(i%26+97));
	nitobi.data.dataTranslatorXslProc.addParameter('xkField',xkField, ''); // last column of table is the key field
	xd = nitobi.xml.transformToXml(xd, nitobi.data.dataTranslatorXslProc);	
	return xd;	
}

/**
 * @private
 */
nitobi.data.DataTable.prototype.parseStructuredResponse = function(xd, getCompleteEvtArgs)
{
	// Drop all other datasources.
	xd = nitobi.xml.loadXml(xd, '<ntb:grid xmlns:ntb="http://www.nitobi.com"><ntb:datasources>'+xd.selectSingleNode("//"+nitobi.xml.nsPrefix+"datasource[@id='" + this.id + "']").xml+'</ntb:datasources></ntb:grid>');
	var firstRow = xd.selectSingleNode("//"+nitobi.xml.nsPrefix+"datasource[@id='" + this.id + "']/"+nitobi.xml.nsPrefix+"data/"+nitobi.xml.nsPrefix+"e");
	// So far, there is a dependency on xi from the server.
	var startXi = this.mode == "paging" ? 0 : getCompleteEvtArgs.startXi;
	if (firstRow)
	{
		ntbAssert(Boolean(firstRow.getAttribute("xi")),"No xi was returned in the data from the server. Server must return xi's in the new format.", "", EBA_THROW);
		ntbAssert(startXi >= 0,"startXI is incorrect.");

		// TODO: Refactor into a method.
		if (firstRow.getAttribute("xi") != startXi)
		{
			nitobi.data.adjustXiXslProc.addParameter("startingIndex","0","");
			nitobi.data.adjustXiXslProc.addParameter("adjustment",startXi,"");
			xd = nitobi.xml.loadXml(xd, nitobi.xml.transformToString(xd, nitobi.data.adjustXiXslProc, "xml"));
			
		}
	}
	return xd;	

}

//
// PAGING
//
/**
 * LARGE NOTE: I don't think get should ignore the call if it thinks it already has it. This gets the rows
 * regardless of cache. This allows us to check for the return error before we flush our data.
 * There should be a better way to force the get function to get the page you want. TODO: Eliminate forceGet
 * @private
 */
nitobi.data.DataTable.prototype.forceGet = function(start, pageSize, context, callback, errorCallback, successCallback)
	{
		this.errorCallback = errorCallback;
		this.successCallback = successCallback;
		this.context = context;
		var getHandler = this.getGetHandler();
		//	TODO: this should be a handlerResolver object or something ...
		(getHandler.indexOf('?') == -1) ? getHandler += '?' :  getHandler += '&';
		getHandler += 'StartRecordIndex=0&start=0&PageSize=' + pageSize + '&SortColumn=' + (this.sortColumn || '') + '&SortDirection=' + this.sortDir + '&TableId=' + this.id + '&uid=' + (new Date().getTime());
		var ajaxCallback = this.ajaxCallbackPool.reserve();
	
		ntbAssert(Boolean(ajaxCallback),"The datasource is serving too many connections. Please try again later. # current connections: " + this.ajaxCallbackPool.inUse.length );
		ajaxCallback.handler = getHandler;
		ajaxCallback.responseType = "xml";
		ajaxCallback.context = this;
		ajaxCallback.completeCallback = nitobi.lang.close(this,this.getComplete);
		//ajaxCallback.onGetComplete.subscribeOnce(this.getComplete, this);
		ajaxCallback.params = new nitobi.data.GetCompleteEventArgs(0, pageSize-1, 0, pageSize, ajaxCallback, this, context, callback);
		ajaxCallback.get();	
		return;
	}

nitobi.data.DataTable.prototype.getPage = function(start, pageSize, context, callback, errorCallback, successCallback)
{
	ntbAssert(this.getHandler.indexOf("GridId")!=-1,"The gethandler has not gridId specified on it.");
//	this.forceGet(start, pageSize, context, callback, errorCallback, successCallback)
	var lastRow = start + pageSize - 1;

	var cacheGaps = this.dataCache.gaps(0, pageSize-1);
	var numCacheGaps = cacheGaps.length;

	if (numCacheGaps)
	{
		var requestGaps = this.requestCache.gaps(start,lastRow);

		//	There is a request outstanding for this data already ...
		if (requestGaps.length == 0)
		{
			var funcref = nitobi.lang.close(this, this.get, arguments);
			this.requestQueue.push(funcref);
			return;
		}
		
		this.getFromServer(start, lastRow, start, lastRow, context, callback, errorCallback);
	}
	else
	{
		this.getFromCache(start, pageSize, context, callback, errorCallback);
	}
	
}

/**
 * General request for data.
 * @param {int} start
 * @param {int} pageSize
 * @param {object} context
 * @param {function} callback
 * @param {function} errorCallback
 * @public
 */
nitobi.data.DataTable.prototype.get = function(start, pageSize, context, callback, errorCallback)
{
		this.errorCallback = errorCallback;

		//	TODO: Why is this section only for the default datasource?
		//  This is temporary. we needed to simplify the gethandlers for other data sources.
		//  Didn't want the startrecordindex, pagesize etc. getting in there. 
/*
		if (this.id == "_default")
		{
			return this.getCached(start, pageSize, context, callback, errorCallback)
//			this.getPage(start, pageSize, context, callback, errorCallback, successCallback)
//			this.getSync(start, pageSize)
		} else {
			return this.getTable(context, callback, errorCallback)
		}
*/
		var result = null;

		if (this.mode=="caching") {
			result = this.getCached(start, pageSize, context, callback, errorCallback)
		}
//		if (this.mode=="static") {
		// TODO: get the modes all sorted.
		if (this.mode=="local" || this.mode=="static") {
			result = this.getTable(context, callback, errorCallback)
		}
		if (this.mode=="paging") {
			result = this.getPage(start, pageSize, context, callback, errorCallback);
		}

		return result;
	}


//
// CACHING
//
/**
 * Determines if the range specified exists in the data on the client.
 * @param {int} start Start index of range.
 * @param {int} pageSize Number of records in range.
 * @public
 */
nitobi.data.DataTable.prototype.inCache = function(start,pageSize)
{
	// TODO: this should not be here since local data should be inCache always...
	if (this.mode == 'local')
	{
		return true;
	}

	var firstRow = start, lastRow = start + pageSize - 1;

	// If we know the last row and are checking the cache past the end of
	// the data there is no way the data will be in cache so reduce the lastRow
	// to the lastKnownRow value instead.
	var lastKnownRow = this.getRemoteRowCount()-1;

	if (this.getRowCountKnown() && lastKnownRow < lastRow)
	{
		lastRow = lastKnownRow;
	}

	var cacheGaps = this.dataCache.gaps(firstRow, lastRow);
	var numCacheGaps = cacheGaps.length;
	return !(numCacheGaps > 0);
}
	
/**
 * Returns the blocks of data that are already cached on the client.
 * @param {int} start Start index of range.
 * @param {int} pageSize Number of records in range.
 * @public
 */
nitobi.data.DataTable.prototype.cachedRanges = function(firstRow,lastRow)
{
	return this.dataCache.ranges(firstRow, lastRow);
}
	
/**
 * Request for page of data into a cached data table
 * @param {int} start
 * @param {int} pageSize
 * @param {int} context
 * @param {int} callback
 * @param {int} errorCallback
 * @param {int} successCallback
 * @public
 */
nitobi.data.DataTable.prototype.getCached = function(start, pageSize, context, callback, errorCallback, successCallback)
{
		if (pageSize == null)
		{
			return this.getFromServer(firstRow, null, start, null, context, callback, errorCallback);
		}
		
		//	first this is to check what part of the data we don't already have ...
		var firstRow = start, lastRow = start + pageSize - 1;
		var cacheGaps = this.dataCache.gaps(firstRow, lastRow);
		var numCacheGaps = cacheGaps.length;
		ntbAssert(numCacheGaps==cacheGaps.length, "numCacheGaps != gaps.length despite setting it so. Concurrency problem has arisen.");

		if (this.mode!="unbound" && numCacheGaps > 0)
		{
			// There are certain situations - like when user scrolls to the bottom - that we 
			// do get multiple cacheGaps. In those cases LiveScrolling stops working if we loop through each.
//			for (var i=0; i<numCacheGaps; i++)
//			{
				var low = cacheGaps[numCacheGaps-1].low;
				var high = cacheGaps[numCacheGaps-1].high;

				var requestGaps = this.requestCache.gaps(low,high);

				//	There is a request outstanding for this data already ...
				if (requestGaps.length == 0)
				{
					var funcref = nitobi.lang.close(this, this.get, arguments);
					//window.setTimeout(funcref, 100);
					this.requestQueue.push(funcref);
					return;
				}
//				else
//				{
//					this.requestCache.insert(low,high);
//				}

/*
				var getHandler = this.getHandler;
				//	TODO: this should be a handlerResolver object or something ...
				(getHandler.indexOf('?') == -1) ? getHandler += '?' :  getHandler += '&';
				getHandler += 'StartRecordIndex=' + low + '&start=' + low + '&PageSize=' + (high - low + 1) + '&SortColumn=' + (this.sortColumn || '') + '&SortDirection=' + this.sortDir + '&TableId=' + this.id + '&uid=' + (new Date().getTime());
*/
				// Return the result from the getRequest as it may be synchronous if no callback is specified.
				return this.getFromServer(firstRow, lastRow, low, high, context, callback, errorCallback);
//			}
		}
		else
		{
			this.getFromCache(start, pageSize, context, callback, errorCallback);
		}
	}


/**
 * Gets data from the server-side data via Eba.Calback.
 */
nitobi.data.DataTable.prototype.getFromServer = function(firstRow, lastRow, low, high, context, callback, errorCallback)
{
	ntbAssert(this.getHandler!=null&&typeof(this.getHandler)!="undefined","getHandler not defined in table eba.datasource",EBA_THROW);

	this.requestCache.insert(low,high);

	var pageSize = (lastRow == null ? null : (high - low + 1));
	var strPageSize = (pageSize == null ? "" : pageSize);
	var getHandler = this.getGetHandler();
	//	TODO: this should be a handlerResolver object or something ...
	(getHandler.indexOf('?') == -1) ? getHandler += '?' :  getHandler += '&';
	getHandler += 'StartRecordIndex=' + low + '&start=' + low + '&PageSize=' + (strPageSize) + '&SortColumn=' + (this.sortColumn || '') + '&SortDirection=' + this.sortDir + '&uid=' + (new Date().getTime());
	var ajaxCallback = this.ajaxCallbackPool.reserve();
	
	ntbAssert(Boolean(ajaxCallback),"The datasource is serving too many connections. Please try again later. # current connections: " + this.ajaxCallbackPool.inUse.length );
	ajaxCallback.handler = getHandler;
	ajaxCallback.responseType = "xml";
	ajaxCallback.context = this;
	ajaxCallback.completeCallback = nitobi.lang.close(this,this.getComplete);
	//ajaxCallback.onGetComplete.subscribeOnce(this.getComplete, this);
	ajaxCallback.async = this.async;
	ajaxCallback.params = new nitobi.data.GetCompleteEventArgs(firstRow, lastRow, low, pageSize, ajaxCallback, this, context, callback);
	
	return ajaxCallback.get();
}
	/**
	 * Gets data from the cached (client-side) data
	 */
nitobi.data.DataTable.prototype.getFromCache = function(start, pageSize, context, callback, errorCallback)
{

	//	The only reason that we would be here is if the data is already in the DataSource - that is a good thing!
		//	first this is to check what part of the data we don't already have ...
	var firstRow = start, lastRow = start + pageSize - 1;
	if (firstRow>0 || lastRow>0) 
	{
		// If this was an asynchronous request then call the callback
		if (typeof(callback) == 'function')
		{
			var evtArgs = new nitobi.data.GetCompleteEventArgs(firstRow, lastRow, firstRow, lastRow-firstRow+1,null, this, context, callback);
			evtArgs.callback.call(evtArgs.context, evtArgs);
		}
	}
}
	/*
	 * Merges a properly formatted XMLDocument into the datasource.
	 * @param {XMLDocument} xmlDoc The XMLDocument to merge with the datasource.  The document will include row indexes for each element.
	 */
nitobi.data.DataTable.prototype.mergeFromXml = function(xmlDoc, callback)
	{
		var startRowIndex = Number(xmlDoc.documentElement.firstChild.getAttribute("xi")); 
		var endRowIndex = Number(xmlDoc.documentElement.lastChild.getAttribute("xi"));

		var cacheGaps = this.dataCache.gaps(startRowIndex, endRowIndex);

		// If we are working in local mode there is no going back to the server so just
		// insert the range into the dataCache
		if (this.mode == "local" && cacheGaps.length == 1)
		{
//			this.beginBatchInsert();
//			for (var rowIndex=cacheGaps[0].low; rowIndex<=cacheGaps[0].high; rowIndex ++)
//			{
//				this.createRecord(null, rowIndex);
//			}
			this.dataCache.insert(cacheGaps[0].low, cacheGaps[0].high);
			this.mergeFromXmlGetComplete(xmlDoc, callback, startRowIndex, endRowIndex);
			this.batchInsertRowCount = (cacheGaps[0].high - cacheGaps[0].low + 1);
			this.commitBatchInsert();
			return;
		}

		if (cacheGaps.length == 0)
			// There are no gaps in the data do just merge it
			this.mergeFromXmlGetComplete(xmlDoc, callback, startRowIndex, endRowIndex);
		else if (cacheGaps.length == 1)
			// There is a gap
			this.get(cacheGaps[0].low, cacheGaps[0].high-cacheGaps[0].low+1, this, nitobi.lang.close(this, this.mergeFromXmlGetComplete, [xmlDoc, callback, startRowIndex, endRowIndex]));
		else
			// There is no data in the paste range
			this.forceGet(startRowIndex, endRowIndex, this, nitobi.lang.close(this, this.mergeFromXmlGetComplete, [xmlDoc, callback, startRowIndex, endRowIndex]));
	}
	/**
	 * @private
	 */
nitobi.data.DataTable.prototype.mergeFromXmlGetComplete = function(xmlDoc, callback, startRowIndex, endRowIndex)
	{
		var newDataNode = nitobi.xml.createElement(this.xmlDoc, "newdata");
		newDataNode.appendChild(xmlDoc.documentElement.cloneNode(true));

		this.xmlDoc.documentElement.appendChild(nitobi.xml.importNode(this.xmlDoc, newDataNode, true));

		//	set the parameters for doing the merge of the data
		nitobi.data.mergeEbaXmlXslProc.addParameter('startRowIndex',startRowIndex,'');
		nitobi.data.mergeEbaXmlXslProc.addParameter('endRowIndex',endRowIndex,'');
		nitobi.data.mergeEbaXmlXslProc.addParameter('guid',nitobi.component.getUniqueId(),'');
console.log(this.uid + ' mergeFromXmlGetComplete');
		this.xmlDoc = nitobi.xml.loadXml(this.xmlDoc, nitobi.xml.transformToString(this.xmlDoc, nitobi.data.mergeEbaXmlXslProc,"xml"));
		
		newDataNode = nitobi.xml.createElement(this.log, "newdata");

		this.log.documentElement.appendChild(nitobi.xml.importNode(this.log, newDataNode, true));

		newDataNode.appendChild(this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'newdata').firstChild.cloneNode(true));

		this.log = nitobi.xml.loadXml(this.log, nitobi.xml.transformToString(this.log, nitobi.data.mergeEbaXmlToLogXslProc,"xml"));

		this.xmlDoc.documentElement.removeChild(this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'newdata'));
		this.log.documentElement.removeChild(this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'newdata'));

		callback.call();
	}
	
nitobi.data.DataTable.prototype.fillColumn = function(columnName, value)
	{
		
		nitobi.data.fillColumnXslProc.addParameter('column', this.fieldMap[columnName].substring(1));
		nitobi.data.fillColumnXslProc.addParameter('value', value);
		this.xmlDoc.loadXML(nitobi.xml.transformToString(this.xmlDoc, nitobi.data.fillColumnXslProc, "xml"));
		
		var startTime = parseFloat((new Date()).getTime());
		var newDataNode = nitobi.xml.createElement(this.log, "newdata");

		this.log.documentElement.appendChild(nitobi.xml.importNode(this.log, newDataNode, true));
		
		newDataNode.appendChild(this.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'data').cloneNode(true));

		nitobi.data.mergeEbaXmlToLogXslProc.addParameter('defaultAction','u');
		this.log.loadXML(nitobi.xml.transformToString(this.log, nitobi.data.mergeEbaXmlToLogXslProc,"xml"));
		nitobi.data.mergeEbaXmlToLogXslProc.addParameter('defaultAction','');

		this.log.documentElement.removeChild(this.log.selectSingleNode('//'+nitobi.xml.nsPrefix+'newdata'));
	}
	
/**
 * Returns the total number of rows in the remote datasource that this DataTable corresponds to.
 * @type Number
 */
nitobi.data.DataTable.prototype.getTotalRowCount = function()
{
	return this.totalRowCount;
}

nitobi.data.DataTable.prototype.setHandlerError = function(error)
	{
		this.handlerError = error;
	}
nitobi.data.DataTable.prototype.getHandlerError = function()
	{
		return this.handlerError;
	}
	
nitobi.data.DataTable.prototype.dispose= function()  {

		this.sortXslProc = null;

		this.requestQueue = null;
		this.fieldMap = null;
}

/**
 * @private
 */	
nitobi.data.DataTable.prototype.fire= function(evt,args)  {
	return nitobi.event.notify(evt+this.uid,args);
}
/**
 * @private
 */	
nitobi.data.DataTable.prototype.subscribe= function(evt,func,context)  {
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
}