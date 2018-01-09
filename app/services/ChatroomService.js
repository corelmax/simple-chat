"use strict";
/**
 * Pure fuction service.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const starter_1 = require("stalk-js/starter");
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => starter_1.BackendFactory.getInstance().getApiConfig();
exports.getRoomInfo = (roomId) => {
    return fetch(`${getConfig().chatroom}/roomInfo?room_id=${roomId}`, {
        method: "GET",
        headers: ServiceUtils_1.withToken(ServiceUtils_1.apiHeaders())(InternalStore_1.default.authStore.api_token),
    });
};
exports.getUnreadMessage = (roomId, userId, lastAccessTime) => {
    return fetch(`${getConfig().chatroom}/unreadMessage?
    room_id=${roomId}&user_id=${userId}&lastAccessTime=${lastAccessTime}`, {
        method: "GET",
        headers: ServiceUtils_1.apiHeaders(),
    });
};
exports.getOlderMessagesCount = (roomId, topEdgeMessageTime, queryMessage) => {
    return fetch(`${getConfig().chatroom}/olderMessagesCount/?
    message=${queryMessage}&room_id=${roomId}&topEdgeMessageTime=${topEdgeMessageTime}`, {
        method: "GET",
        headers: ServiceUtils_1.apiHeaders(),
    });
};
exports.getNewerMessages = (roomId, lastMessageTime) => {
    return fetch(`${getConfig().chatroom}/getChatHistory`, {
        body: JSON.stringify({
            roomId,
            lastMessageTime,
        }),
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
    });
};
exports.getPrivateChatroom = (ownerId, roommateId) => {
    return fetch(`${getConfig().chatroom}`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({
            ownerId,
            roommateId,
        }),
    });
};
