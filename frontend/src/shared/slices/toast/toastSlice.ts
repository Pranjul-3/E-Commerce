import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { ToastItem, ToastSliceState } from "./toast.types";

const initialState: ToastSliceState = { items: [] };

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    toastShown: {
      reducer(state, action: PayloadAction<ToastItem>) {
        // The same message already on screen is not shown again (e.g. effects re-running in dev StrictMode).
        const duplicate = state.items.some((t) => t.type === action.payload.type && t.message === action.payload.message);
        if (!duplicate) state.items.push(action.payload);
      },
      prepare: (toast: Omit<ToastItem, "id">) => ({ payload: { ...toast, id: nanoid() } }),
    },
    toastDismissed(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
  selectors: {
    selectToasts: (state) => state.items,
  },
});

export const { toastShown, toastDismissed } = toastSlice.actions;
export const { selectToasts } = toastSlice.selectors;
