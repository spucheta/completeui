EBAScroller_RENDERTIMEOUT=100;
EBAScroller_VIEWPANES = new Array("topleft","topcenter","midleft","midcenter");

/**
 * @class nitobi.grid.Scroller3x3
 * @constructor
 * @private
 */
nitobi.grid.Scroller3x3 = function(owner,height,rows,columns,freezetop,freezeleft) {
	this.disposal = [];
	this.height = height;
	this.rows = rows;
	this.columns = columns;
	this.freezetop = freezetop;
	this.freezeleft = freezeleft;
	this.lastScrollTop = -1;

	this.uid = nitobi.base.getUid();

	this.onRenderComplete = new nitobi.base.Event();
	this.onRangeUpdate = new nitobi.base.Event();
	this.onHtmlReady = new nitobi.base.Event();

	this.owner = owner;

	var VP = nitobi.grid.Viewport;
	this.view = { topleft:		new VP(this.owner,0),
				  topcenter:	new VP(this.owner,1),
				  midleft:		new VP(this.owner,3),
				  midcenter:	new VP(this.owner,4)}

	this.view.midleft.onHtmlReady.subscribe(this.handleHtmlReady, this);

	this.setCellRanges();

	//	This is a DOM node that represents the main scrolling surface
	//	It is set in MapToHTML ...
	this.scrollSurface = null;
	
	//	startRow is the first row of the live scrolling section.
	this.startRow = freezetop;

	this.headerHeight = 23;
	this.rowHeight = 23;

	this.lastTimeoutId = 0;
	this.scrollTopPercent = 0;

	this.dataTable = null;

	this.cacheMap = new nitobi.collections.CacheMap(-1,-1);
	// Attach to Viewport events

}
/**
 * Reponds to changes in the recordset size by resizing the grid surface
 */
nitobi.grid.Scroller3x3.prototype.updateCellRanges= function(cols,rows,frzL,frzT) {
	this.columns = cols;
	this.rows = rows;
	this.freezetop = frzT;
	this.freezeleft = frzL;
	this.setCellRanges();
}
nitobi.grid.Scroller3x3.prototype.setCellRanges= function() {
	var pageSize = null;
	if (this.implementsStandardPaging())
	{
		// TODO: Schenker grid uses getRowsPerPage() here ...
		// pageSize = this.getRowsPerPage();
		pageSize = this.getDisplayedRowCount();
	}
	this.view.topleft.setCellRanges(0,this.freezetop,0,this.freezeleft);
	this.view.topcenter.setCellRanges(0,this.freezetop,this.freezeleft,this.columns-this.freezeleft);

	this.view.midleft.setCellRanges(this.freezetop, (pageSize?pageSize:this.rows)-this.freezetop, 0, this.freezeleft);
	this.view.midcenter.setCellRanges(this.freezetop, (pageSize?pageSize:this.rows)-this.freezetop, this.freezeleft, this.columns-this.freezeleft);
}
nitobi.grid.Scroller3x3.prototype.resize=function(height) {
	this.height = height;
}
nitobi.grid.Scroller3x3.prototype.setScrollLeftRelative=function(offset) {
	this.setScrollLeft(this.scrollLeft+offset);
}
nitobi.grid.Scroller3x3.prototype.setScrollLeftPercent=function(scrollPercent) {
	this.setScrollLeft(Math.round((this.view.midcenter.element.scrollWidth-this.view.midcenter.element.clientWidth) * scrollPercent));
}
nitobi.grid.Scroller3x3.prototype.setScrollLeft=function(scrollLeft) {
	this.view.midcenter.element.scrollLeft = scrollLeft;
	this.view.topcenter.element.scrollLeft = scrollLeft;
}
nitobi.grid.Scroller3x3.prototype.getScrollLeft=function() {
	return this.scrollSurface.scrollLeft;
}
nitobi.grid.Scroller3x3.prototype.setScrollTopRelative=function(offset) {
	this.setScrollTop(this.getScrollTop()+offset);
}
nitobi.grid.Scroller3x3.prototype.setScrollTopPercent=function(scrollPercent) {
	ntbAssert(!isNaN(scrollPercent),"scrollPercent isNaN");
	this.setScrollTop(Math.round((this.view.midcenter.element.scrollHeight-this.view.midcenter.element.clientHeight) * scrollPercent));
}
nitobi.grid.Scroller3x3.prototype.getScrollTopPercent = function(){
	return this.scrollSurface.scrollTop / (this.view.midcenter.element.scrollHeight-this.view.midcenter.element.clientHeight);
}
nitobi.grid.Scroller3x3.prototype.setScrollTop=function(scrollTop) {
	this.view.midcenter.element.scrollTop = scrollTop;
	this.view.midleft.element.scrollTop = scrollTop;
	this.render();
}
nitobi.grid.Scroller3x3.prototype.getScrollTop=function() {
	return this.scrollSurface.scrollTop;
}

nitobi.grid.Scroller3x3.prototype.clearSurfaces=function(ClearAll,ClearTop,ClearMiddle,ClearBottom) {
	this.flushCache();
	ClearMiddle=true; // always clear middle for now
	if(ClearAll) {
		ClearTop=true;
		ClearMiddle=true;
		ClearBottom=true;
	}
	if (ClearTop) {
		this.view.topleft.clear(true);
		this.view.topcenter.clear(true);
	}
	
	// TODO: figure this clearing of viewports out properly ...
	if (ClearMiddle) {
		// TODO: This is changed from Schenker grid
		// this.view.midleft.clear(false, true, false, false);
		this.view.midleft.clear(true, true, false, false);
		this.view.midcenter.clear(false,false,true);
	}
	if (ClearBottom) {
	}
}

// NOTE: Removed a bunch of stuff here ... 

nitobi.grid.Scroller3x3.prototype.mapToHtml=function(oNode)
{
	var uid = this.owner.uid;
	for (var i=0;i<4;i++) {
		var node=$ntb("gridvp_"+i+"_"+uid);
		this.view[EBAScroller_VIEWPANES[i]].mapToHtml(node,nitobi.html.getFirstChild(node),null);  
	}
	this.scrollSurface = $ntb("gridvp_3_"+uid);
}

/**
 * Returns a row range of what should currently be rendered in the grid. When paging is not being used,
 * it simply returns the total number of rows in the Grid. For LiveScrolling it calculates the rows 
 * to show based on the scroll position. Finally, for Standard paging it returns the rowsPerPage offset
 * by the index of the current page. 
 * @return {Pair} A struct range with first and last values which are the start and end of the row range.
 */
nitobi.grid.Scroller3x3.prototype.getUnrenderedBlocks = function()
{
	var pair = {first : this.freezetop, last: this.rows-1-this.freezetop};
	if (!this.implementsShowAll()) {
		var scrollTop = this.getScrollTop()+ this.getTop() - this.headerHeight;

		var MC = this.view.midcenter;
		var b0=MC.findBlockAtCoord(scrollTop);
		var b1=MC.findBlockAtCoord(scrollTop+this.height);
		var firstVisibleRow=null;
		var lastVisibleRow=null;
		if (b0 == null) {
			return;
		}
		firstVisibleRow = b0.top+Math.floor((scrollTop-b0.offsetTop)/this.rowHeight);
		if (b1) {
			lastVisibleRow = b1.top+Math.floor((scrollTop+this.height-b1.offsetTop)/this.rowHeight);
		} else {
			lastVisibleRow=firstVisibleRow+Math.floor(this.height/this.rowHeight);
		}
		// TODO: this used to be this.rows-1 since lastVisibleRow is zero based.
		lastVisibleRow=Math.min(lastVisibleRow,this.rows);

		// We check if standard paging is being used, and if so apply an offset 
		// of the page size * the current page to the first visible row.
		if (this.implementsStandardPaging()) 
		{
			var topOffset = 0;
			//topOffset = this.getRowsPerPage() * this.getCurrentPageIndex();

			if (this.owner.getRenderMode() == nitobi.grid.RENDERMODE_ONDEMAND)
			{
				// ** Live Scrolling + Standard Paging ...
				// TODO: this will make standard paging look like livescrolling on the page level
				// however, it causes the value in the editor to be "undefined" when you edit a cell.
				var first = firstVisibleRow + topOffset;
				// We use getDisplayedRowCount to take into account changes to do with insertion and deletion.
				var last = Math.min(lastVisibleRow+topOffset, topOffset+this.getDisplayedRowCount()-1); 
				pair = {first : first, last: last};
			}
			else
			{
				//Purely standard paging
				// TODO: although this should be correct it is causing double gets at startup if we include it.

				var first = topOffset;
				//var first = this.getRowsPerPage() * this.getCurrentPageIndex();
				// We use getDisplayedRowCount to take into account changes to do with insertion and deletion.
				var last = first + this.getDisplayedRowCount() - 1;
				pair = {first : first, last: last};
			}
		}
		else
		{
			pair = {first : firstVisibleRow, last: lastVisibleRow};
		}

		this.onRangeUpdate.notify(pair);
	}
	return pair;
}
/**
 * Initiatiate the render operation. Because the data may not yet be available, the actual render doesn't occur until renderReady()
 */
nitobi.grid.Scroller3x3.prototype.render=function(force)
{
	// Check if the grid is bound to the datasource yet and if the scroll has changed
	if (this.owner.isBound() && (this.getScrollTop() != this.lastScrollTop || force || this.scrollTopPercent>.9))
	{
		// Wait a little bit before rendering, just in case the user has scrolled past this position.
		// This enables quickly scrolling through large data sets without rendering every record.
		var funcRef = nitobi.lang.close(this, this.performRender, []);
		window.clearTimeout(this.lastTimeoutId);
		this.lastTimeoutId = window.setTimeout(funcRef, EBAScroller_RENDERTIMEOUT);
	}
}
/*
 * The actual render operation
 */
nitobi.grid.Scroller3x3.prototype.performRender=function()
{
  	var visibleRows = this.getUnrenderedBlocks();

	if (visibleRows==null) {return; }

  	var scrollTop = this.getScrollTop();

	var mc = this.view.midcenter;
	var ml = this.view.midleft;
	// Logic for increasing gap size moved into scroller
	var datatable = this.getDataTable();
	var first = visibleRows.first;
	var last = visibleRows.last;
	if (last>=datatable.remoteRowCount-1 && !datatable.rowCountKnown) {
		last+=2;
	}
	var gaps = this.cacheMap.gaps(first,last);

	// Behaviour is different on an empty grid when in livescrolling vs. other
	var noRows = (this.owner.mode.toLowerCase()==nitobi.grid.MODE_LIVESCROLLING?(first+last<=0):(first+last<=-1));

	if (noRows) {
		// If there are no rows to render then HTML is ready
		this.onHtmlReady.notify();
	} else if (gaps[0] != null) {
		var low = gaps[0].low;
		var high = gaps[0].high;

		var rows = high - low + 1;

		// If not all data is in cache we must issue a get
		if (!datatable.inCache(low, rows)) {
			if (low==null || rows==null) {
				alert("low or rows =null")
			}
			if (this.implementsStandardPaging())
			{
				var firstRow = this.getCurrentPageIndex() * this.getRowsPerPage();
				var lastRow = firstRow + this.getRowsPerPage();
				datatable.get(firstRow, lastRow);
			}
			else
			{
				datatable.get(low, rows);
			}
			// We may already have at least some of the data ... so render what we got
			var cached = datatable.cachedRanges(low,high);
			for (var i=0;i<cached.length;i++) {
				var subGaps = this.cacheMap.gaps(cached[i].low,cached[i].high);
				for (var j=0;j<subGaps.length;j++) {
					visibleRows.first = subGaps[j].low;
					visibleRows.last = subGaps[j].high;

					this.renderGap(subGaps[j].low,subGaps[j].high);
				}
			}
			return false;
		} else {
			//this.cacheMap.insert(low, high);
			this.renderGap(low, high);
		}
	}

	this.onRenderComplete.notify();
}
// TODO: This is instead of renderReady - most of the stuff from viewport is in here now
/*
 * The actual render operation
 */
nitobi.grid.Scroller3x3.prototype.renderGap = function(low,high)
{
	var gaps = this.cacheMap.gaps(low,high);
	var mc = this.view.midcenter;
	var ml = this.view.midleft;

	if (gaps[0] != null)
	{
		var low = gaps[0].low;
		var high = gaps[0].high;

		var rows = high - low + 1;
		this.cacheMap.insert(low, high);

		mc.renderGap(low,high);
		ml.renderGap(low,high);
	}
}
// TODO: This is different from flushCache that used to call flushCache in viewport
nitobi.grid.Scroller3x3.prototype.flushCache = function()
{
	if (Boolean(this.cacheMap)) this.cacheMap.flush();
}
nitobi.grid.Scroller3x3.prototype.reRender= function(startRow, endRow)
{
	var range = this.view.midleft.clearBlocks(startRow, endRow);
	this.view.midcenter.clearBlocks(startRow, endRow);

	this.cacheMap.remove(range.top, range.bottom);

	this.render();
}
nitobi.grid.Scroller3x3.prototype.getViewportByCoords=function(row, column) 
{
	var topOffset = 0;
	// Top Left
	if (row>=topOffset && row<this.owner.getfreezetop() && column>=0 && column<this.owner.frozenLeftColumnCount())
		return this.view.topleft;
	// Top Center
	if (row>=topOffset && row<this.owner.getfreezetop() && column>=this.owner.getFrozenLeftColumnCount() && column<this.owner.getColumnCount())
		return this.view.topcenter;
	// Mid Left
	if (row>=this.owner.getfreezetop()+topOffset && row<this.owner.getDisplayedRowCount()+topOffset && column>=0 && column<this.owner.getFrozenLeftColumnCount())
		return this.view.midleft;
	// Mid Center
	if (row>=this.owner.getfreezetop()+topOffset && row<this.owner.getDisplayedRowCount()+topOffset && column>=this.owner.getFrozenLeftColumnCount() && column<this.owner.getColumnCount())
		return this.view.midcenter;
}
nitobi.grid.Scroller3x3.prototype.getRowsPerPage=function() {
	return this.owner.getRowsPerPage();
}
nitobi.grid.Scroller3x3.prototype.getDisplayedRowCount=function() {
	return this.owner.getDisplayedRowCount();
}
nitobi.grid.Scroller3x3.prototype.getCurrentPageIndex=function() {
	return this.owner.getCurrentPageIndex();
}
nitobi.grid.Scroller3x3.prototype.implementsStandardPaging = function() {
	return Boolean(this.owner.getPagingMode().toLowerCase() == "standard");
}
// This is written this way because I didn't want to get into trouble for rogue programming by fixing it properly
nitobi.grid.Scroller3x3.prototype.implementsShowAll = function() {
	return Boolean(this.owner.getPagingMode().toLowerCase() == nitobi.grid.PAGINGMODE_NONE);
}
nitobi.grid.Scroller3x3.prototype.setDataTable = function(oDataTable) {
	this.dataTable = oDataTable;
}
nitobi.grid.Scroller3x3.prototype.getDataTable = function() {
	return this.dataTable;
}

nitobi.grid.Scroller3x3.prototype.handleHtmlReady = function()
{
	this.onHtmlReady.notify();
}

nitobi.grid.Scroller3x3.prototype.getTop = function() {
	return this.freezetop * this.rowHeight + this.headerHeight;
}

nitobi.grid.Scroller3x3.prototype.setSort = function(col, dir)
{
	this.view.topleft.setSort(col, dir);
	this.view.topcenter.setSort(col, dir);
	this.view.midleft.setSort(col, dir);
	this.view.midcenter.setSort(col, dir);
}

nitobi.grid.Scroller3x3.prototype.setRowHeight = function(rowHeight)
{
	this.rowHeight = rowHeight;
	this.setViewportProperty("RowHeight", rowHeight);
}
nitobi.grid.Scroller3x3.prototype.setHeaderHeight = function(headerHeight)
{
	this.headerHeight = headerHeight;
	this.setViewportProperty("HeaderHeight", headerHeight);
}
nitobi.grid.Scroller3x3.prototype.setViewportProperty = function(property, value)
{
	var sv = this.view;
	for (var i=0; i<EBAScroller_VIEWPANES.length; i++)
	{
		sv[EBAScroller_VIEWPANES[i]]["set"+property](value);
	}
}
nitobi.grid.Scroller3x3.prototype.fire= function(evt,args){
	return nitobi.event.notify(evt+this.uid,args);
}
nitobi.grid.Scroller3x3.prototype.subscribe= function(evt,func,context)  {
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
}

nitobi.grid.Scroller3x3.prototype.dispose = function()
{
	try
	{
		(this.cacheMap!= null?this.cacheMap.flush():'');
		this.cacheMap = null;

		var disposalLength = this.disposal.length;
		for (var i=0; i<disposalLength; i++)
		{
			if (typeof(this.disposal[i]) == "function")
			{
				this.disposal[i].call(this);
			}
			this.disposal[i] = null;
		}

		for (var v in this.view)
		{
			this.view[v].dispose();
		}

		for (var item in this)
		{
			if (this[item] != null && this[item].dispose instanceof Function)
			{
				this[item].dispose();
			}
		}
	}
	catch(e)
	{
//		ntbAssert();
	}
}