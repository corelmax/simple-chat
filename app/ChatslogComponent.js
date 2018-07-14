var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var Unread = /** @class */ (function () {
    function Unread() {
        this.rid = "";
        this.count = 0;
    }
    return Unread;
}());
export { Unread };
export function getUnreadMessage(userId, roomAccess) {
    return __awaiter(this, void 0, void 0, function () {
        var response, value, unread, decoded, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, chatroomService.getUnreadMessage(roomAccess.roomId, userId, roomAccess.accessTime.toString())];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    value = _a.sent();
                    if (InternalStore.logLevel === LogLevel.debug) {
                        console.log("getUnreadMessage", value);
                    }
                    if (!value.success) return [3 /*break*/, 4];
                    unread = value.result;
                    unread.rid = roomAccess.roomId;
                    return [4 /*yield*/, CryptoHelper.decryptionText(unread.message)];
                case 3:
                    decoded = _a.sent();
                    return [2 /*return*/, unread];
                case 4: return [2 /*return*/, Promise.reject(value.message)];
                case 5: return [3 /*break*/, 7];
                case 6:
                    ex_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(ex_1)];
                case 7: return [2 /*return*/];
            }
        });
    });
}
var ChatsLogComponent = /** @class */ (function () {
    function ChatsLogComponent(backendFactory) {
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
    ChatsLogComponent.prototype.getChatsLog = function () {
        return Array.from(this.chatslog.values());
    };
    ChatsLogComponent.prototype.getUnreadMessageMap = function () {
        return this.unreadMessageMap;
    };
    ChatsLogComponent.prototype.setUnreadMessageMap = function (unreads) {
        var _this = this;
        unreads.map(function (v) {
            _this.unreadMessageMap.set(v.rid, v);
        });
    };
    ChatsLogComponent.prototype.addUnreadMessage = function (unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    };
    ChatsLogComponent.prototype.getUnreadItem = function (roomId) {
        return this.unreadMessageMap.get(roomId);
    };
    ChatsLogComponent.prototype.onUpdatedLastAccessTime = function (data) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(data);
        }
    };
    ChatsLogComponent.prototype.addOnChatListener = function (listener) {
        this.chatListeners.push(listener);
    };
    ChatsLogComponent.prototype.onChat = function (message) {
        console.log("ChatsLogComponent.onChat", message);
        var self = this;
        CryptoHelper.decryptionText(message).then(function (decoded) {
            // Provide chatslog service.
            self.chatListeners.map(function (v, i, a) {
                v(decoded);
            });
        });
    };
    ChatsLogComponent.prototype.onAccessRoom = function (dataEvent) {
        var self = this;
        this.unreadMessageMap.clear();
        this.chatslog.clear();
        var roomAccess = dataEvent.roomAccess;
        var results = new Array();
        var done = function () {
            self.isReady = true;
            if (!!self.onReady) {
                self.onReady(results);
            }
        };
        async.each(roomAccess, function (item, resultCallback) {
            self.getRoomInfo(item.roomId)
                .then(function (room) {
                results.push(room);
                resultCallback();
            }).catch(function (err) {
                if (err) {
                    console.warn("getRoomInfo", err);
                }
                resultCallback();
            });
        }, function (err) {
            console.log("onAccessRoom.finished!", err);
            done();
        });
    };
    ChatsLogComponent.prototype.onAddRoomAccess = function (dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    };
    ChatsLogComponent.prototype.getUnreadMessages = function (userId, roomAccess, callback) {
        var self = this;
        var unreadLogs = new Array();
        // create a queue object with concurrency 2
        var q = async.queue(function (task, cb) {
            if (!!task.roomId && !!task.accessTime) {
                getUnreadMessage(userId, task).then(function (value) {
                    unreadLogs.push(value);
                    cb();
                }).catch(function (err) {
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
        q.drain = function () {
            if (InternalStore.logLevel === LogLevel.debug) {
                console.log("getUnreadMessages from your roomAccess is done.", unreadLogs);
            }
            callback(undefined, unreadLogs);
        };
        // add some items to the queue (batch-wise)
        if (roomAccess && roomAccess.length > 0) {
            q.push(roomAccess, function (err) {
                if (!!err) {
                    console.error("getUnreadMessage err", err);
                }
            });
        }
        else {
            callback(undefined, undefined);
        }
    };
    ChatsLogComponent.prototype.decorateRoomInfoData = function (roomInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var others, contact, avatar;
            return __generator(this, function (_a) {
                if (roomInfo.type === RoomType.privateChat) {
                    if (Array.isArray(roomInfo.members)) {
                        others = roomInfo.members.filter(function (value) {
                            return value._id !== InternalStore.authStore.user._id;
                        });
                        if (others.length > 0) {
                            contact = others[0];
                            avatar = require("./assets/ic_account_circle_black.png");
                            roomInfo.owner = (contact.username) ? contact.username : "EMPTY ROOM";
                            roomInfo.image = (contact.avatar) ? contact.avatar : avatar;
                        }
                    }
                }
                return [2 /*return*/, roomInfo];
            });
        });
    };
    ChatsLogComponent.prototype.getRoomInfo = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var self, response, json, roomInfos, room, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, chatroomService.getRoomInfo(roomId)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        if (!json.success) return [3 /*break*/, 5];
                        roomInfos = json.result;
                        return [4 /*yield*/, self.decorateRoomInfoData(roomInfos[0])];
                    case 4:
                        room = _a.sent();
                        return [2 /*return*/, Promise.resolve(room)];
                    case 5: return [2 /*return*/, Promise.reject(json.message)];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        ex_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(ex_2.message)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ChatsLogComponent.prototype.getRoomsInfo = function (userId, chatrooms) {
        var self = this;
        // create a queue object with concurrency 2
        var q = async.queue(function (task, callback) {
            var value = task;
            var rooms = chatrooms.filter(function (v) { return v._id === value.rid; });
            var roomInfo = (rooms.length > 0) ? rooms[0] : undefined;
            if (!!roomInfo) {
                self.decorateRoomInfoData(roomInfo).then(function (room) {
                    chatrooms.forEach(function (v) {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch(function (err) {
                    callback();
                });
            }
            else {
                console.log("Can't find roomInfo from persisted data: ", value.rid);
                self.getRoomInfo(value.rid).then(function (room) {
                    chatrooms.forEach(function (v) {
                        if (v._id === room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                }).catch(function (err) {
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
        this.unreadMessageMap.forEach(function (value, key, map) {
            // add some items to the queue
            q.push(value, console.warn);
        });
    };
    ChatsLogComponent.prototype.manageChatLog = function (chatrooms) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, rejected) {
            // create a queue object with concurrency 2
            var q = async.queue(function (task, callback) {
                var unread = task;
                var rooms = chatrooms.filter(function (v) { return v._id === unread.rid; });
                var room = (rooms.length > 0) ? rooms[0] : undefined;
                if (!room) {
                    callback();
                }
                self.organizeChatLogMap(unread, room, function () {
                    callback();
                });
            }, 2);
            // assign a callback
            q.drain = function () {
                resolve(self.chatslog);
            };
            _this.unreadMessageMap.forEach(function (value, key, map) {
                // add some items to the queue
                q.push(value, console.warn);
            });
        });
    };
    ChatsLogComponent.prototype.organizeChatLogMap = function (unread, roomInfo, done) {
        return __awaiter(this, void 0, void 0, function () {
            var self, log, contact, err_1, sender, displayMsg, displayMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        log = new ChatLog(roomInfo);
                        log.setNotiCount(unread.count);
                        if (!!!unread.message) return [3 /*break*/, 5];
                        log.setLastMessageTime(unread.message.createTime.toString());
                        contact = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chatlogActionsHelper.getContactProfile(unread.message.sender)];
                    case 2:
                        contact = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (err_1) {
                            console.warn("get sender contact fail", err_1.message);
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        sender = (!!contact) ? contact.username : "";
                        if (unread.message.body !== null) {
                            displayMsg = unread.message.body;
                            switch ("" + unread.message.type) {
                                case MessageType[MessageType.Text]:
                                    /*
                                        self.main.decodeService(displayMsg, function (err, res) {
                                            if (!err) {
                                                displayMsg = res;
                                            } else { console.warn(err, res); }
                                        });
                                    */
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.Sticker]:
                                    displayMsg = sender + " sent a sticker.";
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.Voice]:
                                    displayMsg = sender + " sent a voice message.";
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.Image]:
                                    displayMsg = sender + " sent a image.";
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.Video]:
                                    displayMsg = sender + " sent a video.";
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.Location]:
                                    displayMsg = sender + " sent a location.";
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                case MessageType[MessageType.File]:
                                    self.setLogProp(log, displayMsg, function (newLog) {
                                        self.addChatLog(newLog, done);
                                    });
                                    break;
                                default:
                                    console.log("bobo");
                                    break;
                            }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        displayMsg = "Start Chatting Now!";
                        self.setLogProp(log, displayMsg, function (newLog) {
                            self.addChatLog(newLog, done);
                        });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatsLogComponent.prototype.setLogProp = function (log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    };
    ChatsLogComponent.prototype.addChatLog = function (chatLog, done) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    };
    ChatsLogComponent.prototype.checkRoomInfo = function (unread, chatrooms) {
        return __awaiter(this, void 0, void 0, function () {
            var self, rooms, roomInfo, room_1, p, p;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter(function (v) { return v._id === unread.rid; }) : [];
                        roomInfo = rooms[0];
                        if (!!roomInfo) return [3 /*break*/, 2];
                        console.warn("No have roomInfo in room store.", unread.rid);
                        return [4 /*yield*/, self.getRoomInfo(unread.rid)];
                    case 1:
                        room_1 = _a.sent();
                        p = new Promise(function (resolve, rejected) {
                            if (!room_1) {
                                rejected();
                            }
                            else {
                                _this.organizeChatLogMap(unread, room_1, function () {
                                    resolve(room_1);
                                });
                            }
                        });
                        return [2 /*return*/, p];
                    case 2:
                        console.log("organize chats log of room: ", roomInfo.owner);
                        p = new Promise(function (resolve, rejected) {
                            _this.organizeChatLogMap(unread, roomInfo, function () {
                                resolve();
                            });
                        });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatsLogComponent.prototype.getChatsLogCount = function () {
        return this.chatlogCount;
    };
    ChatsLogComponent.prototype.increaseChatsLogCount = function (num) {
        this.chatlogCount += num;
    };
    ChatsLogComponent.prototype.decreaseChatsLogCount = function (num) {
        this.chatlogCount -= num;
    };
    ChatsLogComponent.prototype.calculateChatsLogCount = function () {
        var _this = this;
        this.chatlogCount = 0;
        this.unreadMessageMap.forEach(function (value, key) {
            var count = value.count;
            _this.chatlogCount += count;
        });
    };
    return ChatsLogComponent;
}());
export { ChatsLogComponent };
