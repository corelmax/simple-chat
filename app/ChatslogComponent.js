var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";
import { MessageType, } from "stalk-js/starter/models/index";
import { RoomType, } from "./models/index";
import ChatLog from "./models/ChatLog";
import * as CryptoHelper from "./utils/CryptoHelper";
import InternalStore from "./InternalStore";
import * as chatroomService from "./services/ChatroomService";
import { LogLevel } from "./index";
export class Unread {
    constructor() {
        this.rid = "";
        this.count = 0;
    }
}
export function getUnreadMessage(userId, roomAccess) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield chatroomService.getUnreadMessage(roomAccess.roomId, userId, roomAccess.accessTime.toString());
            const value = yield response.json();
            if (InternalStore.logLevel === LogLevel.debug) {
                console.log("getUnreadMessage", value);
            }
            if (value.success) {
                const unread = value.result;
                unread.rid = roomAccess.roomId;
                const decoded = yield CryptoHelper.decryptionText(unread.message);
                return unread;
            }
            else {
                return Promise.reject(value.message);
            }
        }
        catch (ex) {
            return Promise.reject(ex);
        }
    });
}
export class ChatsLogComponent {
    constructor(backendFactory) {
        this.chatlogCount = 0;
        this.onReady = Object.create(null);
        this.getRoomsInfoCompleteEvent = Object.create(null);
        this.chatslog = new Map();
        this.unreadMessageMap = new Map();
        this.updatedLastAccessTimeEvent = Object.create(null);
        this.chatListeners = new Array();
        this.addNewRoomAccessEvent = Object.create(null);
        console.log("Create ChatsLogComponent");
        this.isReady = false;
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));
    }
    getChatsLog() {
        return Array.from(this.chatslog.values());
    }
    getUnreadMessageMap() {
        return this.unreadMessageMap;
    }
    setUnreadMessageMap(unreads) {
        unreads.map((v) => {
            this.unreadMessageMap.set(v.rid, v);
        });
    }
    addUnreadMessage(unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    getUnreadItem(roomId) {
        return this.unreadMessageMap.get(roomId);
    }
    onUpdatedLastAccessTime(data) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(data);
        }
    }
    addOnChatListener(listener) {
        this.chatListeners.push(listener);
    }
    onChat(message) {
        console.log("ChatsLogComponent.onChat", message);
        const self = this;
        CryptoHelper.decryptionText(message).then((decoded) => {
            // Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }
    onAccessRoom(dataEvent) {
        const self = this;
        this.unreadMessageMap.clear();
        this.chatslog.clear();
        const roomAccess = dataEvent.roomAccess;
        const results = new Array();
        const done = () => {
            self.isReady = true;
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
    onAddRoomAccess(dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }
    getUnreadMessages(userId, roomAccess, callback) {
        const self = this;
        const unreadLogs = new Array();
        // create a queue object with concurrency 2
        const q = async.queue((task, cb) => {
            if (!!task.roomId && !!task.accessTime) {
                getUnreadMessage(userId, task).then((value) => {
                    unreadLogs.push(value);
                    cb();
                }).catch((err) => {
                    if (err) {
                        console.warn("getUnreadMessage", err);
                    }
                    cb();
                });
            }
            else {
                cb();
            }
        }, 10);
        // assign a callback
        q.drain = () => {
            if (InternalStore.logLevel === LogLevel.debug) {
                console.log("getUnreadMessages from your roomAccess is done.", unreadLogs);
            }
            callback(undefined, unreadLogs);
        };
        // add some items to the queue (batch-wise)
        if (roomAccess && roomAccess.length > 0) {
            q.push(roomAccess, (err) => {
                if (!!err) {
                    console.error("getUnreadMessage err", err);
                }
            });
        }
        else {
            callback(undefined, undefined);
        }
    }
    decorateRoomInfoData(roomInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (roomInfo.type === RoomType.privateChat) {
                if (Array.isArray(roomInfo.members)) {
                    const others = roomInfo.members.filter((value) => value._id !== InternalStore.authStore.user._id);
                    if (others.length > 0) {
                        const contact = others[0];
                        const avatar = require("./assets/ic_account_circle_black.png");
                        roomInfo.owner = (contact.username) ? contact.username : "EMPTY ROOM";
                        roomInfo.image = (contact.avatar) ? contact.avatar : avatar;
                    }
                }
            }
            return roomInfo;
        });
    }
    getRoomInfo(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            try {
                const response = yield chatroomService.getRoomInfo(roomId);
                const json = yield response.json();
                // console.log("getRoomInfo result", json);
                if (json.success) {
                    const roomInfos = json.result;
                    const room = yield self.decorateRoomInfoData(roomInfos[0]);
                    return Promise.resolve(room);
                }
                else {
                    return Promise.reject(json.message);
                }
            }
            catch (ex) {
                return Promise.reject(ex.message);
            }
        });
    }
    getRoomsInfo(userId, chatrooms) {
        const self = this;
        // create a queue object with concurrency 2
        const q = async.queue((task, callback) => {
            const value = task;
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
            }
            else {
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
        q.drain = () => {
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent()) {
                self.getRoomsInfoCompleteEvent();
            }
        };
        this.unreadMessageMap.forEach((value, key, map) => {
            // add some items to the queue
            q.push(value, console.warn);
        });
    }
    manageChatLog(chatrooms) {
        const self = this;
        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            const q = async.queue((task, callback) => {
                const unread = task;
                const rooms = chatrooms.filter((v) => v._id === unread.rid);
                const room = (rooms.length > 0) ? rooms[0] : undefined;
                if (!room) {
                    callback();
                }
                self.organizeChatLogMap(unread, room, () => {
                    callback();
                });
            }, 2);
            // assign a callback
            q.drain = () => {
                resolve(self.chatslog);
            };
            this.unreadMessageMap.forEach((value, key, map) => {
                // add some items to the queue
                q.push(value, console.warn);
            });
        });
    }
    organizeChatLogMap(unread, roomInfo, done) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const log = new ChatLog(roomInfo);
            log.setNotiCount(unread.count);
            if (!!unread.message) {
                log.setLastMessageTime(unread.message.createTime.toString());
                let contact = null;
                try {
                    contact = yield chatlogActionsHelper.getContactProfile(unread.message.sender);
                }
                catch (err) {
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
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.Sticker]:
                            displayMsg = sender + " sent a sticker.";
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.Voice]:
                            displayMsg = sender + " sent a voice message.";
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.Image]:
                            displayMsg = sender + " sent a image.";
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.Video]:
                            displayMsg = sender + " sent a video.";
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.Location]:
                            displayMsg = sender + " sent a location.";
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        case MessageType[MessageType.File]:
                            self.setLogProp(log, displayMsg, (newLog) => {
                                self.addChatLog(newLog, done);
                            });
                            break;
                        default:
                            console.log("bobo");
                            break;
                    }
                }
            }
            else {
                const displayMsg = "Start Chatting Now!";
                self.setLogProp(log, displayMsg, (newLog) => {
                    self.addChatLog(newLog, done);
                });
            }
        });
    }
    setLogProp(log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    }
    addChatLog(chatLog, done) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    }
    checkRoomInfo(unread, chatrooms) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter((v) => v._id === unread.rid) : [];
            const roomInfo = rooms[0];
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                const room = yield self.getRoomInfo(unread.rid);
                const p = new Promise((resolve, rejected) => {
                    if (!room) {
                        rejected();
                    }
                    else {
                        this.organizeChatLogMap(unread, room, () => {
                            resolve(room);
                        });
                    }
                });
                return p;
            }
            else {
                console.log("organize chats log of room: ", roomInfo.owner);
                const p = new Promise((resolve, rejected) => {
                    this.organizeChatLogMap(unread, roomInfo, () => {
                        resolve();
                    });
                });
            }
        });
    }
    getChatsLogCount() {
        return this.chatlogCount;
    }
    increaseChatsLogCount(num) {
        this.chatlogCount += num;
    }
    decreaseChatsLogCount(num) {
        this.chatlogCount -= num;
    }
    calculateChatsLogCount() {
        this.chatlogCount = 0;
        this.unreadMessageMap.forEach((value, key) => {
            const count = value.count;
            this.chatlogCount += count;
        });
    }
}
