import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    researchConfig: {
        response: 'Balanced',
        username: '',
        emoji: true,
    }
}

export const researchConfigSlice = createSlice({
    name: "researchConfig",
    initialState,
    reducers: {
        addResearchConfig: (state, action) => {
            state.researchConfig = action.payload
        },
        clearResearchConfig: (state, action) => {
            state.researchConfig = {
                response: 'Balanced',
                username: '',
                emoji: true,
            }
        },
    }
})

export const { addResearchConfig, clearResearchConfig } = researchConfigSlice.actions
export default researchConfigSlice.reducer