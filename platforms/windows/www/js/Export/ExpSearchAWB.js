//document.addEventListener("deviceready", GetCommodityList, false);

function GetCommodityList() {
    $.ajax({
        type: 'POST',
        url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/GetCommodityList",//113.193.225.52:8080
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

function SearchAWB() {
    var AWBNo = $('#txtAWBNo').val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var CompanyCode = window.localStorage.getItem("companyCode")
    var ShedCode = "3"
    
    var errmsg = "";
    if (AWBNo == null || AWBNo == "") {
        errmsg = errmsg + 'Enter AWB Number<br/>';
        $.alert(errmsg);
        $('#txtAWBNo').focus();
        clearALL();
    }
    else {
        if (AWBNo != null && AWBNo != "" && connectionStatus == "online") {
            $.ajax({
                type: 'POST',
                url: "http://localhost/GalaxyService/GalaxyService.asmx/GetAWBDetails",
                data: JSON.stringify({ 'AWBNo': AWBNo, 'CompanyCode': CompanyCode, 'ShedCode': ShedCode }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var str = response.d;
                    if (str != null && str != "") {
                        var arr = new Array();
                        arr = str.split(",");
                        if (arr[0] == 'Y') {
                            $('#txtOrigin').val(arr[2]);
                            $('#txtDestination').val(arr[3]);
                            $('#txtOffloadPoint').val(arr[4]);
                            $('#txtPkgAWB').val(arr[5]);
                            $('#txtGrWtAWB').val(arr[6]);
                            $('#txtPkgRCV').val(arr[7]);
                            $('#txtGrWtRCV').val(arr[8]);
                            $('#txtCommodity').val(arr[9]);
                            HideLoader();
                        }
                        else {
                            HideLoader();
                            errmsg = errmsg + 'AWB Number does not exists';
                            $.alert(errmsg);
                            $('#txtAWBNo').focus();
                            clearALL();
                        }
                    }
                    else {
                        HideLoader();
                        errmsg = errmsg + 'AWB Number does not exists';
                        $.alert(errmsg);
                        $('#txtAWBNo').focus();
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
    
}

    function clearALL() {
        $('#txtAWBNo').val('');
        $('#txtOrigin').val('');
        $('#txtDestination').val('');
        $('#txtOffloadPoint').val('');
        $('#txtPkgAWB').val('');
        $('#txtGrWtAWB').val('');
        $('#txtPkgRCV').val('');
        $('#txtGrWtRCV').val('');
        $('#ddlCommodity').val('0');
    }

    function ClearError(ID) {
        $("#"+ID).css("background-color", "#e7ffb5");
    }

