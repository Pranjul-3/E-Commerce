import { useSelector } from "react-redux";
import { authSlice, type AuthSliceState } from "./authSlice";

type StateWithAuth = { [authSlice.reducerPath]: AuthSliceState };

export const useIsSignedIn = () =>
  useSelector((state: StateWithAuth) => authSlice.selectors.selectToken(state) !== null);
