import { combineReducers, Reducer } from "redux";

import { chatlogReducer } from "../redux/chatlogs/chatlogReducer";
import { chatroomReducer } from "../redux/chatroom/chatroomReducer";
import { stalkReducer } from "../redux/stalkBridge/stalkReducer";

const rootReducer = combineReducers({
    stalkReducer,
    chatroomReducer,
    chatlogReducer,
}) as Reducer<{
    stalkReducer: any,
    chatroomReducer: any,
    chatlogReducer: any,
}>;

export default rootReducer as Reducer<any>;
