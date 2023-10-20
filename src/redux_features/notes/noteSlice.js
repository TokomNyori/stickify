import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    notes: []
}

export const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        addNote: (state, action) => {
            state.notes = action.payload
        },
        removeNote: (state, action) => {
            state.notes = state.notes.filter(note => note._id !== action.payload)
        }
    }
})

export const { addNote, removeNote } = noteSlice.actions
export default noteSlice.reducer