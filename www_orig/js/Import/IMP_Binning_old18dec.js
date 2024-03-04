var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var SelectedHawbId;
var IGMno;
var strXmlStore;
var locPieces;
var html;
var FromLoc;
var GHAMawbid;
var Hawbid;
var GHAhawbid;
var IsFlightFinalized;
var GHAflightSeqNo;

(function () {
    document.addEventListener('deviceready', AddLocation, false);
    document.addEventListener('deviceready', AddingTestLocation, false);
}
)();

function GetHAWBDetailsForMAWB() {

    IsFlightFinalized = '';
    GHAMawbid = '';
    Hawbid = '';
    GHAhawbid = '';
    IsFlightFinalized = '';
    GHAflightSeqNo = '';
    html = '';

    $('#txtTotalPkg').val('');
    $('#txtCommodity').val('');
    $('#divAddTestLocation').empty();

    var list = new Array();
    var uniqueIgms = [];

    $('#ddlHAWB').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWB');

    $('#ddlIGM').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlIGM');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo == '') {
        return;
    }

    if (MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        $('#txtAWBNo').val('');
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetHAWBNumbersForMAWBNumber_PDA",
            data: JSON.stringify({ 'pi_strUserName': MAWBNo }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;                
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    if ($(this).find('IsFinalized').text() == 'false') {
                        IsFlightFinalized = 'false';
                        GetHAWBDetailsForMAWBfromGHA();
                        return false;
                    }

                    var outMsg = $(this).find('OutMsg').text();

                    if (outMsg != '') {
                        $.alert(outMsg);
                        return;
                    }
                    else {

                        var IGMNos = $(this).find('IGMNo').text();
                        list.push(IGMNos);

                        var HawbNo = $(this).find('HAWBNo').text();

                        if (HawbNo != '') {

                            var HAWBId;
                            var HAWBNos;

                            HAWBId = $(this).find('HAWBId').text();
                            HAWBNos = HawbNo;

                            var newOption = $('<option></option>');
                            newOption.val(HAWBId).text(HAWBNos);
                            newOption.appendTo('#ddlHAWB');
                        }
                    }
                });


                $.each(list, function (i, el) {
                    if ($.inArray(el, uniqueIgms) === -1) uniqueIgms.push(el);
                });

                uniqueIgms.forEach(function (item) {
                    var newOption = $('<option></option>');
                    newOption.val(item).text(item);
                    newOption.appendTo('#ddlIGM');
                });

            },
            error: function (msg) {
                //debugger;
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

function GetHAWBDetailsForMAWBfromGHA() {

    var list = new Array();
    var uniqueIgms = [];

    var listHAWB = new Array();
    var uniqueHAWBs = [];

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    var inputXML = '<Root><MAWBNo>' + MAWBNo + '</MAWBNo><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetBinningHawbIgmDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;                
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table1').each(function () {

                    var IGMNos = $(this).find('IGMNo').text();
                    list.push(IGMNos);

                    var HawbNo = $(this).find('HAWBNo').text();

                    GHAMawbid = $(this).find('MAWBId').text();
                    GHAhawbid = $(this).find('HAWBId').text();
                    GHAflightSeqNo = $(this).find('FlightSeqNo').text();

                    if (HawbNo != '') {

                        var HAWBId;
                        var HAWBNos;

                        HAWBId = $(this).find('HAWBId').text();
                        HAWBNos = HawbNo;

                        var newOption = $('<option></option>');
                        newOption.val(HAWBId).text(HAWBNos);
                        newOption.appendTo('#ddlHAWB');

                    }
                });


                $.each(list, function (i, el) {
                    if ($.inArray(el, uniqueIgms) === -1) uniqueIgms.push(el);
                });

                uniqueIgms.forEach(function (item) {
                    var newOption = $('<option></option>');
                    newOption.val(item).text(item);
                    newOption.appendTo('#ddlIGM');
                });

            },
            error: function (msg) {
                //debugger;
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

function GetMovementDetails() {

    $("#btnSubmit").removeAttr("disabled");

    html = '';    
    $('#divAddTestLocation').empty();

    //clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (HAWBNo == 'Select') {
        HAWBNo = '';
    }

    if ($("#ddlIGM option:selected").text() == 'Select') {
        errmsg = "Please select IGM</br>";
        $.alert(errmsg);
        return;
    }     

    if (IsFlightFinalized == 'false') {
        GetMovementDetailsFromGHA();
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetLocationDetails_PDA",
            data: JSON.stringify({ 'pi_intIGMNo': IgmNo, 'pi_intIGMyear': '', 'pi_strMAWBNo': AWBNo, 'pi_strHAWBNo': HAWBNo }),
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

                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Binned Pkgs.</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        var outMsg = $(this).find('OutMsg').text();

                        if (outMsg != '') {
                            $.alert(outMsg);
                            return;
                        }

                        var location;

                        location = $(this).find('LocCode').text().toUpperCase();
                        locPieces = $(this).find('LocPieces').text();

                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());

                        AddTableLocation(location, locPieces);

                        if (index == 0) {
                            $('#txtTotalPkg').val($(this).find('LocationStatus').text());
                            $('#txtCommodity').val($(this).find('Commodity').text());
                            Hawbid = $(this).find('HAWBId').text();
                        }

                        var remainingPieces = $(this).find('RemainingPieces').text().substr(0, $(this).find('RemainingPieces').text().indexOf('/'));

                        if (remainingPieces == 0)
                            $("#btnSubmit").attr("disabled", "disabled");
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

function GetMovementDetailsFromGHA() {


    $("#btnSubmit").removeAttr("disabled");

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    var inputXML = '<Root><MAWBID>' + GHAMawbid + '</MAWBID><HAWBID>' + SelectedHawbId + '</HAWBID><IGMNo>' + IgmNo + '</IGMNo><FlightSeqNo>' + GHAflightSeqNo + '</FlightSeqNo><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetBinningLocPkgDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
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
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Binned Pkgs.</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table1').each(function (index) {

                        var outMsg = $(this).find('OutMsg').text();

                        if (outMsg != '') {
                            $.alert(outMsg);
                            return;
                        }

                        var location;

                        location = $(this).find('LocCode').text().toUpperCase();
                        locPieces = $(this).find('LocPieces').text();

                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());

                        AddTableLocation(location, locPieces);

                        if (index == 0) {
                            $('#txtTotalPkg').val($(this).find('LocationStatus').text());
                            $('#txtCommodity').val($(this).find('Commodity').text());
                            Hawbid = $(this).find('HAWBId').text();
                        }

                        var remainingPieces = $(this).find('RemainingPieces').text().substr(0, $(this).find('RemainingPieces').text().indexOf('/'));

                        if (remainingPieces == 0)
                            $("#btnSubmit").attr("disabled", "disabled");
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

function AddTableLocation(loc, locpieces) {

    html += "<tr>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + loc + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

}

function SaveForwardDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    //var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    var location = $('#txtLocation_0').val().toUpperCase();
    var BinnPckgs = $('#txtBinnPkgs_0').val();

    if (location == '') {
        errmsg = "Please enter location</br>";
        $.alert(errmsg);
        return;
    }

    if (BinnPckgs == '') {
        errmsg = "Please enter binn pckgs</br>";
        $.alert(errmsg);
        return;
    }

    if (SelectedHawbId == '' || SelectedHawbId == '0') {
        SelectedHawbId = Hawbid;
    }

    if ($('#ddlIGM').val() == '0' && $('select#ddlIGM option').length > 1) {
        errmsg = "Please select IGM</br>";
        $.alert(errmsg);
        return;
    }


    if (IGMno == '') {
        errmsg = "IGM No. could not be found.</br>";
        $.alert(errmsg);
        return;
    }

    if (IsFlightFinalized == 'false') {
        SaveForwardDetailsForGHA();
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "SaveLocationDetails_PDA",
            data: JSON.stringify({
                'pi_intIGMNo': IgmNo, 'pi_intHAWBid': SelectedHawbId,
                'pi_strLocation': location, 'pi_intLocPieces': BinnPckgs, 'pi_strUserName': window.localStorage.getItem("UserName"),
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

                $('#txtLocation_0').val('');
                $('#txtBinnPkgs_0').val('');
                GetMovementDetails();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert(msg.d);
            }
        });
        return false;
    }

}

function SaveForwardDetailsForGHA() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var IgmNo = $("#ddlIGM option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    var location = $('#txtLocation_0').val().toUpperCase();
    var BinnPckgs = $('#txtBinnPkgs_0').val();

    var inputXML = '<Root><MAWBID>' + GHAMawbid + '</MAWBID><HAWBID>' + GHAhawbid + '</HAWBID><IGMNo>' + IgmNo + '</IGMNo><FlightSeqNo>' + GHAflightSeqNo + '</FlightSeqNo><LocCode>' + location + '</LocCode><NOP>' + BinnPckgs + '</NOP><Weight></Weight><LocId></LocId><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "SaveBinning",
            data: JSON.stringify({ 'InputXML': inputXML }),
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
                
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    if ($(this).find('StrMessage').text() != '')
                        $.alert($(this).find('StrMessage').text());
                    else
                        $.alert('Success');
                });

                $('#txtLocation_0').val('');
                $('#txtBinnPkgs_0').val('');
                GetMovementDetailsFromGHA();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert(msg.d);
            }
        });
        return false;
    }

}

function AddLocation() {
    console.log("Location Added");
    var LocCont = $('#divAddLocation > *').length;
    var no = '0';
    var LocCount;
    if ($('#divAddLocation > *').length > 0) {
        no = parseInt($('#divAddLocation').children().last().attr('id').split('_')[1]) + 1;
    }
    if (no != undefined || no != '') {
        LocCount = no;
    }
    var str = "";
    str = '<div id="loc_' + LocCount + '" class="row panel panel-widget forms-panel form-grids widget-shadow" style="margin-top:5px;">'
    str += '<div class="row">'
    str += '<div class="col-xs-12">'
    str += '<a>'
    //str += '<button class="btn btn-success btn-xs" onclick="RemoveLocation(' + LocCount + ',event );" style="float:right;"><span class="glyphicon glyphicon-remove-circle" style="float: right;color:red;"></span></button>'
    //str += '<span class="glyphicon glyphicon-remove-circle" style="float: right;color:red;" onclick="RemoveLocation(' + LocCount + ');"></span>'
    str += '</a>'
    str += '</div>'
    str += '</div>'
    str += '<div class="forms">'
    str += '<div class="form-body">'
    str += '<div class="row form-group" style="margin-bottom: 0px;">'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    str += '<label id="lblLocation_' + LocCount + '" for="txtLocation_' + LocCount + '" class="control-label">Location</label>'
    str += '<font color="red">*</font>'
    //str += '<select class="form-control" id="ddlLocation_' + LocCount + '">'
    str += '<input id="txtLocation_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    //str += '<option value="0">Select</option>'
    //str += '</select>'
    str += '</div>'
    //str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-right: 0px;">'
    //str += '<label id="lblArea_' + LocCount + '" for="txtArea_' + LocCount + '" class="control-label">Area</label>'
    //str += '<font color="red">*</font>'
    //str += '<input id="txtArea_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    //str += '</div>'
    //str += '</div>'
    //str += '<div class="row form-group" style="margin-bottom: 0px;">'
    //str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-left: 0px;">'
    //str += '<label id="lblTerminal_' + LocCount + '" for="txtTerminal_" class="control-label">Terminal</label>'
    //str += '<font color="red">*</font>'
    //str += '<input id="txtTerminal_' + LocCount + '" class="form-control" type="text" maxlength="20">'
    //str += '</div>'
    str += '<div class="form-group col-xs-6 col-sm-6 col-md-6" style="padding-right: 0px;">'
    str += '<label id="lblBinnPkgs_' + LocCount + '" for="txtBinnPkgs_" class="control-label">Binn Pkgs</label>'
    str += '<font color="red">*</font>'
    str += '<input id="txtBinnPkgs_' + LocCount + '" class="form-control" type="number" onkeyup="ChkMaxLength(this, 4);" style="text-align:right;" max="9999999">'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    //$('#divAddLocation').append(str);
    //MSApp.execUnsafeLocalFunction(function () {
    //    $('#divAddLocation').append(str);
    //});
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            $('#divAddLocation').append(str);
        });
    } else {
        $('#divAddLocation').append(str);
    }
}

function clearALL() {
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtAWBNo').val('');
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');
    $('#txtLocation_0').val('');
    $('#txtArea_0').val('');
    $('#txtTerminal_0').val('');
    $('#txtBinnPkgs_0').val('');
    $('#divAddTestLocation').empty();
    $('#ddlIGM').val(0);
    $('#ddlHAWB').val(0);
    $('#txtAWBNo').focus();

}


function clearBeforePopulate() {
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
