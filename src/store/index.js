// Toolkit
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import menus from "./slices/menuSlice";

export const store = configureStore({
  reducer: {
    menus,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
