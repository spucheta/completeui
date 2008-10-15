<%@ Language=VBScript%>
<!--#include file="../../../Test/Lib/Asp/base_gethandler.inc"-->
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

	' load_data.asp?SearchString=myString

	' *******************************************************************
	' Lets define the database table we're working with
	' *******************************************************************
	
	dim MyTableName
	MyTableName = "tblproductcategories"
	
	dim DefaultOrderByColumn
	DefaultOrderByColumn = "ProductCategoryID"
	
	dim FileandFolder
	FileandFolder = "\..\common\datasources\" & GetLanguage() & "\generalproducts.mdb"
	
	
	' *******************************************************************
	' Now we get all the parameters we'll need to construct the query
	' *******************************************************************	

	dim SearchString ' The string we are using to narrow the results from the handler '
	SearchString = cstr(request.querystring("SearchString"))

	' Simple SQL injection prevention '
	SearchString = replace(SearchString, ";", "")
	SearchString = replace(SearchString, "'", "''")

	' Set up the database connection and get the RecordSet'
	dim objConn
	Set objConn = Server.CreateObject("ADODB.Connection")
	objConn.open "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & server.mappath(".") & FileandFolder & ";USER ID=;PASSWORD=;"

	' *******************************************************************
	' This code is just for MS Access Databases because it doesn't support proper paging,
	' we need to know how many records are in the table
	' *******************************************************************'	


	' Access doesn't support paging so we must execute a triple-nested query where the top n records are flipped and clipped
	dim RecordSet
	Set RecordSet = objConn.execute("SELECT * FROM " & MyTableName & " WHERE ProductCategoryName LIKE '"&SearchString&"%'")

	' *******************************************************************
	' Lets Set up the Output
	' *******************************************************************

	EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column CustomerID as our Index

	' First we define how many columns we are sending in each record, and name each field.
	' We will do this by using the EBAGetHandler_DefineField function. We will name each
	' field of data after its column name in the database.
	
	EBAGetHandler_DefineField("ProductCategoryName")
	EBAGetHandler_DefineField("ProductCategoryID")	
	
	' *******************************************************************
	' Lets loop through our data and send it to the grid
	' *******************************************************************

	do while not RecordSet.eof
	
		myCategoryID = RecordSet("ProductCategoryID")

		EBAGetHandler_CreateNewRecord(myCategoryID)
			EBAGetHandler_DefineRecordFieldValue "ProductCategoryID", myCategoryID
			EBAGetHandler_DefineRecordFieldValue "ProductCategoryName", RecordSet("ProductCategoryName")			
		EBAGetHandler_SaveRecord

		RecordSet.MoveNext
	loop

	EBAGetHandler_CompleteGet


%>

