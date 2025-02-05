import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { sellerId, sellerItems } = location.state || {};

  useEffect(() => {
    if (!sellerId || !sellerItems || sellerItems.length === 0) {
      navigate("/cart");
    }
  }, [sellerId, sellerItems, navigate]);

  const placeOrderHandler = () => {
    navigate("/placeorder", { state: { sellerId, sellerItems } });
  };

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <div className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Confirm Your Order</h1>

          <div className="mb-6 p-4 border rounded bg-gray-800">
            <h2 className="text-lg font-bold">Seller ID: {sellerId}</h2>
          </div>

          {sellerItems.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-800">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p>Quantity: {item.qty}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}

          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            onClick={placeOrderHandler}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
