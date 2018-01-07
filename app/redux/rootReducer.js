"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const stalkReducer_1 = require("../redux/stalkBridge/stalkReducer");
const chatroomReducer_1 = require("../redux/chatroom/chatroomReducer");
const chatlogReducer_1 = require("../redux/chatlogs/chatlogReducer");
const rootReducer = redux_1.combineReducers({
    stalkReducer: stalkReducer_1.stalkReducer,
    chatroomReducer: chatroomReducer_1.chatroomReducer,
    chatlogReducer: chatlogReducer_1.chatlogReducer,
});
exports.default = rootReducer;
