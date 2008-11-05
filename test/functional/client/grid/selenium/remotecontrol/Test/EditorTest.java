package RemoteControl.Test;

import RemoteControl.BaseTest;

public class EditorTest extends BaseTest {
	
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
	
	public void testNumberEditor() throws Exception {
		clickCell(5,2);
		assertEquals("3", getSelectedCellValue());
		editCell(5,2,"hello");
		assertEquals("3", getSelectedCellValue());
		pause("1000");
		editCell(5,2,"123456789");
		assertFalse(isEditorVisible("text_span"));
		assertEquals("123456789", getSelectedCellValue());
	}		
	
	public void testTextEditor() throws Exception {
		// Click the cell and check the resulting selected cell value
		clickCell(2,2);
		assertEquals("Aleenes Quick Dry Tacky Glue", getSelectedCellValue());
		// Edit a cell and then recheck the cell value
		editCell(2,2,"New Value");
		assertFalse(isEditorVisible("text_span"));
		assertEquals("New Value", getSelectedCellValue());
	}
	
	public void testLookupEditor() throws Exception {
		clickCell(3,2);
		assertEquals("Adhesive", getSelectedCellValue());
		changeLookupByClick(3,2,10);
		assertEquals("Audio Tape Player", getSelectedCellValue());
		clickCell(3,3);
		clickCell(3,2);
		changeLookupWithArrows(3,2,10);
		clickCell(3,2);
		assertEquals("Blacktop", getSelectedCellValue());
	}
	
	public void testListBoxEditor() throws Exception {
		clickCell(11,2);
		assertEquals("Adhesive",getSelectedCellValue());
		changeListboxByClick(11,2,10);
		assertEquals("Audio Tape Player",getSelectedCellValue());
	}
	
	public void testLinkEditor() throws Exception {
		clickCell(9,5);
		clickLinkEditor(9,5);
	}
	
	public void testCheckboxEditor() throws Exception {
		clickCell(1,5);
		assertEquals("no",getSelectedCellValue());
		clickCell(1,6);
		dblClickCell(1,5);
		assertTrue(isCbCellChecked(1,5));
		assertEquals("yes",getSelectedCellValue());
	}
	
	public void testDateEditor() throws Exception {
		dblClickCell(8,5);
		assertTrue(isEditorVisible("calendar_span"));
		clickElementById("ntb-datepicker-button");
		String placeholderId = eval("nitobi.getComponent('EditorsGrid').getColumnObject(8).getEditor().datePicker.htmlNode.id;");
		assertTrue(isEditorVisible(placeholderId));
		clickElementById("ntb-datepicker-button");
		//assertFalse(isEditorVisible(placeholderId));
		blurElement("ntb-datepicker-input");
		assertFalse(isEditorVisible("calendar_span"));
	}
	
	public void tearDown() throws Exception {
		super.tearDown();
	}
}
