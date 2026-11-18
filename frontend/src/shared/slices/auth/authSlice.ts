import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthSliceState {
  token: string | null;
}

const initialState: AuthSliceState = { token: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    signedOut(state) {
      state.token = null;
    },
  },
  selectors: { selectToken: (state) => state.token },
});

export const { signedIn, signedOut } = authSlice.actions;
export const { selectToken } = authSlice.selectors;
