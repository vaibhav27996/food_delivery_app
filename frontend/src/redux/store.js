import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/reducer/UserSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;