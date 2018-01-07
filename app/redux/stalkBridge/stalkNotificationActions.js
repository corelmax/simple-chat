"use strict";
/**
 *  NotificationManager
 *
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BackendFactory_1 = require("stalk-js/starter/BackendFactory");
const CryptoHelper = require("../../utils/CryptoHelper");
const index_1 = require("stalk-js/starter/models/index");
const configStore_1 = require("../configStore");
exports.STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: exports.STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
exports.regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory_1.BackendFactory.getInstance().dataListener.addOnChatListener(exports.notify);
};
exports.unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory_1.BackendFactory.getInstance().dataListener.removeOnChatListener(exports.notify);
};
exports.notify = (messageObj) => {
    let messageImp = messageObj;
    let message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar
    };
    if (messageImp.type === index_1.MessageType[index_1.MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;
            configStore_1.store.dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;
        configStore_1.store.dispatch(stalkNotiNewMessage(message));
    }
};
