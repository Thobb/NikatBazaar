<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MakeList.aspx.cs" Inherits="MakeList" %>
<%@ Register Src="UIControl/MakeList.ascx" TagName="MakeList"
    TagPrefix="uc3" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link href="Content/MakeList.css" rel="stylesheet" type="text/css" />
    <title></title>
</head>
<body style="height: 642px">
    <form id="form1" runat="server">
    <div id="MakeList">
        <div id="MakeListItem">
            <uc3:MakeList ID="MakeListitem" runat="server" />
        </div>
    
    </div>
    </form>
</body>
</html>
