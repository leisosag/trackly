import { createSlice } from "@reduxjs/toolkit";

interface ExpenseState {
  value: number;
}

const initialState: ExpenseState = { value: 0 };

export const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = expenseSlice.actions;
export default expenseSlice.reducer;
