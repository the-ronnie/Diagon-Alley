import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { removeSellerItems } from "../../redux/features/cart/cartSlice"; // Add this import

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);
  const buyerId = userInfo?._id;

  const { sellerId, sellerItems } = location.state || {};
  const [phoneNo, setPhoneNo] = useState("");

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!sellerId || !sellerItems || sellerItems.length === 0) {
      navigate("/cart");
    }
  }, [sellerId, sellerItems, navigate]);

  const totalPrice = sellerItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  const placeOrderHandler = async () => {
    if (!phoneNo) {
      toast.error("Please provide a phone number!");
      return;
    }

    try {
      const res = await createOrder({
        buyerId,
        orderItems: sellerItems,
        sellerId,
        phoneNo,
        totalPrice,
      }).unwrap();

      // Remove the ordered items from the cart
      dispatch(removeSellerItems(sellerId));
      
      // Show success message
      toast.success("Order placed successfully!");
      
      // Navigate to order details
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2 step3 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <div className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Place Your Order</h1>

          {/* Display Buyer & Seller ID */}
          <div className="mb-6 p-4 border rounded bg-gray-800">
            <h2 className="text-lg font-bold">Buyer ID: {buyerId}</h2>
            <h2 className="text-lg font-bold mt-2">Seller ID: {sellerId}</h2>
          </div>

          {/* Order Items */}
          {sellerItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-800">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>Quantity: {item.qty}</p>
              <p>Price: ${item.price}</p>
              <p>Total: ${(item.qty * item.price).toFixed(2)}</p>
            </div>
          ))}

          {/* Total Price */}
          <div className="mt-6 p-4 border rounded bg-gray-800">
            <h3 className="text-xl font-semibold">Total Price: ${totalPrice}</h3>
          </div>

          {/* Phone Number Input */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Phone Number</h3>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full p-2 mt-2 mb-4 border rounded"
            />
          </div>

          {/* Place Order Button */}
          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            onClick={placeOrderHandler}
            disabled={isLoading || !phoneNo}
          >
            {isLoading ? <Loader /> : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;