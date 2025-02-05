import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  deleteUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  addSellerReview,
} from "../controllers/userController.js";
import checkId from "../middlewares/checkId.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);
router.route("/:id/reviews").post(authenticate, checkId, addSellerReview);

router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile)
  .delete(authenticate, deleteUserProfile);

// ADMIN ROUTES 👇
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate,  getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);

router.route("/:id/reviews").post(authenticate, checkId, addSellerReview);

export default router;
