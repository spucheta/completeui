/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */

// *****************************************************************************
// *****************************************************************************
// * nitobi.ui.Toolbar
// *****************************************************************************
/// <class name='nitobi.ui.Toolbar'>
/// <summary>


/// </summary>

nitobi.ui.ToolbarDivItemXsl ="<xsl:template match=\"div\"><xsl:copy-of select=\".\"/></xsl:template>";

nitobi.ui.ToolbarXsl = 

   "<xsl:template match=\"//toolbar\">"+
      "<div style=\"z-index:800\">"+
         "<xsl:attribute name=\"id\">"+
            "<xsl:value-of select=\"@id\" />"+
         "</xsl:attribute>"+
         "<xsl:attribute name=\"style\">float:left;position:relative;"+
	            "<xsl:value-of select=\"concat('height:',@height,'px')\" />"+
	      "</xsl:attribute>"+
         "<xsl:apply-templates />"+
      "</div>"+
   "</xsl:template>"+
   nitobi.ui.ToolbarDivItemXsl +
   nitobi.ui.ButtonXsl +
   nitobi.ui.BinaryStateButtonXsl + 
   
      "<xsl:template match=\"separator\">"+
         "<div align='center'>"+
	         "<xsl:attribute name=\"style\">"+
	            "<xsl:value-of select=\"concat('float:left;width:',@width,';height:',@height)\" />"+
	         "</xsl:attribute>"+
	         "<xsl:attribute name=\"id\">"+
				"<xsl:value-of select=\"@id\" />"+
			"</xsl:attribute>"+
         	 
            "<img border='0'>"+
	            "<xsl:attribute name=\"src\">"+
		            "<xsl:value-of select=\"concat(//@image_directory,@image)\" />"+
		         "</xsl:attribute>"+
		         "<xsl:attribute name=\"style\">"+
						"<xsl:value-of select=\"concat('MARGIN-TOP:3','px;MARGIN-BOTTOM:0','px')\" />"+
				 "</xsl:attribute>"+
            "</img>"+
         "</div>"+
   "</xsl:template>";
   
nitobi.ui.pagingToolbarXsl = 

   "<xsl:template match=\"//toolbar\">"+
      "<div style=\"z-index:800\">"+
         "<xsl:attribute name=\"id\">"+
            "<xsl:value-of select=\"@id\" />"+
         "</xsl:attribute>"+
         "<xsl:attribute name=\"style\">float:right;position:relative;"+
	            "<xsl:value-of select=\"concat('height:',@height,'px')\" />"+
	      "</xsl:attribute>"+
         "<xsl:apply-templates />"+
      "</div>"+
   "</xsl:template>"+
   nitobi.ui.ToolbarDivItemXsl +
   nitobi.ui.ButtonXsl +
   nitobi.ui.BinaryStateButtonXsl + 
   
      "<xsl:template match=\"separator\">"+
         "<div align='center'>"+
	         "<xsl:attribute name=\"style\">"+
	            "<xsl:value-of select=\"concat('float:right;width:',@width,';height:',@height)\" />"+
	         "</xsl:attribute>"+
	         "<xsl:attribute name=\"id\">"+
				"<xsl:value-of select=\"@id\" />"+
			"</xsl:attribute>"+
         	 
            "<img border='0'>"+
	            "<xsl:attribute name=\"src\">"+
		            "<xsl:value-of select=\"concat(//@image_directory,@image)\" />"+
		         "</xsl:attribute>"+
		         "<xsl:attribute name=\"style\">"+
						"<xsl:value-of select=\"concat('MARGIN-TOP:3','px;MARGIN-BOTTOM:0','px')\" />"+
				 "</xsl:attribute>"+
            "</img>"+
         "</div>"+
   "</xsl:template>";
   

/**
 * Constructor for nitobi.ui.Toolbar
 * @class The toolbar class manages the toolbar portion of the Nitobi Grid component.  You do not need to 
 * instantiate this class, rather you should use {@link nitobi.grid.Grid#getToolbars}
 * @param {XmlDocument} [xml] The xml document that defines the toolbar
 * @param {String} [id] An id uniquely identifying the toolbar
 * @private
 */
nitobi.ui.Toolbar = function (xml,id)
{
	nitobi.ui.Toolbar.baseConstructor.call(this);
	this.initialize(xml,nitobi.ui.ToolbarXsl,id);
}

nitobi.lang.extend(nitobi.ui.Toolbar, nitobi.ui.InteractiveUiElement);

/**
 * Returns a list of all the UiElements that the toolbar is displaying. You can access 
 * the elements by name.
 * @return {array} A list of UiElements.
 * @private
 */
nitobi.ui.Toolbar.prototype.getUiElements = function ()
{
	return this.m_UiElements;
}

/**
 * @private
 */
nitobi.ui.Toolbar.prototype.setUiElements = function (uiElements)
{
	this.m_UiElements = uiElements;
}

/**
 * Attaches all the elements that to toolbar has to the HTML elements
 * and the toolbar object.
 * @private
 */
nitobi.ui.Toolbar.prototype.attachButtonObjects = function ()
{
	if (!this.m_UiElements)
	{
		this.m_UiElements = new Array();
		var tag = this.getHtmlElementHandle();
		var children = tag.childNodes;

		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			// Don't process white space nodes.
			if (child.nodeType!=3)
			{
				var newElement;
				switch(child.className)
				{
					case("ntb-button"):
					{
						newElement = new nitobi.ui.Button(null,child.id);	
					
						break;
					}
					case("ntb-binarybutton"):
					{
						newElement = new nitobi.ui.BinaryStateButton(null,child.id);	
						break;
					}
					default:
					{
						newElement = new nitobi.ui.UiElement(null,null,child.id);	
						break;
					}
				}
				newElement.attachToTag();
				this.m_UiElements[child.id]=newElement;
			}
		}
	}
}

/**
 * Renders the toolbar inside of the specified container. If the container is
 * null, then it renders at the end of the page.
 * @param htmlElement {object} The html element inside which the toolbar is rendered.
 */
nitobi.ui.Toolbar.prototype.render = function (htmlElement)
{
	nitobi.ui.Toolbar.base.base.render.call(this, htmlElement);
	this.attachButtonObjects();
}

/**
 * Disables each element in the toolbar.
 */
nitobi.ui.Toolbar.prototype.disableAllElements = function ()
{
	for (var i in this.m_UiElements) 
	{
		if (this.m_UiElements[i].disable)
		{
			this.m_UiElements[i].disable();
		}
	}
}

/**
 * Enables all elements in the toolbar.
 */
nitobi.ui.Toolbar.prototype.enableAllElements = function()
{
	for (var i in this.m_UiElements) 
	{
		if (this.m_UiElements[i].enable)
		{
			this.m_UiElements[i].enable();
		}
	}
}


/**
 * Attaches the toolbar object to the toolbar. You can then access the object using
 * the elements javascriptObject property.
 */
nitobi.ui.Toolbar.prototype.attachToTag = function ()
{
	nitobi.ui.Toolbar.base.base.attachToTag.call(this);
	this.attachButtonObjects();
}

nitobi.ui.Toolbar.prototype.dispose = function ()
{
	if (typeof(this.m_UiElements) != "undefined")
	{
		for (var button in this.m_UiElements)
		{
			this.m_UiElements[button].dispose();
		}
		this.m_UiElements = null;
	}
	nitobi.ui.Toolbar.base.dispose.call(this);
}

/// </class>