"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatslogComponent_1 = require("./ChatslogComponent");
exports.default = new class InternalStore {
    constructor() {
        this.dataManager = Object.create(null);
    }
    initStore(store) {
        this.store = Object.assign({}, store);
    }
    setAuth(newState) {
        this.authStore = Object.assign({}, newState);
    }
    initConfig(config) {
        this.config = config;
    }
    getConfig() { return this.config; }
    initApiConfig(config) {
        this.apiConfig = config;
    }
    getApiConfig() { return this.apiConfig; }
    createChatLogInstance() {
        this.chatlogInstance = new ChatslogComponent_1.ChatsLogComponent();
    }
    /**
     * React.js please use MessageDAL module.
     * React-Native please use NodeMessageDAL instead.
     * @param storageObj
     */
    setStorage(storageObj) {
        this.dataManager.messageDAL = Object.assign({}, storageObj);
    }
};
