/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from "async";
import * as Rx from "rxjs/Rx";

import { BackendFactory } from "stalk-js/starter/BackendFactory";
import { DataListener } from "stalk-js/starter/DataListener";
import { ChatEvents } from "stalk-js";
import * as chatroomService from "./services/ChatroomService";

import { decryptionText, hashComputation } from "./utils/CryptoHelper";
import { ISecureService } from "./utils/secure/ISecureService";
import { SecureServiceFactory } from "./utils/secure/SecureServiceFactory";

import { MessageType, IMessage, RoomAccessData } from "stalk-js/starter/models";
import { MessageImp, Room, IMember } from "./models/index";
import { IDataManager } from "./IDataManager";

// import { imagesPath } from "../consts/StickerPath";
import InternalStore from "./InternalStore";
const getConfig = () => BackendFactory.getInstance().config;
const getStore = () => InternalStore.store;

export const ON_MESSAGE_CHANGE = "ON_MESSAGE_CHANGE";

export class ChatRoomComponent implements ChatEvents.IChatServerEvents {
    private static instance: ChatRoomComponent;
    public static getInstance() {
        return ChatRoomComponent.instance;
    }
    public static createInstance(datamanager: IDataManager) {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent(datamanager);
        }

        return ChatRoomComponent.instance;
    }

    public chatroomDelegate: (eventName: string, data: MessageImp | MessageImp[]) => void;
    public outsideRoomDelegete: (eventName: string, data: any) => void;
    private roomId: string;
    public getRoomId(): string {
        return this.roomId;
    }
    public setRoomId(rid: string): void {
        this.roomId = rid;
    }
    private secure: ISecureService;
    private dataManager: IDataManager;
    private dataListener: DataListener;

    private updateMessageQueue = new Array<MessageImp>();

    constructor(dataManager: IDataManager) {
        console.log("ChatRoomComponent: constructor");

        this.roomId = "" as string;
        this.chatroomDelegate = undefined as any;
        this.outsideRoomDelegete = undefined as any;

        this.secure = SecureServiceFactory.getService();
        const backendFactory = BackendFactory.getInstance();

        this.dataManager = dataManager;
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));

        const source = Rx.Observable.timer(1000, 1000);
        const subscribe = source.subscribe((val) => {
            if (this.updateMessageQueue.length > 0) {
                const queues = this.updateMessageQueue.slice();
                this.updateMessageQueue = new Array();
                this.messageReadTick(queues, this.roomId);
            }
        });
    }

    saveMessages = (chatMessages: MessageImp[], message: MessageImp) => {
        const self = this;
        chatMessages.push(message);

        self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then((chats) => {
            if (!!self.chatroomDelegate) {
                self.chatroomDelegate(ChatEvents.ON_CHAT, message);
                self.chatroomDelegate(ON_MESSAGE_CHANGE, chatMessages);
            }
        });
    }

    saveToPersisted(message: MessageImp) {
        const self = this;

        this.dataManager.messageDAL.getData(this.roomId).then((chats: IMessage[]) => {
            const chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();

            if (message.type === MessageType[MessageType.Text]) {
                decryptionText(message).then((decoded) => {
                    self.saveMessages(chatMessages, message);
                }).catch((err) => self.saveMessages(chatMessages, message));
            } else {
                self.saveMessages(chatMessages, message);
            }
        }).catch((err) => {
            console.warn("Cannot get persistend message of room", err);
        });
    }

    public onChat(message: MessageImp) {
        console.log("ChatRoomComponent.onChat", message);

        if (this.roomId === message.rid) {
            this.saveToPersisted(message);
        } else {
            console.log("this msg come from other room.");

            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ChatEvents.ON_CHAT, message);
            }
        }
    }

    public onRoomJoin(data) { }

    public onLeaveRoom(data) { }

    private async messageReadTick(messageQueue: MessageImp[], roomId: string) {
        let chatMessages = Object.create(null) as any[];
        const chats = await this.dataManager.messageDAL.getData(roomId);
        chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array<MessageImp>();

        messageQueue.forEach((message) => {
            chatMessages.some((value) => {
                if (value._id === message._id) {
                    value.readers = message.readers;

                    return true;
                }
            });
        });

        const results = await this.dataManager.messageDAL.saveData(roomId, chatMessages);
        if (!!this.chatroomDelegate) {
            this.chatroomDelegate(ON_MESSAGE_CHANGE, results);
        }
    }

    public onMessageRead(message: IMessage) {
        this.updateMessageQueue.push(message as MessageImp);
    }

    public onGetMessagesReaders(dataEvent) {
        console.log("onGetMessagesReaders", dataEvent);

        const self = this;
        interface Ireaders {
            _id: string;
            readers: string[];
        }
        const myMessagesArr: Ireaders[] = JSON.parse(JSON.stringify(dataEvent.data));

        self.chatMessages.forEach((originalMsg, id, arr) => {
            if (self.dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some((myMsg, index, array) => {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });

        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    }

    public async getPersistentMessage(rid: string) {
        const self = this;
        const messages = await self.dataManager.messageDAL.getData(rid);

        if (messages && messages.length > 0) {
            const prom = new Promise((resolve: (data: IMessage[]) => void, reject) => {
                const chats = messages.slice(0) as IMessage[];

                async.forEach(chats, function iterator(chat, result) {
                    if (chat.type === MessageType[MessageType.Text]) {
                        if (InternalStore.encryption === true) {
                            self.secure.decryption(chat.body).then((res) => {
                                chat.body = res;

                                result(null);
                            }).catch((err) => result(null));
                        } else {
                            result(null);
                        }
                    } else {
                        result(null);
                    }
                }, (err) => {
                    console.log("decoded chats completed.", chats.length);

                    self.dataManager.messageDAL.saveData(rid, chats);
                    resolve(chats);
                });
            });

            const chatResult = await prom;
            return chatResult;
        } else {
            console.log("chatMessages is empty!");
            return new Array<IMessage>();
        }
    }

    public async getNewerMessageRecord(callback: (results: IMessage[], roomId: string) => void) {
        const self = this;
        let lastMessageTime = new Date();

        const getLastMessageTime = (cb: (boo: boolean | undefined) => void) => {
            const { roomAccess }: { roomAccess: RoomAccessData[] } = getStore().getState().chatlogReducer;
            async.some(roomAccess, (item, asyncCb) => {
                if (item.roomId === self.roomId) {
                    lastMessageTime = item.accessTime;
                    asyncCb(undefined, true);
                } else {
                    asyncCb(undefined, false);
                }
            }, (err, result) => {
                cb(result);
            });
        };

        const saveMergedMessage = async (histories: IMessage[]) => {
            let tempResults = new Array();
            if (messages && messages.length > 0) {
                tempResults = messages.concat(histories);
            } else {
                tempResults = histories.slice();
            }
            // Save persistent chats log here.
            const results = await self.dataManager.messageDAL.saveData(self.roomId, tempResults) as IMessage[];

            callback(tempResults, this.roomId);
        };

        const getNewerMessage = async () => {
            try {
                const histories = await self.getNewerMessages(lastMessageTime) as IMessage[];
                saveMergedMessage(histories);
            } catch (ex) {
                saveMergedMessage([]);
            }
        };

        const messages: IMessage[] = await self.dataManager.messageDAL.getData(this.roomId);
        if (messages && messages.length > 0) {
            if (messages[messages.length - 1] !== null) {
                lastMessageTime = messages[messages.length - 1].createTime;
                getNewerMessage();
            } else {
                getLastMessageTime((boo) => {
                    getNewerMessage();
                });
            }
        } else {
            getLastMessageTime((boo) => {
                getNewerMessage();
            });
        }
    }

    private async getNewerMessages(lastMessageTime: Date) {
        const self = this;

        try {
            const response = await chatroomService.getNewerMessages(self.roomId, lastMessageTime);
            const value = await response.json();

            return new Promise((resolve, reject) => {
                if (value.success) {
                    let histories = new Array<IMessage>();
                    histories = value.result;
                    if (histories.length > 0) {
                        async.forEach(histories, (chat, cb) => {
                            if (chat.type === MessageType[MessageType.Text]) {
                                if (InternalStore.encryption === true) {
                                    self.secure.decryption(chat.body).then((res) => {
                                        chat.body = res;
                                        cb(undefined);
                                    }).catch((err) => {
                                        cb(undefined);
                                    });
                                } else {
                                    cb(undefined);
                                }
                            } else {
                                cb(undefined);
                            }
                        }, function done(err) {
                            if (!!err) {
                                console.error("get newer message error", err);
                                reject(err);
                            } else {
                                resolve(histories);
                            }
                        });
                    } else {
                        console.log("Have no newer message.");
                        resolve(histories);
                    }
                } else {
                    console.warn("WTF god only know.", value);
                    reject(value.message);
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getOlderMessageChunk(roomId: string) {
        const self = this;

        async function waitForRoomMessages() {
            const messages = await self.dataManager.messageDAL.getData(roomId) as IMessage[];

            return messages;
        }

        async function saveRoomMessages(merged: IMessage[]) {
            const value = await self.dataManager.messageDAL.saveData(roomId, merged);

            return value as IMessage[];
        }

        const time = await self.getTopEdgeMessageTime() as Date;
        if (time) {
            const response = await chatroomService.getOlderMessagesCount(roomId, time.toString(), true);
            const result = await response.json();

            console.log("getOlderMessageChunk value", result);
            // todo
            /**
             * Merge messages record to chatMessages array.
             * Never save message to persistend layer.
             */
            if (result.success && result.result.length > 0) {
                const earlyMessages = result.result as IMessage[];
                const persistMessages = await waitForRoomMessages();

                if (!!persistMessages && persistMessages.length > 0) {
                    let mergedMessageArray = new Array<IMessage>();
                    mergedMessageArray = earlyMessages.concat(persistMessages);

                    const resultsArray = new Array<IMessage>();
                    const results = await new Promise((resolve: (data: IMessage[]) => void, rejected) => {
                        async.map(mergedMessageArray, function iterator(item, cb) {
                            const hasMessage = resultsArray.some((value, id) => {
                                if (!!value && value._id === item._id) {
                                    return true;
                                }
                            });

                            if (hasMessage === false) {
                                resultsArray.push(item);
                                cb(undefined, undefined);
                            } else {
                                cb(undefined, undefined);
                            }
                        }, function done(err, results) {
                            const merged = resultsArray.sort(self.compareMessage);

                            resolve(merged);
                        });
                    });

                    return await saveRoomMessages(results);
                } else {
                    const merged = earlyMessages.sort(self.compareMessage);
                    return await saveRoomMessages(merged);
                }
            } else {
                return new Array();
            }
        } else {
            throw new Error("getTopEdgeMessageTime fail");
        }
    }

    public async getTopEdgeMessageTime() {
        const self = this;

        async function waitRoomMessage() {
            let topEdgeMessageTime = new Date();
            const messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            if (!!messages && messages.length > 0) {
                if (!!messages[0].createTime) {
                    topEdgeMessageTime = messages[0].createTime;
                }
            }
            console.log("topEdgeMessageTime is: ", topEdgeMessageTime);

            return topEdgeMessageTime;
        }

        return new Promise((resolve: (data: Date) => void, reject) => {
            waitRoomMessage().then((topEdgeMessageTime) => {
                resolve(topEdgeMessageTime);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    private compareMessage(a: IMessage, b: IMessage) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    public updateReadMessages() {
        const self = this;
        const backendFactory = BackendFactory.getInstance();
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!backendFactory.dataManager.isMySelf(message.sender)) {
                const chatroomApi = backendFactory.getServer().getChatRoomAPI();
                chatroomApi.updateMessageReader(message._id, message.rid);
            }

            resultCb(null, null);
        }, function done(err) {
            // done.
        });
    }

    public async updateWhoReadMyMessages() {
        const self = this;

        const res = await self.getTopEdgeMessageTime();
        const backendFactory = BackendFactory.getInstance();
        const chatroomApi = backendFactory.getServer().getChatRoomAPI();
        chatroomApi.getMessagesReaders(res.toString());
    }

    public getMemberProfile(member: IMember, callback: (err, res) => void) {
        const server = BackendFactory.getInstance().getServer();

        if (server) {
            server.getMemberProfile(member._id, callback);
        }
    }

    public async getMessages() {
        const messages = await this.dataManager.messageDAL.getData(this.roomId);
        return messages;
    }

    public dispose() {
        console.log("ChatRoomComponent: dispose");
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        delete ChatRoomComponent.instance;
    }
}
