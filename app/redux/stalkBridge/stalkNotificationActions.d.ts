import { IMessage } from "stalk-js/starter/models/index";
export declare const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
export declare const regisNotifyNewMessageEvent: () => void;
export declare const unsubscribeGlobalNotifyMessageEvent: () => void;
export declare const notify: (messageObj: IMessage) => void;
