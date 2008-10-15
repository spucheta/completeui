/**
 * Creates a non paging Grid.
 * @class A subclass of nitobi.grid.Grid that renders all the data at once, without any paging mechanism.
 * Fixed-height scrollable grid without paging 
 * <p>
 * <b>Fixed Size</b><br/> 
 * 	Height of grid specified explicitly.<br/> 
 * 	Vertical scrollbar allows user to scroll through rendered rows.  
 * 	If there are not enough rows to fill the grid, a blank area will be present, 
 *  the grid will not shrink.
 * </p>
 * <p> 
 * <b>Client-side Data</b><br/> 
 * 	Data in the client-side datasource constitutes all the available records.  
 * 	The grid renders all records present in the client-side datasource that match the specified filter 
 *  criteria.
 * 	Sorting is performed client-side.<br/>
 * 	All grid rows are rendered in a single render operation.<br/>
 * 	Data is loaded once.<br/> 
 * 	Allows for static client-side XML and loadXML().<br/>
 * </p>
 * <p>
 * <b>No Paging</b><br/> 
 * 	Paging operations have no effect 
 * </p>
 * @constructor
 * @param {String} uid The unique ID of the Grid.
 * @extends nitobi.grid.Grid
 */
nitobi.grid.GridNonpaging = function(uid) {
	nitobi.grid.GridNonpaging.baseConstructor.call(this);
	this.mode="nonpaging";
//	this.PagingMode="none";	//0 - None | 1 - Paging | 2 - LiveScrolling
	this.setPagingMode(nitobi.grid.PAGINGMODE_NONE);
//	this.DataMode="local";		//0 - Local | 1 - Remote | 2 - Caching
// TODO: ensure that properties with setters are using the setters
	this.setDataMode(nitobi.data.DATAMODE_LOCAL);		//0 - Unbound | 1 - Static | 2 - Paging | 3 - Caching
}
nitobi.lang.extend(nitobi.grid.GridNonpaging, nitobi.grid.Grid);

/**
 * @private
 */
nitobi.grid.GridNonpaging.prototype.createChildren=function() {
	var args = arguments;
	nitobi.grid.GridNonpaging.base.createChildren.call(this,args);
	nitobi.grid.GridNonpaging.base.createToolbars.call(this,nitobi.ui.Toolbars.VisibleToolbars.STANDARD);	
}

//get all data if getHandler specified (no paging stuff)
/**
 * @private
 */
nitobi.grid.GridNonpaging.prototype.bind=function() 
{
	nitobi.grid.GridStandard.base.bind.call(this);
	
	if (this.getGetHandler()!='') 
	{
		this.ensureConnected();
		this.datatable.get(0, null, this, this.getComplete);
	} else 
	{
		// TODO: if we have created the datasource and loaded it with data BEFORE connecting to it
		// the rowcount changed events etc will not have propagated to the Grid and so we will
		// have an incorrect row count.
		this.finalizeRowCount(this.datatable.getRemoteRowCount());
		this.bindComplete();
	}
}
/**
 * @private
 */
nitobi.grid.GridNonpaging.prototype.getComplete=function(evtArgs)
{
  	nitobi.grid.GridNonpaging.base.getComplete.call(this, evtArgs);

	// TODO: This is not needed since the connected datatable will fire all the
	// right events on the Grid when it gets the data back.
	this.finalizeRowCount(evtArgs.numRowsReturned);

	// TODO: This is not needed since the connected datatable will fire all the
	// right events on the Grid when it gets the data back.
	this.defineColumnsFinalize();

  	this.bindComplete();
}

/**
 * @private
 */
nitobi.grid.GridNonpaging.prototype.renderMiddle= function()
{
	nitobi.grid.GridNonpaging.base.renderMiddle.call(this,arguments);
	var startRow = this.getfreezetop();
	endRow = this.getRowCount();
	this.Scroller.view.midcenter.renderGap(startRow, endRow, false);
}

/*
nitobi.grid.GridNonpaging.prototype.handleKey = function()
{
}
*/