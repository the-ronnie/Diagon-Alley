import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }, // Required field
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      }
    ],
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    hashedOTP: {
      type: String,
      
    },
    phoneNo: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
