"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
const { ajax } = Rx.Observable;
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => InternalStore_1.default.apiConfig;
const authReducer = () => InternalStore_1.default.authStore;
function addMember(room_id, member) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/addMember/${room_id}`,
        body: JSON.stringify({ member: member }),
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.addMember = addMember;
function removeMember(room_id, member_id) {
    return ajax({
        method: "POST",
        url: `${getConfig().group}/removeMember/${room_id}`,
        body: JSON.stringify({ member_id: member_id }),
        headers: ServiceUtils_1.withToken(ServiceUtils_1.apiHeaders())(authReducer().api_token)
    });
}
exports.removeMember = removeMember;
