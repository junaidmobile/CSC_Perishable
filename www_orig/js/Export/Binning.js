
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");
var html;

(function () {

    if (window.localStorage.getItem("RoleExpBinning") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }

    document.addEventListener('deviceready', AddLocation, false);
    document.addEventListener('deviceready', AddingTestLocation, false);

}
)();

var TotPackages;
var OldLocationPieces;

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

                        var outMsg = $(this).find('OutMsg').text();
                        if (outMsg != '') {
                            $.alert(outMsg);
                            $('#divAddTestLocation').empty();
                            html = '';
                            return;
                        }

                        if ($(this).find('LocCode').text() != '') {
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
    $("#btnSubmit").removeAttr("disabled");
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');

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

    var locPieces;

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetShipmentLocationDetails_PDA",
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
                $('#divAddTestLocation').empty();
                $("body").mLoading('hide');
                var str = response.d;
                console.log(response.d)
                //if (str.indexOf("does not") >= 0 || str.indexOf("pending") >= 0) {
                //    errmsg = str;
                //    $.alert(errmsg);
                //    return;
                //}

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
                            $('#divAddTestLocation').empty();
                            html = '';
                            return;
                        }

                        var location;

                        location = $(this).find('LocCode').text();
                        locPieces = $(this).find('LocatedPieces').text();

                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());

                        if (index == 0) {
                            $('#txtTotalPkg').val($(this).find('RemainingPieces').text());
                            $('#txtCommodity').val($(this).find('CommodityDesc').text());
                        }

                        var remainingPieces = $(this).find('RemainingPieces').text().substr(0, $(this).find('RemainingPieces').text().indexOf('/'));

                        if (remainingPieces == $(this).find('TotPieces').text())
                            $("#btnSubmit").attr("disabled", "disabled");

                        AddTableLocation(location, locPieces);
                    });

                    html += "</tbody></table>";

                    if (locPieces > 0)
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

function SaveShipmentLocation() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    //var TotalPIECESno = $('#txtTotalPkg').val();
    var Location = $('#txtLocation_0').val().toUpperCase();
    //var Area = $('#txtArea_0').val();
    //var Terminal = $('#txtTerminal_0').val();
    var BinnPckgs = $('#txtBinnPkgs_0').val();
    var UserName = window.localStorage.getItem("UserName")
    console.log("BinnPckgs" + BinnPckgs)
    console.log("AWBNo" + AWBNo)
    console.log("Location" + Location)
    console.log("ddlEWRno" + $('#ddlEWRno').find('option:selected').text())
    console.log("UserName" + UserName)

    if (AWBNo == '') {

        errmsg = "Please enter AWB number</br>";
        $.alert(errmsg);
        return;

    }
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

    //OldLocationPieces = TotalPIECESno.substr(((TotalPIECESno.length - 1) / 2) + 1);
    //OldLocationPieces = TotalPIECESno.substr(0, TotalPIECESno.indexOf('/'));
    //if (Number(BinnPckgs) > Number(OldLocationPieces)) {
    //    errmsg = "Binn packages cannot be more than total packages.</br>";
    //    $.alert(errmsg);
    //    return;
    //}

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "CreateShipmentLocation_PDA",
            data: JSON.stringify({
                'pi_strAWBNo': AWBNo, 'pi_strTerminal': '', 'pi_strArea': '',
                'pi_strLoc': Location, 'pi_strLocPieces': BinnPckgs,
                'pi_bitIsPalletWiseScan': 'false', 'pi_strEuroPalletNo': '', 'pi_strEWRNo': $('#ddlEWRno').find('option:selected').text(),
                'pi_strCreatedBy': window.localStorage.getItem("UserName"),
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

function clearALL() {
    $('#txtAWBNo').val('');
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');
    $('#txtLocation_0').val('');
    $('#txtArea_0').val('');
    $('#txtTerminal_0').val('');
    $('#txtBinnPkgs_0').val('');
    $('#divAddTestLocation').empty();
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#ddlEWRno').empty();
    $('#txtAWBNo').focus();
}

function clearBeforePopulate() {
    $('#txtLocation_0').val('');
    $('#txtArea_0').val('');
    $('#txtTerminal_0').val('');
    $('#txtBinnPkgs_0').val('');

    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtCommodity').val('');
    $('#txtTotalPkg').val('');

    $('#divAddTestLocation').empty();
    html = '';

}

function AddTableLocation(location, locpieces) {

    html += "<tr>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + location + "</td>";

    html += "<td height='30' onclick='GetMeetingByNo(abc)'style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

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
    str += '<input id="txtBinnPkgs_' + LocCount + '" class="form-control" type="number" onkeyup="ChkMaxLength(this, 4); NumberOnly(event);" style="text-align:right;" max="9999999">'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    str += '</div>'
    //$('#divAddLocation').append(str);
    //MSApp.execUnsafeLocalFunction(function () {
    //    $('#divAddLocation').append(str);
    //});
    debugger
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            $('#divAddLocation').append(str);
        });
    } else {
        $('#divAddLocation').append(str);
    }
}
function RemoveLocation(id) {
    //MSApp.execUnsafeLocalFunction(function () {
    //    $('#loc_' + id).remove();
    //});    
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            lnv.confirm({
                title: 'Delete',
                content: 'Are you want to delete location??',
                confirmHandler: function () {
                    $('#loc_' + id).remove();
                },
                cancelHandler: function () {
                    // cancel callback
                }
            })
        });
    } else {
        lnv.confirm({
            title: 'Delete',
            content: 'Are you want to delete location??',
            confirmHandler: function () {
                $('#loc_' + id).remove();
            },
            cancelHandler: function () {
                // cancel callback
            }
        })
    }
}