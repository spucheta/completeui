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
		$myQuery  = "INSERT INTO tblorders (CustomerID, ProductName, OrderDate, ShippedDate) VALUES (" .
					"'" . $saveHandler->ReturnForeignKeyValue($currentRecord) . "'," .
					"'" . $saveHandler->ReturnInsertField($currentRecord, "ProductName")  . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"OrderDate") . "', " .
					"'" . $saveHandler->ReturnInsertField($currentRecord,"ShippedDate") . "'" .
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
		$myQuery = "UPDATE tblorders SET ".
			"ProductName		= '" . $saveHandler->ReturnUpdateField($currentRecord,"ProductName")	. "', ".
			"OrderDate			= '" . $saveHandler->ReturnUpdateField($currentRecord,"OrderDate")	. "', ".
			"ShippedDate			= '" . $saveHandler->ReturnUpdateField($currentRecord,"ShippedDate") 		. "'".
			"WHERE OrderID 	= " . $saveHandler->ReturnUpdateField($currentRecord) 	. "" .
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
		$myQuery = "DELETE FROM tblorders WHERE OrderID = " . $saveHandler->ReturnDeleteField($currentRecord)."";

		// Now we execute this query
		 mysql_query($myQuery);
	}
}

$saveHandler->CompleteSave();
mysql_close();

?>
