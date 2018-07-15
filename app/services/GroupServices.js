import * as Rx from "rxjs";
var ajax = Rx.Observable.ajax;
import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";
var getConfig = function () { return InternalStore.apiConfig; };
var authReducer = function () { return InternalStore.authStore; };
export function addMember(roomId, member) {
    return ajax({
        method: "POST",
        url: getConfig().group + "/addMember/" + roomId,
        body: JSON.stringify({ member: member }),
        headers: apiHeaders(),
    });
}
export function removeMember(roomId, memberId) {
    return ajax({
        method: "POST",
        url: getConfig().group + "/removeMember/" + roomId,
        body: JSON.stringify({ memberId: memberId }),
        headers: withToken(apiHeaders())(authReducer().api_token),
    });
}
