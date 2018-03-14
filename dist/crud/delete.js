'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var return_1 = require("../api/return");
var service_1 = require("../dynamodb/service");
var service = new service_1.Service(process.env.TABLENAME, process.env.KEY_ID);
var ret = new return_1.Return;
module.exports = function (event, context, callback) {
    ret.cb(callback);
    if (process.env.PERSONAL_RESOURCE) {
        var userId = event.requestContext.authorizer.principalId;
        service.setUserId(userId);
    }
    var itemId = event.pathParameters[process.env.KEY_ID];
    service.delete(itemId)
        .then(function (result) { return ret.parseData(result); });
};
