
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var AWBid;
var type;

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


                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {
                        //debugger;
                        if (index == 0) {
                            AWBid = $(this).find('AWBId').text();
                            if (type == 'A')
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
                            $('#txtCHACode').val($(this).find('CHA').text());

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

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + sBill + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='left'>" + pkgs + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + grWt + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + DecValue + "</td>";

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

    //if (EuroPalletNo == "") {
    //    EuroPalletNo = '0';
    //}

    //if (Number(ReceivedPieces) > Number(TotalPIECESno)) {
    //    errmsg = "TDG packages cannot be more than declared packages.</br>";
    //    $.alert(errmsg);
    //    return;
    //}


    var xml = "";
    xml = '<TDGInfo><TDGDetail ALRowId="' + AWBid + '" ScannedPkgs="' + txtReceivedPkgs + '" ScannedGrossWt="' + GrossWt + '" VolumetricWt="' + ChargablWt + '" EuroPalletNo="' + EuroPalletNo + '" IsPalletWiseScan="0" CreatedBy="' + window.localStorage.getItem("UserName") + '" Remarks="" TDGDate="' + n + "/" + t + "/" + y + '"/></TDGInfo>';
    console.log(CMSserviceURL + "CreatePartTDGAcceptance_PDA")
    console.log(xml);
    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreatePartTDGAcceptance_PDA",
            data: JSON.stringify({
                'pi_strTDGDetails': xml, 'pi_strMode': "false",
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
                console.log(xmlDoc)
                $(xmlDoc).find('Table').each(function (index) {
                    if (index == 0) {

                        //if (($(this).find('OutMsg').text()).length < Number(5))
                        $.alert($(this).find('OutMsg').text());
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

