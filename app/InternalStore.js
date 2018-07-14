import { ChatsLogComponent } from "./ChatslogComponent";
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 0] = "debug";
    LogLevel[LogLevel["warn"] = 1] = "warn";
    LogLevel[LogLevel["error"] = 2] = "error";
})(LogLevel || (LogLevel = {}));
export default new class InternalStore {
    constructor() {
        this.appStateEvent = "";
        this.encryption = false;
        this.secret = "";
        this.store = Object.create(null);
        this.authStore = Object.create(null);
        this.logLevel = Object.create(null);
        this.config = Object.create(null);
        this.apiConfig = Object.create(null);
        this.chatlogInstance = Object.create(null);
        this.dataManager = Object.create(null);
    }
    initStore(store) {
        this.store = Object.assign({}, store);
    }
    setAuth(newState) {
        this.authStore = newState;
    }
    initConfig(config) {
        this.config = config;
    }
    getConfig() {
        return this.config;
    }
    initApiConfig(config) {
        this.apiConfig = config;
    }
    getApiConfig() { return this.apiConfig; }
    createChatLogInstance(backendFactory) {
        this.chatlogInstance = new ChatsLogComponent(backendFactory);
        return this.chatlogInstance;
    }
    /**
     * React.js please use MessageDAL module.
     * React-Native please use NodeMessageDAL instead.
     * @param storageObj
     */
    setStorage(storageObj) {
        this.dataManager.messageDAL = storageObj;
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
};
