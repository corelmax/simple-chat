export { ChatRoomComponent, ChatsLogComponent } from "./app/index";
export { IDataManager } from "./app/IDataManager";
export * from "./app/InternalStore";
import * as CryptoHelper from "./app/utils/CryptoHelper";
export { SecureServiceFactory } from "./app/utils/secure/SecureServiceFactory";
export import decryptionText = CryptoHelper.decryptionText;
export import hashComputation = CryptoHelper.hashComputation;
