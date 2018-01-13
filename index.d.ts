export { ChatRoomComponent, ChatsLogComponent, ON_MESSAGE_CHANGE } from "./app/index";
export { IDataManager } from "./app/IDataManager";
export { StalkBridge } from "./app/redux/stalkBridge";
export * from "./app/redux/chatroom";
export * from "./app/redux/chatlogs";
export * from "./app/redux/actions/chatlistsRx";
export { SecureUtils } from "./app/utils";
export { SecureServiceFactory } from "./app/utils/secure/SecureServiceFactory";
export { withToken, apiHeaders } from "./app/services";
import * as iMessageDal from "./app/DAL/IMessageDAL";
import * as messageDal from "./app/DAL/MessageDAL";
import * as nodeMessageDal from "./app/DAL/NodeMessageDAL";
export declare namespace DAL {
    export import MessageDAL = messageDal;
    export import ReactNativeMessageDAL = nodeMessageDal;
    export import IMessageDAL = iMessageDal;
}
import InternalStore from "./app/InternalStore";
export default InternalStore;
