export declare class Return {
    private statusCode;
    private statusMessage;
    private body;
    private callbackFunction;
    cb(functions: any): void;
    status(code: any): this;
    message(message: any): this;
    data(data: any): this;
    parseData(data: any): {
        statusCode: number;
        headers: {
            "Access-Control-Allow-Origin": string;
            "Access-Control-Allow-Credentials": boolean;
        };
        body: any;
    };
    error(message: any): {
        statusCode: number;
        headers: {
            "Access-Control-Allow-Origin": string;
            "Access-Control-Allow-Credentials": boolean;
        };
        body: any;
    };
    parse(): {
        statusCode: number;
        headers: {
            "Access-Control-Allow-Origin": string;
            "Access-Control-Allow-Credentials": boolean;
        };
        body: any;
    };
}
