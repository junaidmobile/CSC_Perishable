//document.addEventListener("deviceready", GetCommodityList, false);

var GHAExportFlightserviceURL = window.localStorage.getItem("GHAExportFlightserviceURL");

var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var FlightSeqNo;
var SegId;
var ULDseqNo;
var strShipmentInfo;
var totalPkgs;
var totalWeight;
var totalVol;
var prorataWeightValue;
var prorataVolumeValue;
var prorataWtParam;
var prorataVolParam;
var html;


$(function () {

    if (window.localStorage.getItem("RoleExpUnitization") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }

    var formattedDate = new Date();
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2))
        d = '0' + d;
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    if (m.toString().length < Number(2))
        m = '0' + m;
    var y = formattedDate.getFullYear();
    var t = formattedDate.getTime();
    var date = m.toString() + '/' + d.toString() + '/' + y.toString();

    newDate = y.toString() + '-' + m.toString() + '-' + d.toString();
    $('#txtFlightDate').val(newDate);

    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return date + h + ":" + m;
    // $('#txtGPNo1').val(date);

});

//function countChar(val, count) {

//    var currentBoxNumber = 0;
//    textboxes = $('input[name="textbox[]"]');
//    currentBoxNumber = textboxes.index(val);

//    var len = val.value.length;
//    var index = val.index;

//    if (len == count)
//        ToNextTextbox(currentBoxNumber)
//};

//function ToNextTextbox(currentBoxNumber) {

//    textboxes = $('input[name="textbox[]"]');

//    if (textboxes[currentBoxNumber + 1] != null) {
//        nextBox = textboxes[currentBoxNumber + 1];
//        nextBox.focus();
//        nextBox.select();
//        event.preventDefault();
//        return false;

//    }

//}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function CheckULDBulk() {

    if (document.getElementById('rdoULD').checked) {
        $('#divULDText').show();
        $('#divBulkText').hide();
        $('#divDdlULD').show();
        $('#divDdlBulk').hide();
        $('#divContour').show();

    }
    if (document.getElementById('rdoBulk').checked) {
        $('#divULDText').hide();
        $('#divBulkText').show();
        $('#divDdlULD').hide();
        $('#divDdlBulk').show();
        $('#divContour').hide();
    }
}

function CheckUldNoValidation(uldno) {
    CheckSpecialCharacter(uldno);
    var ValidChars = "0123456789.";
    var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_`";
    var IsNumber = true;
    var Char;

    var getULDNo = uldno;//document.getElementById(txtULDNumber).value;
    var getlength = getULDNo.length;

    if ((getlength > 0) && (document.activeElement.getAttribute('id') != 'ext1')) {
        if (getlength == 4) {
            var firstChar = getULDNo.charAt(0);
            var string = getULDNo.substr(1, 3);

            for (var i = 0; i < getlength; i++) {
                if (iChars.indexOf(getULDNo.charAt(i)) != -1) {
                    $.alert("Special characters not allowed");
                    $('#txtULDNumber').val('');
                    $('#txtULDNumber').focus();
                    return false;
                }
            }

            for (i = 0; i < string.length && IsNumber == true; i++) {
                Char = string.charAt(i);
                if (ValidChars.indexOf(Char) == -1) {
                    $.alert('Last three character should be numeric  \n if ULD no is 4 digits');
                    $('#txtULDNumber').val('');
                    $('#txtULDNumber').focus();
                    IsNumber = false;
                }
            }

        }
        else if (getlength == 5) {
            var string = getULDNo.substr(1, 4);

            for (var i = 0; i < getlength; i++) {
                if (iChars.indexOf(getULDNo.charAt(i)) != -1) {
                    $.alert("Special characters not allowed.");
                    $('#txtULDNumber').val('');
                    $('#txtULDNumber').focus();
                    return false;
                }
            }

            for (i = 0; i < string.length && IsNumber == true; i++) {
                Char = string.charAt(i);
                if (ValidChars.indexOf(Char) == -1) {
                    $.alert('Last four character should be numeric  \n if ULD no is 5 digits');
                    $('#txtULDNumber').val('');
                    $('#txtULDNumber').focus();
                    IsNumber = false;
                }
            }
        }
        else {
            $.alert('Please Enter minimum four and maximum five character');
            $('#txtULDNumber').val('');
            $('#txtULDNumber').focus();
            return false;
        }
    }
}

function CheckSpecialCharacter(uldno) {

    var getUldno = $('#txtULDNumber').val();
    var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_`";

    for (var i = 0; i < getUldno.length; i++) {
        if (iChars.indexOf(getUldno.charAt(i)) != -1) {
            $.alert("Your string has special characters. \nThese are not allowed.");
            document.getElementById(txtULDNumber).value = "";
            document.getElementById(txtULDNumber).focus();
            return false;
        }
    }
}

function GetOffPointForFlight() {

    $('#ddlOffPoint').empty();
    $('#ddlContour').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlContour');

    $('#ddlULD').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlULD');


    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();

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

    var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint></Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetExportFlightDetails",
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

                $(xmlDoc).find('Table').each(function () {

                    var status = $(this).find('Status').text();

                    if (status == 'E') {
                        $.alert($(this).find('StrMessage').text());
                    }
                });

                $(xmlDoc).find('Table1').each(function () {

                    FlightSeqNo = $(this).find('FltSeqNo').text();
                });

                $(xmlDoc).find('Table2').each(function (index) {

                    var RouteId;
                    var OffPointCity;

                    RouteId = $(this).find('RouteID').text();
                    OffPointCity = $(this).find('FLIGHT_AIRPORT_CITY').text();

                    var newOption = $('<option></option>');
                    newOption.val(RouteId).text(OffPointCity);
                    newOption.appendTo('#ddlOffPoint');
                    if (index == 0) {
                        GetULDs(OffPointCity);
                    }
                });

                $(xmlDoc).find('Table4').each(function (index) {

                    var ContourId;
                    var ContourNo;

                    ContourId = $(this).find('Value').text();
                    ContourNo = $(this).find('Text').text();

                    var newOption = $('<option></option>');
                    newOption.val(ContourId).text(ContourNo);
                    newOption.appendTo('#ddlContour');
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

function GetULDs(offPonit) {

    $('#ddlULD').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlULD');

    $('#ddlBulk').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlBulk');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var FlightPrefix = $('#txtFlightPrefix').val();
    var FlightNo = $('#txtFlightNo').val();
    var FlightDate = $('#txtFlightDate').val();

    var inputXML = '<Root><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><Offpoint>' + offPonit + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetExportFlightDetails",
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

                $(xmlDoc).find('Table3').each(function (index) {

                    var ULDId;
                    var ULDNo;

                    ULDId = $(this).find('ULD_SEQUENCE_NUMBER').text();
                    ULDNo = $(this).find('ULDBULKNO').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULDNo);
                    newOption.appendTo('#ddlULD');
                });

                $(xmlDoc).find('Table5').each(function (index) {

                    var TrolleyId;
                    var TrolleyNo;

                    TrolleyId = $(this).find('TrolleySeqNo').text();
                    TrolleyNo = $(this).find('TrolleyNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(TrolleyId).text(TrolleyNo);
                    newOption.appendTo('#ddlBulk');
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

function AddULD() {

    if ($('#txtFlightPrefix').val() == "" || $('#txtFlightNo').val() == "") {
        errmsg = "Please enter valid Flight No.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtFlightDate').val() == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    if (document.getElementById('rdoULD').checked) {
        if ($('#txtULDType').val() == "" || $('#txtULDNumber').val() == "") {
            errmsg = "Please enter ULD Type and No.";
            $.alert(errmsg);
            return;
        }
        if ($('#txtOwner').val() == "") {
            errmsg = "Please enter ULD Owner";
            $.alert(errmsg);
            return;
        }
    }
    if (document.getElementById('rdoBulk').checked) {
        if ($('#txtBulkType').val() == "" || $('#txtBulkNumber').val() == "") {
            errmsg = "Please enter Bulk Type and No.";
            $.alert(errmsg);
            return;
        }
    }

    if ($('#ddlOffPoint').find('option:selected').text() == "Select" || $('#ddlOffPoint').find('option:selected').text() == "") {
        errmsg = "No offpoint selected";
        $.alert(errmsg);
        return;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '';
    var servicename;

    if (document.getElementById('rdoULD').checked) {

        inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtULDType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtULDNumber').val() + '</ULDNo><ULDOwner>' + $('#txtOwner').val().toUpperCase() + '</ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';
        servicename = 'UnitizationSaveULDDetails';
    }
    if (document.getElementById('rdoBulk').checked) {

        inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDType>' + $('#txtBulkType').val().toUpperCase() + '</ULDType><ULDNo>' + $('#txtBulkNumber').val() + '</ULDNo><ULDOwner></ULDOwner><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>'
        servicename = 'UnitizationSaveTrolleyDetails ';
    }




    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + servicename,
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
                var str = response.d;

                var xmlDoc = $.parseXML(str);
                $(xmlDoc).find('Table').each(function (index) {
                    if (index == 0) {
                        $.alert($(this).find('Column2').text());
                    }
                });

                GetULDs($('#ddlOffPoint').find('option:selected').text());

                $('#txtULDType').val('');
                $('#txtULDNumber').val('');
                $('#txtOwner').val('');

                $('#txtBulkType').val('');
                $('#txtBulkNumber').val('');
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function CloseULD() {

    if (document.getElementById('rdoBulk').checked) {

        CloseBulk();
        return;
    }

    if (document.getElementById('rdoULD').checked) {

        if ($('#txtFlightPrefix').val() == "" || $('#txtFlightNo').val() == "") {
            errmsg = "Please enter valid Flight No.";
            $.alert(errmsg);
            return;
        }
    }


    if ($('#txtFlightDate').val() == "") {
        errmsg = "Please enter Flight Date";
        $.alert(errmsg);
        return;
    }

    //if ($('#txtOwner').val() == "") {
    //    errmsg = "Please enter ULD Owner";
    //    $.alert(errmsg);
    //    return;
    //}

    if ($('#ddlOffPoint').find('option:selected').text() == "Select" || $('#ddlOffPoint').find('option:selected').text() == "") {
        errmsg = "No offpoint selected";
        $.alert(errmsg);
        return;
    }

    if ($('#ddlULD').find('option:selected').text() == "Select" || $('#ddlULD').find('option:selected').text() == "") {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }

    var uldType = $('#ddlULD').find('option:selected').text().substring(0, 3);
    var tempSTR = $('#ddlULD').find('option:selected').text().substring(3);
    var uldOwner = tempSTR.substring(tempSTR.length - 2)
    var uldNumber = (tempSTR.slice(0, -2)).trim();

    var contourCode;
    if ($('#ddlContour').find('option:selected').val() == 'Select')
        contourCode = '';
    else
        contourCode = $('#ddlContour').find('option:selected').val();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";



    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "EXPULDClose",
            data: JSON.stringify({
                'ULDType': uldType, 'ULDNo': uldNumber, 'ULDOwner': uldOwner.toUpperCase(),
                'ULDSequenceNo': $('#ddlULD').find('option:selected').val(), 'AirportCity': AirportCity, 'ScaleWeight': $('#txtGrossWt').val(),
                'ContourCode': contourCode, 'CompanyCode': window.localStorage.getItem("companyCode"), 'strUserID': window.localStorage.getItem("UserID"),
                'FlightSeqNumber': FlightSeqNo, 'routepoint': $('#ddlOffPoint').find('option:selected').text(),
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

                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    $.alert($(this).find('StrMessage').text());
                });

                GetOffPointForFlight();

                $('#txtGrossWt').val('');
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function CloseBulk() {

    if ($('#ddlBulk').find('option:selected').text() == "Select" || $('#ddlBulk').find('option:selected').text() == "") {
        errmsg = "Please select Bulk";
        $.alert(errmsg);
        return;
    }


    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "EXPTrolleyClose",
            data: JSON.stringify({
                'ULDSequenceNo': $('#ddlBulk').find('option:selected').val(), 'AirportCity': AirportCity, 'ScaleWeight': $('#txtGrossWt').val(),
                'CompanyCode': window.localStorage.getItem("companyCode"), 'strUserID': window.localStorage.getItem("UserID"),
                'FlightSeqNumber': FlightSeqNo, 'routepoint': $('#ddlOffPoint').find('option:selected').text(),
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

                $('#txtGrossWt').val('');

                $("body").mLoading('hide');

                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    $.alert($(this).find('StrMessage').text());
                });

                GetOffPointForFlight();

                $('#txtGrossWt').val('');
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function SaveDateTimeForULD() {

    if ($('#ddlOffPoint').find('option:selected').text() == "Select") {
        errmsg = "Please select ULD";
        $.alert(errmsg);
        return;
    }

    if ($('#txtStartDateTime').val() == "" || $('#txtStartTimeFrom').val() == "" || $('#txtStartTimeTo').val() == "") {
        errmsg = "Please enter Start Date/hh/mm.";
        $.alert(errmsg);
        return;
    }

    if ($('#txtEndDateTime').val() == "" || $('#txtEndTimeFrom').val() == "" || $('#txtEndTimeTo').val() == "") {
        errmsg = "Please enter End Date/hh/mm.";
        $.alert(errmsg);
        return;
    }

    if ((new Date($('#txtStartDateTime').val()).getTime() > new Date($('#txtEndDateTime').val()).getTime())) {
        errmsg = "End date cannot be less start date.";
        $.alert(errmsg);
        return;
    }

    if ((new Date($('#txtStartDateTime').val()).getTime() == new Date($('#txtEndDateTime').val()).getTime())) {
        if (Number($('#txtStartTimeFrom').val()) > Number($('#txtEndTimeFrom').val())) {
            errmsg = "End time cannot be less start time.";
            $.alert(errmsg);
            return;
        }
    }

    if ($('#txtStartDateTime').val().length > 0) {
        var formattedDate = new Date($('#txtStartDateTime').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        var StartDate = m + "/" + d + "/" + y;
    }

    if ($('#txtEndDateTime').val().length > 0) {
        var formattedDate = new Date($('#txtEndDateTime').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        var EndDate = m + "/" + d + "/" + y;
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + $('#ddlULD').find('option:selected').val() + '</ULDSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><BuiltUpStart>' + StartDate + '</BuiltUpStart><BuiltUpStartTime>' + $('#txtStartTimeFrom').val() + ':' + $('#txtStartTimeTo').val() + '</BuiltUpStartTime><BuiltUpEnd>' + EndDate + '</BuiltUpEnd><BuiltUpEndTime>' + $('#txtEndTimeFrom').val() + ':' + $('#txtEndTimeTo').val() + '</BuiltUpEndTime><UserId>' + UserId + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UnitizationBuiltUpULD",
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

function ShowAddAWBGrid() {

    if (document.getElementById('rdoULD').checked) {
        if ($('#ddlULD').find('option:selected').text() == 'Select') {
            errmsg = "Please select ULD";
            $.alert(errmsg);
            return false;
        }
        $('#txtULDNo').val($('#ddlULD').find('option:selected').text());
    }

    if (document.getElementById('rdoBulk').checked) {
        if ($('#ddlBulk').find('option:selected').text() == 'Select') {
            errmsg = "Please select Bulk";
            $.alert(errmsg);
            return;
        }
        $('#txtULDNo').val($('#ddlBulk').find('option:selected').text());
    }

    $('#txtFlightPrefix').attr("disabled", "disabled");
    $('#txtFlightNo').attr("disabled", "disabled");
    $('#txtFlightDate').attr("disabled", "disabled");
    $('#ddlOffPoint').attr("disabled", "disabled");
    $('#btnGet').attr("disabled", "disabled");

    //$('#txtULDNo').val($('#ddlULD').find('option:selected').text());
    $("#divULDDetails").hide();
    $("#divAddAWBDetails").show();

}

function ShowULDGrid() {
    $('#txtFlightPrefix').removeAttr("disabled");
    $('#txtFlightNo').removeAttr("disabled");
    $('#txtFlightDate').removeAttr("disabled");
    $('#ddlOffPoint').removeAttr("disabled");
    $('#btnGet').removeAttr("disabled");

    $("#divAddAWBDetails").hide();
    $("#divULDDetails").show();

    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#ddlShipmentNo').empty();
    $('#txtPackages').val('');

    $('#txtUnitizedPkgs').val('');
    $('#txtTotalPkgs').val('');

    $('#txtWeight').val('');
    $('#txtVolume').val('');

    $('#divAddTestLocation').empty();
    html = '';
}

function GetShipmentInfoForAWB() {

    var MAWBPrefix = $('#txtAWBNo').val().substr(0, 3);
    var MAWBNo = $('#txtAWBNo').val().substr(3, 11);

    if (MAWBNo == '') {
        return;
    }

    if (MAWBNo.length != '8') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    $('#txtPackages').val('');
    $('#txtWeight').val('');
    $('#txtVolume').val('');
    $('#txtUnitizedPkgs').val('');
    $('#txtTotalPkgs').val('');
    $('#ddlShipmentNo').empty();

    totalPkgs = '';
    totalWeight = '';
    totalVol = '';

    prorataWtParam = '';
    prorataVolParam = '';

    var getULDNo;

    if (MAWBNo == '')
        return;

    if (MAWBNo != '') {
        if (MAWBPrefix.length != '3' || MAWBNo.length != '8') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            return;
        }
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var inputXML = '<Root><flightSeqNo>' + FlightSeqNo + '</flightSeqNo><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><AWBPrefix>' + MAWBPrefix + '</AWBPrefix><AWBNo>' + MAWBNo + '</AWBNo></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            //url: GHAExportFlightserviceURL + "UnitizationPendingAWBDetails",
            url: GHAExportFlightserviceURL + "UnitizationPendingAWBDetails",
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
                responsee = response.d;

                strShipmentInfo = responsee;

                var xmlDoc = $.parseXML(responsee);

                $(xmlDoc).find('Table').each(function () {

                    if ($(this).find('Status').text() != 'S') {
                        $.alert($(this).find('StrMessage').text());
                        return;
                    }
                });

                $(xmlDoc).find('Table1').each(function (index) {

                    var newOption = $('<option></option>');
                    newOption.val($(this).find('EXPSHIPROWID').text()).text($(this).find('RNo').text());
                    newOption.appendTo('#ddlShipmentNo');

                    if (index == 0) {
                        //$('#txtPackages').val($(this).find('NOP').text());
                        //$('#txtWeight').val($(this).find('WEIGHT_KG').text());
                        //$('#txtVolume').val($(this).find('VOLUME').text());

                        $('#txtUnitizedPkgs').val($(this).find('ManNOP').text());
                        $('#txtTotalPkgs').val($(this).find('NOP').text());

                        totalPkgs = $(this).find('NOP').text();
                        totalWeight = $(this).find('ManWt').text();
                        //totalVol = $(this).find('VOLUME').text();

                        prorataWtParam = Number(totalWeight) / Number(totalPkgs);
                        //prorataVolParam = Number(totalVol) / Number(totalPkgs);
                    }
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

function ChangeEWRInfo(selectedShpmnt) {

    var xmlDoc = $.parseXML(strShipmentInfo);

    $(xmlDoc).find('Table1').each(function (index) {

        if ($(this).find('RNo').text() == selectedShpmnt) {
            $('#txtUnitizedPkgs').val($(this).find('ManNOP').text());
            $('#txtTotalPkgs').val($(this).find('NOP').text());

            totalPkgs = $(this).find('NOP').text();
            totalWeight = $(this).find('ManWt').text();
            //totalVol = $(this).find('VOLUME').text();

            prorataWtParam = Number(totalWeight) / Number(totalPkgs);
        }
    });

}

function CalculateProrataWtVol() {

    var newWt = Number($('#txtPackages').val()) * prorataWtParam;
    var newVol = Number($('#txtPackages').val()) * prorataVolParam;

    $('#txtWeight').val(newWt.toFixed(3));
    $('#txtVolume').val(newVol.toFixed(3));
}

function SaveAWBforULDDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    //var AWBPrefix = $('#txtAWBPrefix').val();
    var AWBNo = $('#txtAWBNo').val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    var ShipmentNo = $('#ddlShipmentNo').find('option:selected').text();
    var Packages = $('#txtPackages').val();
    var GrossWt = $('#txtWeight').val();
    var GrossWtUnit = $('#ddlGrossWtUnit').find('option:selected').text();
    var Volume = $('#txtVolume').val();
    var ULDNo;
    var Type;

    if (document.getElementById('rdoULD').checked) {
        Type = 'U';
        ULDNo = $('#ddlULD').find('option:selected').val();
    }
    if (document.getElementById('rdoBulk').checked) {
        Type = 'T';
        ULDNo = $('#ddlBulk').find('option:selected').val();
    }

    if (AWBNo == "" || Packages == "" || GrossWt == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;

    }

    if (Packages == Number(0)) {

        errmsg = "Packages cannot be 0.</br>";
        $.alert(errmsg);
        return;

    }

    if (ShipmentNo == "Select" || ShipmentNo == "") {

        errmsg = "Shipment number not found</br>";
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

        var flightDate = m + "/" + d + "/" + y;
    }

    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + ULDNo + '</ULDSeqNo><Type>' + Type + '</Type><Offpoint>' + $('#ddlOffPoint').find('option:selected').text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity><UserID>' + window.localStorage.getItem("UserID") + '</UserID><ULDType></ULDType><ULDNumber></ULDNumber><ULDOwner></ULDOwner><AWBId>-1</AWBId><ShipmentId>' + $('#ddlShipmentNo').find('option:selected').val() + '</ShipmentId><AWBNo>' + AWBNo + '</AWBNo><NOP>' + Packages + '</NOP><Weight>-1</Weight><Volume>-1</Volume></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAExportFlightserviceURL + "UnitizeAWB",
            //data: JSON.stringify({
            //    'strFlightNo': $('#txtFlightPrefix').val() + $('#txtFlightNo').val(), 'strFlightDate': flightDate, 'strULDNo': ULDNo,
            //    'strAWBNo': AWBNo, 'strShipmentNo': ShipmentNo, 'strPkgs': Packages,
            //    'strGrossWt': GrossWt, 'strWtUnit': GrossWtUnit, 'strVolume': Volume,
            //    'strAirportCity': AirportCity, 'strUserID': window.localStorage.getItem("UserID"), 'CompanyCode': window.localStorage.getItem("companyCode"), 'OffPoint': $('#ddlOffPoint').find('option:selected').text(), 'Type': Type,
            //}),
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

                    var status = $(this).find('Status').text();

                    if (status != 'E') {
                        $('#txtAWBPrefix').val('');
                        $('#txtAWBNo').val('');
                        $('#txtUnitizedPkgs').val('');
                        $('#txtTotalPkgs').val('');
                        $('#txtPackages').val('');
                        $('#ddlShipmentNo').empty();

                    }                    

                    //if (confirm($(this).find('StrMessage').text())) {
                    //    $('#txtAWBNo').focus();
                    //}

                    if (!alert($(this).find('StrMessage').text())) {
                        $('#txtAWBNo').focus();                        
                    }

                });

                //GetShipmentInfoForAWB($('#txtAWBNo').val());


                //$('#txtVolume').val('');
                //window.location.reload();

                GetAWBDetailsForULD();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function GetAWBDetailsForULD() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (document.getElementById('rdoULD').checked) {
        if ($('#ddlULD').find('option:selected').text() == 'Select') {
            return false;
        }
    }

    if (document.getElementById('rdoBulk').checked) {
        if ($('#ddlBulk').find('option:selected').text() == 'Select') {
            return false;
        }
    }

    var ULDid;
    var type;

    if (document.getElementById('rdoULD').checked) {
        ULDid = $("#ddlULD option:selected").val();
        type = 'U';
    }

    if (document.getElementById('rdoBulk').checked) {
        ULDid = $("#ddlBulk option:selected").val();
        type = 'T';
    }



    //SelectedHawbId = $("#ddlHAWB option:selected").val();      

    //var inputXML = '<Root><AWBNo>' + AWBNo + '</AWBNo><HouseNo>' + HAWBNo + '</HouseNo><IGMNo>' + IgmVal + '</IGMNo><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    var inputXML = '<Root><FlightSeqNo>' + FlightSeqNo + '</FlightSeqNo><ULDSeqNo>' + ULDid + '</ULDSeqNo><Type>' + type + '</Type><Offpoint>' + $("#ddlOffPoint option:selected").text() + '</Offpoint><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAExportFlightserviceURL + "GetUnitizedShipmentDetails",
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

                var totalPkgs;

                strXmlStore = str;

                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>AWB</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Packages</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table1').each(function (index) {

                        //var outMsg = $(this).find('Status').text();

                        //if (outMsg == 'E') {
                        //    $.alert($(this).find('StrMessage').text());
                        //    return;
                        //}

                        var Awb;
                        var Pkgs;

                        Awb = $(this).find('AWBNo').text().toUpperCase();
                        Pkgs = $(this).find('NOP').text();

                        AddTableLocation(Awb, Pkgs);

                    });

                    $(xmlDoc).find('Table2').each(function (index) {

                        totalPkgs = $(this).find('NOP').text();

                        html += "<tr>";

                        html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:13px;font-weight: bold;'align='center'>TOTAL</td>";

                        html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:13px;font-weight: bold;'align='center'>" + totalPkgs + "</td>";
                        html += "</tr>";


                    });

                    html += "</tbody></table>";

                    if (totalPkgs > Number(0))
                        $('#divAddTestLocation').append(html);
                    else {
                        $('#divAddTestLocation').empty();
                        html = '';
                    }
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

function AddTableLocation(AWB, Pkgs) {

    html += "<tr>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + AWB + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Pkgs + "</td>";
    html += "</tr>";

}

function clearAllULDDetails() {

    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#ddlOffPoint').empty();
    $('#txtULDType').val('');
    $('#txtULDNumber').val('');
    $('#txtOwner').val('');
    $('#ddlULD').empty();
    $('#ddlBulk').empty();
    $('#txtStartDateTime').val('');
    $('#txtStartTimeFrom').val('');
    $('#txtStartTimeTo').val('');
    $('#txtEndDateTime').val('');
    $('#txtEndTimeFrom').val('');
    $('#txtEndTimeTo').val('');
    $('#txtBulkType').val('');
    $('#txtBulkNumber').val('');
    $('#txtGrossWt').val('');
    $('#txtFlightPrefix').focus();
}

function clearAWBDetails() {

    //$('#txtULDNo').val('');
    $('#txtAWBPrefix').val('');
    $('#txtAWBNo').val('');
    $('#ddlShipmentNo').empty();
    $('#txtPackages').val('');
    $('#txtUnitizedPkgs').val('');
    $('#txtTotalPkgs').val('');
    $('#txtAWBNo').focus();
    //$('#txtTotalPkgs').val('');


}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function alertDismissed() {
}


