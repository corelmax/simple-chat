import { combineReducers, Reducer } from "redux";

import { stalkReducer } from "../redux/stalkBridge/stalkReducer";
import { chatroomReducer } from "../redux/chatroom/chatroomReducer";
import { chatlogReducer } from "../redux/chatlogs/chatlogReducer";

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
