import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchProductByName,
} from "../controllers/productController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, formidable(), addProduct); // Any authenticated user can add a product

router.route("/allproducts").get(authenticate,fetchAllProducts);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(authenticate, checkId, fetchProductById)
  .put(authenticate, formidable(), updateProductDetails) // Only product owners can edit
  .delete(authenticate, removeProduct); // Only product owners can delete

router.route("/filtered-products").post(filterProducts);
router.get("/name/:name", fetchProductByName);

export default router;
