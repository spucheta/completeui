//*****************************************************************************
//* @Title: Test item class
//* @File: testitem.js
//* @Author: EBA_DC\ngentleman
//* @Date: 8/10/2005 12:21:18 PM
//* @Purpose: Implements portion of the automatic test framework that represents individual testlets inside a test page.
//*****************************************************************************

// *****************************************************************************
// *****************************************************************************
// * TestItem
// *****************************************************************************
/// <class name='TestItem'>
/// <summary>Each indiviual test in an automatic test page</summary>

// *****************************************************************************
// * TestItem
// *****************************************************************************
/// <function name="TestItem" access="public">
/// <summary>TestItem Constructor</summary>
/// <param name="InitialState" type="enum">TESTSTATE_(status) to initialize the test object with.</param>
/// <remarks></remarks></function>
function TestItem(InitialState)
{
	this.m_State = InitialState;
	this.m_Grade = "";
	this.m_ErrMessage = "";
}

// *****************************************************************************
// * Grade
// *****************************************************************************
/// <function name="GetGrade" access="public"><summary>The test's grade</summary>
/// <returns type="enum">TESTGRADE_Pass | TESTGRADE_Fail</returns></function>
TestItem.prototype.GetGrade = function ()
{
	if (this.GetState() != TESTSTATE_Complete)
	{
		writeLog("No getting Test Grade before TESTSTATE_Complete");
		// assert() <= needs defining within the test framework
		// SHOULD NOT be an alert() for things that might be called repeatedy, like this.
		// we have a log for a reason.
	}
	return this.m_Grade;
}
/// <function name="SetGrade" access="public"><summary>The test's grade</summary>
/// <param name="Grade" type="enum">TESTGRADE_Pass | TESTGRADE_Fail</param>
/// <param name="ErrorMessage" type="string">Reason for the failure, or null for success.</param></function>
TestItem.prototype.SetGrade = function (Grade, ErrorMessage)
{
	this.m_Grade = Grade;
	this.m_ErrMessage = ErrorMessage;
}
/// <function name="GetError" access="public"><summary>The error encountered</summary>
/// <returns type="string">Reason for the failure, or null for success.</returns></function>
TestItem.prototype.GetError = function ()
{
	return this.m_ErrMessage;
}

// *****************************************************************************
// * State
// *****************************************************************************
/// <function name="GetState" access="public">
/// <summary>The test's state</summary><returns type="enum">TESTSTATE_(status)</returns></function>
TestItem.prototype.GetState = function ()
{
	return this.m_State
}
/// <function name="SetState" access="public">
/// <summary>The test's state</summary><param name="State" type="enum">TESTSTATE_(status)</param></function>
TestItem.prototype.SetState = function (State)
{
	this.m_State = State;
}
/// </class>

