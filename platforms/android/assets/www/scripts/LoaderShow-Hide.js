function ShowLoader() {
    //$('body').loadingModal({
    //    position: 'auto',
    //    text: '',
    //    color: '#fff',
    //    opacity: '0.7',
    //    backgroundColor: 'rgb(0,0,0)',
    //    animation: 'wave',
    //    width:'100%'
    //});
    $("body").mLoading();
}

function HideLoader() {
    setTimeout(Hide(),10000);
}

function Hide() {
    //$('body').loadingModal('hide').delay(2000);
    //$('body').loadingModal('destroy').delay(2000);
    $("body").mLoading('hide');
}
