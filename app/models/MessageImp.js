var MessageImp = /** @class */ (function () {
    function MessageImp() {
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
    return MessageImp;
}());
export { MessageImp };
