import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    researchMessages: []
}

export const researchSlice = createSlice({
    name: "researchMessages",
    initialState,
    reducers: {
        addResearchMessages: (state, action) => {
            state.researchMessages = action.payload
        },
    }
})

export const { addResearchMessages } = researchSlice.actions
export default researchSlice.reducer