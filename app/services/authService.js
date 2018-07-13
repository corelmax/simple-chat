"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => InternalStore_1.default.apiConfig;
function auth(user) {
    return fetch(`${getConfig().auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.auth = auth;
function authWithSocial(user) {
    return fetch(`${getConfig().auth}/social`, {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            social_type: user.social_type,
        }),
        headers: ServiceUtils_1.apiHeaders(),
    });
}
exports.authWithSocial = authWithSocial;
function tokenAuth(token) {
    return fetch(`${getConfig().auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.tokenAuth = tokenAuth;
function logout(token) {
    return fetch(`${getConfig().auth}/logout`, {
        method: "POST",
        headers: ServiceUtils_1.withToken(ServiceUtils_1.apiHeaders())(token)
    });
}
exports.logout = logout;
function signup(user) {
    return fetch(`${getConfig().user}/signup`, {
        method: "POST",
        headers: ServiceUtils_1.apiHeaders(),
        body: JSON.stringify({ user: user })
    });
}
exports.signup = signup;
