
var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");

$(function () {
    //$('#txtFltNo').val(amplify.store("flightNo"));
    //$('#txtFltDate').val(amplify.store("flightDate"));
    //flightSeqNo = amplify.store("flightSeqNo");
    //if (flightSeqNo != "") {
    //    GetULDDetails();
    //}
});



function GetULDDetails() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var FullFlightNo = FlightPrefix + FlightNo;

    if (FlightPrefix == "" || FlightNo == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if (FlightDate == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = d + "-" + m + "-" + y;
    }

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strFlightNumber': FullFlightNo, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': FlightDate, 'chrCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    var ULDId;
                    var ULD;
                    ULDId = $(this).find('ULDNO').text();
                    ULD = $(this).find('ULDNO').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    if (index == 0) {
                        ULDSeqNo = ULDId;
                    }

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function GetAWBDetails(UldNo) {

    var UldNumber;

    if (UldNo == 'I')
        UldNumber = "";
    else
        UldNumber = UldNo;

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var FullFlightNo = FlightPrefix + FlightNo;

    if (FlightPrefix == "" || FlightNo == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if (FlightDate == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = d + "-" + m + "-" + y;
    }

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strFlightNumber': FullFlightNo, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': FlightDate, 'chrCycle': 'I', 'strULDNo': UldNumber,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function () {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('MAWB_IND').text();
                    AWBNo = $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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


function GetHAWBDetails(AWBid) {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strAWBNo': AWBid, 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'chrCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var HAWBId;
                    var HAWBNo;
                    HAWBId = $(this).find('HOUSE_SEQUENCE_NUMBER').text();
                    HAWBNo = $(this).find('HOUSE_NUMBER').text();

                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNo);
                    newOption.appendTo('#ddlHAWBNo');

                    if (index == 0) {
                        $('#txtPkgs').val('TOT_NPX');
                        $('#txtWt').val('TOT_WGHT_EXP_KG');
                    }

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function SaveDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var Pckgs = $('#txtPkgs').val();
    var Wt = $('#txtWt').val();

    var strWtUnit = 'KG';


    if (FlightPrefix == "" || FlightNo == "" || FlightDate == "" || Pckgs == "" || Wt == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val().length > 0) {
        var formattedDate = new Date($('#txtFlightDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        FlightDate = d + "-" + m + "-" + y;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "IMPCreateInCheckManifest",
            data: JSON.stringify({
                'strFlightNo': FlightNo, 'strFlightDate': FlightDate, 'strULDNo': $('#ddlULDNo').val(),
                'strAWBNo': $('#ddlAWBNo').val(), 'strHAWBNo': $('#ddlHAWBNo').val(), 'strPkgs': Pckgs,
                'strGrossWt': Wt, 'strWtUnit': 'Kg', 'strDamageDesc': '',
                'strDamageCode': '', 'strUserID': UserId, 'CompanyCode': CompanyCode, 'strShed': SHEDCODE,
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
                $.alert('Details saved successfully');
                //window.location.reload();
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
    $('#txtIGMNo').val('');
    $('#txtIGMYear').val('');
    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtTotCnts').val('');
    $('#txtManiPieces').val('');
    $('#txtReceivePieces').val('');
    $('#txtManiGrWt').val('');
    $('#txtReceiveGrWt').val('');
    $('#txtShortPieces').val('');
    $('#txtExcessPieces').val('');
    $('#txtDamagePieces').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


