import * as Rx from "rxjs/Rx";

import InternalStore from "../InternalStore";
import { withToken, apiHeaders } from "./ServiceUtils";
const getConfig = () => InternalStore.apiConfig;

export function getLastAccessRoomInfo(userId: string) {
    return fetch(`${getConfig().user}/lastAccessRoom?user_id=${userId}`, {
        method: "GET",
        headers: apiHeaders(),
    });
}

export function updateLastAccessRoomInfo(userId: string, roomId: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/lastAccessRoom`,
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            roomId,
            userId,
        }),
    });
}

export function removeLastAccessRoomInfo(userId: string, roomId: string) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/lastAccessRoom`,
        method: "DELETE",
        headers: apiHeaders(),
        body: JSON.stringify({ room_id: roomId, user_id: userId }),
    });
}
