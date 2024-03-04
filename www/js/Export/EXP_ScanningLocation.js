
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var UserId = window.localStorage.getItem("UserID");
var CurrentDate;
var html;

(function () {
    document.addEventListener("deviceready", OnPageLoad, false);

    var formattedDate = new Date();
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2))
        d = '0' + d;
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    if (m.toString().length < Number(2))
        m = '0' + m;
    var y = formattedDate.getFullYear();
    CurrentDate = m + "/" + d + "/" + y;

})();

var LocationId;

function PutGPno() {

    if (document.getElementById('chkManual').checked) {
        var formattedDate = new Date();
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();
        CurrentDate = m + "/" + d + "/" + y;

        var date = 'S' + y.toString() + m.toString() + d.toString();
        $('#txtTokenNo').val(date);
        $('#txtTokenNo').focus();

    } else {
        clearALL();
    }

}

function OnPageLoad() {
    var Query = window.location.search;

    var ScanLocation = "";
    if ((Query.split('&')[0].split('=')[1]).toString() == "divGateIn") {
        ScanLocation = "Gate In";
        LocationId = 2;
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockIn") {
        ScanLocation = "Dock In";
        LocationId = 3;
        $("#divGateNo").show();
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockOut") {
        ScanLocation = "Dock Out";
        LocationId = 4;
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divGateOut") {
        ScanLocation = "Gate Out";
        LocationId = 5;
    }
    $('#txtScanLoc').val(ScanLocation);
}

function GetLocationScanDetails() {

    $("#divTable").hide();
    $("#divMain").show();

    clearBeforePopulate();

    $("#btnViewAWB").removeAttr("disabled");
    $("#btnSave").removeAttr("disabled");

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var TokenNo = $('#txtTokenNo').val();

    if (TokenNo == '') {
        errmsg = "Please enter Token No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetExpVehicelTokenScanDetails_PDA",
            data: JSON.stringify({ 'pi_strTokenNo': TokenNo, 'pi_intLoc': LocationId }),
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
                if (str != null && str != "") {


                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        $('#divAddTestLocation').empty();
                        html = '';

                        html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                        html += "<thead><tr>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>AWB No.</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>TSP</th>";
                        html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
                        html += "</tr></thead>";
                        html += "<tbody>";

                        var xmlDoc = $.parseXML(str);

                        $(xmlDoc).find('Table').each(function (index) {

                            var location;
                            var locPieces;

                            AWB = $(this).find('AWBNo').text();
                            TSP = $(this).find('TSPNo').text();
                            Pieces = $(this).find('TSPPieces').text();

                            AddTableAWBDetails(AWB, TSP, Pieces);
                        });

                        html += "</tbody></table>";
                        $('#divAddTestLocation').append(html);
                        if (index == 0) {

                            var outmsg = $(this).find('OutMsg').text()

                            if (outmsg.length > Number(0)) {
                                errmsg = outmsg;
                                $.alert(errmsg);
                                $("#btnViewAWB").attr('disabled', 'disabled');
                                return;
                            }                           

                            else {
                                $('#txtPieces').val($(this).find('TotPieces').text());
                                $('#txtWeight').val($(this).find('TotGrWt').text());
                                $('#txtVehicleNo').val($(this).find('VehicleNo').text());
                                $('#txtDriverName').val($(this).find('DriverName').text());
                                $('#txtArea').val($(this).find('Area').text());

                                if ($(this).find('DockNo').text() != '')
                                    $('#txtGateNo').val($(this).find('DockNo').text());
                            }

                            if (LocationId == 2) {
                                if ($(this).find('MainGateInStatus').text() == 'true') {
                                    $("#btnSave").attr('disabled', 'disabled');
                                }
                            }

                            if (LocationId == 3) {
                                if ($(this).find('DockInStatus').text() == 'true') {
                                    $("#btnSave").attr('disabled', 'disabled');
                                }
                            }

                            if (LocationId == 4) {
                                if ($(this).find('DockOutStatus').text() == 'true') {
                                    $("#btnSave").attr('disabled', 'disabled');
                                }
                            }

                            if (LocationId == 5) {
                                if ($(this).find('MainGateOutStatus').text() == 'true') {
                                    $("#btnSave").attr('disabled', 'disabled');
                                }
                            }
                        }
                    });

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
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}

function AddTableAWBDetails(AWBno, TSP, Pieces) {

    html += "<tr>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + AWBno + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + TSP + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pieces + "</td>";

    html += "</tr>";

}

function DisplayAWBTable() {
    GetLocationScanDetails();
    $("#divMain").hide();
    $("#divTable").show();
}

function DisplayMainDetails() {
    $("#divTable").hide();
    $("#divMain").show();
}

function SaveLocationScanDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var TokenNo = $('#txtTokenNo').val();
    var GateNo = $('#txtGateNo').val();

    if (TokenNo == "") {

        errmsg = "Please enter Token No";
        $.alert(errmsg);
        return;

    }

    //if (GateNo == "") {

    //    errmsg = "Please enter Gate No";
    //    $.alert(errmsg);
    //    return;

    //}

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "UpdateScanDetails_PDA",
            //url: 'http://localhost:8080/GmaxCMSWebservice/CMS_WS_PDA.asmx/' + "UpdateScanDetails_PDA",
            data: JSON.stringify({
                'pi_intLoc': LocationId, 'pi_strTokenNo': TokenNo, 'pi_strUserId': window.localStorage.getItem("UserName"),
                'pi_strEvent': 'U', 'pi_dtScanningDate': CurrentDate, 'pi_blnISPDA': 'true', 'pi_strGateNo': GateNo, 'pi_strDocumentsList': ''
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');

                var response = response.d;
                //$.alert(response.d);

                var xmlDoc = $.parseXML(response);
                $(xmlDoc).find('Table').each(function () {

                    var OutMsg = $(this).find('OutMsg').text();
                    
                    if (OutMsg.indexOf('status is done') != -1) {
                        $.alert(OutMsg);
                        clearALL();
                    }
                    else
                        $.alert(OutMsg);
                });

                
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function clearALL() {
    //$('#txtTokenNo').val('');
    $('#txtAWBNo').val('');
    $('#txtTSPNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#txtArea').val('');
    $('#txtGateNo').val('COG');
    $('#txtLocation').val('');
    $('#txtTokenNo').val('');
    $('#txtTokenNo').focus();
    $('#chkManual').removeAttr('checked');
}

function clearBeforePopulate() {
    $('#txtAWBNo').val('');
    $('#txtTSPNo').val('');
    $('#txtPieces').val('');
    $('#txtWeight').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#txtZone').val('');
    $('#txtGateNo').val('COG');
    $('#txtLocation').val('');
}