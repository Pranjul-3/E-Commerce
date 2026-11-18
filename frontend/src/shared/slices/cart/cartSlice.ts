import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Only ids and quantities are kept: prices and stock always come fresh from the API. */
export interface CartLine {
  productId: number;
  quantity: number;
}
export interface CartSliceState {
  lines: CartLine[];
}

const initialState: CartSliceState = { lines: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    itemAdded(state, action: PayloadAction<CartLine>) {
      const line = state.lines.find((l) => l.productId === action.payload.productId);
      if (line) line.quantity += action.payload.quantity;
      else state.lines.push(action.payload);
    },
    quantitySet(state, action: PayloadAction<CartLine>) {
      const line = state.lines.find((l) => l.productId === action.payload.productId);
      if (line) line.quantity = action.payload.quantity;
    },
    itemRemoved(state, action: PayloadAction<number>) {
      state.lines = state.lines.filter((l) => l.productId !== action.payload);
    },
    cartCleared(state) {
      state.lines = [];
    },
  },
  selectors: { selectLines: (state) => state.lines },
});

export const { itemAdded, quantitySet, itemRemoved, cartCleared } = cartSlice.actions;
