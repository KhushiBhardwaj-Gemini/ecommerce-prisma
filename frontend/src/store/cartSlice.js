import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  budget: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setBudget: (state, action) => {
      state.budget = action.payload;
    },

    addToCart: (state, action) => {
      const newItem = action.payload;
      const total = state.items.reduce(
        (acc, item) => acc + Number(item.price),
        0,
      );
      const budget = Number(state.budget);

      //BUDGET EXCEEDED
      if (budget && total + newItem.price > budget) {
        return;
      }

      //ALREADY ADDED
      const exists = state.items.find((item) => item.id === newItem.id);
      if (!exists) {
        state.items.push(newItem);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart, setBudget } = cartSlice.actions;
export default cartSlice.reducer;
