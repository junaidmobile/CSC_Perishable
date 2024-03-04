
var GHAserviceURL = window.localStorage.getItem("GHAserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var UserId = window.localStorage.getItem("UserID");
var flightSeqNo;
var UAWBRowId;
var UShipRowId;
var imgData;

$(function () {

    if (window.localStorage.getItem("RoleIMPDocUpload") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

    document.getElementById("cameraTakePicture").addEventListener
   ("click", cameraTakePicture);
});

function cameraTakePicture() {
    $("#btnUpload").removeAttr("disabled");
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        encodingType: Camera.EncodingType.JPEG,
        //allowEdit: true,
        //correctOrientation: true,
        targetWidth: 250,
        targetHeight: 250,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        //var image = document.getElementById('myImage');
        var data = "data:image/jpeg;base64," + imageData;
        imgData = imageData;
        $('#myImage').attr('src', data);
        $('#myImage').css('display', 'block');
        //SaveUploadFile(imageData);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function openFilePicker(selection) {

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        var imgdt = imageUri;
        // Do something

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}


function GetHAWBDetailsForMAWB() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    $('#myImage').css('display', 'none');

    var MAWBNo = $('#txtAWBNo').val();

    //if (MAWBNo != '' && MAWBNo.length != '11') {
    //    errmsg = "Please enter valid AWB No.";
    //    $.alert(errmsg);
    //    return;
    //}

    inputxml = '<Root><AWBNo>' + MAWBNo + '</AWBNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    $('#ddlHAWB').empty();
    $('#ddlFlightNo').empty();

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAserviceURL + "GetFileUploadDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
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

                $(xmlDoc).find('Table1').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlHAWB');
                    }

                    else {
                        var newOption = $('<option></option>');
                        newOption.val(0).text($(this).find('HouseNo').text());
                        newOption.appendTo('#ddlHAWB');
                    }
                });

                $(xmlDoc).find('Table2').each(function (index) {

                    if (index == 0) {
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlFlightNo');

                        flightSeqNo = $(this).find('FlightSeqNo').text();
                        UAWBRowId = $(this).find('UAWBRowId').text();
                        UShipRowId = $(this).find('UShipRowId').text();
                    }

                    var newOption = $('<option></option>');
                    newOption.val(0).text($(this).find('Flight').text());
                    newOption.appendTo('#ddlFlightNo');
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

function SaveUploadFile() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    //if (MAWBNo != '' && MAWBNo.length != '11') {
    //    errmsg = "Please enter valid AWB No.";
    //    $.alert(errmsg);
    //    return;
    //}

    if (imgData == "") {

        errmsg = "Some error occurred.</br>Please try again.";
        $.alert(errmsg);
        return;

    }

    inputxml = '<Root><FileName>TLogo</FileName><FileExtention>jpg</FileExtention><Description>' + $('#txtDescription').val() + '</Description><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UShipRowId>' + UShipRowId + '</UShipRowId><Type>I</Type><UAWBRowId>' + UAWBRowId + '</UAWBRowId><ULDId>-1</ULDId><AirportCity>' + AirportCity + '</AirportCity><UserId>' + UserId + '</UserId></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAserviceURL + "SaveFileUploadDetails",
            data: JSON.stringify({
                'InputXML': inputxml, 'InputImage': imgData,
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
                //$.alert(response.d);
                $.alert('Image uploaded successfully');
                //window.location.reload();
                $('#myImage').css('display', 'none');
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
    $('#ddlHAWB').empty();
    $('#ddlFlightNo').empty();
    $('#txtDescription').val('');
    $('#myImage').empty();
    $('#myImage').css('display', 'none');

}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


