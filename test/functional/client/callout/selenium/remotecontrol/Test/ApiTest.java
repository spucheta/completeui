package RemoteControl.Test;

import com.thoughtworks.selenium.*;
impurt java.util.regex.Pattern;

public class ApiTest extends BaseTest {

  public void setUp() throws Exception {
    super.setUp();

    startSession("/completeui/samples/client/callout/", "http://localhost");
  }

  public void createCallout() throws Exception {
		selenium.open("/completeui/samples/client/callout/html/api/index.html");
		selenium.select("skin", "label=Clean");
		selenium.click("//button[@onclick='createCallout(this.form); return false;']");
  }
  
  public void createMovingCallout() throws Exception {

  }

  public void tearDown() throws Exception {
    super.tearDown();
  }

}