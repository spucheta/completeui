<!--- We include the Nitobi CF XML library 1.0 --->
<cfinclude template = "../../../../server/cfm/base_gethandler.cfm">


<!--- This file is used as a Get Handler for the Nitobi Grid control. When the grid is initialized,--->
<!--- the getHandler (this page) is called and expected to return a properly formatted--->
<!--- xml stream. We have provided all the necessary functionality to do this without actually--->
<!--- requiring you to construct XML. Simply interface with your datasource and use the provided--->
<!--- function calls to create the necessary output. The format of the XML is specific to the --->
<!--- Grid control.--->

<!--- GetHandlers must be able to output xml when called without any parameters. If paging is used,--->
<!--- they need to respond to the following parameters:--->

<!---     StartRecordIndex - Which record (ordinally) to start returning data on.--->
<!---     PageSize - How many records to return--->
<!---     SortColumn - Which is the currently sorted column (could be blank)--->
<!---     SortDirection - (Asc or Desc) The direction of sorting--->
<!---     TableId - The datatable being used (by default is _default)	--->

<!--- eg:--->

<!--- load_data.cfm?PageSize=15&StartRecordIndex=101&SortColumn=ContactEmail&SortDirection=Asc&TableId=_default --->


<!--- First we set up the get handler by calling EBAGetHandler_ProcessRecords() --->
<!--- Then we define our data fields and give them the same names they have in the database --->
<!--- (you dont have to give them the same names, but it makes it easier to keep track of them --->

<CFOUTPUT>

	#EBAGetHandler_ProcessRecords()#

	#EBAGetHandler_DefineField("ProductCategoryName")#
	#EBAGetHandler_DefineField("ProductCategoryID")#
</CFOUTPUT>

<!--- Note: MS Access (the type of database we use in this example) has no native --->
<!--- support for 'Paging' which is what we're doing here. So instead we loop through --->
<!--- all the records and just return the ones we want. --->

<cfif parameterexists(PageSize) is not "YES">
	<CFSET PageSize = 10>
</cfif>

<cfif parameterexists(StartRecordIndex) is not "YES">
	<CFSET StartRecordIndex = 0>
</cfif>

<cfif parameterexists(SortColumn) is not "YES" OR SortColumn is "">
	<!--- We set a default sort column incase none is defined --->
	<CFSET SortColumn = "ProductCategoryID">
</cfif>

<cfif parameterexists(SortDirection) is not "YES">
	<CFSET SortDirection = "">
</cfif>

<cfif parameterexists(TableId) is not "YES">
	<CFSET TableId = "">
</cfif>

<cfif parameterexists(SearchString) is not "YES">
	<CFSET SearchString = "">
</cfif>

<!--- Because MS Access doesn't support paging we need to get all the records leading up to the StartRecordIndex as well as the page we need --->

<cfparam name="TotalRecordsToRetrieve" default="10">
<cfset TotalRecordsToRetrieve = #PageSize# + #StartRecordIndex#>

<!--- Now we perform a query on our database. See the instructions for help setting this --->
<!--- sample database up. We have given it a datasource name of NitobiTestDB --->


<cfquery name="CustomerQuery" datasource="NitobiTestDB">

      SELECT * FROM tblproductcategories WHERE ProductCategoryName LIKE '%#SearchString#%'

</cfquery>

<!--- Now we output our records as we loop through the query. --->
<cfoutput query="CustomerQuery">

		#EBAGetHandler_CreateNewRecord(ProductCategoryID)#						
			#EBAGetHandler_DefineRecordFieldValue("ProductCategoryID", ProductCategoryID)#
			#EBAGetHandler_DefineRecordFieldValue("ProductCategoryName", ProductCategoryName)#	
		#EBAGetHandler_SaveRecord()#		

</cfoutput>

<!--- Now we call EBAGetHandler_CompleteGet to return all our xml to the browser. --->
<CFOUTPUT>

	#EBAGetHandler_CompleteGet()#

</CFOUTPUT>
