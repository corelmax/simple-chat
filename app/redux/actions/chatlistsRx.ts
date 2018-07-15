/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
import { RoomAccessData, StalkAccount } from "stalk-js/starter/models";
import { getUnreadMessage } from "../../ChatslogComponent";

import { apiHeaders, withToken } from "../../services/ServiceUtils";
import { getLastAccessRoom, ON_CHATLOG_CHANGE, STALK_INIT_CHATLOG } from "../chatlogs";

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
const getAllChatRoomSuccess = createAction(GET_ALL_CHATROOM_SUCCESS, (payload: any) => payload);
const getAllChatRoomFailure = createAction(GET_ALL_CHATROOM_FAILURE, (error: any) => error);

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

export const getRecentMessageEpic = (action$) =>
    action$.filter((action) => action.type === GET_ALL_CHATROOM_SUCCESS || action.type === ON_CHATLOG_CHANGE)
        .mergeMap((action) => {
            const chatroomReducer = getStore().getState().chatroomReducer;
            const { roomAccess }: { roomAccess: RoomAccessData[] } = getStore().getState().chatlogReducer;
            const { _id } = getAuthStore().user;
            const chatlogs = new Array<{ rid, count, lastMessage }>();

            const rooms = chatroomReducer.get("chatrooms");

            let access = [] as RoomAccessData[];
            if (!!roomAccess) { access = roomAccess.slice(); }
            rooms.map((item) => {
                const has = access.some((acc) =>
                    (acc.roomId === item._id));
                if (!has) {
                    access.push(new RoomAccessData(item._id, item.createTime));
                }
            });

            return Rx.Observable.fromPromise(new Promise((resolve, reject) => {
                Rx.Observable.from(access)
                    .map(async (room) => {
                        const value = await getUnreadMessage(_id, new RoomAccessData(room.roomId, room.accessTime));
                        const log = { rid: value.rid, count: value.count, lastMessage: value.message };
                        return log;
                    })
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
        .catch((error) => {
            console.warn("errrrrrr", error);
            return Rx.Observable.of(getRecentMessageFailure(error));
        });

export const initChatlogsEpic = (action$) =>
    action$.ofType(STALK_INIT_CHATLOG)
        .mergeMap(async (action) => {
            const { _id } = getAuthStore().user;
            return await _id;
        }).map((id) => getLastAccessRoom(id));
