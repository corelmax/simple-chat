/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { StalkAccount } from "stalk-js/starter/models";
export declare const getSessionToken: () => any;
export declare const STALK_INIT = "STALK_INIT";
export declare const STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export declare const STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
export declare const STALK_LOGOUT = "STALK_LOGOUT";
export declare const STALK_LOGOUT_SUCCESS = "STALK_LOGOUT_SUCCESS";
export declare const STALK_LOGOUT_FAILURE = "STALK_LOGOUT_FAILURE";
export declare function stalkLogin(user: StalkAccount): void;
export declare const STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export declare const STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export declare const STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
export declare const STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
export declare function stalkLogout(): Promise<any>;
