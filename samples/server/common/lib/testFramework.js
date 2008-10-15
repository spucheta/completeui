function include(xmlFileName)
{
	var includesXmlDoc = new nitobi.xml.createXmlDoc();
	includesXmlDoc.load(xmlFileName);
	var xslDoc = new nitobi.xml.createXslDoc();
	xslDoc.async = false;
	xslDoc.load(PATH_Lib+"Common/Test/include.xsl");
	var xslProc = nitobi.xml.createXslProcessor(xslDoc);
	xslProc.addParameter("basedir", PATH_Lib, "");
		xslProc.addParameter("rand", Math.random(), "");
	var txt = nitobi.xml.transformToString(includesXmlDoc, xslProc,"text");
	document.writeln(txt);
}