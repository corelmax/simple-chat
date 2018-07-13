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
    }
}
exports.MessageImp = MessageImp;
