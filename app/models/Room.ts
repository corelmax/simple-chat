﻿export enum MemberRole {
    member = 0,
    admin = 1,
    owner,
}
export interface IMembersStatus {
    uid: string;
    status: string;
}
export interface IMember {
    _id: string;
    room_role: MemberRole;
    user_role: string;
    username: string;
    avatar: string;
    joinTime: Date;
    status: string;
}
export enum RoomType {
    organizationGroup, projectBaseGroup, privateGroup, privateChat,
}
export enum RoomStatus {
    active, disable, delete,
}
export class Room {
    _id: any;
    name: string = "";
    owner: IMember | string;
    owner_id: string = "";
    type: RoomType;
    members: IMember[] | String;
    image: string = "";
    description: string = "";
    status: RoomStatus;
    createTime: Date;
    org_chart_id: string = "";
    team_id: string = "";

    constructor() {
        this.members = Object.create(null);
        this.owner = Object.create(null);
        this.type = Object.create(null);
        this.status = Object.create(null);
        this.createTime = Object.create(null);
    }
}
