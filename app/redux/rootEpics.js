import { combineEpics } from 'redux-observable';
import { createPrivateChatRoomEpic } from "./chatroom/chatroomRxEpic";
export const rootEpic = combineEpics(createPrivateChatRoomEpic);
