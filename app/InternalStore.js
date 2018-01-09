"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatslogComponent_1 = require("./ChatslogComponent");
exports.default = new class InternalStore {
    initStore(store) {
        this.store = store;
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
};
