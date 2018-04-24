export declare class Return {
    private statusCode;
    private statusMessage;
    private body;
    private callbackFunction;
    cb(functions: any): void;
    status(code: any): this;
    message(message: any): this;
    data(data: any): this;
    parseData(data: any): any;
    error(message: any): any;
    parse(): any;
}
