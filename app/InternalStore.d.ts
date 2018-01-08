import { IStalkConfig, IApiConfig } from "stalk-js/starter";
import { ChatsLogComponent } from "./ChatslogComponent";
export interface IAuthStore {
    user: {
        _id: string;
        username: string;
    };
    api_token: string;
}
declare const _default: {
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
};
export default _default;
