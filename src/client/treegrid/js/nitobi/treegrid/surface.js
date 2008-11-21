/**
 * @private
 */
nitobi.grid.Surface = function(scroller, grid, key, rowIndex)
{
	/**
	 * @private
	 */
	this.grid = grid;
	/**
	 * We give the surface a reference to the scroller becuase the surface needs to know
	 * the height of the scroll surface in order to properly figure out which of its
	 * blocks are in view.  It's easier this way, but we should do it better.
	 * @private
	 */
	this.scroller = scroller;
	
	/**
	 * @private
	 */
	this.uid = nitobi.component.getUniqueId();
	/**
	 * The key uniquely identifies the surface by denoting where this surface is 
	 * in the overall hierarchy of surfaces.  For example, 0_3_43 denotes that this 
	 * surface is associated with the 43rd group of the 3rd group of the 0th group.
	 * @private
	 */
	this.key = key || 0;
	/**
	 * The index of the row which this surface belongs to.
	 * @private
	 */
	this.rowIndex = rowIndex;
	/**
	 * The id of the column set that is associated with this surface.
	 * @private
	 */
	this.columnSetId;
	/**
	 * Used to cache column objects
	 * @see #getColumnObject
	 * @private
	 */
	this.cachedColumns = [];
	/**
	 * Used to cache cell objects
	 * @see #getCellObject
	 * @private
	 */
	this.cachedCells = {};
	
	/**
	 * The ntb:columns node associated with this surface
	 * @private
	 */
	this.columnsNode;

	/**
	 * Number of rows contained by this surface alone.
	 * @private
	 */
	this.rows = 0;
	
	/**
	 * All subsurfaces sort on the server, but the root surface has
	 * the option to sort locally.  This will be set in #nitobi.grid.Scroller
	 * @private
	 */
	this.sortLocal = false;
	/**
	 * @private
	 */
	this.headerAttached = false;
	
	/**
	 * @private
	 */
	this.eventMap = {};
	/**
	 * @private
	 */
	this.onRenderComplete = new nitobi.base.Event();
	/**
	 * @private
	 */
	this.onRangeUpdate = new nitobi.base.Event();
	/**
	 * @private
	 */
	this.onHtmlReady = new nitobi.base.Event();
	/**
	 * @private
	 */
	this.onSetVisible = new nitobi.base.Event();
	
	this.onBeforeToggle = new nitobi.base.Event();
	
	this.onAfterToggle = new nitobi.base.Event();
	/**
	 * @private
	 */
	this.onBeforeExpand = new nitobi.base.Event();
	this.eventMap["BeforeExpand"] = this.onBeforeExpand;
	/**
	 * @private
	 */
	this.onAfterExpand = new nitobi.base.Event();
	this.eventMap["AfterExpand"] = this.onAfterExpand;
	/**
	 * @private
	 */
	this.onBeforeCollapse = new nitobi.base.Event();
	this.eventMap["BeforeCollapse"] = this.onBeforeCollapse;
	/**
	 * @private
	 */
	this.onAfterCollapse = new nitobi.base.Event();
	this.eventMap["AfterCollapse"] = this.onAfterCollapse;
	
	/**
	 * The effect class to use when expanding a node in the tree.  Use the
	 * <code>effect</code> attribute in the XML declaration to set an effect family.
	 * Default: {@link nitobi.effects.ShadeDown}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.showEffect = nitobi.effects.families[(this.grid.isEffectsEnabled()?"blind":"none")].show;
	/**
	 * The effect class to use when collapsing a node in the tree.  Use the
	 * <code>effect</code> attribute in the XML declaration to set an effect family.
	 * Default: {@link nitobi.effects.ShadeUp}
	 * @see nitobi.effects.families
	 * @type Class
	 */
	this.hideEffect = nitobi.effects.families[(this.grid.isEffectsEnabled()?"blind":"none")].hide;
	
	/**
	 * @private
	 */
	this.effect;
	
	// TODO: Should rowHeight be hardcoded here?
	/**
	 * @private
	 */
	this.rowHeight = 23;
	
	/**
	 * @private
	 */
	this.lastTimeoutId = 0;  // Not sure if this does anything...
	/**
	 * @private
	 */
	this.dataTable = null;

	/**
	 * @private
	 */
	this.cacheMap = new nitobi.collections.CacheMap();
	
	var VP = nitobi.grid.Viewport;
	/**
	 * Viewports are responsible for rendering
	 * topleft -> frozen header
	 * topcenter -> unfrozen header
	 * midleft -> frozen columns
	 * midcenter -> unfrozen columns
	 * @private
	 */
	this.view = { topleft:		new VP(this.grid,0, this),
				  topcenter:	new VP(this.grid,1, this),
				  midleft:		new VP(this.grid,3, this),
				  midcenter:	new VP(this.grid,4, this)};
	
	/**
	 * A map of ids to subsurfaces
	 * @private
	 */
	this.surfaces = {};
	
	/**
	 * @private
	 */
	this.isVisible = false;
	/**
	 * The xsl processor responsible for rendering the surface's skeleton content.
	 * Used in {@link #render}
	 * @private
	 */
	this.surfaceXslProc = nitobi.xml.createXslProcessor(nitobi.grid.surfaceXslProc.stylesheet);
	
	//this.view.midleft.onHtmlReady.subscribe(this.handleHtmlReady, this);
	this.view.midcenter.onHtmlReady.subscribe(this.handleHtmlReady, this);
}

/**
 * Notifies all objects subscribed to the surface's onHtmlReady event.
 * The Grid subscribes to the event in {@link nitobi.grid.Grid#createChildren}.
 * @private
 */
nitobi.grid.Surface.prototype.handleHtmlReady = function()
{
	this.onHtmlReady.notify();
}

/**
 * Returns a row range of what should currently be rendered in the grid. When paging is not being used,
 * it simply returns the total number of rows in the Grid. For LiveScrolling it calculates the rows 
 * to show based on the scroll position. Finally, for Standard paging it returns the rowsPerPage offset
 * by the index of the current page. 
 * @return {Pair} A struct range with first and last values which are the start and end of the row range.
 */
nitobi.grid.Surface.prototype.getUnrenderedBlocks = function(scrollTop, pagingMode, renderMode)
{
	// find the first row that is visible.
	// find the last row that _might_ be visible
	// check all the rows in between to find any open ones...
	var pair = {first: 0, last: this.displayedRowCount - 1};
	if (this.grid.getPagingMode().toLowerCase() == nitobi.grid.PAGINGMODE_NONE && this.key == "0")
		return pair;
	var MC = this.view.midcenter;
	//var b0 = MC.findBlockAtCoord(scrollTop);
	//var b1 = MC.findBlockAtCoord(scrollTop + this.height);

	var b0 = this.findBlockAtCoord(scrollTop);
	var b1 = this.findBlockAtCoord(scrollTop + this.scroller.height);
	
	var firstVisibleRow = null;
	var lastVisibleRow = null;
	var lookAhead = 0;
	if (b0 == null) 
	{
		return pair;
	}
	
	var surfaceTop = this.calculateOffsetTop();
	var subSurfaceNode = nitobi.html.getChildNodeByAttribute(b0, "className", "ntb-grid-subgroup");
	// We'll figure out the unrendered rows by pretending there are no subgroups rendered so we'll
	// subtract the height of any subgroups in this block when calculating the firstVisibleRow
	var buffer = 0;
	
	if (subSurfaceNode)
	{
		buffer = subSurfaceNode.offsetHeight
	}
	firstVisibleRow = b0.top + Math.floor((scrollTop - (surfaceTop + b0.offsetTop + this.rowHeight) - buffer)/this.rowHeight);
	
	if (firstVisibleRow < 0)
	{
		firstVisibleRow = 0;
	}

	if (b1) 
	{
		lastVisibleRow = b1.top + Math.floor((scrollTop + this.scroller.scrollSurface.offsetHeight - b1.offsetTop)/this.rowHeight) + lookAhead;
	} 
	else 
	{
		lastVisibleRow = firstVisibleRow + Math.floor(this.view.midcenter.surface.offsetHeight/this.rowHeight) + lookAhead;
	}
	// TODO: this used to be this.rows-1 since lastVisibleRow is zero based.
	lastVisibleRow = Math.min(lastVisibleRow,this.rows - 1);
	firstVisibleRow = Math.max(Math.min(firstVisibleRow, this.rows - 1), 0);

	// We check if standard paging is being used, and if so apply an offset 
	// of the page size * the current page to the first visible row.
	if (this.grid.getPagingMode() == nitobi.grid.MODE_STANDARDPAGING && this.key == "0") 
	{
		var topOffset = 0;
		//topOffset = this.getRowsPerPage() * this.getCurrentPageIndex();

		if (renderMode == nitobi.grid.RENDERMODE_ONDEMAND)
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
			// We use displayedRowCount to take into account changes to do with insertion and deletion.
			var last = first + this.displayedRowCount - 1;
			pair = {first : first, last: last};
		}
	}
	else
	{
		pair = {first : firstVisibleRow, last: lastVisibleRow};
	}

	this.onRangeUpdate.notify(pair);
	return pair;
}

/**
 * Calculates the offsetTop of the surface from the top of the viewable region, 
 * not the top of the page.
 * @see #findBlockAtCoord
 * @see #getUnrenderedBlocks
 * @private
 */
nitobi.grid.Surface.prototype.calculateOffsetTop = function()
{
	var element = this.view.midcenter.element;
	var rootElement = this.scroller.scrollSurface;
	for (var ly=0;element!=rootElement && element != null;element=element.offsetParent)
	{
		ly += element.offsetTop;
	}
	return ly;
}

/**
 * Finds the block in this surface corresponding to some offset top value.
 * @private
 */
nitobi.grid.Surface.prototype.findBlockAtCoord = function(top) 
{
	var blocks = this.view.midcenter.container.childNodes;
	for (var i = 0; i < blocks.length; i++) 
	{
		var block = blocks[i];
		var rt;
		
		/*// If it's the root surface, rt should be 0, but #calculateOffsetTop will 
		// calculate the offset according to document.body.  So we can't use it in
		// the case of the root surface.
		if (this.key == "0")
		{
			rt = this.htmlNode.offsetTop + block.offsetTop;
		}
		else
		{
			var surfaceTop = this.calculateOffsetTop();
			rt = surfaceTop + block.offsetTop;
		}*/
		rt = this.calculateOffsetTop() + block.offsetTop;
		var rb = rt + block.offsetHeight;
		
		//if ((top >= rt && top <= rb) || (rt >= top && rt <= this.scroller.scrollSurface.offsetHeight))
		if (top >= rt && top <= rb)
		{
			return block;
		}
	}
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.updateCellRanges = function(cols,frzL,frzT,frzR,frzB) 
{
	this.columns = cols;
	this.freezetop = frzT;
	this.freezeleft = frzL;
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.setCellRanges = function(pageSize) 
{
	// TODO: What is this supposed to do?
	/*debugger;
	this.view.topleft.setCellRanges(0,this.freezetop,0,this.freezeleft);
	this.view.topcenter.setCellRanges(0,this.freezetop,this.freezeleft,this.columns-this.freezeleft-this.freezeright);

	this.view.midleft.setCellRanges(this.freezetop, (pageSize?pageSize:this.rows) - this.freezetop, 0, this.freezeleft);
	this.view.midcenter.setCellRanges(this.freezetop, (pageSize?pageSize:this.rows) - this.freezetop, this.freezeleft, this.columns-this.freezeleft-this.freezeright);
	*/
}

/**
 * Clears the rendered surface.
 * @private
 */
nitobi.grid.Surface.prototype.clearData = function() 
{
	//this.view.midleft.clear(true, true, false, false, this.rows);
	this.view.midcenter.clear(false,false,true, null, this.rows);
};

/**
 * Clears the surface's rendered header.
 * @private
 */
nitobi.grid.Surface.prototype.clearHeader = function() {
	//this.view.topleft.clear(true);
	this.view.topcenter.clear(true);
};

/**
 * Once the Grid's frame has been rendered, we need to give the surface and its viewports
 * references to their respective html elements.
 * @param {String} uid The unique id of the Grid
 * @private
 */
nitobi.grid.Surface.prototype.mapToHtml = function(uid) 
{
	this.htmlNode = $ntb(this.key + "_surface" + uid);
	for (var i = 0; i < 4; i++) {
		var node = $ntb("gridvp_" + i + "_" + uid + "_" + this.key);
		this.view[EBAScroller_VIEWPANES[i]].mapToHtml(node,nitobi.html.getFirstChild(node),null);
	}
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.initializeBlock = function(pageSize)
{
	for (var i = 0; i < 4; i++) 
	{
		this.view[EBAScroller_VIEWPANES[i]].makeLastBlock(0, pageSize * 5);
	}
}

/**
 * Renders the surface at a given scroll position.  It will render in a depth-first
 * manner; that is, it will try to render the deepest visible subsurface first.  Will
 * usually be called by {@link nitobi.grid.Scroller3x3#performRender}
 * @param {Number} scrollTop The vertical scrolling position from the top of the Scroller surface.
 * @private
 */
nitobi.grid.Surface.prototype.renderAtScrollPosition = function(scrollTop)
{
	var blocksInView = this.getBlocksInView(scrollTop);
	if (blocksInView == null)
	{
		return true;
	}
	// Check if any of the blocks have sub surfaces,
	var continueRender = true;
	for (var i = 0; i < blocksInView.length; i++)
	{
		var block = blocksInView[i];
		for (var j = 0; j < block.childNodes.length; j++)
		{
			var subElement = block.childNodes[j];
			if (subElement.nodeType == 1 && subElement.className == "ntb-surface")
			{
				// TODO: Clean up.
				var id = subElement.getAttribute("id");
				var key = id.match(/(.*?)_surface/);
				key = key[1];
				var surfacePath = key.split("_");
				var subSurface = this.surfaces[surfacePath.pop()];
				continueRender = subSurface.renderAtScrollPosition(scrollTop);
			}
		}
	}
	
	if (continueRender)
	{
		var visibleRows = this.getUnrenderedBlocks(scrollTop);
		this.performRender(visibleRows);
		
		var surfaceBox = nitobi.html.getFirstChild(this.htmlNode).getBoundingClientRect();
		var scrollBottom = scrollTop + this.scroller.scrollSurface.offsetHeight;
		var hasBlocksInView;
		if ((Math.abs(surfaceBox.top) <= scrollTop && Math.abs(surfaceBox.bottom) >= scrollBottom) || (this.grid.getPagingMode() == nitobi.grid.MODE_STANDARDPAGING))
		{
			hasBlocksInView =  false;
		}
		else
		{
			hasBlocksInView = true;
		}
	}
	this.onRenderComplete.notify();
	return hasBlocksInView;
	
};

/**
 * Renders the required rows for the surface.  If the last row is greater than
 * what has been cached from the previous request to the server, a get is issued.
 * @private
 */
nitobi.grid.Surface.prototype.performRender = function(visibleRows) 
{
	var mc = this.view.midcenter;
	var ml = this.view.midleft;
	// Logic for increasing gap size moved into scroller
	var datatable = this.dataTable;
	var first = visibleRows.first;
	var last = visibleRows.last;
	// TODO: This is used for livescrolling as a buffer to get more data
	// if we're at the end, but we need to make this work with grouped data where
	// the total row count is known.
	/*if (last>=datatable.remoteRowCount-1 && !datatable.rowCountKnown) {
		last+=2;
	}*/
	var gaps = this.cacheMap.gaps(first,last);

	// Behaviour is different on an empty grid when in livescrolling vs. other
	var noRows = (this.pagingMode=="livescrolling"?(first+last<=0):(first+last<=-1));
	if (noRows) 
	{
		// If there are no rows to render then HTML is ready
		this.onHtmlReady.notify();
	} 
	else if (gaps[0] != null) 
	{
		var low = gaps[0].low;
		var high = gaps[0].high;

		var rows = high - low + 1;

		// If not all data is in cache we must issue a get
		if (!datatable.inCache(low, rows)) 
		{
			if (low==null || rows==null) 
			{
				alert("low or rows =null")
			}

			datatable.get(low, rows);
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
		} 
		else 
		{
			//this.cacheMap.insert(low, high);
			this.renderGap(low, high);
		}
	}
};

/**
 * Finds all the blocks for this surface that are currently in view.
 * @param {Number} scrollTop The vertical scrolling position from the top of the Scroller surface.
 * @private
 */
nitobi.grid.Surface.prototype.getBlocksInView = function(scrollTop)
{
	var midcenter = this.view.midcenter;
	var firstBlock = this.findBlockAtCoord(scrollTop);
	var lastBlock = this.findBlockAtCoord(scrollTop + this.scroller.height);
	if (firstBlock == null)
	{
		return;
	}
	var blocks = [firstBlock];
	if (lastBlock == null || firstBlock == lastBlock)
	{
		return blocks;
	}
	var nextBlock = firstBlock.nextSibling;
	while (nextBlock != lastBlock.nextSibling && nextBlock != null)
	{
		if (nextBlock.nodeType == 1)
		{
			blocks.push(nextBlock);
		}
		nextBlock = nextBlock.nextSibling;
	}
	return blocks;
};

/**
 * Renders a range of rows for the surface.
 * @param {Number} low The lower end of the range to be rendered.
 * @param {Number} high The upper end of the range to be rendered.
 * @private
 */
nitobi.grid.Surface.prototype.renderGap = function(low, high) {

	var gaps = this.cacheMap.gaps(low,high);
	var mc = this.view.midcenter;
	var ml = this.view.midleft;

	if (gaps[0] != null)
	{
		var low = gaps[0].low;
		var high = gaps[0].high;

		var rows = high - low + 1;
		this.cacheMap.insert(low, high);
		mc.renderGap(low,high, this.dataTable.id, this.key);
		//ml.renderGap(low,high, dataTableId, this.key);
	}
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.reRender = function(start, end) 
{
	var range = this.view.midleft.clearBlocks(start, end);
	this.view.midcenter.clearBlocks(start, end);

	this.cacheMap.remove(range.top, range.bottom);

	this.performRender({first:range.top, last:range.bottom});
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.setSort = function(col, dir) 
{
	this.view.topleft.setSort(col, dir);
	this.view.topcenter.setSort(col, dir);
	this.view.midleft.setSort(col, dir);
	this.view.midcenter.setSort(col, dir);
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.setViewportProperty = function(property, value) 
{
	
	var sv = this.view;
	for (var i=0; i<EBAScroller_VIEWPANES.length; i++)
	{
		sv[EBAScroller_VIEWPANES[i]]["set"+property](value);
	}
};

/**
 * Creates and initializes the {@link nitobi.grid.RowRenderer} members used to render
 * rows to the surface.  Called during Grid initialization in {@link nitobi.grid.Grid#createChildren}
 * via {@link nitobi.grid.Scroller3x3#createRenderers}
 * @private
 */
nitobi.grid.Surface.prototype.createRenderers = function(data) 
{
	var ci = this.grid.isColumnIndicatorsEnabled();
	var rh = this.grid.isRowHighlightEnabled();
	var rowh = this.grid.getRowHeight();
	this.view.topleft.rowRenderer = new nitobi.grid.RowRenderer(data, this.columnsNode, 0, this.grid.uid, this.key, ci, rh, rowh);
	this.view.topcenter.rowRenderer = new nitobi.grid.RowRenderer(data, this.columnsNode, 0, this.grid.uid, this.key, ci, rh, rowh);
	this.view.midleft.rowRenderer = new nitobi.grid.RowRenderer(data, this.columnsNode, 0, this.grid.uid, this.key, 0, rh, rowh);
	this.view.midcenter.rowRenderer = new nitobi.grid.RowRenderer(data, this.columnsNode, 0, this.grid.uid, this.key, 0 , rh, rowh);
};

/**
 * @private
 */
nitobi.grid.Surface.prototype.setDataTable = function(oDataTable) 
{
	this.dataTable = oDataTable;
	// TODO: This is a hack to get around that datatable descriptor business
	this.dataTable.descriptor.isAtEndOfTable = true;
	this.view.midleft.rowRenderer.dataTableId = this.dataTable.id;
	this.view.midcenter.rowRenderer.dataTableId = this.dataTable.id;
};

/**
 * Splits a block of data in this surface at some given row index into two
 * separate blocks.
 * @param {Number} row The row index at which to perform the split.
 * @private
 */
nitobi.grid.Surface.prototype.splitBlock = function(row)
{
	return this.view.midcenter.splitBlock(row);
};

/**
 * Returns the html string that represents the container for the Surface.
 * @type String
 * @private
 */
nitobi.grid.Surface.prototype.renderContainer = function(uid, isSubgroup)
{
	isSubgroup = isSubgroup || false;
	this.surfaceXslProc.addParameter("uniqueId", uid, "");
	this.surfaceXslProc.addParameter("columnsId", this.columnsNode.getAttribute("id"), "");
	this.surfaceXslProc.addParameter("surfaceKey", this.key, "");
	this.surfaceXslProc.addParameter("isSubgroup", isSubgroup.toString(), "");
	this.surfaceXslProc.addParameter("groupOffset", this.grid.getGroupOffset(), "");
	var surfaceHtml = nitobi.xml.transformToString(nitobi.xml.createXmlDoc(""), this.surfaceXslProc);
	return surfaceHtml;
};

/**
 * Renders the header for the Surface.
 * @private
 */
nitobi.grid.Surface.prototype.renderHeader = function()
{
	var tc = this.view.topcenter;
	tc.top = 23;
	tc.left = 0;
	tc.renderGap(0, 0, false, this.key);
};

/**
 * Connects the Surface to a DataTable.  The surface subscribes to the DataReady event to
 * initiate rendering of the data.
 * @see #handleDataReady
 * @param {nitobi.data.DataTable} dataTable The DataTable to connect to the Surface.
 */
nitobi.grid.Surface.prototype.connectToTable = function(dataTable)
{
	this.dataTable = dataTable;
	this.view.midleft.rowRenderer.dataTableId = this.dataTable.id;
	this.view.midcenter.rowRenderer.dataTableId = this.dataTable.id;
	this.fieldMap = dataTable.fieldMap;
	// This should be a subscribe once, but the legacy nitobi.event doesn't support it.
	this.tempGuid = this.dataTable.subscribe("DataReady", nitobi.lang.close(this, this.initialize));
	this.dataTable.subscribe("RowDeleted", nitobi.lang.close(this, this.syncWithData));
	this.dataTable.subscribe("RowInserted", nitobi.lang.close(this, this.syncWithData));
};

/**
 * Performs the required initialization of the surface after its {@link nitobi.data.DataTable} has 
 * returned data.
 * @private
 */
nitobi.grid.Surface.prototype.initialize = function(eventArgs)
{
	this.bindColumns();
	this.rows = this.dataTable.getTotalRowCount();
	
	this.displayedRowCount = this.rows;
	this.renderHeader();
	// The divide by 5 is a hack to make sure the hack for initializeBlock doesn't mess this up
	this.initializeBlock((this.rows - 1)/5);
	this.onRenderComplete.notify(this.rows);
	this.dataTable.subscribe("DataReady",nitobi.lang.close(this,this.handleDataReady));
	this.performRender({first:eventArgs.firstRow, last:(eventArgs.lastRow > this.rows?this.rows:eventArgs.lastRow)});
	this.onSetVisible.subscribeOnce(this.grid.handleToggleSurface, this.grid);
	this.setVisible(true);
	nitobi.event.unsubscribe("DataReady" + this.dataTable.uid, this.tempGuid);
}

nitobi.grid.Surface.prototype.handleOnBeforeToggle = function(e)
{
	this.isVisible = e;
	if (e == true)
	{
		this.grid.resizeSurfaces();
		this.grid.adjustHorizontalScrollBars();
	}
}

nitobi.grid.Surface.prototype.handleOnAfterToggle = function(visible)
{
	this.isVisible = visible;
	if (e == false)
	{
		this.grid.resizeSurfaces();
		this.grid.adjustHorizontalScrollBars();
	}
	// This is a hack to get the sweet effect to work in IE/standards.
	if (nitobi.browser.IE && nitobi.lang.isStandards())
		this.htmlNode.style.position = "static";
	var e = new nitobi.base.EventArgs(this);
	e.visible = visible;
	this.onSetVisible.notify(e);
}

/**
 * Handles the DataReady event and renders the data to the Surface.  This event handler is registered
 * in {@link #initialize}
 * @private
 */
nitobi.grid.Surface.prototype.handleDataReady = function(eventArgs)
{
	this.performRender({first:eventArgs.firstRow, last:(eventArgs.lastRow > this.rows?this.rows:eventArgs.lastRow)});
}

/**
 * Defines on the column nodes of the surface their corresponding xdatafld.
 * @private
 */
nitobi.grid.Surface.prototype.bindColumns = function()
{
	var columns = this.columnsNode.childNodes;
	for (var i = 0; i < columns.length; i++)
	{
		var column = columns[i];
		var binding = column.getAttribute("xdatafld");
		if (this.dataTable.fieldMap[binding])
		{
			column.setAttribute("xdatafld", this.dataTable.fieldMap[binding]);
		}
	}
}

/**
 * Returns a column object of the surface for a given index.
 * @param {Number} index The index of the column to be retrieved.
 */
nitobi.grid.Surface.prototype.getColumnObject = function(index)
{
	var column = null;
	if (index > this.columnsNode.childNodes.length - 1)
		return null;
	if (index >= 0)
	{
		column = this.cachedColumns[index];
		if (column == null)
		{
			var dataType = this.columnsNode.childNodes[index].getAttribute("DataType");
			switch (dataType)
			{
				case "number": 
					column = new nitobi.grid.NumberColumn(this.grid, index, this);
					break;
				case "date":
					column = new nitobi.grid.DateColumn(this.grid, index, this);
					break;
				default:
					column = new nitobi.grid.TextColumn(this.grid, index, this);
					break;
			}
			this.cachedColumns[index] = column;
		}
	}

	if (column == null || column.getModel() == null)
	{
		return null;
	}
	else
	{
		return column;
	}
}

nitobi.grid.Surface.prototype.getCellObject = function(row, col)
{
	// col could be either string or number so we need to keep both the string and number versions in the cache ...
	var origCol = col;
	if (row > this.rows - 1 || col > this.columnsNode.childNodes.length - 1)
		return null;
	var cell = this.cachedCells[row+"_"+col];
	if (cell == null)
	{
		if (typeof(col) == "string")
		{
			//var node = this.model.selectSingleNode("state/nitobi.grid.Columns/nitobi.grid.Column[@xdatafld_orig='"+col+"']");
			var node = this.columnsNode.selectSingleNode("//ntb:column[@xdatafld_org='" + col + "']");
			if (node != null)
				col = parseInt(node.getAttribute('xi'));
		}
		if (typeof(col) == "number")
			cell = new nitobi.grid.Cell(this.grid, row, col, this);
		else
			cell = null;
		this.cachedCells[row+"_"+col] = this.cachedCells[row+"_"+origCol] = cell || "";
	} else if (cell == "") {
		cell = null;
	}
	return cell;
}

/**
 * Recalculates all the rows that are visible.  So if a surface's subsurface
 * is collapsed, it will not be counted.
 * @private
 */
nitobi.grid.Surface.prototype.recalculateRowCount = function()
{
	//var totalRows = this.rows;
	var totalRows = this.displayedRowCount;
	for (var id in this.surfaces)
	{
		var surface = this.surfaces[id];
		if (surface.isVisible)
		{
			totalRows += surface.recalculateRowCount();
		}
	}
	return totalRows;
};

/**
 * Sorts the surface.
 * @param {Number} colIndex The index of the column to sort on, starting at 0.
 * @param {String} sortDir The direction to sort the column by. Values are "Asc" and "Desc".
 */
nitobi.grid.Surface.prototype.sort = function(colIndex, sortDir)
{
	var headerColumn = this.getColumnObject(colIndex);
	this.setSortStyle(colIndex, sortDir);
	
	var colName = headerColumn.getColumnName();
	var dataType = headerColumn.getDataType();
	
	this.dataTable.sort(colName, sortDir, dataType, this.sortLocal);
	if(!this.sortLocal) 
	{
		this.dataTable.flush();
	}
	
	if (this.key == "0")
		this.grid.scroller.surfaceMap = {};
	this.purgeSurfaces();
};

/**
 * Sets the sort style on the sorted column or clears the currently sorted column style.
 * @private
 */
nitobi.grid.Surface.prototype.setSortStyle = function(sortCol, sortDir)
{
	var headerColumn = this.getColumnObject(sortCol);
	//	Set the sort direction on the header and assign the current sorted column properties of the Grid
	headerColumn.setSortDirection(sortDir);
	this.setColumnSortOrder(sortCol,sortDir);
	this.sortColumn = headerColumn;
	this.sortColumnCell = headerColumn.getHeaderElement();
	this.setSort(sortCol, sortDir);
}

/**
 * Sets the CSS styling of the column at colIndex in the direction specified by sortDir.
 * @param {Number} colIndex
 * @param {String} sortDir
 * @private
 */
nitobi.grid.Surface.prototype.setColumnSortOrder = function(sortCol, sortDir)
{
	this.clearColumnHeaderSortOrder();
	//	This does not need to be called in the case of sorting on the server
	//	since the entire grid is refiltered and the sort column stuff gets rendered in the XSLT
	var headerColumn = this.getColumnObject(sortCol);
	var headerCell = headerColumn.getHeaderElement();

	// The headerCopy is the header row that is pinned to the root header when the surface's header
	// is not visible.
	var headerCopy = headerColumn.getHeaderCopy();
	var CSS = nitobi.html.Css;

	var css = headerCell.className;
	if (headerCopy)
		var cssCopy = headerCopy.className;
	if (sortDir == "")
	{
		// If sortDir is nothing then just set the style to ntbcolumnindicator
		//headerCell.className = "ntb-column-indicator-border";
		headerCell.className = css.replace(/(ntb-column-indicator-border\S*)/g,"") + " ntb-column-indicator-border";
		if (headerCopy)
			headerCopy.className = cssCopy.replace(/(ntb-column-indicator-border\S*)/g,"") + " ntb-column-indicator-border";
		//headerCopy.className = "ntb-column-indicator-border";
		sortDir="Desc";
	}
	else
	{
		var replaceLambda = function(m)
		{
			var repl = (sortDir=="Desc" ? "descending" : "ascending");
			return (m.indexOf("hover") > 0 ? m.replace("hover", repl+"hover") : m + repl);
		};
		headerCell.className = css.replace(/(ntb-column-indicator-border\S*)/g,replaceLambda);
		if (headerCopy)
		{
			headerCopy.className = cssCopy.replace(/(ntb-column-indicator-border\S*)/g,replaceLambda);
		}
	}

	headerColumn.setSortDirection(sortDir);

	this.sortColumn = headerColumn;
	this.sortColumnCell = headerCell;
}

/**
 * Clears the sort CSS styling of the currently sorted column in the Grid.
 * @private
 */
nitobi.grid.Surface.prototype.clearColumnHeaderSortOrder = function()
{
	if (this.sortColumn) 
	{
		var headerColumn = this.sortColumn; //this.getColumnObject(this.sortColumn);
		var headerCell = headerColumn.getHeaderElement();
		// The headerCopy is the header row that is pinned to the root header when the surface's header
		// is not visible.
		var headerCopy = headerColumn.getHeaderCopy();
		var css = headerCell.className;
		css = css.replace(/ascending/gi,"").replace(/descending/gi,"");
		headerCell.className = css;
		if (headerCopy)
			headerCopy.className = css;
		this.sortColumn=null;
	}
}

/**
 * Adds a new row of data to the grid.
 * <P>Rows can also be inserted by the user by pressing the 
 * Insert key or by clicking on the toolbar icon.
 * </P>
 * <P>When rows are 
 * added to the grid, a new XML row node is added to the XML datasource.
 * In addition, a new node is added to the XML updategram which 
 * will be transmitted back to the server when the data is saved.
 * </P>
 * @param {Number} index A row will be inserted after the row at this index
 */
nitobi.grid.Surface.prototype.insertRow = function(index)
{
	var defaultRow = this.dataTable.getTemplateNode();
	for (var i = 0; i < this.columnsNode.childNodes.length; i++)
	{
		var columnObject = this.getColumnObject(i);
		var initialValue = columnObject.getInitial();
		if (initialValue == null || initialValue == "")
		{
			var dataType = columnObject.getDataType();
			// TODO: This is a temp fix for moz. DataType isn;t set correctly for some reason.
			if (dataType == null || dataType == "")
			{
				dataType = "text";
			}
			switch (dataType)
			{
				case "text":
				{
					initialValue="";
					break;
				}
				case "number":
				{
					initialValue=0;
					break;
				}
				case "date":
				{
					initialValue="1900-01-01";
					break;
				}
			}
		}
		var att = columnObject.getxdatafld().substr(1);
		if (att != null && att != "")
		{
			defaultRow.setAttribute(att, initialValue);
		}
	}
	this.displayedRowCount++;
	this.clear();
	this.grid.selection.clearBoxes();
	this.dataTable.createRecord(defaultRow, index);
}

nitobi.grid.Surface.prototype.clear = function()
{
	this.clearData();
	this.cacheMap.flush();
	this.purgeSurfaces();
}

/**
 * Deletes the row containing the cell referenced by the activeCell property.
 * <P>When rows are deleted from the grid, the corresponding XML record 
 * node is also deleted from the bound DataTable.</P><P>An XML updategram is 
 * created by the DataTable when a row is deleted. This updategram is sent to the 
 * server when the save() method is called to instruct the server to delete the 
 * corresponding record from the database.</P><P>Rows may also be deleted by pressing 
 * the Delete key or by clicking on the toolbar Delete icon.</P>
 */
nitobi.grid.Surface.prototype.deleteRow = function(index)
{
	// 1) Update row count
	// 2) Clear surface
	// 3) Delete from datatable
	this.displayedRowCount--;
	this.clear();
	this.onHtmlReady.subscribeOnce(nitobi.lang.close(this, this.handleAfterDeleteRow, [index]));
	this.dataTable.deleteRecord(index);
}

nitobi.grid.Surface.prototype.handleAfterDeleteRow = function(xi)
{
	this.grid.setActiveCell(this.grid.getCellElement(xi, 0, this.key));
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.syncWithData = function()
{
	// TODO: This is called when a row in the surface is inserted or deleted
	// ...Should be a better way to do this...
	var scrollTop = this.scroller.scrollSurface.scrollTop + this.scroller.headerHeight;
	var visibleRows = this.getUnrenderedBlocks(scrollTop);
	this.performRender(visibleRows);
};

/**
 * Empties the cache of child surfaces.
 * @private
 */
nitobi.grid.Surface.prototype.purgeSurfaces = function()
{
	for (var key in this.surfaces)
	{
		this.surfaces[key].purgeSurfaces();
	}
	this.surfaces = {};
	delete this.scroller.surfaceMap[this.key];
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.setRowCount = function(rows)
{
	this.rows = rows;
	this.displayedRowCount = this.rows;
}

/**
 * Saves changes from the surface and all its child surfaces.
 */
nitobi.grid.Surface.prototype.save = function()
{
	for (var key in this.surfaces)
	{
		var surface = this.surfaces[key];
		surface.save();
	}
	if (this.dataTable.log.selectNodes("//"+nitobi.xml.nsPrefix+"data/*").length == 0)
		return;

	this.dataTable.save(nitobi.lang.close(this.grid, this.grid.saveCompleteHandler), this.grid.getOnBeforeSaveEvent());
};

/**
 * Calculates the width of the surface based on the visible columns.
 * @private
 */
nitobi.grid.Surface.prototype.calculateWidth = function()
{
	var colDefs = this.columnsNode.childNodes;
	var cols = colDefs.length;
	start = 0;
	end = cols;
	var wT = 0;
	for (var i = start; i < end; i++) {
		if (colDefs[i].getAttribute("Visible") == "1" || colDefs[i].getAttribute("visible") == "1") {
			wT+=Number(colDefs[i].getAttribute("Width"));
		}
	}
	// TODO: I hate this...but we need to account for the surface's indentation, if any -Mike...
	var offset = nitobi.html.getFirstChild(this.htmlNode).offsetLeft;
	return wT + offset;
};

/**
 * Subscribes events specified via the declaration.
 * @private
 */
nitobi.grid.Surface.prototype.subscribeColumnEvents = function()
{
	if (this.columnsNode == null)
		return;
	
	var expandColumn = this.columnsNode.selectSingleNode("//ntb:column[@type='EXPAND']");
	if (expandColumn == null)
		return;
	for (var name in this.eventMap)
	{
		var ev = expandColumn.getAttribute(name);
		if (ev != null && ev != "")
		{
			this.eventMap[name].subscribe(ev,this,name);
		}
	}
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.getDepth = function()
{
	if (this.depth)
		return this.depth;
	
	return this.depth = this.key.split("_").length;
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.checkHeaders = function()
{
	var s = this.surfaces;
	var containerHeight = this.grid.getSubHeaderContainer().offsetHeight;
	for (var key in s)
	{
		var surface = s[key];
		// IE6 calculates the offset incorrectly for some reason...
		var rt = surface.calculateOffsetTop() - (nitobi.browser.IE6?headerHeight:0);
		var rb = rt + surface.view.midcenter.surface.offsetHeight;
		var visibleTop = this.scroller.scrollSurface.scrollTop;
		var visibleBottom = visibleTop + this.scroller.scrollSurface.offsetHeight;
		var headerHeight = this.grid.getHeaderHeight();
		if (surface.isVisible && surface.headerAttached && (rb <= visibleTop + containerHeight || (rt >= visibleTop + containerHeight && rt - (nitobi.browser.IE6?headerHeight:0) <= visibleBottom)))
		{
			surface.clearTopHeader();
		}
		else if (surface.isVisible && visibleTop + headerHeight + containerHeight >= rt && visibleTop + containerHeight + headerHeight <= rb && !surface.headerAttached)
		{
			surface.attachTopHeader();
		}
		surface.checkHeaders();
	}
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.attachTopHeader = function()
{
	// TODO: Clean up!!!
	var subHeader = this.header = this.view.topcenter.element.cloneNode(true);
	var Css = nitobi.html.Css;
	sbStyle = subHeader.style;
	sbStyle.left = ((this.getDepth()-1) * this.grid.getGroupOffset()) + 1 + "px";
	sbStyle.position = "relative";
	sbStyle.overflow = "visible";
	Css.removeClass(subHeader, "ntb-grid-header");
	Css.addClass(nitobi.html.getFirstChild(subHeader), "ntb-grid-header");
	var gridSubHeader = this.grid.getSubHeaderContainer();
	gridSubHeader.appendChild(subHeader);
	for (var i = 0; i < this.columnsNode.childNodes.length; i++)
	{
		var col = this.getColumnObject(i);
		var headerElement = col.getHeaderElement();
		var id = headerElement.getAttribute("id");
		headerElement.setAttribute("id", id + "copy");
	}
	gridSubHeader.style.display = "block";
	this.headerAttached = true;
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.clearTopHeader = function()
{
	if (this.header)
	{
		this.grid.getSubHeaderContainer().removeChild(this.header);
		this.headerAttached = false;
		this.header = null;
		if (this.grid.getSubHeaderContainer().childNodes.length == 0)
		{
			this.grid.getSubHeaderContainer().style.display = "none";
		}
	}
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.setVisible = function(visible)
{
	if (this.grid.isEffectsEnabled())
	{
		if (this.effect)
			this.effect.end();
		var params = {};
		var effect = (visible?new this.showEffect(this.htmlNode, params):new this.hideEffect(this.htmlNode, params));
		this.effect = effect;
		// This is a hack to get the sweet effect to work in IE/standards.
		if (nitobi.browser.IE && nitobi.lang.isStandards())
			this.htmlNode.style.position = "relative";

		effect.onFinish.subscribeOnce(nitobi.lang.close(this, function(){this.effect = null}));
		effect.onBeforeStart.subscribe(nitobi.lang.close(this, this.handleOnBeforeToggle, [visible]));
		effect.onFinish.subscribe(nitobi.lang.close(this, this.handleOnAfterToggle, [visible]));
		effect.start();
	}
	else
	{
		this.handleOnBeforeToggle(visible);
		
		if (visible)
			nitobi.html.Css.removeClass(this.htmlNode, NTB_CSS_HIDE);
		else
			nitobi.html.Css.addClass(this.htmlNode, NTB_CSS_HIDE);
		this.handleOnAfterToggle(visible);
	}
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.expand = function()
{
	this.parent.onBeforeExpand.notify();
	this.setVisible(true);
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.collapse = function()
{
	this.parent.onBeforeCollapse.notify();
	this.setVisible(false);
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.isCellInSurface = function(cell)
{
	if (!cell)
		return false;
	return nitobi.grid.Cell.getSurfacePath(cell).indexOf(this.key) == 0;
}

/**
 * @private
 */
nitobi.grid.Surface.prototype.dispose = function()
{
	this.htmlNode = null;
	this.surfaces = null;
	this.cachedColumns = null;
	this.cachedCells = null;
}