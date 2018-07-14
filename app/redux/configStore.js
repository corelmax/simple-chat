import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from "./rootReducer";
import { rootEpic } from "./rootEpics";
// export const store = createStore(rootReducer);
var epicMiddleware = createEpicMiddleware(rootEpic);
var middlewares = [];
if (process.env.NODE_ENV === "development") {
    var logger = require("redux-logger").createLogger();
    middlewares.push(logger);
}
middlewares.push(epicMiddleware);
var createStoreWithMiddleware = applyMiddleware.apply(void 0, middlewares)(createStore);
function configureStore() {
    // let initialState = rootReducer.getInitialState();
    return createStoreWithMiddleware(rootReducer);
}
export var store = configureStore();
