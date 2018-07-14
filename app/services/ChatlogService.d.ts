import * as Rx from "rxjs/Rx";
export declare function getLastAccessRoomInfo(userId: string): Promise<Response>;
export declare function updateLastAccessRoomInfo(userId: string, roomId: string): Rx.Observable<Rx.AjaxResponse>;
export declare function removeLastAccessRoomInfo(userId: string, roomId: string): Rx.Observable<Rx.AjaxResponse>;
