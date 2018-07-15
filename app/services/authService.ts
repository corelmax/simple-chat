import "isomorphic-fetch";

import InternalStore from "../InternalStore";
import { apiHeaders, withToken } from "./ServiceUtils";

const getConfig = () => InternalStore.apiConfig;

export function auth(user: { email: string, password: string }) {
    return fetch(`${getConfig().auth}`, {
        method: "POST",
        body: JSON.stringify({ email: user.email, password: user.password }),
        headers: apiHeaders(),
    });
}

export function authWithSocial(user: { email: string, social_type: string }) {
    return fetch(`${getConfig().auth}/social`, {
        method: "POST",
        body: JSON.stringify({
            email: user.email,
            social_type: user.social_type,
        }),
        headers: apiHeaders(),
    });
}

export function tokenAuth(token: string) {
    return fetch(`${getConfig().auth}/verify`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: apiHeaders(),
    });
}

export function logout(token: string) {
    return fetch(`${getConfig().auth}/logout`, {
        method: "POST",
        headers: withToken(apiHeaders())(token),
    });
}

export function signup(user) {
    return fetch(`${getConfig().user}/signup`, {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({ user }),
    });
}
