package RemoteControl;

import com.thoughtworks.selenium.*;
import java.util.regex.Pattern;

public class BaseTest extends SeleneseTestCase {

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

	protected void blurElement(String id)
	{
		selenium.fireEvent("dom="+testWindow+".document.getElementById('"+id+"')","blur");
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
	
	protected String getUID(String id){
		return eval("nitobi.getComponent('"+id+"').uid");
	}
	
	protected void pause(String millis) {
		selenium.getEval("var date = new Date(); var curDate = null; do { curDate=new Date(); } while(curDate-date < "+millis+"); ");
	}
	
	public void tearDown() throws Exception{
		selenium.stop();
		super.tearDown();
	}

}
