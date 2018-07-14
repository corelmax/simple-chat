/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
export declare const STALK_INIT_CHATLOG = "STALK_INIT_CHATLOG";
export declare const STALK_GET_CHATSLOG_COMPLETE = "STALK_GET_CHATSLOG_COMPLETE";
export declare const STALK_CHATLOG_MAP_CHANGED = "STALK_CHATLOG_MAP_CHANGED";
export declare const STALK_CHATLOG_CONTACT_COMPLETE = "STALK_CHATLOG_CONTACT_COMPLETE";
export declare const ON_CHATLOG_CHANGE = "ON_CHATLOG_CHANGE";
export declare const onChatLogChanged: import("redux-actions").ActionFunction1<any, import("redux-actions").Action<any>>;
export declare function initChatsLog(): void;
export declare function getChatsLogCount(): number | null;
