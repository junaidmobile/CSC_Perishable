
(function () {
    document.addEventListener('backbutton', onBackKeyDown, false);
    //document.addEventListener('deviceready', DropDown, false);
}
)();
function onBackKeyDown() {
    //if ($('#divDashBoardImport').is(':visible')) {
    //    $('#divMode').show();
    //    $('#divDashBoardImport').hide();
    //    $('#divDashBoardExport').hide();
    //}
    //else if ($('#divDashBoardExport').is(':visible')) {
    //    $('#divMode').show();
    //    $('#divDashBoardImport').hide();
    //    $('#divDashBoardExport').hide();
    //}
    //else {
    //    navigator.app.backHistory();
    //}
    window.location.href = 'Login.html';
}
function DropDownClick() {
    //if (element.id == "aImport") {
    //    if ($('#aImport').attr('aria-expanded').toString() == "false") {
    //        $('#divMain').removeClass("VerticallyCenter");
    //    }
    //    else {
    //        $('#divMain').addClass("VerticallyCenter");
    //    }
    //}
    //else if (element.id == "aExport") {
    //    if ($('#aExport').attr('aria-expanded').toString() == "false") {
    //        $('#divMain').removeClass("VerticallyCenter");
    //    }
    //    else {
    //        $('#divMain').addClass("VerticallyCenter");
    //    }
    //}
    
    if ($('#btnnavbar').attr('aria-expanded').toString() == "false") {
        $('#divMain').removeClass("VerticallyCenter");
    }
    else {
        $('#divMain').addClass("VerticallyCenter");
    }
    
}
function DisplayScreen(Mode) {
    if (Mode == "Import") {

        if (window.localStorage.getItem("RoleImpDashboard") == '0') {
            $.alert('You are not authorized for Imports');
            return;
        }
        else if (window.localStorage.getItem("RoleImpDashboard") == '1' || window.localStorage.getItem("RoleImpDashboard") == null)
            window.location.href = "IMP_Dashboard.html";

    }
    else if (Mode == "Export") {

        if (window.localStorage.getItem("RoleExpDashboard") == '0') {
            $.alert('You are not authorized for Exports');
            return;
        }
        else if (window.localStorage.getItem("RoleExpDashboard") == '1' || window.localStorage.getItem("RoleExpDashboard") == null)
            window.location.href = "EXP_Dashboard.html";      
        
    }
}
