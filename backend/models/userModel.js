import mongoose from "mongoose";


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



const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },

    lastname: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?iiit\.ac\.in$/
    },
    
    age: { type: Number, required: true},

    contactNumber: { type: String, required: true, unique: true, },

    password: {
        type: String,
        required: true,
    },
    
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    reviews: [reviewSchema], // Array of reviews for the product
    rating: { type: Number, required: true, default: 0 }, // Overall rating of the product
    numReviews: { type: Number, required: true, default: 0 }, // Number of reviews

}, {timestamps: true});


const User = mongoose.model('User', userSchema);
export default User;