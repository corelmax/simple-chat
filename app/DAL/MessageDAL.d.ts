import { IMessageDAL } from "./IMessageDAL";
export declare class MessageDAL implements IMessageDAL {
    store: LocalForage;
    constructor();
    getData(rid: string): Promise<any>;
    saveData(rid: string, chatRecord: any[]): Promise<any[]>;
    removeData(rid: string, callback?: (err: any, res: any) => void): void;
    clearData(next: (err?: Error) => void): void;
}
