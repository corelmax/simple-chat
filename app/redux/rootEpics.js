"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_observable_1 = require("redux-observable");
const chatroomRxEpic_1 = require("./chatroom/chatroomRxEpic");
exports.rootEpic = redux_observable_1.combineEpics(chatroomRxEpic_1.createPrivateChatRoomEpic);
