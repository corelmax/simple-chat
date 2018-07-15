import { applyMiddleware, createStore, Store } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { rootEpic } from "./rootEpics";
import rootReducer from "./rootReducer";

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
    return createStoreWithMiddleware(rootReducer) as Store<any>;
}
export const store = configureStore();
