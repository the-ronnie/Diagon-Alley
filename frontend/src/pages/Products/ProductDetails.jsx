import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useGetUserDetailsQuery, useCreateSellerReviewMutation } from "../../redux/api/usersApiSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerComment, setSellerComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    console.log("Product Data:", product);
    console.log("Product Error:", error);
  }, [product, error]);

  const { userInfo } = useSelector((state) => state.auth);
  const { data: seller, isLoading: loadingSeller, error: sellerError } =
    useGetUserDetailsQuery(product?.user, {
      skip: !product?.user,
    });

  useEffect(() => {
    console.log("Seller Data:", seller);
    console.log("Seller Error:", sellerError);
  }, [seller, sellerError]);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const [createSellerReview, { isLoading: loadingSellerReview }] = useCreateSellerReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const submitSellerReviewHandler = async (e) => {
    e.preventDefault();

    try {
      await createSellerReview({
        userId: product.user,
        firstName: userInfo.firstname,
        rating: sellerRating,
        comment: sellerComment,
      }).unwrap();

      toast.success("Seller review added successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-b from-blue-400 via-yellow-200 to-orange-300 text-gray-900 relative overflow-hidden">
      
      {/* Decorative Wave Background */}
      <div className="absolute top-0 left-0 w-full h-40 bg-blue-500 rounded-b-full opacity-70"></div>
      
      <div className="relative">
        {/* Back Button with Tropical Style */}
        <div className="flex items-center mb-6">
          <Link 
            to="/" 
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-lg transition-all flex items-center"
          >
            🌴 Back to Paradise
          </Link>
        </div>
  
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image Section */}
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover transition-transform transform hover:scale-105"
              />
              <HeartIcon 
                product={product} 
                className="absolute top-4 right-4 z-10 text-red-500"
              />
            </div>
  
            {/* Product Details Section */}
            <div className="p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
              <h2 className="text-4xl font-extrabold text-orange-700 flex items-center">
                {product.name} 🍹
              </h2>
              <p className="text-gray-800 text-lg mt-2">{product.description}</p>
  
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-5xl font-bold text-green-700">${product.price}</span>
                <Ratings 
                  value={product.rating} 
                  text={`${product.numReviews} reviews`} 
                />
              </div>
  
              <div className="grid grid-cols-2 gap-4 bg-yellow-100 p-4 rounded-lg border border-yellow-300 mt-4">
                <div>
                  <h3 className="flex items-center text-gray-700">
                    🏖️ Brand: <span className="ml-2 text-blue-900">{product.brand}</span>
                  </h3>
                  <h3 className="flex items-center text-gray-700">
                    ⏳ Added: <span className="ml-2 text-blue-900">{moment(product.createAt).fromNow()}</span>
                  </h3>
                </div>
                <div>
                  <h3 className="flex items-center text-gray-700">
                    🏄‍♂️ Quantity: <span className="ml-2 text-blue-900">{product.quantity}</span>
                  </h3>
                  <h3 className="flex items-center text-gray-700">
                    🌊 In Stock: <span className="ml-2 text-blue-900">{product.countInStock}</span>
                  </h3>
                </div>
              </div>
  
              <div className="flex items-center space-x-4 mt-6">
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 rounded-lg bg-blue-100 text-blue-900 border border-blue-400"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`
                    px-6 py-3 rounded-lg transition-all font-bold shadow-lg
                    ${product.countInStock > 0 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-gray-500 cursor-not-allowed text-gray-300'
                    }
                  `}
                >
                  {product.countInStock > 0 ? '🏝️ Add To Cart' : '🚫 Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Product Tabs & Reviews */}
        <div className="mt-12 bg-yellow-100 p-6 rounded-lg shadow-lg">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
  
        {/* Seller Information Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">🌊 Seller Information</h2>
  
            {loadingSeller ? (
              <Loader />
            ) : sellerError ? (
              <Message variant="danger">{sellerError?.data?.message || sellerError.message}</Message>
            ) : seller ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-800">
                  {seller.firstname || "Seller"}
                </h3>
                <p className="text-gray-700">📧 Email: {seller?.email}</p>
                <Ratings 
                  value={seller?.rating || 0} 
                  text={`${seller?.numReviews || 0} reviews`} 
                />
              </div>
            ) : (
              <Message variant="warning">No seller information available.</Message>
            )}
          </div>
  
          {/* Seller Review Section */}
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">🏖️ Review the Seller</h2>
  
            {loadingSellerReview && <Loader />}
  
            {userInfo ? (
              <form onSubmit={submitSellerReviewHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={sellerRating}
                    onChange={(e) => setSellerRating(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-blue-100 text-blue-900 border border-blue-400"
                  >
                    <option value="">Select...</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={sellerComment}
                    onChange={(e) => setSellerComment(e.target.value)}
                    className="w-full p-2 rounded-lg bg-blue-100 text-blue-900 border border-blue-400"
                    rows="3"
                    placeholder="Tell us about your experience!"
                  ></textarea>
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-all"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <Message>
                Please <Link to="/login" className="text-blue-600 hover:underline">sign in</Link> to leave a seller review.
              </Message>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProductDetails;