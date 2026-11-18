import { useSelector } from "react-redux";
import { cartSlice, type CartSliceState } from "./cartSlice";

type StateWithCart = { [cartSlice.reducerPath]: CartSliceState };

export const useCartLines = () =>
  useSelector((state: StateWithCart) => cartSlice.selectors.selectLines(state));

export const useCartCount = () =>
  useCartLines().reduce((sum, line) => sum + line.quantity, 0);
