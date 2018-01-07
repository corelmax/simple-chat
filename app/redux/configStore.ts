import { createStore, applyMiddleware } from "redux";

import rootReducer from "./rootReducer";

const middlewares = [];
if (process.env.NODE_ENV === `development`) {
    const logger = require("redux-logger");
    const _logger = logger.createLogger();
    middlewares.push(_logger);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
function configureStore() {
    // let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer);
}
export const store = configureStore();
