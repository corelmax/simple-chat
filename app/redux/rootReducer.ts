import { combineReducers, Reducer } from "redux";

import { stalkReducer } from "../redux/stalkBridge/stalkReducer";

const rootReducer = combineReducers({
    stalkReducer,
}) as Reducer<{ stalkReducer: any }>;

export default rootReducer;
