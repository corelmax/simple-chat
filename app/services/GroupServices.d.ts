import * as Rx from "rxjs";
export declare function addMember(room_id: string, member: any): Rx.Observable<Rx.AjaxResponse>;
export declare function removeMember(room_id: string, member_id: string): Rx.Observable<Rx.AjaxResponse>;
