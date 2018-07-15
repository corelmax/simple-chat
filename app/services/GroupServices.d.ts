import * as Rx from "rxjs";
export declare function addMember(roomId: string, member: any): Rx.Observable<Rx.AjaxResponse>;
export declare function removeMember(roomId: string, memberId: string): Rx.Observable<Rx.AjaxResponse>;
