export * from "./ChatLog";
export * from "./Room";
export * from "./MessageImp";
export * from "./MemberImp";
export * from "./FileType";
export * from "./FileResult";
export * from "./Constant";
export * from "./IChatRoom";
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

export namespace Models {
    export import ChatLog = chatLog;
    export import Constant = constant;
    export import FileResult = fr;
    export import FileType = ft;
    export import IChatRoom = iChatroom;
    export import IProfile = iPro;
    export import MemberImp = memberImp;
    export import MessageImp = messageImp;
    export import Room = r;
    export import Unread = ur;
    export import UserRole = urole;
}
