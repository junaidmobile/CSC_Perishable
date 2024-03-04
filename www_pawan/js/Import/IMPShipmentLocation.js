
function ShipmentStatusDetails() {
    var IGMNo = $('#txtIGMNo').val();
    var IGMYear = $("#txtYear").val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var CompanyCode = window.localStorage.getItem("companyCode")
    
    var errmsg = "";
    if (IGMNo == null || IGMNo == "") {
        alert('Enter IGM No.');
        $('#txtIGMNo').focus();
        clearALL();
        return;
    }
    if (IGMYear == null || IGMYear == "") {
        alert('Enter IGM Year');
        $('#txtYear').focus();
        clearALL();
        return;
    }

    if (IGMNo != null && IGMNo != "" && IGMYear != null && IGMYear != "" && connectionStatus == "online") {
            $.ajax({
                type: 'POST',
                url: WebServiceUrl+"GetFlightCheckDetails",
                data: JSON.stringify({ 'IGMNo': IGMNo, 'IGMYear': IGMYear, 'CompanyCode': CompanyCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
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
                            HideLoader();
                        }
                        else {
                            HideLoader();
                            errmsg = 'IGM details does not exists';
                            alert(errmsg);
                            $('#txtIGMNo').focus();
                            clearALL();
                        }
                    }
                    else {
                       // HideLoader();
                        errmsg = 'IGM details does not exists';
                        alert(errmsg);
                        $('#txtIGMNo').focus();
                        clearALL();
                    }
                },
                error: function (msg) {
                    HideLoader();
                    var r = jQuery.parseJSON(msg.responseText);
                    alert("Message: " + r.Message);
                    clearALL();
                }
            });
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
        $("#"+ID).css("background-color", "#e7ffb5");
    }
    function alertDismissed() {
    }