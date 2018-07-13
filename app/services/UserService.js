"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const InternalStore_1 = require("../InternalStore");
const ServiceUtils_1 = require("./ServiceUtils");
const getConfig = () => InternalStore_1.default.apiConfig;
function getTeamProfile(token, team_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/teamProfile?team_id=${team_id}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
exports.getTeamProfile = getTeamProfile;
function setOrgChartId(token, user, team_id, orgChartId) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${getConfig().user}/setOrgChartId`,
        body: JSON.stringify({
            user_id: user._id,
            username: user.username,
            team_id: team_id,
            org_chart_id: orgChartId
        }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
exports.setOrgChartId = setOrgChartId;
function updateTeamProfile(user_id, team_id, profile) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${getConfig().user}/teamProfile/${team_id}/${user_id}`,
        body: JSON.stringify({
            profile: profile
        }),
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.updateTeamProfile = updateTeamProfile;
function fetchUser(username) {
    return ajax({
        method: "GET",
        url: `${getConfig().user}/?username=${username}`,
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.fetchUser = fetchUser;
function suggestUser(username, team_id) {
    return ajax({
        method: "GET",
        url: `${getConfig().user}/suggest/?username=${username}&team_id=${team_id}`,
        headers: ServiceUtils_1.apiHeaders()
    });
}
exports.suggestUser = suggestUser;
