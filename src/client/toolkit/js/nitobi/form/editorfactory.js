/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
nitobi.lang.defineNs("nitobi.form");

// initialize the editor offset for Firefox alignment problem
// these will be changed once in initialize of the EditorFactor 
// by looking at the grid border widths
nitobi.form.EDITOR_OFFSETX = 0;
nitobi.form.EDITOR_OFFSETY = 0;


/*
The editor 

how can we enable people to override masking say with custom functionality etc ...
*/
/**
 * @class
 * @constructor
 */
nitobi.form.ControlFactory = function()
{
	this.editors = {};	
}

/**
 * @ignore
 */
nitobi.form.ControlFactory.prototype.getEditor = function(caller, column, callerEvent)
{
	var editor = null;

	if(null == column)
	{
		ebaErrorReport("getEditor: column parameter is null","",EBA_DEBUG);
		return editor;
	}

	//	Check if the column metadata node could not be found for some reason
	//	If it can be found then check if it is editable.
	/*
	if((typeof(xEditorMetaNode) == "undefined") ||
	   (false == nitobi.lang.toBool(xEditorMetaNode.getAttribute("Editable"), true)) || (false == nitobi.lang.toBool(xEditorMetaNode.getAttribute("editable"), true)))
	{
		return editor;
	}
	*/

	// Not using meta model
	// var editorType = (xEditorMetaNode != null)?xEditorMetaNode.nodeName:"";
	// var dataType = (xEditorMetaNode != null)?xEditorMetaNode.getAttribute("dt"):"";
	var editorType = column.getType();
	var dataType = column.getType();

	var editorHash = "nitobi.Grid"+editorType+dataType+"Editor";
	//	First check if there is already an Editor of the appropriate type
	//	Could it also be the case that some other control is using the editor?
	//	It should not be possible since blurs should fire when clicks are made on other controls ...
	editor = this.editors[editorHash];
	if (editor == null || editor.control == null) // TODO: when we dont check the control we need to do some editor destruction along with the grid cause grid destruction removes all the editor HTML but not the hash
	{
		//	can maybe move away from the switch statment by eval'ing the type string ... 
		//	that would be less code, maybe a bit slower and easier to create new editors BUT harder to customize any editors ...
		switch (editorType)
		{
			case "LINK":
			case "HYPERLINK":
				editor = new nitobi.form.Link;
				break;
			case "IMAGE":
				return null;
			case "BUTTON":
				return null;
			case "LOOKUP": 
				editor = new nitobi.form.Lookup();
				break;
			case "LISTBOX":
				editor = new nitobi.form.ListBox();
				break;
			case "PASSWORD":
				editor = new nitobi.form.Password();
				break;
			case "TEXTAREA":
				editor = new nitobi.form.TextArea();
				break;
			case "CHECKBOX":
				editor = new nitobi.form.Checkbox();
				break;
			default:
				//	Here we need to check the datatype so that we can create the proper editor ...
				if (dataType == "DATE")
				{
					if (column.isCalendarEnabled()) 
						editor = new nitobi.form.Calendar();
					else
						editor = new nitobi.form.Date();
				}
				else if (dataType == "NUMBER")
					editor = new nitobi.form.Number();
				else
					editor = new nitobi.form.Text();
			break;
		}
		// Initialize the editor 
		editor.initialize();
	}

	this.editors[editorHash] = editor;

	return editor;
}

/**
 * @ignore
 */
nitobi.form.ControlFactory.prototype.dispose = function()
{
	for (var editor in this.editors)
	{
		this.editors[editor].dispose();
	}
}
//	this is the nitobi.form.ControlFactory.instance but it should likely be in a variable of type EBAGlobal (i have called it eba)
/**
 * @ignore
 */
nitobi.form.ControlFactory.instance = new nitobi.form.ControlFactory();
