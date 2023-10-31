import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    currentNotePage: {}
}

export const currentNotePageSlice = createSlice({
    name: "currentNotePage",
    initialState,
    reducers: {
        addCurrentNotePage: (state, action) => {
            state.currentNotePage = action.payload
        },
        removeCurrentNotePage: (state, action) => {
            state.currentNotePage = {}
        }
    }
})

export const { addCurrentNotePage, removeCurrentNotePage } = currentNotePageSlice.actions
export default currentNotePageSlice.reducer