/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 *  RoomDAL.ts
 */
import * as localForage from "localforage";
var RoomDAL = /** @class */ (function () {
    function RoomDAL() {
        this.store = localForage.createInstance({
            name: "rooms"
        });
    }
    RoomDAL.prototype.save = function (key, data) {
        return this.store.setItem(key, data);
    };
    RoomDAL.prototype.get = function (key) {
        return this.store.getItem(key);
    };
    RoomDAL.prototype.remove = function (key) {
        return this.store.removeItem(key);
    };
    RoomDAL.prototype.clear = function () {
        return this.store.clear();
    };
    RoomDAL.prototype.getKeys = function () {
        return this.store.keys();
    };
    return RoomDAL;
}());
export { RoomDAL };
