import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetBuyerOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetBuyerOrdersQuery();

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-b from-sky-100 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-sky-950">My Orders</h2>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="animate-spin text-sky-600" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error?.data?.error || error.error}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-sky-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sky-50/50 border-b border-sky-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">IMAGE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">DATE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">TOTAL</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">PAID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900">DELIVERED</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-sky-900"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-sky-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-sky-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.user}
                          className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-sky-900">{order._id}</td>
                      <td className="px-6 py-4 text-sm text-sky-900">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-sky-900">
                        $ {order.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        {order.isPaid ? (
                          <span className="inline-block px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <span className="inline-block px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-gradient-to-r from-sky-400 to-blue-500 
                                         hover:from-sky-500 hover:to-blue-600 
                                         text-white text-sm font-medium px-4 py-2 rounded-lg 
                                         transition-all duration-300 shadow-sm hover:shadow-md">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
