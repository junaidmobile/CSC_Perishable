var ClickedDiv_IMP = "";
function divClick(divid) {
    var i = parseInt($('#mainDiv').children().length);
    //localStorage.setItem("ClickedDiv", $(divid).attr('id').toString());
    ClickedDiv_IMP = $(divid).attr('id').toString();
    for (var j = 0; j < i; j++) {
        if ($($('#mainDiv').children()[j]).attr('id').toString() == $(divid).attr('id').toString()) {
            $('#' + divid.id).css('background-color', '#abc823');
            $('#' + divid.id).find('label').css('color', 'white');
        }
        else {
            $('#' + $($('#mainDiv').children()[j]).attr('id')).css('background-color', 'white');
            $('#' + $($('#mainDiv').children()[j]).attr('id')).find('label').css('color', '#337ab7');
        }
    }        
}
function ScanningLoc() {

    if (ClickedDiv_IMP != "") {
        window.location.href = "IMP_ScanningLocation.html?ClickedDiv_IMP=" + ClickedDiv_IMP;
    }
    else {
        $.alert("Please select scanning location");
    }
}