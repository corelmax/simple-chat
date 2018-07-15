import * as Rx from "rxjs";
const { ajax } = Rx.Observable;

import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";

const getConfig = () => InternalStore.apiConfig;
const authReducer = () => InternalStore.authStore;

export function addMember(roomId: string, member: any) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/addMember/${roomId}`,
        body: JSON.stringify({ member }),
        headers: apiHeaders(),
    });
}

export function removeMember(roomId: string, memberId: string) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/removeMember/${roomId}`,
        body: JSON.stringify({ memberId }),
        headers: withToken(apiHeaders())(authReducer().api_token),
    });
}
