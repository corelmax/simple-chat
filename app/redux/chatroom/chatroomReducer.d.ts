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
declare const ChatRoomRecoder_base: any;
export declare class ChatRoomRecoder extends ChatRoomRecoder_base {
    constructor(params: IChatroom);
    get<T extends keyof IChatroom>(value: T): IChatroom[T];
}
export declare const chatRoomRecoder: ChatRoomRecoder;
export declare const chatroomReducer: (state: ChatRoomRecoder | undefined, action: any) => any;
