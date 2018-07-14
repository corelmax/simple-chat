/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
export declare const STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export declare const STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export declare const STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export declare const STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";
export declare const removeRoomAccess: (roomId: string) => {
    type: string;
    payload: string;
};
export declare const removeRoomAccessEpic: (action$: any) => any;
export declare const UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export declare const UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
export declare const updateLastAccessRoom: (roomId: string, userId: string) => {
    type: string;
    payload: {
        roomId: string;
        userId: string;
    };
};
export declare const updateLastAccessRoomCancelled: () => {
    type: string;
};
export declare const updateLastAccessRoomEpic: (action$: any) => any;
export declare const GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export declare const GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export declare const GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
export declare const getLastAccessRoom: (userId: string) => {
    type: string;
    payload: {
        userId: string;
    };
};
export declare const getLastAccessRoomEpic: (action$: any) => any;
