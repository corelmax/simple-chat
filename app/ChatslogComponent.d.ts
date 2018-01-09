import { DataListener } from "stalk-js/starter/DataListener";
import { IMessage, RoomAccessData, StalkAccount } from "stalk-js/starter/models/index";
import { Room, MessageImp } from "./models/index";
import ChatLog from "./models/ChatLog";
export declare type ChatLogMap = Map<string, ChatLog>;
export declare type UnreadMap = Map<string, IUnread>;
export interface IUnread {
    message: IMessage;
    rid: string;
    count: number;
}
export declare class Unread {
    message: IMessage;
    rid: string;
    count: number;
}
export declare function getUnreadMessage(userId: string, roomAccess: RoomAccessData): Promise<IUnread>;
export declare class ChatsLogComponent {
    dataListener: DataListener;
    private chatlogCount;
    isReady: boolean;
    onReady: (rooms: Room[]) => void;
    getRoomsInfoCompleteEvent: () => void;
    private chatslog;
    getChatsLog(): ChatLog[];
    private unreadMessageMap;
    getUnreadMessageMap(): UnreadMap;
    setUnreadMessageMap(unreads: IUnread[]): void;
    addUnreadMessage(unread: IUnread): void;
    getUnreadItem(roomId: string): IUnread | undefined;
    updatedLastAccessTimeEvent: (data: RoomAccessData) => void;
    onUpdatedLastAccessTime(data: RoomAccessData): void;
    constructor();
    private chatListeners;
    addOnChatListener(listener: any): void;
    onChat(message: MessageImp): void;
    onAccessRoom(dataEvent: StalkAccount): void;
    addNewRoomAccessEvent: (data: any) => void;
    onAddRoomAccess(dataEvent: any): void;
    getUnreadMessages(userId: string, roomAccess: RoomAccessData[], callback: (err: Error | undefined, logsData: IUnread[] | undefined) => void): void;
    getUnreadMessage(userId: string, roomAccess: RoomAccessData): Promise<IUnread>;
    private decorateRoomInfoData(roomInfo);
    private getRoomInfo(roomId);
    getRoomsInfo(userId: string, chatrooms: Room[]): void;
    manageChatLog(chatrooms: Room[]): Promise<ChatLogMap>;
    private organizeChatLogMap(unread, roomInfo, done);
    private setLogProp(log, displayMessage, callback);
    private addChatLog(chatLog, done);
    checkRoomInfo(unread: IUnread, chatrooms: Room[]): Promise<{} | undefined>;
    getChatsLogCount(): number;
    increaseChatsLogCount(num: number): void;
    decreaseChatsLogCount(num: number): void;
    calculateChatsLogCount(): void;
}
