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

import store from "react-native-simple-store";

export class NodeMessageDAL implements IMessageDAL {
    getData(rid: string): Promise<any> {
        return store.get(rid);
    }

    saveData(rid: string, chatRecord: any): Promise<any> {
        return store.save(rid, chatRecord).then(() => {
            return store.get(rid) as Promise<any>;
        });
    }
    removeData(rid: string, callback: () => void) {

    }

    clearData(next: () => void) {

    }
}
