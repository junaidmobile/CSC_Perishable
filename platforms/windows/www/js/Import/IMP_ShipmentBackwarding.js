
var CMSserviceURL = window.localStorage.getItem("CMSserviceURL");

$(function () {

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: "CountryDetails.asmx/LoadCountry",
        url: CMSserviceURL + "GetImpExaminationDetails_PDA",
        data: "{}",
        dataType: "json",
        success: function (Result) {
            Result = Result.d;
            var xmlDoc = $.parseXML(Result);

            $(xmlDoc).find('Table').each(function () {

                var LocationId;
                var ExamLocations;
                LocationId = $(this).find('LocationId').text();
                ExamLocations = $(this).find('ExamLocations').text();

                var newOption = $('<option></option>');
                newOption.val(LocationId).text(ExamLocations);
                newOption.appendTo('#ddlExamLoc');
            });

        },
        error: function (Result) {
            alert(Result.responseText);
        }
    });

});

var IGMNo;
var TotalPieces;
var currentLoc;
var HAWBid;

function GetShipmentBackwordingDetails() {

    clearBeforePopulate();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    $('#ddlExamLoc').val('0');
    var BCDate;
    var BCNo = $('#txtBCNo').val();
    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $('#txtHAWBNo').val();
    var param1;
    var param2;
    var param3;
    var param4 = "1";

    if ($('#txtBCDate').val() == "" || BCNo == "") {
        if (AWBNo == "" || HAWBNo == "") {
            errmsg = "Please enter BC Date & BC No. or </br> AWB No. & HAWB No.</br>";
            $.alert(errmsg);
            return;
        }

        if (AWBNo.length != '11') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            return;
        }
    }

    if ($('#txtBCDate').val().length > 0) {
        var formattedDate = new Date($('#txtBCDate').val());
        var d = formattedDate.getDate();
        if (d.toString().length < Number(2))
            d = '0' + d;
        var m = formattedDate.getMonth();
        m += 1;  // JavaScript months are 0-11
        if (m.toString().length < Number(2))
            m = '0' + m;
        var y = formattedDate.getFullYear();

        BCDate = d + "/" + m + "/" + y;
    }

    if (BCDate.length > 0 && BCNo.length > 0) {
        param1 = BCDate;
        param2 = BCNo;
        param3 = 'true';
    }

    if (AWBNo.length > 0 && HAWBNo.length > 0) {
        param1 = AWBNo;
        param2 = HAWBNo;
        param3 = 'false';
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: CMSserviceURL + "GetImpForwardingForExaminationDetails_PDA",
            data: JSON.stringify({ 'pi_strParam1': param1, 'pi_strParam2': param2, 'pi_blnIsBC': param3, 'po_strOutMsg': param4 }),
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
                        if (index == 0) {

                            if ($(str).find('ExamPieces').text() != '' && $(this).find('ExamLoc').text() != '') {
                                $('#txtExamPkgs').val($(this).find('ExamPieces').text());
                                $('#txtLoaderNo').val($(this).find('LoaderNo').text());
                                $('#txtAWBNo').val($(this).find('MawbNo').text());
                                $('#txtHAWBNo').val($(this).find('HawbNo').text());
                                $('#txtBCNo').val($(this).find('ReceiptNo').text().slice(-4));

                                //var theText = $(this).find('ExamLoc').text();
                                //$("#ddlExamLoc option:contains(" + theText + ")").attr('selected', 'selected');

                                IGMNo = $(this).find('IGMNo').text();
                                TotalPieces = $(this).find('ExamPieces').text();
                                currentLoc = $(this).find('ExamLoc').text();
                                HAWBid = $(this).find('HAWBId').text();
                            }
                            else {
                                errmsg = 'Exam Pieces & Exam Location for this shipment not found';
                                $.alert(errmsg);
                            }
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
                //var r = jQuery.parseJSON(msg.responseText);
                var r = 'Shipment details not found';
                $.alert(r);
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

function SaveBackwardDetails() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var BCDate = $('#txtBCDate').val();
    var BCNo = $('#txtBCNo').val();
    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $('#txtHAWBNo').val();
    var LODERNo = $('#txtLoaderNo').val();
    var PIECESno = $('#txtExamPkgs').val();

    if (BCDate == "" || BCNo == "" || AWBNo == "" || LODERNo == "" || PIECESno == "") {

        errmsg = "Please enter all the required fields.</br>";
        $.alert(errmsg);
        return;
    }

    if (PIECESno > TotalPieces) {
        errmsg = "Exam pieces cannot be more than total pieces.</br>";
        $.alert(errmsg);
        return;
    }

    if ($('#ddlStatus').val() == '0') {
        errmsg = "Please select status.</br>";
        $.alert(errmsg);
        return;
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CMSserviceURL + "SaveImpBackwardingForExaminationDetails_PDA",
            data: JSON.stringify({
                'pi_intHAWBId': HAWBid, 'pi_strBCNo': $('#txtBCNo').val(),
                'pi_strLoaderId': '0', 'pi_strExamStatus': $("#ddlStatus option:selected").text(), 'pi_struserId': window.localStorage.getItem("UserID"),
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
    $('#txtBCNo').val('');
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtExamPkgs').val('');
    $('#txtLoaderNo').val('');
    $('#ddlExamLoc').val('0');
}

function clearBeforePopulate() {
    $('#txtExamPkgs').val('');
    $('#txtLoaderNo').val('');
    $('#ddlExamLoc').val('0');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

//$(function () {
//    $("#txtBCDate").datepicker({
//        dateFormat: "dd/mm/yy"
//    });
//    $("#txtBCDate").datepicker().datepicker("setDate", new Date());
//});
