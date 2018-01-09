"use strict";
/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const REACT_NATIVE = "react-native";
const REACTJS = "react-js";
class MessageDALFactory {
    static getObject() {
        if (!!global.userAgent && global.userAgent === REACTJS) {
            // const { MessageDAL } = require("./messageDAL");
            // return new MessageDAL();
        }
        else if (!!global.userAgent && global.userAgent === REACT_NATIVE) {
            const { NodeMessageDAL } = require("./nodeMessageDAL");
            return new NodeMessageDAL();
        }
    }
}
exports.MessageDALFactory = MessageDALFactory;
