import { combineReducers } from "redux";
import { stalkReducer } from "../redux/stalkBridge/stalkReducer";
import { chatroomReducer } from "../redux/chatroom/chatroomReducer";
import { chatlogReducer } from "../redux/chatlogs/chatlogReducer";
var rootReducer = combineReducers({
    stalkReducer: stalkReducer,
    chatroomReducer: chatroomReducer,
    chatlogReducer: chatlogReducer,
});
export default rootReducer;
