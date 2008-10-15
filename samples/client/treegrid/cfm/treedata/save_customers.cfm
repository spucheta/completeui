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
		INSERT INTO tblMDCustomers (
			CustomerName,
			ContactName, 
			ContactEmail, 
			ContactTitle, 
			PhoneNumber, 
			Address) VALUES (
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "CustomerName")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "ContactName")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "ContactEmail")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "ContactTitle")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "PhoneNumber")#',
			'#EBASaveHandler_ReturnInsertField(InsertLoop, "Address")#')
	</cfquery>		
</cfloop>

<!--- Loop through all the update instructions sent by the grid --->
<cfloop index = "UpdateLoop" from = "1" to = #EBASaveHandler_ReturnUpdateCount#>
	<cfquery datasource="NitobiTestDB" name="UpdateRecord">
		UPDATE tblMDCustomers SET 
			CustomerName = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "CustomerName")#', 
			ContactName = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ContactName")#', 
			ContactEmail = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ContactEmail")#', 
			ContactTitle = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "ContactTitle")#', 
			PhoneNumber = '#EBASaveHandler_ReturnUpdateField(UpdateLoop, "PhoneNumber")#' 
			WHERE CustomerID = #EBASaveHandler_ReturnUpdateField(UpdateLoop, "EBA_PK")#
	</cfquery>	
</cfloop>

<!--- Loop through all the delete instructions sent by the grid --->
<cfloop index = "DeleteLoop" from = "1" to = #EBASaveHandler_ReturnDeleteCount#>
	<cfquery datasource="NitobiTestDB" name="DeleteRecord">
		DELETE FROM tblMDCustomers WHERE CustomerID = #EBASaveHandler_ReturnDeleteField(DeleteLoop, "EBA_PK")#
	</cfquery>
</cfloop>

<!--- Now we call EBASaveHandler_CompleteSave to echo back all our xml to the browser. --->
<cfscript>
	EBASaveHandler_CompleteSave();
</cfscript>
