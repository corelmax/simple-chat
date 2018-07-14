import * as Rx from "rxjs/Rx";
import InternalStore from "../InternalStore";
import { apiHeaders } from "./ServiceUtils";
var getConfig = function () { return InternalStore.apiConfig; };
export function getLastAccessRoomInfo(userId) {
    return fetch(getConfig().user + "/lastAccessRoom?user_id=" + userId, {
        method: "GET",
        headers: apiHeaders(),
    });
}
export function updateLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: getConfig().user + "/lastAccessRoom",
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            roomId: roomId,
            userId: userId,
        }),
    });
}
export function removeLastAccessRoomInfo(userId, roomId) {
    return Rx.Observable.ajax({
        url: getConfig().user + "/lastAccessRoom",
        method: "DELETE",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: roomId, user_id: userId }),
    });
}
