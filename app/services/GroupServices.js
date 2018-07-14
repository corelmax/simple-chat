import * as Rx from "rxjs";
var ajax = Rx.Observable.ajax;
import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";
var getConfig = function () { return InternalStore.apiConfig; };
var authReducer = function () { return InternalStore.authStore; };
export function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: getConfig().group + "/addMember/" + room_id,
        body: JSON.stringify({ member: member }),
        headers: apiHeaders()
    });
}
export function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: getConfig().group + "/removeMember/" + room_id,
        body: JSON.stringify({ member_id: member_id }),
        headers: withToken(apiHeaders())(authReducer().api_token)
    });
}
