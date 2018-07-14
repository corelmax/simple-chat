/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUnreadMessage } from "../../ChatslogComponent";
import { RoomAccessData } from "stalk-js/starter/models";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
import { getLastAccessRoom, STALK_INIT_CHATLOG, ON_CHATLOG_CHANGE } from "../chatlogs";
import { apiHeaders } from "../../services/ServiceUtils";
import InternalStore from "../../InternalStore";
const { ajax } = Rx.Observable;
const config = () => InternalStore.config;
const getApiConfig = () => InternalStore.apiConfig;
const getAuthStore = () => InternalStore.authStore;
const getStore = () => InternalStore.store;
const GET_ALL_CHATROOM = "GET_ALL_CHATROOM";
export const GET_ALL_CHATROOM_SUCCESS = "GET_ALL_CHATROOM_SUCCESS";
export const GET_ALL_CHATROOM_FAILURE = "GET_ALL_CHATROOM_FAILURE";
const getAllChatRoomRequest = createAction(GET_ALL_CHATROOM);
const getAllChatRoomSuccess = createAction(GET_ALL_CHATROOM_SUCCESS, (payload) => payload);
const getAllChatRoomFailure = createAction(GET_ALL_CHATROOM_FAILURE, (error) => error);
export const getAllChatRoom = () => {
    getStore().dispatch(getAllChatRoomRequest());
    const observable = ajax.get(`${getApiConfig().chatroom}/all`, apiHeaders());
    observable.subscribe((x) => {
        getStore().dispatch(getAllChatRoomSuccess(x.response.result));
    }, (error) => {
        console.warn(error);
        getStore().dispatch(getAllChatRoomFailure(error.response));
    }, () => {
        console.log("done");
    });
};
const GET_RECENT_MESSAGE = "GET_RECENT_MESSAGE";
export const GET_RECENT_MESSAGE_SUCCESS = "GET_RECENT_MESSAGE_SUCCESS";
export const GET_RECENT_MESSAGE_FAILURE = "GET_RECENT_MESSAGE_FAILURE";
const getRecentMessageSuccess = createAction(GET_RECENT_MESSAGE_SUCCESS, (payload) => payload);
const getRecentMessageFailure = createAction(GET_RECENT_MESSAGE_FAILURE, (error) => error);
export const getRecentMessage_Epic = (action$) => action$.filter((action) => action.type === GET_ALL_CHATROOM_SUCCESS || action.type === ON_CHATLOG_CHANGE)
    .mergeMap((action) => {
    const chatroomReducer = getStore().getState().chatroomReducer;
    const { roomAccess } = getStore().getState().chatlogReducer;
    const { id } = getAuthStore().user;
    const chatlogs = new Array();
    const rooms = chatroomReducer.get("chatrooms");
    let access = [];
    if (!!roomAccess) {
        access = roomAccess.slice();
    }
    rooms.map((item) => {
        const has = access.some((acc) => (acc.roomId === item._id));
        if (!has) {
            access.push(new RoomAccessData(item._id, item.createTime));
        }
    });
    return Rx.Observable.fromPromise(new Promise((resolve, reject) => {
        Rx.Observable.from(access)
            .map((room) => __awaiter(this, void 0, void 0, function* () {
            const value = yield getUnreadMessage(id, new RoomAccessData(room.roomId, room.accessTime));
            const log = { rid: value.rid, count: value.count, lastMessage: value.message };
            return log;
        }))
            .flatMap((data) => data)
            .subscribe((log) => {
            chatlogs.push(log);
        }, (err) => {
            reject(err);
        }, () => {
            resolve(chatlogs);
        });
    }));
})
    .map((response) => getRecentMessageSuccess(response))
    .catch((error) => { console.warn("errrrrrr", error); return Rx.Observable.of(getRecentMessageFailure(error)); });
export const initChatlogs_Epic = (action$) => action$.ofType(STALK_INIT_CHATLOG)
    .mergeMap((action) => __awaiter(this, void 0, void 0, function* () {
    const { id } = getAuthStore().user;
    return yield id;
})).map((id) => getLastAccessRoom(id));
