import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = (sellerId, sellerItems) => {
    navigate("/shipping", { state: { sellerId, sellerItems } });
  };

  // Group items by sellerId
  const groupedCartItems = cartItems.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = [];
    }
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto mt-8 flex flex-col items-center min-h-screen bg-gradient-to-b from-sky-100 to-blue-100 p-8">
      {cartItems.length === 0 ? (
        <div className="text-sky-900 text-lg">
          Your cart is empty <Link to="/shop" className="text-sky-600 hover:text-sky-700 underline">Go To Shop</Link>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-6 text-sky-900">Shopping Cart</h1>
  
          {Object.keys(groupedCartItems).map((sellerId) => {
            const sellerItems = groupedCartItems[sellerId];
            const sellerTotal = sellerItems.reduce(
              (acc, item) => acc + item.qty * item.price,
              0
            );
  
            return (
              <div key={sellerId} className="mb-8 bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-sky-200">
                <h2 className="text-xl font-bold mb-4 text-sky-900">Seller: {sellerId}</h2>
  
                {sellerItems.map((item) => (
                  <div key={item._id} className="flex items-center mb-4 p-4 bg-white/50 rounded-lg border border-sky-100 hover:border-sky-200 transition-all">
                    <div className="w-[5rem] h-[5rem]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                    </div>
  
                    <div className="flex-1 ml-4">
                      <Link to={`/product/${item._id}`} className="text-sky-600 hover:text-sky-700 transition-colors">
                        {item.name}
                      </Link>
                      <div className="mt-2 text-sky-800">{item.brand}</div>
                      <div className="mt-2 text-sky-900 font-bold">₹{item.price}</div>
                    </div>
  
                    <div className="w-24">
                      <select
                        className="w-full p-2 border border-sky-200 rounded-lg bg-white/80 text-sky-900
                                 focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                                 transition-all duration-300"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <button
                      className="text-red-500 hover:text-red-600 ml-4 p-2 hover:bg-red-50 rounded-full transition-colors"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
  
                {/* Seller-wise Checkout */}
                <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
                  <h2 className="text-lg font-semibold text-sky-900 mb-3">
                    Total for this seller: ₹{sellerTotal.toFixed(2)}
                  </h2>
                  <button
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 
                             text-white mt-2 py-3 px-6 rounded-lg text-lg w-full transition-all duration-300
                             shadow-lg shadow-blue-500/20"
                    onClick={() => checkoutHandler(sellerId, sellerItems)}
                  >
                    Proceed to Checkout for Seller {sellerId}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;
