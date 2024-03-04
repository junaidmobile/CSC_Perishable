
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var flightSeqNo;
var ULDSeqNo;
var SavedULDSeqNo;
var isFoundCargo;
var flightPrefix;
var flightNo;
var flightDate;
var selectedRowULDNo;
var selectedRowAWBNo;
var selectedRowHAWBNo;
var selectedRowULDid;
var xmlDamageType, HAWBLists = [];


var showAll = 'N';

$(function () {
    flightPrefix = amplify.store("flightPrefix");
    flightNo = amplify.store("flightNo");
    flightDisplayDate = amplify.store("flightDisplayDate");
    flightDate = amplify.store("flightDate");

    selectedRowULDNo = amplify.store("selectedRowULDNo");
    selectedRowAWBNo = amplify.store("selectedRowAWBNo");
    selectedRowHAWBNo = amplify.store("selectedRowHAWBNo");
    selectedRowULDid = amplify.store("selectedRowULDid");

    if (selectedRowULDNo != '') {
        //showAll = 'Y';
        chkShowAll.checked = true;
    }

    $('#txtFltNo').val(flightPrefix + flightNo);
    $('#txtFltDate').val(flightDisplayDate);
    flightSeqNo = amplify.store("flightSeqNo");
    if (flightSeqNo != "") {
        GetULDDetails();
    }



});

function BacktoFlightCheck() {
    // set urs global variable here
    //amplify.store("flightSeqNo", flightSeqNo)
    amplify.store("flightPrefix", flightPrefix)
    amplify.store("flightNo", flightNo)
    amplify.store("flightDate", flightDate)
    window.location.href = 'IMP_FlightCheck.html';
}

function GetULDDetails() {

    clearPiecesInfo();



    $('#ddlULDNo').empty();
    $('#ddlDamageType').empty();

    $('#ddlAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlAWBNo');

    $('#ddlHAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWBNo');

    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var flightCheckUldSeqNo = '';

    if (selectedRowULDid > Number(0))
        flightCheckUldSeqNo = selectedRowULDid;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + flightCheckUldSeqNo + '</UlDSeqNo><AWBId></AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                xmlDamageType = xmlDoc;

                $(xmlDoc).find('Table1').each(function (index) {

                    var ULDId;
                    var ULD;
                    ULDId = $(this).find('ULDId').text();
                    ULD = $(this).find('ULD').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    if (selectedRowULDNo != '') {
                        $("#ddlULDNo option").each(function () {
                            if ($(this).text() == selectedRowULDNo) {
                                $(this).attr('selected', 'selected');
                                var selectedMawbId = $(this).val();

                                GetHAWBDetails(selectedMawbId);
                            }
                        });

                    }

                    if (index == 0) {
                        ULDSeqNo = ULDId;
                    }

                    amplify.store("flightSeqNo", "")
                    amplify.store("flightPrefix", "")
                    amplify.store("flightNo", "")
                    amplify.store("flightDate", "")
                    amplify.store("flightDisplayDate", "")

                    amplify.store("selectedRowULDNo", "")
                    amplify.store("selectedRowAWBNo", "")
                    amplify.store("selectedRowHAWBNo", "")
                    amplify.store("selectedRowULDid", "")

                });



                $("#ddlULDNo option").each(function () {
                    if ($(this).val() == SavedULDSeqNo) {
                        $(this).attr('selected', 'selected');
                    }
                });

                $(xmlDoc).find('Table2').each(function () {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                    var a = new Array();
                    $("#ddlAWBNo").children("option").each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });

                    if (selectedRowAWBNo != '') {
                        $("#ddlAWBNo option").each(function () {
                            if ($(this).text() == selectedRowAWBNo) {
                                $(this).attr('selected', 'selected');
                                var selectedMawbId = $(this).val();

                                GetHAWBDetails(selectedMawbId);
                            }
                        });
                    }

                });

                $(xmlDoc).find('Table5').each(function () {

                    var AWBId;
                    var AWBNo;
                    DamageCode = $(this).find('DamageCode').text();
                    DamageType = $(this).find('DamageType').text();

                    var newOption = $('<option></option>');
                    newOption.val(DamageCode).text(DamageType);
                    newOption.appendTo('#ddlDamageType');

                });
                var selected_ddlDamageType = window.localStorage.getItem('selected_ddlDamageType');
                SelectElement("ddlDamageType", selected_ddlDamageType);
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

function GetAWBDetailsForULD(ULDid) {

    $("#hawbLists").val('');
    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();

    ULDSeqNo = ULDid;

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDid + '</UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $(ddlAWBNo).empty();
                var newOption = $('<option></option>');
                newOption.val(0).text('Select');
                newOption.appendTo('#ddlAWBNo');
                $(xmlDoc).find('Table2').each(function (index) {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    if (index == 0 && $("#ddlAWBNo").val() != "0") {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlAWBNo');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                    var a = new Array();
                    $("#ddlAWBNo").children("option").each(function (x) {
                        test = false;
                        b = a[x] = $(this).text();
                        for (i = 0; i < a.length - 1; i++) {
                            if (b == a[i]) test = true;
                        }
                        if (test) $(this).remove();
                    });

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

function UpdateAWBDetails() {

    var isOverride = 'N';

    SavedULDSeqNo = '';

    var selectedUld;
    var selectedAWB;
    var selectedHAWB;

    selectedUld = $('#ddlULDNo').find('option:selected').text();
    selectedAWB = $('#ddlAWBNo').find('option:selected').text();
    selectedHAWB = $('#ddlHAWBNo').find('option:selected').text();

    if (document.getElementById('chkFoundCgo').checked) {

        if ($('#txtFoundMAWB').val() == "" && $('#txtFoundHAWB').val() == "") {
            errmsg = "Please enter found cargo MAWB/HAWB No.";
            $.alert(errmsg);
            return;
        }

        if ($('#txtFoundPkgs').val() == "") {
            errmsg = "Please enter found pkgs";
            $.alert(errmsg);
            return;
        }

        if ($('#txtFoundPkgsWt').val() == "") {
            errmsg = "Please enter found pkgs wt.";
            $.alert(errmsg);
            return;
        }
    }
    else {
        if ($('#txtArrivedPkgs').val() == "" && $('#txtDamagePkgs').val() == "") {
            errmsg = "Please enter Arrived pkgs";
            $.alert(errmsg);
            return;
        }
    }

    if (document.getElementById('chkModify').checked)
        isOverride = 'Y';
    else
        isoverride = 'N';

    if ($('#txtDamagePkgs').val() != '' && $('#txtDamageWt').val() == '') {
        errmsg = "Please enter damage weight";
        $.alert(errmsg);
        return;
    }

    if ($('#txtDamagePkgs').val() != '' && $('#ddlDamageType').find('option:selected').text() == 'Select') {
        errmsg = "Please select damage type";
        $.alert(errmsg);
        return;
    }

    var inputXML;
    var serviceName;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (isFoundCargo == true) {
        //inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBNO>MLM</AWBNO><HAWBNO></HAWBNO><NPR>' + $('#txtFoundPkgs').val() + '</NPR><WtRec>' + $('#txtFoundPkgsWt').val() + '</WtRec><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt></DMGWt><DMGCode></DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
        inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBNO>' + $('#txtFoundMAWB').val() + '</AWBNO><HAWBNO>' + $('#txtFoundHAWB').val() + '</HAWBNO><NPR>' + $('#txtFoundPkgs').val() + '</NPR><WtRec>' + $('#txtFoundPkgsWt').val() + '</WtRec><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt>' + $('#txtDamageWt').val() + '</DMGWt><DMGCode>' + $('#ddlDamageType').find('option:selected').val() + '</DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
        serviceName = 'SaveImportFoundCargoDetails';
    }
    else {
         inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBId>' + $('#ddlAWBNo').find('option:selected').val() + '</AWBId><HAWBId>' + $('#ddlHAWBNo').find('option:selected').val() + '</HAWBId><NPR>' + $('#txtArrivedPkgs').val() + '</NPR><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt>' + $('#txtDamageWt').val() + '</DMGWt><DMGCode></DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity><IsOverride>' + isOverride + '</IsOverride></Root>';
        //inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><ID>' + $('#ddlAWBNo').find('option:selected').val() + '</ID><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
        console.log(inputXML)
        serviceName = 'SaveImportMaifestDetails';
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + serviceName,
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
                //setting select value in local storage
                var e = document.getElementById("ddlDamageType");
                // var ddlDamageType = e.options[e.selectedIndex].value;

                // var e = document.getElementById("ddlViewBy");
                // var ddlDamageType = e.options[e.selectedIndex].text;
                // console.log("ddlDamageType selected ", ddlDamageType);
                window.localStorage.setItem('selected_ddlDamageType', ddlDamageType);
                $(xmlDoc).find('Table').each(function () {

                    if ($(this).find('StrMessage').text() != '')
                        $.alert($(this).find('StrMessage').text());
                    else
                        $.alert('Success');

                    GetAWBDetailsForULD($('#ddlULDNo').val())
                    // GetHAWBDetails($('#ddlAWBNo').val())
                    var ULDVal = $('#ddlULDNo').val();
                    // GetHAWBDetails($('#ddlAWBNo').val())
                    $('#ddlAWBNo').empty();
                   // GetULDDetails();
                });

                $('#ddlAWBNo').val(0);
                $('#ddlHAWBNo').val(0);
                $('#txtAwbNo').val('');
                $('#txtFoundMAWB').val('')
                $('#txtFoundHAWB').val('');
                $('#txtMnifestedPkg').val('');
                $('#txtArrivedPkgs').val('');
                $('#txtDamagePkgs').val('');
                $('#txtDamageWt').val('');
                $('#ddlDamageType').val(0);
                $('#txtFoundPkgs').val('');
                $('#txtFoundPkgsWt').val('');

                GetULDDetails();

                SavedULDSeqNo = ULDSeqNo;

                //$("#ddlULDNo option").each(function () {
                //    if ($(this).val() == ULDSeqNo) {
                //        $(this).attr('selected', 'selected');
                //    }
                //});                

                //$('#ddlULDNo option[value="742"]').attr('selected', true)
                //if (flightSeqNo != "") {
                //    GetULDDetails();
                //}

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function SelectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

function GetHAWBDetails(AWBid) {

    HAWBLists = [];
    $("#hawbLists").val('');
    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();

    var UldId = $("#ddlULDNo option:selected").val();

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBid + '</AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(ddlHAWBNo).empty();
                var newOption = $('<option></option>');
                newOption.val('0').text('Select');
                newOption.appendTo('#ddlHAWBNo');

                var houseCount = 0;

                $(xmlDoc).find('Table3').each(function (index) {
                    houseCount++;
                });


                $(xmlDoc).find('Table3').each(function (index) {

                    var HAWBId;
                    var HAWBNo;
                    HAWBId = $(this).find('HAWBID').text();
                    HAWBNo = $(this).find('HouseNo').text();
                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNo);
                    newOption.appendTo('#ddlHAWBNo');

                    HAWBLists.push({ 'value': HAWBId, 'label': HAWBNo })

                    if (selectedRowHAWBNo != '') {
                        //TODO :Change selectedRowHAWBNo to  $("#hawbLists").val()
                        $("#ddlHAWBNo option").each(function () {
                            if ($(this).text() == selectedRowHAWBNo) {
                                $(this).attr('selected', 'selected');
                                var selectedHawbId = $(this).val();

                                GetHAWBLevelPiecesDetails(selectedHawbId);
                            }
                        });
                    }

                });

                if (HAWBLists.length > 0) {
                    $("#hawbLists").autocomplete({
                        minLength: 0,
                        source: HAWBLists,
                        focus: function (event, ui) {
                            // if (this.value == "") {
                            //     $(this).autocomplete("search");
                            // }
                            $("#hawbLists").val(ui.item.label);
                            return false;
                        },
                        select: function (event, ui) {
                            $("#hawbLists").val(ui.item.label);
                            $('#ddlHAWBNo').val(ui.item.value)
                            GetHAWBLevelPiecesDetails($('#ddlHAWBNo').val());
                            // $("#project-id").val(ui.item.label);
                            return false;
                        }
                    })
                    $("#hawbLists").focus(function () {
                        $(this).autocomplete("search", $(this).val());
                    });
                }


                $(xmlDoc).find('Table4').each(function () {

                    if (houseCount == 0) {
                        $('#txtMnifestedPkg').val($(this).find('NPX').text());

                        $('#txtReceivedPkgs').val($(this).find('NPR').text());
                        $('#txtRemainingPkgs').val($(this).find('RemNOP').text());
                    }

                    if ($(this).find('DmgPkgs').text() != 0) {
                        $('#txtDamagePkgsView').val($(this).find('DmgPkgs').text());
                        $('#txtDamageWtView').val($(this).find('DmgWt').text());
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

function GetHAWBLevelPiecesDetails(HAWBid) {

    if (chkShowAll.checked)
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();

    var AWBId = $("#ddlAWBNo option:selected").val();

    var UldId = $("#ddlULDNo option:selected").val();

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBid + '</AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = ' <Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBId + '</AWBId><HAWBId>' + HAWBid + '</HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "GetImportHouseDetails",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table4').each(function () {

                    $('#txtMnifestedPkg').val($(this).find('NPX').text());
                    $('#txtReceivedPkgs').val($(this).find('NPR').text());
                    $('#txtRemainingPkgs').val($(this).find('RemNOP').text());

                    $('#txtDamagePkgsView').val($(this).find('DmgPkgs').text());
                    $('#txtDamageWtView').val($(this).find('DmgWt').text());

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

function EnableFoundCargo() {
    clearALL();
    if (document.getElementById('chkFoundCgo').checked) {
        $('#divNormalCargo').hide();
        $('#divFoundCargo').show();
        $('#foundCargoHint').show();
        $('#divArrivedPkgs').hide();
        $('#divFoundCgoDetails').show();
        //$('#ddlDamageType').val(0);
        isFoundCargo = true;

        $('#ddlDamageType').empty();
        $(xmlDamageType).find('Table5').each(function () {

            var AWBId;
            var AWBNo;
            DamageCode = $(this).find('DamageCode').text();
            DamageType = $(this).find('DamageType').text();

            var newOption = $('<option></option>');
            newOption.val(DamageCode).text(DamageType);
            newOption.appendTo('#ddlDamageType');

        });

    }
    else {
        $('#divNormalCargo').show();
        $('#divFoundCargo').hide();
        $('#foundCargoHint').hide();
        $('#divArrivedPkgs').show();
        $('#divFoundCgoDetails').hide();
        //$('#ddlDamageType').val(0);
        isFoundCargo = '';

        $('#ddlDamageType').empty();
        $(xmlDamageType).find('Table5').each(function () {

            var AWBId;
            var AWBNo;
            DamageCode = $(this).find('DamageCode').text();
            DamageType = $(this).find('DamageType').text();

            var newOption = $('<option></option>');
            newOption.val(DamageCode).text(DamageType);
            newOption.appendTo('#ddlDamageType');

        });
    }
}

function clearALL() {
    $('#txtAwbNo').val('');
    $('#txtFoundMAWB').val('')
    $('#txtFoundHAWB').val('');
    $('#txtMnifestedPkg').val('');
    $('#txtArrivedPkgs').val('');
    $('#txtDamagePkgs').val('');
    $('#txtDamageWt').val('');
    $('#ddlDamageType').val(0);
    $('#txtFoundPkgs').val('');
    $('#txtFoundPkgsWt').val('');
    $('#ddlAWBNo').val(0);
    $('#ddlHAWBNo').val(0);
    $('#txtReceivedPkgs').val('');
    $('#txtRemainingPkgs').val('');
    $('#txtDamagePkgsView').val('');
    $('#txtDamageWtView').val('');
    $("#hawbLists").val('');
}

function ShowALLRefresh() {
    clearALL();

    GetULDDetails()
}

function clearPiecesInfo() {
    //  $("#ddlULDNo").trigger('change');
    // GetAWBDetailsForULD($('#ddlULDNo').val())
    $('#txtMnifestedPkg').val('');
    $('#txtArrivedPkgs').val('');
    $('#txtFoundPkgs').val('');
    $('#txtFoundPkgsWt').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtRemainingPkgs').val('');
    $('#txtDamagePkgsView').val('');
    $('#txtDamageWtView').val('');
    $('#txtDamagePkgs').val('');
    $('#txtDamageWt').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


