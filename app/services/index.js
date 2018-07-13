"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./ServiceUtils"));
const authService = require("./authService");
const userService = require("./UserService");
const serviceUtils = require("./ServiceUtils");
const messageService = require("./MessageService");
const chatlogService = require("./ChatlogService");
const chatroomService = require("./ChatroomService");
const groupService = require("./GroupService");
var Services;
(function (Services) {
    Services.AuthService = authService;
    Services.UserService = userService;
    Services.ServiceUtils = serviceUtils;
    Services.MessageService = messageService;
    Services.ChatlogService = chatlogService;
    Services.ChatroomService = chatroomService;
    Services.GroupService = groupService;
})(Services = exports.Services || (exports.Services = {}));
