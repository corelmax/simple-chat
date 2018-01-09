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
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const redux_actions_1 = require("redux-actions");
const starter_1 = require("stalk-js/starter");
const chatroomActions = require("../chatroom/chatroomActions");
const InternalStore_1 = require("../../InternalStore");
const authReducer = () => InternalStore_1.default.authStore;
const getStore = () => InternalStore_1.default.store;
exports.STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
exports.STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
exports.STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
exports.STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
exports.ON_CHATLOG_CHANGE = "ON_CHATLOG_CHANGE";
exports.onChatLogChanged = redux_actions_1.createAction(exports.ON_CHATLOG_CHANGE, (payload) => payload);
const listenerImp = (newMsg) => {
    const dataManager = starter_1.BackendFactory.getInstance().dataManager;
    if (!dataManager.isMySelf(newMsg.sender)) {
        getStore().dispatch(exports.onChatLogChanged(newMsg));
    }
};
function updateLastAccessTimeEventHandler(newRoomAccess) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);
    const chatsLogComp = starter_1.BackendFactory.getInstance().chatLogComp;
    const { _id } = authReducer().user;
    chatsLogComp.getUnreadMessage(_id, newRoomAccess).then(function (unread) {
        chatsLogComp.addUnreadMessage(unread);
        calculateUnreadCount();
        onUnreadMessageMapChanged(unread);
        // chatLogDAL.savePersistedUnreadMsgMap(unread);
    }).catch((err) => {
        if (err) {
            console.warn("updateLastAccessTimeEventHandler fail", err);
        }
    });
}
function initChatsLog() {
    const chatsLogComponent = InternalStore_1.default.chatlogInstance;
    chatsLogComponent.onReady = (rooms) => {
        getStore().dispatch(chatroomActions.updateChatRoom(rooms));
        getUnreadMessages();
    };
    chatsLogComponent.getRoomsInfoCompleteEvent = () => {
        const { chatrooms } = getStore().getState().chatroomReducer;
        chatsLogComponent.manageChatLog(chatrooms).then((chatlog) => {
            getChatsLog();
        });
    };
    chatsLogComponent.addOnChatListener(listenerImp);
    chatsLogComponent.updatedLastAccessTimeEvent = updateLastAccessTimeEventHandler;
    chatsLogComponent.addNewRoomAccessEvent = (data) => {
        getUnreadMessages();
    };
    getStore().dispatch({ type: exports.STALK_INIT_CHATLOG });
}
exports.initChatsLog = initChatsLog;
function getUnreadMessages() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    const { _id } = authReducer().user;
    const { roomAccess, state } = getStore().getState().chatlogReducer;
    chatsLogComp.getUnreadMessages(_id, roomAccess, function done(err, unreadLogs) {
        if (!!unreadLogs) {
            chatsLogComp.setUnreadMessageMap(unreadLogs);
            calculateUnreadCount();
            getUnreadMessageComplete();
        }
        if (roomAccess.length === 0) {
            getChatsLog();
        }
    });
}
function calculateUnreadCount() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    chatsLogComp.calculateChatsLogCount();
}
function increaseLogsCount(count) {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    chatsLogComp.increaseChatsLogCount(count);
}
function decreaseLogsCount(count) {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    chatsLogComp.decreaseChatsLogCount(count);
}
function getChatsLogCount() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}
exports.getChatsLogCount = getChatsLogCount;
function getUnreadMessageMap() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    return chatsLogComp.getUnreadMessageMap();
}
function getChatsLog() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    const chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: exports.STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog,
    });
}
function onUnreadMessageMapChanged(unread) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatsLogComp = InternalStore_1.default.chatlogInstance;
        const { chatrooms } = getStore().getState().chatroomReducer;
        try {
            const room = yield chatsLogComp.checkRoomInfo(unread, chatrooms);
            if (room) {
                updateRooms(room);
            }
        }
        catch (ex) {
            console.warn("Have no roomInfo");
        }
        const chatsLog = chatsLogComp.getChatsLog();
        getStore().dispatch({
            type: exports.STALK_CHATLOG_MAP_CHANGED,
            payload: chatsLog,
        });
    });
}
function getUnreadMessageComplete() {
    const chatsLogComp = InternalStore_1.default.chatlogInstance;
    const { _id } = authReducer().user;
    const { chatrooms } = getStore().getState().chatroomReducer;
    chatsLogComp.getRoomsInfo(_id, chatrooms);
    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}
const getChatLogContact = (chatlog) => {
    const dataManager = starter_1.BackendFactory.getInstance().dataManager;
    const contacts = chatlog.room.members.filter((value) => {
        return !dataManager.isMySelf(value._id);
    });
    return (contacts.length > 0) ? contacts[0]._id : null;
};
function updateRooms(room) {
    return __awaiter(this, void 0, void 0, function* () {
        let { chatrooms } = getStore().getState().chatroomReducer;
        if (Array.isArray(chatrooms) && chatrooms.length > 0) {
            chatrooms.forEach((v) => {
                if (v._id === room._id) {
                    v = room;
                }
            });
            const id = chatrooms.indexOf(room);
            if (id < 0) {
                chatrooms.push(room);
            }
        }
        else {
            chatrooms = new Array();
            chatrooms.push(room);
        }
        getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
    });
}
