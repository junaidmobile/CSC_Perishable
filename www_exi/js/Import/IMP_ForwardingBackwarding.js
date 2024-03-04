var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var SelectedHawbId;
var IGMno;
var strXmlStore;
var locPieces;
var html;
var FromLoc;
var Hawbid;
var flagMovement;
var serviceName;
var locid;
var OldLocationId;
var IsFlightFinalized;
var GHAflightSeqNo;
var isForward;
var isBackward;


$(function () {

    isForward = '';
    isBackward = 1;
    
    $("#btnSubmit").removeAttr("disabled");

    if (window.localStorage.getItem("RoleIMPFwdBkd") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

    flagMovement = '';
    serviceName = '';

    $("#rdoForwarding").click(function () {
        rdoForwardingChecked();
        isForward = 1;
        isBackward = '';
        $("#btnSubmit").removeAttr("disabled");
    });

    $("#rdoBackwarding").click(function () {
        rdoBackwardingChecked();
        isBackward = 1;
        isForward = '';
        $("#btnSubmit").removeAttr("disabled");
    });
});


function rdoForwardingChecked() {
    clearALL();
    flagMovement = 'F';
}

function rdoBackwardingChecked() {
    clearALL();
    flagMovement = 'B';
}

function GetMovementDetails() {
    if (document.getElementById('rdoForwarding').checked) {
        GetForwardingBCMovementDetails();
        i
    }
    if (document.getElementById('rdoBackwarding').checked) {
        GetBackwardingBCMovementDetails();
    }
}

function SaveMovementDetails() {
    if (document.getElementById('rdoForwarding').checked) {
        SaveInternalForwardDetails();
    }
    if (document.getElementById('rdoBackwarding').checked) {
        SaveInternalBackwardDetails();
    }
}

//function GetForwardingBCMovementDetails() {

//    //clearBeforePopulate();
//    $('#txtFromLoc').val('');
//    $('#txtTotPkgs').val('');
//    $('#txtMawbNo').val('');
//    $('#txtHawbNo').val('');
//    $('#txtAWBNo').val('');
//    $('#txtOrigin').val('');
//    $('#txtDestination').val('');

//    var connectionStatus = navigator.onLine ? 'online' : 'offline'
//    var errmsg = "";

//    var BCNo = $('#txtBCNo').val();

//    if (BCNo == '') {
//        errmsg = "Please enter BC No.";
//        $.alert(errmsg);
//        return;
//    }

//    if (errmsg == "" && connectionStatus == "online") {
//        $.ajax({
//            type: 'POST',
//            url: CMSserviceURL + 'GetImportsInterbalMoventForBCLocationDetails_PDA',
//            data: JSON.stringify({ 'pi_strBCNo': BCNo }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            beforeSend: function doStuff() {
//                //$('.dialog-background').css('display', 'block');
//                $('body').mLoading({
//                    text: "Loading..",
//                });
//            },
//            success: function (response) {
//                //debugger;
//                $("body").mLoading('hide');
//                var str = response.d;

//                strXmlStore = str;

//                if (str != null && str != "") {

//                    $('#divAddTestLocation').empty();
//                    html = '';

//                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
//                    html += "<thead><tr>";
//                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
//                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
//                    html += "</tr></thead>";
//                    html += "<tbody>";

//                    var xmlDoc = $.parseXML(str);

//                    $(xmlDoc).find('Table').each(function (index) {

//                        var outMsg = $(this).find('OutMsg').text();

//                        if (outMsg.length > Number(10)) {
//                            $.alert(outMsg);
//                            $('#divAddTestLocation').empty();
//                            html = '';
//                            return;
//                        }

//                        if (outMsg != '' && outMsg.indexOf("already") != -1) {
//                            $.alert(outMsg);
//                            $('#divAddTestLocation').empty();
//                            html = '';
//                            return;
//                        }

//                        if (outMsg != '' && outMsg.indexOf("not") != -1) {
//                            $.alert(outMsg);
//                            $('#divAddTestLocation').empty();
//                            html = '';
//                            return;
//                        }

//                        var location;

//                        location = $(this).find('LocCode').text().toUpperCase();
//                        locPieces = $(this).find('LocPieces').text();
//                        Hawbid = $(this).find('HAWBId').text();
//                        locid = $(this).find('LocId').text();
//                        $('#txtMawbNo').val($(this).find('MAWBNo').text());
//                        $('#txtHawbNo').val($(this).find('HAWBNo').text());
//                        $('#txtOrigin').val($(this).find('Origin').text());
//                        $('#txtDestination').val($(this).find('Destination').text());
//                        AddTableLocation(location, locPieces);
//                    });

//                    html += "</tbody></table>";

//                    if (locPieces != '0')
//                        $('#divAddTestLocation').append(html);
//                }
//                else {
//                    errmsg = 'Shipment does not exists';
//                    $.alert(errmsg);
//                }

//            },
//            error: function (msg) {
//                $("body").mLoading('hide');
//                var r = jQuery.parseJSON(msg.responseText);
//                $.alert(r.Message);
//            }
//        });
//    }
//    else if (connectionStatus == "offline") {
//        $("body").mLoading('hide');
//        $.alert('No Internet Connection!');
//    }
//    else if (errmsg != "") {
//        $("body").mLoading('hide');
//        $.alert(errmsg);
//    }
//    else {
//        $("body").mLoading('hide');
//    }
//}

function GetForwardingBCMovementDetails() {

    //clearBeforePopulate();
    $('#txtTotPcs').val('');
    $('#txtExamPcs').val('');
    $('#txtLoaderName').val('');
    $('#txtMawbNo').val('');
    $('#txtHawbNo').val('');
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var BCNo = $('#txtBCNo').val();

    if (BCNo == '') {
        errmsg = "Please enter BC No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + 'GetImportsInterbalMoventForBCLocationDetails_PDA',
            data: JSON.stringify({ 'pi_strBCNo': BCNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;

                strXmlStore = str;

                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        var outMsg = $(this).find('OutMsg').text();

                        //if (outMsg.length > Number(10)) {
                        //    $.alert(outMsg);
                        //    $('#divAddTestLocation').empty();
                        //    html = '';
                        //    return;
                        //}

                        //if (outMsg != '' && outMsg.indexOf("already") != -1) {
                        //    $.alert(outMsg);
                        //    $('#divAddTestLocation').empty();
                        //    html = '';
                        //    return;
                        //}

                        //if (outMsg != '' && outMsg.indexOf("not") != -1) {
                        //    $.alert(outMsg);
                        //    $('#divAddTestLocation').empty();
                        //    html = '';
                        //    return;
                        //}

                        var location;

                        location = $(this).find('LocCode').text().toUpperCase();
                        locPieces = $(this).find('LocPieces').text();
                        Hawbid = $(this).find('HAWBId').text();
                        locid = $(this).find('LocId').text();
                        IGMno = $(this).find('IGMNo').text();
                        $('#txtMawbNo').val($(this).find('MAWBNo').text());
                        $('#txtHawbNo').val($(this).find('HAWBNo').text());
                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());
                        $('#txtTotPcs').val($(this).find('TotPieces').text());
                        $('#txtExamPcs').val($(this).find('TotExamPieces').text());
                        $('#txtLoaderName').val($(this).find('LoaderName').text());
                        AddTableLocation(location, locPieces);

                        if (isForward == 1 && $(this).find('IsForwarded').text() == 'true') {
                            $("#btnSubmit").attr("disabled", "disabled");
                        }                       

                        if ($(this).find('IsForwarded').text() == 'false') {
                            $("#btnSubmit").removeAttr("disabled");
                        }
                       
                    });

                    html += "</tbody></table>";

                    if (locPieces != '0')
                        $('#divAddTestLocation').append(html);
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

//// Code commented for From Location,Total Packages,Moves packages, New Location
//function GetBackwardingBCMovementDetails() {

//    //clearBeforePopulate();
//    $('#txtFromLoc').val('');
//    $('#txtTotPkgs').val('');
//    $('#txtMawbNo').val('');
//    $('#txtHawbNo').val('');
//    $('#txtAWBNo').val('');
//    $('#txtOrigin').val('');
//    $('#txtDestination').val('');

//    var connectionStatus = navigator.onLine ? 'online' : 'offline'
//    var errmsg = "";

//    var BCNo = $('#txtBCNo').val();

//    if (BCNo == '') {
//        errmsg = "Please enter BC No.";
//        $.alert(errmsg);
//        return;
//    }

//    if (errmsg == "" && connectionStatus == "online") {
//        $.ajax({
//            type: 'POST',
//            url: CMSserviceURL + 'GetImportsInterbalBackwardMoventForBCLocationDetails_PDA',
//            data: JSON.stringify({ 'pi_strBCNo': BCNo }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            beforeSend: function doStuff() {
//                //$('.dialog-background').css('display', 'block');
//                $('body').mLoading({
//                    text: "Loading..",
//                });
//            },
//            success: function (response) {
//                //debugger;
//                $("body").mLoading('hide');
//                var str = response.d;

//                strXmlStore = str;

//                if (str != null && str != "") {

//                    $('#divAddTestLocation').empty();
//                    html = '';

//                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
//                    html += "<thead><tr>";
//                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
//                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
//                    html += "</tr></thead>";
//                    html += "<tbody>";

//                    var xmlDoc = $.parseXML(str);

//                    $(xmlDoc).find('Table').each(function (index) {

//                        var outMsg = $(this).find('OutMsg').text();

//                        if (outMsg != '') {
//                            $.alert(outMsg);
//                            return;
//                        }

//                        var location;

//                        location = $(this).find('LocCode').text().toUpperCase();
//                        locPieces = $(this).find('LocPieces').text();
//                        Hawbid = $(this).find('HAWBId').text();
//                        locid = $(this).find('LocId').text();
//                        $('#txtMawbNo').val($(this).find('MAWBNo').text());
//                        $('#txtHawbNo').val($(this).find('HAWBNo').text());
//                        $('#txtOrigin').val($(this).find('Origin').text());
//                        $('#txtDestination').val($(this).find('Destination').text());
//                        AddTableLocation(location, locPieces);
//                    });

//                    html += "</tbody></table>";

//                    if (locPieces != '0')
//                        $('#divAddTestLocation').append(html);
//                }
//                else {
//                    errmsg = 'Shipment does not exists';
//                    $.alert(errmsg);
//                }

//            },
//            error: function (msg) {
//                $("body").mLoading('hide');
//                var r = jQuery.parseJSON(msg.responseText);
//                $.alert(r.Message);
//            }
//        });
//    }
//    else if (connectionStatus == "offline") {
//        $("body").mLoading('hide');
//        $.alert('No Internet Connection!');
//    }
//    else if (errmsg != "") {
//        $("body").mLoading('hide');
//        $.alert(errmsg);
//    }
//    else {
//        $("body").mLoading('hide');
//    }
//}

function GetBackwardingBCMovementDetails() {

    //clearBeforePopulate();
    $('#txtTotPcs').val('');
    $('#txtExamPcs').val('');
    $('#txtLoaderName').val('');
    $('#txtMawbNo').val('');
    $('#txtHawbNo').val('');
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var BCNo = $('#txtBCNo').val();

    if (BCNo == '') {
        errmsg = "Please enter BC No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + 'GetImportsInterbalBackwardMoventForBCLocationDetails_PDA',
            data: JSON.stringify({ 'pi_strBCNo': BCNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;

                strXmlStore = str;

                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        var outMsg = $(this).find('OutMsg').text();

                        //if (outMsg != '') {
                        //    $.alert(outMsg);
                        //    return;
                        //}

                        var location;

                        location = $(this).find('LocCode').text().toUpperCase();
                        locPieces = $(this).find('LocPieces').text();
                        Hawbid = $(this).find('HAWBId').text();
                        locid = $(this).find('LocId').text();
                        IGMno = $(this).find('IGMNo').text();
                        $('#txtMawbNo').val($(this).find('MAWBNo').text());
                        $('#txtHawbNo').val($(this).find('HAWBNo').text());
                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());
                        $('#txtTotPcs').val($(this).find('TotPieces').text());
                        $('#txtExamPcs').val($(this).find('TotExamPieces').text());
                        $('#txtLoaderName').val($(this).find('LoaderName').text());

                        
                        if (isBackward == 1 && $(this).find('IsBackward').text() == 'true') {
                            $("#btnSubmit").attr("disabled", "disabled");
                        }                        

                        if ($(this).find('IsBackward').text() == 'false') {
                            $("#btnSubmit").removeAttr("disabled");
                        }


                        AddTableLocation(location, locPieces);
                    });

                    html += "</tbody></table>";

                    if (locPieces != '0')
                        $('#divAddTestLocation').append(html);
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

//function SaveInternalForwardDetails() {

//    var connectionStatus = navigator.onLine ? 'online' : 'offline'
//    var errmsg = "";

//    var FromLoc = $('#txtFromLoc').val().toUpperCase();
//    var TotalPIECESno = $('#txtTotPkgs').val();
//    var MovePIECESno = $('#txtMovePkgs').val();
//    var NewLoc = $('#txtNewLoc').val().toUpperCase();
//    var BcNo = $('#txtBCNo').val();


//    if (FromLoc == "" || TotalPIECESno == "") {

//        errmsg = "From location and pckgs not selected.</br>";
//        $.alert(errmsg);
//        return;

//    }

//    if (MovePIECESno == "" || NewLoc == "") {

//        errmsg = "Please enter move pckgs and new location.</br>";
//        $.alert(errmsg);
//        return;

//    }

//    if (SelectedHawbId == '' || SelectedHawbId == '0') {
//        SelectedHawbId = Hawbid;
//    }

//    //if (MovePIECESno > TotalPIECESno) {
//    //    errmsg = "Move packages cannot be more than total packages.</br>";
//    //    $.alert(errmsg);
//    //    return;
//    //}    


//    if (errmsg == "" && connectionStatus == "online") {
//        $.ajax({
//            type: "POST",
//            //url: CMSserviceURL + 'SaveImpForwardBCMovementDetails_PDA',
//            data: JSON.stringify({
//                'pi_intHAWBid': Hawbid, 'pi_intBCNo': BcNo, 'pi_strFromLoc': OldLocationId, 'pi_strFromLocCode': FromLoc,
//                'pi_intOldLocPieces': TotalPIECESno, 'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_intIGMNo': IGMno,
//                'pi_strUserName': window.localStorage.getItem("UserName"),
//            }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            beforeSend: function doStuff() {
//                //$('.dialog-background').css('display', 'block');
//                $('body').mLoading({
//                    text: "Please Wait..",
//                });
//            },
//            success: function (response) {
//                $("body").mLoading('hide');
//                $.alert(response.d);

//                $('#txtFromLoc').val('');
//                $('#txtTotPkgs').val('');
//                $('#txtMovePkgs').val('');
//                $('#txtNewLoc').val('');
//                //window.location.reload();
//                GetForwardingBCMovementDetails();
//            },
//            error: function (msg) {
//                $("body").mLoading('hide');
//                $.alert(msg.d);
//            }
//        });
//        return false;
//    }

//}

function SaveInternalForwardDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FromLoc = "";
    var TotalPIECESno = 0;
    var MovePIECESno = $('#txtExamPcs').val();
    var NewLoc = "";
    var BcNo = $('#txtBCNo').val();
    var LoaderName = "";


    if ($('#txtLoaderName').val() != "") {
        LoaderName = $('#txtLoaderName').val();
    }

    if (SelectedHawbId == '' || SelectedHawbId == '0') {
        SelectedHawbId = Hawbid;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + 'SaveImpForwardBCMovementDetails_PDA',
            data: JSON.stringify({
                'pi_intHAWBid': Hawbid, 'pi_intBCNo': BcNo, 'pi_strFromLoc': 0, 'pi_strFromLocCode': FromLoc,
                'pi_intOldLocPieces': TotalPIECESno, 'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_intIGMNo': IGMno,
                'pi_strLoaderName': LoaderName, 'pi_strUserName': window.localStorage.getItem("UserName"),
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
                $.alert(response.d);

                //$('#txtFromLoc').val('');
                //$('#txtTotPkgs').val('');
                //$('#txtMovePkgs').val('');
                //$('#txtNewLoc').val('');
                //window.location.reload();
                GetForwardingBCMovementDetails();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert(msg.d);
            }
        });
        return false;
    }

}

//function SaveInternalBackwardDetails() {

//    var connectionStatus = navigator.onLine ? 'online' : 'offline'
//    var errmsg = "";

//    var FromLoc = $('#txtFromLoc').val().toUpperCase();
//    var TotalPIECESno = $('#txtTotPkgs').val();
//    var MovePIECESno = $('#txtMovePkgs').val();
//    var NewLoc = $('#txtNewLoc').val().toUpperCase();
//    var BcNo = $('#txtBCNo').val();


//    if (FromLoc == "" || TotalPIECESno == "") {

//        errmsg = "From location and pckgs not selected.</br>";
//        $.alert(errmsg);
//        return;

//    }

//    if (MovePIECESno == "" || NewLoc == "") {

//        errmsg = "Please enter move pckgs and new location.</br>";
//        $.alert(errmsg);
//        return;

//    }

//    if (SelectedHawbId == '' || SelectedHawbId == '0') {
//        SelectedHawbId = Hawbid;
//    }

//    //if (MovePIECESno > TotalPIECESno) {
//    //    errmsg = "Move packages cannot be more than total packages.</br>";
//    //    $.alert(errmsg);
//    //    return;
//    //}    


//    if (errmsg == "" && connectionStatus == "online") {
//        $.ajax({
//            type: "POST",
//            url: CMSserviceURL + 'SaveImpBackwardBCMovementDetails_PDA',
//            data: JSON.stringify({
//                'pi_intHAWBid': Hawbid, 'pi_intBCNo': BcNo, 'pi_strFromLoc': OldLocationId, 'pi_strFromLocCode': FromLoc,
//                'pi_intOldLocPieces': TotalPIECESno, 'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_intIGMNo': IGMno,
//                'pi_strUserName': window.localStorage.getItem("UserName"),
//            }),
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            beforeSend: function doStuff() {
//                //$('.dialog-background').css('display', 'block');
//                $('body').mLoading({
//                    text: "Please Wait..",
//                });
//            },
//            success: function (response) {
//                $("body").mLoading('hide');
//                $.alert(response.d);

//                $('#txtFromLoc').val('');
//                $('#txtTotPkgs').val('');
//                $('#txtMovePkgs').val('');
//                $('#txtNewLoc').val('');
//                //window.location.reload();
//                GetForwardingBCMovementDetails();
//            },
//            error: function (msg) {
//                $("body").mLoading('hide');
//                $.alert(msg.d);
//            }
//        });
//        return false;
//    }

//}

function SaveInternalBackwardDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FromLoc = "";
    var TotalPIECESno = 0;
    var MovePIECESno = $('#txtExamPcs').val();
    var NewLoc = '';
    var BcNo = $('#txtBCNo').val();
    var LoaderName = "";

    if ($('#txtLoaderName').val() != "") {
        LoaderName = $('#txtLoaderName').val();
    }


    if (SelectedHawbId == '' || SelectedHawbId == '0') {
        SelectedHawbId = Hawbid;
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + 'SaveImpBackwardBCMovementDetails_PDA',
            data: JSON.stringify({
                'pi_intHAWBid': Hawbid, 'pi_intBCNo': BcNo, 'pi_strFromLoc': 0, 'pi_strFromLocCode': FromLoc,
                'pi_intOldLocPieces': TotalPIECESno, 'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_intIGMNo': IGMno,
                'pi_strLoaderName': LoaderName, 'pi_strUserName': window.localStorage.getItem("UserName"),
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
                $.alert(response.d);

                //$('#txtFromLoc').val('');
                //$('#txtTotPkgs').val('');
                //$('#txtMovePkgs').val('');
                //$('#txtNewLoc').val('');
                //window.location.reload();                
                GetBackwardingBCMovementDetails();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert(msg.d);
            }
        });
        return false;
    }

}

function AddTableLocation(loc, locpieces) {

    html += "<tr onclick='SelectLocationInfo(this);'>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + loc + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

}

function SelectLocationInfo(a) {

    var xmlDoc = $.parseXML(strXmlStore);

    $(xmlDoc).find('Table').each(function (index) {

        if (index == a.rowIndex - 1) {
            //$('#txtFromLoc').val($(this).find('LocCode').text());
            //$('#txtTotPkgs').val($(this).find('LocPieces').text());
            OldLocationId = $(this).find('LocId').text();
            IGMno = $(this).find('IGMNo').text();
            FromLoc = $(this).find('LocId').text();
        }

    });
}

function clearALL() {
    $('#txtMawbNo').val('');
    $('#txtHawbNo').val('');
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtTotPcs').val('');
    $('#txtExamPcs').val('');
    $('#txtLoaderName').val('');
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
    $('#divAddTestLocation').empty();
    $('#ddlIGM').val(0);
    $('#ddlHAWB').val(0);
    $('#txtBCNo').val('');
    $('#txtBCNo').focus();
}

function clearBeforePopulate() {
    $('#txtMawbNo').val('');
    $('#txtHawbNo').val('');
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

$(function () {
    $("#txtBCDate").datepicker({
        dateFormat: "dd/mm/yy"
    });
    $("#txtBCDate").datepicker().datepicker("setDate", new Date());
});
