if (typeof(PATH_GridTest) == "undefined" || PATH_GridTest == null)
{
	initTest();
}

function generateTests()
  {
	  var testTable = document.getElementById("testTable");
	  for(rowNum = testTable.rows.length - 1; rowNum >= 0; rowNum--)
      {
            var row = testTable.rows[rowNum];
            for (var i = 0;i<row.cells.length;i++)
            {
	            var cell = row.cells[i];
	            var testName = cell.getAttribute("testName");
	            if (testName != null && testName != "")
	            {
		            cell.innerHTML = PATH_GridTest + testName;
	            }
            }
      }
  }