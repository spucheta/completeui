<?php
header('Content-type: text/xml');
require("../../../../server/php/base_gethandler.php");
/*
	 This file is used as a Get Handler for the Nitobi Grid control. When the grid is initialized,
	 the getHandler (this page) is called and expected to return a properly formatted
	 xml stream. We have provided all the necessary functionality to do this without actually
	 requiring you to construct XML. Simply interface with your datasource and use the provided
	 function calls to create the necessary output. The format of the XML is specific to the EBA
	 Grid control.

	 GetHandlers must be able to output xml when called without any parameters. If paging is used,
	 they need to respond to the following parameters:

         StartRecordIndex - Which record (ordinally) to start returning data on.
         PageSize - How many records to return
         SortColumn - Which is the currently sorted column (could be blank)
         SortDirection - (Asc or Desc) The direction of sorting
         TableId - The datatable being used (by default is _default)

	 eg:

	 load_data.php?PageSize=15&StartRecordIndex=101&SortColumn=ContactEmail&SortDirection=Asc&TableId=_default

	 *******************************************************************
	 Lets define the database table we're working with
	 *******************************************************************
	 *******************************************************************
*/
	$pageSize=10;
	if (isset($_GET['PageSize'])) {
		$pageSize = $_GET['PageSize'];
		if(empty($pageSize)){
			$pageSize=10;
		}
	}
	$ordinalStart=0;
	if (isset($_GET['StartRecordIndex'])) {
		$ordinalStart = $_GET['StartRecordIndex'];
		if(empty($ordinalStart)){
			$ordinalStart=0;
		}
	}
	$sortColumn="ProductID";
	if (isset($_GET['SortColumn'])) {
		$sortColumn=$_GET["SortColumn"];
		if(empty($sortColumn)){
			$sortColumn="ProductID";
		}
	}

	$sortDirection='Asc';
	if (isset($_GET['SortDirection'])) {
		$sortDirection=$_GET["SortDirection"];
	}

	//Set up the database connection and get the recordset

	// Make a MySQL Connection
	mysql_connect() or die(mysql_error());
	mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

	// Retrieve all the data from the "example" table
	$myQuery = "SELECT * FROM tblproducts ORDER BY " . $sortColumn . " " . $sortDirection ." LIMIT ". $ordinalStart .",". ($pageSize) .";";
	$result = mysql_query($myQuery)
	or die(mysql_error());

	//*******************************************************************
	//Lets set up the output
	//*******************************************************************

	$getHandler = new EBAGetHandler();

	//First we define the columns we are sending in each record, and name each field.
	//We will do this by using the EBAGetHandler_DefineField function. We will name each
	//field of data after its column name in the database.

	$getHandler->DefineField("ProductName");
	$getHandler->DefineField("ProductCategoryName");
	$getHandler->DefineField("ProductSku");
	$getHandler->DefineField("ProductPrice");
	$getHandler->DefineField("ProductQuantityPerUnit");

	// *******************************************************************
	// Lets loop through our data and send it to the grid
	// *******************************************************************

	$nrows = mysql_num_rows($result);

	for ( $counter = 0; $counter < $nrows; $counter++) {

				$row = mysql_fetch_array($result, MYSQL_ASSOC );

				$record = new EBARecord($row["ProductID"]);

				$record->add("ProductName",	 $row["ProductName"]);
				$record->add("ProductCategoryName", $row["ProductCategoryName"]);
				$record->add("ProductSku",	 $row["ProductSku"]);
				$record->add("ProductPrice", $row["ProductPrice"]);
				$record->add("ProductQuantityPerUnit", $row["ProductQuantityPerUnit"]);
				$getHandler->add($record);


	}


$getHandler->CompleteGet();

?>

