<cfheader name="Content-Type" value="text/xml">
<cfset ebax = GetHttpRequestData()>
<cfset ebaXMLBlock = ebax.content>
<cfset ebaoXMLBlock = ebaXMLBlock>


<cfscript>

EBAFieldsArray = arrayNew(1);
EBAFieldsIndex = arrayNew(1);
EBASaveHandler_ReturnInsertCount = 0;
EBASaveHandler_ReturnUpdateCount = 0;
EBASaveHandler_ReturnDeleteCount = 0;
EBAInsertArray = arrayNew(1);
EBAUpdateArray = arrayNew(1);
EBADeleteArray = arrayNew(1);
EBAGetHandlerXMLBlock = "";
EBAGetHandlerRecordCount = 0;
TestVar = ebaoXMLBlock;


function EBAGetHandler_ProcessRecords()
{


	Var XmlFieldBlock = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,ba,bb,bc,bd,be,bf,bg,bh,bi,bj,bk,bl,bm,bn,bo,bp,bq,br,bs,bt,bu,bv,bw,bx,by,bz,ac,cb,cc,cd,ce,cf,cg,ch,ci,cj,ck,cl,cm,cn,co,cp,cq,cr,cs,ct,cu,cv,cw,cx,cy,cz,ad,db,dc,dd,de,df,dg,dh,di,dj,dk,dl,dm,dn,do,dp,dq,dr,ds,dt,du,dv,dw,dx,dy,dz,ae,eb,ec,ed,ee,ef,eg,eh,ei,ej,ek,el,em,en,eo,ep,eq,er,es,et,eu,ev,ew,ex,ey,ez,fa,fb,fc,fd,fe,ff,fg,fh,fi,fj,fk";
	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "<?xml version=""1.0"" encoding=""utf-8"" ?><root xml:lang=""en"" fields=""";
	EBAFieldsIndex = ListToArray(XmlFieldBlock, ",");

}

function EBAGetHandler_ProcessEvents()
{
	EBAGetHandler_ProcessRecords();
	EBAGetHandler_DefineField("startdate");
	EBAGetHandler_DefineField("enddate");
	EBAGetHandler_DefineField("location");
	EBAGetHandler_DefineField("description");
	EBAGetHandler_DefineField("type");
}

function EBAGetHandler_CreateEvent(key, startDate, endDate, location, description)
{
	EBAGetHandler_CreateNewRecord(key);
	EBAGetHandler_DefineRecordFieldValue("startdate", startDate);
	EBAGetHandler_DefineRecordFieldValue("enddate", endDate);
	EBAGetHandler_DefineRecordFieldValue("location", location);
	EBAGetHandler_DefineRecordFieldValue("description", description);
	EBAGetHandler_DefineRecordFieldValue("type", "event");
	EBAGetHandler_SaveRecord();
}

function EBAGetHandler_DisableDate(date)
{
	EBAGetHandler_CreateNewRecord(0);
	EBAGetHandler_DefineRecordFieldValue("startdate", date);
	EBAGetHandler_DefineRecordFieldValue("enddate", "");
	EBAGetHandler_DefineRecordFieldValue("location", "");
	EBAGetHandler_DefineRecordFieldValue("description", "");
	EBAGetHandler_DefineRecordFieldValue("type", "disabled");
	EBAGetHandler_SaveRecord();
}

function EBAGetHandler_SetTotalRowCount(rowCount)
{
	EBAGetHandlerTotalRowCount = rowCount;
	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """ totalrowcount=""" & rowCount & "";
}

function EBAGetHandler_DefineField(FieldName)
{

	EBAFieldsArray[ArrayLen(EBAFieldsArray)+1] = FieldName;

	if (ArrayLen(EBAFIeldsArray) GT 1)

	{
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "|";
	}
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & FieldName;

}

function EBAGetHandler_DefineForeignKey(FieldName)
{
	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """ parentfield=""" & FieldName & """";
}

function EBAGetHandler_DefineForeignKeyValue(Value)
{
	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & " parentvalue=""" & Value;
}


function EBAGetHandler_DefineRecordFieldValue(FieldName, FieldValue)
{
	Var EBALoop = 0;

	Var FieldID = 0;

	Var FieldStart = 0;

	Var FieldColumn = "";


	for(EBALoop=1; EBALoop LTE arrayLen(EBAFieldsArray); EBALoop = EBALoop + 1)
	{

		if (Compare(FieldName, EBAFieldsArray[EBALoop]) EQ 0)
		{
			FieldID = EBALoop;

		}


	}

	if (FieldID GT 0)
	{
		FieldColumn = EBAFieldsIndex[FieldID];

		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & " " & FieldColumn & "=""" & EBAStripCorruptingChars(FieldValue) & """";
	}
}


function EBAGetHandler_CreateNewRecord(PrimaryKey)
{

	EBAGetHandlerRecordCount = EBAGetHandlerRecordCount + 1;

	if (EBAGetHandlerRecordCount EQ 1)
	{
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """ keys=""";
		for(EBALoop=1; EBALoop LTE arrayLen(EBAFieldsArray); EBALoop = EBALoop + 1)
		{
			EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & EBAFieldsArray[EBALoop];
			if (EBALoop LT arrayLen(EBAFieldsArray)) {
				EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "|";
			}
		}
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """>";
	}

	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "<e xk=""" & EBAStripCorruptingChars(PrimaryKey) & """ ";

}


function EBAGetHandler_SaveRecord()
{

	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & " />";

}


function EBAGetHandler_CompleteGet()
{

	if (EBAGetHandlerRecordCount EQ 0)
	{
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """ keys=""";
		for(EBALoop=1; EBALoop LTE arrayLen(EBAFieldsArray); EBALoop = EBALoop + 1)
		{
			EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & EBAFieldsArray[EBALoop];
			if (EBALoop LT arrayLen(EBAFieldsArray)) {
				EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "|";
			}
		}
		EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & """>";
	}

	EBAGetHandlerXMLBlock = EBAGetHandlerXMLBlock & "</root>";
	getPageContext().getOut().clearBuffer();
	WriteOutput(EBAGetHandlerXMLBlock);

}


function EBAStripCorruptingChars(DirtyString){
	DirtyString = Replace(DirtyString, "'", "", "ALL");
	DirtyString = Replace(DirtyString, chr(38), "", "ALL");
	DirtyString = Replace(DirtyString, chr(39), "", "ALL");
	DirtyString = Replace(DirtyString, chr(34), "", "ALL");
	DirtyString = Replace(DirtyString, chr(60), "", "ALL");
	DirtyString = Replace(DirtyString, chr(62), "", "ALL");
	DirtyString = XMLFormat(DirtyString);
	return(DirtyString);
}



function EBASaveHandler_ProcessRecords()
{
  	Var FieldStart = 0;
  	Var FieldBlock = "";
  	Var XmlFieldBlock = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am,an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,ba,bb,bc,bd,be,bf,bg,bh,bi,bj,bk,bl,bm,bn,bo,bp,bq,br,bs,bt,bu,bv,bw,bx,by,bz,ac,cb,cc,cd,ce,cf,cg,ch,ci,cj,ck,cl,cm,cn,co,cp,cq,cr,cs,ct,cu,cv,cw,cx,cy,cz,ad,db,dc,dd,de,df,dg,dh,di,dj,dk,dl,dm,dn,do,dp,dq,dr,ds,dt,du,dv,dw,dx,dy,dz,ae,eb,ec,ed,ee,ef,eg,eh,ei,ej,ek,el,em,en,eo,ep,eq,er,es,et,eu,ev,ew,ex,ey,ez";
  	Var TempString = "";

  	FieldStart = Find("fields", ebaXMLBlock, 1);
  	ebaXMLBlock = Right(ebaXMLBlock, (len(ebaXMLBlock)-FieldStart));
  	FieldStart = Find("""", ebaXMLBlock, 1);
  	ebaXMLBlock = Right(ebaXMLBlock, (len(ebaXMLBlock)-FieldStart));
  	FieldStart = Find("""", ebaXMLBlock, 1);
 	FieldBlock = Left(ebaXMLBlock, (FieldStart-1));
  	ebaXMLBlock = Right(ebaXMLBlock, (len(ebaXMLBlock)-FieldStart));

 	EBAFieldsArray = ListToArray(FieldBlock, "|");
 	EBAFieldsIndex = ListToArray(XmlFieldBlock, ",");

	// Count the inserts

	TempString = ebaXMLBlock;

	DO
	{
		FieldStart = Find("<insert", TempString, 1);
		IF (FieldStart GT 0)
		{
			EBASaveHandler_ReturnInsertCount = EBASaveHandler_ReturnInsertCount + 1;
			TempString = Right(TempString, (len(TempString)-FieldStart)-2);
			FieldStart = Find(">", TempString, 1);
			EBAInsertArray[EBASaveHandler_ReturnInsertCount] = Left(TempString, FieldStart);

		}
	} WHILE (FieldStart GT 0);

	// Count the updates

	TempString = ebaXMLBlock;

	DO
	{
		FieldStart = Find("<update", TempString, 1);
		IF (FieldStart GT 0)
		{
			EBASaveHandler_ReturnUpdateCount = EBASaveHandler_ReturnUpdateCount + 1;
			TempString = Right(TempString, (len(TempString)-FieldStart)-2);
			FieldStart = Find(">", TempString, 1);
			EBAUpdateArray[EBASaveHandler_ReturnUpdateCount] = Left(TempString, FieldStart);

		}
	} WHILE (FieldStart GT 0);


	// Count the deletes

	TempString = ebaXMLBlock;

	DO
	{
		FieldStart = Find("<delete", TempString, 1);
		IF (FieldStart GT 0)
		{
			EBASaveHandler_ReturnDeleteCount = EBASaveHandler_ReturnDeleteCount + 1;
			TempString = Right(TempString, (len(TempString)-FieldStart)-2);
			FieldStart = Find(">", TempString, 1);
			EBADeleteArray[EBASaveHandler_ReturnDeleteCount] = Left(TempString, FieldStart);

		}
	} WHILE (FieldStart GT 0);


}

function EBASaveHandler_ReturnForeignKeyValue(RowNumber)
{
	return EBASaveHandler_ReturnInsertField(RowNumber, "FK");
}


function EBASaveHandler_ReturnInsertField(RowNumber, FieldName)
{
	Var FieldValue = "";

	Var EBALoop = 0;

	Var FieldID = 0;

	Var FieldStart = 0;

	Var FieldColumn = "";

	if (CompareNoCase(FieldName, "EBA_PK") EQ 0)
	{

		FieldColumn = "xk";
		FieldID = 99;

	} 
	else if (CompareNoCase(FieldName, "FK") EQ 0)
	{
		FieldColumn = "xf";
		FieldID = 88;
	}
	else
	{

		for(EBALoop=1; EBALoop LTE arrayLen(EBAFieldsArray); EBALoop = EBALoop + 1)
		{

			if (Compare(FieldName, EBAFieldsArray[EBALoop]) EQ 0)
			{
				FieldID = EBALoop;

			}


		}

		if (FieldID GT 0)
		{

			FieldColumn = EBAFieldsIndex[FieldID];

		}

	}


	FieldValue = EBAInsertArray[RowNumber];

	FieldStart = Find(" " & FieldColumn & "=""", FieldValue, 1);

	FieldValue = Right(FieldValue, (len(FieldValue)-FieldStart)-2-len(FieldColumn));

	FieldStart = Find("""", FieldValue, 1);

	if ((FieldStart-1) GTE 1) {

		FieldValue = Left(FieldValue, FieldStart-1);

	} else
	{
		FieldValue = "";
	}

	if (FieldID EQ 0)
	{
		FieldValue = "undefined";
	}

	Return FieldValue;

}



function EBASaveHandler_ReturnUpdateField(RowNumber, FieldName)
{
	Var FieldValue = "";

	Var EBALoop = 0;

	Var FieldID = 0;

	Var FieldStart = 0;

	Var FieldColumn = "";

	if (CompareNoCase(FieldName, "EBA_PK") EQ 0)
	{

		FieldColumn = "xk";
		FieldID = 99;

	} else
	{

		for(EBALoop=1; EBALoop LTE arrayLen(EBAFieldsArray); EBALoop = EBALoop + 1)
		{

			if (Compare(FieldName, EBAFieldsArray[EBALoop]) EQ 0)
			{
				FieldID = EBALoop;

			}


		}

		if (FieldID GT 0)
		{

			FieldColumn = EBAFieldsIndex[FieldID];

		}

	}

	FieldValue = EBAUpdateArray[RowNumber];

	FieldStart = Find(" " & FieldColumn & "=""", FieldValue, 1);

	FieldValue = Right(FieldValue, (len(FieldValue)-FieldStart)-2-len(FieldColumn));

	FieldStart = Find("""", FieldValue, 1);

	if ((FieldStart-1) GTE 1) 
	{
		FieldValue = Left(FieldValue, FieldStart-1);
	} 
	else
	{
		FieldValue = "";
	}

	if (FieldID EQ 0)
	{
		FieldValue = "undefined";
	}
	Return FieldValue;
}

function EBASaveHandler_ReturnDeleteField(RowNumber, FieldName)
{
	Var FieldValue = "";
	Var EBALoop = 0;
	Var FieldID = 0;
	Var FieldStart = 0;
	Var FieldColumn = "";
	FieldName = "EBA_PK";

	if (CompareNoCase(FieldName, "EBA_PK") EQ 0)
	{
		FieldColumn = "xk";
		FieldID = 99;
	} 
	else
	{
		FieldID = 0;
	}

	FieldValue = EBADeleteArray[RowNumber];
	FieldStart = Find(" " & FieldColumn & "=""", FieldValue, 1);
	FieldValue = Right(FieldValue, (len(FieldValue)-FieldStart)-2-len(FieldColumn));
	FieldStart = Find("""", FieldValue, 1);
	if ((FieldStart-1) GTE 1) 
	{
		FieldValue = Left(FieldValue, FieldStart-1);
	} 
	else
	{
		FieldValue = "";
	}

	if (FieldID EQ 0)
	{
		FieldValue = "undefined";
	}
	Return FieldValue;
}

function EBASaveHandler_SetRecordKey(recordNumber, key)
{
	Var record = EBAInsertArray[recordNumber];
	Var pos = Find(record, ebaoXMLBlock, 0);
	Var rightSubstr = Right(ebaoXMLBlock, Len(ebaoXMLBlock) - pos);
	Var leftSubstr = Left(ebaoXMLBlock, pos);
	Var recordWithKey = Replace(rightSubstr, "xk=""""", "xk=""" & key & """");
	
	TestVar = leftSubstr & recordWithKey;
}


function EBASaveHandler_CompleteSave()
{
	getPageContext().getOut().clearBuffer();
	//WriteOutput(ebaoXMLBlock);
	WriteOutput(TestVar);
}
</cfscript>
