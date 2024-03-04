//document.addEventListener("deviceready", GetCommodityList, false);

var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var FlightSeqNo;
var SegId;

$(function () {

    if (window.localStorage.getItem("RoleIMPSegregation") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

    $('#txtIGMYear').val((new Date()).getFullYear());

});

function GetHAWBDetailsForMAWB() {

    $('#ddlHAWB').empty();
    clearBeforePopulate();

    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWB');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if ($('#txtIGMNo').val() == "") {
        errmsg = "Please enter IGM No first";
        $.alert(errmsg);
        $('#txtAWBNo').val('');
        return;
    }

    if (MAWBNo != '' && MAWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        //$('#txtAWBNo').val('');
        $.alert(errmsg);
        return;
    }

    var inputXML = '<Root><IGMNO>' + $('#txtIGMNo').val() + '</IGMNO><IGMYear>' + $('#txtIGMYear').val() + '</IGMYear><AWBNo>' + MAWBNo + '</AWBNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetSegregationDetails",
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

                var countHAWB = $(xmlDoc).find("Table2").length;

                if (countHAWB > Number(0)) {

                    $(xmlDoc).find('Table2').each(function () {

                        var HAWBId;
                        var HAWBNos;

                        HAWBId = $(this).find('HAWBID').text();
                        HAWBNos = $(this).find('HouseNo').text();

                        if (HAWBNos != '') {
                            var newOption = $('<option></option>');
                            newOption.val(HAWBId).text(HAWBNos);
                            newOption.appendTo('#ddlHAWB');
                        }
                    });
                }
                else {

                    $(xmlDoc).find('Table1').each(function () {

                        $('#txtFlightNo').val($(this).find('FlightNo').text());
                        $('#txtFlightDt').val($(this).find('FlightDate').text());
                        $('#txttotConsignmt').val($(this).find('AWBCount').text());
                        $('#txttotManifstpkg').val($(this).find('NPX').text());
                        $('#txttotArrivedPkg').val($(this).find('NPR').text());
                        $('#txttotShortpkg').val($(this).find('ShortLanded').text());
                        $('#txttotExcessPkg').val($(this).find('ExcessLanded').text());
                        $('#txttotTPConsignmt').val($(this).find('TPCount').text());
                        $('#txttotDamagedPkg').val($(this).find('DamagePkgs').text());
                        $('#txtSegregationSts').val($(this).find('SegStatus').text());
                        FlightSeqNo = $(this).find('FlightSeqNo').text();
                        SegId = $(this).find('ID').text();

                    });
                }

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

function GetSegregationDetails() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var IGMNo = $('#txtIGMNo').val();
    var HAWBNo;

    if ($("#ddlHAWB option:selected").text() == 'Select') {
        HAWBNo = '0';
    }
    else {
        HAWBNo = $("#ddlHAWB option:selected").text();
    }

    if (IGMNo == '') {
        errmsg = "Please enter IGM No.";
        $.alert(errmsg);
        return;
    }

    //if (IGMNo.length != '7') {
    //    errmsg = "Please enter valid IGM No.";
    //    $.alert(errmsg);
    //    return;
    //}

    var inputXML = '<Root><IGMNO>' + IGMNo + '</IGMNO><IGMYear>' + $('#txtIGMYear').val() + '</IGMYear><AWBNo>' + AWBNo + '</AWBNo><HouseNo>' + HAWBNo + '</HouseNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetSegregationDetails",
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
                console.log(response.d)
                $("body").mLoading('hide');
                response = response.d;
               
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function (index) {

                    var outMsg = $(this).find('Status').text();

                    if (outMsg == 'E') {
                        $.alert($(this).find('StrMessage').text());                        
                        return;
                    }
                });

                $(xmlDoc).find('Table1').each(function () {

                    $('#txtFlightNo').val($(this).find('FlightNo').text());
                    $('#txtFlightDt').val($(this).find('FlightDate').text());
                    $('#txttotConsignmt').val($(this).find('AWBCount').text());
                    $('#txttotManifstpkg').val($(this).find('NPX').text());
                    $('#txttotArrivedPkg').val($(this).find('NPR').text());
                    $('#txttotShortpkg').val($(this).find('ShortLanded').text());
                    $('#txttotExcessPkg').val($(this).find('ExcessLanded').text());
                    $('#txttotTPConsignmt').val($(this).find('TPCount').text());
                    $('#txttotDamagedPkg').val($(this).find('DamagePkgs').text());
                    $('#txtSegregationSts').val($(this).find('SegStatus').text());
                    FlightSeqNo = $(this).find('FlightSeqNo').text();
                    SegId = $(this).find('ID').text();

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
}

function SaveSegregationDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var IGMNo = $('#txtIGMNo').val();   

    if (IGMNo == '') {
        errmsg = "Please enter IGM No.";
        $.alert(errmsg);
        return;
    }

    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ID>' + SegId + '</ID><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
    console.log(inputXML);
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "SaveSegregationDetails",
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

                    $.alert($(this).find('StrMessage').text());
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

function clearBeforePopulate() {

    //$('#txtAWBNo').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDt').val('');
    $('#txttotConsignmt').val('');
    $('#txttotManifstpkg').val('');
    $('#txttotArrivedPkg').val('');
    $('#txttotShortpkg').val('');
    $('#txttotExcessPkg').val('');
    $('#txttotTPConsignmt').val('');
    $('#txttotDamagedPkg').val('');
    $('#txtSegregationSts').val('');
}

function clearALL() {

    $('#txtIGMNo').val('');
    $('#txtAWBNo').val('');
    $('#ddlHAWB').empty();
    $('#txtFlightNo').val('');
    $('#txtFlightDt').val('');
    $('#txttotConsignmt').val('');
    $('#txttotManifstpkg').val('');
    $('#txttotArrivedPkg').val('');
    $('#txttotShortpkg').val('');
    $('#txttotExcessPkg').val('');
    $('#txttotTPConsignmt').val('');
    $('#txttotDamagedPkg').val('');
    $('#txtSegregationSts').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
}


