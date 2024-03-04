
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var TotPackages;
var OldLocationId;
var OldLocationPieces;
var strXmlStore;
var locPieces;
var html;

$(function () {

    if (window.localStorage.getItem("RoleExpIntlMvmt") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }

});

function SaveShipmentInternalMovement() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var FromLoc = $('#txtFromLocation').val().toUpperCase();
    var TotalPIECESno = $('#txtTotalPkg').val();
    var MovePIECESno = $('#txtMovePackages').val();
    var NewLoc = $('#txtNewLocation').val().toUpperCase();


    if (AWBNo == "") {

        errmsg = "Please enter AWB no.</br>";
        $.alert(errmsg);
        return;

    }

    if ($('#txtFromLocation').val() == "") {

        errmsg = "Please select from location</br>";
        $.alert(errmsg);
        return;

    }

    if ($('#txtMovePackages').val() == "") {

        errmsg = "Please enter move packages</br>";
        $.alert(errmsg);
        return;

    }

    if ($('#txtNewLocation').val() == "") {

        errmsg = "Please enter new location</br>";
        $.alert(errmsg);
        return;

    }

    //OldLocationPieces = TotPackages.substr(((TotalPIECESno.length - 1) / 2) + 1);
    //OldLocationPieces = TotPackages.substr(0, TotPackages.indexOf('/'));
    OldLocationPieces = TotalPIECESno;

    //if (OldLocationPieces == '0') {
    //    errmsg = "No packages remaining to move.</br>Action cancelled.";
    //    $.alert(errmsg);
    //    return;
    //}

    //if (Number(MovePIECESno) > Number(OldLocationPieces)) {
    //    errmsg = "Move packages cannot be more than total remaining packages.</br>";
    //    $.alert(errmsg);
    //    return;
    //}

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "SaveExpShipmentInternalMovement_PDA",
            data: JSON.stringify({
                'pi_strAWBNo': AWBNo, 'pi_intOldLocId': OldLocationId, 'pi_intOldLocPieces': OldLocationPieces,
                'pi_strNewLoc': NewLoc, 'pi_intNewLocPieces': MovePIECESno, 'pi_strCreatedBy': window.localStorage.getItem("UserName"),
                'pi_strEWRno': $('#ddlEWRno').find('option:selected').text(), 'pi_strLoaderName': $('#txtLoader').val(),
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
                //window.location.reload();
                //clearALL();
                GetShipmentLocation();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function GetEWRNo() {

    $('#ddlEWRno').empty();

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();     

    if (AWBNo == '') {        
        return;
    }

    if (AWBNo != '' && AWBNo.length != '11') {
        errmsg = "Please enter valid AWB No.";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetEWRnumberForAWB_PDA",
            data: JSON.stringify({ 'pi_strAWBNo': AWBNo }),
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
                                    
                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {

                        if ($(this).find('LocCode').text() != '')
                        {
                            $.alert($(this).find('LocCode').text());
                            return;
                        }

                        EWRval = $(this).find('EWRNo').text();
                        EWRno = $(this).find('EWRNo').text();

                        var newOption = $('<option></option>');
                        newOption.val(EWRval).text(EWRno);
                        newOption.appendTo('#ddlEWRno');
                        
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

function GetShipmentLocation() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

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

    var EWRNo = $('#ddlEWRno').find('option:selected').text()

    if (EWRNo == '' || EWRNo == 'Select') {
        errmsg = "Please select EWR No.";
        $.alert(errmsg);
        return;
    }



    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetShipmentLocationDetailsInternalMovement_PDA",
            data: JSON.stringify({ 'pi_strMAWBNo': AWBNo, 'pi_strEWRNo': EWRNo }),
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

                        if (outMsg != '') {
                            $.alert(outMsg);
                            $('#divAddTestLocation').empty();
                            html = '';
                            return;
                        }

                        var location;

                        location = $(this).find('Location').text();
                        locPieces = $(this).find('LocatedPieces').text();

                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());

                        
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

function AddTableLocation(loc, locpieces) {

    html += "<tr onclick='SelectLocationInfo(this);'>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + loc + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

}

function SelectLocationInfo(a) {
    //alert(a.rowIndex);

    var xmlDoc = $.parseXML(strXmlStore);

    $(xmlDoc).find('Table').each(function (index) {

        if (index == a.rowIndex - 1) {
            $('#txtFromLocation').val($(this).find('Location').text());
            $('#txtTotalPkg').val($(this).find('LocatedPieces').text());
            OldLocationId = $(this).find('LocationId').text();
        }

    });
}

function clearALL() {
    $('#txtAWBNo').val('');
    $('#txtFromLocation').val('');
    $('#txtTotalPkg').val('');
    $('#txtMovePackages').val('');
    $('#txtNewLocation').val(''); 
    $('#divAddTestLocation').empty();

    $('#ddlEWRno').empty();
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtAWBNo').focus();
}

function clearBeforePopulate() {
    $('#txtFromLocation').val('');
    $('#txtTotalPkg').val('');
    $('#txtMovePackages').val('');
    $('#txtNewLocation').val('');

    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');
    $('#txtLoader').val('');

    $('#divAddLocation').empty();
    html = '';
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

