"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class InternalStore {
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
};
