/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  IRoomDAL.ts
 */
export interface IRoomDAL {
    save(key: any, data: any): Promise<any>;
    get(key: any): Promise<any>;
    getKeys(): Promise<string[]>;
    remove(key: any): any;
    clear(): any;
}
