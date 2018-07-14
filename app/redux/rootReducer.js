import { combineReducers } from "redux";
import { stalkReducer } from "../redux/stalkBridge/stalkReducer";
import { chatroomReducer } from "../redux/chatroom/chatroomReducer";
import { chatlogReducer } from "../redux/chatlogs/chatlogReducer";
const rootReducer = combineReducers({
    stalkReducer,
    chatroomReducer,
    chatlogReducer,
});
export default rootReducer;
