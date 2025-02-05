export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the total price of items in the cart
  const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  state.itemsPrice = addDecimals(itemsPrice);

  // Set total price (Only items price since no tax/shipping is needed)
  state.totalPrice = state.itemsPrice;

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
