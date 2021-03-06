export * from "./ChatLog";
export * from "./Room";
export * from "./MessageImp";
export * from "./MemberImp";
export * from "./FileType";
export * from "./Constant";
export * from "./IProfile";
export * from "./Unread";
export * from "./UserRole";
import * as chatLog from "./ChatLog";
import * as constant from "./Constant";
import * as fr from "./FileResult";
import * as ft from "./FileType";
import * as iChatroom from "./IChatRoom";
import * as iPro from "./IProfile";
import * as memberImp from "./MemberImp";
import * as messageImp from "./MessageImp";
import * as r from "./Room";
import * as ur from "./Unread";
import * as urole from "./UserRole";
export var Models;
(function (Models) {
    Models.ChatLog = chatLog;
    Models.Constant = constant;
    Models.FileResult = fr;
    Models.FileType = ft;
    Models.IChatRoom = iChatroom;
    Models.IProfile = iPro;
    Models.MemberImp = memberImp;
    Models.MessageImp = messageImp;
    Models.Room = r;
    Models.Unread = ur;
    Models.UserRole = urole;
})(Models || (Models = {}));
