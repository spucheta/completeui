/* -----------------------------------------------------------
 *
 * nitobi Grid V3.0
 *
 * Details and latest version at:
 * http://www.nitobi.com
 *
 *
 * Copyright 2002-2007 Nitobi ALL RIGHTS RESERVED. DO NOT MAKE PUBLIC 
 * Copyright in the whole and every part of this document belongs to Nitobi. 
 * It is also the confidential information of Nitobi. 
 * You may not use, sell, license, transfer, copy or reproduce it in whole or in part 
 * in any manner or form or in or on any media to any person other than in accordance 
 * with the terms of the License or as otherwise agreed in writing with Nitobi. 
 *
 *
 * TradeMark Information
 * The nitobi Grid and eBusiness Applications logos are trademarks of Nitobi.
 * All other trademarks are acknowledged and are the property of their respective owners. 
 *
 */

nitobi.lang.defineNs("nitobi.grid");

if (false)
{
	/**
	 * <i>There is no constructor for this class.</i>
	 * @class <code>nitobi.grid</code> is the namespace for classes that make up 
	 * the Nitobi Grid component.  You're probably looking for documentation about one of
	 * the classes below.  {@link nitobi.grid.Grid} is the class of object you will get if you
	 * use {@link nitobi#getComponent} or <code>$('&lt;COMPONENT_ID&gt;').jsObject</code>.
	 * <p>
	 * The most commonly used classes are {@link nitobi.grid.Grid}, {@link nitobi.grid.Cell},
	 * and {@link nitobi.grid.Column}
	 * </p>
	 * @constructor
	 */
	nitobi.grid = function(){};
}

/**
 * Static property used to create a non-paging Grid.
 */
nitobi.grid.PAGINGMODE_NONE="none";
/**
 * Static property used to create a standard paging Grid.
 */
nitobi.grid.PAGINGMODE_STANDARD="standard";
/**
 * Static property used to create a live scrolling Grid.
 */
nitobi.grid.PAGINGMODE_LIVESCROLLING="livescrolling";

/*
standard - remote standard paging (no caching)
livescrolling - remote livescrolling (with caching)
localpaging - local paging
nonpaging - local or remote data with no paging
smartpaging - remote standard paging (with caching)
locallivescrolling - local livescrolling
*/

/**
 * Creates a new Grid component.
 * @class The nitobi.grid.Grid class is used to create Grid components. More often than not, you'll be instantiating a Grid via a declaration.
 * For example, a databound grid declaration might look like this:
 * <div class="code">
 * <pre><code class="html">
 * &lt;ntb:grid id="DataboundGrid" gethandler="get.do" savehandler="save.do" mode="livescrolling"&gt;&lt;/ntb:grid&gt;
 * </code></pre>
 * </div>
 * <p>
 * A grid that uses locally defined data might declared like so:
 * </p>
 * <div class="code">
 * <pre><code class="html">
 * &lt;ntb:grid id="SimpleGrid" width="350" height="300" mode="locallivescrolling" datasourceid="data" toolbarenabled="true"&gt;
 * 	&lt;ntb:datasources&gt;
 *		&lt;ntb:datasource id="data"&gt;
 *			&lt;ntb:datasourcestructure FieldNames="Name|FavColor|FavAnimal"&nbsp;&nbsp;&gt;&lt;/ntb:datasourcestructure&gt;
 *			&lt;ntb:data&gt;
 *				&lt;ntb:e xi="1" a="Tammara Farley" b="blue" c="cat" &gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="2" a="Dwana Barton" b="red" c="dog"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="3" a="Lucas Blake" b="green" c="ferret"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="4" a="Lilli Bender" b="grey" c="squirrel"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="5" a="Emilia Foster" b="orange" c="pig"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="7" a="Crystal House" b="brown" c="horse"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="8" a="Lindsay Cohen" b="cyan" c="cow"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="12" a="Lindsay Bender" b="grey" c="squirrel"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="13" a="Emilia Foster" b="orange" c="pig"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="14" a="Dwana Irwin" b="beige" c="crocodile"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="15" a="Steve Lilli" b="brown" c="horse"&gt;&lt;/ntb:e&gt;
 *				&lt;ntb:e xi="16" a="Lindsay Dwana" b="cyan" c="cow"&gt;&lt;/ntb:e&gt;
 *			&lt;/ntb:data&gt;
 *		&lt;/ntb:datasource&gt;								
 *	&lt;/ntb:datasources&gt;
 * &lt;/ntb:grid&gt;</code></pre>
 * </div>
 * The <code>mode</code> attribute on the <code>ntb:grid</code> declaration defines what sort of Grid to instantiate such as
 * LiveScrolling, LocalPaging, NonPaging, or Standard.
 * To instantiate through script a specific version of the Grid class should be instantiated such as: 
 * <div class="code">
 * <pre><code class="javascript">
 * var myGrid = new nitobi.grid.GridLiveScrolling();
 * myGrid.setPagingMode(nitobi.grid.PAGINGMODE_LIVESCROLLING);
 * myGrid.setDataMode(nitobi.data.DATAMODE_CACHING);
 * myGrid.setGetHandler("data.xml");
 * myGrid.attachToParentDomElement(document.getElementById("myGrid"));
 * myGrid.bind();
 * </code></pre>
 * </div>
 * @constructor
 * @param {String} uid The unique ID of the Grid. 
 * @see #mode
 * @see nitobi.grid.GridLiveScrolling
 * @see nitobi.grid.GridNonpaging
 * @see nitobi.grid.GridLocalPage
 * @see nitobi.grid.GridStandard
 */
nitobi.grid.TreeGrid = function(uid) {
	//MJD:Commented out call to prepare because im having problems with it not generating the prepare now.
	//Other controls dont seem to have this problem with the builds im doing.
	//nitobi.prepare();
	
	// pre-compile accessors (if necessary)
	/**
	 * @private
	 */
	EBAAutoRender=false;

	/**
	 * @private
	 */
	this.disposal = [];

	/**
	 * @private
	 */
	this.uid = uid || nitobi.base.getUid();

	// TODO: Move this into a base class
	/**
	 * @private
	 * This is a hash of named attributes to XML DOM nodes (attributes or elements) in the Grid model.
	 */
	this.modelNodes = {};

	//	First thing is to register the dispose method onunload.
	//	We do not use he regular unload mechanism since it will not get call
	//	cause it will be detached by the global nitobi unload cleanup method.
	//	This will add the disposed method to a custom list that will also be called on global unload
	if (nitobi.browser.IE6) {
		nitobi.html.addUnload(nitobi.lang.close(this, this.dispose));
	}

	// Attach event handlers
	this.subscribe("AttachToParent",this.initialize);
	this.subscribe("DataReady",this.layout);

	this.subscribe("AfterCellEdit",this.autoSave);
	this.subscribe("AfterRowInsert",this.autoSave);
	this.subscribe("AfterRowDelete",this.autoSave);
	this.subscribe("AfterPaste",this.autoSave);
	this.subscribe("AfterPaste",this.focus);

	// We need to check if the horizontal scroll bar needs to be drawn after it's
	// rendered and everytime the grid is resized.
	this.subscribeOnce("HtmlReady", this.adjustHorizontalScrollBars);
	this.subscribe("AfterGridResize", this.adjustHorizontalScrollBars)

	/**
	 * Various events that are attached to the root of the Grid HTML.
	 * @type Array
	 */
	this.events = [];

	/**
	 * Various events that are attached to the Grid scroller element that contains both the data and header.
	 * @type Array
	 */
	this.scrollerEvents = [];

	/**
	 * Various events that are attached to the Grid data element, which contains the rendered data cells.
	 * @type Array
	 */
	this.cellEvents = [];

	/**
	 * Various events that are attached to the Grid header element, which contains the column headers.
	 * @type Array
	 */
	this.headerEvents = [];

	/**
	 * Various key events that are attached to the Grid key navigator element.
	 * @type Array
	 */
	this.keyEvents = [];
}

nitobi.lang.implement(nitobi.grid.TreeGrid, nitobi.Object);

nitobi.grid.TreeGrid.prototype.properties = {
	// JS properties
	id:{n:"ID",t:"",d:"",p:"j"},
	selection:{n:"Selection",t:"",d:null,p:"j"},
	bound:{n:"Bound",t:"",d:false,p:"j"},
	registeredto:{n:"RegisteredTo",t:"",d:true,p:"j"},
	licensekey:{n:"LicenseKey",t:"",d:true,p:"j"},
	columns:{n:"Columns",t:"",d:true,p:"j"},
	columnsdefined:{n:"ColumnsDefined",t:"",d:false,p:"j"},
	declaration:{n:"Declaration",t:"",d:"",p:"j"},
	datasource:{n:"Datasource",t:"",d:true,p:"j"},
	keygenerator:{n:"KeyGenerator",t:"",d:"",p:"j"},
	version:{n:"Version",t:"",d:3.01,p:"j"},
	cellclicked:{n:"CellClicked",t:"",d:false,p:"j"},

		// XML properties
	uid:{n:"uid",t:"s",d:"",p:"x"},
	datasourceid:{n:"DatasourceId",t:"s",d:"",p:"x"},
	currentpageindex:{n:"CurrentPageIndex",t:"i",d:0,p:"x"},
	columnindicatorsenabled:{n:"ColumnIndicatorsEnabled",t:"b",d:true,p:"x"},
	rowindicatorsenabled:{n:"RowIndicatorsEnabled",t:"b",d:false,p:"x"},
	toolbarenabled:{n:"ToolbarEnabled",t:"b",d:true,p:"x"},
	toolbarheight:{n:"ToolbarHeight",t:"i",d:25,p:"x"},
	rowhighlightenabled:{n:"RowHighlightEnabled",t:"b",d:false,p:"x"},
	rowselectenabled:{n:"RowSelectEnabled",t:"b",d:false,p:"x"},
	gridresizeenabled:{n:"GridResizeEnabled",t:"b",d:false,p:"x"},
	widthfixed:{n:"WidthFixed",t:"b",d:false,p:"x"},
	heightfixed:{n:"HeightFixed",t:"b",d:false,p:"x"},
	minwidth:{n:"MinWidth",t:"i",d:20,p:"x"},
	minheight:{n:"MinHeight",t:"i",d:0,p:"x"},
	singleclickeditenabled:{n:"SingleClickEditEnabled",t:"b",d:false,p:"x"},
	autokeyenabled:{n:"AutoKeyEnabled",t:"b",d:false,p:"x"},
	tooltipsenabled:{n:"TooltipsEnabled",t:"b",d:false,p:"x"},
	entertab:{n:"EnterTab",t:"s",d:"down",p:"x"},
	hscrollbarenabled:{n:"HScrollbarEnabled",t:"b",d:true,p:"x"},
	vscrollbarenabled:{n:"VScrollbarEnabled",t:"b",d:true,p:"x"},
	rowheight:{n:"RowHeight",t:"i",d:23,p:"x"},
	headerheight:{n:"HeaderHeight",t:"i",d:23,p:"x"},
	top:{n:"top",t:"i",d:0,p:"x"},
	left:{n:"left",t:"i",d:0,p:"x"},
	scrollbarwidth:{n:"scrollbarWidth",t:"i",d:22,p:"x"},
	scrollbarheight:{n:"scrollbarHeight",t:"i",d:22,p:"x"},
	freezetop:{n:"freezetop",t:"i",d:0,p:"x"},
	frozenleftcolumncount:{n:"FrozenLeftColumnCount",t:"i",d:0,p:"x"},
	rowinsertenabled:{n:"RowInsertEnabled",t:"b",d:true,p:"x"},
	rowdeleteenabled:{n:"RowDeleteEnabled",t:"b",d:true,p:"x"},
	asynchronous:{n:"Asynchronous",t:"b",d:true,p:"x"},
	autosaveenabled:{n:"AutoSaveEnabled",t:"b",d:false,p:"x"},
	columncount:{n:"ColumnCount",t:"i",d:0,p:"x"},
	rowsperpage:{n:"RowsPerPage",t:"i",d:20,p:"x"},
	forcevalidate:{n:"ForceValidate",t:"b",d:false,p:"x"},
	height:{n:"Height",t:"i",d:100,p:"x"},
	lasterror:{n:"LastError",t:"s",d:"",p:"x"},
	multirowselectenabled:{n:"MultiRowSelectEnabled",t:"b",d:false,p:"x"},
	multirowselectfield:{n:"MultiRowSelectField",t:"s",d:"",p:"x"},
	multirowselectattr:{n:"MultiRowSelectAttr",t:"s",d:"",p:"x"},
	gethandler:{n:"GetHandler",t:"s",d:"",p:"x"},
	savehandler:{n:"SaveHandler",t:"s",d:"",p:"x"},
	width:{n:"Width",t:"i",d:"",p:"x"},
	pagingmode:{n:"PagingMode",t:"s",d:"LiveScrolling",p:"x"},
	datamode:{n:"DataMode",t:"s",d:"Caching",p:"x"},
	rendermode:{n:"RenderMode",t:"s",d:"",p:"x"},
	copyenabled:{n:"CopyEnabled",t:"b",d:true,p:"x"},
	pasteenabled:{n:"PasteEnabled",t:"b",d:true,p:"x"},
	sortenabled:{n:"SortEnabled",t:"b",d:true,p:"x"},
	sortmode:{n:"SortMode",t:"s",d:"default",p:"x"},
	editmode:{n:"EditMode",t:"b",d:false,p:"x"},
	expanding:{n:"Expanding",t:"b",d:false,p:"x"},
	theme:{n:"Theme",t:"s",d:"nitobi",p:"x"},
	cellborder:{n:"CellBorder",t:"i",d:0,p:"x"},
	dragfillenabled:{n:"DragFillEnabled",t:"b",d:true,p:"x"},
	rootcolumns:{n:"RootColumns",t:"s",d:"root",p:"x"},
	viewablewidth:{n:"ViewableWidth",t:"i",d:0,p:"x"},
	groupoffset:{n:"GroupOffset",t:"i",d:0,p:"x"},
	effectsenabled:{n:"EffectsEnabled",t:"b",d:false,p:"x"},
	
	cellborderx:{n:"CellBorderX",t:"i",d:0,p:"x"},
	cellbordery:{n:"CellBorderY",t:"i",d:0,p:"x"},
	
		// Events
	oncellclickevent:{n:"OnCellClickEvent",t:"",p:"e"},
	onbeforecellclickevent:{n:"OnBeforeCellClickEvent",t:"",p:"e"},
	oncelldblclickevent:{n:"OnCellDblClickEvent",t:"",p:"e"},
	ondatareadyevent:{n:"OnDataReadyEvent",t:"",p:"e"},
	onhtmlreadyevent:{n:"OnHtmlReadyEvent",t:"",p:"e"},
	ondatarenderedevent:{n:"OnDataRenderedEvent",t:"",p:"e"},
	oncelldoubleclickevent:{n:"OnCellDoubleClickEvent",t:"",p:"e"},
	onafterloaddatapageevent:{n:"OnAfterLoadDataPageEvent",t:"",p:"e"},
	onbeforeloaddatapageevent:{n:"OnBeforeLoadDataPageEvent",t:"",p:"e"},
	onafterloadpreviouspageevent:{n:"OnAfterLoadPreviousPageEvent",t:"",p:"e"},
	onbeforeloadpreviouspageevent:{n:"OnBeforeLoadPreviousPageEvent",t:"",p:"e"},
	onafterloadnextpageevent:{n:"OnAfterLoadNextPageEvent",t:"",p:"e"},
	onbeforeloadnextpageevent:{n:"OnBeforeLoadNextPageEvent",t:"",p:"e"},
	onbeforecelleditevent:{n:"OnBeforeCellEditEvent",t:"",p:"e"},
	onaftercelleditevent:{n:"OnAfterCellEditEvent",t:"",p:"e"},
	onbeforerowinsertevent:{n:"OnBeforeRowInsertEvent",t:"",p:"e"},
	onafterrowinsertevent:{n:"OnAfterRowInsertEvent",t:"",p:"e"},
	onbeforesortevent:{n:"OnBeforeSortEvent",t:"",p:"e"},
	onaftersortevent:{n:"OnAfterSortEvent",t:"",p:"e"},
	onbeforerefreshevent:{n:"OnBeforeRefreshEvent",t:"",p:"e"},
	onafterrefreshevent:{n:"OnAfterRefreshEvent",t:"",p:"e"},
	onbeforesaveevent:{n:"OnBeforeSaveEvent",t:"",p:"e"},
	onaftersaveevent:{n:"OnAfterSaveEvent",t:"",p:"e"},
	onhandlererrorevent:{n:"OnHandlerErrorEvent",t:"",p:"e"},
	onrowblurevent:{n:"OnRowBlurEvent",t:"",p:"e"},
	oncellfocusevent:{n:"OnCellFocusEvent",t:"",p:"e"},
	onfocusevent:{n:"OnFocusEvent",t:"",p:"e"},
	oncellblurevent:{n:"OnCellBlurEvent",t:"",p:"e"},
	onafterrowdeleteevent:{n:"OnAfterRowDeleteEvent",t:"",p:"e"},
	onbeforerowdeleteevent:{n:"OnBeforeRowDeleteEvent",t:"",p:"e"},
	oncellupdateevent:{n:"OnCellUpdateEvent",t:"",p:"e"},
	onrowfocusevent:{n:"OnRowFocusEvent",t:"",p:"e"},
	onbeforecopyevent:{n:"OnBeforeCopyEvent",t:"",p:"e"},
	onaftercopyevent:{n:"OnAfterCopyEvent",t:"",p:"e"},
	onbeforepasteevent:{n:"OnBeforePasteEvent",t:"",p:"e"},
	onafterpasteevent:{n:"OnAfterPasteEvent",t:"",p:"e"},
	onerrorevent:{n:"OnErrorEvent",t:"",p:"e"},
	oncontextmenuevent:{n:"OnContextMenuEvent",t:"",p:"e"},
	oncellvalidateevent:{n:"OnCellValidateEvent",t:"",p:"e"},
	onkeydownevent:{n:"OnKeyDownEvent",t:"",p:"e"},
	onkeyupevent:{n:"OnKeyUpEvent",t:"",p:"e"},
	onkeypressevent:{n:"OnKeyPressEvent",t:"",p:"e"},
	onmouseoverevent:{n:"OnMouseOverEvent",t:"",p:"e"},
	onmouseoutevent:{n:"OnMouseOutEvent",t:"",p:"e"},
	onmousemoveevent:{n:"OnMouseMoveEvent",t:"",p:"e"},
	onhitrowendevent:{n:"OnHitRowEndEvent",t:"",p:"e"},
	onhitrowstartevent:{n:"OnHitRowStartEvent",t:"",p:"e"},
	onafterdragfillevent:{n:"OnAfterDragFillEvent",t:"",p:"e"},
	onbeforedragfillevent:{n:"OnBeforeDragFillEvent",t:"",p:"e"},
	onafterresizeevent:{n:"OnAfterResizeEvent",t:"",p:"e"},
	onbeforeresizeevent:{n:"OnBeforeResizeEvent",t:"",p:"e"}
};

// This is a temporary thing to map lowercase attribute names to uppercase ones
nitobi.grid.TreeGrid.prototype.xColumnProperties = {
	column: {
		align:{n:"Align",t:"s",d:"left"},
		classname:{n:"ClassName",t:"s",d:""},
		cssstyle:{n:"CssStyle",t:"s",d:""},
		columnname:{n:"ColumnName",t:"s",d:""},
		type:{n:"Type",t:"s",d:"text"},
		datatype:{n:"DataType",t:"s",d:"text"},
		editable:{n:"Editable",t:"b",d:true},
		initial:{n:"Initial",t:"s",d:""},
		label:{n:"Label",t:"s",d:""},
		gethandler:{n:"GetHandler",t:"s",d:""},
		datasource:{n:"DataSource",t:"s",d:""},
		template:{n:"Template",t:"s",d:""},
		templateurl:{n:"TemplateUrl",t:"s",d:""},
		maxlength:{n:"MaxLength",t:"i",d:255},
		sortdirection:{n:"SortDirection",t:"s",d:"Desc"},
		sortenabled:{n:"SortEnabled",t:"b",d:true},
		width:{n:"Width",t:"i",d:100},
		visible:{n:"Visible",t:"b",d:true},
		xdatafld:{n:"xdatafld",t:"s",d:""},
		value:{n:"Value",t:"s",d:""},
		xi:{n:"xi",t:"i",d:100},
		oncellclickevent:{n:"OnCellClickEvent"},
		onbeforecellclickevent:{n:"OnBeforeCellClickEvent"},
		oncelldblclickevent:{n:"OnCellDblClickEvent"},
		onheaderdoubleclickevent:{n:"OnHeaderDoubleClickEvent"},
		onheaderclickevent:{n:"OnHeaderClickEvent"},
		onbeforeresizeevent:{n:"OnBeforeResizeEvent"},
		onafterresizeevent:{n:"OnAfterResizeEvent"},
		oncellvalidateevent:{n:"OnCellValidateEvent"},
		onbeforecelleditevent:{n:"OnBeforeCellEditEvent"},
		onaftercelleditevent:{n:"OnAfterCellEditEvent"},
		oncellblurevent:{n:"OnCellBlurEvent"},
		oncellfocusevent:{n:"OnCellFocusEvent"},
		onbeforesortevent:{n:"OnBeforeSortEvent"},
		onaftersortevent:{n:"OnAfterSortEvent"},
		oncellupdateevent:{n:"OnCellUpdateEvent"},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	textcolumn: {
	},
	numbercolumn: {
		align:{n:"Align",t:"s",d:"right"},
		mask:{n:"Mask",t:"s",d:"#,###.00"},
		negativemask:{n:"NegativeMask",t:"s",d:""},
		groupingseparator:{n:"GroupingSeparator",t:"s",d:","},
		decimalseparator:{n:"DecimalSeparator",t:"s",d:"."},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	datecolumn: {
		mask:{n:"Mask",t:"s",d:"M/d/yyyy"},
		calendarenabled:{n:"CalendarEnabled",t:"b",d:true}
	},
	expandcolumn: {
		childcolumnset:{n:"ChildColumnSet",t:"s"},
		onbeforeexpandevent:{n:"BeforeExpand"},
		onafterexpandevent:{n:"AfterExpand"},
		onbeforecollapseevent:{n:"BeforeCollapse"},
		onaftercollapseevent:{n:"AfterCollapse"}
	},
	listboxeditor: {
		datasourceid:{n:"DatasourceId",t:"s",d:""},
		datasource:{n:"Datasource",t:"s",d:""},
		gethandler:{n:"GetHandler",t:"s",d:""},
		displayfields:{n:"DisplayFields",t:"s",d:""},
		valuefield:{n:"ValueField",t:"s",d:""},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	lookupeditor: {
		datasourceid:{n:"DatasourceId",t:"s",d:""},
		datasource:{n:"Datasource",t:"s",d:""},
		gethandler:{n:"GetHandler",t:"s",d:""},
		displayfields:{n:"DisplayFields",t:"s",d:""},
		valuefield:{n:"ValueField",t:"s",d:""},
		delay:{n:"Delay",t:"s",d:""},
		size:{n:"Size",t:"s",d:6},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"},
		forcevalidoption:{n:"ForceValidOption",t:"b",d:false},
		autocomplete:{n:"AutoComplete",t:"b",d:true},
		autoclear:{n:"AutoClear",t:"b",d:false},
		getonenter:{n:"GetOnEnter",t:"b",d:false},
		referencecolumn:{n:"ReferenceColumn",t:"s",d:""}
	},
	checkboxeditor: {
		datasourceid:{n:"DatasourceId",t:"s",d:""},
		datasource:{n:"Datasource",t:"s",d:""},
		gethandler:{n:"GetHandler",t:"s",d:""},
		displayfields:{n:"DisplayFields",t:"s",d:""},
		valuefield:{n:"ValueField",t:"s",d:""},
		checkedvalue:{n:"CheckedValue",t:"s",d:""},
		uncheckedvalue:{n:"UnCheckedValue",t:"s",d:""}
	},
	linkeditor: {
		openwindow:{n:"OpenWindow",t:"b",d:true}
	},
	texteditor: {
		maxlength:{n:"MaxLength",t:"i",d:255},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	numbereditor: {
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	textareaeditor: {
		maxlength:{n:"MaxLength",t:"i",d:255},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	dateeditor: {
		mask:{n:"Mask",t:"s",d:"M/d/yyyy"},
		calendarenabled:{n:"CalendarEnabled",t:"b",d:true},
		onkeydownevent:{n:"OnKeyDownEvent"},
		onkeyupevent:{n:"OnKeyUpEvent"},
		onkeypressevent:{n:"OnKeyPressEvent"},
		onchangeevent:{n:"OnChangeEvent"}
	},
	imageeditor: {
		imageurl:{n:"ImageUrl",t:"s",d:""}
	},
	passwordeditor: {
	}
};

nitobi.grid.TreeGrid.prototype.typeAccessorCreators = {
	s:function() {}, //string
	b:function() {}, //bool
	i:function() {}, //integer
	n:function() {} //number
	};

nitobi.grid.TreeGrid.prototype.createAccessors = function(name) {
	var item = nitobi.grid.TreeGrid.prototype.properties[name];
	nitobi.grid.TreeGrid.prototype["set"+item.n] = function() {this[item.p+item.t+"SET"](item.n, arguments)};
	nitobi.grid.TreeGrid.prototype["get"+item.n] = function() {return this[item.p+item.t+"GET"](item.n, arguments)};
	nitobi.grid.TreeGrid.prototype["is"+item.n] = function() {return this[item.p+item.t+"GET"](item.n, arguments)};
	nitobi.grid.TreeGrid.prototype[item.n] = item.d;
}

//nitobi.grid.TreeGrid.prototype.properties
for (var name in nitobi.grid.TreeGrid.prototype.properties)
{
	nitobi.grid.TreeGrid.prototype.createAccessors(name);
}

/**
 * Initializes the component and creates all children objects of the component. This method is called implicitly 
 * when the component is attached to a DOM element in the web page. This is primarily for use by component developers.
 * @private
 */
nitobi.grid.TreeGrid.prototype.initialize= function() 
{
	// Called when parent.addChild() occurs 
	this.fire("Preinitialize");
	this.initializeFromCss();
	this.createChildren(); // Each subclass overrides this method to create its own children
	this.fire("AfterInitialize");
	this.fire("CreationComplete");
}

/**
 * Initializes properties such as header height and row height from CSS classes.
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeFromCss = function()
{
	this.CellHoverColor = this.getThemedStyle("ntb-cell-hover", "backgroundColor") || "#C0C0FF";
	this.RowHoverColor = this.getThemedStyle("ntb-row-hover", "backgroundColor") || "#FFFFC0";
	this.CellActiveColor = this.getThemedStyle("ntb-cell-active", "backgroundColor") || "#F0C0FF";
	this.RowActiveColor = this.getThemedStyle("ntb-row-active", "backgroundColor") || "#FFC0FF";

	var rowHeight = this.getThemedStyle("ntb-row", "height");
	if (rowHeight != null && rowHeight != "")
		this.setRowHeight(parseInt(rowHeight));

	var headerHeight = this.getThemedStyle("ntb-grid-header", "height");
	if (headerHeight != null && headerHeight != "")
		this.setHeaderHeight(parseInt(headerHeight));
	
	var ntbSubgroup = this.getThemedClass("ntb-grid-subgroup");
	if (ntbSubgroup != null && ntbSubgroup.left != null && ntbSubgroup.left != "" && this.getGroupOffset() == 0)
		this.setGroupOffset(parseInt(ntbSubgroup.left));
	
	var cellBorder = this.getThemedClass("ntb-cell-border");
	if (cellBorder != null)
	{
		this.setCellBorderX(parseInt(cellBorder.borderLeftWidth + 0) + parseInt(cellBorder.borderRightWidth +0));
		this.setCellBorderY(parseInt(cellBorder.borderTopWidth + 0) + parseInt(cellBorder.borderBottomWidth +0));	
	}
	
	if (nitobi.browser.IE && nitobi.lang.isStandards()) {
		// We need to get the cell padding values
		var cellBorder = this.getThemedClass("ntb-cell-border");
		if (cellBorder != null)
			this.setCellBorder(parseInt(cellBorder.borderLeftWidth+0) + parseInt(cellBorder.borderRightWidth+0) + parseInt(cellBorder.paddingLeft+0) + parseInt(cellBorder.paddingRight+0));
	}
/*
	// TODO:
	// In IE standards mode we need to do some rowHeight and headerHeight adjustments for padding ...
	// Maybe in Firefox too ...
	var cellClass = nitobi.html.Css.getClass(".ntb-cell");
	var rowClass = nitobi.html.Css.getClass(".ntb-row"+this.uid);
	rowClass.height = parseInt(rowClass.height) - (parseInt(cellClass.paddingTop) + parseInt(cellClass.paddingTop));
*/
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.getThemedClass = function(clazz)
{
	var C = nitobi.html.Css;
	var r = C.getRule("." + this.getTheme() + " ." + clazz) || C.getRule("."+clazz);
	var ret = null;
	if (r != null && r.style != null)
		ret = r.style;
	return ret;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.getThemedStyle = function(clazz, style)
{
	return nitobi.html.Css.getClassStyle("." + this.getTheme() + " ." + clazz, style);
}

/**
 * Sets the xmlDataSource property of the various renderers associated with the Grid. This method is called from connectToDataSet.
 * @private
 * @param {nitobi.data.DataSet} dataSet The DataSet to connect the renders to.
 * @see #connectToDataSet
 */
nitobi.grid.TreeGrid.prototype.connectRenderersToDataSet= function(dataset) 
{
	// TODO: Tree Grid diff
	// TODO: Subscribe scroller to the connecting of dataset
	this.Scroller.surface.view.topleft.rowRenderer.xmlDataSource = dataset;
	this.Scroller.surface.view.topcenter.rowRenderer.xmlDataSource = dataset;
	this.Scroller.surface.view.midleft.rowRenderer.xmlDataSource = dataset;
	this.Scroller.surface.view.midcenter.rowRenderer.xmlDataSource = dataset;
}

/**
 * Connects the component to a nitobi.data.DataTable in a nitobi.data.DataSet. 
 * If the DataTable is specified then this will also call conntectToDataTable(). 
 * Before a Grid can render any data it must be connected to a DataSet.
 * @param {nitobi.data.DataSet} dataSet The DataSet to connect the component to.
 * @param {nitobi.data.DataTable} dataTable The nitobi.data.DataSet to connect the component to.
 * @see #connectToDataSet
 * @private
 */
nitobi.grid.TreeGrid.prototype.connectToDataSet= function(dataset,table) 
{
	this.data = dataset;
	// TODO: Tree Grid diff
	// TODO: why is this here and when is it used?
	/*if (this.TopLeftRenderer) {

		this.connectRenderersToDataSet(dataset);
	}*/
	this.connectToTable(table);
}

/**
 * Connects a Grid to a table as specified by the table argument. If there is 
 * no table argument it will attempt to connect a table with the id '_default'. 
 * If no table can be found it will return false.  This is also called from 
 * conntectToDataSet if the second argument is used when calling that function.<br><br>
 * The component subscribes to the following events from the 
 * nitobi.data.DataTable:
 * &lt;ul&gt;
 * &lt;li&gt;RowCountChanged - nitobi.grid.Grid.setRowCount()&lt;/li&gt;
 * &lt;li&gt;RowCountKnown - nitobi.grid.Grid.setRowCount()&lt;/li&gt;
 * &lt;li&gt;StructureChanged - nitobigrid..Grid.updateStructure()&lt;/li&gt;
 * &lt;li&gt;ColumnsInitialized - nitobi.grid.Grid.updateStructure()&lt;/li&gt;
 * &lt;/ul&gt;
 * After the DataTable is connected, the OnTableConnectedEvent will fire.
 * @param {String} table The table to which the Grid should connect.
 * @return {Boolean} Returns true if the table was successfully connected to and false otherwise.
 */
nitobi.grid.TreeGrid.prototype.connectToTable= function(table) 
{
	// Use the table as the table id if it is a string
	if (typeof(table) == "string")
		this.datatable = this.data.getTable(table);
	// Use the table itself if it's an object
	else if (typeof(table) == "object")
		this.datatable = table;
	// Use the default table if it exists
	else if (this.data.getTable('_default')+'' != 'undefined')
		this.datatable = this.data.getTable('_default');
	// Otherwise we have problems
	else
		return false;

	this.connected=true;
	this.updateStructure();

	var dt = this.datatable;
	var L = nitobi.lang;

	dt.subscribe("DataReady",L.close(this,this.handleHandlerError));
	dt.subscribe("DataReady",L.close(this,this.syncWithData));
	dt.subscribe("DataSorted",L.close(this,this.syncWithData));
	dt.subscribe("RowInserted",L.close(this,this.syncWithData));
	dt.subscribe("RowDeleted",L.close(this,this.syncWithData));
	dt.subscribe("RowCountChanged",L.close(this,this.setRowCount));
	dt.subscribe("PastEndOfData",L.close(this,this.adjustRowCount));
	dt.subscribe("RowCountKnown",L.close(this,this.finalizeRowCount));
	dt.subscribe("StructureChanged",L.close(this,this.updateStructure));
	dt.subscribe("ColumnsInitialized",L.close(this,this.updateStructure));

	this.dataTableId = this.datatable.id;
	this.datatable.setOnGenerateKey(this.getKeyGenerator());

	this.fire('TableConnected', this.datatable);

	return true;
}

/**
 * Ensures that the Grid is connected to a DataTable. If there is no connected 
 * DataTable it will create a new DataTable with ID "_default" and use the 
 * GetHandler, SaveHandler and DataMode properties on the Grid.
 */
nitobi.grid.TreeGrid.prototype.ensureConnected = function() 
{
	// Case: nodataSet has been been defined
	if (this.data == null) {
		this.data = new nitobi.data.DataSet();
		this.data.initialize();

		this.datatable = new nitobi.data.DataTable(this.getDataMode(), this.getPagingMode() == nitobi.grid.PAGINGMODE_LIVESCROLLING,{GridId:this.getID()},{GridId:this.getID()},this.isAutoKeyEnabled());
		this.datatable.initialize("_default",this.getGetHandler(),this.getSaveHandler());
		this.data.add(this.datatable);
		this.connectToDataSet(this.data);
	}
	// Case: no dataTable has been defined
	// TODO: this only works with remote datasources ...
	// this is grid mode dependent.
	if (this.datatable == null) {
		this.datatable=this.data.getTable("_default");
		if (this.datatable == null) {
			this.datatable = new nitobi.data.DataTable(this.getDataMode(), this.getPagingMode() == nitobi.grid.PAGINGMODE_LIVESCROLLING,{GridId:this.getID()},{GridId:this.getID()}, this.isAutoKeyEnabled());
			this.datatable.initialize("_default",this.getGetHandler(),this.getSaveHandler());
			this.data.add(this.datatable);
		}
		this.connectToDataSet(this.data);
	}
	this.connected=true;
}

/**
 * Updates the component with information about a connected DataTable. This will be called when the OnStructureChangedEvent 
 * or OnColumnsInitializedEvent is fired from the DataTable.
 * @private
 */
nitobi.grid.TreeGrid.prototype.updateStructure = function() 
{
	if (this.inferredColumns) {
		this.defineColumns(this.datatable);
	}
	this.mapColumns();

	if (this.Scroller.surface.view.topleft)
	{
		this.defineColumnBindings();
		this.defineColumnsFinalize();
//		this.makeXSL();
	}
}

/**
 * Sets the <code>fieldMap</code> property of the Grid to match that of the connected DataTable. This is called from <code>updateStructure()</code>.
 * @private
 */
nitobi.grid.TreeGrid.prototype.mapColumns= function() 
{
	// TODO: This seems a bit sketchy to keep in sync if we ever use this.fieldMap
	// if so we should be using a setter and preferably creating the connection between the two properties
	this.fieldMap = this.datatable.fieldMap;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.configureDefaults= function() 
{
	// Note: properties should be assigned before components are attached or initialized (to avoid duplicate code execution)
	// Assume that accessors expect that sub-components haven't been created yet.
	// Make settings quickly - defer work until validation

	this.initializeModel();
	this.displayedFirstRow=0;
	this.displayedRowCount=0;
	this.localFilter=null;
	this.columns = [];
	this.fieldMap = {};
	this.frameRendered = false;
	this.connected=false;
	this.inferredColumns=true;
	this.selectedRows = [];

	this.minHeight=20;
	this.minWidth=20;

	this.setRowCount(0);
	this.layoutValid=false;

	//	This is a hack for backwards compat
	//	It is set in the bind method by looking at the data format returned from the server
	this.oldVersion = false;

	// create XSL Processors
	this.frameCssXslProc = nitobi.grid.frameCssXslProc;
	this.frameXslProc = nitobi.grid.frameXslProc;
}

/**
 * Attaches any events to the component DOM elements after the intial render. Common DOM events attached here include KeyPress, SelectStart and ContextMenu.
 * @private
 * @align
 */
nitobi.grid.TreeGrid.prototype.attachDomEvents= function()
{
	// The only way to attach the selection-prevention event in an XHTML compliant way.
	// This is only used (and will only work) for IE - for Moz/others we have CSS that handles it.
	ntbAssert(this.UiContainer!=null && nitobi.html.getFirstChild(this.UiContainer)!=null,'The Grid has not been attached to the DOM yet using attachToDom method. Therefore, attachDomEvents cannot proceed.',null,EBA_THROW);

	var dGridElement = this.getGridContainer();

	// Header specific events
	var he = this.headerEvents;
	he.push({type:'mousedown', handler:this.handleHeaderMouseDown});
	he.push({type:'mouseup', handler:this.handleHeaderMouseUp});
	he.push({type:'mousemove', handler:this.handleHeaderMouseMove});

	nitobi.html.attachEvents(this.getHeaderContainer(), he, this);
	// TODO: Tree Grid diff
	nitobi.html.attachEvents(this.getSubHeaderContainer(), he, this);

	// Data or cell specific events
	var ce = this.cellEvents;
	ce.push({type:'mousedown', handler:this.handleCellMouseDown});
	ce.push({type:'mousemove', handler:this.handleCellMouseMove});

	nitobi.html.attachEvents(this.getDataContainer(), ce, this);

	// Scroller specific (ie Header + Data) events
	//var se = this.scrollerEvents;
	//se.push({type:"selectstart", handler:function(evt) { return false; }});

	//nitobi.html.attachEvents(this.getScrollerContainer(), se, this);

	// Global Grid events
	var ge = this.events;
	ge.push({type:'contextmenu', handler:this.handleContextMenu});
	ge.push({type:'mousedown', handler:this.handleMouseDown});
	ge.push({type:'mouseup', handler:this.handleMouseUp});
	ge.push({type:'mousemove', handler:this.handleMouseMove});
	ge.push({type:'mouseout', handler:this.handleMouseOut});
	ge.push({type:'mouseover', handler:this.handleMouseOver});

	// TODO: decode these sorts of registrations in the event manager.
	if (!nitobi.browser.MOZ)
	{
		ge.push({type:'mousewheel', handler:this.handleMouseWheel});
	}
	else // MOZ
	{
		nitobi.html.attachEvent($("vscrollclip"+this.uid), "mousedown", this.focus, this);
		nitobi.html.attachEvent($("hscrollclip"+this.uid), "mousedown", this.focus, this);

		// This one needs to be tested still ...
		ge.push({type:'DOMMouseScroll', handler:this.handleMouseWheel});
	}

	nitobi.html.attachEvents(dGridElement, ge, this, false);

	if (nitobi.browser.IE)
		dGridElement.onselectstart = function() {var id =window.event.srcElement.id;if (id.indexOf('selectbox') == 0 || id.indexOf('cell') == 0) return false;};

	// If it is IE we choose the entire grid to be the keyNav focused element 
	// otherwise we use a special hidden element for Firefox for foucs performance reason
	if (nitobi.browser.IE)
		this.keyNav = this.getScrollerContainer();
	else
		this.keyNav = $("ntb-grid-keynav"+this.uid);

	this.keyEvents = [
		{type:'keydown', handler:this.handleKey},
		{type:'keyup', handler:this.handleKeyUp},
		{type:'keypress', handler:this.handleKeyPress}];

	nitobi.html.attachEvents(this.keyNav, this.keyEvents, this);

	// Attach the DOM events for grid resizing
	var rightGrabby = $("ntb-grid-resizeright" + this.uid);
	var btmGrabby = $("ntb-grid-resizebottom" + this.uid);
	if (rightGrabby != null)
	{
		nitobi.html.attachEvent(rightGrabby, "mousedown", this.beforeResize, this);
		nitobi.html.attachEvent(btmGrabby, "mousedown", this.beforeResize, this);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.hoverCell=function(cell) 
{
	var css = nitobi.html.Css;
	var has = nitobi.html.Css.hasClass;
	var swap = nitobi.html.Css.swapClass;
	var c = "ntb-column-collapsed";
	var x = "ntb-column-expanded";
	var chover = c + "-hover";
	var xhover = x + "-hover";
	// This will check if the BG color is the expected BG color
	// and only apply the hover if it is
	var h = this.hovered;
	if (h) 
	{
		if (h.getAttribute("ebatype") == "expander")
		{
			if (has(h, chover))
				swap(h, chover, c);
			if (has(h, xhover))
				swap(h, xhover, x);
		}
		else
		{
			var hs = h.style;
			if (hs.backgroundColor == this.CellHoverColor)
				hs.backgroundColor = this.hoveredbg;
		}
	}
	if (cell==null || cell==this.activeCell) return;
	if (cell.getAttribute("ebatype") == "expander")
	{
		if (has(cell, c))
			swap(cell, c, chover);
		if (has(cell, x))
			swap(cell, x, xhover);
		this.hovered = cell;
	}
	else
	{
		var cs = cell.style;
		this.hoveredbg=cs.backgroundColor;
		this.hovered=cell;
		cs.backgroundColor = this.CellHoverColor;
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.hoverRow=function(row) 
{
	if (!this.isRowHighlightEnabled()) return;

	var C = nitobi.html.Css;
	if (this.leftrowhovered && this.leftrowhovered!=this.leftActiveRow) {
		this.leftrowhovered.style.backgroundColor = this.leftrowhoveredbg;
		//C.removeClass(this.leftrowhovered, "ntb-row-hover", true);
	}
	if (this.midrowhovered && this.midrowhovered!=this.midActiveRow) {
		this.midrowhovered.style.backgroundColor = this.midrowhoveredbg;
		//C.removeClass(this.midrowhovered, "ntb-row-hover", true);
	}
	if (row==this.activeRow || row==null) return;

	var offset=-1;

	var rowCell = nitobi.html.getFirstChild(row);

	var rowNumber = nitobi.grid.Row.getRowNumber(row);
	var surfacePath = row.getAttribute("path");
	var rowNodes = nitobi.grid.Row.getRowElements(this, rowNumber, surfacePath);

	if (rowNodes.left!=null && rowNodes.left!=this.leftActiveRow) {
		this.leftrowhoveredbg=rowNodes.left.style.backgroundColor;
		this.leftrowhovered=rowNodes.left;
		rowNodes.left.style.backgroundColor = this.RowHoverColor;
		//C.addClass(rowNodes.left, "ntb-row-hover", true);
	}

	if (rowNodes.mid!=null && rowNodes.mid!=this.midActiveRow) {
		this.midrowhoveredbg=rowNodes.mid.style.backgroundColor;
		this.midrowhovered=rowNodes.mid;
		rowNodes.mid.style.backgroundColor = this.RowHoverColor;
		//C.addClass(rowNodes.mid, "ntb-row-hover", true);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearHover = function()
{
	// Clear hover
	this.hoverCell();
	this.hoverRow();
}

/**
 * Event handler for the mouseover event.
 * @param {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleMouseOver = function(evt)
{
	this.fire("MouseOver", evt);
}

/**
 * Event handler for the mouseout event.
 * @param {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleMouseOut = function(evt)
{
	this.clearHover();
	this.fire("MouseOut", evt);
}

/**
 * Event handler for the mouse wheel event.
 * @param {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleMouseDown = function(evt)
{
	// check if grid is in edit mode - if so, validate input first
	//if (this.isEditMode())
		//if (!this.cellEditor.checkValidity(evt)) return;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHeaderMouseDown=function(evt)
{
	var cell  = this.findActiveCell(evt.srcElement);
	if (cell==null) return;

	var colNumber = nitobi.grid.Cell.getColumnNumber(cell);
	var surfacePath = nitobi.grid.Cell.getSurfacePath(cell);
	if (this.headerResizeHover(evt, cell))
	{
		var columnObj = this.getColumnObject(colNumber, nitobi.grid.Cell.getSurfacePath(cell));
		var beforeColumnResizeEventArgs = new nitobi.grid.OnBeforeColumnResizeEventArgs(this, columnObj);
		if (!nitobi.event.evaluate(columnObj.getOnBeforeResizeEvent(), beforeColumnResizeEventArgs)) return;

		this.columnResizer.startResize(this, columnObj, cell, evt);

		return false;
	}
	else
	{
		this.headerClicked(colNumber, surfacePath);
		this.fire("HeaderDown", colNumber);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleCellMouseDown=function(evt)
{
	var cell  = this.findActiveCell(evt.srcElement) || this.activeCell;
	if (cell==null) return;
	
	if (cell.getAttribute("ebatype") == "expander")
	{
		this.toggleSurface(cell);
		return;
	}

	//	Check if the shift key is not pressed and if not then start selecting
	if (!evt.shiftKey)
	{
		// Fire the beforecellclick event on the grid and column
		var activeColumn = this.getSelectedColumnObject();
		var clickEventArgs = new nitobi.grid.OnCellClickEventArgs(this, this.getSelectedCellObject());
		if (!this.fire("BeforeCellClick", clickEventArgs) || (!!activeColumn && !nitobi.event.evaluate(activeColumn.getOnBeforeCellClickEvent(), clickEventArgs))) return;

		// Set the state variable indicating that we are have started a click...
		// This may turn into drag in cellMouseMove
		this.setCellClicked(true);

		// SetActiveCell will collapse the selection onto the specified cell
		this.setActiveCell(cell, evt.ctrlKey || evt.metaKey);

		this.selection.selecting = true;

		// Fire the cellclick event on the grid and column
		var activeColumn = this.getSelectedColumnObject();
		var clickEventArgs = new nitobi.grid.OnCellClickEventArgs(this, this.getSelectedCellObject());
		this.fire("CellClick", clickEventArgs);
		if (!!activeColumn) nitobi.event.evaluate(activeColumn.getOnCellClickEvent(), clickEventArgs);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleMouseUp = function(evtObj)
{
	// This mouseup may be due to a selection expansion - so lets just pass 
	// this on to the selection mouseup handler to where it will deal with it if we are in expanding mode.
	this.getSelection().handleGrabbyMouseUp(evtObj);
}

/**
 * MouseUp event handler for the Grid header.
 */
nitobi.grid.TreeGrid.prototype.handleHeaderMouseUp = function(evt)
{
	var domMouseUpCell = this.findActiveCell(evt.srcElement);
	if (!domMouseUpCell) 
	{
		this.focus();
		return;
	}
	var columnNumber = parseInt(domMouseUpCell.getAttribute("xi"));
	this.fire("HeaderUp",columnNumber);
}

/**
 * @private
 * Event handler for the mouse move event.
 */
nitobi.grid.TreeGrid.prototype.handleMouseMove = function(evt) 
{
	this.fire("MouseMove", evt);
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHeaderMouseMove=function(evt) {
	var cell=this.findActiveCell(evt.srcElement);
	if (cell == null) return;

	if (this.headerResizeHover(evt, cell)) {
		cell.style.cursor = "w-resize";
	} else {
		(nitobi.browser.IE?cell.style.cursor = "hand":cell.style.cursor = "pointer");
	}
}

/**
 * Calculates if the mouse if near the resize grabby
 * TODO: need to get rid of this and put in a DOM node for this 
 * @private
 * @param {Object} evt
 * @param {Object} cell
 */
nitobi.grid.TreeGrid.prototype.headerResizeHover = function(evt, cell)
{
	var x = evt.clientX;
	var rect = cell.getBoundingClientRect(0, (nitobi.grid.Cell.getColumnNumber(cell)>this.getFrozenLeftColumnCount()?this.scroller.getScrollLeft():0));
	return (x < rect.right && x > rect.right-10 );
}

/**
 * Manages the application of hover classes to column headers
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHeaderMouseOver = function(e)
{
	// nitobi.html.Css.addClass(e, "ntb-hover", true); // one day we can use this ... when no one uses IE anymore
	e.className = e.className.replace(/(ntb-column-indicator-border)(.*?)(\s|$)/g,function(){
		return arguments[1] + arguments[2] + "hover ";
	});
}

/**
 * Manages the application of hover classes to column headers
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHeaderMouseOut = function(e)
{
	// nitobi.html.Css.removeClass(e, "ntb-hover", true);
	e.className = e.className.replace(/(ntb-column-indicator-border)(.*?)(\s|$)/g,function(){
		return arguments[0].replace("hover", "");
	});
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleCellMouseMove=function(evt) {

	// Clear a possible cell clicked state
	this.setCellClicked(false);

	var cell=this.findActiveCell(evt.srcElement);
	if (cell == null) return;
	var cType = cell.getAttribute("ebatype");

	var sel = this.selection;
	var button = evt.button;

	var coords = nitobi.html.getEventCoords(evt);
	var x = coords.x, y = coords.y;
	if (nitobi.browser.IE)
		x = evt.clientX, y = evt.clientY;

	if (sel.selecting)
	{
		// Check first if the cell we are mousing over is from the same
		// group as the cell that started the selection.
		if (cell.getAttribute("path") == this.activeCell.getAttribute("path") && cType != "columnheader")
		{
			//	TODO: known bug with Mozilla - evt.button is ALWAYS 0 after the button is pressed!
			if (button == 1 || (button == 0 && !nitobi.browser.IE)) 
			{
				if (!sel.expanding) {
					sel.redraw(cell);
				} else {
					// If we are expanding we need to calculate which dir to expand - either horiz or vert.
					var selStartCoords = sel.expandStartCoords;
					// figure out which direction we are furthest from the original selection in terms of 1/2 cells
					var normEvtX = 0;
					if (x > selStartCoords.right)
						normEvtX = Math.abs(x - selStartCoords.right);
					else if (x < selStartCoords.left)
						normEvtX = Math.abs(x - selStartCoords.left);
	
					var normEvtY = 0;
					if (y > selStartCoords.bottom)
						normEvtY = Math.abs(y - selStartCoords.bottom);
					else if (y < selStartCoords.top)
						normEvtY = Math.abs(y - selStartCoords.top);
	
					if (normEvtY > normEvtX)
						expandDir = "vert";
					else
						expandDir = "horiz";
	
					sel.expand(cell, expandDir);
				}
				this.ensureCellInView(cell);
			}
			else
			{
				this.selection.selecting = false;
			}
		}
	}
	else
	{
		if (cType != "columnheader")
		{
			this.hoverCell(cell);
			this.hoverRow(cell.parentNode);
		}
		// TODO: onMouseOver event to be fired.
		//this.onMouseOver.notify();
	}
}

/**
 * Event handler for the mouse wheel event.
 * @param {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleMouseWheel = function(evtObj)
{
	this.focus() // blurs active cell; see ticket 871
	var delta = 0;
	if (evtObj.wheelDelta)
	{
		// IE
		delta = evtObj.wheelDelta/120;
	}
	else if (evtObj.detail)
	{
		// Mozilla
		delta = -evtObj.detail/3;
	}
	this.scrollVerticalRelative(-20*delta);
	nitobi.html.cancelEvent(evtObj);
}

/**
 * Sets the active cell of the Grid to the specified cell.
 * @param {HTMLElement} cell The HTML element for the cell to be made active.
 * @param {Boolean} multi Indicates whether multi-row select should be used.
 * @see #selectCellByCoords
 */
nitobi.grid.TreeGrid.prototype.setActiveCell=function(cell,multi) 
{
	// At this point if cell is null we can't do the activation of the cell
	if (!cell) return;

	this.blurActiveCell(this.activeCell);

	// Focus the grid if it is not already focused
	// TODO: should this focus occur when this is done through the API?
	this.focus();

	// Update the active cell to the provided cell
	this.activateCell(cell);
	var activeColumnObject = this.activeColumnObject;

	// Setup the cell selection and ensure that the cell is in view.
	this.selection.collapse(this.activeCell);

	// Check if we are in a click process - if so then we need to wait to ensure cell in view 
	// otherwise it can cause the selection to go into select mode.
	if (!this.isCellClicked()) {
		this.ensureCellInView(this.activeCell);
		this.setCellClicked(false);
	}

	// Now set the active row
	var row = cell.parentNode;
	this.setActiveRow(row,multi);

	// Finally focus on the cell 
	// NOTE: The cell is focused after the row is focused and the cell is blurred before the row is blurred ...
	var focusEventArgs = new nitobi.grid.OnCellFocusEventArgs(this, this.getSelectedCellObject());
	this.fire("CellFocus", focusEventArgs);
	if (!!activeColumnObject) nitobi.event.evaluate(activeColumnObject.getOnCellFocusEvent(), focusEventArgs);
}

/**
 * @private 
 * Sets Grid properties activeCell, activeCellObject and activeColumnObject for the new active cell.
 * @param {HTMLElement} activeCell The new active cell in the Grid.
 */
nitobi.grid.TreeGrid.prototype.activateCell = function(cell)
{
	this.activeCell = cell;
	this.activeCellObject = new nitobi.grid.Cell(this, cell);
	this.activeColumnObject = this.getSelectedColumnObject();
}


/**
 * @private
 * Blurs the currently active cell.
 * @param {HTMLElement} oldCell The previously selected cell. When bluring the entire grid 
 * one may want to set oldCell to be null. 
 */
nitobi.grid.TreeGrid.prototype.blurActiveCell = function(oldCell) {
	// Setup the oldCell property which can be null if we are clearing the grid or the new activeCell otherwise
	this.oldCell = oldCell;
	// First do the blur stuff since this can happen if cell is null
	var oldColumn = this.activeColumnObject;
	var blurEventArgs = new nitobi.grid.OnCellBlurEventArgs(this, this.getSelectedCellObject());
	if (!!oldColumn)
		if(!this.fire("CellBlur", blurEventArgs) || !nitobi.event.evaluate(oldColumn.getOnCellBlurEvent(), blurEventArgs)) return;
	
}

/**
 * @deprecated
 * @private
 */
nitobi.grid.TreeGrid.prototype.getRowNodes = function(row)
{
	return nitobi.grid.Row.getRowElements(this, nitobi.grid.Row.getRowNumber(row));
}

/**
 * Sets the active row of the Grid to the specified row.
 * @param {HTMLElement} row The HTML element for the row to be made active.
 * @param {Boolean} multi Indicates whether multi-row select should be used.
 */
nitobi.grid.TreeGrid.prototype.setActiveRow=function(row,multi) 
{
	var Row = nitobi.grid.Row;

	var newRowNum = Row.getRowNumber(row);
	var oldRowNum = -1;

	// If there is an old row selected then gets its row number
	if (this.oldCell != null)
		oldRowNum = Row.getRowNumber(this.oldCell)
	if (this.selectedRows[0] != null)
		oldRowNum = Row.getRowNumber(this.selectedRows[0]);

	if (!multi || !this.isMultiRowSelectEnabled())
	{
		// Check if the old and newly selected / clicked rows are the same or not
		if (newRowNum != oldRowNum && oldRowNum != -1) {
			var blurEventArgs = new nitobi.grid.OnRowBlurEventArgs(this,this.getRowObject(oldRowNum));
			if (!this.fire("RowBlur", blurEventArgs) || !nitobi.event.evaluate(this.getOnRowBlurEvent(), blurEventArgs)) return;
		}
		this.clearActiveRows();
	}

	if (this.isRowSelectEnabled())
	{
		var rowNodes = Row.getRowElements(this, newRowNum);

		this.midActiveRow = rowNodes.mid;
		this.leftActiveRow = rowNodes.left;
		if (row.getAttribute("select")=="1") {
			this.clearActiveRow(row);
		} else {
			this.selectedRows.push(row);
			if (this.leftActiveRow!=null) {
				this.leftActiveRow.setAttribute("select","1");
				this.applyRowStyle(this.leftActiveRow);
			}
			if (this.midActiveRow!=null) {
				this.midActiveRow.setAttribute("select","1");
				this.applyRowStyle(this.midActiveRow);
			}
		}
	}
	if (newRowNum != oldRowNum) {
		var focusEventArgs = new nitobi.grid.OnRowFocusEventArgs(this,this.getRowObject(newRowNum));
		this.fire("RowFocus", focusEventArgs);
		nitobi.event.evaluate(this.getOnRowFocusEvent(), focusEventArgs);
	}
}

/**
 * Returns an Array of the currently selected rows in the Grid.  This is
 * particularly useful if your grid has multiselect enabled..
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * // Iterate through the rows that have been selected and change
 * // the value of the cell at column index 'col' to "New Value!"
 * &#102;unction setDefault(col)
 * {
 * 	var grid = nitobi.getGrid('grid1');
 * 	var selectedRows = grid.getSelectedRows();
 * 
 * 	for( var i = 0; i < selectedRows.length; i++ ) 
 * 	{
 * 	var xi = selectedRows[i].getAttribute("xi");
 * 	var celly = grid.getCellObject(xi, col);
 * 	celly.setValue("New Value!");
 * 	}
 * }
 * </code></pre>
 * </div>
 * @type Array
 * @see #getCellObject
 */
nitobi.grid.TreeGrid.prototype.getSelectedRows=function() 
{
	return this.selectedRows;
}
/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearActiveRows=function() 
{
	for (var i=0;i<this.selectedRows.length;i++) {
		var row=this.selectedRows[i];
		this.clearActiveRow(row);
	}
	this.selectedRows = [];
}

/**
 * Selects all the rows in the Grid.
 * <p>
 * <b>N.B.</b>:  The grid must have multiselect enabled
 * </p>
 * @type Array
 */
nitobi.grid.TreeGrid.prototype.selectAllRows=function() 
{
	this.clearActiveRows();
	for (var i=0;i<this.getDisplayedRowCount() ;i++ )
	{
		var cell = this.getCellElement(i,0);
		if (cell!=null)
		{
			var row = cell.parentNode
			this.setActiveRow(row,true);
		}
	}
	return this.selectedRows;
}
/**
 * Clears any active rows in the Grid.
 */
nitobi.grid.TreeGrid.prototype.clearActiveRow=function(row) 
{
	var rowNumber = nitobi.grid.Row.getRowNumber(row)
	var rowNodes = nitobi.grid.Row.getRowElements(this,rowNumber);

	if (rowNodes.left!=null) {
		rowNodes.left.removeAttribute("select");
		this.removeRowStyle(rowNodes.left);
	}
	if (rowNodes.mid!=null) {
		rowNodes.mid.removeAttribute("select");
		this.removeRowStyle(rowNodes.mid);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.applyCellStyle=function(cell) {
	if (cell==null) return;
	cell.style.background=this.CellActiveColor;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.removeCellStyle=function(cell) {
	if (cell==null) return;
	cell.style.background="";
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.applyRowStyle=function(row) {
	if (row==null) return;
	row.style.background=this.RowActiveColor;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.removeRowStyle=function(row) {
	if (row==null) return;
	row.style.background="";
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.findActiveCell = function(domSrcElem)
{
	var breakOut = 5;
	domSrcElem == null;
	for (var i=0; i<breakOut && domSrcElem.getAttribute; i++) 
	{
		var t=domSrcElem.getAttribute('ebatype');
		if (t=='cell' || t=='columnheader' || t == "expander") return domSrcElem;
		domSrcElem = domSrcElem.parentNode;
	}
	return null;
}

/**
 * Attaches a component to the HTML DOM. If a component is created using 
 * script, this is an important method to use as 
 * it will cause the render of all unbound elements of the user-interface. 
 * This is primarily for use by component developers.
 * @param {HTMLElement} parentElement The HTML DOM element where the component 
 * will be rendered.
 */
nitobi.grid.TreeGrid.prototype.attachToParentDomElement= function(parentElement) 
{
	this.UiContainer=parentElement;
	// This event key is created in the constructor and connected to initialize
	this.fire("AttachToParent");
}

/**
 * Returns all the toolbars currently being used in the grid.  The grid has two 
 * toolbars named standardToolbar and pagingToolbar. The pagingToolbar is only available
 * if the grid is set to standard mode.
 * @type nitobi.ui.Toolbars
 */
nitobi.grid.TreeGrid.prototype.getToolbars = function()
{
	return this.toolbars;
}

/**
 * Checks if the horizontal scroll bar needs to be drawn and makes the proper adjustments
 * to the viewable area of the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.adjustHorizontalScrollBars = function()
{
	var viewableWidth = this.getViewableWidth();
	var hScrollbarContainer = $("ntb-grid-hscrollshow" + this.uid);
	if ((viewableWidth <= parseInt(this.getWidth())))
	{
		hScrollbarContainer.style.display = "none";
	}
	else
	{
		hScrollbarContainer.style.display = "block";
		this.resizeScroller();
		var pctW = this.getWidth()/this.getViewableWidth();
		this.hScrollbar.setRange(pctW);
	}
	var scrollStyle = nitobi.html.Css.getClass(".ntb-grid-scrollerheight" + this.uid, true);
	if (viewableWidth > this.getWidth())
	{
		scrollStyle.height = this.getHeight() - this.getscrollbarHeight() - (this.isToolbarEnabled()?this.getToolbarHeight():0) + "px";
	}
	else
	{
		scrollStyle.height = this.getHeight() - (this.isToolbarEnabled()?this.getToolbarHeight():0) + "px";
	}
}

/**
 * Creats all children objects of the component. These can be visual or non-visual aspects of the component such as 
 * panels, toolbars or managers.
 * @private
 */
nitobi.grid.TreeGrid.prototype.createChildren= function()
{
	var L = nitobi.lang;

	// *** OVERRIDE IN THIS FUNCTION IN INHERITED GRIDS BASED ON MODE ***

	// Creating children here streamlines startup performance
	// Give sub-classes first-crack at definining sub-components
	// Possibly call super.createChildren()
	// Defer creating dynamic and data-driven components to commitProperties()

	// Rules for adding children: 
	// 	1. Containers must contain only UIComponents
	//	2. UIComponents must go inside other UIComponents
	//	3. UIComponents can contain anything 
	ntbAssert((this.UiContainer!=null),"Grid must have a UI Container");

	if (this.UiContainer != null && this.getGridContainer() == null) {
		this.renderFrame();			// UI children need ui containers
	}

	this.generateFrameCss(); 	// *** BAD - genCss depends on Scroller - this shouldn't be so

	// Moved this to the createChildren method since it is a child of the Grid.
	// To fix the loading screen aligment problem it needs to be attached the grid tag - not the body

	var ls = this.loadingScreen = new nitobi.grid.LoadingScreen(this);
	this.subscribe("Preinitialize", L.close(ls,ls.show));
	this.subscribe("HtmlReady", L.close(ls,ls.hide));
	this.subscribe("AfterGridResize", L.close(ls,ls.resize));
	ls.initialize();
	ls.attachToElement($("ntb-grid-overlay"+this.uid));
	ls.show();

//	nitobi.html.setBgImage($("ntb-frozenshadow"+this.uid));

	// TODO: these resizers should be inheriting from one resizer base class to reduce code.
	/**
	 * The object that is responsible for managing runtime resizing of Grid Columns.
	 * @type nitobi.grid.ColumnResizer
	 */
	var cr = new nitobi.grid.ColumnResizer(this);
	cr.onAfterResize.subscribe(L.close(this, this.afterColumnResize));
	this.columnResizer = cr;

	/**
	 * The object that is responsible for managing runtime resizing of the Grid.
	 * @type nitobi.grid.GridResizer
	 */
	var gr = new nitobi.grid.GridResizer(this);
	gr.widthFixed = this.isWidthFixed();
	gr.heightFixed = this.isHeightFixed();
	gr.minWidth = this.getMinWidth();
	gr.minHeight = Math.max(this.getMinHeight(), (this.getHeaderHeight()+this.getscrollbarHeight()));
	gr.onAfterResize.subscribe(L.close(this, this.afterResize));
	this.gridResizer = gr;

	// TODO: Scroller is deprecated
	var sc = this.Scroller = this.scroller = new nitobi.grid.Scroller3x3(this, this.getHeight(), this.getDisplayedRowCount(), this.getColumnCount(), this.getfreezetop(), this.getFrozenLeftColumnCount());
	sc.setRowHeight(this.getRowHeight());
	sc.setHeaderHeight(this.getHeaderHeight());
	this.maxSurface = this.scroller.surface;
	this.renderSurface();
	this.attachDomEvents();
	// Set up default key handlers - eventually move these out into editor factory
//	var kh = function(k) {if ((k > 64 && k < 91) || (k > 47 && k < 58) || (k > 95 && k < 111) || (k > 188 && k < 191) || (k == 113) ) {_this.edit();}};
//	var gh = function(k) {if (k==32) {var group =  _this.activeCell.getAttribute("xig");_this.toggleGroup(group);}}; 
//	this.keyHandlerFunc={"TEXT":kh,"PASSWORD":kh,"TEXTAREA":kh,"NUMBER":kh,"IMAGE":kh,"DATE":kh,"LISTBOX":kh,"LOOKUP":kh,"CHECKBOX":kh,"LINK":kh};

	// Subscribe to the HtmlReady event for things like afterrowinsert etc
	sc.surface.onHtmlReady.subscribe(this.handleHtmlReady, this);
	// only connect the scrolled setDataTable method to the tableconnected event
	// once we know the scroller is defined.
	this.subscribe('TableConnected', L.close(sc, sc.setDataTable));
	// Since we may already have connected a datatable to the grid we need to explicitly
	// connect update the scroller when we create it
	// TODO: should this be a constructor / initialize argument instead? 
	// TODO: In regular grid...should be in Tree Grid?
	//sc.setDataTable(this.datatable);

	this.initializeSelection();

	// Attach renderers to Scroller views
	/*var sv = this.Scroller.view;
	sv.midleft.rowRenderer = this.MidLeftRenderer;
	sv.midcenter.rowRenderer = this.MidCenterRenderer;*/
	this.Scroller.createRenderers(this.data);
	
	this.mapToHtml();			// Children need dom references

	// Logic for features:
	// 	Paging Mode
	//		Overrides toolbars, scrollbars
	//	Toolbars
	//	Scrollbars

	// create Scrollbars
	var vs = this.vScrollbar = new nitobi.ui.VerticalScrollbar();
	vs.attachToParent(this.element, $("vscroll"+this.uid));
	vs.subscribe("ScrollByUser",L.close(this,this.scrollVertical));
	this.subscribe("PercentHeightChanged",L.close(vs, vs.setRange)); // I had to do it this way ... context wasn't being passed properly
	this.subscribe("ScrollVertical",L.close(vs, vs.setScrollPercent)); 
	this.setscrollbarWidth(vs.getWidth());

//	this.subscribe("PercentHeightChanged",nitobi.lang.close(this,this.vScrollbar.setRange));
//	this.subscribe("PercentHeightChanged",this.vScrollbar.setRange,this);

	var hs = this.hScrollbar = new nitobi.ui.HorizontalScrollbar();
	hs.attachToParent(this.element, $("hscroll"+this.uid));
	hs.subscribe("ScrollByUser",L.close(this,this.scrollHorizontal));
	this.subscribe("PercentWidthChanged",L.close(hs, hs.setRange)); // I had to do it this way ... context wasn't being passed properly
	this.subscribe("ScrollHorizontal",L.close(hs, hs.setScrollPercent));
	this.setscrollbarHeight(hs.getHeight());
}

/**
 * Creates the toolbars collection. Toolbars are always there in case
 * the programmer calls setToolbarEnabled(true).
 * 
 * @param {nitobi.ui.Toolbars.VisibleToolbars} visibleToolbars A bitmask representing which toolbars are being shown.
 * @private
 */
nitobi.grid.TreeGrid.prototype.createToolbars = function(visibleToolbars)
{
	var tb = this.toolbars = new nitobi.ui.Toolbars(this, (this.isToolbarEnabled() ? visibleToolbars : 0) );
	var TBContainer = document.getElementById("toolbarContainer"+this.uid);
	tb.setWidth(this.getWidth());
	tb.setHeight(this.getToolbarHeight());
	tb.setRowInsertEnabled(this.isRowInsertEnabled());
	tb.setRowDeleteEnabled(this.isRowDeleteEnabled());
	tb.attachToParent(TBContainer); 

	var L = nitobi.lang;
	tb.subscribe("InsertRow",L.close(this,this.insertAfterCurrentRow));
	tb.subscribe("DeleteRow",L.close(this,this.deleteCurrentRow));
	tb.subscribe("Save",L.close(this,this.save));
	tb.subscribe("Refresh",L.close(this,this.refresh));

	this.subscribe("AfterGridResize", L.close(this,this.resizeToolbars));
}

/**
 * Called on the <code>AfterGridResize</code> event.
 * @private
 */
nitobi.grid.TreeGrid.prototype.resizeToolbars = function()
{
	this.toolbars.setWidth(this.getWidth());
	this.toolbars.resize();
}

/**
 * Vertically scrolls the Grid relative to the current vertical scroll 
 * position.
 * <p>
 * If the Grid is in livescrolling mode, use of this method may cause
 * an asynchronous request to the server if more data is required to be
 * rendered--i.e. the behaviour is the same if you scroll programatically
 * or scroll using the mouse
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.scrollVerticalRelative(150);
 * grid.scrollVerticalRelative(100);	// Moves the grid 250 pixels down
 * </code></pre>
 * </div>
 * @param {Number} offset The amount by which to scroll the Grid with respect to its current vertical scroll value.
 */
nitobi.grid.TreeGrid.prototype.scrollVerticalRelative= function(offset)
{
	var st = this.scroller.getScrollTop()+offset;

	var mc = this.Scroller.surface.view.midcenter;
	percent = st /(mc.container.offsetHeight-mc.element.offsetHeight);

	this.scrollVertical(percent);
}

/**
 * Vertically scrolls the Grid to the position specfied by the percent 
 * argument. This will fire the OnScrollVerticalEvent 
 * and the OnScrollHitBottomEvent or OnScrollHitTopEvent if the scrollbar 
 * is with 1% of the bottom or top of the data respectively.
 * <p>
 * If the Grid is in livescrolling mode, use of this method may cause
 * an asynchronous request to the server if more data is required to be
 * rendered--i.e. the behaviour is the same if you scroll programatically
 * or scroll using the mouse
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.scrollVertical(0.3);	// Scrolls the grid a third of the way to the bottom
 * grid.scrollVertical(0.5);	// Scrolls the grid half way to the bottom (not 80%)
 * </code></pre>
 * </div>
 * @param {decimal} percent A value between 0 and 1 that specifies how far to vertically scroll, 0 being left and 1 being right.
 */
nitobi.grid.TreeGrid.prototype.scrollVertical= function(percent)
{
	this.clearHover();
	var origPct = this.scroller.getScrollTopPercent();
	this.scroller.setScrollTopPercent(percent);
	this.fire("ScrollVertical",percent);
	if (percent > .99 && origPct < .99) {
		this.fire("ScrollHitBottom",percent);
	}
	if (percent < .01) {
		this.fire("ScrollHitTop",percent);
	}
}

/**
 * Horizontally scrolls the Grid relative to the current horizontal scroll 
 * position.
 * <p>
 * Note that this differs from {@link #scrollHorizontal} in two ways.  One,
 * it takes an offset representing the number of pixels to scroll as opposed
 * to a percantage.  Two, this method will scroll relative to the current
 * position and not absolutely
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.scrollHorizontalRelative(150);
 * grid.scrollHorizontalRelative(100);	// Moves the grid 250 pixels to the right
 * </code></pre>
 * </div>
 * @param {Number} offset The pixel amount by which to scroll the Grid with 
 * respect to its current horizontal scroll value.
 */
nitobi.grid.TreeGrid.prototype.scrollHorizontalRelative= function(offset)
{
	var sl = this.scroller.getScrollLeft()+offset;
	var mc = this.scroller.surface.view.midcenter;
	percent = sl / (mc.container.offsetWidth-mc.element.offsetWidth);
	this.scrollHorizontal(percent);
}

/**
 * Horizontally scrolls the Grid to the position specfied by the percent 
 * argument. This will fire the <code>OnScrollHorizontalEvent</code> 
 * and the <code>OnScrollHitLeftEvent</code> or 
 * <code>OnScrollHitRightEvent</code> if the scrollbar is with 1% of the 
 * left or right of the data respectively.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.scrollHorizontal(0.3);	// Scrolls the grid a third of the way to the right
 * grid.scrollHorizontal(0.5);	// Scrolls the grid half way to the right (not 80%)
 * </code></pre>
 * </div>
 * @param {decimal} percent A value between 0 and 1 that specifies how far to horizontally scroll, 0 being left and 1 being right.
 */
nitobi.grid.TreeGrid.prototype.scrollHorizontal= function(percent)
{
	this.focus();
	this.clearHover();
	this.scroller.setScrollLeftPercent(percent);
	this.fire("ScrollHorizontal",percent);
	if (percent > .99) {
		this.fire("ScrollHitRight",percent);
	}
	if (percent < .01) {
		this.fire("ScrollHitLeft",percent);
	}
}
/**
 * Gets a reference to the midcenter HTML element which is the main grid surface. This is commonly
 * used to get the scrollTop and scrollLeft values for the grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.getScrollSurface = function()
{
	if (this.Scroller != null)
	{
		return this.Scroller.surface.view.midcenter.element;
	}
}

/**
 * @private
 * @type nitobi.grid.Viewport
 */
nitobi.grid.TreeGrid.prototype.getActiveView = function()
{
	var C = nitobi.grid.Cell;
	return this.Scroller.getViewportByCoords(
		C.getRowNumber(this.activeCell), 
		C.getColumnNumber(this.activeCell),
		C.getSurfacePath(this.activeCell));
}

/**
 * Scrolls the Grid such that the specified cell is visible. 
 * If the cell argument is specified then it will scroll to make 
 * the provide cell visible.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction scrollToCell(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var cellElement = grid.getCellElement(row, col);
 * 	grid.ensureCellInView(cellElement);
 * }
 * </code></pre>
 * </div>
 * @param {HTMLElement} cell The cell that is to be in view.
 */
nitobi.grid.TreeGrid.prototype.ensureCellInView=function(cell)
{
	var SS = this.getScrollSurface();

	var AC = cell || this.activeCell;
	if (AC == null) return;

	//	TODO: this is a big hack for Mozilla
	var sct=0;
	var scl=0;
	if (!nitobi.browser.IE) {
		sct = SS.scrollTop;
		scl = SS.scrollLeft;
	}

	var R1 = AC.getBoundingClientRect();
	var R2 = SS.getBoundingClientRect();

	var B = EBA_SELECTION_BUFFER || 0;

	var up=R1.top-R2.top-B-sct;
	var down=R1.bottom-R2.bottom+B-sct;
	var left=R1.left-R2.left-B-scl;
	var right=R1.right-R2.right+B-scl;

	if (up<0) this.scrollVerticalRelative(up);
	if (down>0) this.scrollVerticalRelative(down);

	if (nitobi.grid.Cell.getColumnNumber(AC) > this.getFrozenLeftColumnCount()-1) {
		if (left<0) this.scrollHorizontalRelative(left);
		if (right>0) this.scrollHorizontalRelative(right);
	}

	this.fire("CellCoordsChanged",R1);
}

/**
 * If the Grid is rendered, the Grid is updated to reflect the number of rows in the Grid DataTable. The change in data rows is 
 * also propagated to child object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.updateCellRanges= function() 
{
	if(this.frameRendered) {
		var rows = this.getRowCount();
		this.Scroller.updateCellRanges(this.getColumnCount(),rows,this.getFrozenLeftColumnCount(),this.getfreezetop());

		this.measure();
		this.resizeScroller();

		this.fire("PercentHeightChanged",this.getHeight()/this.calculateHeight());
		this.fire("PercentWidthChanged",this.getWidth()/this.calculateWidth());
	}
}

/**
 * Re-calculates the dimensions of the component.
 * @private
 */
nitobi.grid.TreeGrid.prototype.measure= function() {
	// Invoked by the framework when a components invalidateSize is called
	// Components calculate their natural size based on content and layout rules
	// Implicitly invoked when component children change size
	// Don't count on it: Framework should optimize away calls to measure
	// Start by explicitly sizing component and implement measure() later.

/*	
	this.toolbarbox.measure();
	this.hscrollbarbox.measure();
	this.vscrollbarbox.measure();
	this.Scroller.measure();
*/

	this.measureViews();
	this.sizeValid=true;
}

/**
 * Calls both <code>measureColumns</code> and <code>measureRows</code>.
 * @private
 */
nitobi.grid.TreeGrid.prototype.measureViews= function() {
	this.measureRows();
	this.measureColumns();	
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.measureColumns= function() {
	var fL=this.getFrozenLeftColumnCount();
	var wL = 0;
	var wT = 0;
	var colDefs = this.getColumnDefinitions();
	var cols = colDefs.length;
	for (var i=0; i<cols;i++) {
		if (colDefs[i].getAttribute("Visible") == "1" || colDefs[i].getAttribute("visible") == "1")
		{
			var w = Number(colDefs[i].getAttribute("Width"));
			wT+=w;
			if (i<fL) wL+=w;
		}
	}
	this.setleft(wL);
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.measureRows= function()
{
	var hdrH = this.isColumnIndicatorsEnabled()?this.getHeaderHeight():0;
	this.settop(this.calculateHeight(0,this.getfreezetop()-1) + hdrH); // should compute because heights may vary
}

/**
 * Resizes the scroller dimensions.
 * @private
 */
nitobi.grid.TreeGrid.prototype.resizeScroller = function()
{
	// TODO: refactor, the toolbars should not be taken into account .... that should all alredy be set in the this.getHeight property 
	var tbDelta=(this.getToolbars() != null && this.isToolbarEnabled() ? this.getToolbarHeight() : 0);
	var hdrH = this.isColumnIndicatorsEnabled()?this.getHeaderHeight():0;
	this.Scroller.resize(	this.getHeight()-tbDelta-hdrH);
}
/**
 * Resizes the grid to the specified width and height. The size specified is the outermost container size
 * of the grid including toolbars, scrollbars and borders. 
 * @param {Number} width The width (in pixels) of the grid.
 * @param {Number} height The height (in pixels) of the grid.
 * @return {Boolean} Returns true if the table was successfully connected to and false otherwise.
 */
nitobi.grid.TreeGrid.prototype.resize= function(width, height) 
{
	this.setWidth(width);
	this.setHeight(height);

	// Just generate the CSS
	this.generateCss();

	// Then fix the toolbar
	this.fire("AfterGridResize", {source:this,width:width,height:height});
}

/**
 * Executes before a user initiated resize event occurs.
 * @param {Object} evt Event arguments 
 */
nitobi.grid.TreeGrid.prototype.beforeResize = function(evt)
{
	var beforeResizeEventArgs = new nitobi.base.EventArgs(this);
		if (!nitobi.event.evaluate(this.getOnBeforeResizeEvent(), beforeResizeEventArgs)) return;
	
	this.gridResizer.startResize(this, evt);
}

/**
 * Executes after a user initiated resize event occurs.
 */
nitobi.grid.TreeGrid.prototype.afterResize = function()
{
	this.resize(this.gridResizer.newWidth, this.gridResizer.newHeight);
	this.syncWithData();
}

/**
 * Executes after a user initiated column resize event occurs.
 * @param {Object} evt Event arguments 
 */
nitobi.grid.TreeGrid.prototype.afterColumnResize = function(resizer)
{
	//var col = this.getColumnObject(resizer.column);
	var col = resizer.column;
	var prevWidth = col.getWidth();
	this.columnResize(col, prevWidth + resizer.dx);
}

/**
 * Resizes the grid column to the specified width. 
 * @param {Number} width The width (in pixels) of the column.
 * @param {Number|nitobi.grid.Column} column The index of the column to resize or the Column object.
 */
nitobi.grid.TreeGrid.prototype.columnResize= function(column, width) 
{
	if (isNaN(width)) return;

	column = (typeof column == "object"?column:this.getColumnObject(column));
	var prevWidth = column.getWidth();
	column.setWidth(width);

	//	TODO: this is a hack to fix a problem with the fixed column header not resizing.
	// This was causing some hacky code to be added in EBASelection.collapse 
	// see the following - tix for details.
	// http://portal:8090/cgi-bin/trac.cgi/ticket/522
	this.updateCellRanges();
	var s = this.scroller.surfaceMap;
	var maxWidth = 0;
	for (var key in s)
	{
		var surface = s[key];
		var w;
		if ((w = surface.calculateWidth()) > maxWidth)
		{
			maxWidth = w;
		}
	}
	this.setViewableWidth(maxWidth);

	// This is ridiculous ... IE 7 has issues with changing rules directly!!!
	if (nitobi.browser.IE7)
	{
		this.generateCss();
	}
	else
	{
		var C = nitobi.html.Css;
		
		var columnIndex = column.column;
		var dx = width - prevWidth;
		/*
		
		
		// Things are different if we are resizing a frozen or unfrozen column
		if (columnIndex < this.getFrozenLeftColumnCount())
		{
			var leftStyle = C.getClass(".ntb-grid-leftwidth"+this.uid);
			leftStyle.width = (parseInt(leftStyle.width) + dx) + "px";
			var centerStyle = C.getClass(".ntb-grid-centerwidth"+this.uid);
			centerStyle.width = (parseInt(centerStyle.width) - dx) + "px";
		}
		else
		{
			var surfaceStyle = C.getClass(".ntb-grid-surfacewidth"+this.uid);
			surfaceStyle.width = (parseInt(surfaceStyle.width) + dx) + "px";
		}
		*/
		// No matter what do the column class itself
		var columnStyle = C.getClass(".ntb-column"+this.uid+"_"+ column.surface.columnSetId + "_" + (columnIndex+1));
		columnStyle.width = (parseInt(columnStyle.width) + dx) + "px";
		var columns = this.scroller.surface.columnsNode, depth = 0, groupOffset = this.getGroupOffset(), rootId = this.getRootColumns();
		do
		{
			var id = columns.getAttribute("id");
			var surfaceStyle = C.getClass(".ntb-grid-surfacewidth" + this.uid + "-" + id);
			var width = (id == rootId?maxWidth:maxWidth - (depth * parseInt(groupOffset)) - (depth + 1));
			console.log(width);
			surfaceStyle.width = width + "px";
			var childId = this.findChildColumnSet(id);
			columns = this.model.selectSingleNode("//ntb:columns[@id='" + childId + "']");
			depth++;
		}
		while (columns);
	}

	this.Selection.collapse(this.activeCell);
	this.adjustHorizontalScrollBars()
	var afterColumnResizeEventArgs = new nitobi.grid.OnAfterColumnResizeEventArgs(this, column);
	nitobi.event.evaluate(column.getOnAfterResizeEvent(), afterColumnResizeEventArgs);
}

nitobi.grid.TreeGrid.prototype.resizeSurfaces = function()
{
	var maxWidth = 0;
	var oldWidth = this.getViewableWidth();
	var s = this.scroller.surfaceMap;
	for (var key in s)
	{
		var surface = s[key];
		var w;
		if ((w = surface.calculateWidth()) > maxWidth && surface.isVisible)
		{
			maxWidth = w;
		}
	}
	this.setViewableWidth(maxWidth);
	if (nitobi.browser.MOZ && oldWidth < maxWidth)
	{
		var C = nitobi.html.Css;
		var surface = this.scroller.surface;
		var depth = 0, groupOffset = this.getGroupOffset(), rootId = this.getRootColumns();
		var maxWidth = this.getViewableWidth();
		do
		{
			var columnsNode = surface.columnsNode;
			var id = columnsNode.getAttribute("id");
			var surfaceStyle = C.getClass(".ntb-grid-surfacewidth" + this.uid + "-" + id, true);
			var width = (id == rootId?maxWidth:maxWidth - (depth * parseInt(groupOffset)) - (depth + 1));
			surfaceStyle.width = width + "px";
			depth++;
			if (!nitobi.collections.isHashEmpty(surface.surfaces))
			{
				for (var name in surface.surfaces)
				{
					surface = surface.surfaces[name];
					break;
				}
			}
			else
			{
				surface = null;
			}
		} while(surface);
	}
}


/**
 * Loads the Grid Model from XML. The Model is essentially a serialization of the Grid state which contains all the property values and 
 * child object information.
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeModel= function()
{
	this.model = nitobi.xml.createXmlDoc(nitobi.xml.serialize(nitobi.grid.modelDoc));
	//this.model = nitobi.xml.parseHtml($(this.uid));
	//this.model = nitobi.xml.createXmlDoc(this.defaultDeclarationModel);
	//this.model = nitobi.xml.createXmlDoc(nitobi.xml.serialize(this.defaultModel.selectSingleNode("//ntb:grid")));
	//this.defaultModel = this.model.cloneNode(true);
	// TODO: This is temporary to merge in the Nike changes to api xml.
	this.modelNode = this.model.selectSingleNode("//ntb:treegrid");
	this.initializeModelFromDeclaration();
	// Setup the scrollbar width / height that depends on the Windows style that is used
	var scrollBarHeight = nitobi.html.getScrollBarWidth();
	if (scrollBarHeight)
	{
		this.setscrollbarWidth(scrollBarHeight);
		this.setscrollbarHeight(scrollBarHeight);
	}

	// Set up column definitions - Do this in XSL
	//var xDec = this.model.selectSingleNode("state/nitobi.grid.Columns");
	
	var xDec = this.model.selectSingleNode("//ntb:columns");
	if (xDec == null) 
	{
		//var xDec=this.model.createElement("nitobi.grid.Columns");
		var xDec = nitobi.xml.createElement(this.model, "columns");
		this.model.selectSingleNode("//ntb:treegrid").appendChild(xDec);
	}

	// When will this ever NOT be 0?
	/*var cols = this.getColumnCount();

	if (cols > 0)
	{
		// Generate column definitions
		this.defineColumns(cols);
	}
	else
	{
		this.columnsDefined=false;
		this.inferredColumns=true;		
	}*/

	this.model.documentElement.setAttribute("ID",this.uid);
	this.model.documentElement.setAttribute("uniqueID",this.uid);
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearDefaultData= function(rows) {
	// Set up default rows - Do this in XSL
	for (var i=0; i<rows;i++){
		var e=this.model.createElement("e");
		e.setAttribute("xi",i+1);
		xDec.appendChild(e);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.bind=function()
{
	//	bind() should do two things:
	//	1) look at all the columns and get any data for external datasources before grid rendering takes place
	//	2) get the actual grid datasource
	//	Columns can bind to datasources defined in the data that is returned from the server for the grid itself.
	//	They can also bind to a custom getHandler if they desire or even an inline datasource

	// If we are already bound to a datasource then we need to clear things out
	// to get ready for the the newly bound datatable.
	if (this.isBound())
	{
		this.clear();
		// TODO: Here temporarily. It should be in datatable.flush.
		// See that todo.
		//this.datatable.descriptor.reset();
	}
}

/**
 * Connects the component to a DataTable. 
 * <p>If the data is located on a 
 * remote server then the GetHandler property is required to retrieve the 
 * data asynchronously from the remote server otherwise a DatasourceId is 
 * required if the data is already on the client. If the component was 
 * initialized using a declaration that contained column definitions these 
 * will be mapped to the columns in the data source using the 
 * &lt;ntb:datastructure ... /&gt; element returned from the remote data 
 * source. If there are no columns defined through either JavaScript or a 
 * declaration then the columns will be autogenerated from the data 
 * returned from the remote data source according to the 
 * &lt;ntb:datastructure ... /&gt; element.
 * </p>
 * <p>
 * <b>Example</b>:  Manually request data from the gethandler
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction customRequest(gridId)
 * {
 * 	var grid = nitobi.getComponent(gridId);
 * 	var datatable = grid.getDataSource();
 * 	datatable.setGetHandlerParameter("param1", "value1");
 * 	grid.dataBind();
 * }
 * </code></pre>
 * </div>
 * @see #getDataSource
 * @see nitobi.data.DataTable#setGetHandlerParameter
 */
nitobi.grid.TreeGrid.prototype.dataBind = function()
{
	this.bind();
}

/**
 * Returns the DataTable with the specified id.
 * <p>
 * The DataTable represents the Grid's client side, XML based, data source.
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction customRequest(gridId)
 * {
 * 	var grid = nitobi.getComponent(gridId);
 * 	var datatable = grid.getDataSource();
 * 	datatable.setGetHandlerParameter("param1", "value1");
 * 	grid.dataBind();
 * }
 * </code></pre>
 * </div>
 * @param {String} paramTableId The id of the DataTable to return. If no table ID is specified 
 * the Grid DataTable is returned. Optional. 
 * @type nitobi.data.DataTable
 * @see nitobi.data.DataTable#setGetHandlerParameter
 * @see #dataBind
 */
nitobi.grid.TreeGrid.prototype.getDataSource=function(paramTableId)
{
	var tableID = this.dataTableId || "_default";
	if(paramTableId)
		tableID = paramTableId;
	return this.data.getTable(tableID);
}

/**
 * Returns the change log from the specified DataTable. 
 * <p>
 * <b>Example</b>:  Format of change log
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &lt;ntb:grid xmlns:ntb="http://www.nitobi.com"&gt;
 * 	&lt;ntb:datasources id="id"&gt;
 * 		&lt;ntb:datasource id="_default"&gt;
 * 			&lt;ntb:datasourcestructure /&gt;
 * 			&lt;ntb:data id="_default"&gt;
 * 				&lt;ntb:e xi="0" xid="id0x04922bc02ntbcmp_0" a="CIA" b="Adhesive" c="4021010" d="4.66" e="24 - 250 g pkgs" f="20896" xac="u" /&gt;
 * 			&lt;/ntb:data&gt;
 * 		&lt;/ntb:datasource&gt;
 * 	&lt;/ntb:datasources&gt;
 * &lt;/ntb:grid&gt;
 * </code></pre>
 * </div>
 * @param {String} paramTableId The ID of the DataTable to retrieve the XML log for.  Can
 * be null if the grid is not using local data.
 * @type XMLDocument
 */
nitobi.grid.TreeGrid.prototype.getChangeLogXmlDoc=function(paramTableId)
{
	return this.getDataSource(paramTableId).getChangeLogXmlDoc();
}

/**
 * Fired when a remote server call returns. This is the callback function used when for the server request made from the bind() method.
 * @param {nitobi.data.GetCompleteEventArgs}
 * @private
 */
nitobi.grid.TreeGrid.prototype.getComplete=function(evtArgs) 
{
	// This is ok here, but we should use the error handlers in table data source.
	if(null == evtArgs.dataSource.xmlDoc)
	{
		ebaErrorReport("evtArgs.dataSource.xmlDoc is null or not defined. Likely the gethandler failed use fiddler to check the response","",EBA_ERROR);
		this.fire("LoadingError");
		return;
	}

	var dataSource = evtArgs.dataSource.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+evtArgs.dataSource.id+'\']');
	ntbAssert((null != dataSource), 'Datasource is not avialable in bindComplete handler.\n');
}

/**
 * Fired when binding - to either a local or remote datasource - is complete. 
 * At this point the the data is rendered and the Grid is ready for use.
 */
nitobi.grid.TreeGrid.prototype.bindComplete=function()
{
	// If columns haven't been defined yet then define them
	// This is the case where the columns are defined by the data
	if (this.inferredColumns && !this.columnsDefined)
	{
		this.defineColumns(this.datatable);
	}

	// TODO: this setRowCount should not be here ...
	// TODO: But this is in conflict with grouping grid / block rendering mechanism so I am leaving it.  
	this.setRowCount(this.datatable.remoteRowCount);

	// The bound property indicates that events from the datasource to which
	// we are bound will now be able to cause re-renders of our interface
	this.setBound(true);

	this.syncWithData();
}
/**
 * Keeps the Grid UI surfaces in sync with the data in the connected DataTable.
 */
nitobi.grid.TreeGrid.prototype.syncWithData=function(eventArgs)
{
	// Only if we are in the "Bound" state do we want to actually render changes to the data.
	if (this.isBound())
	{
		this.Scroller.render(true);
		this.fire("DataReady", {"source":this});
	}
}

/**
 * Sets RowCountKnown to true and sets the RowCount to the rows argument value. 
 * This method is subscribed to the OnRowCountKnownEvent event on the DataTable.
 * @param {Number} rows
 * @see #OnRowCountKnownEvent
 * @private
 */
nitobi.grid.TreeGrid.prototype.finalizeRowCount= function(rows) 
{
	this.rowCountKnown=true;
	this.setRowCount(rows);
}
/**
 * Calls scrollVertical() with the pct argument. This method is subscribed to OnPastEndOfDataEvent of the DataTable.
 * @private
 * @param {Number} pct The percentage that the vertical scroll should be set to.
 * @see #OnPastEndOfData
 */
nitobi.grid.TreeGrid.prototype.adjustRowCount= function(pct) 
{
//	alert("Past End-of-data "+ pct+" : "+this.rowCount)
	this.scrollVertical(pct)
//	this.setRowCount(scrollVertical)
}

/**
 * Sets the number of rows in the Grid
 * @private
 */
nitobi.grid.TreeGrid.prototype.setRowCount= function(rows) 
{
	this.xSET("RowCount",arguments);
	if (this.getPagingMode() == nitobi.grid.PAGINGMODE_STANDARD) 
	{
		if (this.getDataMode() == nitobi.data.DATAMODE_LOCAL)
			this.setDisplayedRowCount(this.getRowsPerPage());
		else 
			this.setDisplayedRowCount(rows);
	} else {
		this.setDisplayedRowCount(rows);
	}
	this.rowCount=rows;

	//this.Scroller.setRowCount(); // maybe do this instead of updateCellRanges (more lightweight)
	this.updateCellRanges();
}

/**
 * Returns the number of rows in the Grid.
 * @type Number
 */
nitobi.grid.TreeGrid.prototype.getRowCount= function() 
{
	return this.rowCount
}
/**
 * Applies all measurements that were calculated in <code>measure()</code> and adjusts layout or re-renders things that need to be re-rendered.
 * @private
 */
nitobi.grid.TreeGrid.prototype.layout= function(columns) 
{
	if (this.prevHeight!=this.getHeight() || this.prevWidth!=this.getWidth()) {
		this.prevHeight=this.getHeight();
		this.prevWidth=this.getWidth();
		this.layoutValid=false;
	}
	if (!this.layoutValid && this.frameRendered) {
		this.layoutFrame();
		this.generateFrameCss();
		this.layoutValid=true;
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.layoutFrame= function(columns) 
{
	if (!this.frameRendered) return;		//Exit if frameRendered is not true
	if (!this.Scroller) return;				//Exit if Scroller not initialized
	
	this.minHeight=this.getMinHeight();
	this.minWidth=this.getMinWidth();

	var colScale = false;
	var rowScale = false;
	var tbH = this.getToolbarHeight(); 		// Height of toolbar;
	var rowH = this.getRowHeight(); 		// Height of a single row;
	var colW = 20; 							// Width = of a single column;
	var sbH = this.getscrollbarHeight(); 	// Height of Scrollbar;
	var sbW = this.getscrollbarWidth(); 	// Width of scrollbar;
	var hdrH = this.getHeaderHeight(); 	// Height of the header;

// TODO: is tbH really the height or is it the delta.
	tbH = this.isToolbarEnabled()?tbH:0;	// If toolbar is not visible, make its height value 0
	hdrH = this.isColumnIndicatorsEnabled?hdrH:0;

	var minH = Math.max(this.minHeight,tbH+rowH+sbH+hdrH);	// Note: need to calculate this value if width is a percent of container
	var maxH = this.Height;	// Note: need to calculate this value if height is a percent of container
	var minW = Math.max(this.minWidth,colW+sbW);
	var maxW = this.Width;

	// If columns can scale then use min and max surface widths, otherwise surface width is fixed
	if (colScale) {
		var minSW = this.Scroller.minSurfaceWidth;
		var maxSW = this.Scroller.maxSurfaceWidth;
	} else {
		var minSW = this.Scroller.SurfaceWidth;
		var maxSW = minSW;
	}
	// If rows can scale(not likely) then use min and max surface heights, otherwise surface height is fixed
	if (rowScale) {
		var minSH = this.Scroller.minSurfaceHeight;
		var maxSH = this.Scroller.maxSurfaceHeight;
	} else {
		var minSH = this.Scroller.SurfaceHeight;
		var maxSH = minSH;
	}

	// Calculate total height that would be required for vertical elements (without scrolling or scaling)
	var totalH = minSH + (tbH) + (hdrH); // Not including scrollbar
	// Calculate total that that would be required for horizontal elements (without scrolling or scaling)
	var totalW = minSW; // Not including scrollbar

	var VSvisible = (totalH > maxH); // This says scrollbar is required when the rows can't be scaled smaller and the  grid can't be scaled taller
	var HSvisible = (totalW > maxW); // This says scrollbar is required when the columns can't be scaled smaller andhe  grid can't be scaled wider

	var VSvisible = (HSvisible && ((totalH+20)>maxH)) || VSvisible; // Secondary check in case the additional height of the hscrollbar makes a vscrollbar necessary
	var HSvisible = (VSvisible && ((totalW+20)>maxW)) || HSvisible; // Secondary check in case the additional width of the vscrollbar makes a hscrollbar necessary

	sbH = HSvisible?sbH:0;	// If scrollbar is not visible, make its height value 0
	sbV = VSvisible?sbV:0;	// If scrollbar is not visible, make its width value 0

	// Now we have enough info to calculate 2 width dimensions and 4 height dimensions for the frame (looks like a 2x4 table)
		// Width dimensions
			// 1. Width of viewport (vpW)- calcutated
			// 2. Width of scrollbar (sbW)
		// Height dimenions
			// 1. Header height (hdrH)
			// 2. Height of visible rows (vpH) - calculated 
			// 3. Height of scrollbar (sbH)
			// 4. Height of toolbar (tbH)

	var vpH = totalH - hdrH - tbH - sbH;
	var vpW = totalW - sbW;

	// TODO: FROM GROUPING GRID
	this.resize();
}

/**
 * Defines the columns to be displayed in the Grid. Depending on the type of the columns argument different methods are dispatched to initialize the list of columns. 
 * As a String this property must be a bar ("|") seperated list of the column names in the nitobi.data.DataTable to which the Grid will connect. The XmlElement must 
 * contain a list column definitions as children XML nodes. Like the String type, the Array type specifies the column names in the nitobi.data.DataTable to which the 
 * Grid will connect. If an nitobi.data.DataTable is provided as the columns argument the columns in the nitobi.data.DataTable will define the columns in the Grid. 
 * Finally, if the columns argumnet is an integer it will prepare that number of columns to be defined at a later stage. OnBeforeColumnsDefinedEvent and OnAfterColumnsDefinedEvent 
 * are fired before and after this method is executed. This method is called from various places such as updateStructure(), commitProperties(), initializeModel(), and bindComplete().
 * @param {String | XmlElement | Array | nitobi.data.DataTable | Number} columns This is the description of the columns from which the Grid can determine the list of columns.
 * @param {Boolean} isRootColumns 
 * @see #OnAfterColumnsDefinedEvent
 * @see #OnBeforeColumnsDefinedEvent
 * @type XMLElement
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumns = function(columns, isRootColumns) 
{
	isRootColumns = (isRootColumns == null?true:isRootColumns);
	this.fire("BeforeColumnsDefined"); // Everything other than the frame should be cleared
	
	// TODO: Is this necessary if the declaration IS the model?
	//this.resetColumns();

	//	get all the column defs
	var colDefs = null;
	var colType = nitobi.lang.typeOf(columns);

	this.inferredColumns = false;
	
	switch (colType)
	{
		case "string":
			colDefs = this.defineColumnsFromString(columns);
			break;
		case nitobi.lang.type.XMLNODE:
		case nitobi.lang.type.XMLDOC:
		case nitobi.lang.type.HTMLNODE:
			colDefs = this.defineColumnsFromXml(columns, isRootColumns);
			break;
		case nitobi.lang.type.ARRAY:
			colDefs = this.defineColumnsFromArray(columns, isRootColumns);
			break;
		case "object":
			this.inferredColumns=true;
			colDefs = this.defineColumnsFromData(columns, isRootColumns);
			break;
		case "number":
			colDefs = this.defineColumnsCollection(columns, isRootColumns);
			break;
		default:
	}

	
	
	/*if (this.getViewableWidth() < totalWidth)
	{
		this.setViewableWidth(totalWidth);
	}*/
	
	this.fire("AfterColumnsDefined");
	if (isRootColumns)
	{
		var totalWidth = 0;
		for (var i = 0, l = colDefs.length; i < l; i++)
		{
			totalWidth += parseInt(colDefs[i].getAttribute("Width"));
		}
		this.setViewableWidth(totalWidth);
		this.defineColumnsFinalize();
	}

	return colDefs;
}

/**
 * Defines the columns to be displayed in the Grid. The XMLElement must contain 
 * a list column definitions as children XML nodes and follow the Grid tag reference for the &lt;ntb:columns&gt; element.
 * @param {Element} columns
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnsFromXml= function(columns, isRootColumns) 
{
	if (columns == null || columns.childNodes.length == 0)
	{
		return this.defineColumnsCollection(0);
	}

	// If we are using the old-style column definitions
	// then convert them to new-style defs
	if (columns.childNodes[0].nodeName == nitobi.xml.nsPrefix+'columndefinition')
	{
		var xslDoc = nitobi.xml.createXslDoc(nitobi.grid.declarationConverterXslProc.stylesheet);
		columns = nitobi.xml.transformToXml(columns, xslDoc);
	}

	//var wL = 0, wT = 0, wR = 0;
	//var defaultColumnDef = this.defaultColumnDef;

	// get the original list of columns from the model
	//var originalCols = this.getColumnDefinitions().length;

	var cols = columns.childNodes.length;

	//var xDec = this.model.selectSingleNode("//ntb:columns");
	var xDec = columns;
	xDec = this.modelNode.appendChild(xDec.cloneNode(true));
	ntbAssert((columns && columns.xml != ''), 'There are either no column definitions defined in the HTML declaration or they could not be parsed as valid XML.', "", EBA_DEBUG);

	var columnDefinitionsArray = xDec.childNodes;


	//	TODO: these are set in intitializeModelFromDeclaration but maybe they should not be ...
	//	intitializeModelFromDeclaration is called immediately prior to this method
	//var fL=this.getFrozenLeftColumnCount();
	//var fR=this.getfreezeright();
	
	// If the state of the grid has not been saved, we should have 0 columns 
	// in the model and go off the declaration.
	//if (originalCols == 0) 
	//{
		//var cols = columnDefinitionsArray.length;
		//for (var i=0; i<cols;i++)
		var columnCount = columns.childNodes.length;
		for (var i = 0; i < columnCount; i++) 
		{
			//var e = defaultColumnDef.cloneNode(true);
			// {
			var col = columnDefinitionsArray[i];

			var columnDataType = '';
			var columnNodeName = col.nodeName;

			var editorNode = col.selectSingleNode("ntb:texteditor|ntb:numbereditor|ntb:textareaeditor|ntb:imageeditor|ntb:linkeditor|ntb:dateeditor|ntb:lookupeditor|ntb:listboxeditor|ntb:checkboxeditor|ntb:passwordeditor");
			var columnEditor = "TEXT";

			// Get the column datat type from the column node name
			var columnNames = {"ntb:textcolumn":"EBATextColumn",
							"ntb:numbercolumn":"EBANumberColumn",
							"ntb:datecolumn":"EBADateColumn",
							"ntb:expandcolumn":"EBAExpandColumn"};

			var columnDataType = columnNames[columnNodeName].replace('EBA','').replace('Column','').toLowerCase();

			// Column editor name shows up in the column def as "type" and "editor"
			var columnEditorNames = {
							"ntb:numbereditor":"EBANumberEditor", 
							"ntb:textareaeditor":"EBATextareaEditor", 
							"ntb:imageeditor":"EBAImageEditor", 
							"ntb:linkeditor":"EBALinkEditor", 
							"ntb:dateeditor":"EBADateEditor", 
							"ntb:lookupeditor":"EBALookupEditor", 
							"ntb:listboxeditor":"EBAListboxEditor", 
							"ntb:passwordeditor":"EBAPasswordEditor", 
							"ntb:checkboxeditor":"EBACheckboxEditor"};

			if (editorNode != null) {
				// If there is an editor element defined then use it
				columnEditor = columnEditorNames[editorNode.nodeName] || columnEditor;
			} else {
				// If there is no editor element then use editor for the column data type
				columnEditor = columnNames[columnNodeName] || columnEditor;
			}
			columnEditor = columnEditor.replace('EBA','').replace('Editor','').replace('Column','').toUpperCase();
			var e = this.model.selectSingleNode("/state/Defaults/ntb:column[@DataType='"+(columnDataType)+"' and @type='"+columnEditor+"' and @editor='"+columnEditor+"']").cloneNode(true);

			this.setModelValues(e, col);

			var sColumnType = columnNames[col.nodeName] || "EBATextColumn";

			// Looks for Datasource attributes on the column and parses it
			// into a real datatable object.
				this.defineColumnDatasource(e); 

			// By now ALL attributes are set.
			//	Except for maybe the DatasourceId
			this.defineColumnBinding(e);

			// This adds the column def to the grid's state.
			//xDec.appendChild(e);
			xDec.replaceChild(e, col);
			//this.modelNode.appendChild

			// Adding gethandler data table.
			var gethandler = e.getAttribute('GetHandler');
			if (gethandler)
			{
				//	Careful, other objects have a handle to this one. If a new this.data is created, a copy is made
				//	since the old this.data is still in memory due to live handles.
				var datasourceId = e.getAttribute("DatasourceId");
				if (!datasourceId || datasourceId == '')
				{
					datasourceId = "columnDatasource_"+i+"_"+this.uid;
					e.setAttribute("DatasourceId", datasourceId);
				}

			
				var dt = new nitobi.data.DataTable('local', this.getPagingMode() == nitobi.grid.PAGINGMODE_LIVESCROLLING,{GridId:this.getID()},{GridId:this.getID()}, this.isAutoKeyEnabled());
				dt.initialize(datasourceId, gethandler, null);
				dt.async = false;

				this.data.add(dt);

				var params = [];
				params[0] = e;

				// Do differnent things depending on the type of editor we are getting data for ...
				var sEditor = e.getAttribute("editor")
				var firstRow = null;
				var lastRow = null;
				// If this i a lookup we just want 1 record - or even none - just for the schema information 
				if (e.getAttribute("editor") == "LOOKUP")
				{
					// Get the first row of the data just to do the field mapping.
					firstRow = 0;
					lastRow = 1;
					dt.async = true;
				}

				// TODO: This is currently synchronous since we need the fieldMap information to render the column.
				dt.get(firstRow, lastRow, this, nitobi.lang.close(this, this.editorDataReady, [e]), function()
				{
					ntbAssert(false,'Datasource for '+e.getAttribute('ColumnName'),'',EBA_WARN);
				});
//					this.editorDataReady(e)
			}
//			}

//			TODO: We should be doing something with measure ...
			this.measureColumns();

			if (isRootColumns)
				this.setColumnCount(cols);

		}

		// This is where old-style datasources will be found
		var oldEditorDatasources;

		oldEditorDatasources = columns.selectSingleNode("/"+nitobi.xml.nsPrefix+"grid/"+nitobi.xml.nsPrefix+"datasources");

		if (oldEditorDatasources)
		{
			this.Declaration.datasources = nitobi.xml.createXmlDoc(oldEditorDatasources.xml);
		}

	// We use '//' in our xpath because the old columns will be enclosed in an ntb:grid 
	// object, but our new columns will be in an ntb:columns object.
	return xDec.childNodes;
}
/**
 * Updates objects that are affected by changes to column structure.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnsFinalize = function()
{
	this.setColumnsDefined(true);
	if (this.connected) {
		if (this.frameRendered) {
			//this.makeXSL(); //renderColumns depends on makeXSL
			this.generateColumnCss();
			this.renderHeaders();
		}
	}
}

/**
 * Parses a datasource from a column that could be defined either
 * from a Datasource attribute or a Datasource child declaration node.
 * This could also be extended to check for the DatasourceId property
 * or the getHandler property that are both defined elsewhere for the moment.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnDatasource = function(xColumnModel)
{
	var val = xColumnModel.getAttribute('Datasource');
	if (val != null)
	{
		var ds = new Array();
		// a datasource has been specified
		try
		{
			ds = eval(val);
		}
		catch(e)
		{
			// The datasource could not be parsed as a JavaScript array ... now what.
			var aNameValue = val.split(',');
			if (aNameValue.length >0)
			{
				for (var i=0; i<aNameValue.length; i++)
				{
					var item = aNameValue[i];
					ds[i] = {text:item.split(':')[0],display:item.split(':')[1]};
				}
			}
			return
		}
		if (typeof(ds) == "object" && ds.length > 0)
		{
			// it could be a JavaScript array datasource
			// in this case loop through the array and create a datasource
			var oDataTable = new nitobi.data.DataTable('unbound', this.getPagingMode() == nitobi.grid.PAGINGMODE_LIVESCROLLING,{GridId:this.getID()},{GridId:this.getID()}, this.isAutoKeyEnabled());
			var sTableId = 'columnDatasource'+new Date().getTime();
			oDataTable.initialize(sTableId);
			xColumnModel.setAttribute('DatasourceId', sTableId);

			var sFields = '';
			// first look at one item in the array and get the fields list out of it
			for (var item in ds[0])
			{
				sFields += item + '|';
			}
			sFields = sFields.substring(0, sFields.length-1);

			// now init the datatable with our list of fields.
			oDataTable.initializeColumns(sFields);

			for (var i=0; i<ds.length; i++)
			{
				// create a record in the datatable
				oDataTable.createRecord(null, i);
				for (var item in ds[i])
				{
					oDataTable.updateRecord(i, item, ds[i][item]);
				}
			}
			this.data.add(oDataTable);

			this.editorDataReady(xColumnModel);
		}
	}
}

/**
 * @private
 */
/*
nitobi.grid.TreeGrid.prototype.defineColumnEditor = function(xColumnModel, xColumnDeclaration)
{
	var len = xColumnDeclaration.childNodes.length; 
	if (len > 0)
	{
		var xEditorNode = xColumnDeclaration.selectSingleNode("ntb:texteditor|ntb:numbereditor|ntb:textareaeditor|ntb:imageeditor|ntb:linkeditor|ntb:dateeditor|ntb:lookupeditor|ntb:listboxeditor|ntb:checkboxeditor|ntb:passwordeditor");
		if (xEditorNode != null)
		{
			var sEditor = 'EBATextEditor';
			var sNodeName = xEditorNode.nodeName;

			if (sNodeName.indexOf("numbereditor") != -1) {
				sEditor = 'EBANumberEditor';
			} else if (sNodeName.indexOf("textareaeditor") != -1) {
				sEditor = 'EBATextareaEditor';
			} else if (sNodeName.indexOf("imageeditor") != -1) {
				sEditor = 'EBAImageEditor';
			} else if (sNodeName.indexOf("linkeditor") != -1) {
				sEditor = 'EBALinkEditor';
			} else if (sNodeName.indexOf("dateeditor") != -1) {
				sEditor = 'EBADateEditor';
			} else if (sNodeName.indexOf("lookupeditor") != -1) { 
				sEditor = 'EBALookupEditor';
			} else if (sNodeName.indexOf("listboxeditor") != -1) {
				sEditor = 'EBAListboxEditor';
			} else if (sNodeName.indexOf("passwordeditor") != -1) {
				sEditor = 'EBAPasswordEditor';
			} else if (sNodeName.indexOf("checkboxeditor") != -1) {
				sEditor = 'EBACheckboxEditor';
			}

			this.setModelDefaults(xColumnModel, xEditorNode, "interfaces/interface[@name='"+sEditor+"']/properties/property");
			this.setModelDefaults(xColumnModel, xEditorNode, "interfaces/interface[@name='"+sEditor+"']/events/event");
	
			xColumnModel.setAttribute("type", sNodeName.substring(4,sNodeName.indexOf("editor")).toUpperCase());
			xColumnModel.setAttribute("editor", sNodeName.substring(4,sNodeName.indexOf("editor")).toUpperCase());
		}
	}
	else
	{
		var columnNode = xColumnDeclaration;
		var sEditor = '';
		var sNodeName = columnNode.nodeName;

		if (sNodeName.indexOf("numbercolumn")) {
			sEditor = 'EBANumberEditor';
		} else if (columnNode.nodeName.indexOf("dateeditor")) {
			sEditor = 'EBADateEditor';
		}

		this.setModelDefaults(xColumnModel, columnNode, "interfaces/interface[@name='"+sEditor+"']/properties/property");
		this.setModelDefaults(xColumnModel, columnNode, "interfaces/interface[@name='"+sEditor+"']/events/event");

		xColumnModel.setAttribute("type", sNodeName.substring(4, sNodeName.indexOf("column")).toUpperCase());
	}
}
*/

/**
 * Defines the Grid columns from the information in a nitobi.data.DataTable. This can be used to infer the columns in a grid based on the columns that exist in the DataTable.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnsFromData= function(datatable) 
{
	if (datatable == null)
	{
		datatable = this.datatable;
	}
	// TODO: Explicit XPath statement
	var structureNode = datatable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasourcestructure');

	if (structureNode==null) {
		return this.defineColumnsCollection(0);
	}
	var fields = structureNode.getAttribute('FieldNames');
	if (fields.length==0) {
		return this.defineColumnsCollection(0);
	}

	var defaults = structureNode.getAttribute('defaults');

	var colDefs = this.defineColumnsFromString(fields);

	// Overlay type and width aspects (good place to infer editors)
	for (var i=0; i < colDefs.length; i++)
	{
		if (defaults && i<defaults.length) {
			colDefs[i].setAttribute("initial", defaults[i]||"");
		}
		colDefs[i].setAttribute("width", 100);
	}
	this.inferredColumns=true;

	return colDefs;
}

/**
 * Defines the Grid columns from a bar ("|") separated list of columns. The string value for each column is used for the label as well as the xdatafld binding property.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnsFromString= function(columns) 
{
	return this.defineColumnsFromArray(columns.split("|"));	
}
/**
 * Defines the Grid columns from an array of either string values or nitobi.components.grid.Column objects. 
 * It will also accept structs with the same field names that are in the nitobi.components.grid.Column class such as name, label, width, columntype, editortype, mask, initial.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnsFromArray= function(columns) 
{
	var cols = columns.length;
	var colDefs = this.defineColumnsCollection(cols);
	for (var i=0;i<cols;i++) {
		var col = colDefs[i];
		if (typeof(columns[i])=="string") {
			// Set the proper name of the column - this is the friendly database field name
			col.setAttribute("ColumnName",columns[i]);
			// Set the original xdatafld attribute - this just indicates at later stages
			// that this column has already had the xdatafld value converted
			col.setAttribute("xdatafld_orig",columns[i]);
			col.setAttribute("DataField_orig",columns[i]);
			col.setAttribute("Label",columns[i]);
			// Now set the xdatafld value to the actual fieldMap value
			if (typeof(this.fieldMap[columns[i]])!="undefined") {
				col.setAttribute("xdatafld", this.fieldMap[columns[i]]); // May have to use fieldMap
				col.setAttribute("DataField", this.fieldMap[columns[i]]); // May have to use fieldMap
			} else {
				col.setAttribute("xdatafld","unbound"); // Hack - should be able to omit - XSL requires a value here
				col.setAttribute("DataField","unbound"); // Hack - should be able to omit - XSL requires a value here
			}
		} else {
			if (columns[i].name != '_xk') // ???
			{
				// Set model values to those of the JS Array
				col.setAttribute("ColumnName", col.name);
				col.setAttribute("xdatafld_orig", col.name);
				col.setAttribute("DataField_orig", col.name);
				col.setAttribute("xdatafld", this.fieldMap[columns[i].name]);
				col.setAttribute("DataField", this.fieldMap[columns[i].name]);
				col.setAttribute("Width", col.width);
				col.setAttribute("Label", col.label);
				col.setAttribute("Initial", col.initial);
				col.setAttribute("Mask", col.mask);
			}
		}
	}
	this.setColumnCount(cols);
	return colDefs;	
}

/**
 * Binds the columns in the Grid to columns in the connected DataTable. This involves mapping the xdatafld property of each column to the corresponding
 * XPath query in the DataTable for the column with that name.
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnBindings = function() 
{
	//	If the columns are defined in the declaration we need to loop through and set
	//	the mappings from friendly column names like "ProductName" to @a etc.
	//	This can only be done once the data is ready
	var xslt = nitobi.grid.rowXslProc.stylesheet;
	var cols = this.getColumnDefinitions();
	for (var i=0; i<cols.length;i++) {
		var e = cols[i];
		//	Keep track of the actual database column name
		this.defineColumnBinding(e, xslt);
		e.setAttribute("xi",i);
	}
	nitobi.grid.rowXslProc = nitobi.xml.createXslProcessor(xslt);
}
/**
 * Method to set any special values on column definition for data binding
 * @private
 */
nitobi.grid.TreeGrid.prototype.defineColumnBinding = function(element, xslt)
{
	if (this.fieldMap == null)
	{
		return;
	}
	var sFieldName = element.getAttribute("xdatafld");
	var sFieldNameOrig = element.getAttribute("xdatafld_orig");
	if (sFieldNameOrig == null || sFieldNameOrig == "")
	{
		element.setAttribute("xdatafld_orig", sFieldName);
		element.setAttribute("DataField_orig", sFieldName);
	} else {
		// Now get the original field name and set the column to that once more.
		// TODO: Not sure that I need this statement ...
		sFieldName = element.getAttribute("xdatafld_orig");
	}

	element.setAttribute("ColumnName", sFieldName);

	// Using the FieldName we now lookup the actual xpath from the fieldmap.
	var mappedName = this.fieldMap[sFieldName];
	if (typeof(mappedName) != "undefined")
	{
		element.setAttribute("xdatafld", mappedName);
		element.setAttribute("DataField", mappedName);
	}

	this.formatBinding(element, 'CssStyle', xslt);
	this.formatBinding(element, 'ClassName', xslt);
	this.formatBinding(element, 'Value', xslt);

//	else
//	{
//		element.setAttribute("xdatafld", 'unbound'); // hack here - it should never be unbound ...
//	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.formatBinding = function(element, attName, xslt)
{
	var attValue = element.getAttribute(attName);
	var attValueOrig = element.getAttribute(attName+"_orig");

	if (attValue == null || attValue == "")
		return;

	if (attValueOrig == null || attValueOrig == "")
		element.setAttribute(attName+"_orig", attValue);

	attValue = element.getAttribute(attName+"_orig");

	var re = new RegExp('\\{.[^\}]*}', 'gi');
	var exprMatches = attValue.match(re);

	if (exprMatches == null)
		return;

	for (var i=0; i<exprMatches.length; i++)
	{
		var origExpr = exprMatches[i];
		var newExpr = origExpr;

		var fieldRegex = new RegExp('\\$.*?[^0-9a-zA-Z\_]', 'gi');
		var fieldMatches = newExpr.match(fieldRegex);
		for (var j=0; j<fieldMatches.length; j++)
		{
			var fieldMatch = fieldMatches[j];
			var fieldExpr = fieldMatch.substring(0, fieldMatch.length-1);
			var dataField = fieldExpr.substring(1);
			var realField = this.fieldMap[dataField]+"";
//			if (realField != null) {
				newExpr = newExpr.replace(fieldExpr, realField.substring(1) || "");
//			} else
//				newExpr = newExpr.replace(fieldExpr, "");
		}
		newExpr = newExpr.substring(1,newExpr.length-1);
		//	newExpr = '&lt;xsl:value-of select="'+newExpr.substring(1,newExpr.length-1)+'"/&gt;';
		attValue = attValue.replace(origExpr, newExpr).replace(/\{\}/g, '');
	}
	element.setAttribute(attName, attValue);
}


/**
 * Defines the default columns based on the number of columns as specified by the cols argument.
 * @private
 * @param {Number} cols The number of columns that are going to be defined.
 */
nitobi.grid.TreeGrid.prototype.defineColumnsCollection= function(cols) 
{
	// Get the existing columns collection
	var xDec = this.model.selectSingleNode("//ntb:columns");

	var colDefs = xDec.childNodes;
	
	//var defaultColumnDef = this.defaultColumnDef;
	var defaultColumnDef = this.model.selectSingleNode("/state/Defaults/ntb:column");
	// All columns are unbound by default (i.e. no xdatafld)
	for (var i=0; i<cols;i++) {
		var e = defaultColumnDef.cloneNode(true);
		xDec.appendChild(e);
		e.setAttribute("xi",i);
	//		e.setAttribute("xdatafld","@" +(i>25?String.fromCharCode(Math.floor(i/26)+97):"")+(String.fromCharCode(i%26+97)));
		e.setAttribute("title",(i>25?String.fromCharCode(Math.floor(i/26)+65):"")+(String.fromCharCode(i%26+65)));
	}
	this.setColumnCount(cols);
	var colDefs = xDec.selectNodes("*");
	return colDefs;
}

/**
 * Removes all the column definitions from the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.resetColumns=function() 
{
	// Delete existing cols
	this.fire("BeforeClearColumns");
	this.inferredColumns=true;
	this.columnsDefined=false;
	var Existing = this.model.selectSingleNode("//ntb:columns");

	//Create columns based upon #of columns
	var xDec = nitobi.xml.createElement(this.model, "columns");
	if (Existing==null) {
		this.model.documentElement.appendChild(xDec);
	} else {
		this.model.documentElement.replaceChild(xDec,Existing);
	}
	this.setColumnCount(0);
	this.fire("AfterClearColumns");
}

/**
 * If there are columns defined, renders the header of each column in the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.renderHeaders=function() 
{
	// If there are no column definitions then dont even try and render the columns...
	if (this.getColumnDefinitions().length > 0)
	{
		this.clearHeader();
		this.renderHeader();
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeSelection = function() 
{
	var sel = new nitobi.grid.Selection(this, this.isDragFillEnabled());
	sel.setRowHeight(this.getRowHeight());
	sel.onAfterExpand.subscribe(this.afterExpandSelection, this);
	sel.onBeforeExpand.subscribe(this.beforeExpandSelection, this);
	sel.onMouseUp.subscribe(this.handleSelectionMouseUp, this);
	// this.Selection is for backwards compat
	this.selection = this.Selection = sel;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.beforeExpandSelection = function(evt)
{
	this.setExpanding(true);
	this.fire("BeforeDragFill", new nitobi.base.EventArgs(this, evt));
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.afterExpandSelection = function(evt)
{
	// Get the selection start and end size ...
	var sel = this.selection;

	var coords = sel.getCoords();

	var selectionTopRow = coords.top.y;
	var selectionBottomRow = coords.bottom.y;

	var selectionLeftColumn = coords.top.x;
	var selectionRightColumn = coords.bottom.x;

	var origData = this.getTableForSelection({top:{x:sel.expandStartLeftColumn,y:sel.expandStartTopRow},bottom:{x:sel.expandStartRightColumn,y:sel.expandStartBottomRow}}, evt.surfacePath);

	// Take the data in the start size and repeat it as many times as it can to generate some paste data
	// When we have selected up paste the start row we copy the data backwards up ..

	var data = "", pasteClipBoard = this.getClipboard();

	if (sel.expandingVertical) {
		if (sel.expandStartBottomRow > selectionBottomRow && selectionTopRow >= sel.expandStartTopRow) {
			// This is the case that we are reducing the size of the selection so clear any now unselected cells
			// Loop through columns that were initially selected and the rows that are now unselected and clear the values
			for (var i=sel.expandStartLeftColumn; i<=sel.expandStartRightColumn; i++)
			{
				for (var j=selectionBottomRow+1; j<sel.expandStartBottomRow+1; j++)
					this.getCellObject(j, i).setValue("");
			}
		} else {
			// Vertical expansion case ... just repeat rows
			var expandDown = (sel.expandStartBottomRow < selectionBottomRow);
			var expandUp = (sel.expandStartTopRow > selectionTopRow);
			var expand = (expandDown || expandUp);
			if (expand) {
				// Strip off the final newline character
				if (origData.lastIndexOf("\n") == origData.length-1)
					origData = origData.substring(0, origData.length-1);
	
				var rep = (Math.floor((sel.getHeight() - !expand) / sel.expandStartHeight))
				for (var i=0; i<rep; i++)
					data += origData + (!nitobi.browser.IE?"\n":"");
				origDataArr = origData.split("\n");
				var mod = (sel.getHeight() - !expand) % sel.expandStartHeight;
	
				var val = "";

				if (expandDown) {
					// Remove the extra data from the mod value to the end
					origDataArr.splice(mod, origDataArr.length - mod);
					// Concat the original + repeated data with the mod'ed data
					val = data + origDataArr.join("\n") + (origDataArr.length > 0?"\n":"");
				} else{
					// Remove the extra data from the mod value to the end
					origDataArr.splice(0, origDataArr.length - mod);
					// Concat the original + repeated data with the mod'ed data
					val = origDataArr.join("\n") + (origDataArr.length > 0?"\n":"") + data;
				}

// This is for the case when we are contracting the selection
//				} else {
//					origDataArr = origDataArr.splice(0, mod);
//					val = origDataArr.join("\n") + (origDataArr.length > 0?"\n":"") + data;
//				}
				pasteClipBoard.value = val;
	
				this.pasteDataReady(pasteClipBoard);
			}
		}
	} else {
		if (sel.expandStartRightColumn > selectionRightColumn && selectionLeftColumn >= sel.expandStartLeftColumn)
		{
			// This is the case that we are reducing the size of the selection so clear any now unselected cells
			// Loop through rows that were initially selected and the columns that are now unselected and clear the values
			for (var i=selectionLeftColumn+1; i<=sel.expandStartRightColumn+1; i++)
			{
				for (var j=sel.expandStartTopRow; j<sel.expandStartBottomRow; j++)
					this.getCellObject(j, i).setValue("");
			}
		} else {
			// Horizontal expansion case ...
			var expandRight = sel.expandStartRightColumn < selectionRightColumn;
			var expandLeft = sel.expandStartLeftColumn > selectionLeftColumn;
			var expand = (expandRight || expandLeft);
			if (expand) {

				// Get the number of cells that are being expanded that are a fraction of a repeat block
				var mod = (sel.getWidth() - !expand) % sel.expandStartWidth;
	
				var newline = (!nitobi.browser.IE?"\n":"\r\n");
				// Strip off the final newline character
				if (origData.lastIndexOf(newline) == origData.length-newline.length)
					origData = origData.substring(0, origData.length-newline.length);
	
				// Get rid of any \r characters
				var origDataArr = origData.replace(/\r/g,"").split("\n");
				var data = new Array(origDataArr.length);
				var rep = (Math.floor((sel.getWidth() - !expand) / sel.expandStartWidth));
	
				// Iterate over each row in the original data and build the output
				for (var i=0; i<origDataArr.length; i++)
				{
					// Now append on any data beyond the end from the mod
					var origDataLineArr = origDataArr[i].split("\t");
	
					// Iterate over the number of times the full selection is repeated
					for (var j=0; j<rep; j++) {
						// The output data for a row is just the already generated data plus the the original data for that row again.
						data[i] = (data[i]==null?[]:data[i]).concat(origDataLineArr);
					}
	
					if (mod != 0) {
						// If we are expanding right
						if (expandRight) {
							data[i] = data[i].concat(origDataLineArr.splice(0, mod));
							// TODO: need to do something special here depending on Left or Right xpand
						} else {
							data[i] = origDataLineArr.splice(mod, origDataLineArr.length - mod).concat(data[i]);
						}
					}
					data[i] = data[i].join("\t");
				}
	
				pasteClipBoard.value = data.join("\n") + "\n";
				this.pasteDataReady(pasteClipBoard);
			}
		}
	}
	this.setExpanding(false);
	this.fire("AfterDragFill", new nitobi.base.EventArgs(this, evt));
	// TODO: support dragging to a smaller area ...
}

/**
 * Calculates the height of the rows in the Grid. If the start and end 
 * arguments are defined then it will calculate the height of those rows only.
 * @param {Number} start The zero based start row index.
 * @param {Number} end The end row index.
 * @type Number
 * @private
 */
nitobi.grid.TreeGrid.prototype.calculateHeight = function(start, end) 
{
	start = (start != null)?start:0;
	var numRows = this.getDisplayedRowCount();
	end = (end != null)?end:numRows - 1;
	return (end - start + 1) * this.getRowHeight();
}

/**
 * Calculates the width of the columns in the Grid. If the start and end 
 * arguments are defined then it will calculate the width of those columns only.
 * @param {Number} start The zero based start column index.
 * @param {Number} end The end column index.
 * @type Number
 * @private
 */
nitobi.grid.TreeGrid.prototype.calculateWidth= function(start, end) 
{
	var colDefs = this.getColumnDefinitions();
	var cols = colDefs.length;
	start = start || 0;
	end = (end != null)?Math.min(end,cols):cols;
	var wT = 0;
	for (var i=start; i<end;i++) {
		if (colDefs[i].getAttribute("Visible") == "1" || colDefs[i].getAttribute("visible") == "1") {
			wT+=Number(colDefs[i].getAttribute("Width"));
		}
	}
	return (wT);
}

/**
 * Resizes grid to size of container div
 */
nitobi.grid.TreeGrid.prototype.maximize = function()
{
	// TODO: this should probably be parentNode rather than offsetParent?
 	var x,y;
	var off_p = this.element.offsetParent;
	
	x = off_p.clientWidth;
	y = off_p.clientHeight;
	
	this.resize(x,y);
}

//	Now that we have created the datasource we need to set the ValueField and DisplayFields from the old declaration ... or inline datasource maybe ...
/**
 * Connects column editors to datasources. The datsources can be local (specified with a DatasourceId or JSON array) or remote (specified with a GetHandler).
 * @param {XMLElement} column XML column node from declaration / state.
 * @private
 */
nitobi.grid.TreeGrid.prototype.editorDataReady= function(column)
{
	//	TODO: all of these sorts of things should be done through an EBA API that checks if the attribute exists first etc.
	var displayFields = column.getAttribute('DisplayFields').split('|');
	var valueField = column.getAttribute("ValueField");

	//	Get the datasource for the column we are concerned with.
	var dataTable = this.data.getTable(column.getAttribute('DatasourceId'));

	var initial = column.getAttribute("Initial");
	if (initial == "")
	{
		var editorType = column.getAttribute("type").toLowerCase();
		switch (editorType)
		{
			case "checkbox":
			case "listbox":
			{
				var valueFieldAtt = dataTable.fieldMap[valueField].substring(1);
				var data = dataTable.getDataXmlDoc();
				if (data != null)
				{
					var val = data.selectSingleNode("//"+nitobi.xml.nsPrefix + "e[@" + valueFieldAtt + "='"+initial+"']");
					if (val == null)
					{
						var firstRow = data.selectSingleNode("//"+nitobi.xml.nsPrefix + "e");
						if (firstRow != null)
						{
							initial = firstRow.getAttribute(valueFieldAtt);
						}
					}
				}
				break;
			}
		}
		column.setAttribute("Initial", initial);
	}	

//	ntbAssert((displayFields.length != 1 && displayFields[0] != ''), 'There is no display field defined for a column of type lookup or listbox');

	if ((displayFields.length == 1 && displayFields[0] == '') && (valueField == null || valueField == ''))
	{
		//	This just gets the first item in the fieldMap hash if the displayFields have not been defined
		for (var item in dataTable.fieldMap)
		{
			displayFields[0] = dataTable.fieldMap[item].substring(1);
			break;
		}
	}
	else
	{
		//	Need to loop through the display fields to convert them to eba type attribute values
		for (var i=0; i<displayFields.length; i++)
		{
			displayFields[i] = dataTable.fieldMap[displayFields[i]].substring(1);
		}
	}
	var displayFieldsString = displayFields.join('|');

//	ntbAssert((valueField != null && valueField != ''), 'There is no value field defined for a column of type lookup or listbox');

	if (valueField == null || valueField == '')
	{
		//	Since there is no sign of the valueField then just set it the same as the displayField
		valueField = displayFields[0];
	}
	else
	{
		valueField = dataTable.fieldMap[valueField].substring(1);
	}

	column.setAttribute("DisplayFields", displayFieldsString);
	column.setAttribute("ValueField", valueField);
}
/*
nitobi.grid.TreeGrid.prototype.calcForumlas = function(cell)
{
	//	Now we need to re-calculate all the formulas for this row ...
	var cols = this.columns;
	var len = cols.length;

	//	Loop through each column and see if it is of type formula ... if so we need to re-calc it
	for (var i=0; i<len; i++)
	{
		if (cols[i].type == "FORMULA")
		{
			//	re-calculate the formula ...
			var f = cols[i].xdatafld;
			var re = /$\{(.*?)\}/gi;
			var reBG = f.match(re);
			if (reBG != null)
			{
				var BGL = reBG.length;
				for (var j=0; j<BGL; j++)
				{
					var curfld = reBG[j].replace(re,"$1");
					var stp = 'this.GetXMLDataField("'+curfld+'", '+curRow+')';
					f = f.replace(reBG[j],stp);
				}

				var newValue = eval(f)*1;
				var val=0;

				if (_getBoolean(cols[i].showSummary))
				{
					var msk = cols[i].mask || '###,##0.00';
					var sumCell = document.getElementById(i + '_Column_Sum' + this.element.uniqueID);

					//	Get the old cell value
					var cellPrevValue = this.getCellValue(curRow, i);
					//	Get the old summary value
					var colPrevSummary = maskedToNumber(sumCell.innerText, this.decimalSeparator);

					val = formatNumber(colPrevSummary - cellPrevValue + newValue, msk, this.decimalSeparator, this.groupingSeparator);
					if (val=="false") continue;
					//	Set the new summary value
					sumCell.innerHTML = val;
				}

				val = formatNumber(newValue, msk, this.decimalSeparator, this.groupingSeparator);

				//	Set this flag so that setCell will not attempt to call calcFormulas again and create a loop ...
				cell.calculate = false;
				cell.setValue(val);
				cell.calculate = false;
			}
		}
	}
}


/// <function name="calcSummary" access="private">
/// <summary>Calculates the summary values for any FORMULA and NUMBER columns.</summary>
/// </function>
function _gridlist.prototype.calcSummary()
{
	var uniqueID = this.element.uniqueID;
	var cols = this.columns;
	var clen = cols.length;

	var iRows = this.rowCount();

	var oRows = document.getElementById("rows"+uniqueID);
	var oFreezeRows = document.getElementById("freezerows"+uniqueID);

	//	This is for summary rows on formula columns that cannot be calculated in the xsl
	for (var m=0; m<clen; m++)
	{
		if (cols[m].type == "FORMULA" || cols[m].type == "NUMBER")
		{
			//	bSummary tells if we are showing the summary for THIS column or not
			var bSummary = _getBoolean(cols[m].showSummary);
			var curfld = cols[m].xdatafld;
			var sum = 0;
			var oCell = null;

			for (var i=0; i<iRows; i++)
			{
				var xVal = this.getCellValue(i,m);

				//	First we need to do a data update for the formula columns so that the values will be in the xml
				if (cols[m].type == "FORMULA")
				{
					var xslfld = this.fieldmap[curfld]+"";
					if (xVal != null && !gEsc) 
					{
						var xk = this.getKey(i);
						xNode = this.oXML.documentElement.selectSingleNode("*[@xk = '"+xk+"']");
						if (xNode != null) {
							xVal = maskedToNumber(xVal, this.decimalSeparator)+"";
							xNode.setAttribute(xslfld.substr(1),xVal);
						}
					}
				}

				//	Then we sum the values if we are in a summary column
				if (bSummary)
					sum += xVal*1;
			}

			//	Also need to set the summary cell for this column as the sum value ...
			if (bSummary)
			{
				var msk = cols[m].mask || '###,##0.00';
				var val = formatNumber(sum, msk, this.decimalSeparator, this.groupingSeparator);

				if (val=="false") return;

				//	Get a handle to the summary cell for the current column
				var sumCell = document.getElementById(m + '_Column_Sum' + uniqueID);
				sumCell.innerHTML = val;
			}
		}
	}
}
*/

/**
 * Handles clicks on the header by the user.
 * @param {Number} nColumn The header number clicked on.
 * @private
 */
nitobi.grid.TreeGrid.prototype.headerClicked= function(nColumn, surfacePath)
{
	var column = this.getColumnObject(nColumn, surfacePath);
	var headerClickEventArgs = new nitobi.grid.OnHeaderClickEventArgs(this, column);

	// TODO: here is not actually a headerclick even on the Grid itself ...
	if (!this.fire("HeaderClick", headerClickEventArgs) || !nitobi.event.evaluate(column.getOnHeaderClickEvent(), headerClickEventArgs)) return;

	this.sort(nColumn, null, surfacePath);
}

/**
 * Adds a filter to apply to the Grid data. A filter consits of a field, comparator, and value that can be used
 * to reduce the set of data rendered in the Grid. By default there are no filters applied.
 * @private
 */
nitobi.grid.TreeGrid.prototype.addFilter= function() 
{
	this.dataTable.addFilter(arguments);
}
/**
 * Clears exisitng filters on the grid data.
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearFilter=function() 
{
	this.dataTable.clearFilter();
}

/**
 * Re-sorts the grid data by the specified column.
 * By default the data is sorted in ascending order first. When sort is 
 * called on a column a second time, the data is sorted in descending 
 * order. Column sorting is alphabetical unless the data type for the 
 * column is NUMBER or DATE.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &lt;a href="javascript:nitobi.getComponent('grid1').sort(0, 'Asc')"&gt;Sort First Column&lt;/a&gt;
 * </code></pre>
 * </div>
 * @param {Number} sortCol The index of the column to sort on, starting at 0.
 * @param {String} sortDir The direction to sort the column by. Values are "Asc" and "Desc".
 */
nitobi.grid.TreeGrid.prototype.sort = function(sortCol, sortDir, surfacePath) 
{
	ntbAssert(typeof(sortCol)!="undefined","No column to sort.");

	var headerColumn = this.getColumnObject(sortCol, surfacePath);
	if (headerColumn == null || !headerColumn.isSortEnabled()) return;

	var beforeSortEventArgs = new nitobi.grid.OnBeforeSortEventArgs(this, headerColumn);
	if (!this.fire("BeforeSort", beforeSortEventArgs) || !nitobi.event.evaluate(headerColumn.getOnBeforeSortEvent(), beforeSortEventArgs)) return;

	if (sortDir == null || typeof(sortDir) == "undefined")
		sortDir = (headerColumn.getSortDirection()=="Asc")?"Desc":"Asc";

	if (headerColumn.getType().toLowerCase() == "expand")
		return;
	this.Selection.clear();
	this.Scroller.clearSurface(null, null, null, null, surfacePath);
	var surface = this.Scroller.getSurface(surfacePath);
	surface.sort(sortCol, sortDir);

	// TODO: Obviously belongs in the subclass.
	var sortLocal = (this.getSortMode() == 'local' || (this.getDataMode() == 'local' && this.getSortMode() != 'remote'));
	if (!sortLocal && surface.key == "0" && this.getPagingMode() != "livescrolling")
	{
		this.loadDataPage(0);
	}
	else
	{
		var visibleRows = surface.getUnrenderedBlocks(0);
		surface.performRender(visibleRows);	
	}

	// TODO: Reselect Row or at least just select SOME row!

	this.subscribeOnce("HtmlReady", this.handleAfterSort, this, [headerColumn]);
}

/**
 * Event handler that is fired after the data in the Grid is sorted. Fires the <code>AfterSort</code> event.
 * @param {nitobi.grid.Column} headerColumn The column that was sorted.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleAfterSort = function(headerColumn)
{
	var afterSortEventArgs = new nitobi.grid.OnAfterSortEventArgs(this, headerColumn);
	this.fire("AfterSort", afterSortEventArgs);
	nitobi.event.evaluate(headerColumn.getOnAfterSortEvent(), afterSortEventArgs);
}
/**
 * Handles double click events on cells. Fires the <code>CellDblClick</code> event
 * @param {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleDblClick = function(evt)
{
	// TODO: pass the cell that was clicked on ... 
	var cell = this.activeCellObject;
	var col = this.activeColumnObject;
	var dblClickEventArgs = new nitobi.grid.OnCellDblClickEventArgs(this, cell);
	return this.fire("CellDblClick", dblClickEventArgs) && nitobi.event.evaluate(col.getOnCellDblClickEvent(), dblClickEventArgs);
}
/**
 * Clears the data from the connected DataTable if the DataMode is not local.
 * This is used in server side data sources (LiveScrolling and Standard paging)
 * to cause a re-GET of the data from the server. 
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearData = function()
{
	if(this.getDataMode()!="local") 
	{
		this.datatable.flush();
	}
}
/**
 * Clears the sort CSS styling of the currently sorted column in the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearColumnHeaderSortOrder= function()
{
	// TODO: Moved to surface, do we need it here?
	if (this.sortColumn) {
		var headerColumn = this.sortColumn;//this.getColumnObject(this.sortColumn);
		var headerCell = headerColumn.getHeaderElement();
		var css = headerCell.className;
		css = css.replace(/ascending/gi,"").replace(/descending/gi,"");
		headerCell.className = css;
		this.sortColumn=null;
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeState= function() {
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.mapToHtml= function(oNode)
{
	// Put all DOM node reference mapping here (if possible)
	if (oNode==null) {
		oNode = this.UiContainer;
	}
	this.Scroller.mapToHtml(oNode);
	this.Scroller.surface.initializeBlock(this.getRowsPerPage());

	this.element = document.getElementById("grid"+this.uid);
	this.element.jsObject = this;
}

/**
 * Generates the component CSS based on the current state of the component. 
 * This can be important to do such that changes to layout properties 
 * (such as positioning and sizing) take effect.
 * <p>
 * <b>Example:</b>  Dynamically resize the Grid
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction resizeGrid(width, height)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.setWidth(width);
 * 	grid.setHeight(height);
 * 	grid.generateCss();
 * }
 * </code></pre>
 * </div>
 * @see #setWidth
 * @see #setHeight
 * @private
 */
nitobi.grid.TreeGrid.prototype.generateCss= function() 
{
	this.generateFrameCss();
//	this.generateColumnCss();
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.generateColumnCss= function() 
{
	this.generateCss(); // Remove this once the real generateColumnCss code has been written
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.generateFrameCss= function()
{
	// Simple caching of the Model XML so that we don't gen CSS too often
	var oldModel = nitobi.xml.serialize(this.model);
	if (this.oldModel == oldModel)
		return;
	this.oldModel = nitobi.xml.serialize(this.model)

	if (nitobi.browser.IE && document.compatMode == "CSS1Compat")
		this.frameCssXslProc.addParameter("IE", "true", "");
		
	if (nitobi.browser.MOZ || (nitobi.browser.IE && nitobi.lang.isStandards()))
		this.frameCssXslProc.addParameter("useBorders", "true", "");

	// Extended the HTMLStyleElement object to have the cssText property
	var newCss = nitobi.xml.transformToString(this.model, this.frameCssXslProc);

	if (!nitobi.browser.SAFARI && !nitobi.browser.CHROME && this.stylesheet == null)
		this.stylesheet = nitobi.html.Css.createStyleSheet();

	var ss = this.getScrollSurface(); // Viewport. (id= gridviewport*)
	var scrollTop = 0;
	var scrollLeft = 0;
	if (ss != null)
	{
		scrollTop = ss.scrollTop;
		scrollLeft = ss.scrollLeft;
	}

	if (this.oldFrameCss != newCss)
	{
		this.oldFrameCss = newCss;

		if (nitobi.browser.SAFARI||nitobi.browser.CHROME) 
		{
			this.generateFrameCssSafari();
		}
		else
		{
			// TODO: Figure out why it crashes here with multiple grids in IE 6
			try {
				this.stylesheet.cssText = newCss;
			} catch (e) {}

			if (ss != null)
			{
				if (nitobi.browser.MOZ)
				{
					// TODO: figure out what the problem is here...
					// When in Moz, the scrollbar moves to the top in live scrolling leaping ...
					// TODO: Tree Grid diff
					//this.scrollVerticalRelative(scrollTop);
					//this.scrollHorizontalRelative(scrollLeft);
				}
				ss.style.top = '0px';
				ss.style.left = '0px';
			}
		}
	}

	// TODO: refactor this code.
	// grabbed from grid 3.1 to make rowhover work ...
	// TODO: Probably won't work in Tree Grid...
	if (nitobi.grid.RowHoverColor == null)
	{
		var style = nitobi.html.getClass('ntb-row-hover');
		if (style!=null) {
			var bgColor = style.backgroundColor.toString();
			if (bgColor.indexOf("rgb")>-1) {
				bgColor=eval('nitobi.drawing.'+bgColor);
			}
			nitobi.grid.RowHoverColor = bgColor;
		}
	}

	if (nitobi.grid.CellHoverColor == null)
	{
		var style = nitobi.html.getClass('ntb-cell-hover');
		if (style!=null) {
			var bgColor = style.backgroundColor.toString();
			if (bgColor.indexOf("rgb")>-1) {
				bgColor=eval('nitobi.drawing.'+bgColor);
			}
			nitobi.grid.CellHoverColor = bgColor;
		}
	}
}

nitobi.grid.TreeGrid.prototype.generateFrameCssSafari = function() 
{
	// TODO: This needs to be one way in all browsers. I think we can do the normal XSLT way in Safari.
	var ss = document.styleSheets[0];

	var u = this.uid;
	var t = this.getTheme();
	var width = this.getWidth();
	var height = this.getHeight();
	var showvscroll = (this.isVScrollbarEnabled()?1:0);
	var showhscroll = (this.isHScrollbarEnabled()?1:0);
	var showtoolbar = (this.isToolbarEnabled()?1:0);

	var scrollerHeight = height-this.getscrollbarHeight()*showhscroll-this.getToolbarHeight()*showtoolbar;
	var scrollerWidth = width-this.getscrollbarWidth()*showvscroll;

	var midHeight = scrollerHeight-this.gettop();

	var addRule = nitobi.html.Css.addRule;
	var p = "ntb-grid-";

	if (this.rules == null)
	{
		this.rules = {};

		// Static private styles - only set them once and no need to store them for later.
		this.rules[".ntb-grid-datablock"] = addRule(ss, ".ntb-grid-datablock", "table-layout:fixed;width:100%;");
		this.rules[".ntb-grid-headerblock"] = addRule(ss, ".ntb-grid-headerblock", "table-layout:fixed;width:100%;");
		addRule(ss, ".ntbcellborder"+u, "overflow:hidden;text-decoration:none;margin:0px;border-right:1px solid #c0c0c0;border-bottom:1px solid #c0c0c0;white-space:nowrap;");
		addRule(ss, "."+p+"overlay"+u, "position:relative;z-index:1000;top:0px;left:0px;");
		addRule(ss, "."+p+"scroller"+u, "overflow:hidden;text-align:left;");
		addRule(ss, ".ntb-grid", "padding:0px;margin:0px;border:1px solid #cccccc;");
		addRule(ss, ".ntb-scroller", "padding:0px;spacing:0px;");
		addRule(ss, ".ntb-scrollcorner", "padding:0px;spacing:0px;");
		addRule(ss, ".ntb-input-border", "table-layout:fixed;overflow:hidden;position:absolute;z-index:2000;top:-2000px;left:-2000px;;");
		addRule(ss, ".ntb-column-resize-surface", "filter:alpha(opacity=1);background-color:white;position:absolute;visibility:hidden;top:0;left:0;width:100;height:100;z-index:800;");
		addRule(ss, ".ntb-column-indicator", "overflow:hidden;white-space: nowrap;");
	} 
	this.rules["#grid"+u] = addRule(ss, "#grid"+u, "overflow:hidden;text-align:left;-moz-user-select: none;-khtml-user-select: none;user-select: none;"+(nitobi.browser.IE?"position:relative;":""));
	this.rules["#grid"+u].style.height = height + "px";
	this.rules["#grid"+u].style.width = width + "px";
	//addRule(ss, ".hScrollbarRange"+u, "width:"+totalColumnsWidth+"px;");
	addRule(ss, ".vScrollbarRange"+u, "");
	addRule(ss, "."+t+" .ntb-cell", "overflow:hidden;white-space:nowrap;");
	addRule(ss, "."+t+" .ntb-cell-border", "overflow:hidden;white-space:nowrap;"+(nitobi.browser.IE?"height:auto;":"")+";");
	addRule(ss, ".ntb-grid-headershow"+u, "padding:0px;spacing:0px;"+(this.isColumnIndicatorsEnabled()?"display:none;":"")+"");
	addRule(ss, ".ntb-grid-vscrollshow"+u, "padding:0px;spacing:0px;"+(showvscroll?"":"display:none;")+"");
	addRule(ss, ".ntb-grid-hscrollshow"+u, "padding:0px;spacing:0px;"+(showhscroll?"":"display:none;")+"");
	addRule(ss, ".ntb-grid-toolbarshow"+u, ""+(showtoolbar?"":"display:none;")+"");
	addRule(ss, ".ntb-grid-height"+u, "height:"+height+"px;overflow:hidden;");
	addRule(ss, ".ntb-grid-width"+u, "width:"+width+"px;overflow:hidden;");
	addRule(ss, ".ntb-grid-overlay"+u, "position:relative;z-index:1000;top:0px;left:0px;");
	addRule(ss, ".ntb-grid-scroller"+u, "overflow:hidden;text-align:left;");
	//addRule(ss, ".ntb-grid-scrollerheight"+u, "height:"+(totalColumnsWidth > width?scrollerHeight:scrollerHeight + this.getscrollbarHeight())+"px;");
	addRule(ss, ".ntb-grid-scrollerwidth"+u, "width:"+scrollerWidth+"px;");
	addRule(ss, ".ntb-grid-topheight"+u, "height:"+this.gettop()+"px;overflow:hidden;"+(this.gettop()==0?"display:none;":"")+"");
	//addRule(ss, ".ntb-grid-midheight"+u, "overflow:hidden;height:"+(totalColumnsWidth > width?midHeight:midHeight+this.getscrollbarHeight())+"px;");
	addRule(ss, ".ntb-grid-leftwidth"+u, "width:"+this.getleft()+"px;overflow:hidden;text-align:left;");
	// TODO: centerwidth should target the root surface
	addRule(ss, ".ntb-grid-centerwidth"+u, "width:"+(width-this.getleft()-this.getscrollbarWidth()*showvscroll)+"px;");
	addRule(ss, ".ntb-grid-scrollbarheight"+u, "height:"+this.getscrollbarHeight()+"px;");
	addRule(ss, ".ntb-grid-scrollbarwidth"+u, "width:"+this.getscrollbarWidth()+"px;");
	addRule(ss, ".ntb-grid-toolbarheight"+u, "height:"+this.getToolbarHeight()+"px;");
	//addRule(ss, ".ntb-grid-surfacewidth"+u, "width:"+unfrozenColumnsWidth+"px;");
	addRule(ss, ".ntb-grid-surfaceheight"+u, "height:100px;");
	//addRule(ss, ".ntb-hscrollbar", (totalColumnsWidth > width?"display:block;":"display:none;"));
	addRule(ss, ".ntb-row"+u, "height:"+this.getRowHeight()+"px;margin:0px;line-height:"+this.getRowHeight()+"px;");
	addRule(ss, ".ntb-header-row"+u, "height:"+this.getHeaderHeight()+"px;");

	var colsets = this.model.selectNodes("//ntb:treegrid/ntb:columns");
	for (var i=0; i<colsets.length; i++)
	{
		var colset = colsets[i];
		var id = colset.getAttribute("id");
		var colwidth = 0;
		console.log("i = " + i);
		for (var j = 1, childs = colset.childNodes; j <= childs.length; j++)
		{
			var col = childs[j-1];
			var colW = col.getAttribute("Width");
			width += (colW && colW != ""?parseInt(colW):0);
			var colRule = this.rules[".ntb-column"+u+(id!=""?"_"+id:"")+"_" +(j)];
	 		if (colRule == null)
				colRule = this.rules[".ntb-column"+u+(id!=""?"_"+id:"")+"_" +(j)] = addRule(ss, ".ntb-column"+u+(id!=""?"_"+id:"")+"_" +(j));
			console.log(".ntb-column"+u+(id!=""?"_"+id:"")+"_" +(j));
			// Need to account for cell border?
			colRule.style.width = colW + "px";
			console.log("width: " + colRule.style.width);

	 		var colDataRule = this.rules[".ntb-column-data"+u+(id!=""?"_"+id:"")+"_" +(j)];
	 		if (colDataRule == null)
				this.rules[".ntb-column-data"+u+(id!=""?"_"+id:"")+"_" +(j)] = addRule(ss, ".ntb-column-data"+u+(id!=""?"_"+id:"")+"_" +(j), "text-align:"+col.getAttribute("Align")+";");
		}
		var depth = this.calculateColumnDepth(colset, 0);
		
		addRule(ss, ".ntb-hscrollbar", (colwidth > width?"display:block":"display:none"));
		addRule(ss, ".ntb-grid-midheight"+u+"-0", "overflow:hidden;height:" + (colwidth > width?midHeight:midHeight + this.getscrollbarHeight()) + "px;");
		if (id == this.getRootColumns())
			addRule(ss, ".ntb-grid-scrollerheight"+u, "height:" + (colwidth > width?scrollerHeight:scrollerHeight + this.getscrollbarHeight()) + "px;");
		addRule(ss, ".hScrollbarRange"+u, "width:" + colwidth + "px;");
	
		if (id == this.getRootColumns())
		{
			console.log(".ntb-grid-surfacewidth"+u+"-"+id);
			var rule = addRule(ss, ".ntb-grid-surfacewidth"+u+"-"+id, "width:" + this.getViewableWidth() + "px;");
			console.log("surfacewidth: " + rule.style.width);
		}
		else
		{
			addRule(ss, ".ntb-grid-surfacewidth"+u+"-"+id, "width:" + (this.getViewableWidth() - (depth * this.getGroupOffset()) - 1) + "px;");
		}
	}
}

nitobi.grid.TreeGrid.prototype.calculateColumnDepth = function(colset, curDepth){
	var id = colset.getAttribute("id");
	if (id == this.getRootColumns()) {
		return curDepth;
	}
	// SAFARI THINKS THAT IT IS @type RATHER THAN @Type
	var parentColset = this.model.selectSingleNode("//ntb:columns/ntb:column[@ChildColumnSet='" + id + "' and @type='EXPAND']/parent::ntb:columns");
	return this.calculateColumnDepth(parentColset, curDepth+1);
}

/**
 * This is used to clear the data from the component as well as other visual artifacts such as the selection boxes. This is primarily for use by component developers.
 */
nitobi.grid.TreeGrid.prototype.clearSurfaces= function() {
	// Clearing the surface is called from insert, delete, sort, refresh.
	this.selection.clearBoxes();
	this.Scroller.clearSurface();

	// Added this to ensure that the Scroller blank surface is the correct size.
	this.updateCellRanges();
}
/**
 * This is used to clear the headers from the component and is called prior to rendering the columns. This is primarily for use by component developers.
 * @private
 */
nitobi.grid.TreeGrid.prototype.clearHeader= function() {
	this.Scroller.clearSurface(false,true);
}

/**
 * Renders the Grid with no columns or data. Before the frame can be rendered the Grid must be attached to an 
 * HtmlElement through either the declaration or using the attachToParentDomElement() method. 
 * The frame must be rendered before any columns or data can be rendered.
 * @private
 */
nitobi.grid.TreeGrid.prototype.renderFrame= function()
{
	var browser = "IE";
	if (nitobi.browser.MOZ)
		browser = "MOZ";
	else if (nitobi.browser.SAFARI||nitobi.browser.CHROME)
		browser = "SAFARI";

	this.frameXslProc.addParameter("browser", browser, "");

	this.UiContainer.innerHTML = nitobi.xml.transformToString(this.model, this.frameXslProc);

	// Attach dom events like keydown, contextmenu, and selectstart
	// TODO: Tree Grid diff
	//this.attachDomEvents();

	//	this.showLoading();
	this.frameRendered = true;
	this.fire("AfterFrameRender");
}

/**
 * Renders the Grid's root surface (i.e. the html container that holds the viewports).
 * The Grid's frame must be rendered first {@see nitobi.grid.Grid.renderFrame}
 * and the Grid's scroller must already be instantiated.
 * @private
 */
nitobi.grid.TreeGrid.prototype.renderSurface = function()
{
	if (!this.Scroller)
	{
		throw "Can't render the surface without a Scroller";
	}
	var surfaceHtml = this.Scroller.surface.renderContainer(this.uid);
	// The ntb-grid-surface-container element is defined and created by frameXslProc
	$("ntb-grid-surface-container-" + this.uid).innerHTML = surfaceHtml;
}

/**
 * Renders any frozen top rows along with the column headers.
 * @private
 */
nitobi.grid.TreeGrid.prototype.renderHeader= function() {
	
	// Top Left Corner
	var startRow = 0;
	endRow = this.getfreezetop()-1;

	// Top Left
	var tl = this.Scroller.surface.view.topleft;
	// TODO: DONT NEED TO SET ELEMENT.INNERHTML = ""
	//tl.surface.element.innerHTML="";
	tl.top=this.getHeaderHeight();
	tl.left=0;
	//tl.rowRenderer=this.TopleftRenderer; // This only needs to be set on the constructor (or once during grid lifespan anyway)
	//tl.renderGap(startRow, endRow, false, '*');

	// Top Center
	var tc = this.Scroller.surface.view.topcenter;
	// TODO: DONT NEED TO SET ELEMENT.INNERHTML = ""
	//tc.surface.element.innerHTML="";
	tc.top=this.getHeaderHeight();
	tc.left=0;
	//tc.rowRenderer=this.TopCenterRenderer;
	// TODO: Need to update this when viewport is merged!
	tc.renderGap(startRow, endRow, false);
}

/**
 * Clears the cacheMap and requestCache of the middle left and middle center Viewports of the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.renderMiddle= function()
{
	//	The cacheMaps should be flushed here to be ready for rendering
	this.Scroller.view.midleft.flushCache();
	this.Scroller.view.midcenter.flushCache();
}

/**
 * Refreshes the data in the Grid. Any unsaved changes to data in the Grid can be 
 * lost by refreshing the data. The OnBeforeRefreshEvent and 
 * OnAfterRefreshEvent are both fired. Clears all the data that is stored 
 * by the Grid, and gets the current page of data from the server. Any 
 * changes made by the user will be deleted. Call save first if you don't 
 * want these changes to be lost.
 */
nitobi.grid.TreeGrid.prototype.refresh= function()
{
	var eventArgs = null;//new nitobi.grid.EventArgs(this);
	if (!this.fire('BeforeRefresh', eventArgs)) return;

	ntbAssert(this.datatable != null,'The Grid must be conntected to a DataTable to call refresh.','',EBA_THROW);

	var rows = (this.getPagingMode() == nitobi.grid.PAGINGMODE_STANDARD?this.getRowsPerPage():this.scroller.surface.rows)
	this.setRowCount(rows);
	this.scroller.surface.displayedRowCount = rows;
	this.scroller.surface.rows = rows;
	
	this.clear();
	this.syncWithData();

	this.subscribeOnce("HtmlReady", this.handleAfterRefresh, this);
}

/**
 * Event handler that is fired after a refresh of the data in the Grid is 
 * complete. Fires the <code>AfterRefresh</code> event
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleAfterRefresh = function()
{
	var eventArgs = null;//new nitobi.grid.EventArgs(this);
	this.fire("AfterRefresh", eventArgs);
}

/**
 * Clears all data and the surfaces.
 * @private
 */
nitobi.grid.TreeGrid.prototype.clear = function()
{
	this.selectedRows = [];
	this.clearData();
	this.scroller.purgeSurfaces();
	this.scroller.clearSurface();
	this.scroller.surface.cachedCells = {};
	this.clearSubHeaders();
	this.clearSurfaces();
}

/**
 * Event handler for the context menu event.
 * @param {Event} evt The Event object.
 * @param {HTMLElement} obj The HTML element that the context menu event 
 * occured on.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleContextMenu= function(evt, obj)
{
	var contextMenuFunc = this.getOnContextMenuEvent();
	if (contextMenuFunc == null) {
		return true;
	} else {
		if (this.fire("ContextMenu")) {
			return true;
		} else {
			evt.cancelBubble = true;
			evt.returnValue = false;
			return false;
		}
	}
}

/**
 * Event handler for the key press event.
 * @para {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleKeyPress = function(evt) {
	if (this.activeCell == null)
		return;

	// TODO: should be able to use activeCellObject.
	var col = this.activeColumnObject;

	this.fire("KeyPress", new nitobi.base.EventArgs(this, evt));
	nitobi.event.evaluate(col.getOnKeyPressEvent(), evt);

	nitobi.html.cancelEvent(evt);
	return false;
} 

/**
 * Event handler for the key up event.
 * @para {Event} evt The Event object.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleKeyUp = function(evt) {
	if (this.activeCell == null)
		return;

	// TODO: should be able to use activeCellObject.
	var col = this.activeColumnObject;

	this.fire("KeyUp", new nitobi.base.EventArgs(this, evt));
	nitobi.event.evaluate(col.getOnKeyUpEvent(), evt);
}

/**
 * Event handler for the key down event.
 * @param {Event} evt The Event object.
 * @param {HTMLElement} obj The HTML element that the context menu event 
 * occured on.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleKey = function(evt, obj)
{
	if (this.activeCell != null) {
		var col = this.activeColumnObject;
		var evtArgs = new nitobi.base.EventArgs(this, evt);
		if (!this.fire("KeyDown", evtArgs) || !nitobi.event.evaluate(col.getOnKeyDownEvent(), evtArgs)) return;
	}

	var k = evt.keyCode;
	//	TODO: errors can occur if we press keys while selecting ...

	// evt.metaKey tests if the apple key is selected
	k = k + (evt.shiftKey?256:0)+(evt.ctrlKey?512:0)+(evt.metaKey?1024:0);

	switch (k) {
		//just crtl pressed
		case 529:
			break;
		//end
		case 35:
			break;
		//home
		case 36:
			break;

		//ctrl+end
		case 547:
			break;
		//ctrl+home
		case 548:
			break;


		//	page down
		case 34:
			this.page(1);
			break;
		//	page up
		case 33:
			this.page(-1);
			break;

		//insert
		case 45:
			this.insertAfterCurrentRow();
			break;
		//delete
		case 46:
			if (this.getSelectedRows().length > 1) this.deleteSelectedRows();
			else this.deleteCurrentRow();
			break;

		//	select home
		case 292:
			this.selectHome();
			break;

		//	select page down
		case 290:
			this.pageSelect(1);
			break;
		//	select page up
		case 289:
			this.pageSelect(-1);
			break;


		//	select down 
		case 296: 
			this.reselect(0,1);
			break;
		//	select up
		case 294:
			this.reselect(0,-1);
			break;
		//	select left
		case 293:
			this.reselect(-1,0);
			break;
		// select right
		case 295:
			this.reselect(1,0);
			break;
		//select all
		case 577:
			break;

		//copy
		case 579:
		case 557:
			this.copy(evt);
			return true;
		// copy for mac
		case 1091:
			this.copy(evt);
			return true;
		//cut
		case 600:
		case 302:
			break;
		//paste
		case 598:
		case 301:
			this.paste(evt);
			return true;
			break;
		// paste for mac
		case 1110:
			this.paste(evt);
			return true;
		// **** FROM BLOCK NAV **** //
		//end
		case 35:
			break;
		//home
		case 36:
			break;

		//ctrl+end
		case 547:
			break;
		//ctrl+home
		case 548:
			break;

		//down 
		case 13: 
			// If the currently active cell is an expander column, we should expand/collapse
			if (this.activeCell && this.activeCell.getAttribute("ebatype") == "expander")
			{
				this.toggleSurface(this.activeCell);
				break;
			}
			var et = this.getEnterTab().toLowerCase();
			var horiz = 0;
			var vert = 1;
			if (et == "left")
			{
				horiz = -1;
				vert = 0;
			}
			else if (et == "right")
			{
				horiz = 1;
				vert = 0;
			}
			else if (et == "down")
			{
				horiz = 0;
				vert = 1;
			}
			else if (et == "up")
			{
				horiz = 0;
				vert = -1;
			}
			this.move(horiz, vert);
			break;
		case 40: 
			this.move(0,1);
			break;
		//up
		case 269:
		case 38:
			this.move(0,-1);
			break;
		//left
		case 265:
		case 37: 
			this.move(-1,0);
			break;
		//right
		case 9:
		case 39:
			this.move(1,0);
			break;
		//select all
		case 577:
			break;
		// save
		case 595:
			this.save();
			break;
		// refresh
		case 594:
			this.refresh();
			break;
		// new row
		case 590:
			this.insertAfterCurrentRow();
			break;
		default:
			this.edit(evt);

	}
}

/**
 * Re-sizes the selection box by the relative values in the x and y arguments. This method is generally used for shift+down type of behaviour.
 * @param {Number} x Relative x offset to increase the selection box size by.
 * @param {Number} y Relative y offset to increase the selection box size by.
 * @private
 */
nitobi.grid.TreeGrid.prototype.reselect= function(x,y)
{
	var C = nitobi.grid.Cell;
	var S = this.selection;
	var row = C.getRowNumber(S.endCell) + y;
	var column = C.getColumnNumber(S.endCell) + x
	var surfacePath = C.getSurfacePath(S.startCell);
	var surface = this.scroller.getSurface(surfacePath);
	var columnCount = surface.columnsNode.childNodes.length;
	
	var endSurfacePath = C.getSurfacePath(S.endCell);
	var endSurfaceRow = C.getRowNumber(S.endCell);
	var endSurface = this.scroller.getSurface(endSurfacePath + "_" + endSurfaceRow);
	if (column >= 0 && column < this.columnCount() && row >= 0)
	{
		var newEndCell = this.getCellElement(row, column, surfacePath);
		var newEndSurface = this.scroller.getSurface(surfacePath + "_" + row);
		if (!newEndCell || (endSurface && endSurface.isVisible && y > 0) || (newEndSurface && newEndSurface.isVisible && y < 0)) 
			return;
		S.changeEndCellWithDomNode(newEndCell);
		S.alignBoxes();
		this.ensureCellInView(newEndCell);
	}
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.pageSelect= function(dir)
{
	// TODO: This is only for live scrolling grid ... refactor pls. it is called from handlekey
}

/**
 * Selects from the current active cell up to the first row.
 */
nitobi.grid.TreeGrid.prototype.selectHome= function()
{
	var S = this.selection;
	var row = nitobi.grid.Cell.getRowNumber(S.endCell);
	this.reselect(0, -row);
}

/**
 * Causes the currently activated cell to go into edit mode. OnBeforeCellEditEvent is fired.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code>
 * &#102;unction editCell(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.setPosition(row, col);
 * 	grid.edit();
 * }
 * </code></pre>
 * </div>
 * @param {Event} e The Event object when the edit is caused by a user gesture.
 * @see Event
 * @see #OnBeforeCellEditEvent
 * @see #setPosition
 */
nitobi.grid.TreeGrid.prototype.edit= function(evt)
{
	if (this.activeCell == null)
		return;

	// TODO: should be able to use activeCellObject.
	var cell = this.activeCellObject;
	var col = this.activeColumnObject;
	if (this.activeCell && this.activeCell.getAttribute("ebatype") == "expander")
	{
		return;
	}

	var beforeEditEventArgs = new nitobi.grid.OnBeforeCellEditEventArgs(this, cell);
	if (!this.fire("BeforeCellEdit", beforeEditEventArgs) || !nitobi.event.evaluate(col.getOnBeforeCellEditEvent(), beforeEditEventArgs)) return;

	var keyVal = null;
	var shift = null;
	var ctrl = null;
	if (evt) {
		keyVal = evt.keyCode || null;
		shift = evt.shiftKey || null;
		ctrl = evt.ctrlKey || null;
	}

	var initialChar = "";
	var keyCodeOffset = null;

	// TODO: Generalize this so people can easily hook into keycodes...  
	//[A - Z] shift or [0-9] no shift
	if ((shift && (keyVal > 64) && (keyVal < 91)) || (!shift && ((keyVal > 47) && (keyVal < 58))))
		keyCodeOffset = 0;

	if (!shift) {
		// [A-Z] no shift
		if ((keyVal > 64) && (keyVal < 91) )
			keyCodeOffset = 32;
		else if (keyVal > 95 && keyVal < 106)
			keyCodeOffset = -48;
		else if ((keyVal == 189) || (keyVal == 109))
			initialChar = "-";
		else if ((keyVal > 186) && (keyVal < 188))
			keyCodeOffset = -126;
	}
	else {// TODO: currently we dont support any special characters ... 
	}

	if (keyCodeOffset != null)
		initialChar = String.fromCharCode(keyVal + keyCodeOffset);

	if( (!ctrl) && 
		/*what does it matter if there is an initialChar? */
		("" != initialChar) || 
		(keyVal == 113)|| // F2
		(keyVal == 0)|| // double click (IE)
		(keyVal == null) || // double click (Moz) - this should really be 0, but something funny's hapening with Moz
		(keyVal == 32)// space
		)
	{
		if (col.isEditable()) {
			this.cellEditor = nitobi.form.ControlFactory.instance.getEditor(this, col);
			if (this.cellEditor == null) return;
			this.cellEditor.setEditCompleteHandler(this.editComplete);
			this.cellEditor.attachToParent(this.getToolsContainer());
			this.cellEditor.bind(this, cell, initialChar);
			this.cellEditor.mimic();
			this.setEditMode(true);
			// This is to prevent double characters from showing up in IE
			nitobi.html.cancelEvent(evt);
			return false;
		}
	} else {
		// do not set active cell for other keys such as tab
		return;	
	}
}

/**
 * Fires after the user has completed editing a cell by pressing enter or ESC. Before the data is updated OnCellValidateEvent is fired which can cause
 * the edit to be discarded if the handler returns false.
 * @private
 * @param {nitobi.components.grid.EditCompleteEventArgs} editCompleteEventArgs
 * @see #OnCellValidateEvent
 */
nitobi.grid.TreeGrid.prototype.editComplete= function(editCompleteEventArgs) {
	//	update the value in the grid
	//	update the value in the datasource 
	var cell=editCompleteEventArgs.cell;
	var column = cell.getColumnObject();
	var newValue = editCompleteEventArgs.databaseValue;
	var newDisplay = editCompleteEventArgs.displayValue;

	var validateEventArgs = new nitobi.grid.OnCellValidateEventArgs(this, cell, newValue, cell.getValue());

	// CellValidate can be on a column and a grid level ...
	if (!this.fire("CellValidate", validateEventArgs) || !nitobi.event.evaluate(column.getOnCellValidateEvent(), validateEventArgs))
	//!cell.getColumnObject().fire("CellValidate", validateEventArgs))
		return false;

	cell.setValue(newValue, newDisplay);

//	cell.DomNode.style.backgroundColor='#FFFF00';
//	this.subscribe('AfterSave', function() {nitobi.effects.blueFade(cell.DomNode, 0)});

	//TODO: we need to define some converters such that metadata properties can be
	//changed based on conditions ... such as if val < 0 bgcolor = red
	//similarly if val.substr(0,1) == "=" make it a formula editor for next time or the other way around
	editCompleteEventArgs.editor.hide();
	this.setEditMode(false);

	// TODO: This will not be fired if the validate does not return true - is this correct???
	var afterEditEventArgs = new nitobi.grid.OnAfterCellEditEventArgs(this, cell);
	this.fire("AfterCellEdit", afterEditEventArgs);
	nitobi.event.evaluate(column.getOnAfterCellEditEvent(), afterEditEventArgs);

	// TODO: Remove this and fix editing tab key press stuff
	try {
		this.focus();
	} 
	catch (e) {
	}
}
/**
 * This is a macro function for anywhere that autosave is used. Insert, delete and edit all should use this.
 * @private
 */
nitobi.grid.TreeGrid.prototype.autoSave = function()
{
	if (this.isAutoSaveEnabled())
	{
		return this.save();
	}
	return false;
}

/**
 * Activates the cell at the supplied row / column coordinates.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction editCell(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.selectCellByCoords(row, col);
 * 	grid.edit();
 * }
 * </code></pre>
 * </div>
 * @param {Number} row The row number of the cell to activate.
 * @param {Number} column The column number of the cell to activate.
 */
nitobi.grid.TreeGrid.prototype.selectCellByCoords= function(row, column, surfacePath) 
{
	surfacePath = surfacePath || 0;
	this.setPosition(row,column, surfacePath);
}

/**
 * Activates the cell at the row / column coordinates. This method is used 
 * by {@link #selectCellByCoords}.
 * @param {Number} row The row number of the cell to activate.
 * @param {Number} column The column number of the cell to activate.
 */
nitobi.grid.TreeGrid.prototype.setPosition= function(row,column,surfacePath)
{
	surfacePath = surfacePath || 0;
	if (row >= 0 && column >= 0)
	{
		this.setActiveCell(this.getCellElement(row, column, surfacePath));
	}
}

/**
 * Sends a save request to the server with any data from the Grid that 
 * has been changed.  If there are no changes to the local data there 
 * will be no data sent to the server.  The <code>OnBeforeSaveEvent</code> 
 * is fired prior to the data being sent to the server and the 
 * <code>OnAfterSaveEvent</code> is fired after the save has completed.
 * <p>
 * Calling this method is the same as clicking the save button in the
 * Grid's toolbar.
 * </p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction customSave(param1, value1)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var datatable = grid.getDataSource();
 * 	datatable.setSaveHandlerParameter(param1, value1);
 * 	grid.save();
 * }
 * </code></pre>
 * </div>
 * @see nitobi.data.DataTable#setSaveHandlerParameter
 * @see #getDataSource
 */
nitobi.grid.TreeGrid.prototype.save = function()
{
	// Debated on whether to put his in the table.save. Decided that save 
	// really must mean SAVE, and that this save will only save if required. JG
	//if (this.datatable.log.selectNodes("//"+nitobi.xml.nsPrefix+"data/*").length == 0)
		//return;

	// the updategram is retained but save operation is postponed.
	// This will means the client and server are now split brain

	// TODO: It is best if a get from the server is done to ensure the
	// client grid is up to date
	if(!this.fire("BeforeSave"))
		return;

// TODO: reimplement showloading.
//	this.showLoading();

	// TODO: Need to save for all dirty datatables on all surfaces...
	this.scroller.surface.save();
	//this.datatable.save(nitobi.lang.close(this, this.saveCompleteHandler), this.getOnBeforeSaveEvent());
}

/**
 * Called when the save request to the server is completed.
 * The <code>OnAfterSaveEvent</code> is fired here.
 * @param {nitobi.data.OnSaveCompleteEventArgs} eventArgs
 * @private
 */
nitobi.grid.TreeGrid.prototype.saveCompleteHandler= function(eventArgs)
{
	if (this.getDataSource().getHandlerError())
	{
		this.fire("HandlerError", eventArgs);
	}
	this.fire("AfterSave", eventArgs);
}

/**
 * Sets the focus of the web page to the component. OnFocusEvent is fired.
 * @see nitobi.grid.Grid#OnFocusEvent
 */
nitobi.grid.TreeGrid.prototype.focus= function()
{
	//	This refocuses the grid after an edit takes place
	try {
		//nitobi.html.getFirstChild(this.UiContainer).focus();
		// TODO: need to handle focus and bluring better so that grid.onfocus does not get fired so often
		this.keyNav.focus();
		this.fire('Focus', new nitobi.base.EventArgs(this));
		// Not sure why but this borks Safari
		if (!nitobi.browser.SAFARI && !nitobi.browser.CHROME)
		{
			nitobi.html.cancelEvent(nitobi.html.Event);
			return false;
		}
	} catch (e)
	{
		// Only wrapping this in a try-catch because of the firefox bug for focus()
		// https://bugzilla.mozilla.org/show_bug.cgi?id=236791
		// (Wrapping it seems to do nothing)
	}
}

/**
 * Blurs the Grid removing any selection or row highlights.
 * @see nitobi.grid.Grid#OnBlurEvent
 */
nitobi.grid.TreeGrid.prototype.blur=function()
{
	//	This clears the grid selection and row highlights

	// TODO: call something like blurActiveRow as well so that the row blur events are called 
	// and that should also clear the active rows

	// Clear the row highlights
	this.clearActiveRows();
	// Clear the selection
	this.selection.clear();
	// Blur the active cell
	this.blurActiveCell(null);
	// Set the activeCell to null
	this.activateCell(null);

	this.fire('Blur', new nitobi.base.EventArgs(this));
}

/**
 * @deprecated
 * @private
 */
nitobi.grid.TreeGrid.prototype.getRendererForColumn= function(col) {
	var columnCount = this.getColumnCount();
	if (col >= columnCount)
		col = columnCount - 1;
	var frozeneft = this.getFrozenLeftColumnCount();
	if (col < frozenLeft)
		return this.MidLeftRenderer;
	else
		return this.MidCenterRenderer;
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.getColumnOuterTemplate= function(col) {
	return this.getRendererForColumn(col).xmlTemplate.selectSingleNode("//*[@match='ntb:e']/div/div["+col+"]");
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.getColumnInnerTemplate= function(col) {
	return this.getColumnOuterXslTemplate(col).selectSingleNode("*[2]");
}

/**
 * Pre-generates the XSL templates for rendering data in the Grid. This is required when changes to the data structure in the 
 * DataTable are made and is called from the bind() method if required.
 * @private
 */
nitobi.grid.TreeGrid.prototype.makeXSL= function() {

	// TODO: Do we need this?  Isn't called from anywhere
	//	makeXSL impacts the number of columns that are generated for the rowXsl ...

	var fL = this.getFrozenLeftColumnCount();
	var cs = this.getColumnCount();
	var rh = this.isRowHighlightEnabled();

	var dataTableId = '_default';
	if (this.datatable!=null)
	{
		dataTableId = this.datatable.id;
	}

	// TODO: tighten this up.

	// Top Left Corner
	var startColumn = 0;
	var columns = fL;

	// Take anything that is in the column definitions and encode the & character and double encode any
	// not sure what those # signs are for but probably something in nitobi.xml.parseHtml
//	var sXml = nitobi.xml.serialize(this.model.selectSingleNode('state/nitobi.grid.Columns')).replace(/\#\&lt\;\#/g,"#<#").replace(/\#\&gt\;\#/g,"#>#").replace(/\#\&eq\;\#/g,"#=#").replace(/\#\&quot\;\#/g,"#\"#").replace(/\&/g,"&amp;").replace(/\#<\#/g,"&lt;").replace(/\#>\#/g,"&gt;").replace(/\#=\#/g,"&eq;").replace(/\#\"\#/g,"&quot;");

	// Need to make sure that we don't accidentally have double escaped XSLT statemtents ...
//	sXml = sXml.replace(/(\&amp;lt;xsl\:)(.*?)(\/&amp;gt;)/g, function() {return "&lt;xsl:"+arguments[2].replace(/\&amp;/g, "&")+"/&gt;";});

//	if (this.oldColDefs != sXml)
//	{
//		this.oldColDefs = sXml;

		var colDefs = this.model.selectSingleNode('state/nitobi.grid.Columns');
		this.scroller.surface.view.topleft.rowRenderer.generateXslTemplate(colDefs, null, startColumn, columns, this.isColumnIndicatorsEnabled(), this.isRowIndicatorsEnabled(),rh);
		this.scroller.surface.view.topleft.rowRenderer.dataTableId = dataTableId;

		// Top Center
		startColumn = fL;
		columns = cs-fL;
		this.scroller.surface.view.topcenter.rowRenderer.generateXslTemplate(colDefs, null, startColumn,columns, this.isColumnIndicatorsEnabled(),this.isRowIndicatorsEnabled(),rh);
		this.scroller.surface.view.topcenter.rowRenderer.dataTableId = dataTableId;

		// Left
		this.scroller.surface.view.midleft.rowRenderer.generateXslTemplate(colDefs, null, 0, fL, 0, this.isRowIndicatorsEnabled(),rh, "left");
		this.scroller.surface.view.midleft.rowRenderer.dataTableId = dataTableId;

		// Center
		this.scroller.surface.view.midcenter.rowRenderer.generateXslTemplate(colDefs, null, fL, cs-fL,0,0,rh);
		this.scroller.surface.view.midcenter.rowRenderer.dataTableId = dataTableId;
//	}

	this.fire("AfterMakeXsl");
}

/**
 * Renders the data in the Grid. This differs from <code>refresh()</code> 
 * in that refresh will re-retrieve the data from the server as well as 
 * re-render the data.
 */
nitobi.grid.TreeGrid.prototype.render = function()
{
	// This will clear the surfaces and remove any selections ... this might have to be done
	this.generateCss();
	this.updateCellRanges();
}

/**
 * @ignore
 */
nitobi.grid.TreeGrid.prototype.refilter = nitobi.grid.TreeGrid.prototype.render; 

/**
 * Returns an XmlElementList containing the definitions of the columns in the Grid. The column definitions are the XML serialization of the nitobi.components.grid.Column objects.
 * @private
 * @type XMLNodeList
 */
nitobi.grid.TreeGrid.prototype.getColumnDefinitions= function()
{
	var columnsElement = this.getRootColumnsElement();
	if (columnsElement)
		return columnsElement.childNodes;
	//return this.model.selectNodes("//ntb:columns/*");
	//return this.scroller.surface.colunsNode.selectNodes("//ntb:column").length;
	//return this.model.selectNodes("state/nitobi.grid.Columns/*");
}

/**
 * Returns an XmlElementList containing the definitions of the columns in the Grid that are visible. The column definitions are the XML serialization of the nitobi.components.grid.Column objects.
 * @private
 * @type XMLNodeList
 */
nitobi.grid.TreeGrid.prototype.getVisibleColumnDefinitions= function()
{
	return this.model.selectNodes("state/nitobi.grid.Columns/*[@Visible='1']");
}

/**
 * Initializes the Model from the values in the API XML.
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeModelFromDeclaration = function()
{
	// Iterate over the attributes on the declaration and call each attributes setter
	var attributes = this.Declaration.grid.documentElement.attributes;
	var len = attributes.length;
	for (var i=0; i<len; i++) {
		var attribute = attributes[i];
		var property = this.properties[attribute.nodeName];
		if (property != null)
			this["set"+property.n](attribute.nodeValue);
	}

	// TODO: these are being re-set cause they are overwritten from the delcaration to model copy ...
	this.model.documentElement.setAttribute("ID",this.uid);
	this.model.documentElement.setAttribute("uniqueID",this.uid);
}

/**
 * Initializes the model (i.e. the declaration) from the default values in modelXml
 * @private
 */
nitobi.grid.TreeGrid.prototype.initializeModelDefaults = function()
{
	/**
	 * We use this.defaultModel in the code generated by declarationFromModelXslProc
	 * @private
	 */
	/*this.defaultModel = nitobi.xml.createXmlDoc(nitobi.xml.serialize(nitobi.grid.modelDoc));
	var gridModel = this.defaultModel.selectSingleNode("//nitobi.grid.Grid");
	this.declarationFromModelXslProc = nitobi.xml.createXslProcessor(nitobi.grid.declarationFromModelXslProc.stylesheet);
	eval(nitobi.xml.transformToString(this.Interface, this.declarationFromModelXslProc));
	
	this.defaultColumnDef = this.defaultModel.selectSingleNode("//Defaults/ntb:textcolumn");*/
	//this.defaultModel = nitobi.xml.createXmlDoc(this.defaultDeclarationModel);
	var attributes = this.Declaration.grid.documentElement.attributes;
	var len = attributes.length;
	for (var i=0; i<len; i++) {
		var attribute = attributes[i];
		var property = this.properties[attribute.nodeName];
		if (property != null)
			this["set"+property.n](attribute.nodeValue);
	}
};

/**
 * Sets the default values for a column declaration in the model.
 * @private
 */
nitobi.grid.TreeGrid.prototype.setModelValues = function(xModelNode, xDeclarationNode)
{
	// For the declaration node iterate over the attributes and try to find corresponding 
	// attributes in the xColumnProps hash for the column, the specific column type, and the editor.
	var columnDataType = xModelNode.getAttribute("DataType");
	var columnEditorType = xModelNode.getAttribute("type").toLowerCase();
	
	// First do the column and specific column type
	var columnProperties = xDeclarationNode.attributes;
	for (var j=0; j < columnProperties.length; j++)
	{
		var property = columnProperties[j];
		var propertyName = property.nodeName.toLowerCase();
		// Match the declaration attribute name on the JS hash of lowercase attribute names to property metadata.
		var propertyMeta = this.xColumnProperties[columnDataType+"column"][propertyName] || this.xColumnProperties["column"][propertyName];
		var value = property.nodeValue;
		if (propertyMeta.t == "b")
			value = nitobi.lang.boolToStr(nitobi.lang.toBool(value));
		xModelNode.setAttribute(propertyMeta.n, value);
	}

	// Now do the editor
	var editorNode = xDeclarationNode.selectSingleNode("./ntb:"+columnEditorType+"editor");
	if (editorNode == null)
		return;
	var editorProperties = editorNode.attributes;
	for (var j=0; j < editorProperties.length; j++)
	{
		var property = editorProperties[j];
		var propertyName = property.nodeName.toLowerCase();
		// Match the declaration attribute name on the JS hash of lowercase attribute names to property metadata.
		var propertyMeta = this.xColumnProperties[columnEditorType+"editor"][propertyName];
		var value = property.nodeValue;
		if (propertyMeta.t == "b")
			value = nitobi.lang.boolToStr(nitobi.lang.toBool(value));
		xModelNode.setAttribute(propertyMeta.n, value);
	}

}

/**
 * Creates a new Key for a record in the Grid. This is the default Key generation.
 * @private
 * @type String
 */
nitobi.grid.TreeGrid.prototype.getNewRecordKey= function()
{
	var today;
	var key;
	var xNode;
	// Keep trying to select a key until one is unique.
	do
	{
		today = new Date();
		key = (today.getTime() + "." + Math.round(Math.random()*99));
		//TODO: This should be fixed ...
		xNode = this.datatable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@xk = \''+key+'\']');
	} while (xNode != null);
	return key;
}

/**
 * Inserts a blank row into the Grid after the row to which the active cell belongs.
 */
nitobi.grid.TreeGrid.prototype.insertAfterCurrentRow= function()
{
	if (this.activeCell)
	{
		var rowNumber = nitobi.grid.Cell.getRowNumber(this.activeCell);
		this.insertRow(rowNumber+1, nitobi.grid.Cell.getSurfacePath(this.activeCell));
	}
	else
	{
		this.insertRow();
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
 * @param {Number} rowIndex A row will be inserted after the row at this index
 */
nitobi.grid.TreeGrid.prototype.insertRow= function(rowIndex, surfacePath) 
{
	var surface = this.Scroller.getSurface(surfacePath);
	var rows = parseInt(surface.rows);
	var xi = 0;
	if (rowIndex != null)
	{
		xi = parseInt((rowIndex==null ? rows : parseInt(rowIndex)));
		xi--;
	}

	var eventArgs = new nitobi.grid.OnBeforeRowInsertEventArgs(this,this.getRowObject(xi));
	if(!this.isRowInsertEnabled() || !this.fire("BeforeRowInsert", eventArgs))
	{
		return;
	}
	
	surface.insertRow(xi);

	//QUESTION: When a row is added what happens if the grid is sorted??? the item should be inserted at the cursor and that is it.
	//TODO: refilter should not be called ... we need to do this ajax styles

	this.subscribeOnce("HtmlReady", this.handleAfterRowInsert, this, [xi]);
}

/**
 * Event handler that is fired when after a row is inserted into the Grid and (if autosave is enabled) the data is saved to the server. 
 * Fires the <code>AfterRowInsert</code> event
 * @param {Number} xi The index of the inserted row.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleAfterRowInsert = function(xi)
{
	this.fire("AfterRowInsert", new nitobi.grid.OnAfterRowInsertEventArgs(this, this.getRowObject(xi)));
	this.setActiveCell(this.getCellElement(xi, 0));
}
/**
 * Deletes the row to which the currently active cell belongs.
 * @see #deleteRow
 */
nitobi.grid.TreeGrid.prototype.deleteCurrentRow= function()
{
	if (this.activeCell)
	{
		this.deleteRow(nitobi.grid.Cell.getRowNumber(this.activeCell), nitobi.grid.Cell.getSurfacePath(this.activeCell));
	}
	else
	{
		alert("First select a record to delete.");
	}
}
/**
 * Deletes the row containing the cell referenced by the activeCell property.
 * <P>When rows are deleted from the grid, the corresponding XML record 
 * node is also deleted from the bound DataTable.</P><P>An XML updategram is 
 * created by the DataTable when a row is deleted. This updategram is sent to the 
 * server when the save() method is called to instruct the server to delete the 
 * corresponding record from the database.</P><P>Rows may also be deleted by pressing 
 * the Delete key or by clicking on the toolbar Delete icon.</P>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * var grid = nitobi.getComponent('grid1');
 * grid.deleteRow(3);	// deletes the 4th row
 * </code></pre>
 * </div>
 * @param {Number} index Index of the row to delete, indexed from 0.
 * @see #deleteAfterCurrentRow
 * @see #OnBeforeDeleteEvent
 * @see #OnAfterDeleteEvent
 */
nitobi.grid.TreeGrid.prototype.deleteRow= function(index, surfacePath)
{
	// do something for when onbeforedelete is not defined
	//HACK fix this somehow
	ntbAssert(index>=0,"Must specify a row to delete.");

	var eventArgs = new nitobi.grid.OnBeforeRowDeleteEventArgs(this,this.getRowObject(index));
	if (!this.isRowDeleteEnabled() || !this.fire("BeforeRowDelete",eventArgs)) 
	{
		return;
	}
	var surface = this.Scroller.getSurface(surfacePath || "0");
	
	//this.clearSurfaces();
	this.Selection.clearBoxes();
	//this.Scroller.clearSurface(null, null, null, null, surfacePath);
	
	var rows = this.getDisplayedRowCount();

	// deleteRecord can throw an exception, which stops grid being repopulated (after this.clearSurfaces())
	// now exception is caught, and grid display is restored
	try { 
		surface.deleteRow(index);
		// TODO: should this be set here since it will be updated by the RowCountChanged event from the DataTable.
		// Should we be calling setRowCount???
		rows--;
		if (rows <= 0)
			this.activeCell = null;
	//	this.setDisplayedRowCount(rows);

		//this.subscribeOnce("HtmlReady", this.handleAfterRowDelete, this, [index, surface.key]);
	} catch (err) {
		this.dataBind();
	}
}

/**
 * Event handler that is fired when after a row is deleted from the Grid and (if autosave is enabled) the data is deleted on the server.
 * Fires the <code>AfterRowDelete</code> event
 * @param {Number} xi The index of the deleted row.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleAfterRowDelete = function(xi, surfacePath)
{
	
	surfacePath = surfacePath || "0";
	this.fire("AfterRowDelete", new nitobi.grid.OnBeforeRowDeleteEventArgs(this,this.getRowObject(xi)));
	this.setActiveCell(this.getCellElement(xi, 0, surfacePath));
}

/**
 * @private
 */
nitobi.grid.TreeGrid.prototype.page= function(dir)
{
}

/**
 * Moves the active cell by the relative amounts specified by the 
 * horizontal and vertical arguments.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.setPosition(0,0);
 * grid.move(1,3);  // Now the cell at row 1 and column 3 is selected
 * </code></pre>
 * </div>
 * @param {Number} h The number of cells to move the active cell by in the horizontal direction.
 * @param {Number} v The number of cells to move the active cell by in the vertical direction.
 */
nitobi.grid.TreeGrid.prototype.move = function(h,v)
{
	if (this.activeCell != null) {
		// Get reference to cellObject
		// Going Right or Down .... (Easy)
		var hs=1;
		var vs=1;

		h=(h*hs);
		v=(v*vs);

		// Get the activeCell object
		// add the h and v to the coords.
		// select the new cell.
		var surfacePath = nitobi.grid.Cell.getSurfacePath(this.activeCell);
		var cell = nitobi.grid.Cell
		var colNumber = cell.getColumnNumber(this.activeCell);
		var rowNumber = cell.getRowNumber(this.activeCell);
		
		var targetCol = colNumber + h;
		var targetRow = rowNumber + v;
		var targetSurface = surfacePath;
		// Select the new activeCell
		// Need to check here if rowNumber will put us inside a subgroup...
		if (v > 0)
		{
			var surface = this.scroller.getSurface(surfacePath);
			if (surface && rowNumber == surface.rows - 1)
			{
				// Moving down out of a subgroup
				parentSurface = surface.parent;
				targetRow = surface.rowIndex + v;
				var max = parentSurface.columnsNode.childNodes.length - 1;
				if (targetCol > max)
					targetCol = max;
				targetSurface = parentSurface.key;
			}
			else
			{
				// Moving down into a subgroup
				var subSurface = this.scroller.getSurface(surfacePath + "_" + rowNumber);
				if (subSurface && subSurface.isVisible)
				{
					targetRow = 0;
					var max = subSurface.columnsNode.childNodes.length - 1;
					if (targetCol > max)
						targetCol = max;
					targetSurface = subSurface.key;
				}
			}
		}
		else if (v < 0)
		{
			var surface = this.scroller.getSurface(surfacePath);
			if (surface && rowNumber == 0)
			{
				// Moving up out of a subgroup
				var parentSurface = surface.parent;
				if (parentSurface)
				{
					targetRow = surface.rowIndex;
					var max = parentSurface.columnsNode.childNodes.length - 1;
					if (targetCol > max)
						targetCol = max;
					targetSurface = parentSurface.key;
				}
			}
			else
			{
				// Moving up into a subgroup
				var subSurface = this.scroller.getSurface(surfacePath + "_" + (rowNumber + v));
				if (subSurface && subSurface.isVisible)
				{
					targetRow = subSurface.rows - 1;
					var max = subSurface.columnsNode.childNodes.length - 1;
					if (targetCol > max)
						targetCol = max;
					targetSurface = subSurface.key;
				}
			}
		}
		this.selectCellByCoords(targetRow, targetCol, targetSurface);
		
		// Check if we have hit the start or end of the row.
		var evtArgs = new nitobi.grid.CellEventArgs(this, this.activeCell);
		if (colNumber + 1 == this.getVisibleColumnDefinitions().length && h == 1) {
			this.fire("HitRowEnd", evtArgs);
		} else if (colNumber == 0 && h == -1) {
			this.fire("HitRowStart", evtArgs);
		}
	}
}

/**
 * @private
 * Called from the selection mouseup event handler. This gets fired when the user clicks on a grid cell and
 * the selection is moved under the mouse before the mouseup event fires - which occurs on the selection.
 */
nitobi.grid.TreeGrid.prototype.handleSelectionMouseUp = function(evt)
{
	// If the mouseup was fired during a grid cell click event then ensure the cell is in view
	if (this.isCellClicked())
		this.ensureCellInView(this.activeCell);
	this.setCellClicked(false);

	// If we are in single click mode
	if (this.isSingleClickEditEnabled())
		this.edit(evt);
	else if (!nitobi.browser.IE) // Safari needs this focus otherwise the selection gets the focus (and even then not really)
		this.focus();
}

/**
 * Loads the next page of data.  Only available if the Grid is in standard
 * paging mode.
 */
nitobi.grid.TreeGrid.prototype.loadNextDataPage= function()
{
	// TODO: refactor this into the proper grid class
	//	TODO: scroll back to the top of the grid if we are in standard paging mode
	this.loadDataPage(this.getCurrentPageIndex()+1);
}

/**
 * Loads the previous page of data.  Only available if the Grid is in standard
 * paging mode.
 */
nitobi.grid.TreeGrid.prototype.loadPreviousDataPage= function()
{
	this.loadDataPage(this.getCurrentPageIndex()-1);
}

/**
 * @deprecated
 * @private
 */
nitobi.grid.TreeGrid.prototype.GetPage= function(functionReplacedByLowercasegetPage)
{
	ebaErrorReport("GetPage is deprecated please use loadDataPage instead","",EBA_DEBUG);
	this.loadDataPage(functionReplacedByLowercasegetPage);
}

/**
 * Loads the specified page of data from the server and displays it. 
 * Since the server request is asynchronous, this call will return 
 * immediately.  Additionally, if the page already exists in the cache, 
 * no server request will occur. To determine when the page has loaded see 
 * setOnAfterPagingEvent. 
 * <p><b>N.B.</b>:  This function is only used in the standard paging mode.</p>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction fivePagesForward()
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.loadDataPage(grid.getCurrentPageIndex() + 5);
 * }
 * </code></pre>
 * </div>
 * @param {Number} pageNumber The index of the data page to load.  (Zero indexed)
 */
nitobi.grid.TreeGrid.prototype.loadDataPage= function(newPageNumber) {}

/**
 * Returns the index of the currently selected row or the row to which the active cell currently belongs.
 * @param {Boolean} rel Specifies whether to compensate for frozen columns.
 * @type Number
 */
nitobi.grid.TreeGrid.prototype.getSelectedRow= function(rel) {
	try {
		var nRow=-1;
		var AC = this.activeCell;
		if (AC != null) {
			nRow = nitobi.grid.Cell.getRowNumber(AC);

			if (rel) {
				nRow -= this.getfreezetop();
			}
		}
		return nRow;
	} catch (err) 
	{
		_ntbAssert(false,err.message);
	}
}


/**
 * Fires the <code>HandlerError</code> event
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHandlerError = function()
{
	var error = this.getDataSource().getHandlerError();
	if (error)
	{
		this.fire("HandlerError");
	}
}

/**
 * Returns a row object from one of the panes given its Id number.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction getCellViaRow(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var rowObj = grid.getRow(row);
 * 	return rowObj.getCell(col);
 * }
 * </code></pre>
 * </div>
 * @param {Number} rowIdNum The row index.
 * @param {Number} paneNumber
 * @returns {nitobi.grid.Row}
 */
nitobi.grid.TreeGrid.prototype.getRowObject= function(paneNumber, rowIdNum)
{
	var rowIndex = rowIdNum;
	if (rowIdNum == null && paneNumber != null)
	{
		rowIndex = paneNumber;
	}
	return new nitobi.grid.Row(this, rowIndex);
}

/**
 * Returns the column index of the Column to which the active cell belongs.
 * <P>Columns are numbered from left to right starting at 0. If the first n columns are frozen (locked so that they remain visible when 
 * the user scrolls left and right), the rel parameter can be set to true to obtain the absolute column index. Otherwise the getColumn method returns the column 
 * index for column within the set of unfrozen columns.</P>
 * @param {Boolean} rel Specifies whether to compensate for frozen columns.
 * @returns {Number} Column index of the active cell.
 */
nitobi.grid.TreeGrid.prototype.getSelectedColumn= function(rel) {
	try {
		var nCol=-1;
		var AC = this.activeCell;
		if (AC != null) {
			nCol = parseInt(AC.getAttribute('col'));

			if (rel) {
				nCol -= this.getFrozenLeftColumnCount();
			}
		}
		return nCol;
	} catch (err) 
	{
		_ntbAssert(false,err.message);
	}
}

/**
 * Returns the Column name as defined in fieldMap
 * @type {String}
 */
nitobi.grid.TreeGrid.prototype.getSelectedColumnName = function() {
    var field = this.getSelectedColumnObject();
    return field.getColumnName();
}


/**
 * Returns the Column object for the column that contains the currently selected cell.
 * @type nitobi.grid.Column
 */
nitobi.grid.TreeGrid.prototype.getSelectedColumnObject= function() {
	var ac = this.activeCell;
	return this.getColumnObject(this.getSelectedColumn(), (ac?ac.getAttribute("path"):"0"));
}

/**
 * Returns the number of columns in the Grid.
 * @type {Number}
 */
nitobi.grid.TreeGrid.prototype.columnCount= function() 
{
	try {
		var dataItems = this.getColumnDefinitions();
		return dataItems.length;
	} catch (err) 
	{
		_ntbAssert(false,err.message);
	}
}

/**
 * Gets the cell object at the specified coordinates.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction setCellValue(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var cellObj = grid.getCellObject(row, col);
 * 	cellObj.setValue("This Year's Model");
 * }
 * </code></pre>
 * </div>
 * @param {Number} row The index of the Row to which the Cell belongs.
 * @param {Number|String} col The Column to which the Cell belongs. This value can be either the column index or the column name.
 * @type nitobi.grid.Cell
 * @see nitobi.grid.Cell#setValue
 */
nitobi.grid.TreeGrid.prototype.getCellObject= function(row,col, surfacePath) 
{
	surfacePath = surfacePath || "0"
	var surface = this.scroller.getSurface(surfacePath);
	if(surface)
		return surface.getCellObject(row, col);
	else
		return null;
}

/**
 * Provides a shortcut to getting the <i>displayed</i> value of a Cell at the 
 * specified coordinates. Generally the cell content can also be obtained 
 * from the XML document bound to the grid, but the values may vary. 
 * For example, if a grid uses a Listbox editor for a particular cell, 
 * the XML will contain the key value where getCellText will return the 
 * actual text value displayed in the cell. One can also access the value 
 * of a Cell through the Cell object itself.
 * <p>
 * <b>Example</b>:  The difference between getCellText and {@link #getCellValue}
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * var datatable = grid.getDataSource();
 * // Get the xml node that represents the first row (xi is row index)
 * var node = datatable.getDataXmlDoc().selectSingleNode("//ntb:e[&#64;xi=0]");
 * // Set the value of the first column
 * node.setAttribute("a", "New value");
 * if (grid.getCellText(0,0) != grid.getCellValue(0,0))
 * {
 * 	alert('They are not equal.  getCellValue gets the value from the xml while getCellText gets it from the rendered cell');
 * }
 * </code></pre>
 * </div>
 * @param {Number} row The index of the Row to which the Cell belongs.
 * @param {Number} col The index of the Column to which the Cell belongs.
 * @type String
 * @see #getCellObject
 */
nitobi.grid.TreeGrid.prototype.getCellText = function(row,col,surfacePath)
{
	var cell = this.getCellObject(row,col,surfacePath);
	if (cell)
		return cell.getHtml();
	else
		return null;
}
/**
 * Provides a shortcut to geting the value of a Cell at the specified 
 * coordinates.
 * <p>
 * <b>Example</b>:  The difference between getCellValue and {@link #getCellText}
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * var datatable = grid.getDataSource();
 * // Get the xml node that represents the first row (xi is row index)
 * var node = datatable.getDataXmlDoc().selectSingleNode("//ntb:e[&#64;xi=0]");
 * // Set the value of the first column
 * node.setAttribute("a", "New value");
 * if (grid.getCellText(0,0) != grid.getCellValue(0,0))
 * {
 * 	alert('They are not equal.  getCellValue gets the value from the xml while getCellText gets it from the rendered cell');
 * }
 * </code></pre>
 * </div>
 * @param {Number} row The index of the Row to which the Cell belongs.
 * @param {Number} col The index of the Column to which the Cell belongs.
 * @see #getCellObject
 */
nitobi.grid.TreeGrid.prototype.getCellValue = function(row,col,surfacePath)
{
	var cell = this.getCellObject(row, col, surfacePath);
	if (cell)
		return cell.getValue();
	else
		return null;
}	

/**
 * <P>Returns the HTMLElement of the cell in the Grid at the specified 
 * coordinates. The cell is represented in HTML as a &lt;DIV&gt; 
 * with xi, col, colAttr, and value attributes containing the cell row 
 * number, the cell column number, the column XML attribute name, and 
 * the raw cell value. The innerHTML property of the cell element will 
 * contain the displayed value for the cell.</P>
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction scrollToCell(row, col)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var cellElement = grid.getCellElement(row, col);
 * 	grid.ensureCellInView(cellElement);
 * }
 * </code></pre>
 * </div>
 * @param {Number} row The Row coordinate of the cell.
 * @param {Number} column The Column coordinate of the cell.
 * @type HTMLElement
 * @see #ensureCellInView
 */
nitobi.grid.TreeGrid.prototype.getCellElement= function(row, column, surfacePath)
{
	surfacePath = surfacePath || "0";
	// TODO: this should use the getCellElement static method on the cell class
	return document.getElementById("cell_"+row+"_"+column + "_" + this.uid + "_" + surfacePath);
}

/**
 * Returns the Row object of the currently selected row or the row to which the active cell currently belongs.
 * @param {Number} xi The index of the Row to retrieve.
 * @type nitobi.grid.Row
 */
nitobi.grid.TreeGrid.prototype.getSelectedRowObject= function(xi) 
{
	var obj = null;
	var r = nitobi.grid.Cell.getRowNumber(this.activeCell);
	obj = new nitobi.grid.Row(this, r);
	return obj;
}

/**
 * Gets the Column object for the column at the index specified. The type of Column object return could be a DateColumn, TextColumn, or NumberColumn
 * depending on the column type.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction sortColumnAsc(index)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	var colObj = grid.getColumnObject(index);
 * 	if (colObj.isSortEnabled())
 * 	{
 * 		grid.sort(index, "Asc");
 * 	}
 * }
 * </code></pre>
 * </div>
 * @param {Number} index The zero based index of the Column to return the object of.
 * @type nitobi.grid.Column
 */
nitobi.grid.TreeGrid.prototype.getColumnObject= function(index, surfacePath) 
{
	ntbAssert(index >= 0,"Invalid column accessed.");
	surfacePath = surfacePath || "0";
	var surface = this.Scroller.getSurface(surfacePath);
	if (surface)
		return surface.getColumnObject(index);
	else
		return null;
}
/**
 * Gets the Cell object that represents the currently selected cell in the Grid.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.setPosition(0,3);
 * var cellObj1 = grid.getSelectedCellObject();
 * var cellObj2 = grid.getCellObject(0,3);
 * if (cellObj1.getDomNode() === cellObj2.getDomNode())
 * {
 * 	alert('They are the same!');
 * }
 * </code></pre>
 * </div>
 * @type nitobi.grid.Cell
 */
nitobi.grid.TreeGrid.prototype.getSelectedCellObject= function() {
	var obj = this.activeCellObject;
	if (obj == null)
	{
		// Failover to use the activeCell - this can likely be removed
		obj = this.activeCell; //this.Scroller.activeView.activeCell;
		if (obj != null)		
		{
			var Cell = nitobi.grid.Cell;
			var r = Cell.getRowNumber(obj)
			var surfacePath = nitobi.grid.Cell.getSurfacePath(obj);
			var c = Cell.getColumnNumber(obj)
			obj = this.getCellObject(r, c, surfacePath);
		}
	}	
	return obj;
}

/**
 * @private
 * Automatically adds a new row to the end of the Grid if the autoAdd is true, the current cell isn't empty.
 * This method is similar to the insertRow method.
 */
nitobi.grid.TreeGrid.prototype.autoAddRow= function()
{
	if (this.activeCell.innerText.replace(/\s/g,"") != "" && this.autoAdd ) {
		this.deactivateCell();
		if (this.active == "Y") 
			this.freezeCell();
		eval(this.getOnRowBlurEvent());
		this.insertRow();
		this.go("HOME");

		// TODO: There is no edit cell...
		this.editCell();
	}
}

/**
 * Sets the number of rows displayed in the Grid.
 * @param {Number} newVal The number of rows currently displayed in the Grid.
 * @private
 */
nitobi.grid.TreeGrid.prototype.setDisplayedRowCount= function(newVal) 
{
	ntbAssert(!isNaN(newVal),"displayed row was set to nan");
	if (this.Scroller)
	{
		this.Scroller.surface.view.midcenter.rows = newVal;
		this.Scroller.surface.view.midleft.rows	= newVal;
	}
	this.displayedRowCount = newVal;
}

/**
 * Returns the number of currently rows displayed in the Grid.
 * @type Number
 */
nitobi.grid.TreeGrid.prototype.getDisplayedRowCount = function()
{
	ntbAssert(!isNaN(this.displayedRowCount),"displayed row count return nan");
	return this.displayedRowCount;
}

nitobi.grid.TreeGrid.prototype.getToolsContainer = function() 
{
	this.toolsContainer = this.toolsContainer || document.getElementById("ntb-grid-toolscontainer"+this.uid);
	return this.toolsContainer;
}

nitobi.grid.TreeGrid.prototype.getHeaderContainer = function()
{
	return document.getElementById("ntb-grid-header"+this.uid+"_" + this.scroller.surface.key);
}

nitobi.grid.TreeGrid.prototype.getSubHeaderContainer = function()
{
	return document.getElementById("ntb-grid-subheader-container" + this.uid);
}

nitobi.grid.TreeGrid.prototype.getDataContainer = function()
{
	return document.getElementById("ntb-grid-data"+this.uid);
}

nitobi.grid.TreeGrid.prototype.getScrollerContainer = function()
{
	return document.getElementById("ntb-grid-scroller"+this.uid)
}

nitobi.grid.TreeGrid.prototype.getGridContainer = function()
{
	return nitobi.html.getFirstChild(this.UiContainer);
}

/**
 * Copies the currently selected block of cells in the Grid. Copied data will be located in the native operating system clipboard and
 * formatted as an HTML table. This data can be pasted into many common desktop applications such as Microsoft Excel or into other Grid components.
 * OnBeforeCopyEvent and OnAfterCopyEvent are fired.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="javascript">
 * &#102;unction copyBlock(startRow, startColumn, endRow, endColumn)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.getSelection().selectWithCoords(startRow, startColumn, endRow, endColumn);
 * 	grid.copy();
 * }
 * </code></pre>
 * </div>
 * @see #paste
 * @see #OnBeforeCopyEvent
 * @see #OnAfterCopyEvent
 */
nitobi.grid.TreeGrid.prototype.copy = function()
{
	var coords = this.selection.getCoords();
	var surfacePath = nitobi.grid.Cell.getSurfacePath(this.activeCell);
	
	var data = this.getTableForSelection(coords, surfacePath);
	
	var copyEventArgs = new nitobi.grid.OnCopyEventArgs(this, data, coords);
	if(!this.isCopyEnabled() || !this.fire("BeforeCopy", copyEventArgs)) return;

	// Removed the conditional for using the windows clipboard in IE so we
	// always just go through the same path.

	// Place the HTML table formatted data into the invisible textarea
	if(!nitobi.browser.IE)
	{
		// create text area

		var copyClipBoard = this.getClipboard();
		// TODO: see if this causes a memory leak.If so then make sure the references are cleaned up
		copyClipBoard.onkeyup		= nitobi.lang.close(this, this.focus);
		copyClipBoard.value 			= data;
		// Create a selection range on the innerText of the invisible textarea
		copyClipBoard.focus();
		copyClipBoard.setSelectionRange(0,copyClipBoard.value.length);
	} else {
		window.clipboardData.setData("Text",data);
	}

	this.fire("AfterCopy", copyEventArgs);
}

/**
 * Returns the data from the Grid as an HTML table.
 * @param {Map} coords The coordinates of the data to retrieve. Eg. {"top":{"y":5},"bottom":{"y":10}} will select all the data from rows 5 to 10.
 * @type String
 */
nitobi.grid.TreeGrid.prototype.getTableForSelection = function(coords, surfacePath)
{
	var columns = this.getColumnMap(coords.top.x,coords.bottom.x, surfacePath);
	surfacePath = surfacePath || "0";
	var surface = this.Scroller.getSurface(surfacePath);
	var result = nitobi.data.FormatConverter.convertEbaXmlToTsv(surface.dataTable.xmlDoc,columns,coords.top.y,coords.bottom.y);
	return result;
}

/**
 * Returns an array containing the attribute names used by column definitions in the grid.
 * @private
 * @type Array
 */
nitobi.grid.TreeGrid.prototype.getColumnMap = function(firstColumn, lastColumn, surfacePath)
{
	var surface = this.Scroller.getSurface(surfacePath || "0");
	var columns = surface.columnsNode.childNodes;
	//var columns = this.getColumnDefinitions();
	firstColumn = (firstColumn == null)?0:firstColumn;
	lastColumn = (lastColumn == null)?columns.length-1:lastColumn;
	var map = new Array();
	for (var i = firstColumn; i <= lastColumn && (null != columns[i]); i++) {
		map.push(columns[i].getAttribute("xdatafld").substr(1));
	}
	return map;
}

/**
 * Attempts to paste the data that is currently in the native operating 
 * systems "clipboard" into the Grid. The data must be in tab seperated 
 * format to properly be pasted into the Grid. OnBeforePasteEvent and 
 * OnAfterPasteEvent are fired.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction copyBlockTo(startRow, startColumn, endRow, endColumn, destRow)
 * {
 * 	var grid = nitobi.getComponent('grid1');
 * 	grid.getSelection().selectWithCoords(startRow, startColumn, endRow, endColumn);
 * 	grid.copy();
 * 	grid.setPosition(destRow, 0);
 * 	grid.paste();
 * }
 * </code></pre>
 * </div>
 */
nitobi.grid.TreeGrid.prototype.paste = function()
{
	// Preconditions: Paste data is on the clipboard and in TSV or HTML TABLE format
	if(!this.isPasteEnabled()) return;

	// create text area
	var pasteClipBoard = this.getClipboard();
	// Create a selection range on the innerText of the invisible textarea
	pasteClipBoard.onkeyup = nitobi.lang.close(this, this.pasteDataReady, [pasteClipBoard]);
	pasteClipBoard.focus();

	return pasteClipBoard;
}

/**
 * Handles the onkeyup event in the "clipboard" and attempts to merge the pasted data into the DataTable to which the Grid is connected. 
 * If the pasted crosses over rows that are not in the DataTable then the DataTable needs to retrieve that data from the server before it can be
 * merged. The retrieval of the data is asynchronous and once complete the pasteComplete() method is called.
 * @param {Object} pasteClipBoard  The paste clibboard is actually an HTML textarea element.
 * @private
 */
nitobi.grid.TreeGrid.prototype.pasteDataReady = function(pasteClipBoard)
{
	pasteClipBoard.onkeyup = null;

	var selection = this.selection;

	// get RowIndex for the TargetTopLeftCell
	var coords = selection.getCoords();
	var startColumn = coords.top.x;
	var endColumn = startColumn + nitobi.data.FormatConverter.getDataColumns(pasteClipBoard.value)-1;

	var editable = true;
	var surfacePath = nitobi.grid.Cell.getSurfacePath(this.activeCell);
	
	for (var i = startColumn; i <= endColumn; i++)
	{
		var columnObject = this.getColumnObject(i, surfacePath);
		if (columnObject)
		{
			if (!columnObject.isEditable())
			{
				editable = false;
				break;
			}
		}
	}

	if (!editable)
	{
		// TODO: what is the approach to these sorts of alerts???
		// TODO: put a default class on read only columns ntb-grid-columnreadonly
		this.fire("PasteFailed", new nitobi.base.EventArgs(this));
		this.handleAfterPaste();
		return;
	}
	else
	{
		//	get the list of mapped columns for the given columns
		var columnList = this.getColumnMap(startColumn, endColumn, surfacePath);

		//	get the pasting row coordinates
		var startRow = coords.top.y;
		var endRow = Math.max(startRow + nitobi.data.FormatConverter.getDataRows(pasteClipBoard.value)-1, 0);

		this.getSelection().selectWithCoords(startRow,startColumn,endRow,startColumn+columnList.length-1, surfacePath);

		var pasteEventArgs = new nitobi.grid.OnPasteEventArgs(this, pasteClipBoard.value, coords);
		if (!this.fire("BeforePaste", pasteEventArgs)) return;

		var clipboardValue = pasteClipBoard.value;
		var preMergedEbaXml = null;
		if (clipboardValue.substr(0,1)=="<") {
			// Reasoning: if < is the first character then this is likely an HTML table
			preMergedEbaXml = nitobi.data.FormatConverter.convertHtmlTableToEbaXml(clipboardValue, columnList, startRow);
		} else {
			// otherwise its a tab-separated value list
			preMergedEbaXml = nitobi.data.FormatConverter.convertTsvToEbaXml(clipboardValue, columnList, startRow);
		}

		if (preMergedEbaXml.documentElement != null) {
			var surface = this.Scroller.getSurface(surfacePath);
			surface.dataTable.mergeFromXml(preMergedEbaXml, nitobi.lang.close(this, this.pasteComplete, [preMergedEbaXml, startRow, endRow, pasteEventArgs, surface]));
		}
	}
}

/**
 * Completes the paste operation after the asynchronous get on the grid data.
 * @private
 */
nitobi.grid.TreeGrid.prototype.pasteComplete = function(preMergedEbaXml,startRow,endRow, pasteEventArgs, surface)
{
	surface.reRender(startRow, endRow);
	this.subscribeOnce("HtmlReady", this.handleAfterPaste, this, [pasteEventArgs]);
}

/**
 * Event handler that fires after data has been pasted into the Grid. 
 * Fires the <code>AfterPaste</code> event
 * @param {nitobi.grid.OnPasteEventArgs} eventArgs The paste operation event 
 * arguments.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleAfterPaste = function(eventArgs)
{
	this.fire("AfterPaste", eventArgs);
}

/**
 * Creates a hidden textarea if it does not already exist. This hidden textarea is used as our "clipboard" by capturing keypress events and then 
 * assigning focus to the clipboard before the actual keydown event fires causing the clipboard information to be either pasted or copied.
 * @private
 * @type Clipboard 
 */
nitobi.grid.TreeGrid.prototype.getClipboard = function()
{
	var clipboard = document.getElementById("ntb-clipboard"+this.uid);
	clipboard.onkeyup = null;
	clipboard.value = '';
	return clipboard;
}

/**
 * Fires the <code>HtmlReady</code> event.
 * @private
 */
nitobi.grid.TreeGrid.prototype.handleHtmlReady = function(evtArgs)
{
	this.fire("HtmlReady", new nitobi.base.EventArgs(this));
}

nitobi.grid.TreeGrid.prototype.toggleSurface = function(cell)
{
	var C = nitobi.grid.Cell;
	var Css = nitobi.html.Css;
	var targetKey = C.getSurfacePath(cell);
	var targetRow = C.getRowNumber(cell);
	var surfacePath = targetKey + "_" + targetRow;
	var surface = this.scroller.getSurface(surfacePath);
	if (surface != null)
	{
		if (surface.isVisible)
		{
			this.toggleExpanderIcon(cell, false);
			if (surface.isCellInSurface(this.activeCell))
				this.selectCellByCoords(targetRow, 1, surface.parent.key);	
			surface.onSetVisible.subscribeOnce(this.handleToggleSurface, this);
			surface.collapse();
		}
		else
		{
			this.toggleExpanderIcon(cell, true);
			if (this.activeCell && C.getRowNumber(this.activeCell) > C.getRowNumber(cell))
			{
				this.selection.clear();
				this.selectCellByCoords(targetRow, 1, surface.parent.key);	
			}
			surface.onSetVisible.subscribeOnce(this.handleToggleSurface, this);
			surface.expand();
		}
	}
	else
	{
		this.toggleExpanderIcon(cell, true);
		this.clearHover();
		if (this.activeCell && C.getRowNumber(this.activeCell) > C.getRowNumber(cell))
		{
			this.selection.clear();
			this.selectCellByCoords(targetRow, 1, C.getSurfacePath(this.activeCell));	
		}
		this.expand(targetRow, targetKey);
	}
	this.focus();
}

nitobi.grid.TreeGrid.prototype.toggleExpanderIcon = function(cell, expand)
{
	var has = nitobi.html.Css.hasClass;
	var swap = nitobi.html.Css.swapClass;
	var c = "ntb-column-collapsed";
	var x = "ntb-column-expanded"
	var chover = c + "-hover";
	var xhover = x + "-hover";
	if (expand)
	{
		if (has(cell, chover))
			swap(cell, chover, xhover);
		if (has(cell, c))
			swap(cell, c, x);
	}
	else
	{
		if (has(cell, xhover))
			swap(cell, xhover, chover);
		if (has(cell, x))
			swap(cell, x, c);
	}
}

nitobi.grid.TreeGrid.prototype.handleToggleSurface = function(eventArgs)
{
	var surface = eventArgs.source;
	// Update Grid's row count;
	var rows = surface.recalculateRowCount();
	if (eventArgs.visible)
	{
		this.setRowCount(this.rowCount + rows);
		surface.parent.onAfterExpand.notify();
	}
	else
	{
		this.setRowCount(this.rowCount - rows);
		surface.parent.onAfterCollapse.notify();
	}
}

nitobi.grid.TreeGrid.prototype.expand = function(rowIndex, surfacePath)
{
	var surface = this.Scroller.getSurface(surfacePath);
	surface.onBeforeExpand.notify();
	this.loadingScreen.show();
	var topBlock;
	if (rowIndex == this.datatable.totalRowCount - 1)
	{
		topBlock = surface.view.midcenter.getBlocks(rowIndex, rowIndex)[0];
	}
	else
	{
		topBlock = surface.splitBlock(rowIndex).top;
	}
	var subSurface = new nitobi.grid.Surface(this.scroller, this, surfacePath + "_" + rowIndex, rowIndex);
	
	subSurface.columnSetId = this.findChildColumnSet(surface.columnSetId);
	subSurface.columnsNode = this.model.selectSingleNode("//ntb:columns[@id='" + subSurface.columnSetId + "']");
	
	subSurface.parent = surface;
	surface.surfaces[rowIndex] = subSurface;
	this.scroller.surfaceMap[subSurface.key] = subSurface;
	
	var subSurfaceHtml = subSurface.renderContainer(this.uid, true);
	topBlock.innerHTML += subSurfaceHtml;
	subSurface.mapToHtml(this.uid);
	// Because we change the dom, the reference to the activeCell is not valid so we need
	// to manually reset it
	if (this.activeCell)
	{
		var id = this.activeCell.id;
		this.activeCell = $(id);
	}
	
	// TODO: This should be refactored.
	var he = this.headerEvents;
	he.push({type:'mousedown', handler:this.handleHeaderMouseDown});
	he.push({type:'mouseup', handler:this.handleHeaderMouseUp});
	he.push({type:'mousemove', handler:this.handleHeaderMouseMove});
	nitobi.html.attachEvents($("ntb-grid-header" + this.uid + "_" + subSurface.key), he, this);
	
	var columnsElement = subSurface.columnsNode;
	var getHandler = columnsElement.getAttribute("gethandler");
	var saveHandler = columnsElement.getAttribute("savehandler");
	
	subSurface.parentDataNode = surface.dataTable.getRecord(rowIndex);
	
	var dataTable = new nitobi.data.DataTable("caching", this.getPagingMode() == nitobi.grid.PAGINGMODE_LIVESCROLLING,{GridId:this.getID()},{GridId:this.getID()},this.isAutoKeyEnabled());
	dataTable.initialize(surfacePath + "_" + rowIndex, getHandler, saveHandler);
	this.data.add(dataTable);
	subSurface.createRenderers(this.data);
	subSurface.connectToTable(dataTable);
	
	var sourceRowNode = surface.dataTable.getRecord(rowIndex);
	var fieldNames = surface.dataTable.xmlDoc.selectSingleNode("//@FieldNames").nodeValue.split("|");
	for (var i = 0; i < fieldNames.length; i++)
	{
		var fieldName = fieldNames[i];
		var fieldIndex = surface.dataTable.fieldMap[fieldName].substr(1);
		var value = sourceRowNode.getAttribute(fieldIndex);
		dataTable.setGetHandlerParameter(fieldName, value);
	}
	dataTable.getPage(0, 21, this, this.getGroupComplete);
}

nitobi.grid.TreeGrid.prototype.collapse = function(rowIndex, surfacePath)
{
	var surface = this.scroller.getSurface(surfacePath + "_" + rowIndex);
	if (surface)
	{
		surface.collapse();
	}
}

nitobi.grid.TreeGrid.prototype.getGroupComplete = function()
{
	this.loadingScreen.hide();
}

/**
 * Returns the root columns declared on the Grid.
 * @type Element
 */
nitobi.grid.TreeGrid.prototype.getRootColumnsElement = function()
{
	var rootColumnsId = this.getRootColumns();
	if (rootColumnsId)
	{
		return this.model.selectSingleNode("//ntb:columns[@id='" + rootColumnsId + "']");
	}
	else
	{
		return this.model.selectSingleNode("//ntb:columns");
	}
}

nitobi.grid.TreeGrid.prototype.findChildColumnSet = function(columnSet)
{
	var expandElement = this.model.selectSingleNode("//ntb:columns[@id='" + columnSet + "']/ntb:column[@type='EXPAND']");
	if (expandElement)
	{
		return expandElement.getAttribute("ChildColumnSet");
	}
}

/**
 * Only used in standard paging mode.  When we page forward/back, we need to manually
 * remove any pinned subheaders (as opposed to them being removed due to scrolling).
 */
nitobi.grid.TreeGrid.prototype.clearSubHeaders = function()
{
	var container = this.getSubHeaderContainer();
	container.innerHTML = "";
}

// TODO: Remove the subscribe and fire methods to IObservable which the grid implements.
/**
 * Manually fires the particular event.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.fire("CellClick"); // Note we supply "CellClick" for the OnCellClickEvent
 * </code></pre>
 * </div>
 * @param {String} evt The identifier for the evnt such as "HtmlReady".
 * @param {Object} args Any arguments to pass to the event handlers.
 */
nitobi.grid.TreeGrid.prototype.fire=function(evt,args){
	return nitobi.event.notify(evt+this.uid,args);
}

/**
 * Subscribes a function to a Grid event.
 * <p>
 * <b>Example</b>
 * </p>
 * <div class="code">
 * <pre><code class="">
 * var grid = nitobi.getComponent('grid1');
 * grid.subscribe("DataReady", myFunction);
 * </code></pre>
 * </div>
 * <p>
 * Notice that the event we are subscribing to does not specify the "On" 
 * or "Event" parts of the name.
 * </p>
 * @param {String} evt A event string identifier or key for the given 
 * event. This value is the event name without the "On" and "Event" parts 
 * of the name, for example, the key for the OnDataReadyEvent is becomes 
 * "DataReady".
 * @param {Function} func A reference to the Function object that should 
 * be called when the event is fired.
 * @param {Object} context A reference to the Object that the Function 
 * should be called in the context of. When writing object oriented 
 * JavaScript the reference to the Function must also have some context 
 * in which it is to be executed.
 * @see nitobi.grid.Grid#subscribeOnce
 * @see nitobi.grid.Grid#unsubscribe
 */
nitobi.grid.TreeGrid.prototype.subscribe=function(evt,func,context){
	if (this.subscribedEvents == null)
		this.subscribedEvents = {};
	if (typeof(context)=="undefined") context=this;
	var guid = nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
	this.subscribedEvents[guid] = evt+this.uid;
	return guid;
}

/**
 * Subscribe to an event only once.  That is, the handler is only fired 
 * once and then automatically unregistered.
 * <p>
 * <b>Example</b>:  Load the grid and subscribe to the OnHtmlReadyEvent
 * </p>
 * <div class="code">
 * <pre><code class="">
 * &#102;unction loadGrid()
 * {
 * 	var grid = nitobi.loadComponent('grid1');
 * 	grid.subscribeOnce("HtmlReady", handleHtmlEvent, null, new Array(grid));
 * }
 * 
 * &#102;unction handleHtmlEvent(gridObj)
 * {
 * 	gridObj.selectCellByCoords(0,0);
 * 	gridObj.edit();
 * }
 * </code></pre>
 * </div>
 * @param {String} evt A event string identifier or key for the given event. This value is the event name without the "On" and "Event" parts of the name, for example, the key for the OnDataReadyEvent is becomes "DataReady".
 * @param {Function} func A reference to the Function object that should be called when the event is fired.
 * @param {Object} context A reference to the Object that the Function should be called in the context of. When writing object oriented JavaScript the reference to the Function must also have some context in which it is to be executed.
 * @param {Array} params Any parameters that should be passed to the handler function.
 * @see #subscribe
 */
nitobi.grid.TreeGrid.prototype.subscribeOnce = function(evt, func, context, params)
{
	var guid = null;
	var _this = this;
	var func1 = function()
	{
		func.apply(context || this, params || arguments);
		_this.unsubscribe(evt, guid);
	}
	guid = this.subscribe(evt,func1);
}

/**
 * Unsubscribes an event from Grid.
 * @param {String} evt The event name without the "On" prefix and "Event" suffix.
 * @param {Number} guid The unique ID of the event as returned by the subscribe method. 
 * If the event is defined through the declaration the unique ID can be accessed through the grid API such as grid.OnHtmlReadyEvent.
 */
nitobi.grid.TreeGrid.prototype.unsubscribe=function(evt,guid)
{
	return nitobi.event.unsubscribe(evt+this.uid, guid);
}

/**
 * Fired when the page is unloaded. The Grid is repsonsible for disposing of all its child objects such that 
 * there is no memory leak in Internet Explorer from circular DOM / JS references.
 * @private
 */
nitobi.grid.TreeGrid.prototype.dispose = function()
{
	try {
		//	Remove the DOM node to JS object circular reference.
		this.element.jsObject = null;

		//	global xml documents
		editorXslProc = null;

		// Detach the DOM events
		 var H = nitobi.html;
		H.detachEvents(this.getGridContainer(), this.events);
		H.detachEvents(this.getHeaderContainer(), this.headerEvents);
		H.detachEvents(this.getDataContainer(), this.cellEvents);
		H.detachEvents(this.getScrollerContainer(), this.scrollerEvents);
		H.detachEvents(this.keyNav, this.keyEvents);

		for (var item in this.subscribedEvents) {
			var evtName = this.subscribedEvents[item];
			this.unsubscribe(evtName.substring(0,evtName.length-this.uid.length), item);
		}

		this.UiContainer.parentNode.removeChild(this.UiContainer);

		for (var item in this)
		{
			if (this[item] != null)
			{
				if (this[item].dispose instanceof Function)
				{
					this[item].dispose();
				}
				this[item] = null;
			}
		}

		//	Dispose of all the editors that were possibly created
		//	Use the global nitobi.form.ControlFactory.instance class
		nitobi.form.ControlFactory.instance.dispose();
	} catch(e) {

	}
}

// backwards compatibility.
/**
 * @private
 */
nitobi.Grid = nitobi.grid.Grid;
