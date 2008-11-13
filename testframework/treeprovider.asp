<%
	Response.Expires=0
	Response.Buffer = true
	Response.Clear()
	Response.ContentType="text/xml"
%>
<tree>
<%
Dim fs,fo
Dim dir
dir = Request.QueryString("parentNodeId")
dir = replace(dir,"\","/")
Set fs=Server.CreateObject("Scripting.FileSystemObject")
Set fo=fs.GetFolder(dir)

for each x in fo.files
  'Print the name of all files in the test folder
  if (instr(x.name,".test.") > 0 or instr(x.name,".jsunit.") > 0 ) then
    Response.write("<node label='" & x.Name & "' id='" &  dir & "/" & x.Name & "' isLeaf='true'/>")
   end if
next

for each x in fo.subfolders
  'Print the name of all files in the test folder
  if (instr(x.name,"svn") = 0) then
    
  	Response.write("<node label='" & x.Name & "' id='" & dir & "/" & x.Name&"' />")
  end if
next

set fo=nothing
set fs=nothing
%>
</tree>