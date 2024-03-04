(function () {
    document.addEventListener("deviceready", OnPageLoad, false);
})();
function OnPageLoad() {
    var Query = window.location.search;

    var ScanLocation = "";
    if ((Query.split('&')[0].split('=')[1]).toString() == "divGateIn")
    {
        ScanLocation="Gate In";
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockIn") {
        ScanLocation="Dock In";
    }
    else if ((Query.split('&')[0].split('=')[1]).toString() == "divDockOut") {
        ScanLocation="Dock Out";
    }
    else if((Query.split('&')[0].split('=')[1]).toString()=="divGateOut"){
        ScanLocation="Gate Out";
    }
    $('#txtScanLoc').val(ScanLocation);
}