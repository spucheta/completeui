<%@ Language = VBScript %>
<!--#include file="../../../../test/lib/asp/base_gethandler.inc"-->
<%
' This file is used as a datasource for the combo.  This file transforms
' the dataset taken from the mdb into compressed XML: the compressed format is supplied by Nitobi.
' Use the nitobi.xml.inc file to convert between ado and compressed xml.

Randomize

' This array is just for the demo. It contains a random list of icons.
CustomerIcons = Array("scustomerimage.gif", "scustomerimage2.gif", "scustomerimage3.gif", "scustomerimage4.gif", "scustomerimage5.gif")

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
LastString = Request.Querystring("LastString")

' Define the connection to the database. In this case the database is an MDB.
accessdb = Server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\customerdb.mdb"
strconn = "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessdb & ";USER ID=;PASSWORD=;"

' Open the datasource and get a page of data.
' This can be done in a variety of ways, and is dependant
' on the functionality of your database server. The page retrieved is based
' on what the user is currently searching for.

' NOTE: We have provided template SELECT statements for a variety of database servers
' including MySQL, DB2, Oracle, Access, and SQL Server
' Look for a full list here: http://developer.ebusiness-apps.com/ebakb/ebakb.asp?artid=94&catid=18

NewQuery = "SELECT TOP " & PageSize & " * FROM tblCustomers WHERE ContactName > '" & LastString & "' AND ContactName LIKE '" & SearchSubstring & "%' ORDER BY ContactName"
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
EBAGetHandler_DefineField("ContactImage")

' *******************************************************************
' Lets loop through our data and send it to the combo
' *******************************************************************

Do While (Not RecordSet.eof)

	' Now we only want to grab a single page of record starting at the startingrecord

	EBAGetHandler_CreateNewRecord(RecordSet("ContactID"))

	EBAGetHandler_DefineRecordFieldValue "ContactName", RecordSet("ContactName")
	EBAGetHandler_DefineRecordFieldValue "ContactEmail", RecordSet("ContactEmail")
	EBAGetHandler_DefineRecordFieldValue "JobTitle", RecordSet("JobTitle")
	EBAGetHandler_DefineRecordFieldValue "CompanyName", RecordSet("CompanyName")
	EBAGetHandler_DefineRecordFieldValue "ContactImage", CustomerIcons(Round(Rnd()*4))

	EBAGetHandler_SaveRecord

	RecordSet.MoveNext
Loop

objConn.Close()
EBAGetHandler_CompleteGet
%>