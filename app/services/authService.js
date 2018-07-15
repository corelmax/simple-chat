import "isomorphic-fetch";
import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";
var getConfig = function () { return InternalStore.apiConfig; };
export function auth(user) {
    return fetch("" + getConfig().auth, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: apiHeaders(),
    });
}
export function authWithSocial(user) {
    return fetch(getConfig().auth + "/social", {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            social_type: user.social_type,
        }),
        headers: apiHeaders(),
    });
}
export function tokenAuth(token) {
    return fetch(getConfig().auth + "/verify", {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: apiHeaders(),
    });
}
export function logout(token) {
    return fetch(getConfig().auth + "/logout", {
        method: "POST",
        headers: withToken(apiHeaders())(token),
    });
}
export function signup(user) {
    return fetch(getConfig().user + "/signup", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ user: user }),
    });
}
