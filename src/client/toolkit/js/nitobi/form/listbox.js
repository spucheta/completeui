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
 * @extends nitobi.form.Control
 */
nitobi.form.ListBox = function()
{
	nitobi.form.ListBox.baseConstructor.call(this);

	var ph = this.placeholder;
	ph.setAttribute("id", "listbox_span");
	// TODO: we need this top and left style for alignment
	ph.style.top="0px";
	ph.style.left="-5000px";

	this.metadata = null;

	this.keypress = false;
	
	/**
	 * track entered string for doing multiple character search
	 * @type String
	 * @private
	 */	
	this.typedString = null;

	this.events = [{type:"change", handler:this.deactivate},
					{type:"keydown", handler:this.handleKey},
					{type:"keyup",handler:this.handleKeyUp}, 
					{type:"keypress",handler:this.handleKeyPress},
					{type:"blur", handler:this.deactivate}];
}

nitobi.lang.extend(nitobi.form.ListBox, nitobi.form.Control);

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.initialize = function()
{
}

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.bind = function(owner, cell)
{
	nitobi.form.ListBox.base.bind.apply(this, arguments);

	var columnModel = cell.getColumnObject().getModel();
	// TODO: This is all crazy here.
	var sDatasourceId = columnModel.getAttribute('DatasourceId');
	this.dataTable = this.owner.data.getTable(sDatasourceId);

	this.eSET("onKeyPress", [columnModel.getAttribute('OnKeyPressEvent')]);
	this.eSET("onKeyDown", [columnModel.getAttribute('OnKeyDownEvent')]);
	this.eSET("onKeyUp", [columnModel.getAttribute('OnKeyUpEvent')]);
	this.eSET("onChange", [columnModel.getAttribute('OnChangeEvent')]);

	this.bindComplete(cell.getValue());
}

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.bindComplete = function(initialChar)
{
	//	TODO: This is ridiculous to re-render the HTML select box each time!!!
	//	We need only render it once since it never changes
	//	If we want dynamic loading of data then use the combo box!!!
	//	What does need to be done is the selectedIndex needs to be set based on the value - this happens in the xsl ...

	var datasourceXmlDoc = this.dataTable.xmlDoc.selectSingleNode('//'+nitobi.xml.nsPrefix+'datasource[@id=\''+this.dataTable.id+'\']');
	var oColumn = this.cell.getColumnObject();

	var colModel = oColumn.getModel();
	var displayFields = colModel.getAttribute('DisplayFields');
	var valueField = colModel.getAttribute('ValueField');

	var xsl = nitobi.form.listboxXslProc;
	xsl.addParameter('DisplayFields', displayFields, '');
	xsl.addParameter('ValueField', valueField, '');
	// TODO: this is not quite working yet.
	xsl.addParameter('val', initialChar, '');

	//Workaround for not being able to set the innerHTML of a select element in IE ...
	//http://support.microsoft.com/default.aspx?scid=kb;en-us;276228
	this.listXml = nitobi.xml.transformToXml(nitobi.xml.createXmlDoc(datasourceXmlDoc.xml), xsl);

	this.placeholder.rows[0].cells[0].innerHTML = nitobi.xml.serialize(this.listXml);

	var tc = this.control = nitobi.html.getFirstChild(this.placeholder.rows[0].cells[0]);
	tc.style.width = "100%";
	tc.style.height = (this.cell.DomNode.offsetHeight-2) + "px";

	nitobi.html.attachEvents(tc, this.events, this);
	nitobi.html.Css.addClass(tc.className, this.cell.getDomNode().className);

	this.align();

	this.focus();
	
	// If character is not blank then do search in list
    if( typeof(initialChar) != 'undefined' && initialChar != null && initialChar != '')
    {
        return this.searchComplete(initialChar);
    }	
}

//	render is in the super class
//	mimic is in the super class
//	align is in the super class

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.deactivate = function(ok)
{
	//	Need to check the blur value since deactivate can be called twice by
	//	the onblur handler on the textbox or by hitting enter which then causes the blur to occur ...
	if (this.keypress)
	{
		this.keypress = false;
		return;
	}
	
	if (nitobi.form.ListBox.base.deactivate.apply(this, arguments) == false) return;

	if (this.onChange.notify(this) == false) return;

	var c = this.control;

	var text = "", value = "";
	if (ok || ok == null) {
		//	get the tet and the value that is selected ...
		text = c.options[c.selectedIndex].text;
		value = c.options[c.selectedIndex].value;
	} else {
		value = this.cell.getValue();
		var len = c.options.length;
		for (var i=0; i<len; i++)
		{
			if (c.options[i].value == value)
				text = c.options[i].text;
		}
	}

	this.typedString = null;

	return this.afterDeactivate(nitobi.html.encode(text), value);
}

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.handleKey = function(evt)
{
	var k = evt.keyCode;

	this.keypress = false;

	var K = nitobi.form.Keys;

	switch (k) {
		case K.DOWN:
			// If we are at the end of the list the keypress down will not fire onchange
			if (this.control.selectedIndex < this.control.options.length - 1)
				this.keypress = true;
			break;
		case K.UP:
			// If we are at the start of the list the keypress going up will not fire onchange
			if (this.control.selectedIndex > 0)
				this.keypress = true;
			break;
		case K.ENTER:
		case K.TAB:
		case K.ESC:
			return nitobi.form.ListBox.base.handleKey.call(this, evt);
		default:
			// Prevent the editor from bluring in IE in particular
			nitobi.html.cancelEvent(evt);
			// in general let them enter the value and have the list select it.
	        return this.searchComplete(String.fromCharCode(k));
	}
}

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.searchComplete = function(keyVal, matchString)
{
    //var keyVal = String.fromCharCode(keyCode); // Convert ASCII Code to a string

    if( typeof(matchString) != 'undefined' && matchString != '' )
    {
        this.typedString = matchString;
        this.maxLinearSearch = 500;
    }
    else
    {
        this.typedString = this.typedString + keyVal; // Add to previously typed characters
    }

    var c = this.control;
    var elementCnt  = c.options.length;    // Calculate length of array -1

    if ( elementCnt > this.maxLinearSearch ) //make sure it's worthwhile doing a binary search
    {
        var result = this.searchBinary(this.typedString, 0, (elementCnt -1));
        if ( result )
        {
            //once match found, search backawards to first match in list
            for ( i = result; i > 0; i-- )
            {
                if (c.options[i].text.toLowerCase().substr(0,this.typedString.length) != this.typedString.toLowerCase())
                {
                    c.selectedIndex = i+1; // Make the relevant OPTION selected
                    break; //and STOP!
                }
            }
        }
    }
    else //it's not worthwhile doing a binary search because the number of items is too small, so search linearly
    {
        for (i = 1; i < elementCnt; i++)
        {
            if (c.options[i].text.toLowerCase().substr(0,this.typedString.length) == this.typedString.toLowerCase())
            {
                c.selectedIndex = i;
                break;
    }
        }
    }

    clearTimeout(this.timerid); // Clear the timeout

    var _this = this;
    this.timerid = setTimeout(function(){_this.typedString = "";},1000); // Set a new timeout to reset the key press string

    return false; // to prevent IE from doing its own highlight switching
}

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.searchBinary = function(matchString, low, high)
{
    /* Termination check */
    if (low > high)
    {
        return null;
    }

    var c = this.control;

    var mid = Math.floor((high+low)/2);
    var selectText = c.options[mid].text.toLowerCase().substr(0,matchString.length);
    var matchText = matchString.toLowerCase();

    if ( matchText == selectText )
    {
        return mid;
    }
    else if ( matchText < selectText )
    {
        return this.searchBinary(matchString, low, (mid -1));
    }
    else if ( matchText > selectText )
    {
        return this.searchBinary(matchString, (mid + 1), high);
    }
    else
    {
        return null;
    }

}

//	setEditCompleteHandler is implemented in the super class ....

/**
 * @ignore
 */
nitobi.form.ListBox.prototype.dispose = function()
{
	nitobi.html.detachEvents(this.control, this.events);
	this.placeholder = null;
	this.control = null;
	this.listXml = null;
	this.element = null;
	this.metadata = null;
	this.owner = null;
}