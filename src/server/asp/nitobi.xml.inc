<%

randomize ' Initialize random-number generator.

' *****************************************************************************
' *****************************************************************************
' * EBAXML ASP Library v2.5
' *****************************************************************************
' *****************************************************************************

	' * The EBA_GetHandler is a state machine that with EBA_GetHandlerArray and 
	' * EBA_GetHandlerFields as core elements.  The EBAGetHandler state machine
	' * operates as follows:
	' * NOT INIT -> INIT STATE -> FIELDS DEFINED STATE -> RECORD INIT STATE -> \
	' * ADD FIELDS TO RECORD STATE -> (back to) FIELDS DEFINED STATE  
	
	' * 1. NOT INIT -> INIT STATE: EBAGetHandler_ProcessRecords is called
	' * 1.1. init Response
	' *	1.2. allocate space for EBA_GetHandlerFieldNames array
	' * 1.3. init EBA_Converter and set EBAXMLConverter.KeyFieldName to "key"
	' *
	' * 2. INIT STATE -> FIELDS DEFINED STATE EBAGetHandler_DefineField(FieldName) is called for each field
	' * precondition: EBAGetHandler_ProcessRecords
	' * 2.1. FieldName parameter is added to the EBA_Converter
	' * 2.2. EBA_GetHandlerFields is incremented
	' * 2.3. EBA_GetHandlerFieldNames[current] = field
	' *
	' * 3. FIELDS DEFINED STATE -> RECORD INIT STATE EBAGetHandler_CreateNewRecord(ID)
	' * 3.1 global EBA_GetHandlerArray has space allocated
	' * 3.2 The array length is EBA_GetHandlerFields+1
	' * 3.3The arrays [0] positions value is set to the indexFieldValue parameter
	' * 3.3 The IndexFieldValue is the id for the Record
	' * precondition: EBAGetHandler_DefineField. EBAGetHandler_ProcessRecords
	' *
	' * 4. RECORD INIT STATE -> ADD FIELDS TO RECORD STATE EBAGetHandler_DefineRecordFieldValue
	' * finds the index number of the ColumnName in the EBA_GetHandlerFieldNames
	' *	The GetHandlerArray for index is set to the value of FieldValue
	' * precondition: EBAGetHandler_ProcessRecords,EBAGetHandler_CreateNewRecord,
	' *               EBAGetHandler_DefineField
	' * 5. ADD FIELDS TO RECORD STATE -> FIELDS DEFINED STATE EBAGetHandler_SaveRecord
	' * calls EBA_Converter.AddRecord(EBA_GetHandlerArray)


' *****************************************************************************
' *****************************************************************************
' * EBALocaleConverter
' *****************************************************************************
'''/// <class name="EBALocaleConverter">
'''/// <summary>
'''/// This class enables the codePage to be set while data is being input into EBARecords
'''/// The codePage will be set to 65001 (Unicode) before the xml is returned to the client
'''/// See: http://www.microsoft.com/windows2000/en/server/iis/default.asp?url=/windows2000/en/server/iis/htm/asp/eadg6e7n.htm
'''/// </summary>
Class EBALocaleConverter

	' *****************************************************************************
	' * Function Initialize
	' *****************************************************************************
	'''/// <function name="Initialize" access="public">
	'''/// <summary>Initializes the object. Call this before anything else.</summary>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function Initialize()
		'default code page
		Session.CodePage = 65001
	End Function

End Class
'''///</class>

' *****************************************************************************
' *****************************************************************************
' * EBAJISLocaleConverter
' *****************************************************************************
'''/// <class name="EBAJISLocaleConverter"> 
'''/// <summary>
'''/// This class enable the code page to be set while data is being input into EBARecords
'''/// The code page will be set to 50220 (Japanese(JIS)) before the xml is returned to the client
'''/// </summary>
Class EBAJISLocaleConverter

	' *****************************************************************************
	' * Function Initialize
	' *****************************************************************************
	'''/// <function name="Initialize" access="public">
	'''/// <summary>set Session codepage.</summary>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function Initialize()
		'default code page
		Session.CodePage = 50220
	End Function

End Class
'''///</class>

' *****************************************************************************
' * Globals
' *****************************************************************************
'''/// <class name="EBAGlobal"> 
'''/// <summary>
'''/// This is a pseudo class for the global ASP functions and properties
'''/// </summary>
	dim EBA_Converter
	dim EBA_updategramRecords

	' * The EBA_GetHandlerArray is the core of the EBAXML.inc Gethandlder functionality
	' * array of fields
        ' * The array is created with space allocated for EBA_GetHandlerFields+1 elements
        ' * The arrays [0] positions value is set the id for the Record
	dim EBA_GetHandlerArray()
	' * count of number of times EBAGetHandler_DefineField is called
	dim EBA_GetHandlerFields
	EBA_GetHandlerFields = 0
	' * array of field names
	dim EBA_GetHandlerFieldNames(1000)

	' * string used to pass message back with Response.
	dim EBA_HandlerErrorMessage
	EBA_HandlerErrorMessage=""

' *****************************************************************************
' * function EBAGetHandler_PreceedingZero(YourNumber)
' * zero padding
' * 0->00, 1->01, 2->02,...9->09,10->10...
' *****************************************************************************
'''/// <function name="EBAGetHandler_PreceedingZero" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_PreceedingZero(YourNumber)
	dim ResultString
	ResultString = ""

	if round(cdbl(YourNumber)) > 9 then
		ResultString = cstr(YourNumber)
	else
		ResultString = "0" & cstr(YourNumber)
	end if

	EBAGetHandler_PreceedingZero = ResultString
end function

' *****************************************************************************
' * function EBAGetHandler_ConvertDate(AspDateVar) 
' * sample result 2005-10-02 09:11:11
' *****************************************************************************
'''/// <function name="EBAGetHandler_ConvertDate" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_ConvertDate(AspDateVar)
	dim ResultString
	ResultString = ""

	if day(AspDateVar) > 0 then
	else
		AspDateVar = ""
		AspDateVar = Now()
	end if


	ResultString = year(AspDateVar) & "-" & EBAGetHandler_PreceedingZero(month(AspDateVar)) & "-" & EBAGetHandler_PreceedingZero(day(AspDateVar)) & " " & EBAGetHandler_PreceedingZero(hour(AspDateVar)) & ":" & EBAGetHandler_PreceedingZero(minute(AspDateVar)) & ":" & EBAGetHandler_PreceedingZero(second(AspDateVar))

	EBAGetHandler_ConvertDate = ResultString
end function

' *****************************************************************************
' * function EBAGetHandler_DefineRecordFieldValue(ColumnName, FieldValue)
' * finds the index number of the ColumnName in the EBA_GetHandlerFieldNames
' * The GetHandlerArray for index is set to the value of FieldValue
' * precondition: EBAGetHandler_ProcessRecords,EBAGetHandler_CreateNewRecord,
' *               EBAGetHandler_DefineField
' *****************************************************************************
'''/// <function name="EBAGetHandler_DefineRecordFieldValue" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_DefineRecordFieldValue(ColumnName, FieldValue)
	dim iLoop
	
	dim ColumnNumber
	' find the index for the column parameter
	for iLoop = 0 to EBA_GetHandlerFields
		if strcomp(lcase(ColumnName),lcase(EBA_GetHandlerFieldNames(iLoop))) = 0 then
			ColumnNumber = iLoop
		end if
	next
	
        if cdbl(ColumnNumber) > cdbl(0) then
		EBA_GetHandlerArray(ColumnNumber) = FieldValue
	end if
	
end function


' *****************************************************************************
' * function EBAGetHandler_CreateEvent
' * 1. EBA_GetHandler is initialized for the purpose of adding events
' *****************************************************************************
'''/// <function name="EBAGetHandler_CreateEvent" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_CreateEvent(Key, StartDate, EndDate, Location, Description)
	EBAGetHandler_CreateNewRecord(Key)
	EBAGetHandler_DefineRecordFieldValue "startdate", StartDate
	EBAGetHandler_DefineRecordFieldValue "enddate", EndDate
	EBAGetHandler_DefineRecordFieldValue "location", Location
	EBAGetHandler_DefineRecordFieldValue "description", Description
	EBAGetHandler_DefineRecordFieldValue "type", "event"
	EBAGetHandler_SaveRecord
end function

' *****************************************************************************
' * function EBAGetHandler_DisableDate
' * 1. EBA_GetHandler is initialized for the purpose of adding events
' *****************************************************************************
'''/// <function name="EBAGetHandler_DisableDate" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_DisableDate(Date)
	EBAGetHandler_CreateNewRecord(0)
	EBAGetHandler_DefineRecordFieldValue "startdate", Date
	EBAGetHandler_DefineRecordFieldValue "enddate", ""
	EBAGetHandler_DefineRecordFieldValue "location", ""
	EBAGetHandler_DefineRecordFieldValue "description", ""
	EBAGetHandler_DefineRecordFieldValue "type", "disabled"
	EBAGetHandler_SaveRecord
end function

' *****************************************************************************
' * function EBAGetHandler_CreateNewRecord(IndexFieldValue)
' * global EBA_GetHandlerArray has space allocated
' * The array length is EBA_GetHandlerFields+1
' * The arrays [0] positions value is set to the indexFieldValue parameter
' * The IndexFieldValue is the id for the Record
' * precondition: EBAGetHandler_DefineField. EBAGetHandler_ProcessRecords
' *****************************************************************************
'''/// <function name="EBAGetHandler_CreateNewRecord" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_CreateNewRecord(IndexFieldValue)
	'reallocate storage space for an array variable.
	ReDim EBA_GetHandlerArray(EBA_GetHandlerFields+1)
	
	dim CreateRecordLoop
	for CreateRecordLoop = 0 to EBA_GetHandlerFields-1
		EBA_GetHandlerArray(CreateRecordLoop) = ""
	next
	
	EBA_GetHandlerArray(0) = IndexFieldValue
	
end function

function EBAGetHandler_SetTotalRowCount(RowCount)
	EBA_Converter.TotalRowCount = RowCount
end function


' *****************************************************************************
' * function EBAGetHandler_SaveRecord()
' * adds global array to EBA_Converter
' * precondition: EBAGetHandler_ProcessRecords, EBAGetHandler_CreateNewRecord,
' *               EBAGetHandler_DefineField, EBAGetHandler_DefineRecordFieldValue
' *****************************************************************************
'''/// <function name="EBAGetHandler_SaveRecord" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_SaveRecord()

	EBA_Converter.AddRecord(EBA_GetHandlerArray)
	
end function



' *****************************************************************************
' * function EBASaveHandler_ReturnColumnCount()
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnColumnCount" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnColumnCount()

	dim ResultColumnCount

	ResultColumnCount = 0
	
	dim EBALoop
	
	ResultColumnCount = ubound(EBA_updategramRecords(0).Values)+1
	
	for EBALoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user inserted or updated.
		if (EBA_updategramRecords(EBALoop).EBAType="insert") or (EBA_updategramRecords(EBALoop).EBAType="update") then
			
			if (ubound(EBA_updategramRecords(EBALoop).Values)+1) > ResultColumnCount then
				ResultColumnCount = ubound(EBA_updategramRecords(EBALoop).Values)+1		
			end if
		end if
	next
	
	
	
	EBASaveHandler_ReturnColumnCount = ResultColumnCount

end function




' *****************************************************************************
' * function EBASaveHandler_ReturnInsertCount()
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnInsertCount" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnInsertCount()

	dim ReturnInsertCountResponse
	ReturnInsertCountResponse = 0
	
	dim ReturnInsertCountLoop
	ReturnInsertCountLoop = 0
	
	for ReturnInsertCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user inserted or updated.
		if (EBA_updategramRecords(ReturnInsertCountLoop).EBAType="insert") then
			ReturnInsertCountResponse = ReturnInsertCountResponse + 1
		end if
	next
	
	EBASaveHandler_ReturnInsertCount = ReturnInsertCountResponse

end function




' *****************************************************************************
' * function EBASaveHandler_ReturnUpdateCount()
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnUpdateCount" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnUpdateCount()

	dim ReturnupdateCountResponse
	ReturnupdateCountResponse = 0
	
	dim ReturnupdateCountLoop
	ReturnupdateCountLoop = 0
	
	for ReturnupdateCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user updateed or updated.
		if (EBA_updategramRecords(ReturnupdateCountLoop).EBAType="update") then
			ReturnupdateCountResponse = ReturnupdateCountResponse + 1
		end if
	next
	
	EBASaveHandler_ReturnUpdateCount = ReturnupdateCountResponse

end function




' *****************************************************************************
' * function EBASaveHandler_ReturnDeleteCount()
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnDeleteCount" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnDeleteCount()

	dim ReturndeleteCountResponse
	ReturndeleteCountResponse = 0
	
	dim ReturndeleteCountLoop
	ReturndeleteCountLoop = 0
	
	for ReturndeleteCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user deleteed or updated.
		if (EBA_updategramRecords(ReturndeleteCountLoop).EBAType="delete") then
			ReturndeleteCountResponse = ReturndeleteCountResponse + 1
		end if
	next
	
	EBASaveHandler_ReturnDeleteCount = ReturndeleteCountResponse

end function

' *****************************************************************************
' * function EBAGetHandler_DefineField(FieldName)
' * 1. FieldName parameter is added to the EBA_Converter
' * 2. EBA_GetHandlerFields is incremented
' * 3. EBA_GetHandlerFieldNames[current] = field
' * precondition: EBAGetHandler_ProcessRecords
' *****************************************************************************
'''/// <function name="EBAGetHandler_DefineField" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_DefineField(FieldName)

	EBA_Converter.AddField(FieldName)
	EBA_GetHandlerFieldNames(EBA_GetHandlerFields) = FieldName
	EBA_GetHandlerFields = EBA_GetHandlerFields + 1
	
end function

' *****************************************************************************
' * function EBAGetHandler_ProcessEvents
' * 1. EBA_GetHandler is initialized for the purpose of adding events
' *****************************************************************************
'''/// <function name="EBAGetHandler_ProcessEvents" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_ProcessEvents()
	EBAGetHandler_ProcessRecords()
	EBAGetHandler_DefineField("startdate")
	EBAGetHandler_DefineField("enddate")
	EBAGetHandler_DefineField("location")
	EBAGetHandler_DefineField("description")
	EBAGetHandler_DefineField("type")
end function

' *****************************************************************************
' * function EBAGetHandler_DefineForeignKey(FieldName)
' * 1. FieldName parameter is added to the EBA_Converter
' * precondition: EBAGetHandler_ProcessRecords
' *****************************************************************************
'''/// <function name="EBAGetHandler_DefineForeignKey" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_DefineForeignKey(FieldName)

	EBA_Converter.DefineForeignKey(FieldName)
	
end function

' *****************************************************************************
' * function EBAGetHandler_DefineForeignKeyValue(fkValue)
' * 1. fkValue parameter is added to the EBA_Converter as parentvalue
' * precondition: EBAGetHandler_ProcessRecords
' *****************************************************************************
'''/// <function name="EBAGetHandler_DefineForeignKeyValue" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_DefineForeignKeyValue(fkValue)

	EBA_Converter.DefineForeignKeyValue(fkValue)
	
end function

' *****************************************************************************
' * function EBAGetHandler_InitLocaleConverter()
' *****************************************************************************
'''/// <function name="EBAGetHandler_InitLocaleConverter" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_InitLocaleConverter(LocaleConverter)

	LocaleConverter.Initialize()

end function

' *****************************************************************************
' * function EBAGetHandler_SetErrorMessage(ErrorMessage)
' *****************************************************************************
'''/// <function name="EBAGetHandler_SetErrorMessage" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_SetErrorMessage(ErrorMessage)
	EBA_HandlerErrorMessage = ErrorMessage
end function

' *****************************************************************************
' * function EBASaveHandler_SetErrorMessage(ErrorMessage)
' *****************************************************************************
'''/// <function name="EBASaveHandler_SetErrorMessage" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_SetErrorMessage(ErrorMessage)
	EBA_HandlerErrorMessage = ErrorMessage
end function

' *****************************************************************************
' * function EBAGetHandler_ProcessRecords()
' * 1. init Response
' * 2. allocate space for EBA_GetHandlerFieldNames array
' * 3. init EBA_Converter and set EBAXMLConverter.KeyFieldName to "key"
' * 
' *****************************************************************************
'''/// <function name="EBAGetHandler_ProcessRecords" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_ProcessRecords()

	Response.ContentType="text/xml"
	Response.Expires=0
	Response.Buffer = true
	Response.Clear()
	Response.addHeader "charset", "UTF-8"
	
	dim iLoop
	
	for iLoop = 0 to 999
		EBA_GetHandlerFieldNames(iLoop) = ""
	next
	
	Set EBA_Converter = new EBAXMLConverter
	EBA_Converter.Initialize()

	EBA_Converter.KeyFieldName = "key"
	

	EBAGetHandler_DefineField("key")

end function



DIM EBAXMLDocString
EBAXMLDocString = ""

' *****************************************************************************
' * function EBASaveHandler_ProcessRecords()
' *****************************************************************************
'''/// <function name="EBASaveHandler_ProcessRecords" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ProcessRecords()

	' Get the updategram and convert it.
	Set EBA_Converter = new EBAXMLConverter
	EBA_Converter.Initialize()

	EBA_Converter.SetEBAXMLFromUrl(Request)
	EBAConverter_SetIndexFields
	
	' Get the updategram records and process them.
	EBA_updategramRecords = EBA_Converter.GetRecords()


end function

DIM EBAConverter_MyIndexFields

function EBAReturnFieldIndex(FieldName)

	DIM ilo
	DIM ResultFieldIndex
	ResultFieldIndex = -1
	
	if lcase(FieldName) = "pk" then
		ResultFieldIndex = 99999
	elseif lcase(FieldName) = "fk" then
		ResultFieldIndex = 88888
	else		
		for ilo = 0 to ubound(EBAConverter_MyIndexFields)
		
			if lcase(EBAConverter_MyIndexFields(ilo)) = lcase(FieldName) then
				ResultFieldIndex =  ilo
			end if
			
		next
	end if

	EBAReturnFieldIndex = ResultFieldIndex
end function

function EBAConverter_SetIndexFields()

	DIM StartSpot
	StartSpot = 0
	StartSpot = instr(cstr(EBAXMLDocString), "fields=")
	
	DIM ResultString
	
	ResultString = right(cstr(EBAXMLDocString), len(cstr(EBAXMLDocString))-StartSpot)
	StartSpot = instr(ResultString, """")
	ResultString = right(ResultString, len(ResultString)-StartSpot)
	StartSpot = instr(ResultString, """")
	ResultString = left(ResultString, StartSpot-1)
	EBAConverter_MyIndexFields = split(ResultString, "|")


end function

' *****************************************************************************
' * function EBASaveHandler_SetRecordKey(recordNumber, key)
' *****************************************************************************
'''/// <function name="EBASaveHandler_SetRecordKey" access="public">
'''/// <summary>In the case of an insert, we need to communicate back to the client
'''/// the new key for this record.  After inserting into the database, call
'''/// this method to add the new key to the response back to the client.</summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_SetRecordKey(recordNumber, key)
	dim CurrentInsertRecord
	CurrentInsertRecord = 0
	dim i
	i = 0
	for i = 0 to ubound(EBA_updategramRecords)-1
		if (EBA_updategramRecords(i).EBAType="insert") then
			if cdbl(CurrentInsertRecord) = cdbl(recordNumber) then
				dim xml
				xml = EBA_updategramRecords(i).xml
				dim newXml
				newXml = Replace(xml, "xk=""""", "xk=""" & key & """")
				EBA_updategramRecords(i).xml = newXML
			end if
			CurrentInsertRecord = CurrentInsertRecord + 1
		end if
	next
end function

' *****************************************************************************
' * function EBASaveHandler_CompleteSave()
' *****************************************************************************
'''/// <function name="EBASaveHandler_CompleteSave" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_CompleteSave()

	Response.ContentType="text/xml"
	Response.Expires=0
	Response.Buffer = true
	Response.Clear()

	if EBA_HandlerErrorMessage = "" then
		Response.Write("<root>")
	else
		Dim errorstring
		'errorstring = EncodeXMLString(EBA_HandlerErrorMessage)
		errorstring = Server.HTMLEncode(EBA_HandlerErrorMessage)
		Response.Write("<root error=""" & errorstring & """>")
	end if

	dim ReturnCompleteSaveLoop
	ReturnCompleteSaveLoop = 0

	for ReturnCompleteSaveLoop = 0 to ubound(EBA_updategramRecords)-1
		Response.Write(EBA_updategramRecords(ReturnCompleteSaveLoop).xml)
	next
	
	Response.Write("</root>")

end function

' *****************************************************************************
' * function EBAGetHandler_SetDataLangauge()
' *****************************************************************************
'''/// <function name="EBAGetHandler_SetDataLangauge" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_SetDataLangauge(DataLangauge)

	EBA_Converter.DataLangauge = DataLangauge

end function


' *****************************************************************************
' * function EBAGetHandler_CompleteGet()
' *****************************************************************************
'''/// <function name="EBAGetHandler_CompleteGet" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBAGetHandler_CompleteGet()
	
	EBA_Converter.WriteEBAXML()

end function

' *****************************************************************************
' * function EBASaveHandler_ReturnForeignKeyValue(RecordNumber)
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnForeignKeyValue" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnForeignKeyValue(RecordNumber)
	EBASaveHandler_ReturnForeignKeyValue = EBASaveHandler_ReturnInsertField(RecordNumber, "FK")
end function



' *****************************************************************************
' * function EBASaveHandler_ReturnInsertField(RecordNumber, myDataColumn)
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnInsertField" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnInsertField(RecordNumber, myDataColumn)

	DataColumn = 0
	DataColumn = EBAReturnFieldIndex(myDataColumn)
	
	if DataColumn > -1 then
	
	if DataColumn = 99999 then
		DataColumn = -1	
	end if
	
	if DataColumn = 88888 then
		DataColumn = -2
	end if
	
	DataColumn = DataColumn + 1
	
	dim ReturnInsertResponse
	ReturnInsertResponse = ""
	
	dim ReturnInsertCountLoop
	ReturnInsertCountLoop = 0
	
	dim CurrentInsertRecord
	CurrentInsertRecord = 0
	
	dim values
	
	for ReturnInsertCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user inserted or updated.
		if (EBA_updategramRecords(ReturnInsertCountLoop).EBAType="insert") then
			
			
			if cdbl(CurrentInsertRecord) = cdbl(RecordNumber) then
				
				if cint(DataColumn) = 0 then
					ReturnInsertResponse = EBA_updategramRecords(ReturnInsertCountLoop).Key
				elseif cint(DataColumn) = -1 then
					ReturnInsertResponse = EBA_updategramRecords(ReturnInsertCountLoop).ForeignKey
				else
					values = EBA_updategramRecords(ReturnInsertCountLoop).Values
					ReturnInsertResponse = values(cint(DataColumn)-1)
				end if
				

			end if
			
			CurrentInsertRecord = CurrentInsertRecord + 1
		end if
	next
	
	EBASaveHandler_ReturnInsertField = ReturnInsertResponse
	
	end if

end function


' *****************************************************************************
' * function EBASaveHandler_ReturnUpdateField(RecordNumber, myDataColumn)
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnUpdateField" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnUpdateField(RecordNumber, myDataColumn)

	DataColumn = 0
	DataColumn = EBAReturnFieldIndex(myDataColumn)

	if DataColumn > -1 then

	if DataColumn = 99999 then
		DataColumn = -1	
	end if
	
	DataColumn = DataColumn + 1

	dim ReturnUpdateResponse
	ReturnUpdateResponse = ""
	
	dim ReturnUpdateCountLoop
	ReturnUpdateCountLoop = 0
	
	dim CurrentUpdateRecord
	CurrentUpdateRecord = 0
	
	dim values
	
	for ReturnUpdateCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user updateed or updated.
		if (EBA_updategramRecords(ReturnUpdateCountLoop).EBAType="update") then
			
			
			if cdbl(CurrentUpdateRecord) = cdbl(RecordNumber) then
				
				if cint(DataColumn) = 0 then
					ReturnUpdateResponse = EBA_updategramRecords(ReturnUpdateCountLoop).Key
				else
					values = EBA_updategramRecords(ReturnUpdateCountLoop).Values
					ReturnUpdateResponse = values(cint(DataColumn)-1)
				end if
				

			end if
			
			CurrentUpdateRecord = CurrentUpdateRecord + 1
		end if
	next
	
	EBASaveHandler_ReturnUpdateField = ReturnUpdateResponse
	else
	
		Response.Write("column: " & mydatacolumn & ":" & DataColumn)
		Response.end
		
	end if

end function

' *****************************************************************************
' * function EBASaveHandler_ReturnDeleteField(RecordNumber)
' *****************************************************************************
'''/// <function name="EBASaveHandler_ReturnDeleteField" access="public">
'''/// <summary></summary>
'''/// <remarks></remarks>
'''/// </function>
function EBASaveHandler_ReturnDeleteField(RecordNumber)

	dim ReturnDeleteResponse
	ReturnDeleteResponse = ""
	
	dim ReturnDeleteCountLoop
	ReturnDeleteCountLoop = 0
	
	dim CurrentDeleteRecord
	CurrentDeleteRecord = 0
	
	dim values
	
	for ReturnDeleteCountLoop = 0 to ubound(EBA_updategramRecords)-1
		
		' The user deleteed or deleted.
		if (EBA_updategramRecords(ReturnDeleteCountLoop).EBAType="delete") then
			
			
			if cdbl(CurrentDeleteRecord) = cdbl(RecordNumber) then
				
				ReturnDeleteResponse = EBA_updategramRecords(ReturnDeleteCountLoop).Key

			end if
			
			CurrentDeleteRecord = CurrentDeleteRecord + 1
		end if
	next
	
	EBASaveHandler_ReturnDeleteField = ReturnDeleteResponse

end function
'''///</class>

' *****************************************************************************
' *****************************************************************************
' * EBAXMLRecord
' *****************************************************************************
'''/// <class name="EBAXMLRecord">
'''/// <summary>
'''/// A class that stores a record from an EBAXML document. The class stores records
'''/// that are of variable size.
'''/// </summary>
Class EBAXMLRecord
	private m_Key
	private m_Values
	private m_EBAType
	private m_XML
	private m_Xid
	private m_XmlNode
	private m_ForeignKey
	
	'''/// <property name="Key" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// The record key.
	'''/// </summary>
	'''/// </property>
	Public Property Get Key()
   	 	Key = m_Key
	End Property
	
	Public Property Let Key(p_Key)
	    m_Key = p_Key
	End Property
	
	'''/// <property name="ForeignKey" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// The record's foreign key.
	'''/// </summary>
	'''/// </property>
	Public Property Get ForeignKey()
   	 	ForeignKey = m_ForeignKey
	End Property
	
	Public Property Let ForeignKey(p_ForeignKey)
	    m_ForeignKey = p_ForeignKey
	End Property
	
	'''/// <property name="Values" type="array" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// An array of the values in the record. Does not include the key value.
	'''/// This array can be any length.
	'''/// </summary>
	'''/// </property>
	Public Property Get Values()
   	 	Values = m_Values
	End Property
	
	Public Property Let Values(p_Values)
	    m_Values = p_Values
	End Property
	
	'''/// <property name="EBAType" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// The kind of record in the EBA Compressed XML: insert, update, delete, or e.
	'''/// </summary>
	'''/// </property>
	Public Property Get EBAType()
   	 	EBAType = m_EBAType
	End Property
	
	Public Property Let EBAType(p_EBAType)
	    m_EBAType = p_EBAType
	End Property
	
	'''/// <property name="XML" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// The XML representation of the row.
	'''/// </summary>
	'''/// </property>
	Public Property Get XML()
   	 	XML = m_XML
	End Property
	
	Public Property Let XML(p_XML)
	    m_XML = p_XML
	End Property
	
	'''/// <property name="Xid" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// The record xid culled from the xml response.  Uniquely identifies this record
	'''/// from other records sent in the request.  (We can't use xk because insert records
	'''/// won't have a value)
	'''/// </summary>
	'''/// </property>
	Public Property Get Xid()
   	 	Xid = m_Xid
	End Property
	
	Public Property Let Xid(p_Xid)
	    m_Xid = p_Xid
	End Property
	
End Class
'''///</class>

' *****************************************************************************
' *****************************************************************************
' * EBAXMLConverter
' *****************************************************************************
'''/// <class name="EBAXMLConverter">
'''/// <summary>
'''/// A class that converts data into EBA Compressed XML and back. Note: you can only
'''/// go in one direction at a time. That is, you can only use this to convert blocks
'''/// of records/xml at a time. You cannot convert XML, add more records, and convert
'''/// it back.
'''/// </summary>
Class EBAXMLConverter

	Private m_DataLangauge
	Private m_Xml
	Private m_FieldNames()
	Private m_NumFields
	Private m_KeyFieldName
	Private m_RecordsXml
	Private m_Records() 
	Private m_TotalRowCount
	Private m_NumForeignKeys
	Private m_ForeignKeyNames()
	Private m_ForeignKeyValue

	' *****************************************************************************
	' * Function Initialize
	' *****************************************************************************
	'''/// <function name="Initialize" access="public">
	'''/// <summary>Initializes the object. Call this before anything else.</summary>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function Initialize()
		m_NumFields=0
		m_DataLangauge = "en"
		m_TotalRowCount = ""
		m_NumForeignKeys = 0
		m_ForeignKeyValue = ""
	End Function

	'''/// <property name="TotalRowCount" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// Value for the total number of rows for the data
	'''/// </summary>
	'''/// </property>
	Public Property Get TotalRowCount()
   	 	TotalRowCount = m_TotalRowCount
	End Property
	
	Public Property Let TotalRowCount(p_TotalRowCount)
	    m_TotalRowCount = p_TotalRowCount
	End Property
	
	'''/// <property name="DataLangauge" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// Value for the xml:lang attribute of the root tag
	'''/// </summary>
	'''/// </property>
	Public Property Get DataLangauge()
   	 	DataLangauge = m_DataLangauge
	End Property
	
	Public Property Let DataLangauge(p_DataLangauge)
	    m_DataLangauge = p_DataLangauge
	End Property

	' *****************************************************************************
	' * Function AddField
	' *****************************************************************************
	'''/// <function name="AddField" access="public">
	'''/// <summary>Specifies the name of the next column in the data you are converting.
	'''/// </summary>

	'''/// <param name="FieldName" type="string" >The name of the field.</param>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function AddField(FieldName)
		Dim NewIndex 
		m_NumFields = m_NumFields + 1
		Redim Preserve m_FieldNames(m_NumFields)
		m_FieldNames(m_NumFields-1) = FieldName	
	End Function
	
	' *****************************************************************************
	' * Function DefineForeignKey
	' *****************************************************************************
	'''/// <function name="DefineForeignKey" access="public">
	'''/// <summary>Defines a foreign key for the data being sent to the Grid.
	'''/// </summary>

	'''/// <param name="FieldName" type="string" >The name of the foreign key.</param>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function DefineForeignKey(FieldName)
		m_NumForeignKeys= m_NumForeignKeys + 1
		Redim Preserve m_ForeignKeyNames(m_NumForeignKeys)
		m_ForeignKeyNames(m_NumForeignKeys-1) = FieldName	
	End Function
	
		' *****************************************************************************
	' * Function DefineForeignKeyValue
	' *****************************************************************************
	'''/// <function name="DefineForeignKeyValue" access="public">
	'''/// <summary>Defines the value for the foreign key for the data being sent to the Grid.
	'''/// </summary>

	'''/// <param name="fkValue" type="string" >The value of the foreign key.</param>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function DefineForeignKeyValue(fkValue)
		m_ForeignKeyValue = fkValue
	End Function
	
	' *****************************************************************************
	' * Function ClearFields
	' *****************************************************************************
	'''/// <function name="ClearFields" access="public">
	'''/// <summary>Clears all the field names.</summary>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function ClearFields()
		m_NumFields=0
		Redim m_FieldNames(m_NumFields)
	End Function
	
	' *****************************************************************************
	' * Function EncodeXMLString
	' *****************************************************************************
	'''/// <function name="EncodeXMLString" access="private">
	'''/// <summary>Encodes a string translating any illegal XML characters.</summary>
	'''/// <param name="str" type="string" >The string to encode. Remains unchanged.</param>
	'''/// <returns type="string">The encoded string</returns>
	'''/// </function>
	Private Function EncodeXMLString(str)
		'Encode the following 
		'quote (") &quot; 
		'ampersand (&) &amp; 
		'less than (<) &lt; 
		'greater than (>) &gt; 
		Dim newStr
		newStr = str
		if not (isnull(str) or str="") then
			newStr = Replace(newStr,"&", "&amp;") ' Make sure to replace this first.
			newStr = Replace(newStr, """", "&quot;")
			newStr = Replace(newStr, "<", "&lt;")
			newStr = Replace(newStr, ">", "&gt;")
			newStr = Replace(newStr, chr(10), "&#10;") ' line feed
			newStr = Replace(newStr, chr(13), "&#13;") ' c/r
			newStr = Replace(newStr, chr(9),  "&#9;")  ' TAB 
			newStr = Replace(newStr, chr(32), "&#32;") ' SPACE
		end if 
		EncodeXMLString = newStr
	End Function
	
	'''/// <property name="KeyFieldName" type="string" access="public" readwrite="readwrite">
	'''/// <summary>The name of the field that is the key field.
	'''/// </summary>
	'''/// <remarks>
	'''/// </remarks>
	'''/// </property>
	Public Property Get KeyFieldName()
   	 	KeyFieldName = m_KeyFieldName
	End Property
	
	Public Property Let KeyFieldName(p_KeyFieldName)
	    m_KeyFieldName = p_KeyFieldName
	End Property 
		
	' *****************************************************************************
	' * Function AddRecord
	' *****************************************************************************
	'''/// <function name="AddRecord" access="public">
	'''/// <summary>Adds a record to be converted.</summary>
	'''/// <param name="Values" type="array" >An array of values. The number of values in the 
	'''/// array must be equal to the number of fields you have added.</param>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function AddRecord(Values)
		AddRecordWithType "e",Values
	End Function
	
	
	' *****************************************************************************
	' * Function GetColumnIndexLetter
	' *****************************************************************************
	'''/// <function name="GetColumnIndexLetter" access="public">
	'''/// <summary>
	'''/// Returns a column letter for a column index. EG 0=a 1=b 26=aa etc
	'''/// </summary>
	'''/// <param name="ColumnIndex" type="int" >The column index</param>
	'''/// <returns type="string"></returns>
	'''/// </function>
	Private Function GetColumnIndexLetter(ColumnIndex)
		Dim ColumnIndexLetter
		if (ColumnIndex > 25) then
			' After z comes aa then ab and so on until zz, which is the limit.
			ColumnIndexLetter= chr((ColumnIndex \ 26) + 96) & chr((ColumnIndex mod 26) + 97)
		else
			ColumnIndexLetter= chr(ColumnIndex+97)
		end if
		GetColumnIndexLetter=ColumnIndexLetter
	End Function
	
	' *****************************************************************************
	' * Function AddRecordWithName
	' *****************************************************************************
	'''/// <function name="AddRecordWithType" access="public">
	'''/// <summary>Adds a record to the XML. The type of the record is the XML tag name, e.g. update, insert, e</summary>
	'''/// <param name="EBARecordType" type="string" >The type of the record.</param>
	'''/// <param name="Values" type="string" >An array of values. The number of values in the 
	'''/// array must be equal to the number of fields you have added.</param>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function AddRecordWithType(EBARecordType, Values)
		Dim keyFieldIndex, i, s, columnIndex, j, ColumnIndexLetter, attributeName
		
		' Find the index of the key field.
		keyFieldIndex=0
		for i = 0 to m_NumFields-1
			if (m_FieldNames(i) = m_KeyFieldName) then  keyFieldIndex=i
		next
		
		' Build the record xml.
		s = s & "<" & EBARecordType & " "
		columnIndex=0
		' Loop through the fields and fill in the values.
		for j = 0 to m_NumFields-1
			if (j = keyFieldIndex) then
				s = s & "xk=""" & Values(j) & """ "
			else
				attributeName = GetColumnIndexLetter(columnIndex)
				s = s & attributeName & "=""" & EncodeXMLString(Values(j)) & """ "
				columnIndex = columnIndex + 1
			end if
		next
		s = s & " />"
		m_RecordsXml = m_RecordsXml & s
	End Function
	
	' *****************************************************************************
	' * Function GetRecord
	' *****************************************************************************
	'''/// <function name="GetRecord" access="public">
	'''/// <summary></summary>
	'''/// <param name="Index" type="int" >The index of the record you want</param>
	'''/// <remarks></remarks>
	'''/// <returns type="EBAXMLRecord">The record.</returns>
	'''/// </function>
	Public Function GetRecord(Index)
		if (Index > ubound(m_Records)) then
			Err.Raise 65536, "EBAXMLConverter.GetRecord", "Invalid Record Index"
		else
			GetRecord = m_Records(Index)
		end if
	End Function
	
	' *****************************************************************************
	' * Function GetRecords
	' *****************************************************************************
	'''/// <function name="GetRecords" access="public">
	'''/// <summary>Records all the records</summary>
	'''/// <returns type="array">An array of EBAXMLRecord objects</returns>
	'''/// </function>
	Public Function GetRecords()
		GetRecords = m_Records
	End Function
	
	' *****************************************************************************
	' * Function GetEBAXML
	' *****************************************************************************
	'''/// <function name="GetEBAXML" access="public">
	'''/// <summary>Returns EBA compressed XML based on the fields and records you've added.
	'''/// </summary>
	'''/// <returns type="string">EBA Compressed XML</returns>
	'''/// </function>
	Public Function GetEBAXML()
		Dim s, pipe, i

		' set codePage for output.  The ilocaleConverter may have set the code Page to another value
		Session.CodePage = 65001

		s = "<?xml version='1.0' encoding='UTF-8'?><root xml:lang="""
		s = s & m_DataLangauge & """ fields="""
		pipe = ""
		
		' Find the index of the key field.
		Dim keyFieldIndex
		keyFieldIndex=0
		for i = 0 to m_NumFields-1
			if (m_FieldNames(i) = m_KeyFieldName) then  keyFieldIndex=i
		next
		
		' Write out the fields and keys attributes
		' During this, find out the index of the key field.
		Dim fields 
		fields = ""
		for i = 0 to m_NumFields-1
			if (keyFieldIndex <> i) then
				fields = fields & pipe & m_FieldNames(i) 
				pipe = "|"
			end if
		next
		fields = EncodeXMLString(fields)
		s = s & fields & """ keys=""" & fields & """"
		if (m_TotalRowCount <> "") then
			s = s & " totalrowcount=""" & m_TotalRowCount & """"
		end if
		
		if (m_NumForeignKeys <> 0) then
			Dim fks
			fks = ""
			pipe = ""
			for i = 0 to m_NumForeignKeys - 1
				fks = fks & pipe & m_ForeignKeyNames(i)
				pipe = "|"
			next
			s = s & " parentfield=""" & fks & """"
		end if
		if (m_ForeignKeyValue <> "") then
			s = s & " parentvalue=""" & m_ForeignKeyValue & """"
		end if
		
		if (EBA_HandlerErrorMessage <> "") then
			Dim errorstring
			errorstring = EncodeXMLString(EBA_HandlerErrorMessage)
			s = s & " error=""" & errorstring & """"
		end if
		s = s & ">"
		s = s & m_RecordsXml
		
		s = s & "</root>"
		m_Xml = s
		GetEBAXML = m_Xml
	End Function
	
	' *****************************************************************************
	' * Function SetEBAXML
	' *****************************************************************************
	'''/// <function name="SetEBAXML" access="public">
	'''/// <summary>Set the Compressed EBA XML you want to convert. Use GetRecord and GetRecords
	'''/// to retrieve the data.
	'''/// </summary>
	'''/// <param name="XMLString" type="string" >Valid compressed EBA XML</param>
	'''/// </function>
	Public Function SetEBAXML(XMLString)
		Dim xmlDoc, records, i, ColumnIndex, value
		m_Xml=XMLString
		set xmlDoc = Server.CreateObject("Microsoft.XMLDOM")
    	xmlDoc.async = false
    	xmlDoc.loadXML (XMLString)
		EBAXMLDocString = xmlDoc.xml
    	set records = xmlDoc.documentElement.childNodes
    	Redim m_Records(records.length) 
    	Dim values()
		for i = 0 to records.length-1
			Set m_Records(i) = new EBAXMLRecord
			m_Records(i).EBAType = records(i).tagName
			m_Records(i).Key = records(i).getAttribute("xk")
			m_Records(i).Xid = records(i).getAttribute("xid")
			m_Records(i).ForeignKey = records(i).getAttribute("xf")
			m_Records(i).XML = records(i).xml
			dim done
			done = false
			columnIndex=0
			do 
				value = records(i).getAttribute(GetColumnIndexLetter(columnIndex))
				if (isNull(value)) then
					done = true
				else
					value = Replace(value, "&quot;", """")
					Redim Preserve values(columnIndex)
					values(columnIndex) = value
					columnIndex = columnIndex + 1
				end if
			Loop until done
			m_Records(i).Values = values
		next
	End Function
	
	' *****************************************************************************
	' * Function SetEBAXMLFromURL
	' *****************************************************************************
	'''/// <function name="SetEBAXMLFromURL" access="public">
	'''/// <summary>Set the Compressed EBA XML you want to convert from an URL. Use GetRecord and GetRecords
	'''/// to retrieve the data.
	'''/// </summary>
	'''/// <param name="XMLSource" type="string" >A string containing a URL that specifies the location of the XML file.</param>
	'''/// </function>
	Public Function SetEBAXMLFromURL(XMLSource)
		Dim xmlDoc
		Set xmlDoc = Server.CreateObject("Microsoft.XMLDOM")
	    xmlDoc.async = false
	    xmlDoc.load (XMLSource)
	    SetEBAXML(xmlDoc.xml)
	End Function
	
	' *****************************************************************************
	' * Function WriteEBAXML
	' *****************************************************************************
	'''/// <function name="WriteEBAXML" access="public">
	'''/// <summary>Writes out EBA compressed XML to the page.</summary>
	'''/// <remarks></remarks>
	'''/// </function>
	Public Function WriteEBAXML()
		Response.Expires=0
		Response.Buffer = true
		Response.Clear()
	    Response.ContentType="text/xml"
	    Dim doc
		set doc = Server.CreateObject("Msxml2.DOMDocument.3.0")
		doc.async = false
		doc.loadXML(GetEBAXML())
	
		' ASP cant process some symbols found in other languages so use the XML object to
		' write the output.
		doc.Save(Response)
	End Function

End Class
'''///</class>

' *****************************************************************************
' *****************************************************************************
' * EBAADOConverter
' *****************************************************************************
'''/// <class name="EBAADOConverter">
'''/// <summary>
'''/// A class that converts ADO data into EBA Compressed XML. To convert EBA XML
'''/// into a Script structure use EBAXMLConverter.
'''/// </summary>
Class EBAADOConverter

	Private m_KeyFieldName

	'''/// <property name="KeyFieldName" type="string" access="public" readwrite="readwrite">
	'''/// <summary>
	'''/// Specifies which field is the key field.
	'''/// </summary>
	'''/// </property>
	Public Property Get KeyFieldName()
   	 	KeyFieldName = m_KeyFieldName
	End Property
	
	Public Property Let KeyFieldName(p_KeyFieldName)
	    m_KeyFieldName = p_KeyFieldName
	End Property 
	
	
	' *****************************************************************************
	' * Function FillRecordSet
	' *****************************************************************************
	'''/// <function name="FillRecordSet" access="public">
	'''/// <summary>Fills an ADO recordset with data.</summary>
	'''/// <param name="SQLQuery" type="string" >A SQL Query.</param>
	'''/// <param name="ConnectionString" type="string" >The string used to connect to the
	'''/// datasource. See the MSDN for details on ADO Connection strings</param>
	'''/// <returns type="RecordSet">The ADO recordset with data.</returns>
	'''/// </function>
	Public Function FillRecordSet(SQLQuery, ConnectionString)
		dim conn, rs
	   	set conn=server.createobject("adodb.connection")
	   	conn.open connectionString
	   	set rs=conn.execute(sqlQuery)
	   	set FillRecordSet=rs
	End Function

	' *****************************************************************************
	' * Function GetEBAXML
	' *****************************************************************************
	'''/// <function name="GetEBAXML" access="public">
	'''/// <summary>Returns a record set as EBA XML. Note: never use Response.Write(GetEBAXML()). 
	'''/// Use WriteEBAXML instead.</summary>
	'''/// <param name="RecordSet" type="ADORecordSet" >The recordset you want to convert.</param>
	'''/// <returns type="string">EBA XML</returns>
	'''/// </function>
	Public Function GetEBAXML(RecordSet)	
		Dim converter, i
		Set converter = new EBAXMLConverter
		
		converter.Initialize()
		
		converter.KeyFieldName = m_KeyFieldName
		for i = 0 to RecordSet.fields.count-1
			converter.AddField(RecordSet.fields(i).name)
		next
		
		' Loop through all the records and create the compressed xml entries.
		do while not recordSet.eof
			converter.AddRecord(RecordSet)
			RecordSet.movenext
		loop
		
		GetEBAXML = converter.GetEBAXML()
	End Function
	
	' *****************************************************************************
	' * Function WriteEBAXML
	' *****************************************************************************
	'''/// <function name="WriteEBAXML" access="public">
	'''/// <summary>Writes out EBA XML given a recordset.</summary>
	'''/// <param name="RecordSet" type="ADORecordSet" >The RecordSet</param>
	'''/// </function>
	Public Function WriteEBAXML(RecordSet)
		Response.Expires=0
		Response.Buffer = true
		Response.Clear()
	    Response.ContentType="text/xml"
		
	    Dim doc
		set doc = Server.CreateObject("Msxml2.DOMDocument.3.0")
		doc.async = false
		doc.loadXML(GetEBAXML(RecordSet))
	
		' ASP cant process some symbols found in other languages so use the XML object to
		' write the output.
		doc.Save(Response)
	End Function
End Class
'''///</class>
%>
