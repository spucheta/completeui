//*****************************************************************************
//* @Title: PerformanceMonitor Class
//* @File: eba.performancemonitor.js
//* @Author: EBA_DC\djohnson
//* @Date: 27/02/2006
//* @Purpose: Implements a performance monitor class to be used for un-invasively
//*	monitoring the time it takes for functions to be called.
//* @Notes: 
//*****************************************************************************

// *****************************************************************************
// *****************************************************************************
// * PerformanceMonitor
// *****************************************************************************
/// <class name='PerformanceMonitor'>
/// <summary>Splice in timer code around method calls.</summary>

// *****************************************************************************
// * PerformanceMonitor
// *****************************************************************************
/// <function name="register" access="public">
/// <summary>Registers a function to be timed.</summary><remarks></remarks><example><code>
/// Eba.PerformanceMonitor.register("methodOfMyObject", myObject);
/// </code></example></function>

if (!Eba)
	Eba = {}:

Eba.PerformanceMonitor = {
		funcs:[],
		function_index:[],
		report:"";

		register: function(funcName, objRef)
		{
			objRef[funcName+'-base'] = objRef[funcName];
			this.funcs[funcName] = objRef[funcName+'-base'];
			var _this = this;
			objRef[funcName] = function() {_this.dispatch(arguments, funcName);};
		},


		dispatch: function(args, funcName)
		{
			var s = new Date().getTime();
			this.funcs[funcName].apply(this.funcs[funcName], args);
			//	need to ave the results of the bench
			//	check the caller ... somehow
			this.report += "Calling function: " + funcName + " - Duration: " + (new Date().getTime() - s);
		},

		unregister: function(funcName, objRef)
		{
			objRef[funcName] = null;
			objRef[funcName] = objRef[funcName+'-base'];
			objRef[funcName+'-base'] = null;
		},

		_pack:function(){
			var aTemp1=FunctionMonitor.functions, aTemp2=FunctionMonitor.function_index, iL, i=0, iIndex, vD;
			FunctionMonitor.functions=[];
			FunctionMonitor.function_index=[];
			iL=aTemp2.length;
			for(;i<iL;i++){
				if(aTemp2[i]!=null){
					iIndex=FunctionMonitor.function_index.length;
					FunctionMonitor.function_index[iIndex]=aTemp2[i];
					vD=aTemp1[aTemp2[i]];
					vD.index=iIndex;
					FunctionMonitor.functions[aTemp2[i]]=vD;	
				}
			}
		},
/*
		register:function(sFunctionName,sObjRef,aParams){
			var vFP, sFuncStore, iIndex=-1;
	
			if(!sObjRef){
				vFP=oFrame[sFunctionName];
			}
			else{
				vFP=oFrame[sObjRef];
				if(vFP){
					if(vFP.prototype) vFP=vFP.prototype[sFunctionName];
					else vFP = vFP[sFunctionName];
				}
			}
	
			if(typeof(vFP)=="function"){
				if(sFrameName!="window") sRefer=sFrameName + "-";
				if(sClassRef) sRefer+=sClassRef + "--";
				sFuncStore="dispatch-" + sRefer + sFunctionName;
				if(!FunctionMonitor.functions[sFuncStore]){
					iIndex=FunctionMonitor.function_index.length;
					FunctionMonitor.function_index[iIndex]=sFuncStore;
				}
				else{
					iIndex=FunctionMonitor.functions[sFuncStore].index;
				}
				FunctionMonitor.functions[sFuncStore] = 
					{name:sFunctionName,classRef:sClassRef,refName:sFrameName,ref:oFrame,fp:vFP,index:iIndex,metrics:[],stackCount:0};
				eval('FunctionMonitor["' + sFuncStore + '"]=function(){return FunctionMonitor.dispatch("' + sFuncStore + '",this,arguments);}');

				if(!sClassRef){
					oFrame[sFunctionName]=FunctionMonitor[sFuncStore];
				}
				else{
					if(oFrame[sClassRef].prototype) oFrame[sClassRef].prototype[sFunctionName]=FunctionMonitor[sFuncStore];
					else oFrame[sClassRef][sFunctionName]=FunctionMonitor[sFuncStore];
				}
		
				if(oFrame.onload==vFP) oFrame.onload=FunctionMonitor[sFuncStore];
			}
			else{
				alert(sFunctionName + " is not a function");
			}
		},
*/
		makeMetric : function(){
			return {start:null,stop:null,valOffset:-1,route:null,monStatus:-1,duration:-1,caller:null,parentName:null};
		},
/*
	dispatch : function(sFuncStore,vThis,aArgs){
		var retVal, vFun = FunctionMonitor.functions[sFuncStore], z, vMet, vCaller, sCaller, oFr, d, iZ, iMLen, vM, iM1, iM2;
		if(!vFun){
			if(!FunctionMonitor.alert_error){
				FunctionMonitor.alert_error = 1;
				alert("Error: invalid function reference: " + sFuncStore);
			}
			return;
		}
		z=new Date();
		vMet=this.makeMetric();
		vCaller=null;
		sCaller=null;
		if(FunctionMonitor.dispatch.caller && FunctionMonitor.dispatch.caller.caller){
			vCaller=FunctionMonitor.dispatch.caller.caller;
		}
		if(FunctionMonitor.can_trace) vMet.route=FunctionMonitor.traceRoute(vCaller);
		oFr=vFun.ref;
		d=new Date();
		vMet.start=d.getTime();	

		try{


			if(!vFun.classRef){
				retVal=vFun.fp.apply(vCaller,aArgs);
			}
			else{
				retVal=vFun.fp.apply(vThis,aArgs);
			}
			vMet.monStatus=1;

		}
		catch(e){
			vMet.monStatus=2;
			retVal=e;
		}

		d=new Date();
		vMet.stop=d.getTime();

		iZ=z.getTime();
		z=new Date();
		vMet.valOffset=z.getTime() - iZ - (vMet.stop - vMet.start);		
		iMLen;
		if(FunctionMonitor.stack_len > 0){
			if(vFun.stackCount >= FunctionMonitor.stack_len) vFun.stackCount=0;
			iMLen=vFun.stackCount;
			vM=vFun.metrics[iMLen];			
			if(vM){
				iM1=vM.stop - vM.start;
				iM2=vMet.stop - vMet.start;
				if(iM1 > iM2) vMet=vM;
			}
			vFun.stackCount++;
		}
		else{
			iMLen=vFun.metrics.length;
		}
		vFun.metrics[iMLen]=vMet;
		return retVal;
	},
*/
	traceRoute:function(vFP){
		var retVal="",aRoute=[],iCounter=0, sName;
		if(vFP != null){
			while(vFP && vFP != null ){
				sName=FunctionMonitor.getFunctionName(vFP.toString());
				if(sName==null){
					vFP=null;
					break;
				}
				aRoute.push(sName);
				vFP=vFP.caller;
			}
			retVal = aRoute.reverse().join("->");
		}
		else{
			retVal="null";
		}
		return retVal;
	},

	getFunctionName:function(sFP){
		var aM=sFP.match(/function\s([A-Za-z0-9_]*)\(/gi);	
		if(sFP==null) return sFP;
	
		if(aM!=null && aM.length){
			sFP=aM[0];
			sFP=sFP.replace(/^function\s+/,"");
			sFP=sFP.replace(/^\s*/,"");
			sFP=sFP.replace(/\s*$/,"");
			sFP=sFP.replace(/\($/,"");
			return sFP;
		}
		else{
			return null;
		}
	}
}