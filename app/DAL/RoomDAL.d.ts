/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  RoomDAL.ts
 */
import { IRoomDAL } from "./IRoomDAL";
export declare class RoomDAL implements IRoomDAL {
    private store;
    constructor();
    save(key: any, data: any): Promise<any>;
    get(key: any): Promise<any>;
    remove(key: any): Promise<any>;
    clear(): Promise<any>;
    getKeys(): any;
}
