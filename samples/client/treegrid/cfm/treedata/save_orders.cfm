<!--- We include the Nitobi CF XML library 1.0 --->
<cfinclude template = "nitobi.xml.cfm">

<!--- This file is used as a Save Handler for the Nitobi Grid control. When sends data,--->
<!--- to the server for saving, it calls this page with a form post containing UPDATE's, --->
<!--- INSERT's, and DELETE's. This page decodes that and turns them into SQL statements --->
<!--- for a database. --->

<!--- First we set up the get handler by calling EBASaveHandler_ProcessRecords() --->
<CFOUTPUT>
	#EBASaveHandler_ProcessRecords()#
</CFOUTPUT>

<!--- Loop through all the insert instructions sent by the grid --->
<cfloop index = "InsertLoop" from = "1" to = #EBASaveHandler_ReturnInsertCount#>
	<cfquery datasource="NitobiTestDB" name="InsertRecord">
		INSERT INTO tblMDOrders (
			CustomerID, 
			ProductName,
			OrderDate, 
			ShippedDate) VALUES (
			'#EBASaveHandler_ReturnForeignKeyValue(InsertLoop)#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "ProductName")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "OrderDate")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "ShippedDate")#')
	</cfquery>		
</cfloop>

<!--- Loop through all the update instructions sent by the grid --->
<cfloop index = "UpdateLoop" from = "1" to = #EBASaveHandler_ReturnUpdateCount#>
	<cfquery datasource="NitobiTestDB" name="UpdateRecord">
		UPDATE tblMDOrders SET 
			ProductName = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ProductName")#', 
			OrderDate = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "OrderDate")#', 
			ShippedDate = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ShippedDate")#'
			WHERE OrderID = #EBASaveHandler_ReturnUpdateField(UpdateLoop, "EBA_PK")#
	</cfquery>
	<cfscript>
		WriteOutput(EBASaveHandler_ReturnUpdateField(UpdateLoop, "EBA_PK"));
	</cfscript>
</cfloop>

<!--- Loop through all the delete instructions sent by the grid --->
<cfloop index = "DeleteLoop" from = "1" to = #EBASaveHandler_ReturnDeleteCount#>
	<cfquery datasource="NitobiTestDB" name="DeleteRecord">
		DELETE FROM tblMDOrders WHERE OrderID = #EBASaveHandler_ReturnDeleteField(DeleteLoop, "EBA_PK")#
	</cfquery>
</cfloop>

<!--- Now we call EBASaveHandler_CompleteSave to echo back all our xml to the browser. --->
<cfscript>
	
</cfscript>
