import { combineEpics } from "redux-observable";
import { createPrivateChatRoomEpic } from "./chatroom/chatroomRxEpic";
export var rootEpic = combineEpics(createPrivateChatRoomEpic);
