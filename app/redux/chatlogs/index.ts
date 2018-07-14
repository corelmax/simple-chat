export * from "./chatlogActions";
export * from "./chatlogRxActions";
export * from "./chatlogReducer";

import * as chatlogActions from "./chatlogActions";
import * as chatlogReducer from "./chatlogReducer";
import * as chatlogRxActions from "./chatlogRxActions";

export namespace ChatlogRedux {
    export import ChatlogActions = chatlogActions;
    export import ChatlogRxActions = chatlogRxActions;
    export import ChatlogReducer = chatlogReducer;
}
