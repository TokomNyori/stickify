import { CookieHelper } from "@/helper/httpHelpers/httpCookieHelper";
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    page: 'home'
}

export const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        addPage: (state, action) => {
            state.page = action.payload
        },
        removePage: (state, action) => {
            state.page = ''
        }
    }
})

export const { addPage, removePage } = pageSlice.actions
export default pageSlice.reducer