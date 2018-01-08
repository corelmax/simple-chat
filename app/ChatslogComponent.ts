/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";

import { DataListener } from "stalk-js/starter/DataListener";
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import ChatLog from "./models/ChatLog";
import {
    IMessage, MessageType, IMessageMeta,
    RoomAccessData, StalkAccount,
} from "stalk-js/starter/models/index";
import {
    Room, RoomStatus, RoomType,
    MessageImp, MemberImp,
} from "./models/index";
import * as CryptoHelper from "./utils/CryptoHelper";
import InternalStore from "./InternalStore";
import * as chatroomService from "./services/ChatroomService";
// import * as chatlogActionsHelper from "./redux/chatlogs/chatlogActionsHelper";

export type ChatLogMap = Map<string, ChatLog>;
export type UnreadMap = Map<string, IUnread>;
export interface IUnread { message: IMessage; rid: string; count: number; }
export class Unread { message: IMessage; rid: string; count: number; }

export async function getUnreadMessage(user_id: string, roomAccess: RoomAccessData) {
    let response = await chatroomService.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
    let value = await response.json();

    if (value.success) {
        let unread = value.result as IUnread;
        unread.rid = roomAccess.roomId;
        let decoded = await CryptoHelper.decryptionText(unread.message as MessageImp);

        return unread;
    }
    else {
        throw new Error(value.message);
    }
}

export class ChatsLogComponent {
    dataListener: DataListener;

    private chatlog_count: number = 0;
    public _isReady: boolean;
    public onReady: (rooms: Array<Room>) => void;
    public getRoomsInfoCompleteEvent: () => void;
    private chatslog = new Map<string, ChatLog>();
    public getChatsLog(): Array<ChatLog> {
        return Array.from(this.chatslog.values());
    }

    private unreadMessageMap = new Map<string, IUnread>();
    public getUnreadMessageMap(): UnreadMap {
        return this.unreadMessageMap;
    }
    public setUnreadMessageMap(unreads: Array<IUnread>) {
        unreads.map(v => {
            this.unreadMessageMap.set(v.rid, v);
        });
    }
    public addUnreadMessage(unread: IUnread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    public getUnreadItem(room_id: string) {
        return this.unreadMessageMap.get(room_id);
    }
    public updatedLastAccessTimeEvent: (data: RoomAccessData) => void;
    onUpdatedLastAccessTime(data: RoomAccessData) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(data);
        }
    }

    constructor() {
        console.log("Create ChatsLogComponent");

        this._isReady = false;
        let backendFactory = BackendFactory.getInstance();
        this.dataListener = backendFactory.dataListener;

        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));
    }

    private chatListeners = new Array<(param: any) => void>();
    public addOnChatListener(listener: any) {
        this.chatListeners.push(listener);
    }
    onChat(message: MessageImp) {
        console.log("ChatsLogComponent.onChat", message);
        const self = this;

        CryptoHelper.decryptionText(message).then((decoded) => {
            // Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }

    onAccessRoom(dataEvent: StalkAccount) {
        let self = this;

        this.unreadMessageMap.clear();
        this.chatslog.clear();

        const roomAccess = dataEvent.roomAccess as RoomAccessData[];
        let results = new Array<Room>();

        const done = () => {
            self._isReady = true;

            if (!!self.onReady) {
                self.onReady(results);
            }
        };

        async.each(roomAccess, (item, resultCallback) => {
            self.getRoomInfo(item.roomId)
                .then((room) => {
                    results.push(room);
                    resultCallback();
                }).catch((err) => {
                    if (err) {
                        console.warn("getRoomInfo", err);
                    }

                    resultCallback();
                });
        }, (err) => {
            console.log("onAccessRoom.finished!", err);
            done();
        });
    }

    public addNewRoomAccessEvent: (data: any) => void;
    public onAddRoomAccess(dataEvent: any) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));

        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }

    public getUnreadMessages(user_id: string, roomAccess: RoomAccessData[], callback: (err: Error | undefined, logsData: IUnread[] | undefined) => void) {
        const self = this;
        const unreadLogs = new Array<IUnread>();

        // create a queue object with concurrency 2
        const q = async.queue(function (task: RoomAccessData, callback: () => void) {
            if (!!task.roomId && !!task.accessTime) {
                self.getUnreadMessage(user_id, task).then((value) => {
                    unreadLogs.push(value);
                    callback();
                }).catch((err) => {
                    if (err) {
                        console.warn("getUnreadMessage", err);
                    }
                    callback();
                });
            } else {
                callback();
            }
        }, 10);

        // assign a callback
        q.drain = function () {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(undefined, unreadLogs);
        };

        // add some items to the queue (batch-wise)
        if (roomAccess && roomAccess.length > 0) {
            q.push(roomAccess, function (err) {
                if (!!err) {
                    console.error("getUnreadMessage err", err);
                }
            });
        } else {
            callback(undefined, undefined);
        }
    }

    public async getUnreadMessage(user_id: string, roomAccess: RoomAccessData) {
        const response = await chatroomService.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
        const value = await response.json();

        console.log("getUnreadMessage result: ", value);
        if (value.success) {
            const unread = value.result as IUnread;
            unread.rid = roomAccess.roomId;
            const decoded = await CryptoHelper.decryptionText(unread.message as MessageImp);

            return unread;
        } else {
            throw new Error(value.message);
        }
    }

    private async decorateRoomInfoData(roomInfo: Room) {
        if (roomInfo.type === RoomType.privateChat) {
            if (Array.isArray(roomInfo.members)) {
                const others = roomInfo.members.filter((value) =>
                    value._id !== InternalStore.authStore.user._id) as MemberImp[];

                if (others.length > 0) {
                    const contact = others[0];
                    const avatar = require("./assets/ic_account_circle_black.png");

                    roomInfo.owner = (contact.username) ? contact.username : "EMPTY ROOM";
                    roomInfo.image = (contact.avatar) ? contact.avatar : avatar;
                }
            }
        }

        return roomInfo;
    }

    private async getRoomInfo(room_id: string) {
        const self = this;

        const response = await chatroomService.getRoomInfo(room_id);
        const json = await response.json();

        if (json.success) {
            const roomInfos = json.result as Room[];
            const room = await self.decorateRoomInfoData(roomInfos[0]);

            return Promise.resolve(room);
        } else {
            return Promise.reject(undefined);
        }
    }

    public getRoomsInfo(user_id: string, chatrooms: Room[]) {
        const self = this;

        // create a queue object with concurrency 2
        const q = async.queue(function (task, callback) {
            const value = task as IUnread;
            const rooms = chatrooms.filter((v) => v._id === value.rid);
            const roomInfo = (rooms.length > 0) ? rooms[0] : undefined;
            if (!!roomInfo) {
                self.decorateRoomInfoData(roomInfo).then((room) => {
                    chatrooms.forEach((v) => {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });

                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch((err) => {
                    callback();
                });
            } else {
                console.log("Can't find roomInfo from persisted data: ", value.rid);

                self.getRoomInfo(value.rid).then((room) => {
                    chatrooms.forEach((v) => {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });

                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch((err) => {
                    console.warn(err);
                    callback();
                });
            }
        }, 10);

        // assign a callback
        q.drain = function () {
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent()) {
                self.getRoomsInfoCompleteEvent();
            }
        };

        this.unreadMessageMap.forEach((value, key, map) => {
            // add some items to the queue
            q.push(value, function (err) { });
        });
    }

    public manageChatLog(chatrooms: Room[]): Promise<ChatLogMap> {
        const self = this;

        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            const q = async.queue(function (task, callback) {
                const unread = task as IUnread;
                const rooms = chatrooms.filter((v) => v._id === unread.rid);
                const room = (rooms.length > 0) ? rooms[0] : undefined;
                if (!room) {
                    callback();
                }

                self.organizeChatLogMap(unread, (room as Room), () => {
                    callback();
                });
            }, 2);

            // assign a callback
            q.drain = function () {
                resolve(self.chatslog);
            };

            this.unreadMessageMap.forEach((value, key, map) => {
                // add some items to the queue
                q.push(value, function (err) { });
            });
        });
    }

    private async organizeChatLogMap(unread: IUnread, roomInfo: Room, done: () => void) {
        const self = this;
        const log = new ChatLog(roomInfo);
        log.setNotiCount(unread.count);

        if (!!unread.message) {
            log.setLastMessageTime(unread.message.createTime.toString());

            let contact = null;
            try {
                contact = await chatlogActionsHelper.getContactProfile(unread.message.sender);
            } catch (err) {
                if (err) {
                    console.warn("get sender contact fail", err.message);
                }
            }
            const sender = (!!contact) ? contact.username : "";

            if (unread.message.body !== null) {
                let displayMsg = unread.message.body;
                switch (`${unread.message.type}`) {
                    case MessageType[MessageType.Text]:
                        /*
                            self.main.decodeService(displayMsg, function (err, res) {
                                if (!err) {
                                    displayMsg = res;
                                } else { console.warn(err, res); }
                            });
                        */
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Sticker]:
                        displayMsg = sender + " sent a sticker.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Voice]:
                        displayMsg = sender + " sent a voice message.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Image]:
                        displayMsg = sender + " sent a image.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Video]:
                        displayMsg = sender + " sent a video.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Location]:
                        displayMsg = sender + " sent a location.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.File]:
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    default:
                        console.log("bobo");
                        break;
                }
            }
        } else {
            const displayMsg = "Start Chatting Now!";
            self.setLogProp(log, displayMsg, function (log) {
                self.addChatLog(log, done);
            });
        }
    }

    private setLogProp(log: ChatLog, displayMessage: string, callback: (log: ChatLog) => void) {
        log.setLastMessage(displayMessage);

        callback(log);
    }
    private addChatLog(chatLog: ChatLog, done: () => void) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    }
    public async checkRoomInfo(unread: IUnread, chatrooms: Room[]) {
        const self = this;

        const rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter((v) => v._id === unread.rid) : [];
        const roomInfo = rooms[0] as Room;
        if (!roomInfo) {
            console.warn("No have roomInfo in room store.", unread.rid);

            const room = await self.getRoomInfo(unread.rid);
            const p = new Promise((resolve, rejected) => {
                if (!room) {
                    rejected();
                } else {
                    this.organizeChatLogMap(unread, room, () => {
                        resolve(room);
                    });
                }
            });

            return p;
        } else {
            console.log("organize chats log of room: ", roomInfo.owner);
            const p = new Promise((resolve, rejected) => {
                this.organizeChatLogMap(unread, roomInfo, () => {
                    resolve();
                });
            });
        }
    }

    public getChatsLogCount(): number {
        return this.chatlog_count;
    }
    public increaseChatsLogCount(num: number) {
        this.chatlog_count += num;
    }
    public decreaseChatsLogCount(num: number) {
        this.chatlog_count -= num;
    }
    public calculateChatsLogCount() {
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach((value, key) => {
            const count = value.count;
            this.chatlog_count += count;
        });
    }
}
