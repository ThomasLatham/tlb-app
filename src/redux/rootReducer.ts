import { combineReducers } from "@reduxjs/toolkit";

import { userPreferences } from "../ducks";

const rootReducer = combineReducers({
    userPreferences: userPreferences.reducer,
  });
  
  export type RootState = ReturnType<typeof rootReducer>;
  
  export default rootReducer;