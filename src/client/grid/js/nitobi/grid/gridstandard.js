/**
 * @class A subclass of nitobi.grid.Grid that adds standard paging functionality.  
 * Fixed-height grid with remote paging that does not scroll
 * <p>
 * <b>Stretch</b><br/> 
 * 	Miniumum height of grid specified explicitly.<br/>
 * 	Maximum height of grid specified explicitly.<br/> 
 * 	Grid height stretches and shrinks to accomodate rows rendered.   
 * 	If there are not enough rows to fill the grid (based on min height), a blank area will be present.<br/> 
 * 	Vertical scrollbar appears once max height has been exceeded.
 * </p>
 * <p>
 * <b>Server-side and Client-Side Data</b><br/> 
 * 	Data in the client-side datasource is a subset of server-side datasource records.   
 * 	The grid renders all records present in the client-side datasource that match the 
 *  specified filter criteria.<br/>
 * 	Sorting is performed server-side - client-side data is purged 
 * </p>
 * <p>
 * <b>Server-side Paging</b><br/> 
 * 	Paging operations request data from the server.<br/>
 * 	Single page of rows is rendered for each paging request.<br/> 
 * 	Client-side data is purged before each paging request.<br/> 
 * 	Rendered rows are purged before each paging request. 
 * </p>
 * @constructor
 * @param {String} uid The unique ID of the Grid.
 * @extends nitobi.grid.Grid
 */
nitobi.grid.GridStandard = function(uid) {
	nitobi.grid.GridStandard.baseConstructor.call(this, uid);
	this.mode="standard";
//	this.PagingMode="standard";	//0 - None | 1 - Standard | 2 - LiveScrolling
	this.setPagingMode(nitobi.grid.PAGINGMODE_STANDARD);
//	this.DataMode="paging";		//0 - Unbound | 1 - Static | 2 - Paging | 3 - Caching
// TODO: ensure that properties with setters are using the setters
	this.setDataMode(nitobi.data.DATAMODE_PAGING);		//0 - Unbound | 1 - Static | 2 - Paging | 3 - Caching
}
nitobi.lang.extend(nitobi.grid.GridStandard, nitobi.grid.Grid);

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.createChildren=function() {
	var args = arguments;

	nitobi.grid.GridStandard.base.createChildren.call(this,args);

	nitobi.grid.GridStandard.base.createToolbars.call(this, nitobi.ui.Toolbars.VisibleToolbars.STANDARD | nitobi.ui.Toolbars.VisibleToolbars.PAGING);

	// Attach events
	this.toolbars.subscribe("NextPage",nitobi.lang.close(this,this.pageNext));
	this.toolbars.subscribe("PreviousPage",nitobi.lang.close(this,this.pagePrevious));
	this.subscribe("EndOfData",this.disableNextPage); 
	this.subscribe("TopOfData",this.disablePreviousPage);
	this.subscribe("NotTopOfData",this.enablePreviousPage); 
	this.subscribe("NotEndOfData",this.enableNextPage);
	this.subscribe("TableConnected", nitobi.lang.close(this, this.subscribeToRowCountReady));
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.connectToTable = function(table)
{
	if (nitobi.grid.GridStandard.base.connectToTable.call(this, table) != false)
	{
		this.datatable.subscribe("RowInserted",nitobi.lang.close(this,this.incrementDisplayedRowCount));
		this.datatable.subscribe("RowDeleted",nitobi.lang.close(this,this.decrementDisplayedRowCount));	
	}
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.incrementDisplayedRowCount = function(quantity)
{
	this.setDisplayedRowCount(this.getDisplayedRowCount()+(quantity||1));
	this.updateCellRanges();
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.decrementDisplayedRowCount = function(quantity)
{
	// TODO: Are these still used or not?
	this.setDisplayedRowCount(this.getDisplayedRowCount()-(quantity||1));
	this.updateCellRanges();
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.subscribeToRowCountReady = function()
{
	//this.datatable.subscribe("RowCountReady",nitobi.lang.close(this,this.updateDisplayedRowCount));
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.updateDisplayedRowCount = function(eventArgs)
{
	this.setDisplayedRowCount(eventArgs.numRowsReturned);
}

/**
 * Disables the page next button in the Grid toolbar.
 */
nitobi.grid.GridStandard.prototype.disableNextPage = function()
{
	this.disableButton("nextPage");
}

/**
 * Disables the page previous button in the Grid toolbar.
 */
nitobi.grid.GridStandard.prototype.disablePreviousPage = function()
{
	this.disableButton("previousPage");
}
/**
 * @private
 */
nitobi.grid.GridStandard.prototype.disableButton = function(button)
{
	var t = this.getToolbars().pagingToolbar;
	if (t != null)
		t.getUiElements()[button+this.toolbars.uid].disable();
}
/**
 * Enables the page next button in the Grid toolbar.
 */
nitobi.grid.GridStandard.prototype.enableNextPage = function()
{
	this.enableButton("nextPage");
}
/**
 * Enables the page previous button in the Grid toolbar.
 */
nitobi.grid.GridStandard.prototype.enablePreviousPage = function()
{
	this.enableButton("previousPage");
}
/**
 * @private
 */
nitobi.grid.GridStandard.prototype.enableButton = function(button)
{
	var t = this.getToolbars().pagingToolbar;
	if (t != null)
		t.getUiElements()[button+this.toolbars.uid].enable();
}

/**
 * Load the previous page of data.
 */
nitobi.grid.GridStandard.prototype.pagePrevious=function() {
	this.fire("BeforeLoadPreviousPage");
	this.loadDataPage(Math.max(this.getCurrentPageIndex()-1,0));
	this.fire("AfterLoadPreviousPage");
}

/**
 * Load the next page of data.
 */
nitobi.grid.GridStandard.prototype.pageNext=function() {
	this.fire("BeforeLoadNextPage");
	this.loadDataPage(this.getCurrentPageIndex()+1);
	this.fire("AfterLoadNextPage");
}

/**
 * Load a specific page of data.
 * @param {Number} newPageNumber The page to load.
 */
nitobi.grid.GridStandard.prototype.loadDataPage = function(newPageNumber) 
{
	// Clear the selection if there is one.
	this.fire('BeforeLoadDataPage');

	//	Check if the nePageNumber is greater than -1
	if (newPageNumber > -1) 
	{
		if (this.sortColumn)
		{
			if (this.datatable.sortColumn)
			{
				for (var i = 0; i < this.getColumnCount(); i++)
				{
					var colObj = this.getColumnObject(i);
					if (colObj.getColumnName() == this.datatable.sortColumn)
					{
						this.setSortStyle(i,this.datatable.sortDir);
						break;
					}
				}
			}
			else
			{
				this.setSortStyle(this.sortColumn.column, "", true);
			}
		}
		this.setCurrentPageIndex(newPageNumber);
		var	startRow = this.getCurrentPageIndex()*this.getRowsPerPage(); //freezeTop not supported in standard paging (cuz how would that work? what rows would be frozen?)
		var rows = this.getRowsPerPage()-this.getfreezetop();
//		var endRow = startRow+rows-1;
//		this.datatable.get(startRow, endRow, this, this.afterLoadDataPage);
		this.datatable.flush();
		this.datatable.get(startRow, rows, this, this.afterLoadDataPage);
	}
	// Resize the grid if necessary, show/hide scrollbars
	// Set focus to topleft cell
	this.fire('AfterLoadDataPage');
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.afterLoadDataPage=function(eventArgs) 
{
	this.setDisplayedRowCount(eventArgs.numRowsReturned);
	this.setRowCount(eventArgs.numRowsReturned)
	if(eventArgs.numRowsReturned != this.getRowsPerPage()) {
		this.fire("EndOfData");
	} else {
		this.fire("NotEndOfData");
	}
	if(this.getCurrentPageIndex() == 0) {
		this.fire("TopOfData");
	} else {
		this.fire("NotTopOfData");
	}
	this.clearSurfaces();
	this.updateCellRanges();
	this.scrollVertical(0);

//	this.Scroller.render();

// There is no need to explicitly call render here as the render is taken care of by the scroller...
//	this.Scroller.view.midleft.renderGap(startRow, endRow, false);
//	this.Scroller.view.midcenter.renderGap(startRow, endRow, false);
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.bind=function() 
{
	nitobi.grid.GridStandard.base.bind.call(this);	

	// TODO: What is all this pre-bind stuff? Is there any other pre-bind stuff.
	this.setCurrentPageIndex(0);
	this.disablePreviousPage();
	this.enableNextPage();
	this.ensureConnected();

	this.datatable.get(0, this.getRowsPerPage(), this, this.getComplete);
	
}

/**
 * @private
 */
nitobi.grid.GridStandard.prototype.getComplete=function(evtArgs)
{
//	this.setDisplayedRowCount(evtArgs.numRowsReturned);
//	if(evtArgs.numRowsReturned != this.getRowsPerPage()) {
//		this.fire("EndOfData");
//	} else {
//		this.fire("NotEndOfData");
//	}
//	if(evtArgs.startXi == 0) {
//		this.fire("TopOfData");
//	} else {
//		this.fire("NotTopOfData");
//	}
//	this.updateCellRanges();



	this.afterLoadDataPage(evtArgs);
	nitobi.grid.GridStandard.base.getComplete.call(this, evtArgs);

	// TODO: This is not needed since the connected datatable will fire all the
	// right events on the Grid when it gets the data back.
	this.defineColumnsFinalize();
	
  	this.bindComplete();
}

//PageUp-PageDown Keys
/**
 * @private
 */
nitobi.grid.GridStandard.prototype.renderMiddle= function()
{
	nitobi.grid.GridStandard.base.renderMiddle.call(this,arguments);
	var startRow = this.getfreezetop();
	endRow = this.getRowsPerPage()-1;
	this.Scroller.view.midcenter.renderGap(startRow, endRow, false);
}
  
