
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var AWBid;
var type;
var _Zone ='';
var d = new Date(),
    n = d.getMonth() + 1,
    y = d.getFullYear()
t = d.getDate();

$(function () {

    if (window.localStorage.getItem("RoleExpTDG") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }

    type = 'A';

    $("#rdoAWB").click(function () {
        rdoAWBChecked();
    });

    $("#rdoSlot").click(function () {
        rdoSlotChecked();
    });
});

function rdoAWBChecked() {
    clearALL();
    type = 'A';
    $('#divAWB').css('display', 'block');
    $('#divSlot').css('display', 'none');
    $('#txtAWBNo').focus();
}

function rdoSlotChecked() {
    clearALL();
    type = 'S';
    $('#divAWB').css('display', 'none');
    $('#divSlot').css('display', 'block');
    $('#txtSlotNo').focus();
}

function GetAWBForSlotNumber() {

    var SlotNo = $('#txtSlotNo').val();

    clearALL();

    $('#txtSlotNo').val(SlotNo);

    if (SlotNo == '')
        return;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetAWBNoBasedOnSlotNo_PDA",
            data: JSON.stringify({ 'pi_strSlotNo': SlotNo }),
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

                        if ($(this).find('OutMsg').text() != '') {
                            $.alert($(this).find('OutMsg').text());
                            return false;
                        }

                        var newOption = $('<option></option>');
                        newOption.val($(this).find('AWBNo').text()).text($(this).find('AWBNo').text());
                        newOption.appendTo('#ddlAWBno');

                    });

                }
                else {
                    errmsg = 'Slot no. does not exists';
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

function GetShipmentDetailsForTDG() {

    $('#divShippingBillInfo').hide();
    $('#divTDGinfo').show();

    $("#btnSave").removeAttr("disabled");
    $("#txtReceivedPkgs").removeAttr("disabled");

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo;

    if (type == 'S' && $('#txtSlotNo').val() == '') {
        errmsg = "Please enter Slot No.";
        $.alert(errmsg);
        return;
    }

    if (type == 'A')
        AWBNo = $('#txtAWBNo').val();

    if (type == 'S')
        AWBNo = $('#ddlAWBno').find('option:selected').text();

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

    if (n.toString().length < Number(2))
        n = '0' + n;
    if (t.toString().length < Number(2))
        t = '0' + t;


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetShipmentDetailsforTDGAcceptance_PDA",
            data: JSON.stringify({ 'pi_strNumber': AWBNo, 'pi_strMode': 'A' }),
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
                if (str != null && str != "") {
                    
                    $('#btnSave').removeAttr('disabled');
                    $('#btnSBill').removeAttr('disabled');

                    var xmlDoc = $.parseXML(str);
                    console.log('get Data')
                    console.log(xmlDoc)
                    GetZoneWiseTemperatureDetails();
                    $(xmlDoc).find('Table').each(function (index) {
                        //debugger;
                        if (index == 0) {
                            AWBid = $(this).find('AWBId').text();
                            if (type == 'A')

                                _Zone = $(this).find('Zone').text()
                                $('#txtSlotNo').val($(this).find('SlotNo').text());
                            $('#txtSlotTime').val($(this).find('SlotNo').text().slice(-4));
                            $('#txtFlightNo').val($(this).find('FlightNo').text());
                            $('#txtFlightDate').val($(this).find('FlightDt').text());
                            $('#txtFltDestination').val($(this).find('OffPoint').text());
                            $('#txtAWBDestination').val($(this).find('Destination').text());
                            $('#txtDecPackages').val($(this).find('Pieces').text());
                            $('#txtDeclGrossWt').val($(this).find('GrWt').text());
                            $('#txtDeclchrgWt').val($(this).find('ChWt').text());
                            $('#txtRcvdGrossWt').val($(this).find('ActualGrWt').text());
                            $('#txtCommodity').val($(this).find('Commodity').text());
                            $('#txtDeclVolWt').val($(this).find('DeclaredVolWt').text());
                            $('#txtRcvdVolWt').val($(this).find('ActualVolWt').text());

                            $('#txtExporterName').val($(this).find('Exporter').text());
                            $('#txtIataCode').val($(this).find('IATA').text());
                            $('#ddlZone').val($(this).find('Zone').text());
                            $('#txtVehDet').val($(this).find('VehicleDetails').text());
                            $('#txtVehicleTemperature').val($(this).find('VehicleTemp').text());
                           // $('#txtCHACode').val($(this).find('CHA').text());

                            if ($(this).find('TDGStatus').text() == 'true') {
                                $("#btnSave").attr("disabled", "disabled");
                                $("#txtReceivedPkgs").attr("disabled", "disabled");
                            }

                            if ($(this).find('Pieces').text() == '0/0') {
                                $("#btnSave").attr("disabled", "disabled");
                                $("#txtReceivedPkgs").attr("disabled", "disabled");
                            }

                            if (Number($(this).find('ActualGrWt').text()) > Number($(this).find('ActualChWt').text()))
                                $('#txtRcvdchrgWt').val($(this).find('ActualGrWt').text());
                            if (Number($(this).find('ActualChWt').text()) > Number($(this).find('ActualGrWt').text()))
                                $('#txtRcvdchrgWt').val($(this).find('ActualChWt').text());
                            if (Number($(this).find('ActualChWt').text()) == Number($(this).find('ActualGrWt').text()))
                                $('#txtRcvdchrgWt').val($(this).find('ActualChWt').text());
                        }
                    });
                    $(xmlDoc).find('Table').each(function () {
                        if ($(this).find('OutMsg').text().length > Number(5)) {
                            $.alert($(this).find('OutMsg').text());
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

function GetHAWBDetailsForTDG() {

    $('#divShippingBillInfo').show();
    $('#divTDGinfo').hide();

    var temp;

    html = '';
    $('#divAddLocation').empty();

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo;

    if (type == 'A')
        AWBNo = $('#txtAWBNo').val();

    if (type == 'S')
        AWBNo = $('#ddlAWBno').find('option:selected').text();

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

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetHAWBDetailsForTDGAcceptance_PDA",
            data: JSON.stringify({ 'pi_strNumber': AWBNo }),
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

                    $('#divAddLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>S. Bill</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Pkgs.</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Gross Wt.</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Dec. Value</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        var sBill;
                        var pkgs;
                        var grWt;
                        var DecValue

                        sBill = $(this).find('SBNo').text();
                        pkgs = $(this).find('Pieces').text();
                        grWt = $(this).find('GrWt').text();
                        DecValue = $(this).find('FOBValue').text();

                        AddTableLocation(sBill, pkgs, grWt, DecValue);
                    });


                    html += "</tbody></table>";

                    if (temp != 1)
                        $('#divAddLocation').append(html);

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

function AddTableLocation(sBill, pkgs, grWt, DecValue) {
    html += "<tr>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;'>" + sBill + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;text-align: right;'>" + pkgs + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;text-align: right;'>" + grWt + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px;text-align: right;'>" + DecValue + "</td>";

    html += "</tr>";
}

function SaveTDGDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var txtReceivedPkgs = $('#txtReceivedPkgs').val();
    var GrossWt = 0;
    var ChargablWt = 0;
    var EuroPalletNo = 0;
    var ReceivedPieces = 0;


    if (txtReceivedPkgs == "") {

        errmsg = "Please enter received pckgs.</br>";
        $.alert(errmsg);
        return;

    }
    if ($('#ddlZone').val() == '0') {
        errmsg = "Please select zone.</br>";
        $.alert(errmsg);
        return;
    }
   
    console.log("Date===", n + "/" + t + "/" + y)
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreateTDGAcceptance_HHT",
            data: JSON.stringify({
                'pi_intALRowId': AWBid,
                'pi_intTLRowId': 0,
                'pi_intScannedPkgs': txtReceivedPkgs,
                'pi_decScannedGrWt': GrossWt,
                'pi_decVolumetricWt': ChargablWt,
                'pi_strCreatedBy': window.localStorage.getItem("UserName"),
                'pi_strRemarks': '',
                'pi_dtTDGDate': n + "/" + t + "/" + y,
                'pi_strTemperature': '',
                'pi_strZone': $('#ddlZone').val(),
                'pi_strVehicleDetails': $('#txtVehDet').val(),
                'pi_strVehicleTemp': $('#txtVehicleTemperature').val(),


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
                var xmlDoc = $.parseXML(str);
                $(xmlDoc).find('Table').each(function (index) {
                    if (index == 0) {
                        //if (($(this).find('OutMsg').text()).length < Number(5))
                        $.alert($(this).find('Column1').text());
                        //else
                        //    $.alert($(this).find('OutMsg').text());
                    }
                });
                //clearALL();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                //$.alert('Some error occurred while saving data');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
        return false;
    }

}



function GetZoneWiseTemperatureDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";
   
    //  var params = "{'pi_strEvent': 'TDG','pi_strZone': 'ALL','po_strStatus': '','po_strOut': ''}";
    var pi_strEvent = 'TDG';
    var pi_strZone = 'ALL';
    var po_strStatus = '';
    var po_strOut = '';
    $('#ddlZone').empty();
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "GetZoneWiseTemperatureDetails",
            data: JSON.stringify({
                'pi_strEvent': pi_strEvent,
                'pi_strZone': pi_strZone,
                'po_strStatus': po_strStatus,
                'po_strOut': po_strOut

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
                console.log(response)
                var str = response.d

                var xmlDoc = $.parseXML(str);
                console.log("Zone")
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {

                    RowId = $(this).find('RowId').text();
                    ZoneCode = $(this).find('ZoneCode').text();
                    Temperature = $(this).find('Temperature').text();
                    Timestamp = $(this).find('Timestamp').text();
                    CreatedOn = $(this).find('CreatedOn').text();
                    dtTimestamp = $(this).find('dtTimestamp').text();


                    if (index == 0) {
                        var newOption = $('<option></option>');
                        if (_Zone == '') {
                            newOption.val('0').text('Select');
                            newOption.appendTo('#ddlZone');
                        } else {
                            newOption.val(_Zone).text(_Zone);
                            newOption.appendTo('#ddlZone');
                        }
                       
                    }

                    var newOption = $('<option></option>');
                    newOption.val(ZoneCode).text(ZoneCode);
                    newOption.appendTo('#ddlZone');

                });
                //clearALL();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                //$.alert('Some error occurred while saving data');
                var r = jQuery.parseJSON(msg.responseText);
                $.alert(r.Message);
            }
        });
        return false;
    }

}

function BackFromSbill() {
    $('#divShippingBillInfo').hide();
    $('#divTDGinfo').show();

}

function clearALL() {
    $('#txtEuroPalletNo').val('');
    $('#txtAWBNo').val('');
    $('#txtSlotNo').val('');
    $('#txtSlotTime').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtFltDestination').val('');
    $('#txtAWBDestination').val('');
    $('#txtDecPackages').val('');
    $('#txtDeclGrossWt').val('');
    $('#txtDeclchrgWt').val('');
    $('#txtRcvdGrossWt').val('');
    $('#txtRcvdchrgWt').val('');
    $('#txtDeclVolWt').val('');
    $('#txtRcvdVolWt').val('');
    $('#txtCommodity').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtExporterName').val('');
    $('#txtIataCode').val('');
    $('#txtCHACode').val('');
    $("#btnSave").removeAttr("disabled");
    $("#txtReceivedPkgs").removeAttr("disabled");
    if (type == 'A')
        $('#txtAWBNo').focus();
    $('#ddlAWBno').empty();
    $('#divAddLocation').empty();

    $('#txtVehDet').val('');
    $('#txtVehicleTemperature').val('');

    $('#ddlZone').empty();
    var newOption = $('<option></option>');
    newOption.val('').text('Select');
    newOption.appendTo('#ddlZone');

   
}

function FocusSlot() {
    if (type == 'S')
        $('#txtSlotNo').focus();
}

function clearBeforePopulate() {
    $('#txtEuroPalletNo').val('');
    $('#txtFlightNo').val('');
    $('#txtFlightDate').val('');
    $('#txtPackages').val('');
    $('#txtGrossWt').val('');
    $('#txtchrgWt').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtPendingPkgs').val('');
    $('#txtDestination').val('');
    $('#txtCommodity').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

