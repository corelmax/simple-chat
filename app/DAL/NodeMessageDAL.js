"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store = require("react-native-simple-store");
class NodeMessageDAL {
    getData(rid) {
        return store.get(rid);
    }
    saveData(rid, chatRecord) {
        return store.save(rid, chatRecord).then(() => {
            return store.get(rid);
        });
    }
    removeData(rid, callback) {
    }
    clearData(next) {
    }
}
exports.NodeMessageDAL = NodeMessageDAL;
