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
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import * as Rx from "rxjs/Rx";
import { createAction } from "redux-actions";
var _a = Rx.Observable, ajax = _a.ajax, fromPromise = _a.fromPromise;
import { ChatRoomComponent } from "../../ChatRoomComponent";
import { checkOlderMessages, getNewerMessageFromNet, } from "./chatroomActions";
import { apiHeaders } from "../../services/ServiceUtils";
import * as chatroomService from "../../services/ChatroomService";
import { updateMessagesReader } from "../../services/MessageService";
import InternalStore from "../../InternalStore";
var apiConfig = function () { return InternalStore.apiConfig; };
var authReducer = function () { return InternalStore.authStore; };
var getStore = function () { return InternalStore.store; };
export var FETCH_PRIVATE_CHATROOM = "FETCH_PRIVATE_CHATROOM";
export var FETCH_PRIVATE_CHATROOM_FAILURE = "FETCH_PRIVATE_CHATROOM_FAILURE";
export var FETCH_PRIVATE_CHATROOM_SUCCESS = "FETCH_PRIVATE_CHATROOM_SUCCESS";
export var FETCH_PRIVATE_CHATROOM_CANCELLED = "FETCH_PRIVATE_CHATROOM_CANCELLED";
export var fetchPrivateChatRoom = function (ownerId, roommateId) {
    return ({ type: FETCH_PRIVATE_CHATROOM, payload: { ownerId: ownerId, roommateId: roommateId } });
};
var fetchPrivateChatRoomSuccess = function (payload) { return ({ type: FETCH_PRIVATE_CHATROOM_SUCCESS, payload: payload }); };
var cancelFetchPrivateChatRoom = function () { return ({ type: FETCH_PRIVATE_CHATROOM_CANCELLED }); };
var fetchPrivateChatRoomFailure = function (payload) { return ({ type: FETCH_PRIVATE_CHATROOM_FAILURE, payload: payload }); };
export var getPrivateChatRoom_Epic = function (action$) {
    return action$.ofType(FETCH_PRIVATE_CHATROOM)
        .mergeMap(function (action) {
        return fromPromise(chatroomService.getPrivateChatroom(action.payload.ownerId, action.payload.roommateId));
    })
        .mergeMap(function (response) { return fromPromise(response.json()); })
        .map(function (json) {
        if (json.success) {
            return fetchPrivateChatRoomSuccess(json.result[0]);
        }
        else {
            return fetchPrivateChatRoomFailure(json.message);
        }
    })._do(function (x) {
        if (x.type === FETCH_PRIVATE_CHATROOM_FAILURE) {
            console.warn("Need to create private chat room!");
        }
    })
        .takeUntil(action$.ofType(FETCH_PRIVATE_CHATROOM_CANCELLED))
        .catch(function (error) { return Rx.Observable.of(fetchPrivateChatRoomFailure(error.message)); });
};
export var CREATE_PRIVATE_CHATROOM = "CREATE_PRIVATE_CHATROOM";
export var CREATE_PRIVATE_CHATROOM_SUCCESS = "CREATE_PRIVATE_CHATROOM_SUCCESS";
export var CREATE_PRIVATE_CHATROOM_CANCELLED = "CREATE_PRIVATE_CHATROOM_CANCELLED";
export var CREATE_PRIVATE_CHATROOM_FAILURE = "CREATE_PRIVATE_CHATROOM_FAILURE";
export var createPrivateChatRoom = function (owner, roommate) { return ({
    type: CREATE_PRIVATE_CHATROOM,
    payload: { owner: owner, roommate: roommate },
}); };
var createPrivateChatRoomSuccess = function (payload) { return ({ type: CREATE_PRIVATE_CHATROOM_SUCCESS, payload: payload }); };
var createPrivateRoomCancelled = function () { return ({ type: CREATE_PRIVATE_CHATROOM_CANCELLED }); };
var createPrivateChatRoomFailure = function (payload) { return ({ type: CREATE_PRIVATE_CHATROOM_FAILURE, payload: payload }); };
export var createPrivateChatRoomEpic = function (action$) {
    return action$.ofType(CREATE_PRIVATE_CHATROOM)
        .mergeMap(function (action) { return ajax({
        method: "POST",
        url: InternalStore.apiConfig.api + "/chatroom/private_chat/create",
        body: action.payload,
        headers: apiHeaders(),
    }); })
        .map(function (json) { return createPrivateChatRoomSuccess(json.response); })
        .takeUntil(action$.ofType(CREATE_PRIVATE_CHATROOM_CANCELLED))
        .catch(function (error) { return Rx.Observable.of(createPrivateChatRoomFailure(error.xhr.response)); });
};
export var GET_MY_ROOM = "GET_MY_ROOM";
export var GET_MY_ROOM_SUCCESS = "GET_MY_ROOM_SUCCESS";
export var GET_MY_ROOM_FAILURE = "GET_MY_ROOM_FAILURE";
export var getMyRoom = createAction(GET_MY_ROOM, function (user_id, username, avatar) { return ({ user_id: user_id, username: username, avatar: avatar }); });
export var getMyRoomSuccess = createAction(GET_MY_ROOM_SUCCESS, function (payload) { return payload; });
export var getMyRoomFailure = createAction(GET_MY_ROOM_FAILURE, function (error) { return error; });
export var getMyRoomEpic = function (action$) {
    return action$.ofType(GET_MY_ROOM)
        .mergeMap(function (action) { return ajax({
        method: "GET",
        url: InternalStore.apiConfig.chatroom + "\n            /myroom?user_id=" + action.payload.user_id + "\n            &username=" + action.payload.username + "\n            &avatar=" + action.payload.avatar,
        headers: apiHeaders(),
    }); })
        .map(function (json) { return getMyRoomSuccess(json.response.result[0]); })
        .catch(function (error) { return Rx.Observable.of(getMyRoomFailure(error)); });
};
var GET_PERSISTEND_MESSAGE = "GET_PERSISTEND_MESSAGE";
var GET_PERSISTEND_MESSAGE_CANCELLED = "GET_PERSISTEND_MESSAGE_CANCELLED";
export var GET_PERSISTEND_MESSAGE_SUCCESS = "GET_PERSISTEND_MESSAGE_SUCCESS";
var GET_PERSISTEND_MESSAGE_FAILURE = "GET_PERSISTEND_MESSAGE_FAILURE";
var getPersistendMessageRequest = createAction(GET_PERSISTEND_MESSAGE, function (paylaod) { return paylaod; });
var getPersistendMessageCancel = createAction(GET_PERSISTEND_MESSAGE_CANCELLED);
var getPersistendMessageSuccess = createAction(GET_PERSISTEND_MESSAGE_SUCCESS, function (payload) { return payload; });
var getPersistendMessageFailure = createAction(GET_PERSISTEND_MESSAGE_FAILURE, function (error) { return error; });
export var getPersistendMessage = function (roomId) { return __awaiter(_this, void 0, void 0, function () {
    var result, ex_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getStore().dispatch(getPersistendMessageRequest(roomId));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ChatRoomComponent.getInstance().getPersistentMessage(roomId)];
            case 2:
                result = _a.sent();
                getStore().dispatch(getPersistendMessageSuccess(result));
                checkOlderMessages();
                getNewerMessageFromNet();
                return [3 /*break*/, 4];
            case 3:
                ex_1 = _a.sent();
                getStore().dispatch(getPersistendMessageFailure(ex_1.message));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
export var UPDATE_MESSAGES_READ = "UPDATE_MESSAGES_READ";
export var UPDATE_MESSAGES_READ_SUCCESS = "UPDATE_MESSAGES_READ_SUCCESS";
export var UPDATE_MESSAGES_READ_FAILUER = "UPDATE_MESSAGES_READ_FAILURE";
export var updateMessagesRead = createAction(UPDATE_MESSAGES_READ, function (messages, roomId) { return ({ messages: messages, roomId: roomId }); });
export var updateMessagesReadSuccess = createAction(UPDATE_MESSAGES_READ_SUCCESS, function (payload) { return payload; });
export var updateMessagesReadFailure = createAction(UPDATE_MESSAGES_READ_FAILUER, function (payload) { return payload; });
export var updateMessagesRead_Epic = function (action$) {
    return action$.ofType(UPDATE_MESSAGES_READ)
        .mergeMap(function (action) {
        var messages = action.payload.messages;
        var updates = messages.map(function (value) {
            if (value.sender !== authReducer().user._id) {
                return value._id;
            }
        });
        return updateMessagesReader(updates, action.payload.room_id);
    })
        .mergeMap(function (response) { return response.json(); })
        .map(function (json) {
        if (json.success) {
            return updateMessagesReadSuccess(json);
        }
        else {
            return updateMessagesReadFailure(json.message);
        }
    })
        .catch(function (error) { return Rx.Observable.of(updateMessagesReadFailure(error)); });
};
export var CHATROOM_UPLOAD_FILE = "CHATROOM_UPLOAD_FILE";
export var CHATROOM_UPLOAD_FILE_SUCCESS = "CHATROOM_UPLOAD_FILE_SUCCESS";
export var CHATROOM_UPLOAD_FILE_FAILURE = "CHATROOM_UPLOAD_FILE_FAILURE";
export var CHATROOM_UPLOAD_FILE_CANCELLED = "CHATROOM_UPLOAD_FILE_CANCELLED";
export var uploadFile = function (progressEvent, file) { return ({ type: CHATROOM_UPLOAD_FILE, payload: { data: progressEvent, file: file } }); };
var uploadFileSuccess = function (result) { return ({ type: CHATROOM_UPLOAD_FILE_SUCCESS, payload: result }); };
var uploadFileFailure = function (error) { return ({ type: CHATROOM_UPLOAD_FILE_FAILURE, payload: error }); };
export var uploadFileCanceled = function () { return ({ type: CHATROOM_UPLOAD_FILE_CANCELLED }); };
export var uploadFileEpic = function (action$) { return (action$.ofType(CHATROOM_UPLOAD_FILE)
    .mergeMap(function (action) {
    var body = new FormData();
    body.append("file", action.payload.file);
    return ajax({
        method: "POST",
        url: "" + apiConfig().fileUpload,
        body: body,
        headers: {},
    });
})
    .map(function (json) { return uploadFileSuccess(json.response); })
    .takeUntil(action$.ofType(CHATROOM_UPLOAD_FILE_CANCELLED))
    .catch(function (error) { return Rx.Observable.of(uploadFileFailure(error.xhr.response)); })); };
