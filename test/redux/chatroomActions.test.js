"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configStore_1 = require("../../app/redux/configStore");
const InternalStore_1 = require("../../app/InternalStore");
InternalStore_1.default.initStore(configStore_1.store);
test("test action sendMessage", () => {
});
