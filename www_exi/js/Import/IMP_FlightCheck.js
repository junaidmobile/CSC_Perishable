//document.addEventListener("deviceready", GetCommodityList, false);

var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");

var html;
var flightSeqNo;
var flightPrefix;
var flightNo;
var flightDate;
var flightULDId;
var flagRdoAll = 'A';
var strXmlStore;

$(function () {

    if (window.localStorage.getItem("RoleIMPFlightCheck") == '0') {
        window.location.href = 'IMP_Dashboard.html';
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
    var date = y.toString() + '-' + m.toString() + '-' + d.toString();
    $('#txtIGMYear').val(y);

    $('#txtFlightDate').val(date);

    if (amplify.store("flightPrefix") != '' && amplify.store("flightNo") != '' && amplify.store("flightDate") != '') {
        $("#txtFlightPrefix").val(amplify.store("flightPrefix"));
        $("#txtFlightNo").val(amplify.store("flightNo"));
        $("#txtFlightDate").val(amplify.store("flightDate"));

        GetFlightDetails();

        amplify.store("flightSeqNo", "")
        amplify.store("flightPrefix", "")
        amplify.store("flightNo", "")
        amplify.store("flightDate", "")
        amplify.store("flightDisplayDate", "")

    }

    amplify.store("selectedRowULDNo", "")
    amplify.store("selectedRowAWBNo", "")
    amplify.store("selectedRowHAWBNo", "")
    amplify.store("selectedRowULDid", "")


    //$("#rdoAll").click(function () {
    //    flagRdoAll = 'A';
    //    ViewFlightRelatedDetails();
    //});

    //$("#rdoShortUnscanned").click(function () {
    //    flagRdoAll = 'S';
    //    ViewFlightRelatedDetails();
    //});

});

function NexttoULDDetails() {

    //if ($('#txtFlightATAdate').val() == '' || $('#txtFlightATAhh').val() == '' || $('#txtFlightATAmm').val() == '') {
    //    errmsg = "Please enter valid ATA date and time";
    //    $.alert(errmsg);
    //    return;
    //}

    //if (Number($('#txtFlightATAhh').val()) > Number(23) || Number($('#txtFlightATAmm').val()) > Number(59)) {
    //    errmsg = "Please enter valid ATA time";
    //    $.alert(errmsg);
    //    return;
    //}

    //SaveATA();

    // set urs global variable here
    amplify.store("flightSeqNo", flightSeqNo)
    amplify.store("flightPrefix", flightPrefix)
    amplify.store("flightNo", flightNo)
    amplify.store("flightDisplayDate", flightDate)
    amplify.store("flightDate", $("#txtFlightDate").val())
    window.location.href = 'IMP_CheckAWB.html';
}


function GetFlightDetails() {

    $('#divMainDetails').show();
    $('#divFlightInfo').hide();
    $('#divFlightInfo').empty();
    html = '';

    var inputxml = "";
    var IGMNo = $('#txtIGMNo').val();
    var IGMYear = $("#txtIGMYear").val();
    var FlightPrefix = $("#txtFlightPrefix").val();
    var FlightNo = $("#txtFlightNo").val();
    var FlightDate;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (IGMNo == "" || IGMYear == "") {
        if (FlightPrefix == "" || FlightNo == "" || $('#txtFlightDate').val() == "") {
            errmsg = "Please enter IGM No. & IGM Yr. or </br> Flight No. & Flight Date</br>";
            $.alert(errmsg);
            return;
        }

        if (IGMYear != "") {
            if (IGMYear.length < Number(4)) {
                errmsg = "Please enter valid IGM year";
                $.alert(errmsg);
                return;
            }
        }
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

        FlightDate = m + "/" + d + "/" + y;
    }

    if (IGMNo != "" && IGMYear != "") {
        inputxml = '<Root><IGMNO>' + IGMNo + '</IGMNO><IGMYear>' + IGMYear + '</IGMYear><FlightAirline></FlightAirline><FlightNo></FlightNo><FlightDate></FlightDate><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    else if (FlightPrefix != "" && FlightNo != "" && $("#txtFlightDate").val() != "") {
        inputxml = '<Root><IGMNO></IGMNO><IGMYear></IGMYear><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportFlightDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
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
                var str = response.d

                clearBeforePopulate();
                var xmlDoc = $.parseXML(str);
                $(xmlDoc).find('Table1').each(function (index) {
                    if (index == 0) {
                        flightSeqNo = $(this).find('FlightSeqNo').text();

                        if (flightSeqNo == 0) {
                            $.alert('Flight not found!');
                            return;
                        }
                        else
                            $("#btnNext").removeAttr("disabled");

                        $('#txtIGMNo').val($(this).find('CustomRef').text());
                        flightPrefix = $(this).find('FlightAirline').text();
                        flightNo = $(this).find('FlightNo').text();
                        flightDate = $(this).find('DisplaySTA').text();
                        $('#txtFlightPrefix').val($(this).find('FlightAirline').text());
                        $('#txtFlightNo').val($(this).find('FlightNo').text());
                        $('#txtFlightDate').val($(this).find('FlightDate').text());
                        $('#txtTotCnts').val($(this).find('AWBCount').text());
                        $('#txtManiPieces').val($(this).find('NPX').text());
                        $('#txtReceivePieces').val($(this).find('NPR').text());
                        $('#txtManiGrWt').val(Number($(this).find('WeightExp').text()).toFixed(3));
                        $('#txtReceiveGrWt').val(Number($(this).find('WeightRec').text()).toFixed(3));
                        $('#txtShortPieces').val($(this).find('ShortLanded').text());
                        $('#txtExcessPieces').val($(this).find('ExcessLanded').text());
                        $('#txtDamagePieces').val($(this).find('DamagePkgs').text());

                        $('#lblFlightStatus').text('Flight Status:' + ' ' + $(this).find('FlightStatus').text());

                        var statusNext = $(this).find('IsNext').text();
                        if (statusNext == 'Y')
                            $("#btnNext").removeAttr("disabled");
                        else
                            $("#btnNext").attr("disabled", "disabled");

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

function ViewFlightRelatedDetails() {

    $('#divMainDetails').hide();
    $('#divFlightInfo').show();

    var inputxml = "";
    var IGMNo = $('#txtIGMNo').val();
    var IGMYear = $("#txtIGMYear").val();
    var FlightPrefix = $("#txtFlightPrefix").val();
    var FlightNo = $("#txtFlightNo").val();
    var FlightDate;
    var FlightArrived;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    if (IGMNo == "" || IGMYear == "") {
        if (FlightPrefix == "" || FlightNo == "" || $('#txtFlightDate').val() == "") {
            errmsg = "Please enter IGM No. & IGM Yr. or </br> Flight No. & Flight Date</br>";
            $.alert(errmsg);
            return;
        }

        if (IGMYear != "") {
            if (IGMYear.length < Number(4)) {
                errmsg = "Please enter valid IGM year";
                $.alert(errmsg);
                return;
            }
        }
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

        FlightDate = m + "/" + d + "/" + y;
    }

    if (flagRdoAll == '')
        flagRdoAll = 'A';

    if (IGMNo != "" && IGMYear != "") {
        inputxml = '<Root><IGMNO>' + IGMNo + '</IGMNO><IGMYear>' + IGMYear + '</IGMYear><FlightAirline></FlightAirline><FlightNo></FlightNo><FlightDate></FlightDate><FilterClause>' + flagRdoAll + '</FilterClause><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    else if (FlightPrefix != "" && FlightNo != "" && $("#txtFlightDate").val() != "") {
        inputxml = '<Root><IGMNO></IGMNO><IGMYear></IGMYear><FlightAirline>' + FlightPrefix + '</FlightAirline><FlightNo>' + FlightNo + '</FlightNo><FlightDate>' + FlightDate + '</FlightDate><FilterClause>' + flagRdoAll + '</FilterClause><AirportCity>' + AirportCity + '</AirportCity></Root>';
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetImportFlightCheckView",
            data: JSON.stringify({ 'InputXML': inputxml }),
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

                if (str != null && str != "") {

                    $('#divFlightInfo').empty();
                    html = '';

                    html += '<div class="form-group col-xs-12 col-sm-6 col-md-6 NoPadding">'

                    if (flagRdoAll == 'S')
                        html += '<input type="radio" name="radSize" id="rdoAll" value="All"/>'
                    else
                        html += '<input type="radio" name="radSize" id="rdoAll" value="All" checked="checked" />'

                    html += '<label for="sizeLarge">All</label>'
                    html += '<label for="sizeLarge">  </label>'

                    if (flagRdoAll == 'S')
                        html += '<input type="radio" name="radSize" id="rdoShortUnscanned" value="ShortUnscanned" checked="checked"/>'
                    else
                        html += '<input type="radio" name="radSize" id="rdoShortUnscanned" value="ShortUnscanned" />'

                    html += '<label for="sizeSmall">Short/Unscanned</label>'
                    html += '</div>'

                    html += "<table id='tblNews' border='1' style='width:200%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>ULD No.</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>AWB No.</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>HAWB No.</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Total</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Scanned</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Damaged</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table2').each(function (index) {

                        flightSeqNo = $(this).find('FlightSeqNo').text();

                        if (flightSeqNo == 0) {
                            $.alert('Flight not found!');
                            return;
                        }

                        $('#txtIGMNo').val($(this).find('IGMNo').text());
                        flightPrefix = $(this).find('FlightAirline').text();
                        flightNo = $(this).find('FlightNo').text();
                        flightDate = $(this).find('DisplaySTA').text();
                        FlightArrived = $(this).find('IsNext').text();
                        $('#txtFlightPrefix').val($(this).find('FlightAirline').text());
                        $('#txtFlightNo').val($(this).find('FlightNo').text());
                        $('#txtFlightDate').val($(this).find('STA').text());

                        $('#lblFlightStatus').text('Flight Status:' + ' ' + $(this).find('Status').text());
                    });

                    $(xmlDoc).find('Table1').each(function (index) {

                        var UldNo;
                        var AwbNo;
                        var HawbNo;
                        var Total;
                        var Scanned;
                        var Damaged;

                        UldNo = $(this).find('ULDNo').text();
                        AwbNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();
                        HawbNo = $(this).find('HouseNo').text();
                        Total = $(this).find('NPX').text();
                        Scanned = $(this).find('NPR').text();
                        Damaged = $(this).find('DamageNOP').text();

                        AddTableLocationAWB(UldNo, AwbNo, HawbNo, Total, Scanned, Damaged, FlightArrived);
                    });

                    html += "</tbody></table>";

                    $('#divFlightInfo').append(html);
                    $('#divFlightInfo').show();

                    $("#rdoAll").click(function () {
                        flagRdoAll = 'A';
                        ViewFlightRelatedDetails();
                    });

                    $("#rdoShortUnscanned").click(function () {
                        flagRdoAll = 'S';
                        ViewFlightRelatedDetails();
                    });
                }
                else {
                    errmsg = 'Data not found';
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

function AddTableLocationAWB(UldNo, AwbNo, HawbNo, Total, Scanned, Damaged, FlightArrived) {

    if (FlightArrived == 'Y')
        html += "<tr onclick='SelectedFlightInfo(this);'>";
    else
        html += "<tr>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + UldNo + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + AwbNo + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + HawbNo + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + Total + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + Scanned + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + Damaged + "</td>";

    html += "</tr>";
}

function SelectedFlightInfo(a) {


    var xmlDoc = $.parseXML(strXmlStore);

    var selectedRowULDNo;
    var selectedRowAWBNo;
    var selectedRowHAWBNo;
    var selectedRowULDid;

    $(xmlDoc).find('Table1').each(function (index) {

        if (index == a.rowIndex - 1) {
            selectedRowULDNo = $(this).find('ULDNo').text();
            selectedRowAWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();
            selectedRowHAWBNo = $(this).find('HouseNo').text();
            selectedRowULDid = $(this).find('ULDId').text();

            amplify.store("flightSeqNo", flightSeqNo)
            amplify.store("flightPrefix", flightPrefix)
            amplify.store("flightNo", flightNo)
            amplify.store("flightDisplayDate", flightDate)
            amplify.store("flightDate", $("#txtFlightDate").val())

            amplify.store("selectedRowULDNo", selectedRowULDNo)
            amplify.store("selectedRowAWBNo", selectedRowAWBNo)
            amplify.store("selectedRowHAWBNo", selectedRowHAWBNo)
            amplify.store("selectedRowULDid", selectedRowULDid)

            window.location.href = 'IMP_CheckAWB.html';

        }
    });

}


function clearALL() {
    $('#txtIGMNo').val('');
    //$('#txtIGMYear').val('');
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
    $("#btnNext").attr("disabled", "disabled");
    $('#lblFlightStatus').text('');
    $('#txtIGMNo').focus();

    $('#divMainDetails').show();
    $('#divFlightInfo').hide();
    $('#divFlightInfo').empty();
    html = '';
    flagRdoAll = 'A';
}

function clearBeforePopulate() {
    //$('#txtIGMNo').val('');
    //$('#txtIGMYear').val('');
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
    $("#btnNext").attr("disabled", "disabled");
    $('#divMainDetails').show();
    $('#divFlightInfo').hide();
    $('#divFlightInfo').empty();
    html = '';
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


//function GetCommodityList() {
//    $.ajax({
//        type: 'POST',
//        url: WebServiceUrl + "GetCommodityList",//113.193.225.52:8080
//        data: JSON.stringify({}),
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            var str = response.d;
//            if (str == "<NewDataSet />") {
//                alert("Please enter valid credentials");
//            }
//            else {
//                var xmlDoc = $.parseXML(response.d);
//                var xml = $(xmlDoc);
//                var DrpNewsCategory = xml.find("Table");
//                for (var i = 0; i < DrpNewsCategory.length; i++) {
//                    var val = $(DrpNewsCategory[i]).find('SR_NO').text();
//                    var text = $(DrpNewsCategory[i]).find('COMMODITY_TYPE').text();
//                    $('#ddlCommodity').append($('<option></option>').val(val).html(text));
//                }
//            }

//        },
//        error: function (msg) {
//            var r = jQuery.parseJSON(msg.responseText);
//            alert("Message: " + r.Message);
//        }
//    });
//}

