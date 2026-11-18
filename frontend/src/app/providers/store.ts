import { configureStore } from "@reduxjs/toolkit";
import { connectSession, queryClient } from "@/shared/api";
import { AUTH_TEXT } from "@/shared/config/constants";
import { PERSIST_CONFIG, SESSION_TOKEN_KEY } from "@/shared/config/persist.config";
import { TOAST_DURATION_MS } from "@/shared/config/toast.config";
import { loadPersisted, mergeOverDefaults, savePersisted } from "@/shared/lib";
import { cartSlice, rootReducer, signedOut, toastShown, type CartSliceState } from "@/shared/slices";

const savedCart = loadPersisted(PERSIST_CONFIG.key, PERSIST_CONFIG.version)?.cart;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    auth: { token: window.sessionStorage.getItem(SESSION_TOKEN_KEY) },
    cart: mergeOverDefaults<CartSliceState>(cartSlice.getInitialState(), savedCart),
  },
});

connectSession({
  getToken: () => store.getState().auth.token,
  onExpired: () => {
    store.dispatch(signedOut());
    store.dispatch(
      toastShown({ type: "warning", message: AUTH_TEXT.expired, durationMs: TOAST_DURATION_MS }),
    );
  },
});

let { auth: lastAuth, cart: lastCart } = store.getState();
store.subscribe(() => {
  const { auth, cart } = store.getState();
  if (auth !== lastAuth) {
    if (auth.token) window.sessionStorage.setItem(SESSION_TOKEN_KEY, auth.token);
    else {
      window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
      // Orders and profile must not outlive the session.
      queryClient.clear();
    }
    lastAuth = auth;
  }
  if (cart !== lastCart) {
    savePersisted(PERSIST_CONFIG.key, PERSIST_CONFIG.version, { cart });
    lastCart = cart;
  }
});
