"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
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
Object.defineProperty(exports, "__esModule", { value: true });
const stalk_js_1 = require("stalk-js");
const starter_1 = require("stalk-js/starter");
const SecureServiceFactory_1 = require("../../utils/secure/SecureServiceFactory");
const ChatRoomComponent_1 = require("../../ChatRoomComponent");
const models_1 = require("stalk-js/starter/models");
const models_2 = require("../../models");
const R = require("ramda");
const redux_actions_1 = require("redux-actions");
const chatroomService = require("../../services/ChatroomService");
const MessageService = require("../../services/MessageService");
const NotificationManager = require("../stalkBridge/stalkNotificationActions");
const chatlogRxActions_1 = require("../chatlogs/chatlogRxActions");
const chatroomRxEpic_1 = require("./chatroomRxEpic");
const InternalStore_1 = require("../../InternalStore");
const getConfig = () => InternalStore_1.default.config;
const getStore = () => InternalStore_1.default.store;
const authReducer = () => InternalStore_1.default.authStore;
/**
 * ChatRoomActionsType
 */
exports.REPLACE_MESSAGE = "REPLACE_MESSAGE";
exports.ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
function initChatRoom(currentRoom) {
    if (!currentRoom) {
        throw new Error("Empty roomInfo");
    }
    const roomName = currentRoom.owner;
    if (!roomName && currentRoom.type === models_2.RoomType.privateChat) {
        currentRoom.members.some((v, id, arr) => {
            if (v._id !== InternalStore_1.default.authStore.user._id) {
                currentRoom.owner.username = v.username;
                return true;
            }
        });
    }
    const chatroomComp = ChatRoomComponent_1.ChatRoomComponent.createInstance(InternalStore_1.default.dataManager);
    chatroomComp.setRoomId(currentRoom._id);
    NotificationManager.unsubscribeGlobalNotifyMessageEvent();
    chatroomComp.chatroomDelegate = onChatRoomDelegate;
    chatroomComp.outsideRoomDelegete = onOutSideRoomDelegate;
}
exports.initChatRoom = initChatRoom;
function onChatRoomDelegate(event, data) {
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        console.log("onChatRoomDelegate: ", stalk_js_1.ChatEvents.ON_CHAT, data);
        const messageImp = data;
        /**
         * Todo **
         * - if message_id is mine. Replace message_id to local messages list.
         * - if not my message. Update who read this message. And tell anyone.
         */
        if (InternalStore_1.default.authStore.user._id === messageImp.sender) {
            // dispatch(replaceMyMessage(newMsg));
            console.log("is my message");
        }
        else {
            console.log("is contact message");
            // @ Check app not run in background.
            const appState = InternalStore_1.default.appStateEvent;
            console.log("AppState: ", appState); // active, background, inactive
            if (!!appState) {
                if (appState === "active") {
                    MessageService.updateMessageReader(messageImp._id, messageImp.rid)
                        .then((response) => response.json()).then((value) => {
                        console.log("updateMessageReader: ", value);
                    }).catch((err) => {
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
    else if (event === ChatRoomComponent_1.ON_MESSAGE_CHANGE) {
        getStore().dispatch(onMessageChangedAction(data));
    }
}
function onOutSideRoomDelegate(event, data) {
    console.log("Call notification here..."); // active, background, inactive
    if (event === stalk_js_1.ChatEvents.ON_CHAT) {
        NotificationManager.notify(data);
    }
}
exports.ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
const onMessageChangedAction = redux_actions_1.createAction(exports.ON_MESSAGE_CHANGED, (messages) => messages);
const onEarlyMessageReady = (data) => ({ type: exports.ON_EARLY_MESSAGE_READY, payload: data });
function checkOlderMessages() {
    const room = getStore().getState().chatroomReducer.room;
    ChatRoomComponent_1.ChatRoomComponent.getInstance().getTopEdgeMessageTime().then((res) => {
        chatroomService.getOlderMessagesCount(room._id, res.toString(), false)
            .then((response) => response.json())
            .then((result) => {
            console.log("getOlderMessagesCount", result);
            if (result.success && result.result > 0) {
                // console.log("onOlderMessageReady is true ! Show load earlier message on top view.");
                getStore().dispatch(onEarlyMessageReady(true));
            }
            else {
                // console.log("onOlderMessageReady is false ! Don't show load earlier message on top view.");
                getStore().dispatch(onEarlyMessageReady(false));
            }
        }).catch((err) => {
            console.warn("getOlderMessagesCount fail", err);
            getStore().dispatch(onEarlyMessageReady(false));
        });
    });
}
exports.checkOlderMessages = checkOlderMessages;
exports.LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
const loadEarlyMessageSuccess = (payload) => ({ type: exports.LOAD_EARLY_MESSAGE_SUCCESS, payload });
function loadEarlyMessageChunk(roomId) {
    ChatRoomComponent_1.ChatRoomComponent.getInstance().getOlderMessageChunk(roomId).then((docs) => {
        getStore().dispatch(loadEarlyMessageSuccess(docs));
        // @check older message again.
        getStore().dispatch(checkOlderMessages());
        // # update messages read.
        if (docs.length > 0) {
            getStore().dispatch(chatroomRxEpic_1.updateMessagesRead(docs, roomId));
        }
    }).catch((err) => {
        console.warn("loadEarlyMessageChunk fail", err);
    });
}
exports.loadEarlyMessageChunk = loadEarlyMessageChunk;
exports.GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
exports.GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
exports.GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
const getNewerMessage = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE);
const getNewerMessageFailure = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE_FAILURE);
const getNewerMessageSuccess = redux_actions_1.createAction(exports.GET_NEWER_MESSAGE_SUCCESS, (messages) => messages);
function getNewerMessageFromNet() {
    getStore().dispatch(getNewerMessage());
    ChatRoomComponent_1.ChatRoomComponent.getInstance().getNewerMessageRecord((results, roomId) => {
        getStore().dispatch(getNewerMessageSuccess(results));
        // # update messages read.
        if (results.length > 0) {
            getStore().dispatch(chatroomRxEpic_1.updateMessagesRead(results, roomId));
        }
    }).catch((err) => {
        if (err) {
            console.warn("getNewerMessageRecord fail", err);
        }
        getStore().dispatch(getNewerMessageFailure());
    });
}
exports.getNewerMessageFromNet = getNewerMessageFromNet;
function getMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const chatroomComp = ChatRoomComponent_1.ChatRoomComponent.getInstance();
        const messages = yield chatroomComp.getMessages();
        return messages;
    });
}
exports.getMessages = getMessages;
const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS";
exports.SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
const sendMessageRequest = () => ({ type: SEND_MESSAGE_REQUEST });
const sendMessageSuccess = () => ({ type: SEND_MESSAGE_SUCCESS });
const sendMessageFailure = (error) => ({ type: exports.SEND_MESSAGE_FAILURE, payload: error });
function sendMessage(message) {
    getStore().dispatch(sendMessageRequest());
    const backendFactory = starter_1.BackendFactory.getInstance();
    const server = backendFactory.getServer();
    if (message.type === models_1.MessageType[models_1.MessageType.Text] && InternalStore_1.default.encryption === true) {
        const secure = SecureServiceFactory_1.SecureServiceFactory.getService();
        secure.encryption(message.body).then((result) => {
            message.body = result;
            if (!!server) {
                const msg = {};
                msg.data = message;
                msg["x-api-key"] = config.Stalk.apiKey;
                msg["api-version"] = config.Stalk.apiVersion;
                server.getSocket().request("chat.chatHandler.pushByUids", msg, (result) => {
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
        }).catch((err) => {
            console.warn(err);
            getStore().dispatch(sendMessageFailure(err));
        });
    }
    else {
        if (!!server) {
            const msg = {};
            msg.data = message;
            msg["x-api-key"] = config.Stalk.apiKey;
            msg["api-version"] = config.Stalk.apiVersion;
            server.getSocket().request("chat.chatHandler.pushByUids", msg, (result) => {
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
exports.sendMessage = sendMessage;
function sendMessageResponse(err, res) {
    if (!!err) {
        getStore().dispatch(sendMessageFailure(err.message));
    }
    else {
        console.log("sendMessageResponse!", res);
        const chatroomComp = ChatRoomComponent_1.ChatRoomComponent.getInstance();
        if (res.code === stalk_js_1.HttpStatusCode.success && res.data.hasOwnProperty("resultMsg")) {
            const tempmsg = Object.assign({}, res.data.resultMsg);
            if (tempmsg.type === models_1.MessageType[models_1.MessageType.Text] && InternalStore_1.default.encryption) {
                const secure = SecureServiceFactory_1.SecureServiceFactory.getService();
                secure.decryption(tempmsg.body).then((res) => {
                    tempmsg.body = res;
                    chatroomComp.saveToPersisted(tempmsg);
                    getStore().dispatch(sendMessageSuccess());
                }).catch((err) => {
                    console.error(err);
                    tempmsg.body = err.toString();
                    chatroomComp.saveToPersisted(tempmsg);
                    getStore().dispatch(sendMessageSuccess());
                });
            }
            else {
                chatroomComp.saveToPersisted(tempmsg);
                getStore().dispatch(sendMessageSuccess());
            }
        }
        else {
            getStore().dispatch(sendMessageFailure(res.message));
        }
    }
}
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
exports.JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
exports.JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
const joinRoomRequest = () => ({ type: JOIN_ROOM_REQUEST });
const joinRoomSuccess = (data) => ({ type: exports.JOIN_ROOM_SUCCESS, payload: data });
const joinRoomFailure = (error) => ({ type: exports.JOIN_ROOM_FAILURE, payload: error });
function joinRoom(roomId, token, username) {
    getStore().dispatch(joinRoomRequest());
    const backendFactory = starter_1.BackendFactory.getInstance();
    const server = backendFactory.getServer();
    if (!!server) {
        server.getLobby().joinRoom(token, username, roomId, (err, res) => {
            console.log("JoinChatRoomRequest value", res);
            if (err || res.code !== stalk_js_1.HttpStatusCode.success) {
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
exports.joinRoom = joinRoom;
exports.LEAVE_ROOM = "LEAVE_ROOM";
exports.LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
const leaveRoom = () => ({ type: exports.LEAVE_ROOM });
const leaveRoomSuccess = () => ({ type: exports.LEAVE_ROOM_SUCCESS });
function leaveRoomAction() {
    const room = getStore().getState().chatroomReducer.get("room");
    const { id } = authReducer().user;
    if (!!room) {
        const token = getStore().getState().stalkReducer.stalkToken;
        const roomId = room._id;
        ChatRoomComponent_1.ChatRoomComponent.getInstance().dispose();
        NotificationManager.regisNotifyNewMessageEvent();
        getStore().dispatch(chatlogRxActions_1.updateLastAccessRoom(roomId, id));
        getStore().dispatch(leaveRoom());
    }
    else {
        getStore().dispatch({ type: "" });
    }
}
exports.leaveRoomAction = leaveRoomAction;
exports.DISABLE_CHATROOM = "DISABLE_CHATROOM";
exports.ENABLE_CHATROOM = "ENABLE_CHATROOM";
exports.disableChatRoom = () => ({ type: exports.DISABLE_CHATROOM });
exports.enableChatRoom = () => ({ type: exports.ENABLE_CHATROOM });
exports.GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
const GET_PERSISTEND_CHATROOM_CANCELLED = "GET_PERSISTEND_CHATROOM_CANCELLED";
exports.GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
exports.GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
const getPersistChatroomFail = (error) => ({ type: exports.GET_PERSISTEND_CHATROOM_FAILURE, payload: error });
const getPersistChatroomSuccess = (roomInfo) => ({ type: exports.GET_PERSISTEND_CHATROOM_SUCCESS, payload: roomInfo });
exports.getPersistendChatroom = (roomId) => {
    getStore().dispatch({ type: exports.GET_PERSISTEND_CHATROOM, payload: roomId });
    const { chatrooms } = getStore().getState().chatroomReducer;
    if (!chatrooms) {
        getStore().dispatch(getPersistChatroomFail(undefined));
    }
    const rooms = chatrooms.filter((room, index, array) => {
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
exports.getRoom = (roomId) => {
    const { chatrooms } = getStore().getState().chatroomReducer;
    if (!chatrooms) {
        return null;
    }
    const rooms = chatrooms.filter((room, index, array) => {
        if (room._id.toString() === roomId) {
            return room;
        }
    });
    return rooms[0];
};
exports.createChatRoom = (myUser, contactUser) => {
    if (myUser && contactUser) {
        const owner = {};
        owner._id = myUser._id;
        owner.user_role = (myUser.role) ? myUser.role : "user";
        owner.username = myUser.username;
        const contact = {};
        contact._id = contactUser._id;
        contact.user_role = (contactUser.role) ? contactUser.role : "user";
        contact.username = contactUser.username;
        const members = { owner, contact };
        return members;
    }
    else {
        console.warn("Not yet ready for create chatroom");
        return null;
    }
};
exports.UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
exports.updatedChatRoomSuccess = (chatrooms) => ({ type: exports.UPDATED_CHATROOMS, payload: chatrooms });
exports.updateChatRoom = (rooms) => {
    let chatrooms = getStore().getState().chatroomReducer.get("chatrooms");
    if (chatrooms) {
        // R.unionWith(R.eqBy(R.prop('a')), l1, l2);
        const newRooms = R.unionWith(R.eqBy(R.prop("_id")), rooms, chatrooms);
        getStore().dispatch(exports.updatedChatRoomSuccess(newRooms));
    }
    else {
        chatrooms = rooms.slice();
        getStore().dispatch(exports.updatedChatRoomSuccess(chatrooms));
    }
};
