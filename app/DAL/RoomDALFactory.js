/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
var RoomDALFactory = /** @class */ (function () {
    function RoomDALFactory() {
    }
    RoomDALFactory.getObject = function () {
        if (!!global.userAgent) {
            var RoomDAL = require("./RoomDAL").RoomDAL;
            return new RoomDAL();
        }
        else {
            // const NodeMessageDAL = require("./nodeMessageDAL");
            // return new NodeMessageDAL();
        }
    };
    return RoomDALFactory;
}());
export { RoomDALFactory };
