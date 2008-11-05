package RemoteControl.Test;

import RemoteControl.BaseTest;
import RemoteControl.Configuration;
import junit.framework.*;
import com.thoughtworks.selenium.*;

public class SelectionTest extends BaseTest {
	
	public void setUp() throws Exception {		
		super.setUp();

		// Set the ID of the component declaration node
		this.declarationId = "EditorsGrid";

		// Call start session
		startSession("/completeui/samples/client/grid/php/editors/index.html", "http://localhost");
	}

	public void testSelection() throws Exception {
		clickCell(2,2);
		select(3,3,6,6);
		//assertEquals(origWidth + 100, getColumnWidth(2));
	}
	
	public void tearDown() throws Exception {
		//super.tearDown();
	}
}
