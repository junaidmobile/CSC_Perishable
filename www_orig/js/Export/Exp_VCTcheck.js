//document.addEventListener("deviceready", GetCommodityList, false);

var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var html;
var htmlAWB;
var strXmlStore;
var flag = "";

$(function () {

    if (window.localStorage.getItem("RoleExpVCTCheck") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }

    $("#rdoSlot").click(function () {
        $('#txtAWBNo').val('');
        $('#divVCT').empty();
        $('#divAWBInfo').empty();
        html = '';
        htmlAWB = '';
    });

    $("#rdoAWB").click(function () {
        $('#txtAWBNo').val('');
        $('#divVCT').empty();
        $('#divAWBInfo').empty();
        html = '';
        htmlAWB = '';
    });

});

function GetShipmentStatus() {

    $('#divAWBInfo').hide();
    // $('#divVCT').hide();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    //var SlotNo;
    var AWBNo;

    if (document.getElementById('rdoSlot').checked) {
        AWBNo = $('#txtAWBNo').val();
        flag = 'S';
    }
    if (document.getElementById('rdoAWB').checked) {
        AWBNo = $('#txtAWBNo').val();
        flag = 'A';
    }


    if (document.getElementById('rdoAWB').checked && AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (document.getElementById('rdoSlot').checked && AWBNo == '') {
        errmsg = "Please enter Slot No.";
        $.alert(errmsg);
        return;
    }

    if (document.getElementById('rdoAWB').checked) {
        if (AWBNo.length != '11') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            return;
        }
    }

    if (document.getElementById('rdoSlot').checked) {
        if (AWBNo.length != '13') {
            errmsg = "Please enter valid Slot No.";
            $.alert(errmsg);
            return;
        }
    }


    //if (document.getElementById('rdoSlot').checked && AWBNo.length != '13') {
    //    errmsg = "Please enter valid Slot No.";
    //    $.alert(errmsg);
    //    return;
    //}

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetVCTdetails_PDA",
            data: JSON.stringify({ 'pi_strAWBNo': AWBNo, 'pi_strFlag': flag }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                var str = response.d;

                strXmlStore = str;

                var xmlDoc = $.parseXML(str);

                $(xmlDoc).find('Table').each(function (index) {

                    if ($(this).find('OutMsg').text() != null && $(this).find('OutMsg').text() != "") {
                        $.alert($(this).find('OutMsg').text());
                        return false;
                    }
                });

                if (str != null && str != "") {

                    $('#divVCT').empty();
                    $('#divAWBInfo').empty();
                    html = '';
                    htmlAWB = '';

                    htmlAWB = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    htmlAWB += "<thead><tr>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>AWBNo.</th>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>SlotNo.</th>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Vehicle</th>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>TDG Date</th>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>TDG User</th>";
                    htmlAWB += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pieces</th>";
                    htmlAWB += "</tr></thead>";
                    htmlAWB += "<tbody>";

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Event Name</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Datetime</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>UserName</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";



                    $(xmlDoc).find('Table').each(function (index) {

                        var AWBNo;
                        var SlotNo;
                        var Vehicle;
                        var TDGDt;
                        var TDGUser;
                        var Pieces;

                        AWBNo = $(this).find('AWBNo').text();
                        SlotNo = $(this).find('SlotNo').text();
                        Vehicle = $(this).find('Vehicle').text();
                        TDGDt = $(this).find('TDGDt').text();
                        TDGUser = $(this).find('TDGUser').text();
                        Pieces = $(this).find('Pieces').text();

                        AddTableLocationAWB(AWBNo, SlotNo, Vehicle, TDGDt, TDGUser, Pieces);
                    });

                    $(xmlDoc).find('Table1').each(function (index) {

                        var eventName;
                        var dateTime;
                        var userName;

                        eventName = $(this).find('EventName').text();
                        dateTime = $(this).find('EventDt').text();
                        userName = $(this).find('UserId').text();

                        AddTableLocation(eventName, dateTime, userName);
                    });

                    html += "</tbody></table>";

                    $('#divVCT').append(html);

                    $('#divAWBInfo').append(htmlAWB);

                    $('#divAWBInfo').show();
                    if (flag == 'S')
                        $('#divVCT').show();

                }
                else {
                    errmsg = 'Shipment does not exists';
                    $.alert(errmsg);
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
    }
}

function AddTableLocationAWB(AWBNo, SlotNo, Vehicle, TDGDt, TDGUser, Pieces) {
    if (flag == 'A')
        htmlAWB += "<tr onclick='SelectAWBInfo(this);'>";
    else
        htmlAWB += "<tr'>";
    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + AWBNo + "</td>";

    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + SlotNo + "</td>";

    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Vehicle + "</td>";

    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + TDGDt + "</td>";

    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + TDGUser + "</td>";

    htmlAWB += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";

    htmlAWB += "</tr>";
}

function AddTableLocation(eventName, dateTime, userName) {
    html += "<tr>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + eventName + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + dateTime + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + userName + "</td>";

    html += "</tr>";
}

function SelectAWBInfo(a) {

    $('#divVCT').empty();
    html = '';

    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
    html += "<thead><tr>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Event Name</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Datetime</th>";
    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>UserName</th>";
    html += "</tr></thead>";
    html += "<tbody>";

    var xmlDoc = $.parseXML(strXmlStore);
    var selectedRowSlotNo;

    $(xmlDoc).find('Table').each(function (index) {

        if (index == a.rowIndex - 1) {
            selectedRowSlotNo = $(this).find('SlotNo').text();
        }
    });

    $(xmlDoc).find('Table1').each(function (index) {

        var thisSlotNo = $(this).find('SlotNo').text();
        if (thisSlotNo == selectedRowSlotNo) {

            var eventName;
            var dateTime;
            var userName;

            eventName = $(this).find('EventName').text();
            dateTime = $(this).find('EventDt').text();
            userName = $(this).find('UserId').text();

            AddTableLocation(eventName, dateTime, userName);

        }
    });

    html += "</tbody></table>";

    $('#divVCT').append(html);

    $('#divVCT').show();

}

function clearBeforePopulate() {
    $('#txtAWBNo').val('');
    $('#divVCT').empty();
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
}


