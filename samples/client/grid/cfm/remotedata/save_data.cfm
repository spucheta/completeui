<!--- We include the Nitobi CF XML library 1.0 --->
<cfinclude template = "../../../../server/cfm/base_gethandler.cfm">

<!--- This file is used as a Save Handler for the Nitobi Grid control. When sends data,--->
<!--- to the server for saving, it calls this page with a form post containing UPDATE's, --->
<!--- INSERT's, and DELETE's. This page decodes that and turns them into SQL statements --->
<!--- for a database. --->

<!--- First we set up the get handler by calling EBASaveHandler_ProcessRecords() --->
<CFOUTPUT>
	#EBASaveHandler_ProcessRecords()#
</CFOUTPUT>

<!--- Loop through all the insert instructions sent by the grid --->

<!--- NOTE: Because in this example we actually perform the database INSERT in the allocaterecord.cfm --->
<!--- document, we only need to do an INSERT here. We do this to keep the primary key of the record --->
<!--- in sync with the grid. --->

<cfloop index = "InsertLoop" from = "1" to = #EBASaveHandler_ReturnInsertCount#>
	<cfquery datasource="NitobiTestDB" name="InsertRecord">
		UPDATE tblproducts SET 
			ProductName = '#EBASaveHandler_ReturnInsertField(InsertLoop, "ProductName")#', 
			ProductCategoryName = '#EBASaveHandler_ReturnInsertField(InsertLoop, "ProductCategoryName")#', 
			ProductSKU = '#EBASaveHandler_ReturnInsertField(InsertLoop, "ProductSKU")#', 
			ProductQuantityPerUnit = '#EBASaveHandler_ReturnInsertField(InsertLoop, "ProductQuantityPerUnit")#'
			WHERE ProductID LIKE '#EBASaveHandler_ReturnInsertField(InsertLoop, "EBA_PK")#'
	</cfquery>		
</cfloop>

<!--- Loop through all the update instructions sent by the grid --->
<cfloop index = "UpdateLoop" from = "1" to = #EBASaveHandler_ReturnUpdateCount#>
	<cfquery datasource="NitobiTestDB" name="UpdateRecord">
		UPDATE tblproducts SET 
			ProductName = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ProductName")#', 
			ProductCategoryName = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ProductCategoryName")#', 
			ProductSKU = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ProductSKU")#', 
			ProductQuantityPerUnit = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ProductQuantityPerUnit")#'
			WHERE ProductID LIKE '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "EBA_PK")#'
	</cfquery>	
</cfloop>

<!--- Loop through all the delete instructions sent by the grid --->
<cfloop index = "DeleteLoop" from = "1" to = #EBASaveHandler_ReturnDeleteCount#>
	<cfquery datasource="NitobiTestDB" name="DeleteRecord">
		DELETE FROM tblproducts WHERE ProductID LIKE '#EBASaveHandler_ReturnDeleteField(DeleteLoop, "EBA_PK")#'
	</cfquery>
</cfloop>

<!--- Now we call EBASaveHandler_CompleteSave to echo back all our xml to the browser. --->
<cfscript>
	EBASaveHandler_CompleteSave();
</cfscript>
