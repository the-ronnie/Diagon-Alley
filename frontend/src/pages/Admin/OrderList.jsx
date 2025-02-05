import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetSellerOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetSellerOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto p-6">
          <AdminMenu />
          <table className="w-full table-auto border-separate border-spacing-2 bg-white">
            <thead className="text-left text-lg font-semibold text-black bg-gray-100">
              <tr className="border-b border-gray-300">
                <th className="pl-4 py-3">ITEMS</th>
                <th className="pl-4 py-3">ID</th>
                <th className="pl-4 py-3">USER</th>
                <th className="pl-4 py-3">DATE</th>
                <th className="pl-4 py-3">TOTAL</th>
                <th className="pl-4 py-3">PAID</th>
                <th className="pl-4 py-3">DELIVERED</th>
                <th className="pl-4 py-3">ACTION</th>
              </tr>
            </thead>
  
            <tbody className="text-black">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-[5rem] rounded-lg shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-4">{order._id}</td>
                  <td className="px-4 py-4">{order.user ? order.user.firstname : "N/A"}</td>
                  <td className="px-4 py-4">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="px-4 py-4 text-lg font-medium">$ {order.totalPrice}</td>
  
                  <td className="px-4 py-4">
                    {order.isPaid ? (
                      <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
  
                  <td className="px-4 py-4">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-full">
                        Pending
                      </span>
                    )}
                  </td>
  
                  <td className="px-4 py-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">
                        More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
  
};

export default OrderList;
