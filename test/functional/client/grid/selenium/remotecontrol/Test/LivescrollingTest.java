package RemoteControl.Test;

import RemoteControl.BaseTest;

public class LivescrollingTest extends BaseTest {
	
	public void setUp() throws Exception {		
		super.setUp();

		// Set the ID of the component declaration node
		this.declarationId = "LiveScrollingGrid2";

		// You can set the browser here if you want but otherwise the default will be firefox and or it should be passed in from ANT
		//this.browser = "*Safari";

		// You can set the standards mode here if you want but otherwise the default will be true
		//this.standards = false;

		// Call start session
		startSession("/completeui/samples/client/grid/php/livescrolling/index.html", "http://localhost");
	}	
	
	public void testOnCellClick() throws Exception 
	{
		clickCell(2,2);
		assertEquals("President", getSelectedCellValue());
	}
	
	public void testScroll() throws Exception 
	{
		clickCell(2,2);
		scrollGridToPixels("500");
		clickCell(1,30);
		assertEquals("mstevens@professional.com", getSelectedCellValue());
		scrollGridToPixels("10000");
		clickCell(1,36);
		assertEquals("halle.morga@fastweb.com", getSelectedCellValue());
	}
	
	public void tearDown() throws Exception {
		super.tearDown();
	}
}
