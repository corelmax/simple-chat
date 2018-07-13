"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatlogsActions = require("../chatlogs/chatlogsActions");
const ChatlogRxActions = require("../chatlogs/chatlogRxActions");
const chatlistsRx = require("../actions/chatlistsRx");
const immutable_1 = require("immutable");
exports.ChatLogInitState = immutable_1.Record({
    isFetching: false,
    state: "",
    chatsLog: [],
    logCount: null,
    roomAccess: null,
    error: "",
});
const initialState = new exports.ChatLogInitState();
function chatlogReducer(state = initialState, action) {
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
            const prev = state.get("chatsLog");
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
            }
            else {
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
            }
            else {
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
exports.chatlogReducer = chatlogReducer;
