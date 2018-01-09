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
    getData(rid: string): Promise<any>;
    saveData(rid: string, chatRecord: any): Promise<any>;
    removeData(rid: string, callback: () => void): void;
    clearData(next: () => void): void;
}
