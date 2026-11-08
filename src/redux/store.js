import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import connectionReducer from "./connectionSlice";

const appStore = configureStore({

    reducer : {
        user: userReducer,
        connection: connectionReducer,
    }

})

export default appStore;