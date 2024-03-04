
(function () {
   
    $(".dropdown-menu").on('click', 'li', function () {
        
        //Export menu below----------------------------------------

        if ($(this).text() == 'Vehicle Tracking' && window.localStorage.getItem("RoleExpVehicleTracking") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'TDG Acceptance' && window.localStorage.getItem("RoleExpTDG") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Binning' && window.localStorage.getItem("RoleExpBinning") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Internal/Exam Movement' && window.localStorage.getItem("RoleExpIntlMvmt") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }       

        if ($(this).text() == 'Unitization' && window.localStorage.getItem("RoleExpUnitization") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }       

        if ($(this).text() == 'Airside Release' && window.localStorage.getItem("RoleExpAirsideRelease") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }       

        if ($(this).text() == 'Export Query' && window.localStorage.getItem("RoleExpExportsQuery") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'VCT Check' && window.localStorage.getItem("RoleExpVCTCheck") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }

        //Import menu below------------------------------------------
       
        if ($(this).text() == 'Flight Check' && window.localStorage.getItem("RoleIMPFlightCheck") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Segregation' && window.localStorage.getItem("RoleIMPSegregation") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Binning' && window.localStorage.getItem("RoleIMPBinning") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Internal Movement' && window.localStorage.getItem("RoleIMPIntlMvmt") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }       

        if ($(this).text() == 'Forward & Backward' && window.localStorage.getItem("RoleIMPFwdBkd") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Final Delivery' && window.localStorage.getItem("RoleIMPFinalDelivery") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }        

        if ($(this).text() == 'Import Query' && window.localStorage.getItem("RoleIMPImportQuery") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }       

        if ($(this).text() == 'Document Upload' && window.localStorage.getItem("RoleIMPDocUpload") == '0') {
            $.alert('You are not authorized to view this page');
            return false;
        }

        if ($(this).text() == 'Log Out') {
            window.localStorage.clear();
        }

    });

    

    if (window.localStorage.getItem("RoleExpDashboard") == '0') {
        $("#aExport").css('pointer-events', 'none');
    }

    if (window.localStorage.getItem("RoleImpDashboard") == '0') {               
        $('#aImport').css('pointer-events', 'none');
    }

})();

