// DEVAID NOTE: This is pretty much exactly what the final version of this
// file is going to be.

$(function() {
    var rpc = new RPCClient(new ModalUI());

    rpc.call("getstatus", [], function(status) {
        // The call just succeeded. If the default password was used for this,
        // start the first-time setup wizard. If a different password was used,
        // go to the main UI.
        if(rpc.password == "phoenix")
            startWizard(rpc);
        else
            startUI(rpc);
    });
});
