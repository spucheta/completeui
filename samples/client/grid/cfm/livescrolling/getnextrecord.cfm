<!--- This file will get the next available key in the table --->
	<cfparam name="myUniqueVar" default="#GetTickCount()#">
	<cfparam name="myResultKey" default="0">

	<cfquery datasource="NitobiTestDB" name="InsertRecord">
		INSERT INTO tblContacts3k (
			ContactName) VALUES (
			'#myUniqueVar#')
	</cfquery>		

	<cfquery name="GetIDForRecord" datasource="NitobiTestDB">
	
		  SELECT ContactID FROM tblContacts3k WHERE ContactName LIKE '#myUniqueVar#'	
		  
	</cfquery>
	
	<cfoutput query="GetIDForRecord">
			<cfset myResultKey = ContactID + 1>
	</cfoutput>
	<cfquery datasource="NitobiTestDB" name="DeletetheRecord">
		DELETE FROM tblContacts3k WHERE ContactName LIKE '#myUniqueVar#'
	</cfquery>		
	
	<cfscript>getPageContext().getOut().clearBuffer();</cfscript><cfoutput>#myResultKey#</cfoutput>