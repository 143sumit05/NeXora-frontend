import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({

    name : "user",

    initialState : null,

    reducers: {
        addUser : (state, action) => {
            return action.payload;
        },
        removeUser : () => {
            return null;
        },
        updatePremium: (state) => {
    state.isPremium = true;
    state.premiumSince = new Date().toISOString();
},
    }

})

export const { addUser , removeUser, updatePremium } = userSlice.actions;
export default userSlice.reducer;