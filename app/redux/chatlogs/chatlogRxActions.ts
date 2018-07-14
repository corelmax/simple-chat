/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import { BackendFactory } from "stalk-js/starter";
import { RoomAccessData, StalkAccount } from "stalk-js/starter/models";
import { ChatRoomComponent } from "../../ChatRoomComponent";
import * as chatlogService from "../../services/ChatlogService";

import InternalStore from "../../InternalStore";
const getStore = () => InternalStore.store;
const authReducer = () => InternalStore.authStore;

export const STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export const STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export const STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export const STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";

export const removeRoomAccess = (roomId: string) => ({ type: STALK_REMOVE_ROOM_ACCESS, payload: roomId });
const removeRoomAccessSuccess = (payload: any) => ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload });
const removeRoomAccessCancelled = () => ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED });
const removeRoomAccessFailure = (error: any) => ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error });

export const removeRoomAccessEpic = (action$) => (
    action$.ofType(STALK_REMOVE_ROOM_ACCESS)
        .mergeMap((action) => {
            const { _id } = authReducer().user;
            return chatlogService.removeLastAccessRoomInfo(_id, action.payload);
        }).map((json) => {
            console.log("removeRoomAccess_Epic", json.response);

            const result = json.response;
            if (result.success && result.result.length > 0) {
                return removeRoomAccessSuccess(result.result);
            } else {
                return removeRoomAccessFailure(result.message);
            }
        })
        .do((x) => {
            if (x.type === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
                waitForRemovedRoom(x.payload);
            }
        })
        .takeUntil(action$.ofType(STALK_REMOVE_ROOM_ACCESS_CANCELLED))
        .catch((error) => Rx.Observable.of(removeRoomAccessFailure(error.xhr.response)))
);

const waitForRemovedRoom = async (data) => {
    const id = setInterval(() => {
        const { state } = getStore().getState().chatlogReducer;
        if (state === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
            BackendFactory.getInstance().dataListener.onAccessRoom(data);

            clearInterval(id);
        }
    }, 100);
};

const UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
export const UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export const UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
const UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";

export const updateLastAccessRoom = (roomId: string, userId: string) => ({
    type: UPDATE_LAST_ACCESS_ROOM,
    payload: ({ roomId, userId }),
});
const updateLastAccessRoomSuccess = (payload) => ({ type: UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload });
const updateLastAccessRoomFailure = (error) => ({ type: UPDATE_LAST_ACCESS_ROOM_FAILURE, payload: error });
export const updateLastAccessRoomCancelled = () => ({ type: UPDATE_LAST_ACCESS_ROOM_CANCELLED });

export const updateLastAccessRoomEpic = (action$) =>
    action$.ofType(UPDATE_LAST_ACCESS_ROOM)
        .mergeMap((action) => {
            const { room_id, user_id } = action.payload;
            return chatlogService.updateLastAccessRoomInfo(user_id, room_id);
        })
        .map((response) => {
            console.log("updateLastAccessRoom value", response.xhr.response);

            const results = response.xhr.response.result[0];
            const tempRoomAccess = results.roomAccess as RoomAccessData[];
            const roomAccess = getStore().getState().chatlogReducer.get("roomAccess") as any[];

            let newRoomAccess = new Array();
            if (Array.isArray(roomAccess)) {
                const has = roomAccess.some((value) => (value.roomId === tempRoomAccess[0].roomId));
                if (!has) {
                    roomAccess.push(tempRoomAccess[0]);
                    newRoomAccess = roomAccess.slice();
                } else {
                    newRoomAccess = roomAccess.map((value, id) => {
                        if (value.roomId === tempRoomAccess[0].roomId) {
                            value.accessTime = tempRoomAccess[0].accessTime;
                        }
                        return value;
                    });
                }
            } else {
                newRoomAccess = tempRoomAccess.slice();
            }

            BackendFactory.getInstance().dataListener.onUpdatedLastAccessTime(tempRoomAccess[0]);

            return updateLastAccessRoomSuccess(newRoomAccess);
        })
        .do((x) => {
            if (x.payload) {
                BackendFactory.getInstance().dataManager.setRoomAccessForUser(x.payload);
            }
        })
        .takeUntil(action$.ofType(UPDATE_LAST_ACCESS_ROOM_CANCELLED))
        .catch((error) => Rx.Observable.of(updateLastAccessRoomFailure(error.message)));

export const GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";

export const getLastAccessRoom = (userId: string) => ({ type: GET_LAST_ACCESS_ROOM, payload: { userId } });
const getLastAccessRoomSuccess = (payload: any) => ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload });
const getLastAccessRoomFailure = (error: any) => ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: error });

export const getLastAccessRoomEpic = (action$) => (
    action$.ofType(GET_LAST_ACCESS_ROOM)
        .mergeMap((action) => {
            const { userId } = action.payload;
            return chatlogService.getLastAccessRoomInfo(userId)
                .then((response) => response.json())
                .then((json) => json)
                .catch((err) => err);
        })
        .map((json) => getLastAccessRoomSuccess(json.result))
        .catch((json) => Rx.Observable.of(getLastAccessRoomFailure(json.message))));
