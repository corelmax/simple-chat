import * as localForage from "localforage";
export class AppSessionToken {
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
