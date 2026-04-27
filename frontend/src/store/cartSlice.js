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
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const total = state.items.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0,
      );
      const budget = Number(state.budget);

      //BUDGET EXCEEDED
      if (budget && total + newItem.price > budget) {
        return;
      }

      //ALREADY ADDED
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      const total = state.items.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0,
      );

      if (state.budget && total + item.price > state.budget) return;
      item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  setBudget,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
