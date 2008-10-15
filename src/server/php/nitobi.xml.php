<?php

// *****************************************************************************
// *****************************************************************************
// * EBAXML PHP Library v2.15
// *****************************************************************************
// * Copyright (C) eBusiness Applications
// * The SOFTWARE PRODUCT is protected by copyright laws and international
// * copyright treaties, as well as other intellectual property laws and treaties.
// * The SOFTWARE PRODUCT is licensed, not sold. The eBusiness Applications
// * distribution file may not have files added to it or removed from it.
// * None of its compiled or encoded contents may be decompiled, or reverse engineered.
// * You may not reverse engineer, decompile, or disassemble the SOFTWARE PRODUCT,
// * except and only to the extent that such activity is expressly permitted by
// * applicable law notwithstanding this limitation.
// *****************************************************************************


///<class  name='ILocaleConverter'>
/// <summary>
/// ILocaleConverter provides a means of extending EBAXML.php to handle different
/// character encodings.  If you are using a new encoding you should create a
/// subclass and override the createUnicodeString method
/// </summary>
/// <remarks> The ILocaleConverter is used for internationalization.  ILocaleConverter:createUnicodeString should be treated as an pure virtual abstract method.  Please create an instance of DefaultLocaleConverter.</remarks>
///
class ILocaleConverter
{

	function ILocaleConverter()
	{
	}
	
	///<function name="createUnicodeString" access="public">
	///<summary>Creates a Unicode string</summary> 
	///<param name="nativeString" type="string" >A natively encode string</param>
    ///<returns type="string" >A Unicode  string</returns>
    ///<remarks>ILocaleConverter->createUnicodeString should be treated as an pure virtual abstract method.  Please create an instance of DefaultLocaleConverter.</remarks>
	function createUnicodeString($nativeString)
	{
		trigger_error("ILocaleConverter->createUnicodeString should be treated as an pure virtual abstract method.  Please create an instance of DefaultLocaleConverter.",E_USER_ERROR);
	}
	///</function>

}
///</class>


///<class  name='DefaultLocaleConverter' inherits='ILocaleConverter'>
/// <summary>
/// Converter to create Unicode strings from the default php native encoding
/// </summary>
/// <remarks>
/// It is best to have the mbstring extension loaded.  To load this extension
/// remove the ';' from the beginning of the ';extension=php_mbstring.dll' line in
/// your php.ini and restart you webserver. If mbstring is not loaded the
/// nativeString is returned unchanged.
/// </remarks>
class DefaultLocaleConverter extends ILocaleConverter
{

	function DefaultLocaleConverter()
	{
	}

	///<function name="createUnicodeString" access="public">
	///<summary>Creates a Unicode string</summary> 
	///<param name="nativeString" type="string" >A string</param>
    ///<returns type="string" >A Unicode string</returns>
	function createUnicodeString($nativeString)
	{
	# by default just return the input
	$result = $nativeString;

	# check if mbstring is loaded.  
	if(extension_loaded("mbstring"))
	{
	    $result = mb_convert_encoding($nativeString, "UTF-8");
	}   
	return $result;
	}
	///</function>
}
///</class>


///<class  name='Shift_JISLocaleConverter' inherits='ILocaleConverter' >
/// <summary>
/// A Converter use to create Unicode strings from Shift_JIS encoding
/// </summary>
/// <remarks>
/// It is best to have the mbstring extension loaded.  To load this extension
/// remove the ';' from the beginning of the ';extension=php_mbstring.dll' line in
/// your php.ini and restart you webserver. If mbstring is not loaded the
/// nativeString is returned unchanged.
/// </remarks>
/// <remarks> Shift_JISLocaleConverter will only work if the mbstring extension is loaded.  To load the mbstrings extention, please remove the ';' from the beginning of the ';extension=php_mbstring.dll' line in your php.ini and restart you webserver. For more details see http://ca.php.net/mbstring </remarks>
class Shift_JISLocaleConverter extends ILocaleConverter
{

	function Shift_JISLocaleConverter()
	{
	}

	///<function name="createUnicodeString" access="public">
	///<summary>creates a Unicode encoded string from a Shift_JIS string</summary> 
	///<param name="nativeString" type="string" >A string of Shift_JIS encoded characters</param>
    ///<returns type="string" >A Unicode string</returns>
	function createUnicodeString($nativeString)
	{
		$result = $nativeString;

		if(extension_loaded("mbstring"))
		{
	    	$result = mb_convert_encoding($nativeString, "UTF-8", "SJIS");
		}
		else
		{
	    	trigger_error("Shift_JISLocaleConverter will only work if the mbstring extension is loaded.  To load the mbstrings extention, please remove the ';' from the beginning of the ';extension=php_mbstring.dll' line in your php.ini and restart you webserver. For more details see http://ca.php.net/mbstring",E_USER_ERROR);
		}

		return  $result;
	}
	///</function>

}
///</class>


///<class  name='EBARecord'>
///<summary> EBARecord encapsulates a single row of data
/// The row has an id and a set of name value pairs
///</summary>
class EBARecord
{
    var $m_ID     = 0;
    # Files is a pair of name value fields.
    var $m_Fields = array();

    function EBARecord($id)
    {
		$this->m_ID=$id;
    }

	///<function name="add" access="public">
	/// <summary>Adds a new name value pair to the record</summary>
	///<param name="columnName" type="string" >Name of field</param>
    ///<param name="columnValue" type="string" >Field value</param>
    ///</function>
	function add($columnName, $columnValue)
    {
		$this->m_Fields[$columnName] = $columnValue;
    }

	///<function name="getRows" access="public">
	///<summary>Adds a new name value pair to the record</summary>
	///<returns>An associative array of the name value pairs </returns>
	///</function>
    function getRows()
    {
		return $this->m_Fields;
    }

	///<function name="getID" access="public">
	///<summary>Return the ID of the record</summary>
	///<returns type="string" >Record ID</returns>
    ///</function>
    function getID()
    {
		return $this->m_ID;
    }

}
///</class>


// EBAXML PHP Library v2.01  Copyright (C) eBusiness Applications The SOFTWARE
// PRODUCT is protected by copyright laws and international copyright treaties, as
// well as other intellectual property laws and treaties. The SOFTWARE PRODUCT is
// licensed, not sold. The eBusiness Applications distribution file may not have
// files added to it or removed from it. None of its compiled or encoded contents
// may be decompiled, or reverse engineered. You may not reverse engineer,
// decompile, or disassemble the SOFTWARE PRODUCT, except and only to the extent
// that such activity is expressly permitted by applicable law notwithstanding
// this limitation. EBAGetHandler is an encapsulation of the data structure used
// to create EBA compressed XML The data includes a set of column names and a set
// of records
// @created 23-Sep-2005 3:19:21 PM
///<class  name='EBAGetHandler'>
/// <summary>Write EBA compressed XML based on a set of records     </summary>
//
// The following are a set of depreciated functions Please make your
// life easy and stop using the following functions:
// ProcessRecords  		   - This is now a no-op
// DefineField     		   - This is now a no-op
// CreateNewRecord 		   - No longer supported 
// SaveRecord      		   - No longer supported 
// DefineRecordFieldValue  - No longer supported 
// <br></br>
//
// <example> 
//<code>
//  $getHandler = new EBAGetHandler();
//	$record     = new EBARecord("ID1");
//	$record->add("Field1", "Value One");
//	$getHandler.add($record);
//  $getHandle.CompleteGet();
//</code>
//</example>
class EBAGetHandler
{
    # a list of columns that will be included in the component
    var $m_ColunmNames   = array(); 
    var $m_Rows          = array(); 
    # XML's reserved chars and their entity references
    var $m_TranscodeList = array(
				 "&"  =>  "&amp;", # Make sure to replace this first.
				 "\"" =>  "&quot;",
				 "<"  =>  "&lt;",
				 ">"  =>  "&gt;",
				 "\n" =>  "&#10;",);
    # carriageReturn => "&#13;" # need to add c/r

    var $m_currentRecord;

    # allows for the transcoding of strings
    var $m_localeConverter;
    # adds the xml:lang attribute to the xml
    var $m_dataLanguage;

    # for keeping track of any errors. if this is set to a non-empty string then it
    # will be sent back to the client as an attribute called "error" in the root element.
    var $m_ErrorMessage;
	
	var $m_totalRowCount;
	
	var $m_foreignKey;
	var $m_foreignKeyValue;

    function EBAGetHandler()
    {
	$this->m_ErrorMessage	 = "";
	$this->m_dataLanguage    = "en";
	$this->m_localeConverter = new DefaultLocaleConverter();
    }
    
    function EnableEventMode()
    {
    	$this->DefineField("startdate");
    	$this->DefineField("enddate");
    	$this->DefineField("location");
    	$this->DefineField("description");
    	$this->DefineField("type");
    }
    
    function CreateEvent($key, $startDate, $endDate, $location, $description)
    {
    	$record = new EBARecord($key);

		$record->add("startdate", $startDate);
		$record->add("enddate", $endDate);
		$record->add("location", $location);
		$record->add("description", $description);
		$record->add("type", "event");
		
		$this->add($record);
    }
    
    function DisableDate($date)
    {
    	$record = new EBARecord(0);

		$record->add("startdate", $date);
		$record->add("enddate", "");
		$record->add("location", "");
		$record->add("description", "");
		$record->add("type", "disabled");
		
		$this->add($record);
    }
	
	function SetTotalRowCount($rowCount)
	{
		$this->m_totalRowCount = $rowCount;
	}
	
	function DefineForeignKey($fk)
	{
		$this->m_foreignKey = $fk;
	}
	
	function DefineForeignKeyValue($value)
	{
		
		$this->m_foreignKeyValue = $value;
	}

	///<function name="ProcessRecords" access="public">
	/// <summary>DEPRECIATED DO NOT USE</summary>
	///<param name="XMLEncoding" type="string" >Do not use</param>
	/// <remarks>To set encoding use the 'encoding' parameter of the methods toXML or completeGet</remarks>
	///</function>
    function ProcessRecords($XMLEncoding="UTF-8")
    {
	// this is a no op
    }

	///<function name="DefineField" access="public">
	/// <summary>Allows the description of data without record being added.  
	/// This allows the combo to render when there are zero records.</summary>
	/// <remarks>The fields do not have to be pre-defined.  Fields are now
	/// created base on the records.  Whenever a record is added all of
	/// the records fields are added to the global list of fields.
	/// Note DefineFields must be called if no records are added to the EBAGetHandler object.
	/// </remarks>
	///<param name="XMLEncoding" type="string" ></param>    
	///</function>
    function DefineField($FieldName)
    {
	$this->m_ColunmNames[$FieldName] = 1;
    }

	///<function name="CreateNewRecord" access="public">
	/// <summary>DEPRECIATED DO NOT USE</summary>
	/// <remarks>The supported method to create record is to call $currentRecord = new EBARecord($KeyVal);
	/// </remarks>
	///</function>
    function CreateNewRecord($KeyVal)
    {
	$this->m_currentRecord = new EBARecord($KeyVal);
    }
    
	///<function name="SaveRecord" access="public">
	/// <summary>DEPRECIATED DO NOT USE</summary>
	/// <remarks>The supported method of adding records is to call $currentGetHanlder->add($currentRecord);
	/// </remarks>
	///</function>
	function SaveRecord()
    {
	$this->add($this->m_currentRecord);
	$this->m_currentRecord = "";
    }
 

 	///<function name="DefineRecordFieldValue" access="public">
	/// <summary>DEPRECIATED DO NOT USE</summary>
	/// <remarks>The supported method of adding field-value pairs is: $currentRecord->add($ColName, $DataValue)
	/// </remarks>
	///</function> 
    function DefineRecordFieldValue($ColName, $DataValue)
    {
		$this->m_currentRecord->add($ColName, $DataValue);
    }

	///<function name="add" access="public">
	/// <summary> The 'record' added will become a row element in the eba xml</summary> 
	///<param name="record" type="EBARecord" >The record to add</param>    
	///</function>
	function add($record)
    {
		# add all the ColumnNames
		foreach ($record->getRows() as  $columnName => $dummy)
		{
	    	$this->m_ColunmNames[$columnName] = 1;
		}
		# add the Rows
		$this->m_Rows[$record->getID()] = $record->getRows();
    }

	///<function name="setLocaleConverter" access="public">
	/// <summary> Set the localeConverter.  This is only needed if different character set are used.</summary>
	///<param name="LocaleConverter" type="ILocaleConverter" >The localeConverter used to generate the EBA compessed xml response</param>    
	///</function> 
    function setLocaleConverter($localeConverter)
    {
	$this->m_localeConverter = $localeConverter;
    }

	///<function name="setDataLanguage" access="public">
	/// <summary> Set the datalanguage used for xml:lang</summary> 
	///<param name="language" type="string" >The value used for xml:lang</param>
	///</function> 
    function setDataLanguage($language)
    {
	$this->m_dataLanguage = $language;
    }

	///<function name="setErrorMessage" access="public">
	///<summary> Sets an error message to be sent back to the client in the response. Set this to any empty string to clear the error message.</summary> 
	///<param name="message" type="string" >The value for the error message</param>
	///</function> 
    function setErrorMessage($message)
    {
	$this->m_ErrorMessage = $message;
    }

	///<function name="completeGet" access="public">
	/// <summary> Prints UTF-8 EBA XML to the respone</summary>
	///</function> 
    function completeGet($encoding="UTF-8")
    {
	header("Content-type:text/xml;charset=$encoding");
	print $this->toXML($encoding);
    }

	///<function name="toXML" access="public">
	/// <summary> Creates an compressed EBA XML document based on the records added to the getHandler object</summary>
	/// <returns type="string"> compressed UTF-8 EBA XML document</returns>
	///</function> 
	function toXML($encoding="UTF-8")
    {
	$results  = "<?xml version=\"1.0\" encoding=\"$encoding\" ?>";
	# print the columns as the fields attribute of  the opening root tag

	$results .= "<root xml:lang=\"{$this->m_dataLanguage}\" fields=\"".
	            strtr(implode("|",array_keys($this->m_ColunmNames)),$this->m_TranscodeList)."\"";
	if ($this->m_ErrorMessage != "")
	{
	    $results .= " error=\"" . strtr($this->m_ErrorMessage,$this->m_TranscodeList) . "\"";
	}
	if ($this->m_totalRowCount != NULL)
	{
		$results .= " totalrowcount=\"" . $this->m_totalRowCount . "\"";
	}
	if ($this->m_foreignKey != NULL)
	{
		$results .= " parentfield=\"" . $this->m_foreignKey . "\"";
	}
	if ($this->m_foreignKeyValue != NULL)
	{
		$results .= " parentvalue=\"" . $this->m_foreignKeyValue . "\"";
	}
	$results .= ">";

	# print the rows
	# following is an example row
        # <e xk="de" a="de" b="images/flags/de_flag.gif" c="Deutschland"/>
	# create compression indexes a,..,z,aa,ab,..,zy,zz
	$EBAColumnOrder 	= range('a','z');

	foreach ($this->m_Rows as $rowID => $rowArray)
	{

	    $results .= "<e xk=\"".strtr($rowID,$this->m_TranscodeList)."\"";

	    $EBAIndex 		= -1;
	    $EBASubIndex 	= 0;

	    foreach ($this->m_ColunmNames as $columnName => $dummy)
	    {
		if(count($EBAColumnOrder) <= $EBASubIndex)
		{
		    $EBASubIndex  = 0; 
		    $EBAIndex++;
		}
		$ColumnKey = $EBAColumnOrder[$EBASubIndex];
		if($EBAIndex > -1)
		{
		    $ColumnKey = $EBAColumnOrder[$EBAIndex].$ColumnKey;
		}
		# index "$EBAColumnOrder[$index]$EBAColumnOrder[$subIndex]";
		$results .= " $ColumnKey=\"".strtr($rowArray[$columnName],$this->m_TranscodeList)."\"";
		$EBASubIndex++;
	    }
	    $results .= " />\n";
	}

	// finish document
	$results .= ( "</root>");
	return $this->m_localeConverter->createUnicodeString($results);
    }
}
///</class>


class EBASaveHandler
{
	var $InsertRecords 	= array();
	var $UpdateRecords 	= array();
	var $DeleteRecords 	= array();
	var $InsertCount 	= 0;
	var $UpdateCount 	= 0;
	var $DeleteCount 	= 0;
	var $Fields 		= array();
	var $FieldsCount 	= 0;
	var $FieldsSet 		= array();
	var $XmlStr;
	var $m_ErrorMessage;
	var $m_ForeignKeyValue;
	# XML's reserved chars and their entity references
    var $m_TranscodeList = array(
				 "&"  =>  "&amp;", # Make sure to replace this first.
				 "\"" =>  "&quot;",
				 "<"  =>  "&lt;",
				 ">"  =>  "&gt;",
				 "\n" =>  "&#10;",);

	function EBASaveHandler()
	{
		$this->XmlStr = $GLOBALS["HTTP_RAW_POST_DATA"];
	}

	function CompleteSave($encoding="UTF-8")
	{
		header("Content-type:text/xml;charset=$encoding");
		//	print $this->toXML($encoding);
		if( $this->m_ErrorMessage != "" )
		{
			print str_replace("<root ", "<root error=\"".strtr($this->m_ErrorMessage,$this->m_TranscodeList)."\" ", $this->XmlStr);
		}
		else
		{ 
			print $this->XmlStr;
		}
	}

	function ReturnInsertCount()
	{
		return $this->InsertCount;
	}

	function ReturnUpdateCount()
	{
		return $this->UpdateCount;
	}

	function ReturnDeleteCount()
	{
		return $this->DeleteCount;
	}
	
	///<function name="setErrorMessage" access="public">
	///<summary> Sets an error message to be sent back to the client in the response. Set this to any empty string to clear the error message.</summary> 
	///<param name="message" type="string" >The value for the error message</param>
	///</function> 
    function setErrorMessage($message)
    {
		$this->m_ErrorMessage = $message;
    }
    
	//<function name="ReturnInsertField" access="public">
	// <summary> Returns the number of insert instructions in the updategram. 
	//           Updategrams (saving instructions) contain 3 types of instructions: INSERT, UPDATE, and DELETE.
	//           Always process INSERT's first, UPDATE's next, and DELETE's last.</summary>
	// <returns type="string"> The value for a field. </returns>
	//</function> 
	function ReturnInsertField($RecordNumber, $FieldName = "")
	{
		$postData = $GLOBALS["HTTP_RAW_POST_DATA"];

		$EBAResultValue = "";
		$EBASearchField = "";
		$index = array_search($FieldName, $this->Fields);
		if (($index !== FALSE) || ($FieldName == "") || ($FieldName == "EBAFK"))
		{
			if ($FieldName == "")
			{
				$EBASearchField = "xk=\"";
			}
			else if ($FieldName == "EBAFK")
			{
				$EBASearchField = "xf=\"";
			}
			else if (strlen($FieldName) > 0)
			{
				//"d" should be included here too
				//but this test wasn't working for some reason, and actually appending
				//the space to ALL EBASearchFields is fine
				//$EBASearchField = $this->FieldsSet[$index]."=\"";
				//if (($this->FieldsSet[$index] == "d" || $this->FieldsSet[$index] == "k") || ($this->FieldsSet[$index] == "i"))
				$EBASearchField = " ".$this->FieldsSet[$index] ."=\"";
			}

			$EBAUpdateGramTemp = EBAright($postData, strlen($postData) - $this->InsertRecords[$RecordNumber]);
			$EBANextPos = strpos($EBAUpdateGramTemp, $EBASearchField);

			if ($EBANextPos > 0)
			{
				$EBAUpdateGramTemp = EBAright($EBAUpdateGramTemp, strlen($EBAUpdateGramTemp) - $EBANextPos - strlen($EBASearchField));
				$EBANextPos = strpos($EBAUpdateGramTemp, "\"");
				$EBAUpdateGramTemp = EBAleft($EBAUpdateGramTemp,$EBANextPos);
				$EBAResultValue = $EBAUpdateGramTemp;
			}
		}
		return $EBAResultValue;
	}
	
	function ReturnForeignKeyValue($RecordNumber)
	{
		return $this->ReturnInsertField($RecordNumber, "EBAFK");
	}

	function ReturnUpdateField($RecordNumber, $FieldName = "")
	{
		$postData = $GLOBALS["HTTP_RAW_POST_DATA"];

		$EBAResultValue = "";
		$EBASearchField = "";
		$index = array_search($FieldName, $this->Fields);


		if (($index !== FALSE) || ($FieldName == ""))
		{
			$EBASearchField = "xk=\"";
			if (strlen($FieldName) > 0)
			{
				$EBASearchField = $this->FieldsSet[$index] ."=\"";
				
				//"d" should be included here too
				//but this test wasn't working for some reason, and actually appending
				//the space to ALL EBASearchFields is fine
				//if ($this->FieldsSet[$index] == "d" || $this->FieldsSet[$index] == "k" || $this->FieldsSet[$index] == "i")
					$EBASearchField = " ".$this->FieldsSet[$index] ."=\"";

			}
			$EBAUpdateGramTemp = EBAright($postData, strlen($postData) - $this->UpdateRecords[$RecordNumber]);

			$EBANextPos = strpos($EBAUpdateGramTemp, $EBASearchField);
			if ($EBANextPos > 0)
			{
				$EBAUpdateGramTemp = EBAright($EBAUpdateGramTemp, strlen($EBAUpdateGramTemp) - $EBANextPos - strlen($EBASearchField));
				$EBANextPos = strpos($EBAUpdateGramTemp, "\"");
				$EBAUpdateGramTemp = EBAleft($EBAUpdateGramTemp, $EBANextPos);
				$EBAResultValue = $EBAUpdateGramTemp;
			}
		}

		return $EBAResultValue;
	}

	function ReturnDeleteField($RecordNumber)
	{
		$postData = $GLOBALS["HTTP_RAW_POST_DATA"];

		$EBAResultValue = "";
		$EBASearchField = "xk=\"";
		$EBADeleteGramTemp = EBAright($postData, strlen($postData) - $this->DeleteRecords[$RecordNumber]);
		$EBANextPos = strpos($EBADeleteGramTemp, $EBASearchField);

		if ($EBANextPos > 0)
		{
			$EBADeleteGramTemp = EBAright($EBADeleteGramTemp, strlen($EBADeleteGramTemp) - $EBANextPos - strlen($EBASearchField));
			$EBANextPos = strpos($EBADeleteGramTemp, "\"");
			$EBADeleteGramTemp = EBAleft($EBADeleteGramTemp, $EBANextPos);
			$EBAResultValue = $EBADeleteGramTemp;
		}
		return $EBAResultValue;
	}

	//<function name="ProcessRecords" access="public">
	// <summary>This function initializes the SaveHandler based on the data in the GLOBALS[HTTP_RAW_POST_DATA] </summary>
	// <returns type="string"> The value for a field</returns>
	//</function> 
	function ProcessRecords()
	{
		$postData = $GLOBALS["HTTP_RAW_POST_DATA"];

		# Populate EBAGetHandler_Fields with the fields names
		$EBAUpdategram = $postData;
		$ParsePos = 0;
		if (strlen($EBAUpdategram) > 5)
		{
			$ParsePos = strpos(strtolower($EBAUpdategram), "fields");
			$ParsePos = strpos(EBAright($EBAUpdategram, strlen($EBAUpdategram) - $ParsePos), "\"") + 7;
 			$EBAUpdategram = EBAright($EBAUpdategram, strlen($EBAUpdategram) - $ParsePos);

			#Begin grabbing fields
			$EBANextPos = 0;
			$EBAFieldName = "";
			do
			{
				$EBANextPos = strpos($EBAUpdategram, "|");
				$EBANextPos = min($EBANextPos, strpos($EBAUpdategram, "\""));
				if ($EBANextPos > 0)
				{
					$EBAFieldName = EBAleft($EBAUpdategram, $EBANextPos);
					$EBAUpdategram = EBAright($EBAUpdategram, strlen($EBAUpdategram) - $EBANextPos - 1);
					$this->Fields[$this->FieldsCount] = $EBAFieldName;
					$this->FieldsCount += 1;
				}
			}
			while ($EBANextPos > 0);

			$EBANextPos = strpos($EBAUpdategram, "\"");
			if ($EBANextPos > 0)
			{
				$EBAFieldName = EBAleft($EBAUpdategram, $EBANextPos);
				$EBAUpdategram = EBAright($EBAUpdategram, strlen($EBAUpdategram) - $EBANextPos - 1);
				$this->Fields[$this->FieldsCount] = $EBAFieldName;
				$this->FieldsCount += 1;
			}

			# Now we count the insert instructions
			$EBAUpdategram = $postData;
			$EBAUpdateGramTemp = $EBAUpdategram;
			$EBATotalCount = 0;
			do
			{
				$EBANextPos = strpos($EBAUpdateGramTemp, "<insert");
				if ($EBANextPos > 0)
				{
					$EBATotalCount += $EBANextPos+1;
					$this->InsertRecords[$this->InsertCount] = $EBATotalCount;
					$this->InsertCount += 1;
					$EBAUpdateGramTemp = EBAright($EBAUpdateGramTemp, strlen($EBAUpdateGramTemp) - $EBANextPos - 1);
				}
			}
			while ($EBANextPos > 0);

			$EBAUpdateGramTemp = $EBAUpdategram;
			$EBATotalCount = 0;
			do
			{
				$EBANextPos = strpos($EBAUpdateGramTemp, "<update");
				if ($EBANextPos > 0)
				{
					$EBATotalCount += $EBANextPos;
					$this->UpdateRecords[$this->UpdateCount] = $EBATotalCount;
					$this->UpdateCount += 1;
					$EBAUpdateGramTemp = EBAright($EBAUpdateGramTemp, strlen($EBAUpdateGramTemp) - $EBANextPos - 1);
				}
			}
			while ($EBANextPos > 0);

			$EBAUpdateGramTemp = $EBAUpdategram;
			$EBATotalCount = 0;
			do
			{
				$EBANextPos = strpos($EBAUpdateGramTemp, "<delete");
				if ($EBANextPos > 0)
				{
					$EBATotalCount += $EBANextPos;
					$this->DeleteRecords[$this->DeleteCount] = $EBATotalCount;
					$this->DeleteCount += 1;
					$EBAUpdateGramTemp = EBAright($EBAUpdateGramTemp, strlen($EBAUpdateGramTemp) - $EBANextPos - 1);
				}
			}
			while ($EBANextPos > 0);

			$EBAFieldOrder = array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
			$MainSetCounter = 0;
			for ( $index = 0; $index < 26; $index += 1)
			{
				$this->FieldsSet[$index] = $EBAFieldOrder[$index];
				$MainSetCounter += 1;
			}
			for ( $index = 0; $index < 26; $index += 1)
			{
				for ( $subIndex = 0; $subIndex < 26; $subIndex += 1)
				{
					$this->FieldsSet[$MainSetCounter] = $EBAFieldOrder[$index] . $EBAFieldOrder[$subIndex];
					$MainSetCounter += 1;
				}
			}
		}
		else
		{
			print "No valid EBA updategram was discovered!";
		}
	}
	
	//<function name="SetRecordKey" access="public">
	// <summary>In the case of an insert, we need to communicate back to the client
	// the new key for this record.  After inserting into the database, call
	// this method to add the new key to the response back to the client.</summary>
	//</function> 
	function SetRecordKey($RecordNumber, $key)
	{
		// 
		$EBAUpdateGramTemp = EBAright($this->XmlStr, strlen($this->XmlStr) - $this->InsertRecords[$RecordNumber]);
		$EBANextPos = strpos($EBAUpdateGramTemp, "xk");
		$EBAInsertPos = strpos($this->XmlStr, $EBAUpdateGramTemp);

		if ($EBANextPos > 0)
		{
			$EBAUpdateGramWithKey = substr_replace($EBAUpdateGramTemp, "xk=\"" . $key . "\"", $EBANextPos, 5);
			$this->XmlStr = substr_replace($this->XmlStr, $EBAUpdateGramWithKey, $EBAInsertPos);
		}
	}
}


function EBAleft ($str, $howManyCharsFromLeft)
{
	return substr ($str, 0, $howManyCharsFromLeft);
}

function EBAright ($str, $howManyCharsFromRight)
{
	$strLen = strlen ($str);
	return substr ($str, $strLen - $howManyCharsFromRight, $strLen);
}

function EBAmid ($str, $start, $howManyCharsToRetrieve = 0)
{
	$start--;
	if ($howManyCharsToRetrieve == 0)
	$howManyCharsToRetrieve = strlen ($str) - $start;
	return substr ($str, $start, $howManyCharsToRetrieve);
}

function getDateForMysqlDateField($val)
{
	preg_match("#^([0-9]{2})/([0-9]{2})/([0-9]{4})#",$val,$Match);
	return(mktime(0,0,0,$Match[2],$Match[1],$Match[3])); 
}

?>
