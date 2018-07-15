import * as Rx from "rxjs/Rx";
var ajax = Rx.Observable.ajax;
import InternalStore from "../InternalStore";
import { apiHeaders } from "./ServiceUtils";
var getConfig = function () { return InternalStore.apiConfig; };
export function getTeamProfile(token, teamId) {
    return Rx.Observable.ajax({
        url: getConfig().user + "/teamProfile?team_id=" + teamId,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });
}
export function setOrgChartId(token, user, teamId, orgChartId) {
    return Rx.Observable.ajax({
        method: "POST",
        url: getConfig().user + "/setOrgChartId",
        body: JSON.stringify({
            user_id: user._id,
            username: user.username,
            teamId: teamId,
            org_chart_id: orgChartId,
        }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });
}
export function updateTeamProfile(userId, teamId, profile) {
    return Rx.Observable.ajax({
        method: "POST",
        url: getConfig().user + "/teamProfile/" + teamId + "/" + userId,
        body: JSON.stringify({
            profile: profile,
        }),
        headers: apiHeaders(),
    });
}
export function fetchUser(username) {
    return ajax({
        method: "GET",
        url: getConfig().user + "/?username=" + username,
        headers: apiHeaders(),
    });
}
export function suggestUser(username, teamId) {
    return ajax({
        method: "GET",
        url: getConfig().user + "/suggest/?username=" + username + "&team_id=" + teamId,
        headers: apiHeaders(),
    });
}
