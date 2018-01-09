"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const localForage = require("localforage");
class AppSessionToken {
    constructor() {
        this.store = localForage.createInstance({
            name: "sessionToken"
        });
    }
    getSessionToken() {
        return this.store.getItem("sessionToken");
    }
    saveSessionToken(token) {
        return this.store.setItem("sessionToken", token);
    }
    deleteSessionToken() {
        this.store.removeItem("sessionToken");
    }
}
exports.AppSessionToken = AppSessionToken;
