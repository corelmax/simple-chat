/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */

import { BackendFactory } from "stalk-js/starter/BackendFactory";
import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";
const getConfig = () => BackendFactory.getInstance().getApiConfig();

export function updateMessageReader(messageId: string, roomId: string) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId, messageId }),
    });
}
export function updateMessagesReader(messagesId: string[], roomId: string) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ roomId, messages: messagesId }),
    });
}
