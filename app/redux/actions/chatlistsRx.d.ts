/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import * as Rx from "rxjs/Rx";
export declare const GET_ALL_CHATROOM_SUCCESS = "GET_ALL_CHATROOM_SUCCESS";
export declare const GET_ALL_CHATROOM_FAILURE = "GET_ALL_CHATROOM_FAILURE";
export declare const getAllChatRoom: () => void;
export declare const GET_RECENT_MESSAGE_SUCCESS = "GET_RECENT_MESSAGE_SUCCESS";
export declare const GET_RECENT_MESSAGE_FAILURE = "GET_RECENT_MESSAGE_FAILURE";
export declare function getRecentMessage(): Rx.Observable<{}>;
export declare const getRecentMessageEpic: (action$: any) => any;
export declare const initChatlogsEpic: (action$: any) => any;
export declare const autoInitChatlogEpic: (action$: any) => any;
