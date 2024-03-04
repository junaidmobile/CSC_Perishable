var ClickedDiv_EXP = "";

$(function () {

    if (window.localStorage.getItem("RoleExpVehicleTracking") == '0') {
        window.location.href = 'EXP_Dashboard.html';
    }    

});

function divClick(divid) {
    var i = parseInt($('#mainDiv').children().length);
    //localStorage.setItem("ClickedDiv", $(divid).attr('id').toString());
    ClickedDiv_EXP = $(divid).attr('id').toString();

    ScanningLoc();

    //for (var j = 0; j < i; j++) {
    //    if ($($('#mainDiv').children()[j]).attr('id').toString() == $(divid).attr('id').toString()) {
    //        $('#' + divid.id).css('background-color', '#abc823');
    //        $('#' + divid.id).find('label').css('color', 'white');
    //    }
    //    else {
    //        $('#' + $($('#mainDiv').children()[j]).attr('id')).css('background-color', 'white');
    //        $('#' + $($('#mainDiv').children()[j]).attr('id')).find('label').css('color', '#337ab7');
    //    }
    //}

    
}
function ScanningLoc() {
    if (ClickedDiv_EXP != "") {
        window.location.href = "EXP_ScanningLocation.html?ClickedDiv_EXP=" + ClickedDiv_EXP;
    }
    else {
        $.alert("Please select scanning location");
    }
}