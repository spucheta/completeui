<!--- This file will get the next available key in the table --->
<cfparam name="myUniqueVar" default="#GetTickCount()#">
<cfparam name="myResultKey" default="0">

<cfquery datasource="NitobiTestDB" name="InsertRecord">
	INSERT INTO tblproducts (
		ProductName) VALUES (
		'#myUniqueVar#')
</cfquery>		

<cfquery name="GetIDForRecord" datasource="NitobiTestDB">

	  SELECT ProductID FROM tblproducts WHERE ProductName LIKE '#myUniqueVar#'	
	  
</cfquery>

<cfoutput query="GetIDForRecord">
		<cfset myResultKey = ProductID>
</cfoutput>		

<cfscript>getPageContext().getOut().clearBuffer();</cfscript><cfoutput>#myResultKey#</cfoutput>