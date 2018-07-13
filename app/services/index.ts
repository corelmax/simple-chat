export * from "./ServiceUtils";

import * as authService from "./authService";
import * as userService from "./UserService";
import * as serviceUtils from "./ServiceUtils";
import * as messageService from "./MessageService";
import * as chatlogService from "./ChatlogService";
import * as chatroomService from "./ChatroomService";
import * as groupService from "./GroupService";

export namespace Services {
    export import AuthService = authService;
    export import UserService = userService;
    export import ServiceUtils = serviceUtils;
    export import MessageService = messageService;
    export import ChatlogService = chatlogService;
    export import ChatroomService = chatroomService;
    export import GroupService = groupService;
}