/**
 * Pure fuction service.
 */

import { BackendFactory } from "stalk-js/starter";
import InternalStore from "../InternalStore";
import { withToken, apiHeaders } from "./ServiceUtils";
const getConfig = () => BackendFactory.getInstance().getApiConfig();

export const getRoomInfo = (roomId: string): Promise<any> => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${roomId}`, {
        method: "GET",
        headers: withToken(apiHeaders())(InternalStore.authStore.api_token),
    });
};

export const getUnreadMessage = (roomId: string, userId: string, lastAccessTime: string): Promise<any> => {
    return fetch(`${getConfig().chatroom}/unreadMessage?
    room_id=${roomId}&user_id=${userId}&lastAccessTime=${lastAccessTime}`, {
            method: "GET",
            headers: apiHeaders(),
        });
};

export const getOlderMessagesCount = (roomId: string, topEdgeMessageTime: string, queryMessage: boolean) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount
    ?message=${queryMessage}&room_id=${roomId}&topEdgeMessageTime=${topEdgeMessageTime}`, {
            method: "GET",
            headers: apiHeaders(),
        });
};

export const getNewerMessages = (roomId: string, lastMessageTime: Date) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            roomId,
            lastMessageTime,
        }),
        method: "POST",
        headers: apiHeaders(),
    });
};

export const getPrivateChatroom = (ownerId: string, roommateId: string) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId,
            roommateId,
        }),
    });
};
