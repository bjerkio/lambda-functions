'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var return_1 = require("../api/return");
var service_1 = require("../dynamodb/service");
var service = new service_1.Service(process.env.TABLENAME, process.env.KEY_ID);
var ret = new return_1.Return;
module.exports = function (event, context, callback) {
    ret.cb(callback);
    var body = JSON.parse(event.body);
    if (process.env.PERSONAL_RESOURCE) {
        var userId = event.requestContext.authorizer.principalId;
        service.setUserId(userId);
    }
    service.create(body)
        .then(function (result) { return ret.parseData(result.Item); });
};
