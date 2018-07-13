"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => InternalStore_1.default.apiConfig;
function getLastAccessRoomInfo(userId) {
    return fetch(`${getConfig().user}/lastAccessRoom?user_id=${userId}`, {
        method: "GET",
        headers: ServiceUtils_1.apiHeaders(),
    });
}
exports.getLastAccessRoomInfo = getLastAccessRoomInfo;
function updateLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/lastAccessRoom`,
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({
            roomId,
            userId,
        }),
    });
}
exports.updateLastAccessRoomInfo = updateLastAccessRoomInfo;
function removeLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/lastAccessRoom`,
        method: "DELETE",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ room_id: roomId, user_id: userId }),
    });
}
exports.removeLastAccessRoomInfo = removeLastAccessRoomInfo;
