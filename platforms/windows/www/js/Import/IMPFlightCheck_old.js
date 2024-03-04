//document.addEventListener("deviceready", GetCommodityList, false);

function GetCommodityList() {
    $.ajax({
        type: 'POST',
        url: WebServiceUrl + "GetCommodityList",//113.193.225.52:8080
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

function FlightCheckDetails() {
    ClearFields();
    var IGMNo = $('#txtIGMNo').val();
    var IGMYear = $("#txtYear").val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var CompanyCode = window.localStorage.getItem("companyCode")

    var errmsg = "";
    if (IGMNo == null || IGMNo == "") {
        //alert('Enter IGM No.');
        //$('#txtIGMNo').focus();
        //clearALL();
        //return;
        errmsg = "Enter IGM No.</br>";
    }
    if (IGMYear == null || IGMYear == "") {
        //alert('Enter IGM Year');
        //$('#txtYear').focus();
        //clearALL();
        //return;
        errmsg = errmsg + "Enter IGM Year.</br>";
    }
    if (IGMYear.length < 4 && IGMYear.length > 0) {
        errmsg = errmsg + "Please Enter Valid Year</br>";
    }

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: WebServiceUrl + "GetFlightCheckDetails",
            data: JSON.stringify({ 'IGMNo': IGMNo, 'IGMYear': IGMYear, 'CompanyCode': CompanyCode }),
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
                    var arr = new Array();
                    arr = str.split(",");
                    if (arr[0] == 'Y') {
                        $('#txtFlightNo').val(arr[3]);
                        $('#txtFlightDate').val(arr[4]);
                        $('#txtTotCnts').val(arr[5]);
                        $('#txtManiPieces').val(arr[6]);
                        $('#txtReceivePieces').val(arr[7]);
                        $('#txtManiGrWt').val(arr[8]);
                        $('#txtReceiveGrWt').val(arr[9]);
                        $('#txtShortPieces').val(arr[10]);
                        $('#txtExcessPieces').val(arr[11]);
                        $('#txtDamagePieces').val(arr[12]);
                    }
                    else {
                        errmsg = 'IGM details does not exists';
                        $.alert(errmsg);
                        $('#txtIGMNo').focus();
                    }
                }
                else {
                    errmsg = 'IGM details does not exists';
                    $.alert(errmsg);
                    $('#txtIGMNo').focus();
                }
            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
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

function clearALL() {
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
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}

