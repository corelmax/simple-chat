import { createStore, applyMiddleware } from "redux";

import rootReducer from "./rootReducer";

export const store = createStore(rootReducer);

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
