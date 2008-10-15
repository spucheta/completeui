<?php
header('Content-type: text/xml');
require("../../../../test/lib/php/base_gethandler.php");
/*

// This file is used as a Get Handler for the Combobox.

// Gethandlers must be able to output xml when called without any parameters.

// For more details please have a look at our shipped online help under Reference/Server
/*
	 GetHandlers must be able to output xml when called without any parameters. If paging is used,
	 they need to respond to the following parameters:

         StartingRecordIndex - Which record (ordinally) to start returning data on.
         PageSize - How many records to return
         SearchSubstring - The string to search for
         LastString - The Last string in the currently loaded list. Useful for databases that dont support paging natively (like MS Access)

*/
// *******************************************************************
// Here we begin by grabbing some of the necessary querystring variables
// *******************************************************************

	$pageSize = 0;

	if (isset($_GET['PageSize'])) {
		$pageSize = $_GET['PageSize'];
	}

	if ($pageSize < 1) {
		$pageSize=15;
	}


	$startingRecordIndex = 0;

	if (isset($_GET['StartingRecordIndex'])) {
		$startingRecordIndex = $_GET['StartingRecordIndex'];
	}

	if ($startingRecordIndex < 1) {
		$startingRecordIndex=0;
	}

	$searchSubString = "";

	if (isset($_GET['SearchSubstring'])) {
		$searchSubString = $_GET['SearchSubstring'];
	}

	$lastString = "";

	if (isset($_GET['LastString'])) {
		$lastString = $_GET['LastString'];
	}


// *******************************************************************
// This code block just sets up the database and tries to figure out what index number
// our data starts at. This code has nothing to do with the grid itself so think of it as
// business logic.
// *******************************************************************

// Make a MySQL Connection
$myDBConnection = mysql_connect() or die(mysql_error());
mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

// Retrieve all the data from the "example" table
$myQuery = "SELECT * FROM tblcontacts3k WHERE ContactName LIKE '" . $searchSubString . "%' LIMIT ". $startingRecordIndex .",". $pageSize .";";
$result = mysql_query($myQuery)
or die(mysql_error());

// If you would like to know more about the querystrings you should use for each search mode and for different
// databases, consult our knowledgebase article: http://www.nitobi.com/kb/?artid=94




// *******************************************************************
// Lets Set up the Output
// *******************************************************************
$getHandler = new EBAGetHandler();

// For the purposes of this demo we have some random icons we're using in the image column. Here they are
$CustomerIcons = array("scustomerimage.gif",
	               "scustomerimage2.gif", "scustomerimage3.gif",
	               "scustomerimage4.gif", "scustomerimage5.gif");

// *******************************************************************
// Lets loop through our data and send it to the grid
// *******************************************************************

	$getHandler->DefineField("ContactName");
	$getHandler->DefineField("ContactEmail");
	$getHandler->DefineField("JobTitle");
	$getHandler->DefineField("CompanyName");
	$getHandler->DefineField("ContactImage");

// loop through icons
$iconIndex = 0;


$nrows = mysql_num_rows($result);

for ( $counter = 0; $counter < $nrows; $counter++) {

	$row = mysql_fetch_array($result);

	$record = new EBARecord($row["ContactID"]);

	$record->add("ContactName",	 $row["ContactName"]);
	$record->add("ContactEmail", $row["ContactEmail"]);
	$record->add("JobTitle",	 $row["JobTitle"]);
	$record->add("CompanyName", $row["CompanyName"]);
	$record->add("ContactImage", $CustomerIcons[($iconIndex++ % 4)]);
	$getHandler->add($record);


}

mysql_close($myDBConnection);
$getHandler->CompleteGet();

?>
