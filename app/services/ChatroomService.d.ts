/**
 * Pure fuction service.
 */
export declare const getRoomInfo: (roomId: string) => Promise<any>;
export declare const getUnreadMessage: (roomId: string, userId: string, lastAccessTime: string) => Promise<any>;
export declare const getOlderMessagesCount: (roomId: string, topEdgeMessageTime: string, queryMessage: boolean) => Promise<Response>;
export declare const getNewerMessages: (roomId: string, lastMessageTime: Date) => Promise<Response>;
export declare const getPrivateChatroom: (ownerId: string, roommateId: string) => Promise<Response>;
