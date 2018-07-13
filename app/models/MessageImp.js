"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageImp {
    constructor() {
        this._id = "";
        this.rid = "";
        this.type = "";
        this.body = "";
        this.sender = "";
        this.readers = [];
        this.target = "";
        this.uuid = "";
        this.status = "";
        this.user = Object.create(null);
        this.createTime = Object.create(null);
        this.meta = Object.create(null);
    }
}
exports.MessageImp = MessageImp;
