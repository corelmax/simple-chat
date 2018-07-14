import InternalStore from "../InternalStore";
const getConfig = () => InternalStore.getApiConfig();
export const apiHeaders = () => ({
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    "x-api-key": getConfig().apiKey,
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": "*",
});
export const withToken = (headers) => (token) => {
    headers["x-access-token"] = token;
    return headers;
};
