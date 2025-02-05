import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// Schema for individual product reviews
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the reviewer
    rating: { type: Number, required: true }, // Rating given by the user
    comment: { type: String, required: true }, // Comment from the reviewer
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Schema for products
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Product name
    image: { type: String, required: true }, // URL of the product image
    brand: { type: String, required: true }, // Brand of the product
    quantity: { type: Number, required: true }, // Available quantity
    category: { type: ObjectId, ref: "Category", required: true }, // Reference to Category model
    description: { type: String, required: true }, // Description of the product
    reviews: [reviewSchema], // Array of reviews for the product
    rating: { type: Number, required: true, default: 0 }, // Overall rating of the product
    numReviews: { type: Number, required: true, default: 0 }, // Number of reviews
    price: { type: Number, required: true, default: 0 }, // Price of the product
    countInStock: { type: Number, required: true, default: 0 }, // Items in stock
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who uploaded the product
      required: true,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Exporting the Product model
const Product = mongoose.model("Product", productSchema);
export default Product;
