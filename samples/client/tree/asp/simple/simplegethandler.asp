<%@ Language=VBScript%>
<!--#include file="../../../../server/asp/base_gethandler.inc"-->
<%

	dim MyTableName
	MyTableName = "tblRegions"
	
	dim DefaultOrderByColumn
	DefaultOrderByColumn = "RegionName"
	
	dim FileandFolder
	FileandFolder = "..\..\..\..\..\server\common\datasources\en\worldcountryregions.mdb"
	
	' *******************************************************************
	' Now we get all the parameters we'll need to construct the query
	' *******************************************************************	

	dim TreeId ' Tells us the id of the tree '
	TreeId = Request.QueryString("treeId")

	dim NodeId ' Tells us the id of the node requesting its children (this will be blank if the tree is requesting its children '
	NodeId = "0"
	if len(Request.QueryString("id")) > 0 then
		NodeId = cdbl(Request.QueryString("id"))
	end if


	' Set up the database connection and get the RecordSet'
	dim objConn
	Set objConn = Server.CreateObject("ADODB.Connection")
	objConn.open "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=" & server.mappath(".") & FileandFolder & ";USER ID=;PASSWORD=;"

	' *******************************************************************
	' This code is just for MS Access Databases because it doesn't support proper paging,
	' we need to know how many records are in the table
	' *******************************************************************'	

	dim RecordSet
	Set RecordSet = objConn.execute("SELECT * FROM " & MyTableName & " WHERE RegionOwner = " & NodeId & " ORDER BY " & DefaultOrderByColumn)
	
	' *******************************************************************
	' Lets Set up the Output
	' *******************************************************************

	EBAGetHandler_ProcessRecords   ' We set up the getHandler and define the column CustomerID as our Index

	' First we define how many columns we are sending in each record, and name each field.
	' We will do this by using the EBAGetHandler_DefineField function. We will name each
	' field of data after its column name in the database.
	
	EBAGetHandler_DefineField("id")
	EBAGetHandler_DefineField("label")	
	EBAGetHandler_DefineField("nodetype")
	EBAGetHandler_DefineField("haschildren")
		
	
	' *******************************************************************
	' Lets loop through our data and send it to the grid
	' *******************************************************************

	do while not RecordSet.eof

		EBAGetHandler_CreateNewRecord(RecordSet("RegionID"))
			EBAGetHandler_DefineRecordFieldValue "id", RecordSet("RegionID")
			EBAGetHandler_DefineRecordFieldValue "label", RecordSet("RegionName")
			dim IsNode
			Set IsNode = objConn.execute("SELECT COUNT(1) FROM " & MyTableName & " WHERE RegionOwner = " & RecordSet("RegionId"))
			dim NumChildren
			NumChildren = IsNode(0)
			if NumChildren > 0 then
				EBAGetHandler_DefineRecordFieldValue "nodetype", "node"
				EBAGetHandler_DefineRecordFieldValue "haschildren", "true"
			else
				EBAGetHandler_DefineRecordFieldValue "nodetype", "leaf"
				EBAGetHandler_DefineRecordFieldValue "haschildren", "false"
			end if
						
		EBAGetHandler_SaveRecord

		RecordSet.MoveNext
	loop
	RecordSet.close
	objconn.close
	EBAGetHandler_CompleteGet


%>