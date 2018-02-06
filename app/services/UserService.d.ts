import * as Rx from "rxjs/Rx";
export declare function getTeamProfile(token: string, team_id: string): Rx.Observable<Rx.AjaxResponse>;
export declare function setOrgChartId(token: string, user: any, team_id: string, orgChartId: string): Rx.Observable<Rx.AjaxResponse>;
export declare function updateTeamProfile(user_id: string, team_id: string, profile: any): Rx.Observable<Rx.AjaxResponse>;
export declare function fetchUser(username: string): Rx.Observable<Rx.AjaxResponse>;
export declare function suggestUser(username: string, team_id: string): Rx.Observable<Rx.AjaxResponse>;
