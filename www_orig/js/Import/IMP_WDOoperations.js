

var CargoWorksServiceURL = window.localStorage.getItem("CargoWorksServiceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var CompanyCode = window.localStorage.getItem("companyCode");
var SHEDCODE = window.localStorage.getItem("SHED_CODE");
var WDOid;

function GetWDOdetails() {

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var RotationNo = $('#txtRotationNo').val();
    
    if (RotationNo == "") {
        //errmsg = "Please enter valid Flight No.";
        //$.alert(errmsg);
        return;
    }     
    

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "GetRNoDetails",
            data: JSON.stringify({
                'strRNo': RotationNo,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table').each(function (index) {

                    WDOid = $(this).find('WDO_DT').text();
                    var WDONo = $(this).find('WDO_NO').text();
                    var AWBNo = $(this).find('AWB_PREFIX').text() + $(this).find('AWB_NUMBER').text();
                    var HAWBNo = $(this).find('HOUSE_NUMBER').text();
                    var Location = $(this).find('WAREHOUSE_LOCATION_CODE').text();

                    $('#txtWDONo').val(WDONo);
                    $('#txtAWBNo').val(AWBNo);
                    $('#txtHAWBNo').val(HAWBNo);
                    $('#txtLocation').val(Location);
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

    var RotationNo = $(this).find('txtRotationNo').text();
    var status;

    if (RotationNo == "") {
        errmsg = "Please enter rotation no.";
        $.alert(errmsg);
        return;
    }

    if (document.getElementById('rdoDeliver').checked) {
        status = 'R';
    }
    if (document.getElementById('rdoOOW').checked) {
        status = 'O';
    }
    if (document.getElementById('rdoCR').checked) {
        status = 'C';
    }    

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: CargoWorksServiceURL + "UpdateRNoDetails",
            data: JSON.stringify({
                'strWDOId': WDOid, 'strStatusKey': status, 'strCompanyCode': CompanyCode,
                'strUserID': UserId, 'strWitnessedBy': UserId, 'strId': '',
                'strCollectorsName': '', 'imgSignAgent': '',
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

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


