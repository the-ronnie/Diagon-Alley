import express from "express";
const router = express.Router();

import {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  findOrderById,
  generateHashedOTP,
  verifyOTP,
  updatePhoneNo,
} from "../controllers/orderController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createOrder);

router.route("/buyer").get(authenticate, getBuyerOrders);
router.route("/seller").get(authenticate, getSellerOrders);

router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/generate-otp").post(authenticate, generateHashedOTP);
router.route("/verify-otp").post(authenticate, verifyOTP);
router.route("/:id/phone").put(authenticate, updatePhoneNo);
export default router;
