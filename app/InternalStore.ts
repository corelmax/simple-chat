import { IStalkConfig, IApiConfig } from "stalk-js/starter";

export type AuthStore = {
    user: { _id: string, username: string };
    api_token: string;
};

export default new class InternalStore {
    authStore: AuthStore;
    setAuth(newState: AuthStore) {
        this.authStore = { ...newState };
    }

    config: IStalkConfig;
    public initConfig(_config: IStalkConfig) {
        this.config = _config;
    }
    public getConfig(): IStalkConfig { return this.config; }


    apiConfig: IApiConfig;
    public initApiConfig(_config: IApiConfig) {
        this.apiConfig = _config;
    }
    public getApiConfig(): IApiConfig { return this.apiConfig; }
}