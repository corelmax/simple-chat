export var MemberRole;
(function (MemberRole) {
    MemberRole[MemberRole["member"] = 0] = "member";
    MemberRole[MemberRole["admin"] = 1] = "admin";
    MemberRole[MemberRole["owner"] = 2] = "owner";
})(MemberRole || (MemberRole = {}));
export var RoomType;
(function (RoomType) {
    RoomType[RoomType["organizationGroup"] = 0] = "organizationGroup";
    RoomType[RoomType["projectBaseGroup"] = 1] = "projectBaseGroup";
    RoomType[RoomType["privateGroup"] = 2] = "privateGroup";
    RoomType[RoomType["privateChat"] = 3] = "privateChat";
})(RoomType || (RoomType = {}));
export var RoomStatus;
(function (RoomStatus) {
    RoomStatus[RoomStatus["active"] = 0] = "active";
    RoomStatus[RoomStatus["disable"] = 1] = "disable";
    RoomStatus[RoomStatus["delete"] = 2] = "delete";
})(RoomStatus || (RoomStatus = {}));
export class Room {
    constructor() {
        this.name = "";
        this.owner_id = "";
        this.image = "";
        this.description = "";
        this.org_chart_id = "";
        this.team_id = "";
        this.members = Object.create(null);
        this.owner = Object.create(null);
        this.type = Object.create(null);
        this.status = Object.create(null);
        this.createTime = Object.create(null);
    }
}
