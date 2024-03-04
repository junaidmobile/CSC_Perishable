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

    if (pagename == 'EXP_ScanningLocationMain.html' && window.localStorage.getItem("RoleExpVehicleTracking") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_ScanningLocationMain.html')
        window.location.href = pagename;

    if (pagename == 'EXP_EuroPalletAcceptance.html?TDG=TDG' && window.localStorage.getItem("RoleExpTDG") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_EuroPalletAcceptance.html?TDG=TDG')
        window.location.href = pagename;

    if (pagename == 'EXP_Binning.html' && window.localStorage.getItem("RoleExpBinning") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_Binning.html')
        window.location.href = pagename;

    if (pagename == 'EXP_MomentofShipment.html' && window.localStorage.getItem("RoleExpIntlMvmt") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_MomentofShipment.html')
        window.location.href = pagename;

    if (pagename == 'EXP_Unitization.html' && window.localStorage.getItem("RoleExpUnitization") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_Unitization.html')
        window.location.href = pagename;

    if (pagename == 'EXP_AirsideRelease.html' && window.localStorage.getItem("RoleExpAirsideRelease") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_AirsideRelease.html')
        window.location.href = pagename;

    if (pagename == 'EXP_ExportQuery.html' && window.localStorage.getItem("RoleExpExportsQuery") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_ExportQuery.html')
        window.location.href = pagename;

    if (pagename == 'EXP_VCTCheck.html' && window.localStorage.getItem("RoleExpVCTCheck") == '0') {
        $.alert('You are not authorized to view this page');
        return;
    }
    else if (pagename == 'EXP_VCTCheck.html')
        window.location.href = pagename;

    if (pagename == 'EXP_DocumentUpload.html')
        window.location.href = pagename;
}

