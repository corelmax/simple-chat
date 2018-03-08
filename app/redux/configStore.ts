import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from 'redux-observable';

import rootReducer from "./rootReducer";
import { rootEpic } from "./rootEpics";

// export const store = createStore(rootReducer);
const epicMiddleware = createEpicMiddleware(rootEpic);

const middlewares = [];
if (process.env.NODE_ENV === `development`) {
    const logger = require("redux-logger").createLogger();
    middlewares.push(logger);
}
middlewares.push(epicMiddleware);
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

function configureStore() {
    // let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer);
}
export const store = configureStore();
