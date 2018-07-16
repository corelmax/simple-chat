/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { AnyAction } from "redux";
import { Record } from "immutable";
export interface IChatlog {
    isFetching: boolean;
    state: string;
    chatsLog: any[];
    logCount: number;
    roomAccess: any;
    error: string;
}
export declare const ChatLogInitState: Record.Class;
export declare function chatlogReducer(state: import("../../../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/immutable").Map<string, any> | undefined, action: AnyAction): import("../../../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/immutable").Map<string, any>;
