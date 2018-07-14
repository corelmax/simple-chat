/**
 * Pure fuction service.
 */
export declare const getRoomInfo: (roomId: string) => Promise<any>;
export declare const getUnreadMessage: (roomId: string, userId: string, lastAccessTime: string) => Promise<any>;
export declare const getOlderMessagesCount: (roomId: string, topEdgeMessageTime: string, queryMessage: boolean) => any;
export declare const getNewerMessages: (roomId: string, lastMessageTime: Date) => any;
export declare const getPrivateChatroom: (ownerId: string, roommateId: string) => any;
