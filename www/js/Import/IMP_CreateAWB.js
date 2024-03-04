
document.addEventListener("deviceready", GetCommodityList, false);

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

function GetCommodityList() {
    $.ajax({
        type: 'POST',
        //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/GetCommodityList",//113.193.225.52:8080
        url: CargoWorksServiceURL + "GetCommodityList",
        data: JSON.stringify({}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var str = response.d;
            if (str == "<NewDataSet />") {
                alert("Please enter valid credentials");
            }
            else {
                var xmlDoc = $.parseXML(response.d);
                var xml = $(xmlDoc);
                var DrpNewsCategory = xml.find("Table");
                for (var i = 0; i < DrpNewsCategory.length; i++) {
                    var val = $(DrpNewsCategory[i]).find('SR_NO').text();
                    var text = $(DrpNewsCategory[i]).find('COMMODITY_TYPE').text();
                    $('#ddlCommodity').append($('<option></option>').val(val).html(text));
                }
            }

        },
        error: function (msg) {
            var r = jQuery.parseJSON(msg.responseText);
            alert("Message: " + r.Message);
        }
    });
}




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
                'strFlightNumber': FullFlightNo,'strAirportCity': AirportCity,'CompanyCode': CompanyCode,'strFlightDate': FlightDate,'chrCycle': 'I',
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

function SaveAWB() {

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

    var AWBNo = $('#txtAWBNo').val();
    var origin = $('#txtOrigin').val();
    var destination = $('#txtDestination').val();
    var offloadpoint = $('#txtOffloadPoint').val();
    var AWBpkg = $('#txtPkgAWB').val();
    var AWBGrWt = $('#txtGrWtAWB').val();
    var RCVPkg = $('#txtPkgRCV').val();
    var RCVGrWt = $('#txtGrWtRCV').val();
    //var ddlUnit = $('#ddlUnit').val();
    var ddlCommodity = $('#ddlCommodity').val();
    var CommodityText = $("#ddlCommodity option:selected").text();
    var ErrorMsg = "";

    if (AWBNo == null || AWBNo == "") {
        ErrorMsg = ErrorMsg + "Please enter AWB No.<br/>";
        //$("#txtAWBNo").css("background-color", "#ffcccc");

    }

    if (AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (AWBpkg == null || AWBpkg == "") {
        ErrorMsg = ErrorMsg + "Please enter No. of Pkgs.<br/>";
        //$("#txtPkgAWB").css("background-color", "#ffcccc");

    }
    if (AWBGrWt == null || AWBGrWt == "") {
        ErrorMsg = ErrorMsg + "Please enter Gross Wt.<br/>";
        //$("#txtGrWtAWB").css("background-color", "#ffcccc");

    }

    if (ErrorMsg.length > 0) {
        HideLoader();
        lnv.alert({
            title: 'Alert',
            content: ErrorMsg,
            alertBtnText: 'Ok',
            alertHandler: function () {



            }
        })
    }
    else {
        alert(window.localStorage.getItem("companyCode"));
        var strAWBDetails = "";
        strAWBDetails = strAWBDetails + "<AWBDtl>";
        strAWBDetails = strAWBDetails + "<AWB AWBNo='";
        strAWBDetails = strAWBDetails + AWBNo.trim();
        strAWBDetails = strAWBDetails + "' HAWBNo='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' TAWBPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' TAWBGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SExpPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' SExpGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SRcvPkgs='";
        strAWBDetails = strAWBDetails + RCVPkg.trim();
        strAWBDetails = strAWBDetails + "' SRcvGwt ='";
        strAWBDetails = strAWBDetails + RCVGrWt.trim();
        strAWBDetails = strAWBDetails + "' IsMaster='";
        strAWBDetails = strAWBDetails + "1";
        strAWBDetails = strAWBDetails + "' FltNo ='";
        strAWBDetails = strAWBDetails + FullFlightNo.trim();        
        strAWBDetails = strAWBDetails + "' FltDate='";
        strAWBDetails = strAWBDetails + FlightDate.trim();        
        strAWBDetails = strAWBDetails + "' Origin ='";
        strAWBDetails = strAWBDetails + origin.trim();
        strAWBDetails = strAWBDetails + "' Dest ='";
        strAWBDetails = strAWBDetails + destination.trim();
        strAWBDetails = strAWBDetails + "' OffPt ='";
        strAWBDetails = strAWBDetails + offloadpoint.trim();
        strAWBDetails = strAWBDetails + "' ULDNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Com ='";
        strAWBDetails = strAWBDetails + ddlCommodity;
        strAWBDetails = strAWBDetails + "' Descr ='";
        strAWBDetails = strAWBDetails + CommodityText.trim();
        strAWBDetails = strAWBDetails + "'/>";
        strAWBDetails = strAWBDetails + "</AWBDtl>";
        var companycode = window.localStorage.getItem("companyCode");
        var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
        var ShedCode = window.localStorage.getItem("SHED_CODE");
        var UserId = window.localStorage.getItem("UserID");
        $.ajax({
            type: 'POST',
            //url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/PDAExpCreateAWB",//113.193.225.52:8080
            url: CargoWorksServiceURL + "PDAExpCreateAWB",
            data: JSON.stringify({ 'strAWBDetails': strAWBDetails, 'strComapnyCode': companycode, 'strAirportCity': AirportCity, 'strShedCode': "I", 'strUserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var str = response.d;
                if (str == 'AWB saved successfully.') {
                    lnv.alert({
                        title: 'Success',
                        content: "AWB saved successfully.",
                        alertBtnText: 'Ok',
                        alertHandler: function () {

                            clearALL();

                        }
                    })
                }
                else {
                    lnv.alert({
                        title: 'Alert',
                        content: str,
                        alertBtnText: 'Ok',
                        alertHandler: function () {
                        }
                    })
                }
            },
            error: function (msg) {
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            }
        });
    }
}

function clearALL() {    
    $('#txtFlightPrefix').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtOffloadPoint').val('');
    $('#txtPkgAWB').val('');
    $('#txtPkgRCV').val('');
    $('#txtGrWtAWB').val('');
    $('#txtGrWtRCV').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


