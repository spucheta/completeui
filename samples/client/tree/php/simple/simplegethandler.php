<?php
header('Content-type: text/xml');
require("../../../../server/php/base_gethandler.php");
	//*******************************************************************
	//Let's get some data out of the query string:
	//*******************************************************************

	$treeId='default';
	if (isset($_GET['treeId'])) {
		$treeId = $_GET['treeId'];
	}
	
	$nodeId='0';
	if (isset($_GET['id'])) {
		$nodeId = $_GET['id'];
	}

	//*******************************************************************
	//Let's define the database table we're working with
	//*******************************************************************

	$sortColumn="RegionName";

	//Set up the database connection and get the recordset

	$tableName = "tblRegions";
	// Make a MySQL Connection
	mysql_connect() or die(mysql_error());
	mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

	// Retrieve all the data from the table
	$myQuery = "SELECT * FROM " . $tableName . " WHERE RegionOwner = " . $nodeId . " ORDER BY " . $sortColumn . ";";
	$result = mysql_query($myQuery) or die(mysql_error());

	//*******************************************************************
	//Let's set up the output
	//*******************************************************************

	$getHandler = new EBAGetHandler();

	//First we define the columns we are sending in each record, and name each field.
	//We will do this by using the EBAGetHandler_DefineField function. We will name each
	//field of data after its column name in the database.

	$getHandler->DefineField("id");
	$getHandler->DefineField("label");
	$getHandler->DefineField("nodetype");
	$getHandler->DefineField("haschildren");

	//*******************************************************************
	//Let's loop through our data and send it to the grid
	//*******************************************************************

	
	while ($row = mysql_fetch_array($result))
	{
	
		$record = new EBARecord($row["RegionID"]);
	
		$record->add("id",	 $row["RegionID"]);
		$record->add("label", $row["RegionName"]);
	
		$myQuery = 'SELECT COUNT(1) AS NumChildren FROM ' . $tableName . ' WHERE RegionOwner = ' . $row["RegionID"] . ';';
		$countChildren = mysql_fetch_array(mysql_query($myQuery)) or die(mysql_error());
		$numChildren = $countChildren["NumChildren"]; 
		
		if ($numChildren > 0) {
			$record->add("nodetype",	 "node");
			$record->add("haschildren", "true");
		} else {
			$record->add("nodetype", "leaf");
			$record->add("haschildren", "false");
		}
	
		$getHandler->add($record);
	}
	$getHandler->CompleteGet();

?>

