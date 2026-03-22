import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import resumeReducer from "./slices/resume";
import uiReducer from "./slices/uiSlices";
import { apiSlice } from "./api/apiSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export default store;
