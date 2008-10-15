<%@ Language=VBScript %>
<!--#include file="base_gethandler.inc"-->
<%
dim objConn
dim accessdb

dim strconn

accessdb = Server.mappath(".") & "\..\common\datasources\" & GetLanguage() & "\peopledb.mdb"
strconn="PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessDB & ";USER ID=;PASSWORD=;"
Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn



dim MyQuery
dim uid
dim myNewRecordID

' Using the current date and time gives us a unique string to search for
uid = cstr(now())


MyQuery = "INSERT INTO tblCustomers (ContactName) VALUES ('" & uid & "');"
' Now we execute this query
objConn.execute(MyQuery)

MyQuery = "SELECT ContactID, ContactName FROM tblCustomers WHERE ContactName LIKE '" & uid & "'"

dim RecordSet
Set RecordSet = objConn.execute(MyQuery)

do while not RecordSet.eof

	myNewRecordID = RecordSet("ContactID")
	RecordSet.MoveNext
loop

RecordSet.close

objConn.close

Response.Write(myNewRecordID)

%>
