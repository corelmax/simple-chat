import * as Rx from "rxjs";
const { ajax } = Rx.Observable;

import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";

const getConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;

export function addMember(room_id: string, member: any) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: apiHeaders()
    });
}

export function removeMember(room_id: string, member_id: string) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/removeMember/${room_id}`,
        body: JSON.stringify({ member_id: member_id }),
        headers: withToken(apiHeaders())(authReducer().api_token)
    });
}