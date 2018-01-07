"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const rootReducer_1 = require("./rootReducer");
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
exports.store = redux_1.createStore(rootReducer_1.default);
