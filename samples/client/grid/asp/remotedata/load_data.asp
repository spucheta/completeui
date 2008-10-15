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

	' load_data.asp?PageSize=15&StartRecordIndex=101&SortColumn=ContactEmail&SortDirection=Asc&TableId=_default

	' *******************************************************************
	' Lets define the database table we're working with
	' *******************************************************************
	
	dim MyTableName
	MyTableName = "tblproducts"
	
	dim DefaultOrderByColumn
	DefaultOrderByColumn = "ProductID"
	
	dim FileandFolder
	FileandFolder = "..\..\..\..\..\server\common\datasources\en\GeneralProducts.mdb"
	
	' *******************************************************************
	' Now we get all the parameters we'll need to construct the query
	' *******************************************************************	

	dim PageSize ' Tells us how many records to return '
	PageSize = cdbl(request.querystring("PageSize"))

	dim StartRecordIndex ' tells us where in the table to start returning records from'
	StartRecordIndex = cdbl(request.querystring("StartRecordIndex"))

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
	if SortDirection = "ASC" then
		ReverseDirection = "DESC"
	else
		ReverseDirection = "ASC"	
	end if



	' Set up the database connection and get the RecordSet'
	dim objConn
	Set objConn = Server.CreateObject("ADODB.Connection")
	objConn.open "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & server.mappath(".") & FileandFolder & ";USER ID=;PASSWORD=;"

	' *******************************************************************
	' This code is just for MS Access Databases because it doesn't support proper paging,
	' we need to know how many records are in the table
	' *******************************************************************'	

	countRecordSet = objConn.execute("SELECT COUNT(*) FROM " & MyTableName)
	dim MaxRecords
	MaxRecords = countRecordSet(0)
	if  (MaxRecords > PageSize+StartRecordIndex) then 
		MaxRecords = PageSize+StartRecordIndex
	end if
	PageSize = MaxRecords - StartRecordIndex

	if MaxRecords > StartRecordIndex then
		' Access doesn't support paging so we must execute a triple-nested query where the top n records are flipped and clipped
		dim RecordSet
		Set RecordSet = objConn.execute("SELECT * FROM (SELECT TOP " & PageSize & " * FROM (SELECT TOP " & MaxRecords &  "  * FROM " & MyTableName & " ORDER BY " & SortColumn & " " & SortDirection & ") ORDER BY " & SortColumn & " " & ReverseDirection & ") ORDER BY " & SortColumn & " " & SortDirection)
	end if
	' *******************************************************************
	' Lets Set up the Output
	' *******************************************************************

	EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column CustomerID as our Index

	' First we define how many columns we are sending in each record, and name each field.
	' We will do this by using the EBAGetHandler_DefineField function. We will name each
	' field of data after its column name in the database.
	
	EBAGetHandler_DefineField("ProductName")
	EBAGetHandler_DefineField("ProductCategoryName")	
	EBAGetHandler_DefineField("ProductSKU")	
	EBAGetHandler_DefineField("ProductPrice")	
	EBAGetHandler_DefineField("ProductQuantityPerUnit") 

	
	' *******************************************************************
	' Lets loop through our data and send it to the grid
	' *******************************************************************
	if MaxRecords > StartRecordIndex then
		do while not RecordSet.eof
	
			EBAGetHandler_CreateNewRecord(RecordSet("ProductID"))
				EBAGetHandler_DefineRecordFieldValue "ProductName", RecordSet("ProductName")
				EBAGetHandler_DefineRecordFieldValue "ProductCategoryName", RecordSet("ProductCategoryName")
				EBAGetHandler_DefineRecordFieldValue "ProductSKU", RecordSet("ProductSKU")
				EBAGetHandler_DefineRecordFieldValue "ProductPrice", RecordSet("ProductPrice")
				EBAGetHandler_DefineRecordFieldValue "ProductQuantityPerUnit", RecordSet("ProductQuantityPerUnit")
			EBAGetHandler_SaveRecord
	
			RecordSet.MoveNext
		loop
	
		RecordSet.close
	end if
	
	objConn.close
	
	EBAGetHandler_CompleteGet


%>

