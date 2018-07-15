/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { IMessage } from "stalk-js/starter/models";
import { IMember, Room } from "../../models";
/**
 * ChatRoomActionsType
 */
export declare const REPLACE_MESSAGE = "REPLACE_MESSAGE";
export declare const ON_EARLY_MESSAGE_READY = "ON_EARLY_MESSAGE_READY";
export declare function initChatRoom(currentRoom: Room): void;
export declare const ON_MESSAGE_CHANGED = "ON_MESSAGE_CHANGED";
export declare function checkOlderMessages(): void;
export declare const LOAD_EARLY_MESSAGE_SUCCESS = "LOAD_EARLY_MESSAGE_SUCCESS";
export declare function loadEarlyMessageChunk(roomId: string): void;
export declare const GET_NEWER_MESSAGE = "GET_NEWER_MESSAGE";
export declare const GET_NEWER_MESSAGE_FAILURE = "GET_NEWER_MESSAGE_FAILURE";
export declare const GET_NEWER_MESSAGE_SUCCESS = "GET_NEWER_MESSAGE_SUCCESS";
export declare function getNewerMessageFromNet(): void;
export declare function getMessages(): Promise<any>;
export declare const SEND_MESSAGE_FAILURE = "SEND_MESSAGE_FAILURE";
export declare function sendMessage(message: IMessage): void;
export declare const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export declare const JOIN_ROOM_FAILURE = "JOIN_ROOM_FAILURE";
export declare function joinRoom(roomId: string, token: string, username: string): void;
export declare const LEAVE_ROOM = "LEAVE_ROOM";
export declare const LEAVE_ROOM_SUCCESS = "LEAVE_ROOM_SUCCESS";
export declare function leaveRoomAction(): void;
export declare const DISABLE_CHATROOM = "DISABLE_CHATROOM";
export declare const ENABLE_CHATROOM = "ENABLE_CHATROOM";
export declare const disableChatRoom: () => {
    type: string;
};
export declare const enableChatRoom: () => {
    type: string;
};
export declare const GET_PERSISTEND_CHATROOM = "GET_PERSISTEND_CHATROOM";
export declare const GET_PERSISTEND_CHATROOM_SUCCESS = "GET_PERSISTEND_CHATROOM_SUCCESS";
export declare const GET_PERSISTEND_CHATROOM_FAILURE = "GET_PERSISTEND_CHATROOM_FAILURE";
export declare const getPersistendChatroom: (roomId: string) => void;
export declare const getRoom: (roomId: string) => Room | null;
export declare const createPrivateChatRoomMembers: (myUser: {
    _id: string;
    username: string;
    role?: string | undefined;
}, contactUser: {
    _id: string;
    username: string;
    role?: string | undefined;
}) => {
    owner: IMember;
    contact: IMember;
} | null;
export declare const UPDATED_CHATROOMS = "UPDATED_CHATROOMS";
export declare const updatedChatRoomSuccess: (chatrooms: Room[]) => {
    type: string;
    payload: Room[];
};
export declare const updateChatRoom: (rooms: Room[]) => void;
export declare const GET_CHAT_TARGET_UID_SUCCESS = "GET_CHAT_TARGET_UID_SUCCESS";
export declare const GET_CHAT_TARGET_UID_FAILURE = "GET_CHAT_TARGET_UID_FAILURE";
export declare function getChatTargetIds(roomId: string): (dispatch: any) => void;
