/**
 * MessageDALFactory.
 *
 * Copyright 2016 Ahoo Studio.co.th.
 */
var REACT_NATIVE = "react-native";
var REACTJS = "react-js";
var MessageDALFactory = /** @class */ (function () {
    function MessageDALFactory() {
    }
    MessageDALFactory.getObject = function () {
        if (!!global.userAgent && global.userAgent === REACTJS) {
            // const { MessageDAL } = require("./messageDAL");
            // return new MessageDAL();
        }
        else if (!!global.userAgent && global.userAgent === REACT_NATIVE) {
            var NodeMessageDAL = require("./nodeMessageDAL").NodeMessageDAL;
            return new NodeMessageDAL();
        }
    };
    return MessageDALFactory;
}());
export { MessageDALFactory };
