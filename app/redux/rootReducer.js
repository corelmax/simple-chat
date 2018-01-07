"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const stalkReducer_1 = require("../redux/stalkBridge/stalkReducer");
const rootReducer = redux_1.combineReducers({
    stalkReducer: stalkReducer_1.stalkReducer,
});
exports.default = rootReducer;
