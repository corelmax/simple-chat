import { Store } from "redux";
import { IStalkConfig, IApiConfig } from "stalk-js/starter";
import { ChatsLogComponent } from "./ChatslogComponent";
import { IDataManager } from "./IDataManager";
import { IMessageDAL } from "./DAL/IMessageDAL";
import { LogLevel } from "../index";
export interface IAuthStore {
    user: {
        _id: string;
        username: string;
    };
    api_token: string;
}
declare const _default: {
    store: Store<any>;
    initStore(store: Store<any>): void;
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
    chatlogInstance: ChatsLogComponent;
    createChatLogInstance(): ChatsLogComponent;
    dataManager: IDataManager;
    setStorage(storageObj: IMessageDAL): void;
    logLevel: LogLevel;
};
export default _default;
