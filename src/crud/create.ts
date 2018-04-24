'use strict';

import { Return } from '../api/return';
import { Service } from '../dynamodb/service';

const service = new Service(process.env.TABLENAME, process.env.KEY_ID);
const ret = new Return;

module.exports.handler = (event: any, context: any, callback: any) => {
  ret.cb(callback);

  const body = JSON.parse(event.body);

  if(process.env.PERSONAL_RESOURCE){
    const userId = event.requestContext.authorizer.principalId;
    service.setUserId(userId);
  }

  service.create(body)
          .then((result: any) => ret.parseData(result.Item));
}
