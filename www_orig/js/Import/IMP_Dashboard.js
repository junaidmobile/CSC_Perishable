(function () {
    document.addEventListener('backbutton', onBackKeyDown, false);
    //document.addEventListener('deviceready', DropDown, false);

    //if (window.localStorage.getItem("RoleExpVehicleTracking") == '0')
    //    $("#divVehicleTracking").css("display", "none");
    //if (window.localStorage.getItem("RoleExpVehicleTracking") == '0')
    //    $("#divVehicleTracking").css("display", "none");
}
)();

function onBackKeyDown() {
    window.location.href = 'GalaxyHome.html';
}

function RedirectPage(pagename) {
    
    if (pagename == 'IMP_FlightCheck.html' && window.localStorage.getItem("RoleIMPFlightCheck") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_FlightCheck.html')
        window.location.href = pagename;

    if (pagename == 'IMP_Segregation.html' && window.localStorage.getItem("RoleIMPSegregation") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_Segregation.html')
        window.location.href = pagename;

    if (pagename == 'IMP_Binning.html' && window.localStorage.getItem("RoleIMPBinning") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_Binning.html')
        window.location.href = pagename;

    if (pagename == 'IMP_InternalMovement.html' && window.localStorage.getItem("RoleIMPIntlMvmt") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_InternalMovement.html')
        window.location.href = pagename;

    if (pagename == 'IMP_ForwardingBackwarding.html' && window.localStorage.getItem("RoleIMPFwdBkd") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_ForwardingBackwarding.html')
        window.location.href = pagename;

    if (pagename == 'IMP_FinalDelivery.html' && window.localStorage.getItem("RoleIMPFinalDelivery") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_FinalDelivery.html')
        window.location.href = pagename;

    if (pagename == 'IMP_ShipmentStatus.html' && window.localStorage.getItem("RoleIMPImportQuery") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_ShipmentStatus.html')
        window.location.href = pagename;

    if (pagename == 'IMP_DocumentUpload.html' && window.localStorage.getItem("RoleIMPDocUpload") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'IMP_DocumentUpload.html')
        window.location.href = pagename;

}