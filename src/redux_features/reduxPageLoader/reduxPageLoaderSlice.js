import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reduxPageLoader: false
}

export const reduxPageLoaderSlice = createSlice({
    name: "reduxPageLoader",
    initialState,
    reducers: {
        changePageLoader: (state, action) => {
            state.reduxPageLoader = action.payload
        }
    }
})

export const { changePageLoader } = reduxPageLoaderSlice.actions
export default reduxPageLoaderSlice.reducer