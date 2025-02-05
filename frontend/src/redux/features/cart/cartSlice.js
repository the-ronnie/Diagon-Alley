import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const sellerId = user; // Ensure sellerId is properly stored

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: item.qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, sellerId }];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    removeSellerItems: (state, action) => {
      const sellerId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.sellerId !== sellerId);
      localStorage.setItem("cart", JSON.stringify(state));
    },
  

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { removeSellerItems, addToCart, removeFromCart, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;
