/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import { apiHeaders } from "./ServiceUtils";
import InternalStore from "../InternalStore";
var getConfig = function () { return BackendFactory.getInstance().getApiConfig(); };
var authReducer = function () { return InternalStore.authStore; };
export function updateMessageReader(messageId, roomId) {
    return fetch(getConfig().message + "/updateReader", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId: roomId, messageId: messageId }),
    });
}
export function updateMessagesReader(messagesId, roomId) {
    return fetch(getConfig().message + "/updateMessagesReader", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId: roomId, messages: messagesId }),
    });
}
