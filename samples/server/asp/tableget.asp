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

dim sortColumn ' tells us which column to sort by'
sortColumn = "ContactID"
if len(request.querystring("SortColumn")) > 0 then
	sortColumn = cstr(request.querystring("SortColumn"))
end if

dim sortDirection ' tells us what the sort direction is (ASC, or DESC)'
dim reversedirection ' opposite of sort direction
sortDirection = cstr(request.QueryString("SortDirection"))
if cstr(sortDirection) = empty then
	sortDirection = "Asc"
end if

if sortcolumn = "_xk"  then
	sortcolumn="ContactID"	
end if

' Define the connection to the database. In this case the database is an MDB.
accessdb = Server.mappath(".") & "\..\common\datasources\" & GetLanguage() & "\peopledb.mdb"
strconn  = "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessdb & ";USER ID=;PASSWORD=;"

Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn

countRecordSet = objConn.execute("SELECT COUNT(*) FROM tblCustomers")

' Open the datasource and get a page of data.

' We set up the getHandler and define the column 'id' as our Index
EBAGetHandler_ProcessRecords

' First we define how many columns we are sending in each record, and name each field.
EBAGetHandler_DefineField("ContactName")
EBAGetHandler_DefineField("ContactEmail")
EBAGetHandler_DefineField("JobTitle")
EBAGetHandler_DefineField("CompanyName")
EBAGetHandler_DefineField("ContactImage")
EBAGetHandler_DefineField("Domain")
EBAGetHandler_DefineField("Gender")
EBAGetHandler_DefineField("Birthday")
EBAGetHandler_DefineField("Married")
EBAGetHandler_DefineField("Url")

newQuery = "SELECT * FROM tblCustomers order by " & sortcolumn & " " & sortdirection

Set RecordSet = objConn.execute(NewQuery)

Do While (Not RecordSet.eof)
	EBAGetHandler_CreateNewRecord(RecordSet("ContactID"))
	EBAGetHandler_DefineRecordFieldValue "ContactName", RecordSet("ContactName")
	EBAGetHandler_DefineRecordFieldValue "ContactEmail", RecordSet("ContactEmail")
	EBAGetHandler_DefineRecordFieldValue "JobTitle", RecordSet("JobTitle")
	EBAGetHandler_DefineRecordFieldValue "CompanyName", RecordSet("CompanyName")
	EBAGetHandler_DefineRecordFieldValue "ContactImage", "../../../lib/Common/img/" & CustomerIcons(Round(Rnd()*4))
	EBAGetHandler_DefineRecordFieldValue "Domain", Domains(Round(Rnd()*4))
	EBAGetHandler_DefineRecordFieldValue "Gender", RecordSet("Gender")
	EBAGetHandler_DefineRecordFieldValue "Birthday", RecordSet("Birthday")
	EBAGetHandler_DefineRecordFieldValue "Married", Married(Round(Rnd()*1))
	EBAGetHandler_DefineRecordFieldValue "Url", "http://" & Domains(Round(Rnd()*4))
	EBAGetHandler_SaveRecord

	RecordSet.MoveNext
Loop

objConn.Close()

EBAGetHandler_CompleteGet 
%>