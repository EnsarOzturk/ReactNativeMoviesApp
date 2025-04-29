import { configureStore } from "@reduxjs/toolkit";
import movie from "./slices/movieSlice";

export const store = configureStore({
  reducer: {
    movies: movie,
  },
});

// RootState ve AppDispatch türlerini çıkar
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
