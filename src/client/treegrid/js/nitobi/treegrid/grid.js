nitobi.lang.defineNs("nitobi.grid");

/**
 * @ignore
 */
nitobi.grid.MODE_STANDARDPAGING = 'standard';
/**
 * @ignore
 */
nitobi.grid.MODE_LOCALSTANDARDPAGING = 'localstandard';
/**
 * @ignore
 */
nitobi.grid.MODE_LIVESCROLLING = 'livescrolling';
/**
 * @ignore
 */
nitobi.grid.MODE_LOCALLIVESCROLLING = 'locallivescrolling';
/**
 * @ignore
 */
nitobi.grid.MODE_NONPAGING = 'nonpaging';
/**
 * @ignore
 */
nitobi.grid.MODE_LOCALNONPAGING = 'localnonpaging';
/**
 * @ignore
 */
nitobi.grid.MODE_SMARTPAGING = 'smartpaging';
/**
 * @ignore
 */
nitobi.grid.MODE_PAGEDLIVESCROLLING = 'pagedlivescrolling';
/**
 * @ignore
 */
nitobi.grid.RENDERMODE_ONDEMAND = 'ondemand';



nitobi.lang.defineNs("nitobi.TreeGridFactory")

/**
 * @ignore
 * @private
 */
nitobi.TreeGridFactory.createGrid = function(sMode,dContainer,element)
{
	var sPagingMode = '';
	var sDataMode = '';
	var sRenderMode = '';

	element = nitobi.html.getElement(element);
	// First check if w have either an element or a declaration to instantiate from.
	if (element != null)
	{
		xDeclaration = nitobi.grid.Declaration.parse(element);
		sMode = xDeclaration.grid.documentElement.getAttribute('mode');

		var bGetHandler = nitobi.TreeGridFactory.isGetHandler(xDeclaration);
		var bDatasourceId = nitobi.TreeGridFactory.isDatasourceId(xDeclaration);
		var bHitOnce = false;

		if (sMode == nitobi.grid.MODE_LOCALLIVESCROLLING)
		{
			ntbAssert(bDatasourceId || bGetHandler,'To use local LiveScrolling mode a DatasourceId must also be specified.','',EBA_THROW);

			sPagingMode = nitobi.grid.PAGINGMODE_LIVESCROLLING;
			sDataMode = nitobi.data.DATAMODE_LOCAL;
		}
		else if (sMode == nitobi.grid.MODE_LIVESCROLLING)
		{			
			ntbAssert(bGetHandler,'To use LiveScrolling mode a GetHandler must also be specified.','',EBA_THROW);

			sPagingMode = nitobi.grid.PAGINGMODE_LIVESCROLLING;
			sDataMode = nitobi.data.DATAMODE_CACHING;
		}
		else if (sMode == nitobi.grid.MODE_NONPAGING)
		{
			ntbAssert(bGetHandler,'To use NonPaging mode a GetHandler must also be specified.','',EBA_THROW);

			bHitOnce = true;

			sPagingMode = nitobi.grid.PAGINGMODE_NONE;
			// Although we are using remote non-paging we set the datamode to be local.
			// TODO: This mode needs to be looked at - we have an off-by-one problem with the last row.
			sDataMode = nitobi.data.DATAMODE_LOCAL;
		}
		else if (sMode == nitobi.grid.MODE_LOCALNONPAGING)
		{
			ntbAssert(bDatasourceId,'To use local LiveScrolling mode a DatasourceId must also be specified.','',EBA_THROW);

			sPagingMode = nitobi.grid.PAGINGMODE_NONE;
			sDataMode = nitobi.data.DATAMODE_LOCAL;
		}
		else if (sMode == nitobi.grid.MODE_LOCALSTANDARDPAGING)
		{
			sPagingMode = nitobi.grid.PAGINGMODE_STANDARD;
			sDataMode = nitobi.data.DATAMODE_LOCAL;
		}
		else if (sMode == nitobi.grid.MODE_STANDARDPAGING)
		{
			sPagingMode = nitobi.grid.PAGINGMODE_STANDARD;
			sDataMode = nitobi.data.DATAMODE_PAGING;
		}
		else if (sMode == nitobi.grid.MODE_PAGEDLIVESCROLLING)
		{
			sPagingMode = nitobi.grid.PAGINGMODE_STANDARD;
			sDataMode = nitobi.data.DATAMODE_PAGING;
			sRenderMode = nitobi.grid.RENDERMODE_ONDEMAND;
		}
		else
		{
			//ntbAssert(false,'No mode found for your Grid.','',EBA_WARN);
		}
	}

	var id = element.getAttribute("id");

	sMode = (sMode || nitobi.grid.MODE_STANDARDPAGING).toLowerCase();
	var grid = null;
	if (sMode == nitobi.grid.MODE_LOCALSTANDARDPAGING) {
		grid = new nitobi.grid.GridLocalPage(id);
	}
	else if (sMode == nitobi.grid.MODE_LIVESCROLLING) {
		grid = new nitobi.grid.GridLiveScrolling(id);
	}
	else if (sMode == nitobi.grid.MODE_LOCALLIVESCROLLING) {
		grid = new nitobi.grid.GridLiveScrolling(id);
	}
	else if (sMode == nitobi.grid.MODE_NONPAGING || sMode == nitobi.grid.MODE_LOCALNONPAGING) {
		grid = new nitobi.grid.GridNonpaging(id);
	}
	else if (sMode == nitobi.grid.MODE_STANDARDPAGING || sMode == nitobi.grid.MODE_PAGEDLIVESCROLLING) {
		grid = new nitobi.grid.GridStandard(id);
	}

//nitobi.debug.PerfMon.registerAll(grid);

	grid.setDeclaration(xDeclaration);
	grid.configureDefaults();
	grid.setPagingMode(sPagingMode);
	grid.setDataMode(sDataMode);
	grid.setRenderMode(sRenderMode);
	nitobi.TreeGridFactory.processDeclaration(grid, element, xDeclaration);

	element.jsObject = grid;
	return grid;
}

/**
 * @ignore
 * @private
 */
nitobi.TreeGridFactory.processDeclaration = function(grid, element, xDeclaration)
{	
	if (xDeclaration != null)
	{
		if (typeof(xDeclaration.inlinehtml) == "undefined")
		{
			var inlinehtmlElement = document.createElement("ntb:inlinehtml");
			// TODO: Convert to this.getUniqueId();
			inlinehtmlElement.setAttribute("parentid", "grid"+grid.uid);
			nitobi.html.insertAdjacentElement(element,"beforeEnd", inlinehtmlElement);
			grid.Declaration.inlinehtml = inlinehtmlElement;
		}

		// First thing is to create a new dataset for the grid
		// iff there is not one already defined with tables.
		if (this.data == null || this.data.tables == null || this.data.tables.length == 0)
		{
			var oDataSet = new nitobi.data.DataSet();
			oDataSet.initialize();
			grid.connectToDataSet(oDataSet);
		}
		
		var columnsElements = grid.Declaration.columndefinitions || grid.Declaration.columns || [];
		var rootColumnsId = grid.getRootColumns();

		// TODO: FIX THIS ONCE EVERYTHING ELSE IS WORKING - AFTER WE INITIALIZE FROM THE DECLARATION
		// WE SHOULD THERE MAY BE NO COLUMNS AND THEREFORE WE NEED TO ADD BACK THE DEFAULT COLUMNS ELEMENT
		var defaultCols = grid.model.selectSingleNode("//ntb:columns");
		if (defaultCols != null)
			defaultCols.parentNode.removeChild(defaultCols);

		var len = columnsElements.length;
		//for (var id in columnsElements)
		for (var i = 0; i < len; i++)
		{
			var columnDefinitions = columnsElements[i];
			var id = columnDefinitions.documentElement.getAttribute("id");
			// Define the grid columns based on the declaration - if there are columns in the declaration
			// This will set all default values in the model and moved values from the declaration to the model.
			// Don't use this if the columns tag is empty.
			if (typeof(columnDefinitions) != "undefined" && columnDefinitions != null)
			{
				grid.defineColumns(columnDefinitions.documentElement, ((id == rootColumnsId) || columnsElements.length == 1?true:false));
			}
		}

		// Attaches the grid to the inlinehtml element inside the grid element.
		// This causes the initalize method to be fired.
		//grid.attachToParentDomElement(grid.Declaration.inlinehtml);
	
		nitobi.grid.Declaration.loadDataSources(xDeclaration, grid);

		grid.attachToParentDomElement(grid.Declaration.inlinehtml);

		var sDataMode = grid.getDataMode();
		var sDatasourceId = grid.getDatasourceId();
		var sGetHandler = grid.getGetHandler();

		// is this done in ensureConnected???
		if (sDatasourceId != null && sDatasourceId != '')
		{
			// This means we have a local grid ... 
			// A local grid could be paging, caching or nonpaging ...
			// This way, we can initialize the data in the grid to our local data
			// We take advantage of the caching stuff rather than doing anything wacky.
			grid.connectToTable(grid.data.getTable(sDatasourceId));
			// If we have local data, we can't rely on the 'totalrowcount' to be
			// set in getComplete because we don't issue a get
			// TODO: Should be a better way for this...
			grid.scroller.surface.setRowCount(grid.data.getTable(sDatasourceId).getRemoteRowCount());
		}
		else
		{
			grid.ensureConnected();
			
			// If this is livescrolling, and we have rows in the decl, put them in the datasource.
			if (grid.mode.toLowerCase() == nitobi.grid.MODE_LIVESCROLLING && xDeclaration != null && xDeclaration.datasources != null)
			{
				var numRows = xDeclaration.datasources.selectNodes("//ntb:datasource[@id='_default']/ntb:data/ntb:e").length;
				if (numRows > 0)
				{
					var table = grid.data.getTable("_default");
					table.initializeXmlData(xDeclaration.grid.xml);
					table.initializeXml(xDeclaration.grid.xml);
					// TODO: This is a little hack to make this work. Needs to factored into the datatable.
					table.descriptor.leap(0,numRows*2);
					table.syncRowCount();
				}
			}
		}

		window.setTimeout(function(){grid.bind()},50);
	}
}

/**
 * @ignore
 * @private
 */
nitobi.TreeGridFactory.isLocal = function (xDeclaration)
{
	var sDatasourceId = xDeclaration.grid.documentElement.getAttribute('datasourceid');
	var sGetHandler = xDeclaration.grid.documentElement.getAttribute('gethandler');

	if (sGetHandler != null && sGetHandler != '')
	{
		return false;
	}
	else if (sDatasourceId != null && sDatasourceId != '')
	{
		return true;
	}
	else
	{
		throw('Non-paging grid requires either a gethandler or a local datasourceid to be specified.');
	}
}

/**
 * @ignore
 * @private
 */
nitobi.TreeGridFactory.isGetHandler = function(xDeclaration)
{
	var sGetHandler = xDeclaration.grid.documentElement.getAttribute('gethandler');
	if (sGetHandler != null && sGetHandler != '')
		return true;
	return false;
}

/**
 * @ignore
 * @private
 */
nitobi.TreeGridFactory.isDatasourceId = function(xDeclaration)
{
	var sDatasourceId = xDeclaration.grid.documentElement.getAttribute('datasourceid');
	if (sDatasourceId != null && sDatasourceId != '')
		return true;
	return false;
}

/**
 * @ignore
 * @private
 */
nitobi.grid.hover = function(domNode,hover,rowHover)
{
	if (!rowHover) 
	{
		return;
	}
	//	TODO: this should be using the global methods in nitobi.grid.Cell to determing row, column and uid from a cell domNode
	// Determine panel
	var id = domNode.getAttribute("id");
	var tmpid = id.replace(/__/g,"||");
	var coord = tmpid.split("_");
	var row = coord[3];
	var uid = coord[5].replace(/\|\|/g,"__");

	// Cheezy way of doing this ... but should be fast...
	var leftCell = document.getElementById("cell_"+row+"_0_"+uid);
	var leftRowNode = leftCell.parentNode;
	var cellz = leftRowNode.childNodes[leftRowNode.childNodes.length-1];

	var id = cellz.getAttribute("id");
	var coord = id.split("_");
	var midCell = document.getElementById("cell_"+row+"_"+(Number(coord[4])+1)+"_"+uid);
	var midRowNode = null;
	if (midCell != null) {
		midRowNode = midCell.parentNode;
	}
	if (hover) {
		var rowHoverColor = nitobi.grid.RowHoverColor || 'white'
		leftRowNode.style.backgroundColor = rowHoverColor;
		if (midRowNode) {
			midRowNode.style.backgroundColor = rowHoverColor;
		}
	} else {
		leftRowNode.style.backgroundColor = '';
		if (midRowNode) {
			midRowNode.style.backgroundColor = '';
		}
	}
	if (hover) {
		nitobi.html.addClass(domNode,'ntb-cell-hover');//.style.backgroundColor = nitobi.grid.CellHoverColor || 'white';
	} else {
		nitobi.html.removeClass(domNode,'ntb-cell-hover');//.style.backgroundColor = '';
	}
}

/**
 * Initializes all Nitobi grids on the page. This should only be called after the page
 * has loaded fully, e.g., in body.onload. Returns an array of the initialized Grid objects.
 * @type {Array}
 */
nitobi.initTreeGrids = function()
{
	var gridObjects = [];
	var grids = document.getElementsByTagName(!nitobi.browser.IE?"ntb:treegrid":"treegrid");
	for (var i=0; i<grids.length;i++)
	{
		if (grids[i].jsObject == null) {
			grids[i].jsObject = nitobi.initTreeGrid(grids[i].id);
			gridObjects.push(grids[i].jsObject);
		}
	}
	return gridObjects;
}

/**
 * Initializes the Nitobi Grid on the page with the specified HTML element ID. This should only be called after the page
 * has loaded fully, e.g., in body.onload.
 * @param {String} id The ID of the DOM node that is the Grid declaration. It should look like &lt;ntb:grid id="myGrid" ... &gt;
 */
nitobi.initTreeGrid = function(id)
{
	var grid = nitobi.html.getElement(id);
	if (grid != null)
	{
		grid.jsObject = nitobi.TreeGridFactory.createGrid(null,null,grid);
	}
	return grid.jsObject;
}

/**
 * Initializes all Nitobi components on the page.  This should only be called after the page
 * has loaded fully, e.g., in body.onload.
 * @ignore
 */
nitobi.initComponents = function()
{
	nitobi.initGrids();
}


/**
 * Returns the JavaScript object for a Nitobi Grid component. For example, if you have a Grid declared on the page
 * with id=grid1, then calling nitobi.getGrid("grid1") would return the nitobi.grid.Grid object for that
 * grid HTML declaration.
 * @param {String} componentId The id of the component as declared in its tag.
 * @return Object Returns the object of the same type as the component declaration.
 */
nitobi.getGrid = function(sGridId)
{
	return document.getElementById(sGridId).jsObject;
}

nitobi.base.Registry.getInstance().register(
//		new nitobi.base.Profile("nitobi.Grid",null,false,"ntb:grid")
		new nitobi.base.Profile("nitobi.initTreeGrid",null,false,"ntb:treegrid")
);
