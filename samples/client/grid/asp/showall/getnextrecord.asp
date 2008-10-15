<%@ Language=VBScript %>

<%
dim objConn
dim accessdb

dim strconn

accessdb=server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\contactsflatfile3k.mdb"
strconn="PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessDB & ";USER ID=;PASSWORD=;"
Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn



dim MyQuery
dim uid
dim myNewRecordID

' Using the current date and time gives us a unique string to search for
uid = cstr(now())


MyQuery = "INSERT INTO tblContacts3k (ContactName) VALUES ('" & uid & "');"
' Now we execute this query
objConn.execute(MyQuery)

MyQuery = "SELECT ContactID, ContactName FROM tblContacts3k WHERE ContactName LIKE '" & uid & "'"

dim RecordSet
Set RecordSet = objConn.execute(MyQuery)

do while not RecordSet.eof

	myNewRecordID = cdbl(RecordSet("ContactID"))
	RecordSet.MoveNext
loop

RecordSet.close

MyQuery = "DELETE FROM tblContacts3k WHERE ContactName LIKE '" & uid & "'"
' Now we delete the row this query
objConn.execute(MyQuery)

objConn.close

Response.Write((myNewRecordID+1))

%>
