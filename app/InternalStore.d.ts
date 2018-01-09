import { Store } from "redux";
import { IStalkConfig, IApiConfig } from "stalk-js/starter";
import { ChatsLogComponent } from "./ChatslogComponent";
import { IDataManager } from "./IDataManager";
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
    chatlogInstance: ChatsLogComponent;
    createChatLogInstance(): void;
    dataManager: IDataManager;
    setStorage(storageObj: any): void;
};
export default _default;
