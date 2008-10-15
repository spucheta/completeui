<?php

require("../../../../test/lib/php/base_gethandler.php");

// This file is used as a Get Handler for the Combobox.
// Gethandlers must be able to output xml when called without any
// parameters.
//
// We have provided all the necessary functionality in the
// EBASaveHandler_ functions to extract any of the update instructions.
// For more details please have a look at our shipped online help
// under Reference/Server

// This sample is meant to show off unicode text.  I do not recommend using
// the SAX parser.  The SAX parser was used to ensure this sample worked for
// everyone who is using php 4.  PHP 5 has a cleaner dom based appoarch to
// XML data.  The following is a helpful read "http://ca.php.net/domxml"

// *******************************************************************
// Lets Set up the Output
// *******************************************************************
$getHandler            = new EBAGetHandler();

$depth                 = array();
$inMemberNationElement = false;
$currentRecord         = "";

function startElement($parser, $name, $attrs)
{
   global $currentRecord, $getHandler,$inMemberNationElement;
   if($name != "MEMBERNATION")
   {
   	return;
   }
   // keep state for the other callback handlers
   $inMemberNationElement = true;
   //create one record for each XML MEMBERNATION element
   $currentRecord = new EBARecord($attrs['COUNTRYCODE']);

   $currentRecord->add("countryCode",      $attrs['COUNTRYCODE']);
   $currentRecord->add("flagImageLocation",$attrs['FLAGIMAGE']);
}

function charDataCallback($parser, $data)
{
    global $currentRecord,$inMemberNationElement;
   	if($inMemberNationElement)
	{
   	  // Grab the Element's text while the element is being processed
   	 $currentRecord->add("countryNameUTF8",  $data);
	}
}

function endElement($parser, $name)
{
   global $currentRecord, $getHandler,$inMemberNationElement;
   if($inMemberNationElement)
   {
   	  // The element processing has finished.  Add the record.
      $getHandler->add($currentRecord);
      // keep state for the other callback handlers
      $inMemberNationElement = false;
   }
}

$xml_parser = xml_parser_create();
xml_set_element_handler($xml_parser, "startElement", "endElement");
xml_set_character_data_handler($xml_parser, "charDataCallback");
if (!($fp = fopen("CountryNamesAndFlags.xml", "r"))) {
   die("could not open XML input [CountryNamesAndFlags.xml]");
}

while ($data = fread($fp, 4096)) {
   if (!xml_parse($xml_parser, $data, feof($fp))) {
       die(sprintf("XML error: %s at line %d",
                   xml_error_string(xml_get_error_code($xml_parser)),
                   xml_get_current_line_number($xml_parser)));
   }
}
xml_parser_free($xml_parser);

// find the job
$getHandler->completeGet();
?>
