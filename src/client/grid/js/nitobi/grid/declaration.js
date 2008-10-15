nitobi.lang.defineNs("nitobi.grid.Declaration");

nitobi.grid.Declaration.parse = function(element)
{
	// We require that the object expando property on the DOM node refers to the JS object.
//	element.jsObject=this;
	
//	this.element = element;

	var Declaration = {};

	Declaration.grid = nitobi.xml.parseHtml(element);

	ntbAssert(!nitobi.xml.hasParseError(Declaration.grid),'The framework was not able to parse the declaration.\n' + '\n\nThe parse error was: ' + nitobi.xml.getParseErrorReason(Declaration.grid) + 'The declaration contents where:\n' + nitobi.html.getOuterHtml(element),'',EBA_THROW);

	var oNode = element.firstChild;

	while (oNode != null)
	{
		if (typeof(oNode.tagName) != 'undefined')
		{
			var tag = oNode.tagName.replace(/ntb\:/gi,'').toLowerCase();
			if (tag == "inlinehtml")
			{
				Declaration[tag] = oNode;
			}
			else
			{
				var ebans="http://www.nitobi.com"; // This string shouldn't be hard-coded
				if (tag == "columndefinition")
				{
					//ntbAssert(false, 'Using EBA Grid V2.8 declaration', '', EBA_DEBUG);

					var sXml;
					if (nitobi.browser.IE) {
						sXml = ('<'+nitobi.xml.nsPrefix+'grid xmlns:ntb="'+ebans+'"><'+nitobi.xml.nsPrefix+'columns>'+oNode.parentNode.innerHTML.substring(31).replace(/\=\s*([^\"^\s^\>]+)/g,"=\"$1\" ")+'</'+nitobi.xml.nsPrefix+'columns></'+nitobi.xml.nsPrefix+'grid>');
					}
					else
					{
						//	TODO: Need to check that we don't have nested tags here due to Mozilla not liking unclosed tags
						sXml = '<'+nitobi.xml.nsPrefix+'grid xmlns:ntb="'+ebans+'"><'+nitobi.xml.nsPrefix+'columns>'+oNode.parentNode.innerHTML.replace(/\=\s*([^\"^\s^\>]+)/g,"=\"$1\" ")+'</'+nitobi.xml.nsPrefix+'columns></'+nitobi.xml.nsPrefix+'grid>';
					}

					sXml = sXml.replace(/\&nbsp\;/gi,' ');

					Declaration['columndefinitions'] = nitobi.xml.createXmlDoc();
					Declaration['columndefinitions'].validateOnParse=false;
					Declaration['columndefinitions'] = nitobi.xml.loadXml(Declaration['columndefinitions'], sXml);
					break;
				} 
				else
				{
					Declaration[tag] = nitobi.xml.parseHtml(oNode);
/*
					if (nitobi.browser.IE) {
						Declaration[tag] = nitobi.xml.createXmlDoc();
						Declaration[tag].validateOnParse=false;
						var sXml = oNode.outerHTML.replace(/\=\s*([^\"^\s^\>]+)/g,"=\"$1\" ")
						sXml = sXml.substring(sXml.indexOf('/>')+2).replace(/\>/,' xmlns:ntb="'+ebans+'" >');
						Declaration[tag] = nitobi.xml.loadXml(Declaration[tag], sXml);
					} else {
						//	Added on .replace(/\n/g,'') to get rid of any new line characters which are of course nodes in Firefox xml
						//oNode.innerHTML.replace(/\=\s*([^\"^\s^\>]+)/g,"=\"$1\" ")
						Declaration[tag] = nitobi.xml.createXmlDoc(('<'+nitobi.xml.nsPrefix+tag+' xmlns:ntb="'+ebans+'">'+oNode.innerHTML.replace(/\n/g,'')+'</'+nitobi.xml.nsPrefix+tag+'>').replace(/\>\s*\</gi,'><'))
					}
*/
				}
			}
		}

		oNode = oNode.nextSibling;
	}

	return Declaration;
}


nitobi.grid.Declaration.loadDataSources = function(xDeclaration, grid)
{
	var declarationDatasources = new Array();
	if (xDeclaration["datasources"])
	{
		declarationDatasources = xDeclaration.datasources.selectNodes("//"+nitobi.xml.nsPrefix+"datasources/*");
	}
	if (declarationDatasources.length > 0)
	{
		for (var i = 0; i < declarationDatasources.length; i++)
		{
			var id = declarationDatasources[i].getAttribute('id');
			if (id != "_default")
			{
				var sData = declarationDatasources[i].xml.replace(/fieldnames=/g,"FieldNames=").replace(/keys=/g,"Keys=");
	
				sData = '<ntb:grid xmlns:ntb="http://www.nitobi.com"><ntb:datasources>'+sData+'</ntb:datasources></ntb:grid>'
				var newDataTable = new nitobi.data.DataTable('local',grid.getPagingMode() != nitobi.grid.PAGINGMODE_NONE,{GridId:grid.getID()},{GridId:grid.getID()},grid.isAutoKeyEnabled());
				newDataTable.initialize(id, sData);
				newDataTable.initializeXml(sData);
				grid.data.add(newDataTable);
				
				// The datasource we have loaded could be that of the Grid as well ...
				var columns = grid.model.selectNodes("//nitobi.grid.Column[@DatasourceId='"+id+"']");
				for (var j = 0; j < columns.length; j++)
				{
					//	Now that we have created the datasource we need to set the ValueField and DisplayFields etc
					grid.editorDataReady(columns[j]);
				}
			}
		}
	}
}
