<?php
header('Content-type: text/xml');
require("../../../../server/php/base_gethandler.php");

	$treeId='default';
	if (isset($_GET['treeId'])) {
		$treeId = $_GET['treeId'];
	}
	
	// Get our custom-defined key field
	$nodeKey='0';
	if (isset($_GET['key'])) {
		$nodeKey = $_GET['key'];
	}
	// Get our secondary key
	$nodeKey2='0';
	if (isset($_GET['key2'])) {
		$nodeKey2 = $_GET['key2'];
	}
	
	//Get our custom metadata: @type
	$type='continent';
	if (isset($_GET['type'])) {
		$type = $_GET['type'];
	}
		
	//Set up the database connection and get the recordset

	$tableName = "country";
	// Make a MySQL Connection
	mysql_connect() or die(mysql_error());
	mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

	// Retrieve all the data from the table
	switch ($type)
	{
		case "continent":
			$myQuery = "SELECT DISTINCT(Region) FROM country WHERE Continent = '" . $nodeKey . "' ORDER BY Region;";
			break;
		case "region":
			$myQuery = "SELECT * FROM country WHERE Region = '" . $nodeKey . "' ORDER BY Name;";
			break;
		case "country":
			$myQuery = "SELECT DISTINCT(District),CountryCode FROM city WHERE CountryCode = '" . $nodeKey . "' ORDER BY District;";
			break;
		case "district":
			$myQuery = "SELECT * FROM city WHERE District = '" . $nodeKey . "' AND CountryCode = '" . $nodeKey2 . "' ORDER BY Name;";
			break;		
	}
	$result = mysql_query($myQuery) or die(mysql_error());

	//*******************************************************************
	//Lets set up the output
	//*******************************************************************

	$getHandler = new EBAGetHandler();

	//First we define the columns we are sending in each record, and name each field.
	//We will do this by using the EBAGetHandler_DefineField function. We will name each
	//field of data after its column name in the database.

	// We will let the grid deal with assigning unique IDs - there are many places where we 
	// may have no globally unique key.
	// $getHandler->DefineField("id");
	$getHandler->DefineField("label");
	$getHandler->DefineField("nodetype");
	$getHandler->DefineField("haschildren");
	// A custom metadata attribute
	$getHandler->DefineField("type");
	// And 2 more for multiple keys.
	$getHandler->DefineField("key");
	$getHandler->DefineField("key2");

	// *******************************************************************
	// Lets loop through our data and send it to the grid
	// *******************************************************************

	$nodeKeyColumn = "";
	$nodeKey2Column = "";
	$nodeLabelColumn = "";
	$nodeType = "";
	switch ($type)
	{
		case "continent":
			$nodeKeyColumn = 'Region';
			$nodeLabelColumn = 'Region';
			$nodeType = 'region';
			break;
		case "region":
			$nodeKeyColumn = 'Code';
			$nodeLabelColumn = 'Name';
			$nodeType = 'country';
			break;
		case "country":
			$nodeKeyColumn = 'District';
			$nodeKey2Column = 'CountryCode';
			$nodeLabelColumn = 'District';
			$nodeType = 'district';
			break;
		case "district":
			$nodeKeyColumn = 'ID';
			$nodeLabelColumn = 'Name';
			$nodeType = 'city';
			break;		
	}
	
	while ($row = mysql_fetch_array($result))
	{
	
		$record = new EBARecord($row[$nodeKeyColumn]);
	
		$record->add("key",	 $row[$nodeKeyColumn]);
		$record->add("label", $row[$nodeLabelColumn]);
		$record->add("type", $nodeType);
		
		if ($nodeKey2Column != "") {
			$record->add("key2", $row[$nodeKey2Column]);
		} else {
			$record->add("key2", '');
		}
		
		if ($nodeType == 'city') {
			$record->add("nodetype", "leaf");
			$record->add("haschildren", "false");
		} else {
			$record->add("nodetype",	 "node");
			$record->add("haschildren", "true");
		}
	
		$getHandler->add($record);
	}
	$getHandler->CompleteGet("latin1");

?>

