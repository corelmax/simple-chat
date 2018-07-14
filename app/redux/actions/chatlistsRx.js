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
var _this = this;
import { getUnreadMessage } from "../../ChatslogComponent";
import { RoomAccessData } from "stalk-js/starter/models";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
import { getLastAccessRoom, STALK_INIT_CHATLOG, ON_CHATLOG_CHANGE } from "../chatlogs";
import { apiHeaders } from "../../services/ServiceUtils";
import InternalStore from "../../InternalStore";
var ajax = Rx.Observable.ajax;
var config = function () { return InternalStore.config; };
var getApiConfig = function () { return InternalStore.apiConfig; };
var getAuthStore = function () { return InternalStore.authStore; };
var getStore = function () { return InternalStore.store; };
var GET_ALL_CHATROOM = "GET_ALL_CHATROOM";
export var GET_ALL_CHATROOM_SUCCESS = "GET_ALL_CHATROOM_SUCCESS";
export var GET_ALL_CHATROOM_FAILURE = "GET_ALL_CHATROOM_FAILURE";
var getAllChatRoomRequest = createAction(GET_ALL_CHATROOM);
var getAllChatRoomSuccess = createAction(GET_ALL_CHATROOM_SUCCESS, function (payload) { return payload; });
var getAllChatRoomFailure = createAction(GET_ALL_CHATROOM_FAILURE, function (error) { return error; });
export var getAllChatRoom = function () {
    getStore().dispatch(getAllChatRoomRequest());
    var observable = ajax.get(getApiConfig().chatroom + "/all", apiHeaders());
    observable.subscribe(function (x) {
        getStore().dispatch(getAllChatRoomSuccess(x.response.result));
    }, function (error) {
        console.warn(error);
        getStore().dispatch(getAllChatRoomFailure(error.response));
    }, function () {
        console.log("done");
    });
};
var GET_RECENT_MESSAGE = "GET_RECENT_MESSAGE";
export var GET_RECENT_MESSAGE_SUCCESS = "GET_RECENT_MESSAGE_SUCCESS";
export var GET_RECENT_MESSAGE_FAILURE = "GET_RECENT_MESSAGE_FAILURE";
var getRecentMessageSuccess = createAction(GET_RECENT_MESSAGE_SUCCESS, function (payload) { return payload; });
var getRecentMessageFailure = createAction(GET_RECENT_MESSAGE_FAILURE, function (error) { return error; });
export var getRecentMessage_Epic = function (action$) {
    return action$.filter(function (action) { return action.type === GET_ALL_CHATROOM_SUCCESS || action.type === ON_CHATLOG_CHANGE; })
        .mergeMap(function (action) {
        var chatroomReducer = getStore().getState().chatroomReducer;
        var roomAccess = getStore().getState().chatlogReducer.roomAccess;
        var id = getAuthStore().user.id;
        var chatlogs = new Array();
        var rooms = chatroomReducer.get("chatrooms");
        var access = [];
        if (!!roomAccess) {
            access = roomAccess.slice();
        }
        rooms.map(function (item) {
            var has = access.some(function (acc) {
                return (acc.roomId === item._id);
            });
            if (!has) {
                access.push(new RoomAccessData(item._id, item.createTime));
            }
        });
        return Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
            Rx.Observable.from(access)
                .map(function (room) { return __awaiter(_this, void 0, void 0, function () {
                var value, log;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getUnreadMessage(id, new RoomAccessData(room.roomId, room.accessTime))];
                        case 1:
                            value = _a.sent();
                            log = { rid: value.rid, count: value.count, lastMessage: value.message };
                            return [2 /*return*/, log];
                    }
                });
            }); })
                .flatMap(function (data) { return data; })
                .subscribe(function (log) {
                chatlogs.push(log);
            }, function (err) {
                reject(err);
            }, function () {
                resolve(chatlogs);
            });
        }));
    })
        .map(function (response) { return getRecentMessageSuccess(response); })
        .catch(function (error) { console.warn("errrrrrr", error); return Rx.Observable.of(getRecentMessageFailure(error)); });
};
export var initChatlogs_Epic = function (action$) {
    return action$.ofType(STALK_INIT_CHATLOG)
        .mergeMap(function (action) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = getAuthStore().user.id;
                    return [4 /*yield*/, id];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }).map(function (id) { return getLastAccessRoom(id); });
};
