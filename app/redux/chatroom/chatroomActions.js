/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
import * as R from "ramda";
import { createAction } from "redux-actions";
import { ChatEvents, HttpStatusCode } from "stalk-js/stalkjs";
import { BackendFactory } from "stalk-js/starter";
import { MessageType } from "stalk-js/starter/models";
import { ChatRoomComponent, ON_MESSAGE_CHANGE } from "../../ChatRoomComponent";
import { RoomType, } from "../../models";
import { SecureServiceFactory } from "../../utils/secure/SecureServiceFactory";
import * as chatroomService from "../../services/ChatroomService";
import * as MessageService from "../../services/MessageService";
import * as NotificationManager from "../stalkBridge/stalkNotificationActions";
import { updateLastAccessRoom } from "../chatlogs/chatlogRxActions";
import { updateMessagesRead } from "./chatroomRxEpic";
import InternalStore from "../../InternalStore";
var getConfig = function () { return InternalStore.config; };
var getStore = function () { return InternalStore.store; };
var authReducer = function () { return InternalStore.authStore; };
/**
 * ChatRoomActionsType
 */
export var REPLACE_MESSAGE = "REPLACE_MESSAGE";
export var ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
export function initChatRoom(currentRoom) {
    if (!currentRoom) {
        throw new Error("Empty roomInfo");
    }
    var roomName = currentRoom.owner;
    if (!roomName && currentRoom.type === RoomType.privateChat) {
        if (Array.isArray(currentRoom.members)) {
            currentRoom.members.some(function (v) {
                if (v._id !== InternalStore.authStore.user._id) {
                    currentRoom.owner.username = v.username;
                    return true;
                }
                return false;
            });
        }
    }
    var chatroomComp = ChatRoomComponent.createInstance(InternalStore.dataManager);
    chatroomComp.setRoomId(currentRoom._id);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
function onChatRoomDelegate(event, data) {
    if (event === ChatEvents.ON_CHAT) {
        console.log("onChatRoomDelegate: ", ChatEvents.ON_CHAT, data);
        var messageImp = data;
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (InternalStore.authStore.user._id === messageImp.sender) {
            // dispatch(replaceMyMessage(newMsg));
            console.log("is my message");
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            var appState = InternalStore.appStateEvent;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    MessageService.updateMessageReader(messageImp._id, messageImp.rid)
                        .then(function (response) { return response.json(); }).then(function (value) {
                        console.log("updateMessageReader: ", value);
                    }).catch(function (err) {
                        console.warn("updateMessageReader: ", err);
                    });
                }
                else if (appState !== "active") {
                    // @ When user joined room but appState is inActive.
                    // sharedObjectService.getNotifyManager().notify(newMsg, appBackground, localNotifyService);
                    console.warn("Call local notification here...");
                }
            }
        }
    }
    else if (event === ON_MESSAGE_CHANGE) {
        getStore().dispatch(onMessageChangedAction(data));
    }
}
function onOutSideRoomDelegate(event, data) {
    console.log("Call notification here..."); // active, background, inactive
    if (event === ChatEvents.ON_CHAT) {
        NotificationManager.notify(data);
    }
}
export var ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
var onMessageChangedAction = createAction(ON_MESSAGE_CHANGED, function (messages) { return messages; });
var onEarlyMessageReady = function (data) { return ({ type: ON_EARLY_MESSAGE_READY, payload: data }); };
export function checkOlderMessages() {
    var room = getStore().getState().chatroomReducer.room;
    ChatRoomComponent.getInstance().getTopEdgeMessageTime().then(function (res) {
        chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
            .then(function (response) { return response.json(); })
            .then(function (result) {
            console.log("getOlderMessagesCount", result);
            if (result.success && result.result > 0) {
                // console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                getStore().dispatch(onEarlyMessageReady(true));
            }
            else {
                // console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                getStore().dispatch(onEarlyMessageReady(false));
            }
        }).catch(function (err) {
            console.warn("getOlderMessagesCount fail", err);
            getStore().dispatch(onEarlyMessageReady(false));
        });
    });
}
export var LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
var loadEarlyMessageSuccess = function (payload) { return ({ type: LOAD_EARLY_MESSAGE_SUCCESS, payload: payload }); };
export function loadEarlyMessageChunk(roomId) {
    ChatRoomComponent.getInstance().getOlderMessageChunk(roomId).then(function (docs) {
        getStore().dispatch(loadEarlyMessageSuccess(docs));
        // @check older message again.
        checkOlderMessages();
        // # update messages read.
        if (docs.length > 0) {
            getStore().dispatch(updateMessagesRead(docs, roomId));
        }
    }).catch(function (err) {
        console.warn("loadEarlyMessageChunk fail", err);
    });
}
export var GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
export var GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
export var GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
var getNewerMessage = createAction(GET_NEWER_MESSAGE);
var getNewerMessageFailure = createAction(GET_NEWER_MESSAGE_FAILURE);
var getNewerMessageSuccess = createAction(GET_NEWER_MESSAGE_SUCCESS, function (messages) { return messages; });
export function getNewerMessageFromNet() {
    getStore().dispatch(getNewerMessage());
    ChatRoomComponent.getInstance().getNewerMessageRecord(function (results, roomId) {
        getStore().dispatch(getNewerMessageSuccess(results));
        // # update messages read.
        if (results.length > 0) {
            // getStore().dispatch(updateMessagesRead(results as MessageImp[], roomId));
        }
    }).catch(function (err) {
        if (err) {
            console.warn("getNewerMessageRecord fail", err);
        }
        getStore().dispatch(getNewerMessageFailure());
    });
}
export function getMessages() {
    return __awaiter(this, void 0, void 0, function () {
        var chatroomComp, messages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatroomComp = ChatRoomComponent.getInstance();
                    return [4 /*yield*/, chatroomComp.getMessages()];
                case 1:
                    messages = _a.sent();
                    return [2 /*return*/, messages];
            }
        });
    });
}
var SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
var SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
export var SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
var sendMessageRequest = function () { return ({ type: SEND_MESSAGE_REQUEST }); };
var sendMessageSuccess = function () { return ({ type: SEND_MESSAGE_SUCCESS }); };
var sendMessageFailure = function (error) { return ({ type: SEND_MESSAGE_FAILURE, payload: error }); };
export function sendMessage(message) {
    getStore().dispatch(sendMessageRequest());
    var backendFactory = BackendFactory.getInstance();
    var server = backendFactory.getServer();
    if (message.type === MessageType[MessageType.Text] && InternalStore.encryption === true) {
        var secure = SecureServiceFactory.getService();
        secure.encryption(message.body).then(function (result) {
            message.body = result;
            if (!!server) {
                var msg = {};
                msg.data = message;
                msg["x-api-key"] = getConfig().apiKey;
                msg["api-version"] = getConfig().apiVersion;
                server.getSocket().request("chat.chatHandler.pushByUids", msg, function (response) {
                    if (response.code !== 200) {
                        sendMessageResponse(response, null);
                    }
                    else {
                        sendMessageResponse(null, response);
                    }
                });
            }
            else {
                console.warn("Stalk server not initialized");
            }
        }).catch(function (err) {
            console.warn(err);
            getStore().dispatch(sendMessageFailure(err));
        });
    }
    else {
        if (!!server) {
            var msg = {};
            msg.data = message;
            msg["x-api-key"] = getConfig().apiKey;
            msg["api-version"] = getConfig().apiVersion;
            server.getSocket().request("chat.chatHandler.pushByUids", msg, function (result) {
                if (result.code !== 200) {
                    sendMessageResponse(result, null);
                }
                else {
                    sendMessageResponse(null, result);
                }
            });
        }
        else {
            console.warn("Stalk server not initialized");
        }
    }
}
function sendMessageResponse(err, res) {
    if (!!err) {
        getStore().dispatch(sendMessageFailure(err.message));
    }
    else {
        console.log("sendMessageResponse!", res);
        var chatroomComp_1 = ChatRoomComponent.getInstance();
        if (res.code === HttpStatusCode.success && res.data.hasOwnProperty("resultMsg")) {
            var tempmsg_1 = __assign({}, res.data.resultMsg);
            if (tempmsg_1.type === MessageType[MessageType.Text] && InternalStore.encryption) {
                var secure = SecureServiceFactory.getService();
                secure.decryption(tempmsg_1.body)
                    .then(function (response) {
                    tempmsg_1.body = response;
                    chatroomComp_1.saveToPersisted(tempmsg_1);
                    getStore().dispatch(sendMessageSuccess());
                }).catch(function (error) {
                    console.error(error);
                    tempmsg_1.body = err.toString();
                    chatroomComp_1.saveToPersisted(tempmsg_1);
                    getStore().dispatch(sendMessageSuccess());
                });
            }
            else {
                chatroomComp_1.saveToPersisted(tempmsg_1);
                getStore().dispatch(sendMessageSuccess());
            }
        }
        else {
            getStore().dispatch(sendMessageFailure(res.message));
        }
    }
}
var JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
export var JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export var JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
var joinRoomRequest = function () { return ({ type: JOIN_ROOM_REQUEST }); };
var joinRoomSuccess = function (data) { return ({ type: JOIN_ROOM_SUCCESS, payload: data }); };
var joinRoomFailure = function (error) { return ({ type: JOIN_ROOM_FAILURE, payload: error }); };
export function joinRoom(roomId, token, username) {
    getStore().dispatch(joinRoomRequest());
    var backendFactory = BackendFactory.getInstance();
    var server = backendFactory.getServer();
    if (!!server) {
        server.getLobby().joinRoom(token, username, roomId, function (err, res) {
            console.log("JoinChatRoomRequest value", res);
            if (err || res.code !== HttpStatusCode.success) {
                getStore().dispatch(joinRoomFailure(err));
            }
            else {
                getStore().dispatch(joinRoomSuccess());
            }
        });
    }
    else {
        getStore().dispatch(joinRoomFailure("Chat service not available."));
    }
}
export var LEAVE_ROOM = "LEAVE_ROOM";
export var LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
var leaveRoom = function () { return ({ type: LEAVE_ROOM }); };
var leaveRoomSuccess = function () { return ({ type: LEAVE_ROOM_SUCCESS }); };
export function leaveRoomAction() {
    var room = getStore().getState().chatroomReducer.get("room");
    var _id = authReducer().user._id;
    if (!!room) {
        var roomId = room._id;
        ChatRoomComponent.getInstance().dispose();
        NotificationManager.regisNotifyNewMessageEvent();
        getStore().dispatch(updateLastAccessRoom(roomId, _id));
        getStore().dispatch(leaveRoom());
    }
    else {
        getStore().dispatch({ type: "" });
    }
}
export var DISABLE_CHATROOM = "DISABLE_CHATROOM";
export var ENABLE_CHATROOM = "ENABLE_CHATROOM";
export var disableChatRoom = function () { return ({ type: DISABLE_CHATROOM }); };
export var enableChatRoom = function () { return ({ type: ENABLE_CHATROOM }); };
export var GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
var GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
export var GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
export var GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
var getPersistChatroomFail = function (error) { return ({ type: GET_PERSISTEND_CHATROOM_FAILURE, payload: error }); };
var getPersistChatroomSuccess = function (roomInfo) { return ({ type: GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo }); };
export var getPersistendChatroom = function (roomId) {
    getStore().dispatch({ type: GET_PERSISTEND_CHATROOM, payload: roomId });
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    if (!chatrooms) {
        getStore().dispatch(getPersistChatroomFail(undefined));
    }
    var rooms = chatrooms.filter(function (room, index, array) {
        if (room._id.toString() === roomId) {
            return room;
        }
    });
    if (rooms.length > 0) {
        getStore().dispatch(getPersistChatroomSuccess(rooms[0]));
    }
    else {
        getStore().dispatch(getPersistChatroomFail(rooms));
    }
};
export var getRoom = function (roomId) {
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    if (!chatrooms) {
        return null;
    }
    var rooms = chatrooms.filter(function (room, index, array) {
        if (room._id.toString() === roomId) {
            return room;
        }
    });
    return rooms[0];
};
export var createPrivateChatRoomMembers = function (myUser, contactUser) {
    if (myUser && contactUser) {
        var owner = {};
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;
        var contact = {};
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = contactUser.username;
        var members = { owner: owner, contact: contact };
        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");
        return null;
    }
};
export var UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
export var updatedChatRoomSuccess = function (chatrooms) { return ({
    type: UPDATED_CHATROOMS, payload: chatrooms,
}); };
export var updateChatRoom = function (rooms) {
    var chatrooms = getStore().getState().chatroomReducer.chatrooms;
    if (chatrooms) {
        // R.unionWith(R.eqBy(R.prop('a')), l1, l2);
        var newRooms = R.unionWith(R.eqBy(R.prop("_id")), rooms, chatrooms);
        getStore().dispatch(updatedChatRoomSuccess(newRooms));
    }
    else {
        chatrooms = rooms.slice();
        getStore().dispatch(updatedChatRoomSuccess(chatrooms));
    }
};
var GET_CHAT_TARGET_UID = "GET_CHAT_TARGET_UID";
export var GET_CHAT_TARGET_UID_SUCCESS = "GET_CHAT_TARGET_UID_SUCCESS";
export var GET_CHAT_TARGET_UID_FAILURE = "GET_CHAT_TARGET_UID_FAILURE";
var getChatTargetId = createAction(GET_CHAT_TARGET_UID, function (roomId) { return roomId; });
var getChatTargetIdSuccess = createAction(GET_CHAT_TARGET_UID_SUCCESS, function (payload) { return payload; });
var getChatTargetIdFailure = createAction(GET_CHAT_TARGET_UID_FAILURE, function (error) { return error; });
export function getChatTargetIds(roomId) {
    return function (dispatch) {
        dispatch(getChatTargetId(roomId));
        var room = getStore().getState().chatroomReducer.room;
        var _id = authReducer().user._id;
        if (!room) {
            dispatch(getChatTargetIdFailure("Has no room object!"));
        }
        else {
            var results_1 = new Array();
            room.members.map(function (value) { return (value._id !== _id) ? results_1.push(value._id) : null; });
            dispatch(getChatTargetIdSuccess(results_1));
        }
    };
}
