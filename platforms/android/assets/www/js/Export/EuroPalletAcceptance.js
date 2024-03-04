(function () {
    document.addEventListener('deviceready', OnPageLoad, false);
}
)();
function OnPageLoad() {
    var Query = window.location.search;
    var TDG = Query.split('&')[0].split('=')[1];
    if ((TDG != "" )&& (TDG != undefined)) {
        $('#navhdrName').html("TDG Accept.");
    }
    else {
        $('#navhdrName').html("Euro Pallet Acceptance");
    }
}