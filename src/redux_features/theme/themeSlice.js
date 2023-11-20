import { CookieHelper } from "@/helper/httpHelpers/httpCookieHelper";
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    currentTheme: ''
}

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        addTheme: (state, action) => {
            state.currentTheme = action.payload
        }
    }
})

export const { addTheme } = themeSlice.actions
export default themeSlice.reducer