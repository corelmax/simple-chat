/**
 * Pure fuction service.
 */
import { BackendFactory } from "stalk-js/starter";
import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";
var getConfig = function () { return BackendFactory.getInstance().getApiConfig(); };
export var getRoomInfo = function (roomId) {
    return fetch(getConfig().chatroom + "/roomInfo?room_id=" + roomId, {
        method: "GET",
        headers: withToken(apiHeaders())(InternalStore.authStore.api_token),
    });
};
export var getUnreadMessage = function (roomId, userId, lastAccessTime) {
    return fetch(getConfig().chatroom + "/unreadMessage?room_id=" + roomId + "&user_id=" + userId + "&lastAccessTime=" + lastAccessTime, {
        method: "GET",
        headers: apiHeaders(),
    });
};
export var getOlderMessagesCount = function (roomId, topEdgeMessageTime, queryMessage) {
    return fetch(getConfig().chatroom + "/olderMessagesCount?message=" + queryMessage + "&room_id=" + roomId + "&topEdgeMessageTime=" + topEdgeMessageTime, {
        method: "GET",
        headers: apiHeaders(),
    });
};
export var getNewerMessages = function (roomId, lastMessageTime) {
    return fetch(getConfig().chatroom + "/getChatHistory", {
        body: JSON.stringify({
            room_id: roomId,
            lastMessageTime: lastMessageTime,
        }),
        method: "POST",
        headers: apiHeaders(),
    });
};
export var getPrivateChatroom = function (ownerId, roommateId) {
    return fetch("" + getConfig().chatroom, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
            ownerId: ownerId,
            roommateId: roommateId,
        }),
    });
};
