package RemoteControl;

import junit.framework.*;
import com.thoughtworks.selenium.*;

public class BaseTest extends TestCase {

	protected Selenium selenium;	
	
	protected String testWindow = "ntbtestdoc";	
	protected String declarationId = "";
	protected Configuration config;

	protected String browser = "*firefox";
	protected boolean standards = true;
	
	public void setUp() throws Exception{
		super.setUp();

		if (System.getProperty("browser") != null)
			browser = System.getProperty("browser");
		if (System.getProperty("standards") != null)
			standards = Boolean.getBoolean(System.getProperty("standards"));

	}
	
	/**
	 * Starts Session 
	 * start Selenium, open url in the specified browser, set special variable
	 * @param browser - the browser to use. <br/> possible values are:
	 * <ul>
	 * <li><b>*iexplore</b> Internet Explorer</li>
	 * <li><b>*firefox</b> Firefox</li> 
	 * <li><b>*iehta</b> Internet Explorer</li>
	 * <li><b>*custom <i><u>path/to/browser</u></i></b> Custom browser</li>
	 * </ul>
	 * @param testPage - the test filename or the test url 
	 * @param useConfig - <p>if set to true the test url will be the http://<i><u>browserHost</u></i>/<i><u>repository</u></i>/<i><u>testPath</u></i>/<i><u>testPage</u></i>
	 * </p><p>if set to false testPage will be used as the test url.</p> 
	 * @throws Exception
	 */
	protected void startSession(String browser, String pathToTestPage, String initialUrl, boolean useConfig) throws Exception{
		String url="";
		if(useConfig){
			url = getBrowserURL(pathToTestPage);
		}else{
			url = pathToTestPage;
		}
		this.browser = browser;
		this.startSession(url, initialUrl);
	}
	
	protected void startSession(String url, String initialUrl) throws Exception
	{
		if (!standards)
			url = "/oscui/public/testframework/switchdoctype.asp?"+url;
		selenium = new DefaultSelenium("localhost", 4444 , this.browser, initialUrl);		
		selenium.start();
		selenium.open(url);
		selenium.waitForPageToLoad("5000");
		selenium.getEval(testWindow+" = this.page().currentWindow");
	}
	/*
	*
	*Evaluates javascript codes in the test window and returns the result
	**/	
	public String eval(String code){
		return selenium.getEval(testWindow+"."+code);		
	}
	
	/**
	* Creates a javascript expression in the test window
	*/
	public String getEvalString(String code){
		return testWindow+"."+code;		
	}

	/**
	 * Returns string url using the configuration properties and from the given the filename
	 * @param filename
	 * @return url for the filename
	 */
	protected String getBrowserURL(String pathToTestPage){
		return "http://localhost/svn/"+pathToTestPage;
	}

	protected String getCellId(int row, int col, String gridUID){
		return "cell_"+row+"_"+col+"_"+gridUID;
	}

	protected String getHeaderId(int col, String gridUID){
		return "columnheader_"+col+"_"+gridUID;
	}

	/**
	 * Wait and check if grid is loaded when the grid is constructed by solely by scripts  
	 * 
	 * @param testFrame - the selenium test frame
	 * @param gridObjVarName - the grid object variable name
	 * @param wait - the wait in milliseconds 
	 * @throws SeleniumCommandTimedOutException when timeout is reached and grid is not loaded 
	 */
	protected void isGridLoadedByScript(String testFrame, String gridObjVarName, String wait) throws SeleniumCommandTimedOutException{
		String command = "frames['"+testFrame+"']."+gridObjVarName+".uid";		
		selenium.waitForCondition(command,wait);
		//create a variable storing the grid variable in the test frame
		selenium.getEval(gridObjVarName+"=frames['"+testFrame+"']."+gridObjVarName);
		String uid = selenium.getEval(gridObjVarName+".uid");
		System.out.println(uid);
		selenium.waitForCondition( command , wait);
	}
	
	/**
	 * Wait and check if grid is loaded when the grid is constructed through declaration
	 * 
	 * @param id - The Grid Id
	 * @param wait - Wait timeout in milliseconds
	 * @throws SeleniumCommandTimedOutException - when timeout is reached and grid is not loaded.
	 */
	protected void isGridLoaded(String id,String wait) throws SeleniumCommandTimedOutException{		
		selenium.waitForCondition(testWindow+".nitobi.getComponent('"+id+"')",wait);
	}

	protected void clickCell(int colIndex, int rowIndex)
	{
		String uid = getUID(this.declarationId);
		String id = getCellId(rowIndex,colIndex,uid);
		waitForDom(id, "10000");
		clickElementById(id);
	}
	
	protected void dblClickCell(int colIndex, int rowIndex)
	{
		String uid = getUID(this.declarationId);
		clickCell(colIndex, rowIndex);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);		
	}
	
	protected void editCell(int colIndex, int rowIndex, String value) 
	{
		String uid = getUID(this.declarationId);
		clickCell(colIndex, rowIndex);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);
		waitForDom("ntb-textbox", "10000");
		selenium.typeKeys("id=ntb-textbox",value);
		selenium.type("id=ntb-textbox",value);
		blurElement("ntb-textbox");
	}
	
	protected void changeLookupByClick(int colIndex, int rowIndex, int selectIndex) 
	{
		String uid = getUID(this.declarationId);
		clickCell(colIndex, rowIndex);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);
		waitForDom("ntb-lookup-text", "10000");
		waitForDom("ntb-lookup-options", "1000");
		selenium.waitForCondition(getEvalString("document.getElementById('lookup_span').offsetLeft > 0"),"2000");
		selenium.select("id=ntb-lookup-options","value=Audio Tape Player");
		clickLookupOption(selectIndex);
		selenium.waitForCondition(getEvalString("document.getElementById('lookup_span').offsetLeft < -1000"),"2000");
	}
	
	protected void changeLookupWithArrows(int colIndex, int rowIndex, int downChange) 
	{
		String uid = getUID(this.declarationId);
		clickCell(colIndex, rowIndex);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);
		waitForDom("ntb-lookup-text", "10000");
		waitForDom("ntb-lookup-options", "1000");
		selenium.waitForCondition(getEvalString("document.getElementById('lookup_span').offsetLeft > 0"),"2000");
		clickElementById("ntb-lookup-text");
		selenium.setCursorPosition("ntb-lookup-text","-1");
		for (int i=0; i<downChange; i++) {
			keyPressOnElement("ntb-lookup-text","40");
		}
		keyPressOnElement("ntb-lookup-text","13");
		selenium.waitForCondition(getEvalString("document.getElementById('lookup_span').offsetLeft < -1000"),"2000");
	}
	
	protected void changeListboxByClick(int colIndex, int rowIndex, int selectIndex) 
	{
		String uid = getUID(this.declarationId);
		clickCell(colIndex, rowIndex);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);
		waitForDom("ntb-listbox", "10000");
		selenium.waitForCondition(getEvalString("document.getElementById('listbox_span').offsetLeft > 0"),"2000");
		selenium.select("id=ntb-listbox","value=Audio Tape Player");
		//clickLookupOption(selectIndex);
		selenium.waitForCondition(getEvalString("document.getElementById('listbox_span').offsetLeft < 0"),"2000");
	}
	
	protected void clickLinkEditor(int colIndex, int rowIndex)
	{
		String uid = getUID(this.declarationId);
		String selectBox = "selectbox"+uid;
		waitForDom(selectBox, "10000");
		clickElementById(selectBox);
		selenium.waitForCondition("if ("+testWindow+".nitobi.getGrid('"+this.declarationId+"').getColumnObject(9).getEditor().control) true; else false;","5000");
	}
	
	protected boolean isCbCellChecked(int colIndex, int rowIndex)
	{
		String uid = getUID(this.declarationId);
		String cellId = getCellId(rowIndex, colIndex, uid);
		selenium.waitForCondition(getEvalString("document.getElementById('"+cellId+"').firstChild.firstChild.firstChild.getAttribute('checked') == 'yes'"), "3000");
		return true;
	}
	
	protected boolean isEditorVisible(String placeholderId)
	{
		waitForDom(placeholderId,"1000");
		int leftPos = selenium.getElementPositionLeft(placeholderId).intValue();
		if (leftPos < 0)
			return false;
		else
			return true;
	}

	protected void blurElement(String id)
	{
		selenium.fireEvent("dom="+testWindow+".document.getElementById('"+id+"')","blur");
	}	

	protected void select(int startCol, int startRow, int endCol, int endRow)
	{
		String uid = getUID(this.declarationId);
		// First fire the mousedown on the start cell.
		selenium.mouseDown("id="+getCellId(startRow, startCol, uid));
		// Then fire the mousemove on the end cell.
		selenium.mouseMove("id="+getCellId(endRow, endCol, uid));
		// Finally fire the mouseup on the end cell.
		selenium.mouseUp("id=selectbox"+uid);
	}
	
	protected void clickElementById(String id)
	{
		selenium.mouseDown("id="+id);
		selenium.mouseUp("id="+id);
		selenium.click("id="+id);
	}

	protected void clickElementByIdAt(String id, String coords)
	{
		//selenium.fireEvent("dom="+testWindow+".document.getElementById('"+id+"')","mousedown");
		//selenium.fireEvent("dom="+testWindow+".document.getElementById('"+id+"')","mouseup");
		//selenium.fireEvent("dom="+testWindow+".document.getElementById('"+id+"')","click");
		selenium.mouseDownAt("id="+id, coords);
		selenium.mouseUpAt("id="+id, coords);
		selenium.clickAt("id="+id, coords);
	}
	
	protected void clickElementByTagName(String name) 
	{
		selenium.mouseDown("dom="+testWindow+".document.getElementsByTagName('"+name+"')[0]");
		selenium.mouseUp("dom="+testWindow+".document.getElementsByTagName('"+name+"')[0]");
		selenium.click("dom="+testWindow+".document.getElementsByTagName('"+name+"')[0]");
	}
	
	protected void clickLookupOption(int index) 
	{
		selenium.mouseDown("dom="+testWindow+".document.getElementsByTagName('option')["+index+"]");
		selenium.mouseUp("dom="+testWindow+".document.getElementsByTagName('option')["+index+"]");
		selenium.click("dom="+testWindow+".document.getElementsByTagName('option')["+index+"]");
	}	
	
	protected void scrollGridToPixels(String pixels)
	{
		eval("document.getElementById('vscroll"+this.declarationId+"').scrollTop = "+pixels+";");
	}
	
	protected void keyPressOnElement(String el, String keycode)
	{
		selenium.keyDown(el,keycode);
		selenium.keyUp(el,keycode);
		selenium.keyPress(el,keycode);		
	}

	protected void clickColumnHeader(int colIndex)
	{
		String uid = getUID(this.declarationId);
		String id = getHeaderId(colIndex,uid);
		waitForDom(id, "10000");
		clickElementById(id);
	}

	/**
	 * Resizes the column from the original width by dx.
	 * @param colIndex
	 * @param dx
	 */
	protected void resizeColumn(int colIndex, int dx)
	{
		String uid = getUID(this.declarationId);
		String colId = getHeaderId(colIndex,uid);
		waitForDom(colId, "10000");
		int colRight = selenium.getElementPositionLeft("id="+getHeaderId(colIndex+1,uid)).intValue();
		int colWidth = selenium.getElementWidth("id="+colId).intValue();
		selenium.mouseDownAt("id="+colId, String.valueOf(colWidth)+",10");
		String newRight = String.valueOf(colRight + dx);
		selenium.mouseMoveAt(getDomLocator("document.body"), newRight+",10");
		selenium.mouseUpAt(getDomLocator("document.body"), newRight+",10");
	}

	protected int getColumnDomWidth(int colIndex)
	{
		// TODO: get the width of the column as the grid thinks it is
		return 0;
	}

	protected int getColumnWidth(int colIndex)
	{
		String uid = getUID(this.declarationId);
		String colId = getHeaderId(colIndex,uid);
		waitForDom(colId, "10000");
		return selenium.getElementWidth("id="+colId).intValue();
	}

	/**
	 * Gets the locator string for a DOM node in the test document.
	 * Returns something like "dom=testdoc.DOMSTRING where DOMSTRING is an argument.
	 * @param dom
	 */
	protected String getDomLocator(String dom)
	{
		return "dom="+getEvalString(dom);
	}

	protected void waitForDom(String domId, String time)
	{
		selenium.waitForCondition(getEvalString("document.getElementById('"+domId+"')"),time);
	}
	
	protected String getSelectedCellValue()
	{
		return eval("nitobi.getGrid('"+this.declarationId+"').getSelectedCellObject().getValue()");
	}

	protected String getUID(String id){
		return eval("nitobi.getGrid('"+id+"').uid");
	}
	
	protected void pause(String millis) {
		selenium.getEval("var date = new Date(); var curDate = null; do { curDate=new Date(); } while(curDate-date < "+millis+"); ");
	}
	
	public void tearDown() throws Exception{
		selenium.stop();
		super.tearDown();
	}

}
