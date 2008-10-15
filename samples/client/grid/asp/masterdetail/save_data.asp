<%@ Language=VBScript %>
<!--#include file="../../../../server/asp/base_gethandler.inc"-->

<%
dim objConn
dim accessdb

dim strconn

accessdb=server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\contactsflatfile3k.mdb"
strconn="PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & accessDB & ";USER ID=;PASSWORD=;"
Set objConn = Server.CreateObject("ADODB.Connection")
objConn.open strconn


dim CurrentRecord
dim MyQuery

' ********************************************************** '
' Begin by processing our inserts
' ********************************************************** '

EBASaveHandler_ProcessRecords


if EBASaveHandler_ReturnInsertCount > 0 then
	' Yes there are INSERTs to perform...

	for CurrentRecord = 0 to EBASaveHandler_ReturnInsertCount-1
	
		' NOTE: Because in this example we actually perform the database INSERT in the allocaterecord.asp
		' document, we only need to do an INSERT here. We do this to keep the primary key of the record
		' in sync with the grid.

		MyQuery = "UPDATE tblContacts3k SET "

		MyQuery = MyQuery & "ContactName = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"ContactName") & "', "
		MyQuery = MyQuery & "ContactEmail = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"ContactEmail") & "', "
		MyQuery = MyQuery & "JobTitle = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"JobTitle") & "', "
		MyQuery = MyQuery & "CompanyName = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"CompanyName") & "', "
		MyQuery = MyQuery & "PhoneNumber = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"PhoneNumber") & "',"
		MyQuery = MyQuery & "Address = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"Address") & "' "

		MyQuery = MyQuery & " WHERE ContactID = '" & EBASaveHandler_ReturnInsertField(CurrentRecord,"PK") & "';"

		' Now we execute this query
		objConn.execute(MyQuery)

	next
end if


' ********************************************************** '
' Continue by processing our updates
' ********************************************************** '

if EBASaveHandler_ReturnUpdateCount > 0 then
	' Yes there are UPDATEs to perform...

	for CurrentRecord = 0 to EBASaveHandler_ReturnUpdateCount-1

		MyQuery = "UPDATE tblContacts3k SET "

		MyQuery = MyQuery & "ContactName = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"ContactName") & "', "
		MyQuery = MyQuery & "ContactEmail = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"ContactEmail") & "', "
		MyQuery = MyQuery & "JobTitle = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"JobTitle") & "', "
		MyQuery = MyQuery & "CompanyName = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"CompanyName") & "', "
		MyQuery = MyQuery & "PhoneNumber = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"PhoneNumber") & "',"
		MyQuery = MyQuery & "Address = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"Address") & "' "

		MyQuery = MyQuery & " WHERE ContactID = '" & EBASaveHandler_ReturnUpdateField(CurrentRecord,"PK") & "';"
		' PK is always our Primary Key for the row

		' Now we execute this query
		objConn.execute(MyQuery)

	next
end if




' ********************************************************** '
' Finish by processing our deletes
' ********************************************************** '

if EBASaveHandler_ReturnDeleteCount > 0 then
	' Yes there are DELETEs to perform...

	for CurrentRecord = 0 to EBASaveHandler_ReturnDeleteCount-1

		MyQuery = "DELETE FROM tblContacts3k WHERE ContactID = '" & EBASaveHandler_ReturnDeleteField(CurrentRecord) & "'"

		' Now we execute this query
		objConn.execute(MyQuery)

	next
end if

EBASaveHandler_CompleteSave

%>
