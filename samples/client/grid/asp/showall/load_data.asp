<%@ Language=VBScript%>
<!--#include file="../../../../server/asp/base_gethandler.inc"-->
<%

	' This file is used as a Get Handler for the Nitobi Grid control. When the grid is initialized,
	' the getHandler (this page) is called and expected to return a properly formatted
	' xml stream. We have provided all the necessary functionality to do this without actually
	' requiring you to construct XML. Simply interface with your datasource and use the provided
	' function calls to create the necessary output. The format of the XML is specific to the EBA
	' Grid control.

	' GetHandlers must be able to output xml when called without any parameters. If paging is used,
	' they need to respond to the following parameters:

    '     StartRecordIndex - Which record (ordinally) to start returning data on.
    '     PageSize - How many records to return
    '     SortColumn - Which is the currently sorted column (could be blank)
    '     SortDirection - (Asc or Desc) The direction of sorting
    '     TableId - The datatable being used (by default is _default)	

	' eg:

	' load_data.asp?SortColumn=ContactEmail&SortDirection=Asc&TableId=_default

	' *******************************************************************
	' Lets define the database table we're working with
	' *******************************************************************
	
	dim MyTableName
	MyTableName = "tblContacts3k"
	
	dim DefaultOrderByColumn
	DefaultOrderByColumn = "ContactID"
	
	' *******************************************************************
	' Now we get all the parameters we'll need to construct the query
	' *******************************************************************	

	dim SortColumn ' tells us which column to sort by'
	SortColumn = DefaultOrderByColumn	
	if len(request("SortColumn")) > 0 then
		SortColumn = cstr(request("SortColumn")) & " "
	end if
	
	dim SortDirection ' tells us which direction to sort by'

	if len(request("SortDirection")) > 0 then
		SortDirection = ucase(cstr(request("SortDirection")))
	end if	

	if SortDirection = empty then
		SortDirection = "ASC"
	end if


	' Set up the database connection and get the RecordSet'
	dim objConn
	Set objConn = Server.CreateObject("ADODB.Connection")
	objConn.open "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & server.mappath(".") & "..\..\..\..\..\server\common\datasources\en\contactsflatfile3k.mdb" & ";USER ID=;PASSWORD=;"

	' *******************************************************************
	' This code is just for MS Access Databases because it doesn't support proper paging,
	' we need to know how many records are in the table
	' *******************************************************************'	

	dim RecordSet
	Set RecordSet = objConn.execute("SELECT TOP 50 * FROM " & MyTableName & " ORDER BY " & SortColumn & " " & SortDirection)
	
	' *******************************************************************
	' Lets Set up the Output
	' *******************************************************************

	EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column CustomerID as our Index

	' First we define how many columns we are sending in each record, and name each field.
	' We will do this by using the EBAGetHandler_DefineField function. We will name each
	' field of data after its column name in the database.

	EBAGetHandler_DefineField("ContactName") 'column index 1
	EBAGetHandler_DefineField("ContactEmail") 'column index 2
	EBAGetHandler_DefineField("JobTitle") 'column index 3
	EBAGetHandler_DefineField("CompanyName") 'column index 4
	EBAGetHandler_DefineField("PhoneNumber") 'column index 5
	EBAGetHandler_DefineField("Address") 'column index 6	

	' *******************************************************************
	' Lets loop through our data and send it to the grid
	' *******************************************************************

		do while not RecordSet.eof
	
			EBAGetHandler_CreateNewRecord(RecordSet("ContactID"))
				EBAGetHandler_DefineRecordFieldValue "ContactName", RecordSet("ContactName")
				EBAGetHandler_DefineRecordFieldValue "ContactEmail", RecordSet("ContactEmail")
				EBAGetHandler_DefineRecordFieldValue "JobTitle", RecordSet("JobTitle")
				EBAGetHandler_DefineRecordFieldValue "CompanyName", RecordSet("CompanyName")
				EBAGetHandler_DefineRecordFieldValue "PhoneNumber", RecordSet("PhoneNumber")
				EBAGetHandler_DefineRecordFieldValue "Address", RecordSet("Address")
			EBAGetHandler_SaveRecord
	
			RecordSet.MoveNext
		loop
		RecordSet.close

	objconn.close
	EBAGetHandler_CompleteGet

%>

