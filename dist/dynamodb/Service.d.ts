export declare class Service {
    private client;
    tableName: string;
    keyId: string;
    userId: string;
    constructor(tableName: string, keyId: string);
    setUserId(id: string): void;
    getByUser(id: string, userId: string): Promise<any>;
    get(id: string): Promise<any>;
    create(resource: any): Promise<any>;
    list(): Promise<any>;
    delete(id: string): Promise<any>;
    update(id: string, resource: any): Promise<any>;
}
