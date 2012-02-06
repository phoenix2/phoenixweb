// DEVAID NOTE: This is a pretty temporary stand-in for the wizard. Right now,
// all it does is ask the user to specify a new, more secure password, then
// fires up the main UI. The real wizard should do this, too, of course, but it
// needs to do more than that, like ask for a backend URL and devices to mine
// on.

function startWizard(rpc) {
    $('body').append('\
        <div id="new_password_dialog" title="Create password">\
        <span id="explanation"><p>\
        Please pick a password for your miner.</p></span>\
        <input id="new_password" type="password"></input>\
        </div>\
    ');

    var new_password_dialog = $("#new_password_dialog").dialog({
        autoOpen: true,
        modal: true,
        closeOnEscape: false,
        resizable: false
    });
    $(".ui-dialog-titlebar-close", new_password_dialog).hide();

    $("#new_password", this.new_password_dialog).keyup(function(event) {
        if(event.keyCode == 13) {
            var password = $("#new_password", this.new_password_dialog).val();
            rpc.call("setconfig", ["web", "password", password],
                function() {
                    rpc.setPassword(password); // So it doesn't ask the user.
                    new_password_dialog.dialog("close");
                    startUI(rpc); // Our work is done here.
                });
        }
    });
}
