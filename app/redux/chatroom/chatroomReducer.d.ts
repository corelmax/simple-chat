/**
 * Copyright 2016-2018 Ahoo Studio.co.th.
 *
 * This is pure function for redux app.
 */
import { AnyAction } from "redux";
import { Record } from "immutable";
import { Room, MessageImp } from "../../models";
export interface IChatroom {
    isFetching: boolean;
    state: string;
    room: Room | null;
    chatTargets: string[] | string;
    responseFile: any;
    messages: MessageImp[];
    earlyMessageReady: any;
    uploadingFile: any;
    fileInfo: any;
    error: any;
    chatDisabled: boolean;
    chatrooms: Room[];
}
export declare const ChatRoomInitState: Record.Class;
export declare const chatroomReducer: (state: import("../../../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/immutable").Map<string, any> | undefined, action: AnyAction) => import("../../../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/immutable").Map<string, any>;
