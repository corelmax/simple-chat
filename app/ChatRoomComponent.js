/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
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
import * as async from "async";
import * as Rx from "rxjs";
import { BackendFactory } from "stalk-js/starter/BackendFactory";
import { ChatEvents } from "stalk-js/stalkjs";
import * as chatroomService from "./services/ChatroomService";
import { decryptionText } from "./utils/CryptoHelper";
import { SecureServiceFactory } from "./utils/secure/SecureServiceFactory";
import { MessageType } from "stalk-js/starter/models/index";
// import { imagesPath } from "../consts/StickerPath";
import InternalStore from "./InternalStore";
var getConfig = function () { return BackendFactory.getInstance().config; };
var getStore = function () { return InternalStore.store; };
export var ON_MESSAGE_CHANGE = "ON_MESSAGE_CHANGE";
var ChatRoomComponent = /** @class */ (function () {
    function ChatRoomComponent(dataManager) {
        var _this = this;
        this.updateMessageQueue = new Array();
        this.saveMessages = function (chatMessages, message) {
            var self = _this;
            chatMessages.push(message);
            self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then(function (chats) {
                if (!!self.chatroomDelegate) {
                    self.chatroomDelegate(ChatEvents.ON_CHAT, message);
                    self.chatroomDelegate(ON_MESSAGE_CHANGE, chatMessages);
                }
            });
        };
        console.log("ChatRoomComponent: constructor");
        this.roomId = "";
        this.chatroomDelegate = undefined;
        this.outsideRoomDelegete = undefined;
        this.secure = SecureServiceFactory.getService();
        var backendFactory = BackendFactory.getInstance();
        this.dataManager = dataManager;
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        var source = Rx.Observable.timer(1000, 1000);
        var subscribe = source.subscribe(function (val) {
            if (_this.updateMessageQueue.length > 0) {
                var queues = _this.updateMessageQueue.slice();
                _this.updateMessageQueue = new Array();
                _this.messageReadTick(queues, _this.roomId);
            }
        });
    }
    ChatRoomComponent.getInstance = function () {
        return ChatRoomComponent.instance;
    };
    ChatRoomComponent.createInstance = function (datamanager) {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent(datamanager);
        }
        return ChatRoomComponent.instance;
    };
    ChatRoomComponent.prototype.getRoomId = function () {
        return this.roomId;
    };
    ChatRoomComponent.prototype.setRoomId = function (rid) {
        this.roomId = rid;
    };
    ChatRoomComponent.prototype.saveToPersisted = function (message) {
        var self = this;
        this.dataManager.messageDAL.getData(this.roomId).then(function (chats) {
            var chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
            if (message.type === MessageType[MessageType.Text]) {
                decryptionText(message).then(function (decoded) {
                    self.saveMessages(chatMessages, message);
                }).catch(function (err) { return self.saveMessages(chatMessages, message); });
            }
            else {
                self.saveMessages(chatMessages, message);
            }
        }).catch(function (err) {
            console.warn("Cannot get persistend message of room", err);
        });
    };
    ChatRoomComponent.prototype.onChat = function (message) {
        console.log("ChatRoomComponent.onChat", message);
        if (this.roomId === message.rid) {
            this.saveToPersisted(message);
        }
        else {
            console.log("this msg come from other room.");
            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ChatEvents.ON_CHAT, message);
            }
        }
    };
    ChatRoomComponent.prototype.onRoomJoin = function (data) { };
    ChatRoomComponent.prototype.onLeaveRoom = function (data) { };
    ChatRoomComponent.prototype.messageReadTick = function (messageQueue, roomId) {
        return __awaiter(this, void 0, void 0, function () {
            var chatMessages, chats, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatMessages = Object.create(null);
                        return [4 /*yield*/, this.dataManager.messageDAL.getData(roomId)];
                    case 1:
                        chats = _a.sent();
                        chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
                        messageQueue.forEach(function (message) {
                            chatMessages.some(function (value) {
                                if (value._id === message._id) {
                                    value.readers = message.readers;
                                    return true;
                                }
                            });
                        });
                        return [4 /*yield*/, this.dataManager.messageDAL.saveData(roomId, chatMessages)];
                    case 2:
                        results = _a.sent();
                        if (!!this.chatroomDelegate) {
                            this.chatroomDelegate(ON_MESSAGE_CHANGE, results);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.onMessageRead = function (message) {
        this.updateMessageQueue.push(message);
    };
    ChatRoomComponent.prototype.onGetMessagesReaders = function (dataEvent) {
        console.log("onGetMessagesReaders", dataEvent);
        var self = this;
        var myMessagesArr = JSON.parse(JSON.stringify(dataEvent.data));
        self.chatMessages.forEach(function (originalMsg, id, arr) {
            if (self.dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some(function (myMsg, index, array) {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });
        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    };
    ChatRoomComponent.prototype.getPersistentMessage = function (rid) {
        return __awaiter(this, void 0, void 0, function () {
            var self, messages, prom, chatResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.dataManager.messageDAL.getData(rid)];
                    case 1:
                        messages = _a.sent();
                        if (!(messages && messages.length > 0)) return [3 /*break*/, 3];
                        prom = new Promise(function (resolve, reject) {
                            var chats = messages.slice(0);
                            async.forEach(chats, function iterator(chat, result) {
                                if (chat.type === MessageType[MessageType.Text]) {
                                    if (InternalStore.encryption === true) {
                                        self.secure.decryption(chat.body).then(function (res) {
                                            chat.body = res;
                                            result(null);
                                        }).catch(function (err) { return result(null); });
                                    }
                                    else {
                                        result(null);
                                    }
                                }
                                else {
                                    result(null);
                                }
                            }, function (err) {
                                console.log("decoded chats completed.", chats.length);
                                self.dataManager.messageDAL.saveData(rid, chats);
                                resolve(chats);
                            });
                        });
                        return [4 /*yield*/, prom];
                    case 2:
                        chatResult = _a.sent();
                        return [2 /*return*/, chatResult];
                    case 3:
                        console.log("chatMessages is empty!");
                        return [2 /*return*/, new Array()];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getNewerMessageRecord = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var self, lastMessageTime, getLastMessageTime, saveMergedMessage, getNewerMessage, messages;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        lastMessageTime = new Date();
                        getLastMessageTime = function (cb) {
                            var roomAccess = getStore().getState().chatlogReducer.roomAccess;
                            async.some(roomAccess, function (item, asyncCb) {
                                if (item.roomId === self.roomId) {
                                    lastMessageTime = item.accessTime;
                                    asyncCb(undefined, true);
                                }
                                else {
                                    asyncCb(undefined, false);
                                }
                            }, function (err, result) {
                                cb(result);
                            });
                        };
                        saveMergedMessage = function (histories) { return __awaiter(_this, void 0, void 0, function () {
                            var tempResults, results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        tempResults = new Array();
                                        if (messages && messages.length > 0) {
                                            tempResults = messages.concat(histories);
                                        }
                                        else {
                                            tempResults = histories.slice();
                                        }
                                        return [4 /*yield*/, self.dataManager.messageDAL.saveData(self.roomId, tempResults)];
                                    case 1:
                                        results = _a.sent();
                                        callback(tempResults, this.roomId);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        getNewerMessage = function () { return __awaiter(_this, void 0, void 0, function () {
                            var histories, ex_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, self.getNewerMessages(lastMessageTime)];
                                    case 1:
                                        histories = _a.sent();
                                        saveMergedMessage(histories);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        ex_1 = _a.sent();
                                        saveMergedMessage([]);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, self.dataManager.messageDAL.getData(this.roomId)];
                    case 1:
                        messages = _a.sent();
                        if (messages && messages.length > 0) {
                            if (messages[messages.length - 1] !== null) {
                                lastMessageTime = messages[messages.length - 1].createTime;
                                getNewerMessage();
                            }
                            else {
                                getLastMessageTime(function (boo) {
                                    getNewerMessage();
                                });
                            }
                        }
                        else {
                            getLastMessageTime(function (boo) {
                                getNewerMessage();
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getNewerMessages = function (lastMessageTime) {
        return __awaiter(this, void 0, void 0, function () {
            var self, response, value_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, chatroomService.getNewerMessages(self.roomId, lastMessageTime)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        value_1 = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                if (value_1.success) {
                                    var histories_1 = new Array();
                                    histories_1 = value_1.result;
                                    if (histories_1.length > 0) {
                                        async.forEach(histories_1, function (chat, cb) {
                                            if (chat.type === MessageType[MessageType.Text]) {
                                                if (InternalStore.encryption === true) {
                                                    self.secure.decryption(chat.body).then(function (res) {
                                                        chat.body = res;
                                                        cb(undefined);
                                                    }).catch(function (err) {
                                                        cb(undefined);
                                                    });
                                                }
                                                else {
                                                    cb(undefined);
                                                }
                                            }
                                            else {
                                                cb(undefined);
                                            }
                                        }, function done(err) {
                                            if (!!err) {
                                                console.error("get newer message error", err);
                                                reject(err);
                                            }
                                            else {
                                                resolve(histories_1);
                                            }
                                        });
                                    }
                                    else {
                                        console.log("Have no newer message.");
                                        resolve(histories_1);
                                    }
                                }
                                else {
                                    console.warn("WTF god only know.", value_1);
                                    reject(value_1.message);
                                }
                            })];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getOlderMessageChunk = function (roomId) {
        return __awaiter(this, void 0, void 0, function () {
            function waitForRoomMessages() {
                return __awaiter(this, void 0, void 0, function () {
                    var messages;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.dataManager.messageDAL.getData(roomId)];
                            case 1:
                                messages = _a.sent();
                                return [2 /*return*/, messages];
                        }
                    });
                });
            }
            function saveRoomMessages(merged) {
                return __awaiter(this, void 0, void 0, function () {
                    var value;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.dataManager.messageDAL.saveData(roomId, merged)];
                            case 1:
                                value = _a.sent();
                                return [2 /*return*/, value];
                        }
                    });
                });
            }
            var self, time, response, result, earlyMessages, persistMessages, mergedMessageArray_1, resultsArray_1, results, merged;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.getTopEdgeMessageTime()];
                    case 1:
                        time = _a.sent();
                        if (!time) return [3 /*break*/, 12];
                        return [4 /*yield*/, chatroomService.getOlderMessagesCount(roomId, time.toString(), true)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        console.log("getOlderMessageChunk value", result);
                        if (!(result.success && result.result.length > 0)) return [3 /*break*/, 10];
                        earlyMessages = result.result;
                        return [4 /*yield*/, waitForRoomMessages()];
                    case 4:
                        persistMessages = _a.sent();
                        if (!(!!persistMessages && persistMessages.length > 0)) return [3 /*break*/, 7];
                        mergedMessageArray_1 = new Array();
                        mergedMessageArray_1 = earlyMessages.concat(persistMessages);
                        resultsArray_1 = new Array();
                        return [4 /*yield*/, new Promise(function (resolve, rejected) {
                                async.map(mergedMessageArray_1, function iterator(item, cb) {
                                    var hasMessage = resultsArray_1.some(function (value, id) {
                                        if (!!value && value._id === item._id) {
                                            return true;
                                        }
                                    });
                                    if (hasMessage === false) {
                                        resultsArray_1.push(item);
                                        cb(undefined, undefined);
                                    }
                                    else {
                                        cb(undefined, undefined);
                                    }
                                }, function done(err, results) {
                                    var merged = resultsArray_1.sort(self.compareMessage);
                                    resolve(merged);
                                });
                            })];
                    case 5:
                        results = _a.sent();
                        return [4 /*yield*/, saveRoomMessages(results)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        merged = earlyMessages.sort(self.compareMessage);
                        return [4 /*yield*/, saveRoomMessages(merged)];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, new Array()];
                    case 11: return [3 /*break*/, 13];
                    case 12: throw new Error("getTopEdgeMessageTime fail");
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getTopEdgeMessageTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            function waitRoomMessage() {
                return __awaiter(this, void 0, void 0, function () {
                    var topEdgeMessageTime, messages;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                topEdgeMessageTime = new Date();
                                return [4 /*yield*/, self.dataManager.messageDAL.getData(self.roomId)];
                            case 1:
                                messages = _a.sent();
                                if (!!messages && messages.length > 0) {
                                    if (!!messages[0].createTime) {
                                        topEdgeMessageTime = messages[0].createTime;
                                    }
                                }
                                console.log("topEdgeMessageTime is: ", topEdgeMessageTime);
                                return [2 /*return*/, topEdgeMessageTime];
                        }
                    });
                });
            }
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        waitRoomMessage().then(function (topEdgeMessageTime) {
                            resolve(topEdgeMessageTime);
                        }).catch(function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    ChatRoomComponent.prototype.compareMessage = function (a, b) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    };
    ChatRoomComponent.prototype.updateReadMessages = function () {
        var self = this;
        var backendFactory = BackendFactory.getInstance();
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!backendFactory.dataManager.isMySelf(message.sender)) {
                var chatroomApi = backendFactory.getServer().getChatRoomAPI();
                chatroomApi.updateMessageReader(message._id, message.rid);
            }
            resultCb(null, null);
        }, function done(err) {
            // done.
        });
    };
    ChatRoomComponent.prototype.updateWhoReadMyMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, res, backendFactory, chatroomApi;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.getTopEdgeMessageTime()];
                    case 1:
                        res = _a.sent();
                        backendFactory = BackendFactory.getInstance();
                        chatroomApi = backendFactory.getServer().getChatRoomAPI();
                        chatroomApi.getMessagesReaders(res.toString());
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getMemberProfile = function (member, callback) {
        var server = BackendFactory.getInstance().getServer();
        if (server) {
            server.getMemberProfile(member._id, callback);
        }
    };
    ChatRoomComponent.prototype.getMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataManager.messageDAL.getData(this.roomId)];
                    case 1:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        });
    };
    ChatRoomComponent.prototype.dispose = function () {
        console.log("ChatRoomComponent: dispose");
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        delete ChatRoomComponent.instance;
    };
    return ChatRoomComponent;
}());
export { ChatRoomComponent };
