package RemoteControl.Test;

import RemoteControl.BaseTest;
import RemoteControl.Configuration;
import junit.framework.*;
import com.thoughtworks.selenium.*;

public class RenderTest extends BaseTest {
	
	public void setUp() throws Exception {		
		super.setUp();

		// Set the ID of the component declaration node
		this.declarationId = "EditorsGrid";

		// You can set the browser here if you want but otherwise the default will be firefox and or it should be passed in from ANT
		//this.browser = "*Safari";

		// You can set the standards mode here if you want but otherwise the default will be true
		//this.standards = false;

		// Call start session
		startSession("/completeui/samples/client/grid/php/editors/index.html", "http://localhost");
	}

	public void testOnCellClick() throws Exception {
		clickCell(2,2);
		assertEquals("Aleenes Quick Dry Tacky Glue", getSelectedCellValue());
	}

	public void testWidth() throws Exception {
		clickCell(2,2);
		String offsetWidth = eval("nitobi.getGrid('"+this.declarationId+"').getGridContainer().offsetWidth");
		String specifiedWidth = eval("nitobi.getGrid('"+this.declarationId+"').getWidth()");
		assertEquals(offsetWidth, specifiedWidth);
	}

	public void testHeight() throws Exception {
		clickCell(2,2);
		String offsetHeight = eval("nitobi.getGrid('"+this.declarationId+"').getGridContainer().offsetHeight");
		String specifiedHeight = eval("nitobi.getGrid('"+this.declarationId+"').getHeight()");
		assertEquals(offsetHeight, specifiedHeight);
	}
	
	public void tearDown() throws Exception {
		super.tearDown();
	}
}
