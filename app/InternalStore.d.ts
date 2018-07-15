import { Store } from "redux";
import { BackendFactory, IApiConfig, IStalkConfig } from "stalk-js/starter";
import { ChatsLogComponent } from "./ChatslogComponent";
import { IMessageDAL } from "./DAL/IMessageDAL";
import { IDataManager } from "./IDataManager";
export interface IAuthStore {
    user: {
        _id: string;
        username: string;
    };
    api_token: string;
}
export declare enum LogLevel {
    debug = 0,
    warn = 1,
    error = 2
}
declare const _default: {
    store: Store<any, import("../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/redux").AnyAction>;
    initStore(store: Store<any, import("../../../../../../Users/nattapon/Projects/stalk/simpleChat/node_modules/redux").AnyAction>): void;
    authStore: IAuthStore;
    setAuth(newState: IAuthStore): void;
    appStateEvent: string;
    config: IStalkConfig;
    initConfig(config: IStalkConfig): void;
    getConfig(): IStalkConfig;
    apiConfig: IApiConfig;
    initApiConfig(config: IApiConfig): void;
    getApiConfig(): IApiConfig;
    encryption: boolean;
    secret: string;
    chatlog: ChatsLogComponent;
    createChatLogInstance(backendFactory: BackendFactory): ChatsLogComponent;
    dataManager: IDataManager;
    /**
     * React.js please use MessageDAL module.
     * React-Native please use NodeMessageDAL instead.
     * @param storageObj
     */
    setStorage(storageObj: IMessageDAL): void;
    logLevel: LogLevel;
    setLogLevel(level: LogLevel): void;
};
export default _default;
