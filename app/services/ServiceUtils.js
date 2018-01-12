"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InternalStore_1 = require("../InternalStore");
const getConfig = () => InternalStore_1.default.getApiConfig();
exports.apiHeaders = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().apiKey,
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": "*",
});
exports.withToken = (headers) => (token) => {
    headers["x-access-token"] = token;
    return headers;
};
