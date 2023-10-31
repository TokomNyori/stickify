import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    noteModalConfig: {
        noteModalState: false,
        as: '',
        noteObject: {}
    }
}

export const noteModalConfigSlice = createSlice({
    name: "noteModalConfig",
    initialState,
    reducers: {
        setNoteModalConfig: (state, action) => {
            const config = {
                noteModalState: action.payload.noteModalState,
                as: action.payload.as,
                noteObject: action.payload.noteObject,
            }
            state.noteModalConfig = config
        }
        // ,
        // removeNote: (state, action) => {
        //     state.notes = state.notes.filter(note => note._id !== action.payload)
        // }
    }
})

export const { setNoteModalConfig } = noteModalConfigSlice.actions
export default noteModalConfigSlice.reducer