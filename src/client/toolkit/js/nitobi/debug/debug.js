/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
/**
 * @private
 * @deprecated nitobi.lang.throwError should be used
 */
function ntbAssert(predicate ,errorMessage, errorCode, errorSeverity) 
{
}


nitobi.lang.defineNs("console");
nitobi.lang.defineNs("nitobi.debug");

if (typeof(console.log) == "undefined")
{
	/**
	 * Write to the console.
	 * @param {String} s The string to write.
	 */
	console.log = function(s)
	{
		nitobi.debug.addDebugTools();
		var t = $ntb('nitobi.log');
		t.value = s + "\n" + t.value 
	}
	
	console.evalCode = function()
	{
		var result = (eval($ntb("nitobi.consoleEntry").value));
		console.log(result.toString());
	}
}

/**
 * This function will create a textarea in which debug information can be written to.
 */
nitobi.debug.addDebugTools = function()
{
	var sId = 'nitobi_debug_panel';
	var div = document.getElementById(sId);
	var html = "<table width=100%><tr><td width=50%><textarea style='width:100%' cols=125 rows=25 id='nitobi.log'></textarea></td><td width=50%><textarea style='width:100%' cols=125 rows=25 id='nitobi.consoleEntry'></textarea><br/><button onclick='console.evalCode()'>Eval</button></td></tr></table>";
	if (div == null)
	{
		var div = document.createElement("div");
		div.setAttribute('id', sId);
		div.innerHTML = html;
		document.body.appendChild(div);
	}
	else if (div.innerHTML == "")
		div.innerHTML = html;
}

/**
 * @private
 * @deprecated Use nitobi.lang.throwError instead.
 */
 nitobi.debug.assert = function()
 {
 		
 }
 
 
/**
 * This should all be deleted.
 */

/**
 * @ignore
 * @private
 */
EBA_EM_ATTRIBUTE_ERROR 		  	= 1;  
/**
 * @ignore
 * @private
 */
EBA_XHR_RESPONSE_ERROR			= 2;
/**
 * @ignore
 * @private
 */
EBA_DEBUG = "debug";
/**
 * @ignore
 * @private
 */
EBA_WARN  = "warn";
/**
 * @ignore
 * @private
 */
EBA_ERROR = "error";
/**
 * @ignore
 * @private
 */
EBA_THROW = "throw";
/**
 * @ignore
 * @private
 */
EBA_DEBUG_MODE = false;
/**
 * @ignore
 * @private
 */
EBA_ON_ERROR        = "";
/**
 * @ignore
 * @private
 */
EBA_LAST_ERROR      = "";
/**
 * @ignore
 * @private
 */
_ebaDebug = false;

/**
 * @ignore
 * @private
 */
NTB_EM_ATTRIBUTE_ERROR 		  	= 1;  
/**
 * @ignore
 * @private
 */
NTB_XHR_RESPONSE_ERROR			= 2;
/**
 * @ignore
 * @private
 */
NTB_DEBUG = "debug";
/**
 * @ignore
 * @private
 */
NTB_WARN  = "warn";
/**
 * @ignore
 * @private
 */
NTB_ERROR = "error";
/**
 * @ignore
 * @private
 */
NTB_THROW = "throw";
/**
 * @ignore
 * @private
 */
NTB_DEBUG_MODE = false;
/**
 * @ignore
 * @private
 */
NTB_ON_ERROR        = "";
/**
 * @ignore
 * @private
 */
NTB_LAST_ERROR      = "";
/**
 * @ignore
 * @private
 */
_ebaDebug = false;
/**
 * @ignore
 * @private
 */
function _ntbAssert(condition, description)
{
	ntbAssert(condition,description,"",DEBUG);
}

/**
 * @ignore
 * @private
 */
function ebaSetOnErrorEvent(handler)
{
	nitobi.debug.setOnErrorEvent.apply(this, arguments);
}

/**
 * @ignore
 * @private
 */
nitobi.debug.setOnErrorEvent = function(handler)
{
	NTB_ON_ERROR = handler;
};

/**
 * @ignore
 * @private
 */
function ebaReportError(errorMessage, errorCode, errorSeverity){
	nitobi.debug.errorReport("dude stop calling this method it is now called nitobi.debug.errorReport","");
	nitobi.debug.errorReport(errorMessage, errorCode, errorSeverity);
}

/**
 * @ignore
 * @private
 */
function ebaErrorReport(errorMessage, errorCode, errorSeverity) 
{
	nitobi.debug.errorReport.apply(this, arguments);
}

/**
 * @ignore
 * @private
 */
nitobi.debug.errorReport = function(errorMessage, errorCode, errorSeverity) 
{
	// if empty set to debug
	errorSeverity = (errorSeverity)?errorSeverity:NTB_DEBUG;

	if(NTB_DEBUG == errorSeverity && !NTB_DEBUG_MODE)
	{
		// maybe set a lastdebug anyway
		return;
	}	

	 var errorString  =   errorMessage          +
	                      "\nerror code    ["  +
	                      errorCode             +
	                      "]\nerror Severity["  +
	                      errorSeverity         +
	                      "]";

	LastError = errorString;
	
	
	//this should be made into an object with each spreadsheet creating an instance of error reporter
	if(eval(NTB_ON_ERROR || "true"))
	{	
		switch(errorCode)
		{		
			case NTB_EM_ATTRIBUTE_ERROR:
				confirm(errorMessage);
			break;
			case NTB_XHR_RESPONSE_ERROR:
				confirm(errorMessage);
			break;
			default:
				window.status = errorMessage;	
			break;
		}		
	}
	if(NTB_THROW == errorSeverity)
	{
		throw(errorString);
	}
}