<%@ Language=VBScript %>

<%
dim objConn
dim accessdb

dim strconn

accessdb=server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\generalproducts.mdb"
strconn="PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessDB & ";USER ID=;PASSWORD=;"
Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn



dim MyQuery
dim uid
dim myNewRecordID

' Using the current date and time gives us a unique string to search for
uid = cstr(now())


MyQuery = "INSERT INTO tblproducts (ProductName) VALUES ('" & uid & "');"
' Now we execute this query
objConn.execute(MyQuery)

MyQuery = "SELECT ProductID, ProductName FROM tblproducts WHERE ProductName LIKE '" & uid & "'"

dim RecordSet
Set RecordSet = objConn.execute(MyQuery)

do while not RecordSet.eof

	myNewRecordID = cdbl(RecordSet("ProductID"))
	RecordSet.MoveNext
loop

RecordSet.close


objConn.close

Response.Write((myNewRecordID))

%>
