import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connection",
    initialState: [],
    reducers: {
        addConnections: (state,action) => {
            return action.payload;
        },
        removeConnections: () => {
            return [];
        }
    }
})
export const { addConnections , removeConnections } = connectionSlice.actions;
export default connectionSlice.reducer;