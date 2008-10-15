/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
var EbaComboUiServerError=0;
var EbaComboUiNoRecords=1;
var EbaComboUiEndOfRecords=2;
var EbaComboUiNumRecords=3;
var EbaComboUiPleaseWait=4;

/**
 * @private
 */
nitobi.combo.createLanguagePack = function()
{
	try
	{
		if ( typeof ( EbaComboUi ) == "undefined" )
		{
			EbaComboUi = new Array();
			EbaComboUi[EbaComboUiServerError]="The ComboBox tried to retrieve information from the server, but an error occured. Please try again later.";
			EbaComboUi[EbaComboUiNoRecords]="No new records.";
			EbaComboUi[EbaComboUiEndOfRecords]="End of records.";
			EbaComboUi[EbaComboUiNumRecords]=" records.";
			EbaComboUi[EbaComboUiPleaseWait]="Please Wait...";
		}
	}
	catch(err)
	{
		alert("The default language pack could not be loaded.  " + err.message);
	}
}





