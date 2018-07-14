/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
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
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import * as StalkNotificationAction from "./stalkNotificationActions";
import { createAction } from "redux-actions";
import InternalStore from "../../InternalStore";
const getStore = () => InternalStore.store;
export const getSessionToken = () => {
    const backendFactory = BackendFactory.getInstance();
    const store = getStore();
    if (store) {
        return store.getState().stalkReducer.stalkToken;
    }
    else {
        return "";
    }
};
const onGetContactProfileFail = (contactId) => { };
export const STALK_INIT = "STALK_INIT";
export const STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export const STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
const stalkInitFailure = createAction(STALK_INIT_FAILURE, (payload) => payload);
export const STALK_LOGOUT = "STALK_LOGOUT";
export const STALK_LOGOUT_SUCCESS = "STALK_LOGOUT_SUCCESS";
export const STALK_LOGOUT_FAILURE = "STALK_LOGOUT_FAILURE";
const stalkLogoutSuccess = createAction(STALK_LOGOUT_SUCCESS);
export function stalkLogin(user) {
    if (getStore().getState().stalkReducer.isInit) {
        console.log("s-talk service is initiated");
        return;
    }
    getStore().dispatch({ type: STALK_INIT });
    const backendFactory = BackendFactory.createInstance(InternalStore.getConfig(), InternalStore.getApiConfig());
    backendFactory.stalkInit().then((socket) => {
        backendFactory.handshake(user._id).then((connector) => {
            backendFactory.checkIn(user).then((value) => {
                console.log("Joined stalk-service success", value);
                const result = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    stalkManageConnection().then((server) => {
                        if (!!server) {
                            server.listenSocketEvents();
                            backendFactory.getServerListener();
                            backendFactory.subscriptions();
                            StalkNotificationAction.regisNotifyNewMessageEvent();
                            // StalkPushActions.stalkPushInit();
                            getStore().dispatch({
                                type: STALK_INIT_SUCCESS,
                                payload: { token: result.token, user },
                            });
                        }
                        else {
                            console.warn("Stalk subscription fail: ");
                            getStore().dispatch({ type: STALK_INIT_FAILURE, payload: "Realtime service unavailable." });
                        }
                    }).catch((err) => {
                        console.warn("Stalk subscription fail: ", err);
                        getStore().dispatch({ type: STALK_INIT_FAILURE, payload: err });
                    });
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                    getStore().dispatch({ type: STALK_INIT_FAILURE });
                }
            }).catch((err) => {
                console.warn("Cannot checkIn", err);
                getStore().dispatch({ type: STALK_INIT_FAILURE });
            });
        }).catch((err) => {
            console.warn("Hanshake fail: ", err);
            getStore().dispatch({ type: STALK_INIT_FAILURE });
        });
    }).catch((err) => {
        console.log("StalkInit Fail.", err);
        getStore().dispatch(stalkInitFailure("Realtime service unavailable."));
    });
}
export const STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export const STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export const STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
export const STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
const onStalkSocketReconnect = (data) => ({ type: STALK_ON_SOCKET_RECONNECT, payload: data });
const onStalkSocketClose = (data) => ({ type: STALK_ON_SOCKET_CLOSE, payload: data });
const onStalkSocketDisconnected = (data) => ({ type: STALK_ON_SOCKET_DISCONNECTED, payload: data });
function stalkManageConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory.getInstance();
        const server = backendFactory.getServer();
        if (!!server) {
            server.onSocketReconnect = (data) => {
                getStore().dispatch(onStalkSocketReconnect(data.type));
            };
            server.onSocketClose = (data) => {
                getStore().dispatch(onStalkSocketClose("Connection closed"));
            };
            server.onDisconnected = (data) => {
                getStore().dispatch(onStalkSocketDisconnected("Connection disconnected"));
            };
        }
        return yield server;
    });
}
export function stalkLogout() {
    return __awaiter(this, void 0, void 0, function* () {
        const backendFactory = BackendFactory.getInstance();
        getStore().dispatch(stalkLogoutSuccess());
        try {
            return yield backendFactory.logout();
        }
        catch (ex) {
            return yield ex.message;
        }
    });
}
