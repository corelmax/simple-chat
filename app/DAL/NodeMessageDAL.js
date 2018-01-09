"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_simple_store_1 = require("react-native-simple-store");
class NodeMessageDAL {
    getData(rid) {
        return react_native_simple_store_1.default.get(rid);
    }
    saveData(rid, chatRecord) {
        return react_native_simple_store_1.default.save(rid, chatRecord).then(() => {
            return react_native_simple_store_1.default.get(rid);
        });
    }
    removeData(rid, callback) {
    }
    clearData(next) {
    }
}
exports.NodeMessageDAL = NodeMessageDAL;
