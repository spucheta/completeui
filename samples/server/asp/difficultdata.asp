<%@ Language = VBScript %>
<!--#include file="base_gethandler.inc"-->
<%
'*****************************************************************************
'* @Title: Gethandler for basic combos, with paging functionality
'* @File: classicget.asp
'* @Author: EBA_DC\ngentleman
'* @Date: 7/4/2005 2:57:18 PM
'* @Purpose: 
'* @Notes: TODO: CustomerIcons need to not be tree-dependent
'*****************************************************************************

Randomize
' 
CustomerIcons = Array("image1.png", "image2.gif", "image3.jpg", "image4.jpg", "image5.png")
Domains = Array("google.com", "msn.ca", "nitobi.com", "yahoo.com", "xtremecurling.com")
Married = Array(true,false)

pageSize=100
ordinalStart = 0


dim sortColumn ' tells us which column to sort by'
sortColumn = "Id"
if len(request.querystring("SortColumn")) > 0 then
	sortColumn = cstr(request.querystring("SortColumn"))
end if

dim sortDirection ' tells us what the sort direction is (ASC, or DESC)'
dim reversedirection ' opposite of sort direction
sortDirection = cstr(request.QueryString("SortDirection"))
if cstr(sortDirection) = empty then
	sortDirection = "Asc"
end if
if (sortDirection = "Asc") then
	reversedirection ="Desc"
else 
	reversedirection ="Asc"
end if


if sortcolumn = "_xk"  then
	sortcolumn="Id"	
end if

' Define the connection to the database. In this case the database is an MDB.
accessdb = Server.mappath(".") & "\..\common\datasources\" & GetLanguage() & "\difficultdata.mdb"
strconn  = "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessdb & ";USER ID=;PASSWORD=;"

Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn

countRecordSet = objConn.execute("SELECT COUNT(*) FROM tblData")

recordCount = countRecordSet(0)
maxRecords = recordCount
if  (maxRecords > pageSize+ordinalStart) then 
	maxRecords = pageSize+ordinalStart
end if
pageSize = maxRecords - ordinalStart


' Open the datasource and get a page of data.



' We set up the getHandler and define the column 'id' as our Index
EBAGetHandler_ProcessRecords

' First we define how many columns we are sending in each record, and name each field.
EBAGetHandler_DefineField("Id")
EBAGetHandler_DefineField("Text")

pagesize = recordCount
newQuery = "SELECT * FROM tblData order by Id"

Response.write newQuery

if pagesize > 0 then

Set RecordSet = objConn.execute(NewQuery)
small=0
Do While (Not RecordSet.eof)
	EBAGetHandler_CreateNewRecord(RecordSet("Id"))
	EBAGetHandler_DefineRecordFieldValue "Id", RecordSet("Id")
	EBAGetHandler_DefineRecordFieldValue "Text", RecordSet("Text")
	EBAGetHandler_SaveRecord

	RecordSet.MoveNext
	small = small + 1
Loop

objConn.Close()
end if
EBAGetHandler_CompleteGet 
%>