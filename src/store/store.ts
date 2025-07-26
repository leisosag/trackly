import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./features/expenseSlice";

export const store = configureStore({
  reducer: {
    expense: expenseReducer,
  },
});

// Tipos para usar en TS con hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
