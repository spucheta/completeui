/*
 * Nitobi Complete UI 1.0
 * Copyright(c) 2008, Nitobi
 * support@nitobi.com
 * 
 * http://www.nitobi.com/license
 */

// *****************************************************************************
// *****************************************************************************
// * Debug
// *****************************************************************************
/// <class name='Debug'>
/// <summary>


/// </summary>
// *****************************************************************************
// * Debug Constructor
// *****************************************************************************
// NOTE: DOUBLE SLASHED COMMENTS SO THAT CSHARP GEN DOESN'T CREATE TWO CTORS
// <function name='Debug' access="private" obfuscate='no'>
// <summary>Constructor for Debug</summary>
// <returns type="void"></returns></function>
/**
 * @private
 * @ignore
 */
function Debug()
{
	this.m_CallStack=new Array;
	this.m_CallStackMarker=0;
	try
	{_ebaWatch.value="";}catch(err){}
}

// *****************************************************************************
// * CallStack
// *****************************************************************************
/// <function name='GetCallStack' access='private' obfuscate='no'><summary>

/// </summary><remarks></remarks><returns type='array'>The value of the property.</returns></function>
/**
 * @private
 * @ignore
 */
Debug.prototype.GetCallStack = Debug_GetCallStack;
/**
 * @private
 * @ignore
 */
function Debug_GetCallStack(){return this.m_CallStack;}

/// <function name='SetCallStack' access='private' obfuscate='no'><summary>

/// </summary><param name='CallStack' type='array' >The value of the property you want to set.</param><remarks></remarks><returns type='void'></returns></function>
/**
 * @private
 * @ignore
 */
Debug.prototype.SetCallStack = Debug_SetCallStack;
/**
 * @private
 * @ignore
 */
function Debug_SetCallStack(CallStack){this.m_CallStack = CallStack;}


// *****************************************************************************
// * CurrentFunction
// *****************************************************************************
/// <function name='GetCurrentFunction' access='private' obfuscate='no'><summary>

/// </summary><remarks></remarks><returns type='string'>The value of the property.</returns></function>
/**
 * @private
 * @ignore
 */
Debug.prototype.GetCurrentFunction = Debug_GetCurrentFunction;
/**
 * @private
 * @ignore
 */
function Debug_GetCurrentFunction(){return this.m_CallStack[this.m_CallStackMarker-1];}

// *****************************************************************************
// * State
// *****************************************************************************
/// <function name='GetState' access='private' obfuscate='no'><summary>
/// True if debug is on.
/// </summary><remarks></remarks><returns type='bool'>The value of the property.</returns></function>
/**
 * @private
 * @ignore
 */
Debug.prototype.GetState = Debug_GetState;
/**
 * @private
 * @ignore
 */
function Debug_GetState(){return this.m_State;}

/// <function name='SetState' access='private' obfuscate='no'><summary>
/// True if debug is on.
/// </summary><param name='State' type='bool' >The value of the property you want to set.</param><remarks></remarks><returns type='void'></returns></function>
/**
 * @private
 * @ignore
 */
Debug.prototype.SetState = Debug_SetState;
/**
 * @private
 * @ignore
 */
function Debug_SetState(State){this.m_State = State;}

// *****************************************************************************
// * Assert
// *****************************************************************************
/// <function name='Assert' access='private' obfuscate='no'>
/// <summary></summary>
/// <param name='Condition' type='bool' ></param>
/// <param name='Message' type='string' ></param>
/// </function>
/**
 * @private
 * @ignore
 */
Debug.prototype.Assert = Debug_Assert;
/**
 * @private
 * @ignore
 */
function Debug_Assert(Condition, Message){
	if (!Condition)
		debugger;
	if (this.GetState() && !Condition)
		alert("Assert (" + this.GetCurrentFunction() + "): " + Message + "\nStack trace: \n" + this.ShowCallStack());
}

// *****************************************************************************
// * EnterFunction
// *****************************************************************************
/// <function name='EnterFunction' access='private' obfuscate='no'>
/// <summary></summary>
/// <param name='FunctionName' type='string' ></param>
/// </function>
/**
 * @private
 * @ignore
 */
Debug.prototype.EnterFunction = Debug_EnterFunction;
/**
 * @private
 * @ignore
 */
function Debug_EnterFunction(FunctionName){this.m_CallStack[this.m_CallStackMarker++]=FunctionName;}

// *****************************************************************************
// * ExitFunction
// *****************************************************************************
/// <function name='ExitFunction' access='private' obfuscate='no'>
/// <summary></summary>
/// </function>
/**
 * @private
 * @ignore
 */
Debug.prototype.ExitFunction = Debug_ExitFunction;
/**
 * @private
 * @ignore
 */
function Debug_ExitFunction(){this.m_CallStack[--this.m_CallStackMarker];}

// *****************************************************************************
// * ShowCallStack
// *****************************************************************************
/// <function name='ShowCallStack' access='private' obfuscate='no'>
/// <summary></summary>
/// </function>
/**
 * @private
 * @ignore
 */
Debug.prototype.ShowCallStack = Debug_ShowCallStack;

/**
 * @private
 * @ignore
 */
function Debug_ShowCallStack(){
	var s="";
	var tabs="\t";
	for (var i=0; i<this.m_CallStackMarker; i++)
	{
		s += tabs + this.m_CallStack[i] + "\n";
		tabs+="\t";
	}
	return s;
}

// *****************************************************************************
// * SetWatch
// *****************************************************************************
/// <function name='SetWatch' access='private' obfuscate='no'>
/// <summary></summary>
/// <param name='Variable' type='variant' ></param>
/// <param name='VariableName' type='string' ></param>
/// </function>
/**
 * @private
 * @ignore
 */
Debug.prototype.SetWatch = Debug_SetWatch;
/**
 * @private
 * @ignore
 */
function Debug_SetWatch(VariableName, Variable)
{
	this.EnterFunction('SetWatch');
	try
	{
		_ebaWatch.value = VariableName + " = " + Variable + "\n" + _ebaWatch.value;
		this.ExitFunction();
	}catch(err)
	{
		//Debug.Assert(false,err.message);
		this.ExitFunction();
	}
}

/**
 * @private
 * @ignore
 */
Debug.prototype.Echo = Debug_Echo;
/**
 * @private
 * @ignore
 */
function Debug_Echo(Msg)
{
	this.EnterFunction('Echo');
	try
	{
		_ebaWatch.value = "**" + Msg + "\n" + _ebaWatch.value;
		this.ExitFunction();
	}catch(err)
	{
		//Debug.Assert(false,err.message);
		this.ExitFunction();
	}
}

/**
 * @private
 * @ignore
 */
Debug.prototype.StartTimer = Debug_StartTimer;
/**
 * @private
 * @ignore
 */
function Debug_StartTimer(Timer, TimerId)
{
	try
	{
		Timer.Start(TimerId);
	}
	catch(err)
	{
	}
}

//EbaTimers="";
/**
 * @private
 * @ignore
 */
Debug.prototype.StopTimer = Debug_StopTimer;
/**
 * @private
 * @ignore
 */
function Debug_StopTimer(Timer, TimerId)
{
	try
	{
		Timer.Stop(TimerId);
	}
	catch(err){}
}

/**
 * @private
 * @ignore
 */
Debug.prototype.ShowTimer = Debug_ShowTimer;
/**
 * @private
 * @ignore
 */
function Debug_ShowTimer(Message, Timer, TimerId)
{
	try
	{
		//if (Message.indexOf("Create list")!=-1)
			//this.WriteLog(Message+Timer.GetTime(TimerId)+"ms");
	}
	catch(err){}
}

/**
 * @private
 * @ignore
 */
Debug.prototype.WriteLog = Debug_WriteLog;
/**
 * @private
 * @ignore
 */
function Debug_WriteLog(Message)
{
	try
	{
		writeLog(Message);
	}
	catch(err){}
}

/**
 * @private
 * @ignore
 */
Debug.prototype.StopAndShowTimer = Debug_StopAndShowTimer;
/**
 * @private
 * @ignore
 */
function Debug_StopAndShowTimer(Message, Timer, TimerId)
{
	try
	{
		this.StopTimer(Timer,TimerId);
		this.ShowTimer(Message,Timer,TimerId);
	}
	
	
	catch(err){}
}

/**
 * @private
 * @ignore
 */
Debug.printGlobals = function()
{
	for (var o in window)
	{
		writeLog(o);	
	}
}
/// </class>
