package RemoteControl.Test;

import com.thoughtworks.selenium.*;
import java.util.regex.Pattern;
import RemoteControl.BaseTest;

public  AddRemove extends BaseTest {

  public void setUp() throws Exception {
    super.setUp();

    startSession("/completeui/samples/client/tree/html/addremove/index.html", "http://localhost");

  }

  public void testTopLevelNode(){
    String hiddenChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getHtmlNode().childNodes[1].className;");
    String expander = eval("nitobi.getComponent('tree1').getChildren().list[2].getHtmlNode('expander').id;");
    selenium.click(expander);
    String shownChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getHtmlNode().childNodes[1].className;");
    assertTrue(!hiddenChildren.equals(shownChildren));
  }

  public void testSecondLastNode(){
    String expanderOne = eval("nitobi.getComponent('tree1').getChildren().list[2].getHtmlNode('expander').id;");
    selenium.click(expanderOne);
    pause("1000");
    String shownChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getChildren().getHtmlNode().className;");
    String expanderTwo = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getHtmlNode('expander').id;");
    selenium.click(expanderTwo);
    String hiddenChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getChildren().getHtmlNode().className;");
    assertTrue(!shownChildren.equals(hiddenChildren));
  }

  public void testSecondMiddleNode(){
    String expanderOne = eval("nitobi.getComponent('tree1').getChildren().list[2].getHtmlNode('expander').id;");
    selenium.click(expanderOne);
    pause("1000");
    String shownChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getChildren().getHtmlNode().className;");
    String expanderTwo = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getHtmlNode('expander').id;");
    selenium.click(expanderTwo);
    String hiddenChildren = eval("nitobi.getComponent('tree1').getChildren().list[2].getChildren().list[3].getChildren().getHtmlNode().className;");
    assertTrue(!shownChildren.equals(hiddenChildren));
  }

  public void testInsertNode(){
    String leafNode = eval("nitobi.getComponent('tree1').getChildren().list[1].id;");
    selenium.click(leafNode);
    selenium.click("link=Insert Node");
    String newLeafNode = eval("nitobi.getComponent('tree1').getChildren().list[1].id;");
    assertTrue(!newLeafNode.equals(leafNode));
  }

  public void testAddChildNode(){
    String parentNode = eval("nitobi.getComponent('tree1').getChildren().list[0].id;");
    String childCount = eval("nitobi.getComponent('tree1').getChildren().list[0].getChildren.list.length;");
    selenium.click(parentNode);
    selenium.click("link=Add Child");
    String newChildCount = eval("nitobi.getComponent('tree1').getChildren().list[0].getChildren.list.length;");
    assertTrue(!childCount.equals(newChildCount));
  }

  public void testRemoveNode(){
    String childCount = eval("nitobi.getComponent('tree1').getChildren().list.length;");
    String victim = eval("nitobi.getComponent('tree1').getChildren.list[1].id;");
    selenium.click(victim);
    selenium.click("link=Remove Node");
    String survivorCount = eval("nitobi.getComponent('tree1').getChildren().list;");
    assertTrue(!childCount.equals(survivorCount));
  }

  public void tearDown() throws Exception {
    super.tearDown();
  }

}
