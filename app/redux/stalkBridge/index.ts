import * as stalkBridgeActions from "./stalkBridgeActions";
import * as stalkNotificationActions from "./stalkNotificationActions";
import * as stalkReducer from "./stalkReducer";

export namespace StalkBridge {
    export import StalkReducer = stalkReducer;
    export import StalkNotificationActions = stalkNotificationActions;
    export import StalkBridgeActions = stalkBridgeActions;
}
