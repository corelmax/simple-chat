/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */

import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { createAction } from "redux-actions";

import { BackendFactory } from "stalk-js/starter";
import { getUnreadMessage, IUnread, Unread } from "../../ChatslogComponent";
import { RoomAccessData, StalkAccount } from "stalk-js/starter/models";
import { Room } from "../../models/Room";
import ChatLog from "../../models/chatLog";
import * as ServiceProvider from "../../services/ServiceProvider";
import * as chatroomActions from "../chatroom/chatroomActions";

import InternalStore from "../../InternalStore";
const authReducer = () => InternalStore.authStore;
const getStore = () => InternalStore.store;

export const STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
export const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";

export const ON_CHATLOG_CHANGE = "ON_CHATLOG_CHANGE";
export const onChatLogChanged = createAction(ON_CHATLOG_CHANGE, (payload: any) => payload);

const listenerImp = (newMsg) => {
    const dataManager = InternalStore.dataManager;

    if (!dataManager.isMySelf(newMsg.sender)) {
        getStore().dispatch(onChatLogChanged(newMsg));
    }
};

function updateLastAccessTimeEventHandler(newRoomAccess: RoomAccessData) {
    console.log("updateLastAccessTimeEventHandler", newRoomAccess);

    const chatsLogComp = InternalStore.chatlogInstance;
    const { _id } = authReducer().user;

    getUnreadMessage(_id, newRoomAccess).then((unread) => {
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

export function initChatsLog() {
    const chatsLogComponent = InternalStore.chatlogInstance;

    chatsLogComponent.onReady = (rooms: Room[]) => {
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

    getStore().dispatch({ type: STALK_INIT_CHATLOG });
}

function getUnreadMessages() {
    const chatsLogComp = InternalStore.chatlogInstance;

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
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.calculateChatsLogCount();
}

function increaseLogsCount(count: number) {
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.increaseChatsLogCount(count);
}

function decreaseLogsCount(count: number) {
    const chatsLogComp = InternalStore.chatlogInstance;
    chatsLogComp.decreaseChatsLogCount(count);
}

export function getChatsLogCount() {
    const chatsLogComp = InternalStore.chatlogInstance;
    return chatsLogComp ? chatsLogComp.getChatsLogCount() : null;
}

function getUnreadMessageMap() {
    const chatsLogComp = InternalStore.chatlogInstance;
    return chatsLogComp.getUnreadMessageMap();
}

function getChatsLog() {
    const chatsLogComp = InternalStore.chatlogInstance;
    const chatsLog = chatsLogComp.getChatsLog();

    getStore().dispatch({
        type: STALK_GET_CHATSLOG_COMPLETE,
        payload: chatsLog,
    });
}

async function onUnreadMessageMapChanged(unread: IUnread) {
    const chatsLogComp = InternalStore.chatlogInstance;

    const { chatrooms }: { chatrooms: Room[] } = getStore().getState().chatroomReducer;

    try {
        const room = await chatsLogComp.checkRoomInfo(unread, chatrooms);
        if (room) {
            updateRooms(room);
        }
    } catch (ex) {
        console.warn("Have no roomInfo");
    }

    const chatsLog = chatsLogComp.getChatsLog();
    getStore().dispatch({
        type: STALK_CHATLOG_MAP_CHANGED,
        payload: chatsLog,
    });
}

function getUnreadMessageComplete() {
    const chatsLogComp = InternalStore.chatlogInstance;
    const { _id } = authReducer().user;
    const { chatrooms } = getStore().getState().chatroomReducer;

    chatsLogComp.getRoomsInfo(_id, chatrooms);

    // $rootScope.$broadcast('getunreadmessagecomplete', {});
}

const getChatLogContact = (chatlog: ChatLog) => {
    const dataManager = BackendFactory.getInstance().dataManager;
    const contacts = chatlog.room.members.filter((value) => {
        return !dataManager.isMySelf(value._id);
    });

    return (contacts.length > 0) ? contacts[0]._id : null;
};

async function updateRooms(room: Room) {
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
    } else {
        chatrooms = new Array<Room>();
        chatrooms.push(room);
    }

    getStore().dispatch(chatroomActions.updateChatRoom(chatrooms));
}
