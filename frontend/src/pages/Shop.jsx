import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import FloatingChatbot from "../components/FloatingChatbot";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const { userInfo } = useSelector((state) => state.auth); // Get logged-in user details

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          const matchesPrice =
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10);

          const isNotSellerProduct = product.user !== userInfo?._id;

          const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesPrice && isNotSellerProduct && matchesSearch;
        });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, searchQuery, userInfo]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand && product.user !== userInfo?._id
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.filter((product) => product.user !== userInfo?._id)
          .map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-auto bg-gradient-to-b from-sky-100 to-blue-100 p-8 min-h-screen flex flex-col md:flex-row">
        <div className="bg-white/80 backdrop-blur-lg p-5 rounded-lg shadow-lg border border-blue-300 mt-2 mb-2">
          <h2 className="text-xl font-semibold text-sky-900 text-center py-2 bg-blue-200 rounded-lg mb-2">
            Search Products
          </h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 placeholder-blue-500 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-sky-900 text-center py-2 bg-blue-200 rounded-lg mb-2">
            Filter by Categories
          </h2>
          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                />
                <label htmlFor={`category-${c._id}`} className="ml-2 text-blue-900 font-medium">
                  {c.name}
                </label>
              </div>
            ))}
          </div>
  
          <h2 className="text-xl font-semibold text-sky-900 text-center py-2 bg-blue-200 rounded-lg mb-2">
            Filter by Brands
          </h2>
          <div className="p-5 w-[15rem]">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center mb-4">
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-400"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-blue-900 font-medium">
                  {brand}
                </label>
              </div>
            ))}
          </div>
  
          <h2 className="text-xl font-semibold text-sky-900 text-center py-2 bg-blue-200 rounded-lg mb-2">
            Filter by Price
          </h2>
          <div className="p-5 w-[15rem]">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-blue-500 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="p-5 pt-0">
            <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg transition-all" onClick={() => window.location.reload()}>
              Reset
            </button>
          </div>
        </div>
        <FloatingChatbot />
        <div className="p-3 w-full">
          <h2 className="text-2xl font-semibold text-sky-900 text-center mb-4">{products?.length} Products</h2>
          <div className="flex flex-wrap gap-4 justify-start">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div className="p-3 bg-white/80 backdrop-blur-lg rounded-lg shadow-md border border-blue-200" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default Shop;
