import { IMessageDAL } from "./IMessageDAL";

import * as localForage from "localforage";

export class MessageDAL implements IMessageDAL {

    store: LocalForage;

    constructor() {
        // localforage.config({
        //     driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
        //     name: 'myApp',
        //     version: 1.0,
        //     size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        //     storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
        //     description: 'some description'
        // });

        this.store = localForage.createInstance({
            name: "message"
        });
    }

    getData(rid: string): Promise<any> {
        return this.store.getItem(rid);
    }

    saveData(rid: string, chatRecord: Array<any>) {
        return this.store.setItem(rid, chatRecord);
    }

    removeData(rid: string, callback?: (err, res) => void) {
        this.store.removeItem(rid).then(() => {
            console.info("room_id %s is removed: ", rid);
            if (callback) {
                callback(null, null);
            }
        }).catch((err) => {
            console.warn(err);
        });
    }

    clearData(next: (err?: Error) => void) {
        console.warn("MessageDAL.clearData");
        this.store.clear((err) => {
            if (err != null) {
                console.warn("Clear database fail", err);
            }

            console.warn("message db now empty.");

            next(err);
        });
    }
}