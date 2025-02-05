import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-0 min-h-screen bg-gradient-to-b from-sky-100 to-teal-100 p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar */}
        <AdminMenu />
  
        {/* Create Product Card */}
        <div className="md:w-3/4 p-6 bg-white/70 backdrop-blur-lg rounded-lg shadow-lg border border-teal-300">
          <h2 className="text-3xl font-bold text-teal-700 text-center mb-6">
            🛍️ Create a New Product
          </h2>
  
          {/* Product Image Preview */}
          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl}
                alt="product preview"
                className="block mx-auto max-h-[200px] object-cover rounded-lg shadow-md"
              />
            </div>
          )}
  
          {/* File Upload Button */}
          <div className="mb-6">
            <label className="border text-white bg-teal-600 px-4 py-4 block w-full text-center rounded-lg cursor-pointer font-bold hover:bg-teal-500 transition-all">
              {image ? image.name : "📸 Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>
  
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name & Price */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="text-teal-700 font-semibold">Product Name</label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="text-teal-700 font-semibold">Price ($)</label>
                <input
                  type="number"
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
  
            {/* Quantity & Brand */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantity" className="text-teal-700 font-semibold">Quantity</label>
                <input
                  type="number"
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="brand" className="text-teal-700 font-semibold">Brand</label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>
  
            {/* Description */}
            <div>
              <label htmlFor="description" className="text-teal-700 font-semibold">Product Description</label>
              <textarea
                className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              ></textarea>
            </div>
  
            {/* Stock & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stock" className="text-teal-700 font-semibold">Stock Count</label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category" className="text-teal-700 font-semibold">Category</label>
                <select
                  className="w-full p-4 mt-2 border rounded-lg bg-white text-teal-700 border-teal-300 focus:ring-2 focus:ring-teal-400 transition-all"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id} className="text-teal-800 bg-teal-100">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            {/* Submit Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                className="py-4 px-10 rounded-lg text-lg font-bold bg-teal-600 hover:bg-teal-500 transition-all text-white shadow-md"
              >
                🚀 Submit Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
};

export default ProductList;
