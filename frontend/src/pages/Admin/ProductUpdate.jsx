import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData, isLoading } = useGetProductByIdQuery(params._id);
  
  // Initialize state with empty values
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Update state only when productData is available
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      // Make sure category is being sent correctly
setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedProduct = {
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        image,
      };
  
      // Log the data being sent for debugging
      console.log("Updating product with ID:", params._id);
      console.log("Update data:", updatedProduct);
  
      const result = await updateProduct({
        productId: params._id,
        updatedProduct
      }).unwrap();
  
      if (result) {
        toast.success("Product updated successfully");
        navigate("/allproductslist");
      }
    } catch (err) {
      console.error("Update Error Details:", {
        error: err,
        data: err?.data,
        message: err?.data?.message
      });
      toast.error(err?.data?.message || "Update failed. Please try again.");
    }
  };
  

  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const result = await deleteProduct(params._id).unwrap();
      
      if (result) {
        toast.success("Product deleted successfully");
        navigate("/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Delete failed. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AdminMenu />
          </div>

          <div className="lg:w-3/4 bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
              Update / Delete Product
            </h2>

            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="space-y-4">
                {image && (
                  <div className="relative rounded-lg overflow-hidden h-64 w-full">
                    <img
                      src={image}
                      alt="product"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <label className="relative block">
                  <span className="sr-only">Choose product photo</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-700 file:text-white
                    hover:file:bg-gray-600
                    cursor-pointer"
                  />
                </label>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Price Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                    placeholder="Enter price"
                  />
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Brand Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                    placeholder="Enter brand"
                  />
                </div>

                {/* Stock Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                    placeholder="Enter stock quantity"
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-white placeholder-gray-400"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-white placeholder-gray-400"
                  placeholder="Enter product description"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 
                  rounded-lg text-white font-semibold transition-colors
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  focus:ring-offset-gray-800"
                >
                  Update Product
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 
                  rounded-lg text-white font-semibold transition-colors
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                  focus:ring-offset-gray-800"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default ProductUpdate;