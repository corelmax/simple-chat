/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
export class RoomDALFactory {
    static getObject() {
        if (!!global.userAgent) {
            const { RoomDAL } = require("./RoomDAL");
            return new RoomDAL();
        }
        else {
            // const NodeMessageDAL = require("./nodeMessageDAL");
            // return new NodeMessageDAL();
        }
    }
}
