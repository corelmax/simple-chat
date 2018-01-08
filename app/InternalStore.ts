import { IStalkConfig, IApiConfig } from "stalk-js/starter";

export interface IAuthStore {
    user: { _id: string, username: string };
    api_token: string;
}

export default new class InternalStore {
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
};