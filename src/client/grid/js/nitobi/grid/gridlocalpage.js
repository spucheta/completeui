/**
 * Creates a local paging Grid.
 * @class A subclass of nitobi.grid.Grid that uses local data and adds standard paging functionality. 
 * Fixed-height grid that does not scroll that pages through client-side data.
 * <p>
 * This paging mode would be used when you want to load all data at once from the server but you 
 * don't want to show all rows at once and you do not want to go back to the server for paging 
 * operations. 
 * </p>
 * <p>
 * <b>Stretch</b><br/>
 * 	Miniumum height of grid specified explicitly.<br/>
 * 	Maximum height of grid specified explicitly.<br/> 
 * 	Grid height stretches and shrinks to accomodate rows rendered.  
 * 	If there are not enough rows to fill the grid (based on min height), a blank area will be present 
 * 	Vertical scrollbar appears once max height has been exceeded.<br/>
 * </p>
 * <p>
 * <b>Client-side Data</b><br/>
 * 	Data in the client-side datasource constitutes all the available records.  
 * 	The grid renders a single page of data present in the client-side datasource that match the 
 *  specified filter criteria.<br/>
 * 	Sorting is performed client-side.<br/>
 * 	Grid rows are rendered in multiple render operations (with each paging operation).<br/>
 * 	Data is loaded once.<br/> 
 * 	Allows for static client-side XML and loadXML() 
 * </p>
 * <p>
 * <b>Client-side Paging</b><br/>
 * 	Paging operations DO NOT request data from server.<br/>
 * 	Client-side data is kept across paging requests.<br/> 
 * 	Rendered rows are purged before each paging request.<br/> 
 * </p>
 * @constructor
 * @param {String} uid The unique ID of the Grid.
 * @extends nitobi.grid.Grid
 */
nitobi.grid.GridLocalPage = function(uid) {
	nitobi.grid.GridLocalPage.baseConstructor.call(this, uid);
	this.mode="localpaging";
//	this.PagingMode="standard";	//0 - None | 1 - Standard | 2 - LiveScrolling
	this.setPagingMode(nitobi.grid.PAGINGMODE_STANDARD);
//	this.DataMode="local";		//0 - Local | 1 - Remote | 2 - Caching
// TODO: ensure that properties with setters are using the setters
	this.setDataMode('local');		//0 - Local | 1 - Remote | 2 - Caching
}
nitobi.lang.extend(nitobi.grid.GridLocalPage, nitobi.grid.Grid);

/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.createChildren=function() {
	var args = arguments;

	nitobi.grid.GridLocalPage.base.createChildren.call(this,args);

	// Enable paging toolbar
	
	// This should be done only if there is a toolbar
	nitobi.grid.GridLiveScrolling.base.createToolbars.call(this,nitobi.ui.Toolbars.VisibleToolbars.STANDARD | nitobi.ui.Toolbars.VisibleToolbars.PAGING);
	// Attach events
	this.toolbars.subscribe("NextPage",nitobi.lang.close(this,this.pageNext));
	this.toolbars.subscribe("PreviousPage",nitobi.lang.close(this,this.pagePrevious));
	this.subscribe("EndOfData",function(pct){this.toolbars.pagingToolbar.getUiElements()["nextPage"+this.toolbars.uid].disable();}); 
	this.subscribe("TopOfData",function(pct){this.toolbars.pagingToolbar.getUiElements()["previousPage"+this.toolbars.uid].disable();}); 
	this.subscribe("NotTopOfData",function(pct){this.toolbars.pagingToolbar.getUiElements()["previousPage"+this.toolbars.uid].enable();}); 
	this.subscribe("NotEndOfData",function(pct){this.toolbars.pagingToolbar.getUiElements()["nextPage"+this.toolbars.uid].enable();}); 
}

/**
 * Go to the previous page
 */
nitobi.grid.GridLocalPage.prototype.pagePrevious=function() {
	this.fire("BeforeLoadPreviousPage");
	this.loadDataPage(Math.max(this.getCurrentPageIndex()-1,0));
	this.fire("AfterLoadPreviousPage");
}

/**
 * Go to the next page.
 */
nitobi.grid.GridLocalPage.prototype.pageNext=function() {
	this.fire("BeforeLoadNextPage");
	this.loadDataPage(this.getCurrentPageIndex()+1);
	this.fire("AfterLoadNextPage");
}

/**
 * Load a particular page.
 * @param {Number} newPageNumber The page number to load.
 */
nitobi.grid.GridLocalPage.prototype.loadDataPage = function(newPageNumber) 
{
	// Clear the selection if there is one.
	this.fire('BeforeLoadDataPage');

	//	Check if the newPageNumber is greater than -1
	if (newPageNumber > -1) 
	{
		this.setCurrentPageIndex(newPageNumber);
		this.setDisplayedRowCount(this.getRowsPerPage());

		var	startRow = this.getCurrentPageIndex()*this.getRowsPerPage(); //freezeTop not supported in standard paging (cuz how would that work? what rows would be frozen?)
		var rows = this.getRowsPerPage()-this.getfreezetop();
		this.setDisplayedRowCount(rows);
//		The -1 part causes EndOfData not to fire when we have pagesize = 20 and exactly 40 rows
//		var endRow = startRow+rows-1;
		var endRow = startRow+rows;
		if(endRow>=this.getRowCount()) {
			this.fire("EndOfData");
		} else {
			this.fire("NotEndOfData");
		}
		if(startRow==0) {
			this.fire("TopOfData");
		} else {
			this.fire("NotTopOfData");
		}
		this.clearSurfaces();
		this.updateCellRanges();
		this.scrollVertical(0);

//		this.Scroller.view.midcenter.renderGap(startRow, endRow, false);
		
	}

	// Resize the grid if necessary, show/hide scrollbars
	// Set focus to topleft cell
	this.fire('AfterLoadDataPage');
}

// PAGING MEMBERS
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.setRowsPerPage=function(rows) {
	// 
	this.setDisplayedRowCount(this.getRowsPerPage());
	this.data.table.pageSize = this.getRowsPerPage();
}
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.pageStartIndexChanges=function() {
	// Clear surfaces
	// Get page of xml (based on current sort and filter criteria)
	// Re-render data
}	
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.hitFirstPage=function() {
	this.fire("FirstPage");
}
/**
 * @private
 */	
nitobi.grid.GridLocalPage.prototype.hitLastPage=function() {
	this.fire("LastPage");
}
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.bind=function() 
{
	nitobi.grid.GridLocalPage.base.bind.call(this);

	// TODO: if we have created the datasource and loaded it with data BEFORE connecting to it
	// the rowcount changed events etc will not have propagated to the Grid and so we will
	// have an incorrect row count.
	this.finalizeRowCount(this.datatable.getRemoteRowCount());
	this.bindComplete();
}

//PageUp-PageDown Keys
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.pageUpKey=function() {
	this.pagePrevious();
}
/**
 * @private
 */
nitobi.grid.GridLocalPage.prototype.pageDownKey=function() {
	this.pageNext();
}


    nitobi.grid.GridLocalPage.prototype.renderMiddle= function()
    {
		nitobi.grid.GridLocalPage.base.renderMiddle.call(this,arguments);
		var startRow = this.getfreezetop();
		endRow = this.getRowsPerPage()-1;
		this.Scroller.view.midcenter.renderGap(startRow, endRow, false);
    }
  
