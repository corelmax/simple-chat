import { Room } from '../chats/models/Room';

export interface IChatRoom {
    id: string;
    name: string;
    data: Room;
}