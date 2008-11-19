package RemoteControl.Test;

import com.thoughtworks.selenium.*;
import java.util.regex.Pattern;
import RemoteControl.BaseTest;

public class RenderTest extends BaseTest {

  public void setUp() throws Exception {
    super.setUp();

    startSession("/completeui/samples/client/calendar/html/themes/index.html", "http://localhost");
  }

  /*
   * Test to see whether the calendar actually appears when we click the button
   */
  public void testCalendarRender(){
    // This is horribly ugly
    String hiddenDiv = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode().className.split(\" \").length;");
    selenium.click("dp.button");
    // Firefox flies through this too fast, wait a second
    pause("1000");
    String shownDiv = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode().className.split(\" \").length;");
    assertTrue(!hiddenDiv.equals(shownDiv));
  }

  /*
   * Simple test to change things to the following month
   */

  public void testMonthButton(){
    // We need to wait for the DOM to load to see if Nitobi has loaded
    String startMonth = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('nav').childNodes[0].innerHTML;");
		selenium.click("dp.button");
    /* 
     * We need to get the id of the button to click
     * otherwise this epic fails
     */
    String next_month_id = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('nextmonth').id;");
		selenium.click(next_month_id);
    String endMonth = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('nav').childNodes[0].innerHTML;");
    assertTrue(!startMonth.equals(endMonth));
  }

  /*
   * Change the date to the 12th of the month
   */ 

  public void testDateSelect(){
    String startDate = eval("nitobi.getComponent(\"dp\").getSelectedDate();");
    selenium.click("dp.button");
		selenium.click("link=12"); 
    String endDate = eval("nitobi.getComponent(\"dp\").getSelectedDate();");
    assertTrue(!startDate.equals(endDate));
  }

  /*
   * Test the changing of the theme, make sure it has been applied
   */
  public void testThemeChange(){
    String startTheme = eval("nitobi.getComponent(\"dp\").getTheme();");
    selenium.click("//div[@id='gloss']/img");
    String endTheme = eval("nitobi.getComponent(\"dp\").getTheme();");
    assertTrue(!(startTheme.equals(endTheme)));
  }

  /*
   * Test the change of the year and the month.
   */

  public void testMonthYearChange(){
    String startMonth = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('nav').childNodes[0].innerHTML;");
    String startDate = eval("nitobi.getComponent('dp').getSelectedDate();");
		selenium.click("dp.button");
		selenium.click("link=" + startMonth);
    /* 
     * Need to get the month and the year of these selects
     */
    String monthSelect = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('months').id;");
    String yearField = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('year').id;");
		selenium.select(monthSelect, "label=February");
		selenium.type(yearField, "2010");
    /*
     * Get the confirmation button!
     */
    String confirmButton = eval("nitobi.getComponent('dp').getCalendar().getHtmlNode('navconfirm').id;");
		selenium.click(confirmButton);
		selenium.click("link=12");
    String endDate = eval("nitobi.getComponent(\"dp\").getSelectedDate();");
    assertTrue(!startDate.equals(endDate));
  }

  public void tearDown() throws Exception {
    super.tearDown();
  }

}
