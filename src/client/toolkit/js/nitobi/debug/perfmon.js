/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */
//*****************************************************************************
//* @Title: PerfMon Class
//* @File: eba.PerfMon.js
//* @Author: EBA_DC\djohnson
//* @Date: 27/02/2006
//* @Purpose: Implements a performance monitor class to be used for un-invasively
//*	monitoring the time it takes for functions to be called.
//* @Notes: 
//*****************************************************************************

// *****************************************************************************
// *****************************************************************************
// * PerfMon
// *****************************************************************************
/// <class name='PerfMon'>
/// <summary>Splice in timer code around method calls.</summary>

// *****************************************************************************
// * PerfMon
// *****************************************************************************
/// <function name="register" access="public">
/// <summary>Registers a function to be timed.</summary><remarks></remarks><example><code>
/// nitobi.debug.PerfMon.register("methodOfMyObject", myObject);
/// </code></example></function>

nitobi.lang.defineNs("nitobi.debug");

nitobi.debug.PerfMon = {
		funcs:[],
		objects:[],
		function_index:[],
		report:"",
		inline:[],
		currentLevel:0,
		callerFunc:[],

		register: function(funcName, objRef)
		{
			if (objRef[funcName] instanceof Function)
			{
				objRef[funcName+'_base'] = objRef[funcName];
				objRef[funcName] = function()
				{
					var args = [];
					for (var i=0; i<arguments.length; i++)
					{
						args[i] = arguments[i];
					}
					
					// This is the first call ...
					// Get the current level as the previous plus 1
					var callingFunc = nitobi.debug.PerfMon.callerFunc[nitobi.debug.PerfMon.callerFunc.length-1];
					//nitobi.debug.PerfMon.currentLevel = nitobi.debug.PerfMon.currentLevel + 1;

					// Set the caller method name for the next method.
					nitobi.debug.PerfMon.callerFunc.push(funcName);

var tabs = '';
for (var i=0; i<nitobi.debug.PerfMon.currentLevel; i++)
{
	tabs += '\t';
}

nitobi.debug.PerfMon.report += "Calling " + funcName + "\tFrom " + callingFunc + "\t" + nitobi.debug.PerfMon.callerFunc.length + "\t" + tabs + "\t\n";

					var s =new Date().getTime();

					var retVal = objRef[funcName+'_base'].apply(objRef, args);
					//	need to ave the results of the bench
					//	check the caller ... somehow
					nitobi.debug.PerfMon.callerFunc.pop();

nitobi.debug.PerfMon.report += "Done " + funcName + "\tFrom " + callingFunc + "\t" + nitobi.debug.PerfMon.callerFunc.length + "\t" + tabs + "\t" + (new Date().getTime() - s) + "\n";
					return retVal;
				};
			}
		},
		
		registerAll: function(klass)
		{
			for (var item in klass)
			{
				if (item.indexOf('_base') > 0)
					continue;
				this.register(item, klass);
			}
		},

		dispatch: function(args, funcName)
		{

		},

		unregister: function(funcName, objRef)
		{
			objRef[funcName] = null;
			objRef[funcName] = objRef[funcName+'_base'];
			objRef[funcName+'_base'] = null;
		},

		start: function(id)
		{
			this.inline[id] = new Date().getTime();
		},

		stop: function(id)
		{
			this.report += "Inline monitor: " + id + " - Duration: " + (new Date().getTime() - this.inline[id]) + "\n";
		}
}