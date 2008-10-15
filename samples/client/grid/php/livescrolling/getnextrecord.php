<?php

// Make a MySQL Connection
mysql_connect() or die(mysql_error());
mysql_select_db("nitobi_testdb_v1") or die(mysql_error());

$myRandomVar = time();

$myQuery = "INSERT INTO tblcontacts3k (ContactName) VALUES ('". $myRandomVar ."')";
mysql_query($myQuery);

$myQuery = "SELECT * FROM tblcontacts3k WHERE ContactName LIKE '" . $myRandomVar . "';";
$result = mysql_query($myQuery);

$row = mysql_fetch_array($result);
$myID = $row["ContactID"];

$myQuery = "DELETE FROM tblcontacts3k WHERE ContactName LIKE '". $myRandomVar ."'";
mysql_query($myQuery);

mysql_close();

echo $myID;
?>
