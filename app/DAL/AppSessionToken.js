import * as localForage from "localforage";
var AppSessionToken = /** @class */ (function () {
    function AppSessionToken() {
        this.store = localForage.createInstance({
            name: "sessionToken"
        });
    }
    AppSessionToken.prototype.getSessionToken = function () {
        return this.store.getItem("sessionToken");
    };
    AppSessionToken.prototype.saveSessionToken = function (token) {
        return this.store.setItem("sessionToken", token);
    };
    AppSessionToken.prototype.deleteSessionToken = function () {
        this.store.removeItem("sessionToken");
    };
    return AppSessionToken;
}());
export { AppSessionToken };
