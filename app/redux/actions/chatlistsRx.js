"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const ChatslogComponent_1 = require("../../ChatslogComponent");
const models_1 = require("stalk-js/starter/models");
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const chatlogs_1 = require("../chatlogs");
const ServiceUtils_1 = require("../../services/ServiceUtils");
const InternalStore_1 = require("../../InternalStore");
const { ajax } = Rx.Observable;
const config = () => InternalStore_1.default.config;
const getApiConfig = () => InternalStore_1.default.apiConfig;
const getAuthStore = () => InternalStore_1.default.authStore;
const getStore = () => InternalStore_1.default.store;
const GET_ALL_CHATROOM = "GET_ALL_CHATROOM";
exports.GET_ALL_CHATROOM_SUCCESS = "GET_ALL_CHATROOM_SUCCESS";
exports.GET_ALL_CHATROOM_FAILURE = "GET_ALL_CHATROOM_FAILURE";
const getAllChatRoomRequest = redux_actions_1.createAction(GET_ALL_CHATROOM);
const getAllChatRoomSuccess = redux_actions_1.createAction(exports.GET_ALL_CHATROOM_SUCCESS, (payload) => payload);
const getAllChatRoomFailure = redux_actions_1.createAction(exports.GET_ALL_CHATROOM_FAILURE, (error) => error);
exports.getAllChatRoom = () => {
    getStore().dispatch(getAllChatRoomRequest());
    const observable = ajax.get(`${getApiConfig().chatroom}/all`, ServiceUtils_1.apiHeaders());
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
exports.GET_RECENT_MESSAGE_SUCCESS = "GET_RECENT_MESSAGE_SUCCESS";
exports.GET_RECENT_MESSAGE_FAILURE = "GET_RECENT_MESSAGE_FAILURE";
const getRecentMessageSuccess = redux_actions_1.createAction(exports.GET_RECENT_MESSAGE_SUCCESS, (payload) => payload);
const getRecentMessageFailure = redux_actions_1.createAction(exports.GET_RECENT_MESSAGE_FAILURE, (error) => error);
exports.getRecentMessage_Epic = (action$) => action$.filter((action) => action.type === exports.GET_ALL_CHATROOM_SUCCESS || action.type === chatlogs_1.ON_CHATLOG_CHANGE)
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
            access.push(new models_1.RoomAccessData(item._id, item.createTime));
        }
    });
    return Rx.Observable.fromPromise(new Promise((resolve, reject) => {
        Rx.Observable.from(access)
            .map((room) => __awaiter(this, void 0, void 0, function* () {
            const value = yield ChatslogComponent_1.getUnreadMessage(id, new models_1.RoomAccessData(room.roomId, room.accessTime));
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
exports.initChatlogs_Epic = (action$) => action$.ofType(chatlogs_1.STALK_INIT_CHATLOG)
    .mergeMap((action) => __awaiter(this, void 0, void 0, function* () {
    const { id } = getAuthStore().user;
    return yield id;
})).map((id) => chatlogs_1.getLastAccessRoom(id));
