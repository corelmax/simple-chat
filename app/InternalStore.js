var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { ChatsLogComponent } from "./ChatslogComponent";
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 0] = "debug";
    LogLevel[LogLevel["warn"] = 1] = "warn";
    LogLevel[LogLevel["error"] = 2] = "error";
})(LogLevel || (LogLevel = {}));
export default new /** @class */ (function () {
    function InternalStore() {
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
    InternalStore.prototype.initStore = function (store) {
        this.store = __assign({}, store);
    };
    InternalStore.prototype.setAuth = function (newState) {
        this.authStore = newState;
    };
    InternalStore.prototype.initConfig = function (config) {
        this.config = config;
    };
    InternalStore.prototype.getConfig = function () {
        return this.config;
    };
    InternalStore.prototype.initApiConfig = function (config) {
        this.apiConfig = config;
    };
    InternalStore.prototype.getApiConfig = function () { return this.apiConfig; };
    InternalStore.prototype.createChatLogInstance = function (backendFactory) {
        this.chatlogInstance = new ChatsLogComponent(backendFactory);
        return this.chatlogInstance;
    };
    /**
     * React.js please use MessageDAL module.
     * React-Native please use NodeMessageDAL instead.
     * @param storageObj
     */
    InternalStore.prototype.setStorage = function (storageObj) {
        this.dataManager.messageDAL = storageObj;
    };
    InternalStore.prototype.setLogLevel = function (level) {
        this.logLevel = level;
    };
    return InternalStore;
}());
