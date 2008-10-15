<?php
header('Content-type: text/xml');
require("../../../../server/php/base_gethandler.php");

/*   This file is used as a Save Handler for the Grid control. When the user clicks
	 the save button in default.php a datagram is sent to this script.
	 The script in turn looks at each update in the datagram and processes them accordingly.

	 We have provided all the necessary functionality to extract any of the update instructions.

     This block of code is ADO connection code used only for demonstration purposes
     objConn is an ADO object we use here for demonstration purposes.
 */

$saveHandler = new EBASaveHandler();
$saveHandler->ProcessRecords();

// Make a MySQL Connection
mysql_connect() or die(mysql_error());
mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

// ********************************************************** '
// Begin by processing our inserts
// ********************************************************** '
$insertCount = $saveHandler->ReturnInsertCount();
if ($insertCount > 0)
{
	// Yes there are INSERTs to perform...
	for ($currentRecord = 0; $currentRecord < $insertCount; $currentRecord++)
	{
		$myQuery  = "INSERT INTO tblcontacts3k (ContactID, ContactName, ContactEmail, JobTitle, CompanyName, PhoneNumber, Address) VALUES (" .
					"'" . $saveHandler->ReturnInsertField($currentRecord) . "'," .
					"'" . $saveHandler->ReturnInsertField($currentRecord, "ContactName")  . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"ContactEmail") . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"JobTitle") . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"CompanyName") . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"PhoneNumber") . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"Address") . "' " .
					"); ";

		// Now we execute this query
		mysql_query($myQuery);


	}
}

// ********************************************************** '
// Continue by processing our updates
// ********************************************************** '
$updateCount = $saveHandler->ReturnUpdateCount();
if ($updateCount > 0)
{
	// Yes there are UPDATEs to perform...
	for ($currentRecord = 0; $currentRecord < $updateCount; $currentRecord++)
	{
		$myQuery = "UPDATE tblContacts3k SET ".
			"ContactName 		= '" . $saveHandler->ReturnUpdateField($currentRecord,"ContactName")	. "', ".
			"ContactEmail 		= '" . $saveHandler->ReturnUpdateField($currentRecord,"ContactEmail")	. "', ".
			"JobTitle 			= '" . $saveHandler->ReturnUpdateField($currentRecord,"JobTitle") 		. "', ".
			"CompanyName 		= '" . $saveHandler->ReturnUpdateField($currentRecord,"CompanyName") 	. "', ".
			"PhoneNumber 		= '" . $saveHandler->ReturnUpdateField($currentRecord,"PhoneNumber") 	. "', ".
			"Address 			= '" . $saveHandler->ReturnUpdateField($currentRecord,"Address") 		. "' ".
			"WHERE ContactID 	= '" . $saveHandler->ReturnUpdateField($currentRecord) 	. "'" .
			";";

		// Now we execute this query
		 mysql_query($myQuery);
	}
}

// ********************************************************** '
// Finish by processing our deletes
// ********************************************************** '

$deleteCount = $saveHandler->ReturnDeleteCount();
if ($deleteCount > 0)
{
	// Yes there are DELETES to perform...
	for ($currentRecord = 0; $currentRecord < $deleteCount; $currentRecord++)
	{
		$myQuery = "DELETE FROM tblContacts3k WHERE ContactID = '" . $saveHandler->ReturnDeleteField($currentRecord)."'";

		// Now we execute this query
		 mysql_query($myQuery);
	}
}

$saveHandler->CompleteSave();
mysql_close();

?>
