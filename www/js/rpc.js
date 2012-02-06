// DEVAID NOTE: This file is pretty much done. It allows other code to make RPC
// calls. It also handles errors and retries as appropriate, so the other code
// can assume that 100% of all RPC calls will succeed eventually.

function RPCClient(ui) {
    this.ui = ui;

    this.url = document.location; // TODO: Strip index.html if present
    this.password = "phoenix";

    this.queue = new Array();
    this.ready = true;
    this.state = -1;

    this.retryDelay = 1000;

    this.call = function(method, params, callback) {
        this.queue.push({method: method, params: params, callback: callback});
        this._considerSend();
    }

    this._considerSend = function() {
        if(!this.queue.length)
            return;
        if(!this.ready)
            return;

        var req = this.queue.shift();

        var query = {method: req.method, params: req.params, id: 1};

        this.ready = false;
        var _this = this;
        $.ajax({
            type: "POST",
            url: this.url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(query),
            username: this.password,
            password: this.password,
            success: function(data) {
                if(data.error == null) {
                    if(_this.state != 0) {
                        _this.state = 0;
                        _this.ui.connected();
                    }

                    req.callback(data.result);
                } else
                    alert(data.error.message);
                _this.ready = true;
                _this._considerSend();
            },
            error: function(jqXHR) {
                _this.queue.unshift(req);
                if(jqXHR.status == 401) {
                    if(_this.state != 1) {
                        _this.state = 1;
                        _this.ui.badPassword(_this);
                    }
                } else {
                    if(_this.state != 2) {
                        _this.state = 2;
                        _this.ui.disconnected();
                    }

                    setTimeout(function() {
                        _this.ready = true;
                        _this._considerSend();
                    }, _this.retryDelay);
                }
            }
        });
    }

    this.setPassword = function(password) {
        this.password = password;
        if(this.state == 1) {
            this.state = -1;
            this.ready = true;
            this._considerSend();
        }
    }
}
