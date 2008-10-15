EBAScroller_RENDERTIMEOUT=100;
EBAScroller_VIEWPANES = new Array("topleft","topcenter","midleft","midcenter");

/**
 * @class nitobi.grid.Scroller3x3
 * @constructor
 * @private
 */
nitobi.grid.Scroller3x3 = function(owner,height,rows,columns,freezetop,freezeleft) {
	this.disposal = [];
	/**
	 * The html element that this Scroller represents.  Gets defined in
	 * nitobi.grid.Scroller3x3#mapToHtml
	 * @private
	 */
	this.htmlNode;
	this.height = height;
	this.freezetop = freezetop;
	this.freezeleft = freezeleft;
	this.lastScrollTop = -1;

	this.uid = nitobi.base.getUid();

	this.onRenderComplete = new nitobi.base.Event();
	this.onRangeUpdate = new nitobi.base.Event();
	this.onHtmlReady = new nitobi.base.Event();

	this.owner = owner;

	/**
	 * This is a DOM node that represents the main scrolling surface
	 * It is set in MapToHTML ...
	 * @private
	 */
	this.scrollSurface = null;
	
	/**
	 * The first row of the live scrolling section.
	 * @private
	 */
	this.startRow = freezetop;

	this.headerHeight = 23;
	this.rowHeight = 23;

	this.lastTimeoutId = 0;
	this.scrollTopPercent = 0;

	this.dataTable = null;

	this.cacheMap = new nitobi.collections.CacheMap(-1,-1);
	
	/**
	 * The root surface
	 * @private
	 */
	this.surface = new nitobi.grid.Surface(this, this.owner, "0");
	this.surface.headerAttached = false;
	this.surface.isVisible = true;
	if (rootColumns = this.owner.getRootColumnsElement())
		this.surface.columnSetId = rootColumns.getAttribute("id");
	
	this.surface.columnsNode = this.owner.getRootColumnsElement();
	this.surface.subscribeColumnEvents();
	this.surface.sortLocal = this.owner.getSortMode() == 'local' || (this.owner.getDataMode() == 'local' && this.owner.getSortMode() != 'remote');
	
	this.setCellRanges();
	
	/**
	 * A map of surface keys to surface objects
	 * @private
	 */
	this.surfaceMap = {};
}
/**
 * Reponds to changes in the recordset size by resizing the grid surface
 */
nitobi.grid.Scroller3x3.prototype.updateCellRanges= function(cols,rows,frzL,frzT) {
	this.columns = cols;
	this.rows = rows;
	this.freezetop = frzT;
	this.freezeleft = frzL;
	this.surface.updateCellRanges(cols,frzL,frzT);
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
	this.surface.setCellRanges(pageSize);
}
nitobi.grid.Scroller3x3.prototype.resize=function(height) {
	this.height = height;
}
nitobi.grid.Scroller3x3.prototype.setScrollLeftRelative=function(offset) {
	this.setScrollLeft(this.scrollLeft+offset);
}
nitobi.grid.Scroller3x3.prototype.setScrollLeftPercent=function(scrollPercent) {
	this.setScrollLeft(Math.round((this.surface.view.midcenter.element.scrollWidth-this.surface.view.midcenter.element.clientWidth) * scrollPercent));
}
nitobi.grid.Scroller3x3.prototype.setScrollLeft=function(scrollLeft) {
	this.surface.view.midcenter.element.scrollLeft = scrollLeft;
	this.surface.view.topcenter.element.scrollLeft = scrollLeft;
	$("ntb-grid-subheader-container" + this.owner.uid).scrollLeft = scrollLeft;
}
nitobi.grid.Scroller3x3.prototype.getScrollLeft=function() {
	return this.scrollSurface.scrollLeft;
}
nitobi.grid.Scroller3x3.prototype.setScrollTopRelative=function(offset) {
	this.setScrollTop(this.getScrollTop()+offset);
}
nitobi.grid.Scroller3x3.prototype.setScrollTopPercent=function(scrollPercent) {
	ntbAssert(!isNaN(scrollPercent),"scrollPercent isNaN");
	this.setScrollTop(Math.round((this.surface.view.midcenter.element.scrollHeight-this.surface.view.midcenter.element.clientHeight) * scrollPercent));
}
nitobi.grid.Scroller3x3.prototype.getScrollTopPercent = function(){
	return this.scrollSurface.scrollTop / (this.surface.view.midcenter.element.scrollHeight-this.surface.view.midcenter.element.clientHeight);
}
nitobi.grid.Scroller3x3.prototype.setScrollTop=function(scrollTop) {
	this.surface.view.midcenter.element.scrollTop = scrollTop;
	this.surface.view.midleft.element.scrollTop = scrollTop;
	this.render();
}
nitobi.grid.Scroller3x3.prototype.getScrollTop=function() {
	return this.scrollSurface.scrollTop;
}

nitobi.grid.Scroller3x3.prototype.clearSurface = function(ClearAll,ClearTop,ClearMiddle,ClearBottom, surfaceKey)
{
	surfaceKey = surfaceKey || "0";
	var surface = this.getSurface(surfaceKey);
	if (surface.cacheMap)
		surface.cacheMap.flush();
	//this.flushCache();
	ClearMiddle = true; // always clear middle for now
	if(ClearAll) {
		ClearTop=true;
		ClearMiddle=true;
		ClearBottom=true;
	}
	if (ClearTop) {
		surface.clearHeader();
	}
	
	// TODO: figure this clearing of viewports out properly ...
	if (ClearMiddle) {
		// TODO: This is changed from Schenker grid
		// this.view.midleft.clear(false, true, false, false);
		surface.clearData();
	}
	if (ClearBottom) {
	}
}

nitobi.grid.Scroller3x3.prototype.mapToHtml=function(oNode)
{
	var uid = this.owner.uid;
	this.surface.mapToHtml(uid);
	this.scrollSurface = $("gridvp_3_" + uid + "_" + this.surface.key);
	this.htmlNode = $("ntb-grid-scroller");
	/*for (var i=0;i<4;i++) {
		var node=$("gridvp_"+i+"_"+uid);
		this.view[EBAScroller_VIEWPANES[i]].mapToHtml(node,nitobi.html.getFirstChild(node),null);  
	}*/
	//this.scrollSurface = $("gridvp_3_"+uid);
}

/**
 * Initiatiate the render operation. Because the data may not yet be available, the actual render 
 * doesn't occur until renderReady()
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
		this.resetHeaders();
	}
}
/*
 * The actual render operation
 */
nitobi.grid.Scroller3x3.prototype.performRender=function()
{
	/*var visibleRows = this.getUnrenderedBlocks(pagingMode, renderMode);

	if (visibleRows==null) {return; }
	*/
	var scrollTop = this.getScrollTop();
	this.surface.renderAtScrollPosition(scrollTop);
	this.onRenderComplete.notify();
}
// TODO: This is instead of renderReady - most of the stuff from viewport is in here now
/*
 * The actual render operation
 */
nitobi.grid.Scroller3x3.prototype.renderGap = function(low,high)
{
	this.surface.renderGap(low, high);
}
// TODO: This is different from flushCache that used to call flushCache in viewport
nitobi.grid.Scroller3x3.prototype.flushCache = function()
{
	if (Boolean(this.surface.cacheMap)) this.surface.cacheMap.flush();
}
nitobi.grid.Scroller3x3.prototype.reRender= function(startRow, endRow)
{
	this.surface.reRender(startRow, endRow);
}
nitobi.grid.Scroller3x3.prototype.getViewportByCoords=function(row, column, surfacePath) 
{
	// TODO: This needs to be simplified...
	var surface = this.getSurface(surfacePath);
	var topOffset = 0;
	// Top Left
	/*if (row>=topOffset && row<this.owner.getfreezetop() && column>=0 && column<this.owner.frozenLeftColumnCount())
		return this.view.topleft;
	*/
	// Top Center
	if (row>=topOffset && row<this.owner.getfreezetop() && column>=this.owner.getFrozenLeftColumnCount() && column<this.owner.getColumnCount())
		return surface.view.topcenter;
	// Mid Left
	/*if (row>=this.owner.getfreezetop()+topOffset && row<this.owner.getDisplayedRowCount()+topOffset && column>=0 && column<this.owner.getFrozenLeftColumnCount())
		return surface.view.midleft;
	*/
	// Mid Center
	if (row>=this.owner.getfreezetop()+topOffset && row<this.owner.getDisplayedRowCount()+topOffset && column>=this.owner.getFrozenLeftColumnCount() && column < surface.columnsNode.childNodes.length)
		return surface.view.midcenter;
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
nitobi.grid.Scroller3x3.prototype.setDataTable = function(oDataTable) 
{
	this.dataTable = oDataTable;
	this.surface.setDataTable(oDataTable);
	this.surface.dataTable.subscribe("TotalRowCountReady", nitobi.lang.close(this.surface, this.surface.setRowCount));
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
	this.surface.setViewportProperty(property, value);
}
nitobi.grid.Scroller3x3.prototype.fire= function(evt,args){
	return nitobi.event.notify(evt+this.uid,args);
}
nitobi.grid.Scroller3x3.prototype.subscribe= function(evt,func,context)  {
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
}

nitobi.grid.Scroller3x3.prototype.createRenderers = function(data) 
{
	this.surface.createRenderers(data);
}
/**
 * Returns the Surface identified by the given path.
 * @param Array path The path to the Surface.  For example, given the array [0,2,1,4], the Surface belonging
 * to the 4th row of the 1st group of the 2nd group of the root surface.
 * @type nitobi.grid.Surface
 */
nitobi.grid.Scroller3x3.prototype.getSurface = function(path)
{
	if (this.surfaceMap[path] != null)
	{
		return this.surfaceMap[path];
	}
	if (typeof path == "string")
	{
		path = path.split("_");
	}
	var surface = this.surface;
	// We start at 1 because we ignore the root surface
	for (var i = 1; i < path.length; i++)
	{
		surface = surface.surfaces[path[i]];
	}
	return (surface?this.surfaceMap[path] = surface:null);
}

nitobi.grid.Scroller3x3.prototype.purgeSurfaces = function()
{
	this.surface.purgeSurfaces();
}

nitobi.grid.Scroller3x3.prototype.resetHeaders = function()
{
	this.surface.checkHeaders();
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