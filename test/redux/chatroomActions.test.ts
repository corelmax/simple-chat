import { sendMessage } from "../../app/redux/chatroom/chatroomActions";
import { MessageType } from "stalk-js/starter/models";

import { store } from "../../app/redux/configStore";
import InternalStore from "../../app/InternalStore";

InternalStore.initStore(store);

test("test action sendMessage", () => {
});
