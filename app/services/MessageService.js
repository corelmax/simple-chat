"use strict";
/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("stalk-js/starter/BackendFactory");
const ServiceUtils_1 = require("./ServiceUtils");
const InternalStore_1 = require("../InternalStore");
const getConfig = () => BackendFactory_1.BackendFactory.getInstance().getApiConfig();
const authReducer = () => InternalStore_1.default.authStore;
function updateMessageReader(messageId, roomId) {
    return fetch(`${getConfig().message}/updateReader`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ roomId, messageId }),
    });
}
exports.updateMessageReader = updateMessageReader;
function updateMessagesReader(messagesId, roomId) {
    return fetch(`${getConfig().message}/updateMessagesReader`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ roomId, messages: messagesId }),
    });
}
exports.updateMessagesReader = updateMessagesReader;
