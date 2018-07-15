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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import * as StalkNotificationAction from "./stalkNotificationActions";
import { createAction } from "redux-actions";
import InternalStore from "../../InternalStore";
var getStore = function () { return InternalStore.store; };
export var getSessionToken = function () {
    var backendFactory = BackendFactory.getInstance();
    var store = getStore();
    if (store) {
        return store.getState().stalkReducer.stalkToken;
    }
    else {
        return "";
    }
};
var onGetContactProfileFail = function (contactId) {
    // Event delegate function.
};
export var STALK_INIT = "STALK_INIT";
export var STALK_INIT_SUCCESS = "STALK_INIT_SUCCESS";
export var STALK_INIT_FAILURE = "STALK_INIT_FAILURE";
var stalkInitFailure = createAction(STALK_INIT_FAILURE, function (payload) { return payload; });
export var STALK_LOGOUT = "STALK_LOGOUT";
export var STALK_LOGOUT_SUCCESS = "STALK_LOGOUT_SUCCESS";
export var STALK_LOGOUT_FAILURE = "STALK_LOGOUT_FAILURE";
var stalkLogoutSuccess = createAction(STALK_LOGOUT_SUCCESS);
export function stalkLogin(user) {
    if (getStore().getState().stalkReducer.isInit) {
        console.log("s-talk service is initiated");
        return;
    }
    getStore().dispatch({ type: STALK_INIT });
    var backendFactory = BackendFactory.createInstance(InternalStore.getConfig(), InternalStore.getApiConfig());
    backendFactory.stalkInit().then(function (socket) {
        backendFactory.handshake(user._id).then(function (connector) {
            backendFactory.checkIn(user).then(function (value) {
                console.log("Joined stalk-service success", value);
                var result = JSON.parse(JSON.stringify(value.data));
                if (result.success) {
                    stalkManageConnection().then(function (server) {
                        if (!!server) {
                            server.listenSocketEvents();
                            backendFactory.getServerListener();
                            backendFactory.subscriptions();
                            StalkNotificationAction.regisNotifyNewMessageEvent();
                            // StalkPushActions.stalkPushInit();
                            getStore().dispatch({
                                type: STALK_INIT_SUCCESS,
                                payload: { token: result.token, user: user },
                            });
                        }
                        else {
                            console.warn("Stalk subscription fail: ");
                            getStore().dispatch({ type: STALK_INIT_FAILURE, payload: "Realtime service unavailable." });
                        }
                    }).catch(function (err) {
                        console.warn("Stalk subscription fail: ", err);
                        getStore().dispatch({ type: STALK_INIT_FAILURE, payload: err });
                    });
                }
                else {
                    console.warn("Joined chat-server fail: ", result);
                    getStore().dispatch({ type: STALK_INIT_FAILURE });
                }
            }).catch(function (err) {
                console.warn("Cannot checkIn", err);
                getStore().dispatch({ type: STALK_INIT_FAILURE });
            });
        }).catch(function (err) {
            console.warn("Hanshake fail: ", err);
            getStore().dispatch({ type: STALK_INIT_FAILURE });
        });
    }).catch(function (err) {
        console.log("StalkInit Fail.", err);
        getStore().dispatch(stalkInitFailure("Realtime service unavailable."));
    });
}
export var STALK_ON_SOCKET_RECONNECT = "STALK_ON_SOCKET_RECONNECT";
export var STALK_ON_SOCKET_CLOSE = "STALK_ON_SOCKET_CLOSE";
export var STALK_ON_SOCKET_DISCONNECTED = "STALK_ON_SOCKET_DISCONNECTED";
export var STALK_CONNECTION_PROBLEM = "STALK_CONNECTION_PROBLEM";
var onStalkSocketReconnect = function (data) { return ({ type: STALK_ON_SOCKET_RECONNECT, payload: data }); };
var onStalkSocketClose = function (data) { return ({ type: STALK_ON_SOCKET_CLOSE, payload: data }); };
var onStalkSocketDisconnected = function (data) { return ({ type: STALK_ON_SOCKET_DISCONNECTED, payload: data }); };
function stalkManageConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var backendFactory, server;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backendFactory = BackendFactory.getInstance();
                    server = backendFactory.getServer();
                    if (!!server) {
                        server.onSocketReconnect = function (data) {
                            getStore().dispatch(onStalkSocketReconnect(data.type));
                        };
                        server.onSocketClose = function (data) {
                            getStore().dispatch(onStalkSocketClose("Connection closed"));
                        };
                        server.onDisconnected = function (data) {
                            getStore().dispatch(onStalkSocketDisconnected("Connection disconnected"));
                        };
                    }
                    return [4 /*yield*/, server];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function stalkLogout() {
    return __awaiter(this, void 0, void 0, function () {
        var backendFactory, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backendFactory = BackendFactory.getInstance();
                    getStore().dispatch(stalkLogoutSuccess());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, backendFactory.logout()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    ex_1 = _a.sent();
                    return [4 /*yield*/, ex_1.message];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [2 /*return*/];
            }
        });
    });
}
