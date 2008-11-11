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
    String hiddenDiv = eval("(document.getElementsByClassName(\"ntb-calendar\")[0]).className.split(\" \").length;");
    selenium.click("dp.button");
    String shownDiv = eval("(document.getElementsByClassName(\"ntb-calendar\")[0]).className.split(\" \").length;");
    assertTrue(!hiddenDiv.equals(shownDiv));
  }

  /*
   * Simple test to change things to the following month
   */

  public void testMonthButton(){
    String startMonth = eval("document.getElementsByClassName(\"ntb-calendar-month\")[0].innerHTML;");
		selenium.click("dp.button");
		selenium.click("id0x231f65205ntbcmp_0.nextmonth");
    String endMonth = eval("document.getElementsByClassName(\"ntb-calendar-month\")[0].innerHTML;");
    assertTrue(!startMonth.equals(endMonth));
    selenium.click("dp.button");
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
    assertTrue(!startTheme.equals(endTheme));
  }

  /*
   * Test the change of the year and the month.
   */

  public void testMonthYearChange(){
    String startMonth = eval("document.getElementsByClassName(\"ntb-calendar-month\")[0].innerHTML;");
    
    String startDate = eval("nitobi.getComponent(\"dp\").getSelectedDate();");
		selenium.click("dp.button");
		selenium.click("link=" + startMonth);
		selenium.select("id0x20eed9c05ntbcmp_0.months", "label=February");
		selenium.type("id0x20eed9c05ntbcmp_0.year", "2010");
		selenium.click("id0x20eed9c05ntbcmp_0.navconfirm");
		selenium.click("link=12");
    String endDate = eval("nitobi.getComponent(\"dp\").getSelectedDate();");
    assertTrue(!startTheme.equals(endTheme));
  }

  public void tearDown() throws Exception {
    super.tearDown();
  }

}
