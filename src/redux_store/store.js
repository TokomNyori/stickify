import userSliceReducer from "@/redux_features/user/userSlice";
import noteSliceReducer from "@/redux_features/notes/noteSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userSliceReducer,
    note: noteSliceReducer,
});


export const store = configureStore({
    reducer: rootReducer
})