import { combineSlices } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { cartSlice } from "./cart";
import { toastSlice } from "./toast";

/**
 * Every Redux slice in the project lives in this folder.
 * To add one: create `slices/<name>/`, then list it here.
 */
export const rootReducer = combineSlices(authSlice, cartSlice, toastSlice);

export type RootState = ReturnType<typeof rootReducer>;

export * from "./auth";
export * from "./cart";
export * from "./toast";
