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

const store = require("react-native-simple-store");
export class NodeMessageDAL implements IMessageDAL {
    getData(rid): Promise<any> {
        return store.get(rid);
    }
    saveData(rid, chatRecord): Promise<any> {
        return store.save(rid, chatRecord).then(() => {
            return store.get(rid) as Promise<any>;
        });
    }
    removeData(rid, callback) {
    }
    clearData(next) {
    }
}
