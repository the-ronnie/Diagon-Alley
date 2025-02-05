import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create Order
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    // Get Order Details by ID
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    // Get Orders of the Current User (Buyer)
    getBuyerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/buyer`,
      }),
      keepUnusedDataFor: 5, // Cache for 5 seconds
    }),

    // Get Orders of the Seller
    getSellerOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/seller`,
      }),
    }),

    // Generate OTP for Order Delivery (Seller)
    generateOTP: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/generate-otp`,
        method: "POST",
      }),
    }),

    // New mutation to update phone number
    updatePhoneNo: builder.mutation({
      query: ({ orderId, phoneNo }) => ({
        url: `${ORDERS_URL}/${orderId}/phone`,
        method: "PUT",
        body: { phoneNo },
      }),
    }),

    // Verify OTP & Mark Order as Delivered (Buyer)
    verifyOTP: builder.mutation({
      query: ({ orderId, otp }) => ({
        url: `${ORDERS_URL}/verify-otp`,
        method: "POST",
        body: { orderId, otp },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetBuyerOrdersQuery,
  useGetSellerOrdersQuery,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useUpdatePhoneNoMutation,
} = orderApiSlice;
