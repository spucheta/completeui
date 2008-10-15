//*****************************************************************************
//* @Title: Timer Class
//* @File: timer.js
//* @Author: EBA_DC\ngentleman
//* @Date: 8/10/2005 12:14:59 PM
//* @Purpose: Implements a Timer class to be used for measuring the duration of ~whatever.
//* @Notes: 
//*****************************************************************************

// *****************************************************************************
// *****************************************************************************
// * Timer
// *****************************************************************************
/// <class name='Timer'>
/// <summary>Use a timer to track duration of code fragment execution, or gap between events.</summary>

// *****************************************************************************
// * Timer
// *****************************************************************************
/// <function name="Timer" access="public">
/// <summary>The timer object</summary><remarks></remarks><example><code>
/// var t = new Timer();
/// t.Start("foo");
/// ...
/// t.Stop("foo");
/// alert(t.GetTime("foo"));
/// </code></example></function>
function Timer()
{
	//Faster still might be push()ing times onto stacks, but this works for now.
	this.startTime = new Array();
	this.stopTime = new Array();
}
// *****************************************************************************
// * Start
// *****************************************************************************
/// <function name="Start" access="public">
/// <summary>Starts a timer</summary>
/// <param name="Which" type="string">The id of the timer you wish to start.</param>
/// <remarks></remarks></function>
Timer.prototype.Start = function (Which)
{
	var now = new Date();
	this.startTime[Which] = now.getTime();
	return false;
}
// *****************************************************************************
// * Stop
// *****************************************************************************
/// <function name="Stop" access="public">
/// <summary>Stops a timer</summary>
/// <param name="Which" type="string">The id of the timer you wish to stop.</param>
/// <remarks>If you stop a timer multiple times, only the last is stored.</remarks></function>
Timer.prototype.Stop = function (Which)
{
	var now = new Date();
	this.stopTime[Which] = now.getTime();
	return false;
}
// *****************************************************************************
// * GetTime
// *****************************************************************************
/// <function name="GetTime" access="public">
/// <summary>Gets the elapsed time between Start() and Stop().</summary>
/// <param name="Which" type="">The id of the timer you wish to query.</param>
/// <remarks></remarks><returns type="int">Elapsed time, in ms</returns></function>
Timer.prototype.GetTime = function (Which)
{
	return (this.stopTime[Which] - this.startTime[Which]);
}
/// </class>