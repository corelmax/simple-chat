/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { AnyAction } from "redux";
import * as ChatlogsActions from "../chatlogs/chatlogActions";
import * as ChatlogRxActions from "../chatlogs/chatlogRxActions";

import * as chatlistsRx from "../actions/chatlistsRx";

import { Record } from "immutable";

// Define our record types with a typescript interface
interface IChatlog {
    isFetching: boolean;
    state: string;
    chatsLog: any[];
    logCount: number;
    roomAccess: any;
    error: string;
}
export const ChatLogInitState = Record({
    isFetching: false,
    state: "",
    chatsLog: [],
    logCount: null,
    roomAccess: null,
    error: "",
});
const initialState = new ChatLogInitState();

export function chatlogReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE: {
            const { chatsLog, logCount } = action.payload;
            return state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_GET_CHATSLOG_COMPLETE);
        }
        case ChatlogsActions.STALK_CHATLOG_MAP_CHANGED: {
            const { chatsLog, logCount } = action.payload;
            const nextState = state.set("chatsLog", chatsLog)
                .set("logCount", logCount)
                .set("state", ChatlogsActions.STALK_CHATLOG_MAP_CHANGED);
            return nextState;
        }
        case ChatlogsActions.ON_CHATLOG_CHANGE: {
            const prev = state.get("chatsLog") as any[];
            const next = prev.filter((log) => log.rid !== action.payload.rid);

            next.push(action.payload);
            return state.set("chatsLog", next);
        }
        case chatlistsRx.GET_RECENT_MESSAGE_SUCCESS: {
            return state.set("chatsLog", action.payload);
        }

        case ChatlogRxActions.GET_LAST_ACCESS_ROOM: {
            return state.set("isFetching", true);
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_SUCCESS: {
            const data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess).set("isFetching", false);
            } else {
                return state.set("isFetching", false);
            }
        }
        case ChatlogRxActions.GET_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("roomAccess", null)
                .set("isFetching", false);
        }

        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_SUCCESS: {
            return state.set("roomAccess", action.payload)
                .set("isFetching", false);
        }
        case ChatlogRxActions.UPDATE_LAST_ACCESS_ROOM_FAILURE: {
            return state.set("isFetching", false);
        }

        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS: {
            return state.set("isFetching", true)
                .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS);
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS: {
            const data = action.payload;
            if (Array.isArray(data) && data.length > 0) {
                return state.set("roomAccess", data[0].roomAccess)
                    .set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            } else {
                return state.set("isFetching", false)
                    .set("state", ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_SUCCESS);
            }
        }
        case ChatlogRxActions.STALK_REMOVE_ROOM_ACCESS_FAILURE: {
            return state.set("isFetching", false);
        }

        default:
            return state;
    }
}
