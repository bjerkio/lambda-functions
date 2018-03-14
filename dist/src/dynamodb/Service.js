"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = require("aws-sdk");
var moment = require("moment");
var uuid = require("uuid/v1");
var _ = require("lodash");
var Service = /** @class */ (function () {
    function Service(tableName, keyId) {
        this.client = new aws_sdk_1.DynamoDB.DocumentClient();
        this.tableName = tableName;
        this.keyId = keyId;
    }
    Service.prototype.setUserId = function (id) {
        this.userId = id;
    };
    Service.prototype.getByUser = function (id, userId) {
        var params = {
            TableName: this.tableName,
            KeyConditionExpression: '#id = :id',
            ExpressionAttributeNames: {
                '#userId': 'userId',
                '#id': this.keyId
            },
            ExpressionAttributeValues: {
                ':userId': userId,
                ':id': id
            },
            FilterExpression: '#userId = :userId'
        };
        return this.client.query(params).promise();
    };
    Service.prototype.get = function (id) {
        if (this.userId) {
            return this.getByUser(id, this.userId);
        }
        var params = {
            TableName: this.tableName,
            Key: (_a = {},
                _a[this.keyId] = id,
                _a)
        };
        return this.client.get(params).promise();
        var _a;
    };
    Service.prototype.create = function (resource) {
        var _this = this;
        resource.createdAt = moment().toISOString();
        resource.updatedAt = moment().toISOString();
        resource[this.keyId] = uuid();
        if (this.userId) {
            resource.userId = this.userId;
        }
        var params = {
            TableName: this.tableName,
            Item: resource
        };
        return new Promise(function (resolve, reject) {
            _this.client.put(params, function (err, result) {
                if (err)
                    return reject(err);
                resolve(params);
            });
        });
    };
    Service.prototype.list = function () {
        var params = {
            TableName: this.tableName
        };
        if (this.userId) {
            params.ExpressionAttributeNames = {};
            params.ExpressionAttributeValues = {};
            params.ExpressionAttributeNames['#userId'] = 'userId';
            params.ExpressionAttributeValues[':userId'] = this.userId;
            params.FilterExpression = '#userId = :userId';
        }
        return this.client.scan(params).promise();
    };
    Service.prototype.delete = function (id) {
        var params = {
            TableName: this.tableName,
            Key: (_a = {},
                _a[this.keyId] = id,
                _a)
        };
        if (this.userId) {
            params.ExpressionAttributeNames['#userId'] = 'userId';
            params.ExpressionAttributeValues[':userId'] = this.userId;
            params.ConditionExpression = '#userId = :userId';
        }
        return this.client.delete(params).promise();
        var _a;
    };
    Service.prototype.update = function (id, resource) {
        var payload = _.reduce(resource, function (memo, value, key) {
            memo.ExpressionAttributeNames["#" + key] = key;
            memo.ExpressionAttributeValues[":" + key] = value;
            memo.UpdateExpression.push("#" + key + " = :" + key);
            return memo;
        }, {
            TableName: this.tableName,
            Key: (_a = {},
                _a[this.keyId] = id,
                _a),
            ReturnValues: 'ALL_NEW',
            UpdateExpression: [],
            ExpressionAttributeNames: {},
            ExpressionAttributeValues: {},
            ConditionExpression: {}
        });
        if (this.userId) {
            payload.ExpressionAttributeNames['#userId'] = 'userId';
            payload.ExpressionAttributeValues[':userId'] = this.userId;
            payload.ConditionExpression = '#userId = :userId';
        }
        payload.UpdateExpression = 'SET ' + payload.UpdateExpression.join(', ');
        return this.client.update(payload).promise();
        var _a;
    };
    return Service;
}());
exports.Service = Service;
