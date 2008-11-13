//*****************************************************************************
//* @Title: Test Group Class
//* @File: testgroup.js
//* @Author: EBA_DC\ngentleman
//* @Date: 8/10/2005 12:19:17 PM
//* @Purpose: Implements the control half of the automatic test framework.
//* @Notes: See also testitem.js
//*			Depends on log functions in test.js
//*****************************************************************************

// *****************************************************************************
// *****************************************************************************
// * TestGroup
// *****************************************************************************
/// <class name='TestGroup'>
/// <summary>The automatic testing framework object.</summary>
var TESTGRADE_Fail = 1;
var TESTGRADE_Pass = 0;

var TESTSTATE_NotReady = 2;
var TESTSTATE_Prepping = 20;
var TESTSTATE_Ready = 1;
var TESTSTATE_Working = 10;
var TESTSTATE_Complete = 0;

// *****************************************************************************
// * TestGroup
// *****************************************************************************
/// <function name="TestGroup" access="public">
/// <summary>Test group constructor</summary><remarks></remarks></function>
function TestGroup() 
{
	this.m_TestIds = new Array();
	this.m_Tests = new Array();
}

// *****************************************************************************
// * RegisterTest
// *****************************************************************************
/// <function name="RegisterTest" access="public">
/// <summary>Add a test to the TestGroup</summary>
/// <param name="id" type="string">The id of the new test object.</param>
/// <param name="InitialState" type="enum">TESTSTATE_(status) to initialize the test object with.</param>
/// <remarks></remarks></function>
TestGroup.prototype.RegisterTest = function (id, InitialState)
{
	this.m_TestIds.push(id);
	this.m_Tests[id] = new TestItem(InitialState);
}

// *****************************************************************************
// * Test
// *****************************************************************************
/// <function name="Test" access="public">
/// <summary>Get a test object</summary>
/// <param name="id" type="string">ID of the test wanted</param>
/// <remarks>Envisioning usage as tg.Test("Unbound").SetStatus(TESTSTATE_Complete);</remarks></function>
TestGroup.prototype.Test = function (id)
{
	return this.m_Tests[id];
}

// *****************************************************************************
// * GetTestIds
// *****************************************************************************
/// <function name="GetTestIds" access="public">
/// <summary>Get an array of the test ids</summary><remarks></remarks>
/// <returns type="array">The IDs</returns></function>
TestGroup.prototype.GetTestIds = function ()
{
	return this.m_TestIds;
}

// *****************************************************************************
// * GetGroupGrade
// *****************************************************************************
/// <function name="GetGroupGrade" access="public">
/// <summary>Get the overall grade of the TestGroup</summary><remarks></remarks>
/// <returns type="enum">TESTGRADE_Pass | TESTGRADE_Fail</returns></function>
TestGroup.prototype.GetGroupGrade = function ()
{
	for (var i = 0; i < this.m_TestIds.length; i++)
	{
		//getting values from an associative array is funky in javascript
		//supposedly they are really object members, not array items
		if (this.Test(this.m_TestIds[i]).GetGrade() == TESTGRADE_Fail)
		{
			return TESTGRADE_Fail;
		}
	}
	return TESTGRADE_Pass;
}

// *****************************************************************************
// * GetGroupStatus
// *****************************************************************************
/// <function name="GetGroupStatus" access="public">
/// <summary>Get the overall status of the TestGroup</summary>
/// <remarks>Returns the least progressed state of the collection.</remarks>
/// <returns type="enum">TESTSTATE_Complete | TESTSTATE_Working</returns></function>
TestGroup.prototype.GetGroupStatus = function ()
{
	var notready = false;
	var prepping = false;
	var ready = false;
	var working = false;
	var complete = false;
	
	for (var i = 0; i < this.m_TestIds.length; i++)
	{
		switch (this.Test(this.m_TestIds[i]).GetState())
		{
			case TESTSTATE_NotReady:
				notready = true;
				break;
			case TESTSTATE_Prepping:
				prepping = true;
				break;
			case TESTSTATE_Ready:
				ready = true;
				break;
			case TESTSTATE_Working:
				working = true;
				break;
			case TESTSTATE_Complete:
				complete = true;
				break;
		}
	}
	if (notready) return TESTSTATE_NotReady;
	if (prepping) return TESTSTATE_Prepping;
	if (ready) return TESTSTATE_Ready;
	if (working) return TESTSTATE_Working;
	if (complete) return TESTSTATE_Complete;
}

// *****************************************************************************
// * GetFailedTests
// *****************************************************************************
/// <function name="GetFailedTests" access="public">
/// <summary>Gets the IDs of the tests that failed, and what their reported error was.</summary><remarks></remarks>
/// <returns type="array">Array[n][Test Id, Error Message]</returns></function>
TestGroup.prototype.GetFailedTests = function ()
{
	var results = new Array()
	for (var i = 0; i < this.m_TestIds.length; i++)
	{
		var t = this.Test(this.m_TestIds[i]);
		if (t.GetGrade() == TESTGRADE_Fail)
		{
			results.push(this.m_TestIds[i], t.GetError());
		}
	}
	return results;
}

// *****************************************************************************
// * Finish
// *****************************************************************************
/// <function name="Finish" access="public">
/// <summary>Call when the test is finished; it will signal the results to the framework in standard form.</summary>
/// <remarks></remarks><returns type=""></returns></function>
TestGroup.prototype.Finish = function ()
{
	writeLog(LOG_TestComplete);
	switch (this.GetGroupGrade())
	{
		case TESTGRADE_Fail:
			writeError(LOG_TestFailure);
			break;
		case TESTGRADE_Pass:
			break;
	}
	//TODO: The interface for automatic testing needs to be built in such a way that the viewer can automatically move to the next test, and keep track of all the results.
	//Log final pass/fail.. tell robot to move to next test, etc.
}
/// </class>
