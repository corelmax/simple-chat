"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const rootReducer_1 = require("./rootReducer");
const middlewares = [];
if (process.env.NODE_ENV === `development`) {
    const logger = require("redux-logger");
    const _logger = logger.createLogger();
    middlewares.push(_logger);
}
const createStoreWithMiddleware = redux_1.applyMiddleware(...middlewares)(redux_1.createStore);
function configureStore() {
    // let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer_1.default);
}
exports.store = configureStore();
