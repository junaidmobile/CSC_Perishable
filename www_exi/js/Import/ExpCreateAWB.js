document.addEventListener("deviceready", GetCommodityList, false);

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

function SaveAWB() {
    
    var AWBNo = $('#txtAWBNo').val();
    var origin = $('#txtOrigin').val();
    var destination = $('#txtDestination').val();
    var offloadpoint = $('#txtOffloadPoint').val();
    var AWBpkg = $('#txtPkgAWB').val();
    var AWBGrWt = $('#txtGrWtAWB').val();
    var RCVPkg = $('#txtPkgRCV').val();
    var RCVGrWt = $('#txtGrWtRCV').val();
    //var ddlUnit = $('#ddlUnit').val();
    var ddlCommodity = $('#ddlCommodity').val();
    var CommodityText = $("#ddlCommodity option:selected").text();
    var ErrorMsg = "";

    if (AWBNo == null || AWBNo == "") {
        ErrorMsg = ErrorMsg + "Please enter AWB No.<br/>";
        $("#txtAWBNo").css("background-color", "#ffcccc");

    }
    if (AWBpkg == null || AWBpkg == "") {
        ErrorMsg = ErrorMsg + "Please enter No. of Pkgs.<br/>";
        $("#txtPkgAWB").css("background-color", "#ffcccc");

    }
    if (AWBGrWt == null || AWBGrWt == "") {
        ErrorMsg = ErrorMsg + "Please enter Gross Wt.<br/>";
        $("#txtGrWtAWB").css("background-color", "#ffcccc");

    }

    if (ErrorMsg.length > 0) {
        HideLoader();
        lnv.alert({
            title: 'Alert',
            content: ErrorMsg,
            alertBtnText: 'Ok',
            alertHandler: function () {
            }
        })
    }
    else {
        alert(window.localStorage.getItem("companyCode"));
        var strAWBDetails = "";
        strAWBDetails = strAWBDetails + "<AWBDtl>";
        strAWBDetails = strAWBDetails + "<AWB AWBNo='";
        strAWBDetails = strAWBDetails + AWBNo.trim();
        strAWBDetails = strAWBDetails + "' HAWBNo='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' TAWBPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' TAWBGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SExpPkgs='";
        strAWBDetails = strAWBDetails + AWBpkg.trim();
        strAWBDetails = strAWBDetails + "' SExpGwt ='";
        strAWBDetails = strAWBDetails + AWBGrWt.trim();
        strAWBDetails = strAWBDetails + "' SRcvPkgs='";
        strAWBDetails = strAWBDetails + RCVPkg.trim();
        strAWBDetails = strAWBDetails + "' SRcvGwt ='";
        strAWBDetails = strAWBDetails + RCVGrWt.trim();
        strAWBDetails = strAWBDetails + "' IsMaster='";
        strAWBDetails = strAWBDetails + "1";
        strAWBDetails = strAWBDetails + "' FltNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' FltDate='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Origin ='";
        strAWBDetails = strAWBDetails + origin.trim();
        strAWBDetails = strAWBDetails + "' Dest ='";
        strAWBDetails = strAWBDetails + destination.trim();
        strAWBDetails = strAWBDetails + "' OffPt ='";
        strAWBDetails = strAWBDetails + offloadpoint.trim();
        strAWBDetails = strAWBDetails + "' ULDNo ='";
        strAWBDetails = strAWBDetails + "";
        strAWBDetails = strAWBDetails + "' Com ='";
        strAWBDetails = strAWBDetails + ddlCommodity;
        strAWBDetails = strAWBDetails + "' Descr ='";
        strAWBDetails = strAWBDetails + CommodityText.trim();
        strAWBDetails = strAWBDetails + "'/>";
        strAWBDetails = strAWBDetails + "</AWBDtl>";
        var companycode = window.localStorage.getItem("companyCode");
        var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
        var ShedCode = window.localStorage.getItem("SHED_CODE");
        var UserId = window.localStorage.getItem("UserID");
        $.ajax({
            type: 'POST',
            url: "http://113.193.225.52:8080/GalaxyService/GalaxyService.asmx/PDAExpCreateAWB",//113.193.225.52:8080
            data: JSON.stringify({ 'strAWBDetails': strAWBDetails, 'strComapnyCode': companycode, 'strAirportCity': AirportCity, 'strShedCode': "E", 'strUserId': UserId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var str = response.d;
                if (str == 'AWB saved successfully.') {
                    lnv.alert({
                        title: 'Success',
                        content: "AWB saved successfully.",
                        alertBtnText: 'Ok',
                        alertHandler: function () {

                            clearALL();

                        }
                    })
                }
                else {
                    lnv.alert({
                        title: 'Alert',
                        content: str,
                        alertBtnText: 'Ok',
                        alertHandler: function () {
                        }
                    })
                }
            },
            error: function (msg) {
                var r = jQuery.parseJSON(msg.responseText);
                alert("Message: " + r.Message);
            }
        });
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

