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
var getStore = function () { return InternalStore.store; };
export var STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
var stalkNotiNewMessage = function (payload) { return ({ type: STALK_NOTICE_NEW_MESSAGE, payload: payload }); };
var init = function (onSuccess) {
    console.log("Initialize NotificationManager.");
};
export var regisNotifyNewMessageEvent = function () {
    console.log("subscribe global notify message event");
    BackendFactory.getInstance().dataListener.addOnChatListener(notify);
};
export var unsubscribeGlobalNotifyMessageEvent = function () {
    BackendFactory.getInstance().dataListener.removeOnChatListener(notify);
};
export var notify = function (messageObj) {
    var messageImp = messageObj;
    var message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar,
    };
    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then(function (decoded) {
            message.body = decoded.body;
            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = "Sent you " + messageImp.type.toLowerCase();
        getStore().dispatch(stalkNotiNewMessage(message));
    }
};
