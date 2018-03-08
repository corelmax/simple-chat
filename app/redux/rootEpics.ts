import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

import { createPrivateChatRoomEpic } from "./chatroom/chatroomRxEpic";

export const rootEpic = combineEpics(
    createPrivateChatRoomEpic,
);