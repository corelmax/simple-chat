import { createStore } from "redux";

import rootReducer from "./rootReducer";

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export const store = createStore(rootReducer);
