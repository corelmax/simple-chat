import * as Rx from "rxjs/Rx";
export declare function getTeamProfile(token: string, teamId: string): Rx.Observable<Rx.AjaxResponse>;
export declare function setOrgChartId(token: string, user: any, teamId: string, orgChartId: string): Rx.Observable<Rx.AjaxResponse>;
export declare function updateTeamProfile(userId: string, teamId: string, profile: any): Rx.Observable<Rx.AjaxResponse>;
export declare function fetchUser(username: string): Rx.Observable<Rx.AjaxResponse>;
export declare function suggestUser(username: string, teamId: string): Rx.Observable<Rx.AjaxResponse>;
