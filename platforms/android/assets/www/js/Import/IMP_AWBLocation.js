
var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");

function GetHAWBDetails() {

    var AWBid = $('#txtAWBNo').val();

    if (AWBid == "") {
        //errmsg = "Please enter valid Flight No.";
        //$.alert(errmsg);
        return;
    }

    if (AWBid.length < '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

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
                        $('#txtPckgsEXP').val('TOT_NPX');
                        $('#txtGrossWtEXP').val('TOT_WGHT_EXP_KG');
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

function GetFlightDetailsForAWB() {

    var AWBid = $('#txtAWBNo').val();
    var HAWBid;

    if ($('#ddlHAWB').find('option:selected').text() == 'Select')
        HAWBid = '0';
    else
        HAWBid = $('#ddlHAWB').val();

    if (AWBid == "") {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBid.length < '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetFlightNoForAWB",
            data: JSON.stringify({
                'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I', 'strAWBNo': AWBid, 'strHAWBNo': HAWBid,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var FlightId;
                    var FlightNo;
                    FlightId = $(this).find('FlightNo').text();
                    FlightNo = $(this).find('FlightNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(FlightId).text(FlightNo);
                    newOption.appendTo('#ddlFlightNo');

                    if (index == 0) {
                        $('#txtFlightDate').val('FlightDt');                        
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

function GetULDDetailsForAWB() {
    
    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetULDNumbers",
            data: JSON.stringify({
                'strFlightNumber': $('#ddlFlightNo').val(), 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strFlightDate': $('#txtFlightDate').val(), 'strCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var ULDId;
                    var ULDNo;
                    ULDId = $(this).find('ULDNO').text();
                    ULDNo = $(this).find('ULDNO').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULDNo);
                    newOption.appendTo('#ddlULDNo');                    

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

function GetShipmentDetailsForAWB() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetShipmentNo",
            data: JSON.stringify({
                'strAWBNo': $('#txtAWBNo').val(), 'strAirportCity': AirportCity, 'CompanyCode': CompanyCode, 'strCycle': 'I',
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);


                $(xmlDoc).find('Table').each(function (index) {

                    var ShipmentId;
                    var ShipmentNo;
                    ShipmentId = $(this).find('shipment_number').text();
                    ShipmentNo = $(this).find('shipment_number').text();

                    var newOption = $('<option></option>');
                    newOption.val(ShipmentId).text(ShipmentNo);
                    newOption.appendTo('#ddlShipmntNo');

                    if (index == 0) {
                        $('#txtPckgsEXP').val('NPX');
                        $('#txtPckgsRCV').val('NPR');
                        $('#txtGrossWtEXP').val('WEIGHT_EXP_KG');
                        $('#txtGrossWtRCV').val('WEIGHT_REC_KG');
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
    var blnLocChange;
        
    var AWBNo = $('#txtAWBNo').val();
    var FlightNo = $('#ddlFlightNo').val();
    var ULDNo = $('#ddlULDNo').val();
    var HAWBNo = $('#ddlHAWB').val();
    var ShipmentNo = $('#ddlShipmntNo').val();
    var FlightDate = $('#txtFlightDate').val();
    var PckgsRCV = $('#txtPckgsRCV').val();
    var LocCode = $('#txtLocCode').val();

    if (document.getElementById('chkReceive').checked)
        blnLocChange = 'true';
    else
        blnLocChange = 'false';

    
    if (AWBNo == "" || FlightDate == "" || PckgsRCV == "") {

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
            url: CargoWorksServiceURL + "ImpSaveLocation",
            data: JSON.stringify({
                'strFlightNo': FlightNo, 'strFlightDate': FlightDate, 'strULDNo': ULDNo,
                'strAWBNo': AWBNo, 'strHAWBNo': HAWBNo, 'strShipmentNo': ShipmentNo, 'strPkgs': PckgsRCV,
                'strLocCode': LocCode, 'blnLocChange': blnLocChange, 'strAirportCity': AirportCity,
                'strUserID': UserId, 'CompanyCode': CompanyCode, 'strShed': SHEDCODE,
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


