/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import { ChatEvents } from "stalk-js";
import { IMessage } from "stalk-js/starter/models/index";
import { MessageImp, IMember } from "./models/index";
import { IDataManager } from "./IDataManager";
export declare const ON_MESSAGE_CHANGE = "ON_MESSAGE_CHANGE";
export declare class ChatRoomComponent implements ChatEvents.IChatServerEvents {
    private static instance;
    static getInstance(): ChatRoomComponent;
    static createInstance(datamanager: IDataManager): ChatRoomComponent;
    chatroomDelegate: (eventName: string, data: MessageImp | MessageImp[]) => void;
    outsideRoomDelegete: (eventName: string, data: any) => void;
    private roomId;
    getRoomId(): string;
    setRoomId(rid: string): void;
    private secure;
    private dataManager;
    private dataListener;
    private updateMessageQueue;
    constructor(dataManager: IDataManager);
    saveMessages: (chatMessages: MessageImp[], message: MessageImp) => void;
    saveToPersisted(message: MessageImp): void;
    onChat(message: MessageImp): void;
    onRoomJoin(data: any): void;
    onLeaveRoom(data: any): void;
    private messageReadTick;
    onMessageRead(message: IMessage): void;
    onGetMessagesReaders(dataEvent: any): void;
    getPersistentMessage(rid: string): Promise<IMessage[]>;
    getNewerMessageRecord(callback: (results: IMessage[], roomId: string) => void): Promise<void>;
    private getNewerMessages;
    getOlderMessageChunk(roomId: string): Promise<any[]>;
    getTopEdgeMessageTime(): Promise<Date>;
    private compareMessage;
    updateReadMessages(): void;
    updateWhoReadMyMessages(): Promise<void>;
    getMemberProfile(member: IMember, callback: (err: any, res: any) => void): void;
    getMessages(): Promise<any>;
    dispose(): void;
}
