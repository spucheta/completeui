<?php

// Make a MySQL Connection
mysql_connect() or die(mysql_error());
mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

$myRandomVar = time();

$myQuery = "INSERT INTO tblproducts (ProductName) VALUES ('". $myRandomVar ."')";
mysql_query($myQuery);

$myQuery = "SELECT * FROM tblproducts WHERE ProductName LIKE '" . $myRandomVar . "';";
$result = mysql_query($myQuery);

$row = mysql_fetch_array($result);
$myID = $row["ProductID"];

$myQuery = "UPDATE tblproducts Set ProductName = '' WHERE ProductID = ".$myID;
mysql_query($myQuery);

mysql_close();

echo $myID;
?>
