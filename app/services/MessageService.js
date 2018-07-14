/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import { apiHeaders } from "./ServiceUtils";
import InternalStore from "../InternalStore";
const getConfig = () => BackendFactory.getInstance().getApiConfig();
const authReducer = () => InternalStore.authStore;
export function updateMessageReader(messageId, roomId) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId, messageId }),
    });
}
export function updateMessagesReader(messagesId, roomId) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId, messages: messagesId }),
    });
}
