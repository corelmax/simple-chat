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
import * as Rx from "rxjs/Rx";
var ajax = Rx.Observable.ajax;
import { BackendFactory } from "stalk-js/starter";
import * as chatlogService from "../../services/ChatlogService";
import InternalStore from "../../InternalStore";
var getStore = function () { return InternalStore.store; };
var authReducer = function () { return InternalStore.authStore; };
export var STALK_REMOVE_ROOM_ACCESS = "STALK_REMOVE_ROOM_ACCESS";
export var STALK_REMOVE_ROOM_ACCESS_FAILURE = "STALK_REMOVE_ROOM_ACCESS_FAILURE";
export var STALK_REMOVE_ROOM_ACCESS_SUCCESS = "STALK_REMOVE_ROOM_ACCESS_SUCCESS";
export var STALK_REMOVE_ROOM_ACCESS_CANCELLED = "STALK_REMOVE_ROOM_ACCESS_CANCELLED";
export var removeRoomAccess = function (roomId) { return ({ type: STALK_REMOVE_ROOM_ACCESS, payload: roomId }); };
var removeRoomAccess_Success = function (payload) { return ({ type: STALK_REMOVE_ROOM_ACCESS_SUCCESS, payload: payload }); };
var removeRoomAccess_Cancelled = function () { return ({ type: STALK_REMOVE_ROOM_ACCESS_CANCELLED }); };
var removeRoomAccess_Failure = function (error) { return ({ type: STALK_REMOVE_ROOM_ACCESS_FAILURE, payload: error }); };
export var removeRoomAccess_Epic = function (action$) { return (action$.ofType(STALK_REMOVE_ROOM_ACCESS)
    .mergeMap(function (action) {
    var _id = authReducer().user._id;
    return chatlogService.removeLastAccessRoomInfo(_id, action.payload);
}).map(function (json) {
    console.log("removeRoomAccess_Epic", json.response);
    var result = json.response;
    if (result.success && result.result.length > 0) {
        return removeRoomAccess_Success(result.result);
    }
    else {
        return removeRoomAccess_Failure(result.message);
    }
})
    .do(function (x) {
    if (x.type === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
        waitForRemovedRoom(x.payload);
    }
})
    .takeUntil(action$.ofType(STALK_REMOVE_ROOM_ACCESS_CANCELLED))
    .catch(function (error) { return Rx.Observable.of(removeRoomAccess_Failure(error.xhr.response)); })); };
var waitForRemovedRoom = function (data) { return __awaiter(_this, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        id = setInterval(function () {
            var state = getStore().getState().chatlogReducer.state;
            if (state === STALK_REMOVE_ROOM_ACCESS_SUCCESS) {
                BackendFactory.getInstance().dataListener.onAccessRoom(data);
                clearInterval(id);
            }
        }, 100);
        return [2 /*return*/];
    });
}); };
var UPDATE_LAST_ACCESS_ROOM = "UPDATE_LAST_ACCESS_ROOM";
export var UPDATE_LAST_ACCESS_ROOM_SUCCESS = "UPDATE_LAST_ACCESS_ROOM_SUCCESS";
export var UPDATE_LAST_ACCESS_ROOM_FAILURE = "UPDATE_LAST_ACCESS_ROOM_FAILURE";
var UPDATE_LAST_ACCESS_ROOM_CANCELLED = "UPDATE_LAST_ACCESS_ROOM_CANCELLED";
export var updateLastAccessRoom = function (roomId, userId) { return ({ type: UPDATE_LAST_ACCESS_ROOM, payload: ({ roomId: roomId, userId: userId }) }); };
var updateLastAccessRoomSuccess = function (payload) { return ({ type: UPDATE_LAST_ACCESS_ROOM_SUCCESS, payload: payload }); };
var updateLastAccessRoomFailure = function (error) { return ({ type: UPDATE_LAST_ACCESS_ROOM_FAILURE, payload: error }); };
export var updateLastAccessRoomCancelled = function () { return ({ type: UPDATE_LAST_ACCESS_ROOM_CANCELLED }); };
export var updateLastAccessRoom_Epic = function (action$) {
    return action$.ofType(UPDATE_LAST_ACCESS_ROOM)
        .mergeMap(function (action) {
        var _a = action.payload, room_id = _a.room_id, user_id = _a.user_id;
        return chatlogService.updateLastAccessRoomInfo(user_id, room_id);
    })
        .map(function (response) {
        console.log("updateLastAccessRoom value", response.xhr.response);
        var results = response.xhr.response.result[0];
        var _tempRoomAccess = results.roomAccess;
        var roomAccess = getStore().getState().chatlogReducer.get("roomAccess");
        var _newRoomAccess = new Array();
        if (Array.isArray(roomAccess)) {
            var _has = roomAccess.some(function (value) { return (value.roomId === _tempRoomAccess[0].roomId); });
            if (!_has) {
                roomAccess.push(_tempRoomAccess[0]);
                _newRoomAccess = roomAccess.slice();
            }
            else {
                _newRoomAccess = roomAccess.map(function (value, id) {
                    if (value.roomId === _tempRoomAccess[0].roomId) {
                        value.accessTime = _tempRoomAccess[0].accessTime;
                    }
                    return value;
                });
            }
        }
        else {
            _newRoomAccess = _tempRoomAccess.slice();
        }
        BackendFactory.getInstance().dataListener.onUpdatedLastAccessTime(_tempRoomAccess[0]);
        return updateLastAccessRoomSuccess(_newRoomAccess);
    })
        .do(function (x) {
        if (x.payload) {
            BackendFactory.getInstance().dataManager.setRoomAccessForUser(x.payload);
        }
    })
        .takeUntil(action$.ofType(UPDATE_LAST_ACCESS_ROOM_CANCELLED))
        .catch(function (error) { return Rx.Observable.of(updateLastAccessRoomFailure(error.message)); });
};
export var GET_LAST_ACCESS_ROOM = "GET_LAST_ACCESS_ROOM";
export var GET_LAST_ACCESS_ROOM_SUCCESS = "GET_LAST_ACCESS_ROOM_SUCCESS";
export var GET_LAST_ACCESS_ROOM_FAILURE = "GET_LAST_ACCESS_ROOM_FAILURE";
export var getLastAccessRoom = function (user_id) { return ({ type: GET_LAST_ACCESS_ROOM, payload: { user_id: user_id } }); };
var getLastAccessRoomSuccess = function (payload) { return ({ type: GET_LAST_ACCESS_ROOM_SUCCESS, payload: payload }); };
var getLastAccessRoomFailure = function (error) { return ({ type: GET_LAST_ACCESS_ROOM_FAILURE, payload: error }); };
export var getLastAccessRoom_Epic = function (action$) { return (action$.ofType(GET_LAST_ACCESS_ROOM)
    .mergeMap(function (action) {
    var user_id = action.payload.user_id;
    return chatlogService.getLastAccessRoomInfo(user_id)
        .then(function (response) { return response.json(); })
        .then(function (json) { return json; })
        .catch(function (err) { return err; });
})
    .map(function (json) { return getLastAccessRoomSuccess(json.result); })
    .catch(function (json) { return Rx.Observable.of(getLastAccessRoomFailure(json.message)); })); };
