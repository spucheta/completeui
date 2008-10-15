<%@ Language = VBScript %>
<!--#include file="../../../../test/lib/asp/base_gethandler.inc"-->
<%
' This file is used as a datasource for the combo.  This file transforms
' the dataset taken from the mdb into compressed XML: the compressed format is supplied by Nitobi.
' Use the nitobi.xml.inc file to convert between ado and compressed xml.


' *******************************************************************
' Lets Set up the Output
' *******************************************************************
EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column 'id' as our Index

Set fs=Server.CreateObject("Scripting.FileSystemObject")
If (fs.FileExists(Server.mappath("CountryNamesAndFlags.xml"))=false) Then
      Response.Write(Server.mappath(".") & "\CountryNamesAndFlags.xml does not exist, sorry.")
End If

set xmlDoc = Server.CreateObject("Microsoft.XMLDOM")
xmlDoc.async = false
xmlDoc.load(Server.mappath("CountryNamesAndFlags.xml"))

' First we define how many columns we are sending in each record, and name each field.
' We will do this by using the EBAGetHandler_DefineField function. We will name each
' field of data after its column name in the database.
EBAGetHandler_DefineField("countryCode")
EBAGetHandler_DefineField("flagImageLocation")
EBAGetHandler_DefineField("countryNameUTF8")

' Now we add a record for each document element
set records = xmlDoc.documentElement.childNodes
for i = 0 to records.length-1
	EBAGetHandler_CreateNewRecord(records(i).getAttribute("CountryCode"))
	EBAGetHandler_DefineRecordFieldValue "countryCode",       records(i).getAttribute("CountryCode")
	EBAGetHandler_DefineRecordFieldValue "flagImageLocation", records(i).getAttribute("FlagImage")
	EBAGetHandler_DefineRecordFieldValue "countryNameUTF8",   records(i).text
	EBAGetHandler_SaveRecord
next

EBAGetHandler_CompleteGet
%>