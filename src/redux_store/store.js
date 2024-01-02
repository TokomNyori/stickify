import userSliceReducer from "@/redux_features/user/userSlice";
import noteSliceReducer from "@/redux_features/notes/noteSlice";
import researchMessagesSliceReducer from "@/redux_features/researchMessages/researchSlice";
import researchConfigSliceReducer from "@/redux_features/researchMessages/researchConfig";
import pageSliceReducer from "@/redux_features/pages/pageSlice";
import themeSliceReducer from "@/redux_features/theme/themeSlice";
import noteModalConfigSliceReducer from "@/redux_features/noteModalConfig/noteModalConfigSlice";
import currentNotePageSliceReducer from "@/redux_features/currentNotePage/currentNotePageSlice";
import reduxPageLoaderSliceReducer from "@/redux_features/reduxPageLoader/reduxPageLoaderSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userSliceReducer,
    note: noteSliceReducer,
    researchMessages: researchMessagesSliceReducer,
    researchConfig: researchConfigSliceReducer,
    page: pageSliceReducer,
    currentTheme: themeSliceReducer,
    noteModalConfig: noteModalConfigSliceReducer,
    currentNotePage: currentNotePageSliceReducer,
    reduxPageLoader: reduxPageLoaderSliceReducer,
});


export const store = configureStore({
    reducer: rootReducer
})