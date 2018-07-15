/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { Record } from "immutable";
import { GET_CHAT_TARGET_UID_FAILURE, GET_CHAT_TARGET_UID_SUCCESS, GET_NEWER_MESSAGE_SUCCESS, ON_EARLY_MESSAGE_READY, ON_MESSAGE_CHANGED, SEND_MESSAGE_FAILURE, } from "./chatroomActions";
import * as chatroomActions from "./chatroomActions";
import * as chatroomRxActions from "./chatroomRxEpic";
import { GET_ALL_CHATROOM_FAILURE, GET_ALL_CHATROOM_SUCCESS } from "../actions/chatlistsRx";
// Define our record defaults
var chatroomDefaults = {
    isFetching: false,
    state: "",
    room: null,
    chatTargets: "*",
    responseFile: null,
    messages: [],
    earlyMessageReady: false,
    uploadingFile: null,
    fileInfo: null,
    error: null,
    chatDisabled: false,
    chatrooms: [],
};
export var ChatRoomInitState = Record(chatroomDefaults);
var chatRoomInitState = new ChatRoomInitState();
export var chatroomReducer = function (state, action) {
    if (state === void 0) { state = chatRoomInitState; }
    switch (action.type) {
        case GET_ALL_CHATROOM_SUCCESS: {
            return state.set("chatrooms", action.payload);
        }
        case GET_ALL_CHATROOM_FAILURE: {
            return state;
        }
        case chatroomActions.JOIN_ROOM_FAILURE: {
            return state.set("state", chatroomActions.JOIN_ROOM_FAILURE)
                .set("chatDisabled", true);
        }
        case chatroomActions.JOIN_ROOM_SUCCESS: {
            return state.set("state", chatroomActions.JOIN_ROOM_SUCCESS)
                .set("chatDisabled", false);
        }
        case chatroomActions.DISABLE_CHATROOM: {
            return state.set("state", chatroomActions.DISABLE_CHATROOM)
                .set("chatDisabled", true);
        }
        case chatroomActions.ENABLE_CHATROOM: {
            return state.set("state", chatroomActions.ENABLE_CHATROOM)
                .set("chatDisabled", false);
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE)
                .set("uploadingFile", action.payload.data.target.result)
                .set("fileInfo", action.payload.file); // action.payload.form['file']
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_FAILURE)
                .set("error", JSON.stringify(action.payload.message));
        }
        case chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS: {
            return state.set("state", chatroomRxActions.CHATROOM_UPLOAD_FILE_SUCCESS)
                .set("responseFile", action.payload);
        }
        case SEND_MESSAGE_FAILURE: {
            var payload = action.payload;
            var nextState = state.set("state", SEND_MESSAGE_FAILURE)
                .set("isFetching", false)
                .set("error", payload);
            return nextState;
        }
        case ON_MESSAGE_CHANGED: {
            var payload = action.payload;
            return state.set("messages", payload);
        }
        case ON_EARLY_MESSAGE_READY: {
            var payload = action.payload;
            return state.set("state", ON_EARLY_MESSAGE_READY)
                .set("earlyMessageReady", payload);
        }
        case chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS: {
            var payload = action.payload;
            return state.set("messages", payload)
                .set("state", chatroomActions.LOAD_EARLY_MESSAGE_SUCCESS);
        }
        case chatroomRxActions.GET_PERSISTEND_MESSAGE_SUCCESS: {
            var payload = action.payload;
            return state.set("messages", payload);
        }
        case GET_NEWER_MESSAGE_SUCCESS: {
            var payload = action.payload;
            return state.set("messages", payload);
        }
        /** Create chat room */
        case chatroomRxActions.GET_MY_ROOM_SUCCESS: {
            return state.set("isFetching", false)
                .set("state", chatroomRxActions.GET_MY_ROOM_SUCCESS)
                .set("room", action.payload);
        }
        case chatroomRxActions.GET_MY_ROOM_FAILURE: {
            return state.set("isFetching", false)
                .set("state", chatroomRxActions.GET_MY_ROOM_FAILURE)
                .set("room", null);
        }
        /** Fetch chat room */
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM:
            return state.set("isFetching", true);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS:
            return state.set("room", action.payload)
                .set("isFetching", false)
                .set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_SUCCESS);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_CANCELLED:
            return state.set("isFetching", false);
        case chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE:
            return state.set("state", chatroomRxActions.FETCH_PRIVATE_CHATROOM_FAILURE)
                .set("isFetching", false)
                .set("room", null);
        case chatroomRxActions.CREATE_PRIVATE_CHATROOM_SUCCESS: {
            var result_1 = action.payload.result;
            var chatrooms = state.get("chatrooms");
            var temps = chatrooms.filter(function (chatroom) {
                return chatroom._id !== result_1[0]._id;
            });
            temps.push(result_1[0]);
            return state.set("chatrooms", temps).set("room", result_1[0]).set("isFetching", false);
        }
        /** Set room */
        case chatroomActions.GET_PERSISTEND_CHATROOM:
            return state.set("isFetching", false);
        case chatroomActions.GET_PERSISTEND_CHATROOM_SUCCESS: {
            return state.set("room", action.payload);
        }
        case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
            return state.set("room", null);
        }
        /** Set room empty */
        case chatroomActions.LEAVE_ROOM: {
            return state
                .set("state", chatroomActions.LEAVE_ROOM)
                .set("room", null)
                .set("chatTargets", []);
        }
        case chatroomActions.UPDATED_CHATROOMS: {
            return state.set("chatrooms", action.payload);
        }
        case GET_CHAT_TARGET_UID_SUCCESS: {
            return state.set("chatTargets", action.payload);
        }
        case GET_CHAT_TARGET_UID_FAILURE: {
            return state.set("chatTargets", []);
        }
        // case actions.GET_ADMIN_ROLE_IDS_SUCCESS: {
        //     return state.set("chatTargets", action.payload);
        // }
        // case actions.GET_CHAT_TARGET_ID: {
        //     return state.set("chatTargets", [action.payload]);
        // }
        default:
            return state;
    }
};
