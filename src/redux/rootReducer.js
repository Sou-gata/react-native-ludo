import { combineReducers } from "redux";
import gameSlices from "./reducers/gameSlices";

const rootReducer = combineReducers({
    game: gameSlices,
});

export default rootReducer;
