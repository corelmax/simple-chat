/**
 *  NotificationManager
 *
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * The NotificationManager for react.js.
 *
 */
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import * as CryptoHelper from "../../utils/CryptoHelper";
import { MessageType } from "stalk-js/starter/models/index";
import InternalStore from "../../InternalStore";
const getStore = () => InternalStore.store;
export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory.getInstance().dataListener.addOnChatListener(notify);
};
export const unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory.getInstance().dataListener.removeOnChatListener(notify);
};
export const notify = (messageObj) => {
    const messageImp = messageObj;
    const message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar,
    };
    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;
            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;
        getStore().dispatch(stalkNotiNewMessage(message));
    }
};
