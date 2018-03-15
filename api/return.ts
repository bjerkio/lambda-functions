export class Return {

  private statusCode = 200;
  private statusMessage: any;
  private body: any;
  private callbackFunction: any;

  cb(functions:any) {
    this.callbackFunction = functions;
  }

  status(code:any) {
    this.statusCode = code;
    return this;
  }

  message(message:any) {
    this.statusMessage = message;
    return this;
  }

  data(data:any) {
    this.body = JSON.stringify(data);
    return this;
  }

  parseData(data:any) {
    this.data(data);
    return this.parse();
  }

  error(message:any) {

    if(typeof message == 'object'){
      this.data({
        status: 'failed',
        error: message
      });
    }

    if(message){
      this.statusMessage = message;
    } else if(!this.statusMessage) {
      this.statusMessage = ""
    }

    if(this.statusCode == 200){
      this.statusCode = 400;
    }

    return this.parse();
  }

  parse() {

    if(!this.body){
      this.data({
        message: this.statusMessage
      });
    }

    // TODO: Make CORS headers a selected feature.
    let returnObject = {
      statusCode: this.statusCode,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: this.body
    };

    if(this.callbackFunction){
      this.callbackFunction(null, returnObject);
    } else {
      return returnObject;
    }
  }
}
