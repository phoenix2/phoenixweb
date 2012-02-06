// DEVAID NOTE: This is really temporary. It just displays the current uptime.
// But it demonstrates that you can simply fire off RPC calls and assume that
// they will come back, because they will eventually - after the RPC client
// retries or asks the user for a new password of course. :)

function startUI(rpc) {
    $('body').append('<div id="uptime" title="Current uptime"></span>');
    $('#uptime').dialog();

    function doCall() {
        rpc.call("getstatus", [], function(st) {
            $('#uptime').text(st.uptime);
            setTimeout(doCall, 1000);
        });
    }

    doCall();
}
