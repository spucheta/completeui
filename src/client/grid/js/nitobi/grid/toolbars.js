nitobi.lang.defineNs("nitobi.ui");

/**
* @param {nitobi.ui.Toolbars.VisibleToolbars} visibleToolbars A bitmask representing which toolbars are being shown.
*/
nitobi.ui.Toolbars= function(parentGrid, visibleToolbars) 
{
	this.grid = parentGrid;
	this.uid = "nitobiToolbar_" + nitobi.base.getUid();
	this.toolbars = {};
	this.visibleToolbars = visibleToolbars;	
}

nitobi.ui.Toolbars.VisibleToolbars = {};
nitobi.ui.Toolbars.VisibleToolbars.STANDARD 	= 1;
nitobi.ui.Toolbars.VisibleToolbars.PAGING 		= 1 << 1;


nitobi.ui.Toolbars.prototype.initialize= function() 
{
	this.enabled=true;
	
	this.toolbarXml = nitobi.xml.createXmlDoc(nitobi.xml.serialize(nitobi.grid.toolbarDoc));
	this.toolbarPagingXml = nitobi.xml.createXmlDoc(nitobi.xml.serialize(nitobi.grid.pagingToolbarDoc));
}


nitobi.ui.Toolbars.prototype.attachToParent= function(container)
{
	this.initialize();
	
	this.container = container;
	// If there are no toolbars visible then dont render.
	if (this.standardToolbar == null && this.visibleToolbars)
	{
		this.makeToolbar();
		this.render();
	}
}

nitobi.ui.Toolbars.prototype.setWidth= function(width)
{
	this.width=width;
}

nitobi.ui.Toolbars.prototype.getWidth= function()
{
	return this.width;
}

nitobi.ui.Toolbars.prototype.setHeight= function(height)
{
	this.height=height;
}

nitobi.ui.Toolbars.prototype.getHeight= function()
{
	return this.height;
}

nitobi.ui.Toolbars.prototype.setRowInsertEnabled= function(enable)
{
	this.rowInsertEnabled = enable;
}
nitobi.ui.Toolbars.prototype.isRowInsertEnabled= function()
{
	return this.rowInsertEnabled;
}

nitobi.ui.Toolbars.prototype.setRowDeleteEnabled= function(enable)
{
	this.rowDeleteEnabled = enable;
}
nitobi.ui.Toolbars.prototype.isRowDeleteEnabled= function()
{
	return this.rowDeleteEnabled;
}

nitobi.ui.Toolbars.prototype.makeToolbar= function()
{
	var imgDir = this.findCssUrl();
	this.toolbarXml.documentElement.setAttribute("id","toolbar"+this.uid);	
	
	this.toolbarXml.documentElement.setAttribute("image_directory",imgDir);

	//TODO: This is begging for a cleaner solution.
	var nodes = this.toolbarXml.selectNodes('/toolbar/items/*');
	for (var i = 0; i < nodes.length; i++)
	{
		if (nodes[i].nodeType != 8)
		{
			nodes[i].setAttribute('id',nodes[i].getAttribute('id')+this.uid);
		}
	}

	this.standardToolbar = new nitobi.ui.Toolbar(this.toolbarXml,"toolbar"+this.uid);
	this.toolbarPagingXml.documentElement.setAttribute("id","toolbarpaging"+this.uid);	
	this.toolbarPagingXml.documentElement.setAttribute("image_directory",imgDir);
	
	nodes = (this.toolbarPagingXml.selectNodes('/toolbar/items/*'));
	for (var i = 0; i < nodes.length; i++)
	{
		if (nodes[i].nodeType != 8)
		{
			nodes[i].setAttribute('id',nodes[i].getAttribute('id')+this.uid);
		}
	}
	
	this.pagingToolbar = new nitobi.ui.Toolbar(this.toolbarPagingXml,"toolbarpaging"+this.uid);

}

nitobi.ui.Toolbars.prototype.getToolbar = function(id)
{
	// Good enough for now until this becomes a real collection.
	return eval("this." + id);
}

/**
 * Find the URL of the stylesheet that contains the toolbar classes.
 * @private
 * @return String The URL of the toolbar stylesheet.
 */
nitobi.ui.Toolbars.prototype.findCssUrl = function()
{
	var sheet = nitobi.html.Css.findParentStylesheet(".ntb-toolbar");
	if (sheet==null)
	{
		sheet = nitobi.html.Css.findParentStylesheet(".ntb-grid");
		if (sheet==null)
		{	
			nitobi.lang.throwError("The CSS for the toolbar could not be found.  Try moving the nitobi.grid.css file to a location accessible to the browser's javascript or moving it to the top of the stylesheet list. findParentStylesheet returned " + sheet);
		}
	}
	return nitobi.html.Css.getPath(sheet);
}



nitobi.ui.Toolbars.prototype.isToolbarEnabled= function() {
	return this.enabled;
}

nitobi.ui.Toolbars.prototype.render= function() 
{
	var toolbarDiv = this.container;
	toolbarDiv.style.visibility="hidden";

	var xsl = nitobi.ui.ToolbarXsl;
	if (xsl.indexOf("xsl:stylesheet") == -1)
	{
		xsl = "<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:output method=\"xml\" version=\"4.0\" />" + xsl
		+ "</xsl:stylesheet>";
	}
	var xslDoc = nitobi.xml.createXslDoc(xsl);

	xsl=nitobi.ui.pagingToolbarXsl;
	if(xsl.indexOf("xsl:stylesheet")==-1)
	{
		xsl="<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:output method=\"xml\" version=\"4.0\" />"+xsl+"</xsl:stylesheet>";
	}
	var pagingXslDoc = nitobi.xml.createXslDoc(xsl);

	var toolbarHtml = nitobi.xml.transformToString(this.standardToolbar.getXml(), xslDoc,"xml");
	
	toolbarDiv.innerHTML = toolbarHtml;
	toolbarDiv.style.zIndex="1000";

	var toolbarPagingHtml = nitobi.xml.transformToString(this.pagingToolbar.getXml(), pagingXslDoc,"xml");
	toolbarDiv.innerHTML += toolbarPagingHtml;

	xslDoc = null;
	xmlDoc = null;

	this.standardToolbar.attachToTag();
	this.pagingToolbar.attachToTag();

	this.resize();

	var _this = this;
	var buttons = this.standardToolbar.getUiElements()
	
	// using a foreach loop and a switch statement allows users to create toolbars without some buttons
	// was previously causing an error with custom toolbars
	for (eachbutton in buttons) {
		// Check for 'empty' buttons and skip over.
		if (buttons[eachbutton].m_HtmlElementHandle == null) { continue; }
		buttons[eachbutton].toolbar = this;
		buttons[eachbutton].grid = this.grid;

		if(nitobi.browser.IE && buttons[eachbutton].m_HtmlElementHandle.onbuttonload != null)
		{
			var x = function(item, grid, tbar, iDom) {eval(buttons[eachbutton].m_HtmlElementHandle.onbuttonload);}
			x(buttons[eachbutton], this.grid, this,buttons[eachbutton].m_HtmlElementHandle);
		}
		else if(!nitobi.browser.IE && buttons[eachbutton].m_HtmlElementHandle.hasAttribute('onbuttonload'))
		{
			/**
			 * @public
			 */
			var x = function(item, grid, tbar, iDom) {eval(buttons[eachbutton].m_HtmlElementHandle.getAttribute('onbuttonload'));}
			x(buttons[eachbutton], this.grid, this,buttons[eachbutton].m_HtmlElementHandle);
		}

		switch (eachbutton) {
			case "save"+this.uid:
				buttons[eachbutton].onClick = 
					function()
					{
						_this.fire("Save");
					};
			break;
			case "newRecord"+this.uid:
				buttons[eachbutton].onClick = 
					function()
					{
						_this.fire("InsertRow");
					};
				// disable button i	 row insert is not allowed
				if(!this.isRowInsertEnabled())
				{
					buttons[eachbutton].disable();
				}
			break;
			case "deleteRecord"+this.uid:
				buttons[eachbutton].onClick = 
					function()
					{
						_this.fire("DeleteRow");
					};
				// disable button if row delete is not allowed
				if(!this.isRowDeleteEnabled())
				{
					buttons[eachbutton].disable();
				}
			break;
			case "refresh"+this.uid:
				buttons[eachbutton].onClick = 
					function()
					{
						var refreshOk=confirm("Refreshing will discard any changes you have made. Is it OK to refresh?");
						if (refreshOk)
						{
							_this.fire("Refresh");			
						}
					};
			break;
			default:
		}
	}
	
	// likewise for paging buttons
	var buttonsPaging = this.pagingToolbar.getUiElements();
	var _this = this;

	for (eachPbutton in buttonsPaging) {
		// Check for empty buttons and skip over if necessary.
		if (buttonsPaging[eachPbutton].m_HtmlElementHandle == null) { continue; }
		buttonsPaging[eachPbutton].toolbar = this;
		buttonsPaging[eachPbutton].grid = this.grid;

		if(nitobi.browser.IE && buttonsPaging[eachPbutton].m_HtmlElementHandle.onbuttonload != null)
		{
			/**
			 * @public
			 */
			var x = function(item, grid, tbar, iDom) {eval(buttonsPaging[eachPbutton].m_HtmlElementHandle.onbuttonload);}
			x(buttonsPaging[eachPbutton], this.grid, this,buttonsPaging[eachPbutton].m_HtmlElementHandle);
		}
		else if(!nitobi.browser.IE && buttonsPaging[eachPbutton].m_HtmlElementHandle.hasAttribute('onbuttonload'))
		{
			/**
			 * @public
			 */
			var x = function(item, grid, tbar, iDom) {eval(buttonsPaging[eachPbutton].m_HtmlElementHandle.getAttribute('onbuttonload'));}
			x(buttonsPaging[eachPbutton], this.grid, this,buttonsPaging[eachPbutton].m_HtmlElementHandle);
		}

		switch (eachPbutton) {
			case "previousPage"+this.uid:
				buttonsPaging[eachPbutton].onClick = 
					function()
					{
						_this.fire("PreviousPage");			
					};
				buttonsPaging[eachPbutton].disable();
			break;
			case "nextPage"+this.uid:
				buttonsPaging[eachPbutton].onClick = 
					function()
					{
						_this.fire("NextPage");
					};
			break;
			default:
		}
	}

	if (this.visibleToolbars & nitobi.ui.Toolbars.VisibleToolbars.STANDARD)
	{
		this.standardToolbar.show();
	}
	else
	{
		this.standardToolbar.hide();
	}
	if (this.visibleToolbars & nitobi.ui.Toolbars.VisibleToolbars.PAGING)
	{
		this.pagingToolbar.show();
	}
	else
	{
		this.pagingToolbar.hide();
	}
	toolbarDiv.style.visibility="visible";		
}

nitobi.ui.Toolbars.prototype.resize = function()
{
	var standardWidth = this.getWidth();
	if (this.visibleToolbars & nitobi.ui.Toolbars.VisibleToolbars.PAGING) {
		//standardWidth = standardWidth - 2 - parseInt(this.pagingToolbar.getWidth());
		//standardWidth = standardWidth - parseInt(this.pagingToolbar.getWidth());
		this.standardToolbar.setHeight(this.getHeight());
	}
	if (this.visibleToolbars & nitobi.ui.Toolbars.VisibleToolbars.STANDARD) {
		//this.standardToolbar.setWidth(standardWidth)
		this.standardToolbar.setHeight(this.getHeight());
	}
}

nitobi.ui.Toolbars.prototype.fire= function(evt,args) 
{
	return nitobi.event.notify(evt+this.uid,args);
}

nitobi.ui.Toolbars.prototype.subscribe= function(evt,func,context)  
{
	if (typeof(context)=="undefined") context=this;
	return nitobi.event.subscribe(evt+this.uid,nitobi.lang.close(context, func));
}

nitobi.ui.Toolbars.prototype.dispose= function()  
{
	this.toolbarXml = null;
	this.toolbarPagingXml = null;
	//	Manually dispose of important objects belonging to Grid
	if(this.toolbar && this.toolbar.dispose)
	{
	 	this.toolbar.dispose();
		this.toolbar = null;
	}

	if(this.toolbarPaging && this.toolbarPaging.dispose)
	{
	 	this.toolbarPaging.dispose();
		this.toolbarPaging = null;
	}
}  