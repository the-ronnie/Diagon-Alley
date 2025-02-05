import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import crypto from "crypto";

const createOrder = async (req, res) => {
  

  try {
    const { orderItems, sellerId, phoneNo, totalPrice } = req.body;
    const buyerId = req.user?._id;

    if (!buyerId) {
      return res.status(400).json({ error: "Authentication failed. No buyer ID." });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items provided." });
    }

    if (!sellerId) {
      return res.status(400).json({ error: "No seller ID provided." });
    }

    if (!phoneNo) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const dbOrderItems = orderItems.map((item) => ({
      product: item._id,  // ✅ Assign `_id` to `product`
      name: item.name,
      image: item.image,
      price: item.price,
      qty: item.qty,
    }));

    const order = new Order({
      buyer: buyerId,
      orderItems: dbOrderItems, // ✅ Fixed structure
      seller: sellerId,
      phoneNo,
      totalPrice,
    });

    const createdOrder = await order.save();
    
    res.status(201).json(createdOrder);
  } catch (error) {
   
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for the logged-in buyer
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate(
      "seller",
      "username"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for the logged-in seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).populate(
      "buyer",
      "username"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate a hashed OTP for order verification
const generateHashedOTP = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    order.hashedOTP = hashedOTP;
    await order.save();

    res.json({ message: "OTP generated", otp }); // Send OTP to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP and mark order as delivered
const verifyOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const hashedInputOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedInputOTP !== order.hashedOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.hashedOTP = null; // Clear OTP after verification

    await order.save();

    res.json({ message: "Order marked as delivered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order details by ID
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "username email")
      .populate("seller", "username email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePhoneNo = async (req, res) => {
  const { id } = req.params;  // Get the order ID from the request params
  const { phoneNo } = req.body; // Get the phone number from the request body

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.phoneNo = phoneNo;  // Update the phone number

    await order.save();

    res.status(200).json({ message: "Phone number updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  findOrderById,
  generateHashedOTP,
  verifyOTP,
};
