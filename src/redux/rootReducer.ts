import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";
import gameReducer from "./slices/gameSlice";
import roomReducer from "./slices/roomSlice";
import roundReducer from "./slices/roundSlice";
import resultReducer from "./slices/resultSlice";

const rootReducer = combineReducers({
  user: userReducer,
  game: gameReducer,
  room: roomReducer,
  round: roundReducer,
  result: resultReducer,
});

export default rootReducer;
