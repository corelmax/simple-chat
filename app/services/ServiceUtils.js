import InternalStore from "../InternalStore";
var getConfig = function () { return InternalStore.getApiConfig(); };
export var apiHeaders = function () { return ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().apiKey,
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": "*",
}); };
export var withToken = function (headers) { return function (token) {
    headers["x-access-token"] = token;
    return headers;
}; };
