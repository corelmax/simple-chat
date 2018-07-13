/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */

const REACT_NATIVE = "react-native";
const REACTJS = "react-js";

export class MessageDALFactory {
    static getObject() {
        if (!!(<any>global).userAgent && (<any>global).userAgent === REACTJS) {
            // const { MessageDAL } = require("./messageDAL");
            // return new MessageDAL();
        } else if (!!(<any>global).userAgent && (<any>global).userAgent === REACT_NATIVE) {
            const { NodeMessageDAL } = require("./nodeMessageDAL");
            return new NodeMessageDAL();
        }
    }
}
