/**
 * NodeMessageDAL.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *
 *
 * Use react-native-simple-storage for stroage engines.
 */
import { IMessageDAL } from "./IMessageDAL";
export declare class NodeMessageDAL implements IMessageDAL {
    getData(rid: any): Promise<any>;
    saveData(rid: any, chatRecord: any): Promise<any>;
    removeData(rid: any, callback: any): void;
    clearData(next: any): void;
}
