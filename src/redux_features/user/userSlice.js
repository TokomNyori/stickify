import { CookieHelper } from "@/helper/httpHelpers/httpCookieHelper";
import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    users: {}
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.users = action.payload
        },
        removeUser: (state, action) => {
            state.users = {}
        }
    }
})

export const { addUser, removeUser } = userSlice.actions
export default userSlice.reducer