<!--- We include the Nitobi CF XML library 1.0 --->
<cfinclude template = "../../../../test/lib/cfm/base_gethandler.cfm">

<!--- First we set up the get handler by calling EBAGetHandler_ProcessRecords() --->
<!--- Then we define our data fields and give them the same names they have in the database --->
<!--- (you dont have to give them the same names, but it makes it easier to keep track of them --->

<CFOUTPUT>

	#EBAGetHandler_ProcessRecords()#
	
	#EBAGetHandler_DefineField("CountryId")#
	#EBAGetHandler_DefineField("Info")#

</CFOUTPUT>

<!--- Note: MS Access (the type of database we use in this example) has no native --->
<!--- support for 'Paging' which is what we're doing here. So instead we loop through --->
<!--- all the records and just return the ones we want. --->

<cfif parameterexists(PageSize) is not "YES">
<CFSET PageSize = 10>
</cfif>

<cfif parameterexists(SearchSubString) is not "YES">
<CFSET SearchSubString = "">
</cfif>

<cfif parameterexists(LastString) is not "YES">
<CFSET LastString = "">
</cfif>

<cfif parameterexists(Table) is not "YES">
<CFSET Table = "">
</cfif>

<cfif parameterexists(WhereClause) is not "YES">
<CFSET WhereClause = "">
<cfelse>
	<CFIF WhereClause IS NOT "false">
		<CFSET WhereClause = " AND " & WhereClause>
	<cfelse>
		<CFSET WhereClause = "">
	</CFIF>
</cfif>

<!--- Now we perform a query on our database. See the instructions for help setting this --->
<!--- sample database up. We have given it a datasource name of NitobiTestDB --->

<cfquery name="CountryProvinceQuery" datasource="NitobiTestDB">

      SELECT * FROM #Table# WHERE Info > '#LastString#' #WhereClause#

</cfquery>

<!--- Now we output our records as we loop through the query. --->
<cfoutput query="CountryProvinceQuery">

		#EBAGetHandler_CreateNewRecord(CountryId)#
			#EBAGetHandler_DefineRecordFieldValue("CountryId", CountryId)#
			#EBAGetHandler_DefineRecordFieldValue("Info", Info)#		
		#EBAGetHandler_SaveRecord()#
	
</cfoutput>

<!--- Now we call EBAGetHandler_CompleteGet to return all our xml to the browser. --->
<CFOUTPUT>

	#EBAGetHandler_CompleteGet()#

</CFOUTPUT>
