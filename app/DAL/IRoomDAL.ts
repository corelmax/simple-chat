/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  IRoomDAL.ts
 */

export interface IRoomDAL {
    save(key, data): Promise<any>;
    get(key): Promise<any>;
    getKeys(): Promise<string[]>;
    remove(key);
    clear();
}