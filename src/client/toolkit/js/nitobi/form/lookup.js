/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @class
 * @constructor
 */
nitobi.form.Lookup = function()
{
	nitobi.form.Lookup.baseConstructor.call(this);
	this.selectClicked = false;
	this.bVisible = false;

	var div = nitobi.html.createElement('div');
	div.innerHTML = 
			"<table class='ntb-input-border' border='0' cellpadding='0' cellspacing='0'><tr><td class=\"ntb-lookup-text\"></td></tr><tr><td style=\"position:relative;\"><div style=\"position:relative;top:0px;left:0px;\"></div></td></tr></table>";
	var ph=this.placeholder=div.firstChild;
	ph.setAttribute("id", "lookup_span");
	// TODO: these are needed for alignment 
	ph.style.top="-0px";
	ph.style.left="-5000px";

	// width is required to be able to fit the textbox to its parent width the first time
	var tc=this.control=nitobi.html.createElement('input', {autocomplete:"off"}, {zIndex:"2000", width:"100px"});
	tc.setAttribute("id","ntb-lookup-text");

	this.textEvents = [{type:"keydown",handler:this.handleKey}, 
					{type:"keyup",handler:this.filter}, 
					{type:"keypress",handler:this.handleKeyPress},
					{type:"change",handler:this.handleChange},
					{type:"blur",handler:function(){console.log('blur');}},
					{type:"focus",handler:function(){console.log('focus');}}];

	ph.rows[0].cells[0].appendChild(tc);

	// We don't create the <select> element here since select.innerHTML doesnt work :(
	this.selectPlaceholder = ph.rows[1].cells[0].firstChild;

	this.selectEvents = [{"type":"click","handler":this.handleSelectClicked}];

	/**
	 * This is a hack for preventing the keyup event on the control from sending back a
	 * server request on the first time that the keyup event is fired. This is because the bind
	 * is first called which will do a get and then the keyup will also do a get ...
	 * @type Boolean
	 * @private
	 */
	this.firstKeyup = false;
	/**
	 * This is a flag indicating if the contents of the textbox has been autocompleted
	 * @type Boolean
	 * @private
	 */
	this.autocompleted = false;

	/**
	 * Get data from another column and pass it to the get handler
	 * @type String
	 * @private
	 */
    this.referenceColumn = null;
	/**
	 * enable autocomplete (in my case I want to turn it off)
	 * @type Boolean
	 * @private
	 */	
    this.autoComplete = null;
	/**
	 * enable autoclear of cell if value is not selected from list
	 * @type Boolean
	 * @private
	 */	
    this.autoClear = null;
	/**
	 * enable ondemand calling of gethandler 
	 * @type Boolean
	 * @private
	 */	
	this.getOnEnter = null;

	this.listXml = null;
	this.listXmlLower = null;

	this.editCompleteHandler = null;

	this.delay = 0;
	this.timeoutId = null;

	var xsl="<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">";
	xsl+="<xsl:output method=\"text\" version=\"4.0\"/><xsl:param name='searchValue'/>";
	xsl+="<xsl:template match=\"/\"><xsl:apply-templates select='//option[starts-with(.,$searchValue)][1]' /></xsl:template>";
	xsl+="<xsl:template match=\"option\"><xsl:value-of select='@rn' /></xsl:template></xsl:stylesheet>";

	var searchXslDoc = nitobi.xml.createXslDoc(xsl);
	this.searchXslProc = nitobi.xml.createXslProcessor(searchXslDoc);
	searchXslDoc = null;
}

nitobi.lang.extend(nitobi.form.Lookup, nitobi.form.Control);
nitobi.lang.implement(nitobi.form.Lookup, nitobi.ui.IDataBoundList);
nitobi.lang.implement(nitobi.form.Lookup, nitobi.form.IBlurable);

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.initialize = function()
{
	this.firstKeyup = false;
	nitobi.html.attachEvents(this.control, this.textEvents, this);
	nitobi.html.attachEvents(this.selectPlaceholder, this.selectEvents, this);
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.hideSelect = function()
{
	this.selectControl.style.display = "none";
	this.bVisible = false;
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.bind = function(owner, cell, searchString)
{
	nitobi.form.Lookup.base.bind.apply(this, arguments);

	var col = this.column = this.cell.getColumnObject();
	var columnModel = this.column.getModel();

	// TODO: This is all crazy here.
	this.datasourceId = col.getDatasourceId();
	this.getHandler = col.getGetHandler();
	this.delay = col.getDelay();

	this.size = col.getSize();
	
	this.referenceColumn = col.getReferenceColumn();
	this.autoComplete = col.isAutoComplete();
	this.autoClear = col.isAutoClear();
	this.getOnEnter = col.isGetOnEnter();
	
	this.displayFields = col.getDisplayFields();
	this.valueField = col.getValueField();

	this.eSET("onKeyPress", [col.getOnKeyPressEvent()]);
	this.eSET("onKeyDown", [col.getOnKeyDownEvent()]);
	this.eSET("onKeyUp", [col.getOnKeyUpEvent()]);
	this.eSET("onChange", [col.getOnChangeEvent()]);

	// By now the DisplayFields parameter contains the mapped field names.
	var listboxXsl = nitobi.form.listboxXslProc;
	listboxXsl.addParameter('DisplayFields', this.displayFields, '');
	listboxXsl.addParameter('ValueField', this.valueField, '');

	this.dataTable = this.owner.data.getTable(this.datasourceId);
	this.dataTable.setGetHandler(this.getHandler);
	this.dataTable.async = false;

	if (searchString.length <= 0) searchString = this.cell.getValue();

	this.get(searchString, true);
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.getComplete = function(searchString)
{
 	var datasourceXmlDoc = this.dataTable.getXmlDoc(); 

	// By now the DisplayFields parameter contains the mapped field names.
	var listboxXsl = nitobi.form.listboxXslProc;
	listboxXsl.addParameter('DisplayFields', this.displayFields, '');
	listboxXsl.addParameter('ValueField', this.valueField, '');
	listboxXsl.addParameter('val', nitobi.xml.constructValidXpathQuery(this.cell.getValue(),false), '');

	// IE 6 standards mode layout problem - need to specify the size of the select to make it have any height
	if (nitobi.browser.IE && document.compatMode == "CSS1Compat")
		listboxXsl.addParameter('size', 6, '');

	//Workaround for not being able to set the innerHTML of a select element in nitobi.browser.IE ...
	//http://support.microsoft.com/default.aspx?scid=kb;en-us;276228

	//	TODO: this should not be creating an XML doc from the xml string!!!
	this.listXml = nitobi.xml.transformToXml(nitobi.xml.createXmlDoc(datasourceXmlDoc.xml), nitobi.form.listboxXslProc);
	this.listXmlLower = nitobi.xml.createXmlDoc(this.listXml.xml.toLowerCase());

	// Clear the size attribute so that it doesnt affect the Listbox control
	if (nitobi.browser.IE && document.compatMode == "CSS1Compat")
		listboxXsl.addParameter('size', '', '');

	this.selectPlaceholder.innerHTML = nitobi.xml.serialize(this.listXml);

	var tc = this.control;
	// Setup the select control for the lookup
	var sc = this.selectControl = nitobi.html.getFirstChild(this.selectPlaceholder);
	sc.setAttribute("id","ntb-lookup-options");
	sc.setAttribute("size", this.size);
	sc.style.display = "none";
	// Bug in IE6 improperly renders the select.
	if (nitobi.browser.IE6 && document.compatMode != "CSS1Compat")
		sc.style.height = "100%";

	// TODO: this is a pain since we re-call the blurable interface and so destroy any state like lastFocus in IBlurable
	// Setup the blurable interface to capture blur events on multiple different elements
	nitobi.form.IBlurable.call(this, [tc, sc], this.deactivate);

	this.selectClicked = false;
	this.bVisible = false;

	this.align();

	// Now we need to adjust the editor width for padding / borders etc
	nitobi.html.fitWidth(this.placeholder, this.control);

	if( this.autoComplete )
	{
		var rn = this.search(searchString);

		if (rn > 0)
		{
			sc.selectedIndex = rn-1;
			tc.value = sc[sc.selectedIndex].text;
			nitobi.html.highlight(tc, tc.value.length - (tc.value.length - searchString.length));
			this.autocompleted = true;
		}
		// Check to see if there is a selection from the possible rows.
		else
		{
			var row = datasourceXmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'e[@' + this.valueField + '=\'' + searchString + '\']');
			if (row != null)
			{
				//	TODO: displayFields can possibly be | separated values.
				tc.value = row.getAttribute(this.displayFields);
				var rn = this.search(tc.value);
				sc.selectedIndex = parseInt(rn)-1;
			}
			else
			{
				// If this is a custom value, just use the custom value.
				tc.value = searchString;
				sc.selectedIndex=-1;
			}
		}
	}
    else
    {
        // If this is a custom value, just use the custom value.
        tc.value = searchString;
        sc.selectedIndex=-1;
    }	

	tc.parentNode.style.height = nitobi.html.getHeight(this.cell.getDomNode()) + "px";

	sc.style.display = 'inline';
	
	tc.focus();
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.handleSelectClicked = function (evt)
{
	this.control.value = this.selectControl.selectedIndex != -1 ? this.selectControl.options[this.selectControl.selectedIndex].text : "";
	this.deactivate(evt);
	//TODO: this was causing problems in IE, so i removed it, but its still not complete
	//this.focus();

	// TODO: maybe we need this ...
	// if (evt.srcElement.tagName == "OPTION")
	// this.deactivate;
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.focus = function (evt)
{
	this.control.focus();
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.deactivate = function(evt)
{
	if (nitobi.form.Lookup.base.deactivate.apply(this, arguments) == false) return;

	var sc = this.selectControl;
	var tc = this.control;

	var text = "", value = "";

	// If there was a match in the list, then select the match, otherwise 
	// the value is a custom value.
	if (evt != null && evt != false) 
	{
		// If an item from the list is selected, pick that one, otherwise pick the custom text.
		if (sc.selectedIndex >= 0)
		{
			value = sc.options[sc.selectedIndex].value;
			text = sc.options[sc.selectedIndex].text;
		}
		else
		{
			// ForceValidOption determines whether to restrict the cell's value to only items
			// retrieved from the server
			if (this.column.getModel().getAttribute("ForceValidOption") != "true")
			{
				value = tc.value;
				text = value;
			}
			else if (this.autoClear)
			{
				value = "";
				text = "";
			}
			else
			{
				value = this.cell.getValue();
				var len = sc.options.length;
				for (var i=0; i<len; i++)
				{
					if (sc.options[i].value == value)
						text = sc.options[i].text;
				}
			}
		}
	} else {
		value = this.cell.getValue();
		var len = sc.options.length;
        var found = false;
        for (var i=0; i<len; i++)
        {
            if (sc.options[i].value == value)
            {
                text = sc.options[i].text;
                found = true;
                break;
            }
        }

        if( !found && this.autoClear)
        {
            value = '';
            text = '';
        }
	}

	nitobi.html.detachEvents(sc, this.textEvents);

	// Clear any pending timeout to send a request to the server
	window.clearTimeout(this.timeoutId);

	return this.afterDeactivate(nitobi.html.encode(text), value);
}

/**
 * HandleKey deals with keys that we want to mask out. For example, esc and enter are masked to 
 * cause the lookup to deactivate.
 * @param {nitobi.html.Event} evt The event object.
 * @param {HtmlElement} element The HTML element that the event handler was registered on.
 */
nitobi.form.Lookup.prototype.handleKey = function(evt, element)
{
	
	var k = evt.keyCode;
	// If the user pressed up or down, don't blur the select
	if (k != 40 && k != 38)
		nitobi.form.Lookup.base.handleKey.call(this, evt);
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.search = function(searchValue)
{
	searchValue = nitobi.xml.constructValidXpathQuery(searchValue,false);

	this.searchXslProc.addParameter('searchValue', searchValue.toLowerCase(), '');

	var lineno = nitobi.xml.transformToString(this.listXmlLower, this.searchXslProc);

	if ("" == lineno)
		lineno=0;
	else
		lineno=parseInt(lineno);

	return lineno;
}

//	Filter runs on keypress - so the key has actually gone 
//	through handleKey and is now in the textbox ready to 
//	filter the listbox below.
/**
 * @ignore
 */
nitobi.form.Lookup.prototype.filter = function(evt, o)
{
	var k=evt.keyCode;
	
	if (this.onKeyUp.notify(evt) == false) return;

	if (!this.firstKeyup  && k != 38 && k != 40)
	{
		this.firstKeyup = true;
		return;
	}
	
	var tc = this.control;
	var sc = this.selectControl;

	switch (k) {
		case 38:
			if (sc.selectedIndex == -1) sc.selectedIndex=0;
			if (sc.selectedIndex > 0) sc.selectedIndex--;

			tc.value = sc.options[sc.selectedIndex].text;
			nitobi.html.highlight(tc, tc.value.length);
			tc.select();
			break;
		case 40:
			if (sc.selectedIndex < (sc.length -1)) {
				sc.selectedIndex++;
			}
			tc.value = sc.options[sc.selectedIndex].text;
			nitobi.html.highlight(tc, tc.value.length);
			tc.select();
			break;

		default:
			if ((!this.getOnEnter && ((k<193 && k>46) || k==8 || k==32)) // All keys, backspace, del
				|| (this.getOnEnter && k== 13))						  	 // enter
			{
				var searchValue = tc.value;
				this.get(searchValue);
			}
/*
			//search
			lineno = this.search(searchValue);

			//8 = backspace 46 = delete
			// Don't highlight anything if delete or backspace was pressed.
			if (lineno > 0 && k != 8 && k!=46 && (k<188 && k>46))
			{
				sc.selectedIndex = lineno-1;
				tc.value = sc[sc.selectedIndex].text;
				nitobi.html.highlight(tc, tc.value.length - (tc.value.length - searchValue.length));
			}
			else 
			{
				sc.selectedIndex=-1;
			}
*/
		}
}
/**
 * Gets the data from the server using a SYNCHRONOUS get request.
 * @ignore
 */
nitobi.form.Lookup.prototype.get = function(searchString, force)
{
	if (this.getHandler != null && this.getHandler != ''/*&& !oColumn.fire("BeforeLookup")*/)
	{		
		if (force || !this.delay)
		{
			this.doGet(searchString);
		}
		else
		{
			if (this.timeoutId)
			{
				// cancel the pending request.
				window.clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
			this.timeoutId = window.setTimeout(nitobi.lang.close(this, this.doGet, [searchString]), this.delay);
		}
	}else{
		this.getComplete(searchString);
	}
}

/**
 * @ignore
 */
nitobi.form.Lookup.prototype.doGet = function(searchString)
{
	// We are using a remote datasource
	if (searchString)
	{
		this.dataTable.setGetHandlerParameter("SearchString",searchString);
	}
	if(this.referenceColumn != null && this.referenceColumn != '')
	{
		//get value
		var referenceValue = this.owner.getCellValue(this.cell.row,this.referenceColumn);
		this.dataTable.setGetHandlerParameter("ReferenceColumn",referenceValue);
	}
	//, nitobi.lang.close(this, this.getComplete, [searchString])
	this.dataTable.get(null, this.pageSize, this);

	this.timeoutId = null;

	this.getComplete(searchString);
}

//	setEditCompleteHandler is implemented in the super class ....
/**
 * @ignore
 */
nitobi.form.Lookup.prototype.dispose = function()
{
	this.placeholder = null;
	nitobi.html.detachEvents(this.textEvents, this);
	this.selectControl = null;
	this.control = null;
    this.dataTable = null;	
	this.owner = null;
}
