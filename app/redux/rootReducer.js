import { combineReducers } from "redux";
import { chatlogReducer } from "../redux/chatlogs/chatlogReducer";
import { chatroomReducer } from "../redux/chatroom/chatroomReducer";
import { stalkReducer } from "../redux/stalkBridge/stalkReducer";
var rootReducer = combineReducers({
    stalkReducer: stalkReducer,
    chatroomReducer: chatroomReducer,
    chatlogReducer: chatlogReducer,
});
export default rootReducer;
