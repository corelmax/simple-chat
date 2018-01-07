"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class InternalStore {
    setAuth(newState) {
        this.authStore = Object.assign({}, newState);
    }
    initConfig(_config) {
        this.config = _config;
    }
    getConfig() { return this.config; }
    initApiConfig(_config) {
        this.apiConfig = _config;
    }
    getApiConfig() { return this.apiConfig; }
};
