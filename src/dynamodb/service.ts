import { DynamoDB } from 'aws-sdk';
import * as moment from 'moment';
import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

export class Service {

  private client: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

  tableName: string;
  keyId: string;

  userId: string = '';


  debug = false;

  constructor(tableName: string, keyId: string){
    this.tableName = tableName;
    this.keyId = keyId;
  }

  debugOn(){
    this.debug = true;
  }

  removeEmptyObjects(obj: any): any {
    return _(obj)
      .pickBy(_.isObject) // pick objects only
      .mapValues(this.removeEmptyObjects) // call only for object values
      .omitBy(_.isEmpty) // remove all empty objects
      .assign(_.omitBy(obj, _.isObject)) // assign back primitive values
      .pickBy(_.identity)
      .value();
  }

  setUserId(id: string) {
    this.userId = id;
  }

  getByUser(id: string, userId: string): Promise<any> {
    const params: DynamoDB.Types.DocumentClient.QueryInput = {
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

    if(this.debug){ console.log(params); }
    return this.client.query(params).promise();
  }

  getByIndex(id: any, indexName: any): Promise<any> {
    const params: DynamoDB.Types.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': this.keyId
      },
      ExpressionAttributeValues: {
        ':id': id
      }
    };

    if(this.debug){ console.log(params); }

    return this.client.query(params).promise();
  }

  get(id: string): Promise<any> {

    if(this.userId){
      return this.getByUser(id, this.userId);
    }

    const params: DynamoDB.Types.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        [this.keyId]: id
      }
    };

    if(this.debug){ console.log(params); }
    return this.client.get(params).promise();
  }

  create(resource: any): Promise<any>{

    resource = this.removeEmptyObjects(resource);

    resource.createdAt = moment().toISOString();
    resource.updatedAt = moment().toISOString();

    resource[this.keyId] = uuid();

    if(this.userId){
      resource.userId = this.userId;
    }

    const params: DynamoDB.Types.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: resource
    };

    if(this.debug){ console.log(params); }

    return new Promise((resolve, reject) => {
      this.client.put(params, (err, result) => {
        if(err) return reject(err);
        resolve(params);
      });
    });
  }

  list(): Promise<any>{
    let params: DynamoDB.Types.DocumentClient.ScanInput = {
      TableName: this.tableName
    };

    if(this.userId){
      params.ExpressionAttributeNames = {};
      params.ExpressionAttributeValues = {};
      params.ExpressionAttributeNames['#userId'] = 'userId';
      params.ExpressionAttributeValues[':userId'] = this.userId;
      params.FilterExpression = '#userId = :userId';
    }

    if(this.debug){ console.log(params); }

    return this.client.scan(params).promise();
  }

  delete(id: string): Promise<any> {
    let params: DynamoDB.Types.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: {
        [this.keyId]: id
      }
    }

    if(this.userId){
      params.ExpressionAttributeNames = {};
      params.ExpressionAttributeValues = {};
      params.ExpressionAttributeNames['#userId'] = 'userId';
      params.ExpressionAttributeValues[':userId'] = this.userId;
      params.ConditionExpression = '#userId = :userId';
    }

    if(this.debug){ console.log(params); }

    return this.client.delete(params).promise();
  }

  update(id: string, resource: any): Promise<any>{

    resource = this.removeEmptyObjects(resource);

    let payload = _.reduce(resource, (memo: any, value, key) => {
      memo.ExpressionAttributeNames[`#${key}`] = key
      memo.ExpressionAttributeValues[`:${key}`] = value
      memo.UpdateExpression.push(`#${key} = :${key}`)
      return memo
    }, {
      TableName: this.tableName,
      Key: {
        [this.keyId]: id
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: [],
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ConditionExpression: {}
    });

    if(this.userId){
      payload.ExpressionAttributeNames['#userId'] = 'userId';
      payload.ExpressionAttributeValues[':userId'] = this.userId;
      payload.ConditionExpression = '#userId = :userId';
    }

    payload.UpdateExpression = 'SET ' + payload.UpdateExpression.join(', ')

    if(this.debug){ console.log(payload); }

    return this.client.update(payload).promise();
  }

}
