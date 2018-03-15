"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Return = /** @class */ (function () {
    function Return() {
        this.statusCode = 200;
    }
    Return.prototype.cb = function (functions) {
        this.callbackFunction = functions;
    };
    Return.prototype.status = function (code) {
        this.statusCode = code;
        return this;
    };
    Return.prototype.message = function (message) {
        this.statusMessage = message;
        return this;
    };
    Return.prototype.data = function (data) {
        this.body = JSON.stringify(data);
        return this;
    };
    Return.prototype.parseData = function (data) {
        this.data(data);
        return this.parse();
    };
    Return.prototype.error = function (message) {
        if (typeof message == 'object') {
            this.body = message;
        }
        if (message) {
            this.statusMessage = message;
        }
        else if (!this.statusMessage) {
            this.statusMessage = "";
        }
        if (this.statusCode == 200) {
            this.statusCode = 400;
        }
        return this.parse();
    };
    Return.prototype.parse = function () {
        if (!this.body) {
            this.data({
                message: this.statusMessage
            });
        }
        // TODO: Make CORS headers a selected feature.
        var returnObject = {
            statusCode: this.statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: this.body
        };
        if (this.callbackFunction) {
            this.callbackFunction(null, returnObject);
        }
        else {
            return returnObject;
        }
    };
    return Return;
}());
exports.Return = Return;
