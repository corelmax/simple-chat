import { Store } from "redux";
import { IStalkConfig, IApiConfig } from "stalk-js/starter";

import { ChatsLogComponent } from "./ChatslogComponent";
import { ChatRoomComponent } from "./ChatRoomComponent";

export interface IAuthStore {
    user: { _id: string, username: string };
    api_token: string;
}

export default new class InternalStore {
    store: Store<any>;
    public initStore(store: Store<any>) {
        this.store = { ...store };
    }

    authStore: IAuthStore;
    setAuth(newState: IAuthStore) {
        this.authStore = { ...newState };
    }

    appStateEvent: string;

    config: IStalkConfig;
    public initConfig(config: IStalkConfig) {
        this.config = config;
    }
    public getConfig(): IStalkConfig { return this.config; }

    apiConfig: IApiConfig;
    public initApiConfig(config: IApiConfig) {
        this.apiConfig = config;
    }
    public getApiConfig(): IApiConfig { return this.apiConfig; }

    chatlogInstance: ChatsLogComponent;
    public createChatLogInstance() {
        this.chatlogInstance = new ChatsLogComponent();
    }
};
