"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_observable_1 = require("redux-observable");
const rootReducer_1 = require("./rootReducer");
const rootEpics_1 = require("./rootEpics");
// export const store = createStore(rootReducer);
const epicMiddleware = redux_observable_1.createEpicMiddleware(rootEpics_1.rootEpic);
const middlewares = [];
if (process.env.NODE_ENV === `development`) {
    const logger = require("redux-logger").createLogger();
    middlewares.push(logger);
}
middlewares.push(epicMiddleware);
const createStoreWithMiddleware = redux_1.applyMiddleware(...middlewares)(redux_1.createStore);
function configureStore() {
    // let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer_1.default);
}
exports.store = configureStore();
