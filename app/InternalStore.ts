import { Store } from "redux";
import { IStalkConfig, IApiConfig, BackendFactory } from "stalk-js/starter";

import { ChatsLogComponent } from "./ChatslogComponent";
import { ChatRoomComponent } from "./ChatRoomComponent";
import { IDataManager } from "./IDataManager";
import { IMessageDAL } from "./DAL/IMessageDAL";

export interface IAuthStore {
    user: { _id: string, username: string };
    api_token: string;
}

export enum LogLevel {
    debug = 0, warn = 1, error = 2,
}

export default new class InternalStore {
    store: Store<any>;
    public initStore(store: Store<any>) {
        this.store = { ...store };
    }

    authStore: IAuthStore;
    setAuth(newState: IAuthStore) {
        this.authStore = newState;
    }

    appStateEvent: string = "";

    config: IStalkConfig;
    public initConfig(config: IStalkConfig) {
        this.config = config;
    }
    public getConfig() {
        return this.config;
    }

    apiConfig: IApiConfig;
    public initApiConfig(config: IApiConfig) {
        this.apiConfig = config;
    }
    public getApiConfig() { return this.apiConfig; }

    encryption: boolean = false;
    secret: string = "";

    chatlogInstance: ChatsLogComponent;
    public createChatLogInstance(backendFactory: BackendFactory) {
        this.chatlogInstance = new ChatsLogComponent(backendFactory);
        return this.chatlogInstance;
    }

    dataManager: IDataManager;
    /**
     * React.js please use MessageDAL module.
     * React-Native please use NodeMessageDAL instead.
     * @param storageObj
     */
    setStorage(storageObj: IMessageDAL) {
        this.dataManager.messageDAL = storageObj;
    }

    logLevel: LogLevel;
    public setLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    constructor() {
        this.store = Object.create(null);
        this.authStore = Object.create(null);
        this.logLevel = Object.create(null);
        this.config = Object.create(null);
        this.apiConfig = Object.create(null);
        this.chatlogInstance = Object.create(null);
        this.dataManager = Object.create(null);
    }
};
