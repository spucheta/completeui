<%@ Language = VBScript %>
<%
'returns an empty datagram
'fields: OrderDate|ProductName|ProductPrice|Quantity|deleteImgUrl|leftImgUrl|rightImgUrl|chartImgUrl
Response.ContentType="text/xml"
Response.Expires=0
Response.Buffer = true
Response.Clear()
Response.addHeader "charset", "UTF-8"

Response.write "<?xml version=""1.0"" encoding=""UTF-8""?><root xml:lang=""en"" fields=""OrderDate|ProductName|ProductPrice|Quantity|deleteImgUrl|leftImgUrl|rightImgUrl|chartImgUrl"" keys=""OrderDate|ProductName|ProductPrice|Quantity|deleteImgUrl|leftImgUrl|rightImgUrl|chartImgUrl""></root>"
%>