import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import {
  useGetOrderDetailsQuery,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useUpdatePhoneNoMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [updatePhoneNo] = useUpdatePhoneNoMutation();
  const [generateOTP] = useGenerateOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();

  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    if (order) {
      setPhoneNo(order.phoneNo);
    }
  }, [order]);

  const isBuyer = userInfo?._id === order?.buyer?._id;
  const isSeller = userInfo?._id === order?.seller?._id;

  const updatePhoneHandler = async () => {
    try {
      await updatePhoneNo({ orderId, phoneNo });
      refetch();
      toast.success("Phone number updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const generateOtpHandler = async () => {
    try {
      const response = await generateOTP(orderId);
      setGeneratedOtp(response.data.otp);
      setIsOtpSent(true);
      toast.success("OTP sent to the registered phone number");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const verifyOtpHandler = async () => {
    try {
      await verifyOTP({ orderId, otp });
      toast.success("OTP verified, order marked as delivered");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border-gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        $ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <p className="mb-4"><strong className="text-pink-500">Order ID:</strong> {order._id}</p>
          <p className="mb-4"><strong className="text-pink-500">Seller:</strong> {order.seller?.email || "N/A"}</p>
          <p className="mb-4"><strong className="text-pink-500">Buyer:</strong> {order.buyer?.email || "N/A"}</p>
          <p className="mb-4"><strong className="text-pink-500">Total Price:</strong> $ {order.totalPrice.toFixed(2)}</p>
          <p className="mb-4">
            <strong className="text-pink-500">Phone Number:</strong>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="p-2 border rounded w-full mt-2"
              placeholder="Enter phone number"
              disabled={!isBuyer}
            />
            {isBuyer && (
              <button onClick={updatePhoneHandler} className="bg-pink-500 text-white py-2 px-4 mt-2 w-full">
                Update Phone Number
              </button>
            )}
          </p>
          {!order.isDelivered && isBuyer && (
            <button type="button" className="bg-pink-500 text-white w-full py-2" onClick={generateOtpHandler}>
              Generate OTP
            </button>
          )}
          {isOtpSent && isBuyer && (
            <div className="mt-2 text-center text-lg font-bold text-pink-500">OTP: {generatedOtp}</div>
          )}
          {!order.isDelivered && isSeller && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 border rounded w-full mt-2"
              placeholder="Enter OTP"
            />
          )}
          {!order.isDelivered && isSeller && (
            <button type="button" onClick={verifyOtpHandler} className="bg-pink-500 text-white py-2 px-4 w-full mt-2">
              Verify OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
