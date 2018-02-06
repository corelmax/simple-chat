"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 0] = "debug";
    LogLevel[LogLevel["warn"] = 1] = "warn";
    LogLevel[LogLevel["error"] = 2] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.default = new class InternalStore {
    constructor() {
        this.encryption = false;
        this.secret = "";
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
    getConfig() { return this.config; }
    initApiConfig(config) {
        this.apiConfig = config;
    }
    getApiConfig() { return this.apiConfig; }
    createChatLogInstance(backendFactory) {
        this.chatlogInstance = new ChatslogComponent_1.ChatsLogComponent(backendFactory);
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
