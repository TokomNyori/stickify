import userSliceReducer from "@/redux_features/user/userSlice";
import noteSliceReducer from "@/redux_features/notes/noteSlice";
import pageSliceReducer from "@/redux_features/pages/pageSlice";
import themeSliceReducer from "@/redux_features/theme/themeSlice";
import noteModalConfigSliceReducer from "@/redux_features/noteModalConfig/noteModalConfigSlice";
import currentNotePageSliceReducer from "@/redux_features/currentNotePage/currentNotePageSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userSliceReducer,
    note: noteSliceReducer,
    page: pageSliceReducer,
    theme: themeSliceReducer,
    noteModalConfig: noteModalConfigSliceReducer,
    currentNotePage: currentNotePageSliceReducer,
});


export const store = configureStore({
    reducer: rootReducer
})