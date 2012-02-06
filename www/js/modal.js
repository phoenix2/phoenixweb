// DEVAID NOTE: Functional, but needs prettying.

function ModalUI() {
    $('body').append('\
        <div id="reconnecting_dialog" title="Lost connection to Phoenix">\
        <p>Please wait, reconnecting...</p></div>\
        \
        <div id="password_dialog" title="Phoenix login">\
        <span id="explanation"><p>Welcome to Phoenix!</p></span>\
        <span id="bad_password">You have entered an invalid password.</span>\
        <input id="password" type="password"></input>\
        </div>\
    ');

    this.password_dialog = $("#password_dialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        closeOnEscape: false,
        resizable: false
    });
    $(".ui-dialog-titlebar-close", this.password_dialog).hide();

    this.reconnecting_dialog = $("#reconnecting_dialog").dialog({
        autoOpen: false,
        draggable: false,
        modal: true,
        closeOnEscape: false,
        resizable: false
    });
    $(".ui-dialog-titlebar-close", this.reconnect_dialog).hide();

    this.disconnected = function() {
        this.reconnecting_dialog.dialog("open");
    }

    this.badPassword = function(rpc) {
        // If this function gets called twice in a row, it means the user
        // entered a bad password...
        if(this.password_dialog.dialog("isOpen"))
            $("#bad_password", this.password_dialog).show();
        else {
            $("#bad_password", this.password_dialog).hide();
            this.password_dialog.dialog("open");
        }
        $("#password", this.password_dialog).val("");
        $("#password", this.password_dialog).keyup(function(event) {
            if(event.keyCode == 13) {
                rpc.setPassword($("#password", this.password_dialog).val());
            }
        });

    }

    this.connected = function() {
        this.password_dialog.dialog("close");
        $("#explanation", this.password_dialog).text("Your password changed.");
        this.reconnecting_dialog.dialog("close");
    }
}
