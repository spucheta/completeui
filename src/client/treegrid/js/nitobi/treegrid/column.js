/**
 * Creates a new Column object.
 * @class 
 * @constructor
 * @param {nitobi.grid.Grid} grid The grid object this column belongs to
 * @param {Number} index The index of the column (zero based)
 */
nitobi.grid.Column = function(grid, index, surface)
{
	/**
	 * @private
	 */
	this.grid = grid;

	/**
	 * @private
	 */
	this.column = index;
	/**
	 * @private
	 */
	this.uid = nitobi.base.getUid();
	
	/**
	 * @private
	 */
	this.surface = surface;

	/**
	 * @private
	 * This is a hash of named attributes to XML DOM nodes (attributes or elements) in the Grid model.
	 */
	this.modelNodes = {};
}

nitobi.grid.Column.prototype = {

	setAlign:function(){this.xSET("Align",arguments);},
	getAlign:function(){return this.xGET("Align",arguments);},
	setClassName:function(){this.xSET("ClassName",arguments);},
	getClassName:function(){return this.xGET("ClassName",arguments);},
	setCssStyle:function(){this.xSET("CssStyle",arguments);},
	getCssStyle:function(){return this.xGET("CssStyle",arguments);},
	setColumnName:function(){this.xSET("ColumnName",arguments);},
	getColumnName:function(){return this.xGET("ColumnName",arguments);},
	setType:function(){this.xSET("type",arguments);},
	getType:function(){return this.xGET("type",arguments);},
	setDataType:function(){this.xSET("DataType",arguments);},
	getDataType:function(){return this.xGET("DataType",arguments);},
	setEditable:function(){this.xSET("Editable",arguments);},
	isEditable:function(){return nitobi.lang.toBool(this.xGET("Editable",arguments), true);},
	setInitial:function(){this.xSET("Initial",arguments);},
	getInitial:function(){return this.xGET("Initial",arguments);},
	setLabel:function(){this.xSET("Label",arguments);},
	getLabel:function(){return this.xGET("Label",arguments);},
	setGetHandler:function(){this.xSET("GetHandler",arguments);},
	getGetHandler:function(){return this.xGET("GetHandler",arguments);},
	setDatasourceId:function(){this.xSET("DatasourceId",arguments);},
	getDatasourceId:function(){return this.xGET("DatasourceId",arguments);},
	setTemplate:function(){this.xSET("Template",arguments);},
	getTemplate:function(){return this.xGET("Template",arguments);},
	setTemplateUrl:function(){this.xSET("TemplateUrl",arguments);},
	getTemplateUrl:function(){return this.xGET("TemplateUrl",arguments);},
	setMaxLength:function(){this.xSET("maxlength",arguments);},
	getMaxLength:function(){return Number(this.xGET("maxlength",arguments));},
	setSortDirection:function(){this.xSET("SortDirection",arguments);},
	getSortDirection:function(){return this.xGET("SortDirection",arguments);},
	setSortEnabled:function(){this.xSET("SortEnabled",arguments);},
	isSortEnabled:function(){return nitobi.lang.toBool(this.xGET("SortEnabled",arguments), true);},
	setWidth:function(){this.xSET("Width",arguments);},
	getWidth:function(){return Number(this.xGET("Width",arguments));},
	setSize:function(){this.xSET("Size",arguments);},
	getSize:function(){return Number(this.xGET("Size",arguments));},
	setVisible:function(){this.xSET("Visible",arguments);},
	isVisible:function(){return nitobi.lang.toBool(this.xGET("Visible",arguments), true);},
	setxdatafld:function(){this.xSET("xdatafld",arguments);},
	getxdatafld:function(){return this.xGET("xdatafld",arguments);},
	setValue:function(){this.xSET("Value",arguments);},
	getValue:function(){return this.xGET("Value",arguments);},
	setxi:function(){this.xSET("xi",arguments);},
	getxi:function(){return Number(this.xGET("xi",arguments));},
	setEditor:function(){this.xSET("Editor",arguments);},
	getEditor:function(){return this.xGET("Editor",arguments);},
	setDisplayFields:function(){this.xSET("DisplayFields",arguments);},
	getDisplayFields:function(){return this.xGET("DisplayFields",arguments);},
	setValueField:function(){this.xSET("ValueField",arguments);},
	getValueField:function(){return this.xGET("ValueField",arguments);},
	setDelay:function(){this.xSET("Delay",arguments);},
	getDelay:function(){return Number(this.xGET("Delay",arguments));},
	setReferenceColumn:function(){this.xSET("ReferenceColumn",arguments);},
	getReferenceColumn:function(){return this.xGET("ReferenceColumn",arguments);},
	setOnCellClickEvent:function(){this.xSET("OnCellClickEvent",arguments);},
	getOnCellClickEvent:function(){return this.xGET("OnCellClickEvent",arguments);},
	setOnBeforeCellClickEvent:function(){this.xSET("OnBeforeCellClickEvent",arguments);},
	getOnBeforeCellClickEvent:function(){return this.xGET("OnBeforeCellClickEvent",arguments);},
	setOnCellDblClickEvent:function(){this.xSET("OnCellDblClickEvent",arguments);},
	getOnCellDblClickEvent:function(){return this.xGET("OnCellDblClickEvent",arguments);},
	setOnHeaderDoubleClickEvent:function(){this.xSET("OnHeaderDoubleClickEvent",arguments);},
	getOnHeaderDoubleClickEvent:function(){return this.xGET("OnHeaderDoubleClickEvent",arguments);},
	setOnHeaderClickEvent:function(){this.xSET("OnHeaderClickEvent",arguments);},
	getOnHeaderClickEvent:function(){return this.xGET("OnHeaderClickEvent",arguments);},
	setOnBeforeResizeEvent:function(){this.xSET("OnBeforeResizeEvent",arguments);},
	getOnBeforeResizeEvent:function(){return this.xGET("OnBeforeResizeEvent",arguments);},
	setOnAfterResizeEvent:function(){this.xSET("OnAfterResizeEvent",arguments);},
	getOnAfterResizeEvent:function(){return this.xGET("OnAfterResizeEvent",arguments);},
	setOnCellValidateEvent:function(){this.xSET("OnCellValidateEvent",arguments);},
	getOnCellValidateEvent:function(){return this.xGET("OnCellValidateEvent",arguments);},
	setOnBeforeCellEditEvent:function(){this.xSET("OnBeforeCellEditEvent",arguments);},
	getOnBeforeCellEditEvent:function(){return this.xGET("OnBeforeCellEditEvent",arguments);},
	setOnAfterCellEditEvent:function(){this.xSET("OnAfterCellEditEvent",arguments);},
	getOnAfterCellEditEvent:function(){return this.xGET("OnAfterCellEditEvent",arguments);},
	setOnCellBlurEvent:function(){this.xSET("OnCellBlurEvent",arguments);},
	getOnCellBlurEvent:function(){return this.xGET("OnCellBlurEvent",arguments);},
	setOnCellFocusEvent:function(){this.xSET("OnCellFocusEvent",arguments);},
	getOnCellFocusEvent:function(){return this.xGET("OnCellFocusEvent",arguments);},
	setOnBeforeSortEvent:function(){this.xSET("OnBeforeSortEvent",arguments);},
	getOnBeforeSortEvent:function(){return this.xGET("OnBeforeSortEvent",arguments);},
	setOnAfterSortEvent:function(){this.xSET("OnAfterSortEvent",arguments);},
	getOnAfterSortEvent:function(){return this.xGET("OnAfterSortEvent",arguments);},
	setOnCellUpdateEvent:function(){this.xSET("OnCellUpdateEvent",arguments);},
	getOnCellUpdateEvent:function(){return this.xGET("OnCellUpdateEvent",arguments);},
	setOnKeyDownEvent:function(){this.xSET("OnKeyDownEvent",arguments);},
	getOnKeyDownEvent:function(){return this.xGET("OnKeyDownEvent",arguments);},
	setOnKeyUpEvent:function(){this.xSET("OnKeyUpEvent",arguments);},
	getOnKeyUpEvent:function(){return this.xGET("OnKeyUpEvent",arguments);},
	setOnKeyPressEvent:function(){this.xSET("OnKeyPressEvent",arguments);},
	getOnKeyPressEvent:function(){return this.xGET("OnKeyPressEvent",arguments);},
	setOnChangeEvent:function(){this.xSET("OnChangeEvent",arguments);},
	getOnChangeEvent:function(){return this.xGET("OnChangeEvent",arguments);},
	setGetOnEnter:function(){this.xbSET("GetOnEnter",arguments);},
	isGetOnEnter:function(){return nitobi.lang.toBool(this.xGET("GetOnEnter",arguments), true);},		
	setAutoComplete:function(){this.xbSET("AutoComplete",arguments);},
	isAutoComplete:function(){return nitobi.lang.toBool(this.xGET("AutoComplete",arguments), true);},		
	setAutoClear:function(){this.xbSET("AutoClear",arguments);},
	isAutoClear:function(){return nitobi.lang.toBool(this.xGET("AutoClear",arguments), true);}
}

/**
 * Returns the XML node that represents the Column state.
 * @type {XMLElement}
 */
nitobi.grid.Column.prototype.getModel = function() {
	if (this.ModelNode == null) {
		this.ModelNode = this.surface.columnsNode.childNodes[this.column];
		// TODO: This should not be required. 
//		if (nitobi.browser.MOZ)
//			this.ModelNode=this.grid.model.selectSingleNode("//state/nitobi.grid.Columns/nitobi.grid.Column["+(parseInt(this.column)+1)+"]");
//		else
//			this.ModelNode=this.grid.model.selectSingleNode("//state/nitobi.grid.Columns/nitobi.grid.Column["+(this.column)+"]");
	}
	return this.ModelNode;
}

/**
 * Returns the HTML element of the column header.
 * @type {HTMLElement}
 */
nitobi.grid.Column.prototype.getHeaderElement = function()
{
	return nitobi.grid.Column.getColumnHeaderElement(this.grid.uid, this.column, this.surface.key);
}

/**
 * Returns the html element for a surface's header if that header has been pinned to the root
 * header (i.e. if the surface's header is no longer in view).
 * This is used primarily in {@link nitobi.grid.Surface#clearColumnHeaderSortOrder} and 
 * {@link nitobi.grid.Surface#setColumnHeaderSortOrder}.
 * @private
 */
nitobi.grid.Column.prototype.getHeaderCopy = function()
{
	return $('columnheader_'+this.column+'_'+this.grid.uid+ "_" + this.surface.key+ "copy");
}

/**
 * @private
 */
nitobi.grid.Column.prototype.getEditor = function()
{
	
}
/**
 * Returns a native browser style object that can be used to get and set styles for the entire Column including
 * both the header and the data cells.
 */
nitobi.grid.Column.prototype.getStyle = function()
{
	var className = this.getClassName();
	return nitobi.html.getClass(className);
}
/**
 * Returns a native browser style object that can be used to get and set styles for the Column header.
 */
nitobi.grid.Column.prototype.getHeaderStyle = function()
{
	var className = "acolumnheader"+this.grid.uid+"_"+this.column;
	return nitobi.html.getClass(className);
}
/**
 * Returns a native browser style object that can be used to get and set styles for the Column data cells.
 */
nitobi.grid.Column.prototype.getDataStyle = function()
{
	var className = "ntb-column-data"+this.grid.uid+"_"+this.column;
	return nitobi.html.getClass(className);
}

/**
 * Returns a reference to the editor object for the Column.
 */
nitobi.grid.Column.prototype.getEditor = function()
{
	return nitobi.form.ControlFactory.instance.getEditor(this.grid, this);
}

/**
 * @private
 */
nitobi.grid.Column.prototype.xGET = function()
{
	var node = null, xpath = "@"+arguments[0], val = "";
	var cachedNode = this.modelNodes[xpath];
	if (cachedNode!=null)
		node = cachedNode;
	else
		node = this.modelNodes[xpath] = this.getModel().selectSingleNode(xpath);

	if (node!=null)
		val = node.nodeValue;
	return val;
}
// TODO: Make the column getters / setters more like the grid getters/setters
/**
 * @private
 */
nitobi.grid.Column.prototype.xSET = function()
{
	var node = this.getModel();
	if (node!=null) {
		node.setAttribute(arguments[0],arguments[1][0]);
	}
}
/**
 * @private
 */
nitobi.grid.Column.prototype.xbSETMODEL = function()
{
	var node = this.getModel();
	if (node!=null) {
		node.setAttribute(arguments[0],nitobi.lang.boolToStr(arguments[1][0]));
	}
}
/**
 * @private
 */
nitobi.grid.Column.prototype.eSET = function(name, arguments)
{
	var oFunction = arguments[0];
	var funcRef = oFunction;

	var subName = name.substr(2);
	subName = subName.substr(0,subName.length-5);

	// TODO: this should look like eSET in Grid.
	if (typeof(oFunction) == 'string')
	{
		funcRef = function(eventArgs) {return eval(oFunction)};
	}

	if (typeof(this[name]) != 'undefined')
	{
		alert('unsubscribe');
		this.unsubscribe(subName, this[name]);
	}

	// name should be OnCellClickEvent but we just expect CellClick for firing
	var guid = this.subscribe(subName,funcRef);
	this.jSET(name, [guid]);
}
/**
 * @private
 */
nitobi.grid.Column.prototype.jSET = function(name, val)
{
	this[name] = val[0];
}

/**
 * @private
 */
nitobi.grid.Column.prototype.fire = function(evt,args)
{
	return nitobi.event.notify(evt+this.uid,args);
}

/**
 * @private
 */
nitobi.grid.Column.prototype.subscribe = function(evt,func,context)
{
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid, nitobi.lang.close(context, func));
}

/**
 * @private
 */
nitobi.grid.Column.prototype.unsubscribe = function(evt,func)
{
	return nitobi.event.unsubscribe(evt+this.uid, func);
}

/**
 * Returns the column header element for a given Grid and column index.
 * @private
 * @param {nitobi.grid} grid
 * @param {Number} column
 * @returns {HtmlElement}
 */
nitobi.grid.Column.getColumnHeaderElement = function(gridId, column, surface)
{
	return $('columnheader_'+column+'_'+gridId + "_" + surface);
}