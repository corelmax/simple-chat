"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * RoomDALFactory.
 *
 */
class RoomDALFactory {
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
exports.RoomDALFactory = RoomDALFactory;
