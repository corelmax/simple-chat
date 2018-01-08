"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const rootReducer_1 = require("./rootReducer");
exports.store = redux_1.createStore(rootReducer_1.default);
// const middlewares = [];
// if (process.env.NODE_ENV === `development`) {
//     const logger = require("redux-logger").createLogger();
//     middlewares.push(logger);
// }
// const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
// function configureStore() {
//     // let initialState = rootReducer.getInitialState();
//     return createStoreWithMiddleware(rootReducer);
// }
// export const store = configureStore();
