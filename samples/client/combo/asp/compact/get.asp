<%@ Language = VBScript %>
<!--#include file="../../../../test/lib/asp/base_gethandler.inc"-->
<%
' This file is used as a datasource for the combo.  This file transforms
' the dataset taken from the mdb into compressed XML: the compressed format is supplied by Nitobi.
' Use the nitobi.xml.inc file to convert between ado and compressed xml.

' Retrieve the arguments given to us by the the Combo.
PageSize = Request.QueryString("PageSize")

If (PageSize = "") Then
	PageSize = "15"
End If

StartingRecordIndex = Request.QueryString("StartingRecordIndex")

If (StartingRecordIndex = "") Then
	StartingRecordIndex = "0"
End If

SearchSubstring = Request.QueryString("SearchSubstring")

' Define the connection to the database. In this case the database is an MDB.
accessdb = Server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\customerdb.mdb"
strconn = "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessdb & ";USER ID=;PASSWORD=;"

' Open the datasource and get a page of data.
' This can be done in a variety of ways, and is dependant
' on the functionality of your database server. The page retrieved is based
' on what the user is currently searching for.
NewQuery = "SELECT TOP " & PageSize & " * FROM tblCustomers WHERE ContactName LIKE '" & SearchSubstring & "%'"
Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn
Set RecordSet = objConn.execute(NewQuery)

' *******************************************************************
' Lets Set up the Output
' *******************************************************************

EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column 'id' as our Index

' First we define how many columns we are sending in each record, and name each field.

' We will do this by using the EBAGetHandler_DefineField function. We will name each
' field of data after its column name in the database.

EBAGetHandler_DefineField("ContactName")
EBAGetHandler_DefineField("ContactEmail")
EBAGetHandler_DefineField("JobTitle")
EBAGetHandler_DefineField("CompanyName")

' *******************************************************************
' Lets loop through our data and send it to the combo
' *******************************************************************

Do While (Not RecordSet.eof)

	EBAGetHandler_CreateNewRecord(RecordSet("ContactID"))
	EBAGetHandler_DefineRecordFieldValue "ContactName", RecordSet("ContactName")
	EBAGetHandler_DefineRecordFieldValue "ContactEmail", RecordSet("ContactEmail")
	EBAGetHandler_DefineRecordFieldValue "JobTitle", RecordSet("JobTitle")
	EBAGetHandler_DefineRecordFieldValue "CompanyName", RecordSet("CompanyName")
	EBAGetHandler_SaveRecord

	RecordSet.MoveNext
Loop

objConn.Close()
EBAGetHandler_CompleteGet
%>