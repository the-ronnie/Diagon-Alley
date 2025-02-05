import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineTag,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowsidebar] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowsidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowsidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation(); // logout user

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
  style={{ zIndex: 9999 }}
  className={`${
    showSidebar ? "hidden" : "flex"
  } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 
  bg-gradient-to-b from-[#0c071d] to-[#1a0f2e] backdrop-blur-xl
  border-r border-amber-500/20 shadow-xl shadow-purple-500/10
  w-[4%] hover:w-[15%] h-[100vh] fixed transition-all duration-300 ease-in-out transform`}
  id="navigation-container"
>
  <div className="flex flex-col justify-center space-y">
    <Link to="/" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineHome
          className="mr-2 mt-[3rem] text-amber-400 hover:text-amber-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-amber-100 hover:text-amber-300">
          HOME
        </span>
      </div>
    </Link>

    <Link to="/sell" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineTag
          className="mr-2 mt-[3rem] text-purple-400 hover:text-purple-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-purple-100 hover:text-purple-300">
          SELL
        </span>
      </div>
    </Link>

    <Link to="/shop" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineShopping
          className="mr-2 mt-[3rem] text-blue-400 hover:text-blue-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-blue-100 hover:text-blue-300">
          BUY
        </span>
      </div>
    </Link>

    <Link to="/cart" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineShoppingCart
          className="mt-[3rem] mr-2 text-amber-400 hover:text-amber-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-amber-100 hover:text-amber-300">
          CART
        </span>
      </div>
    </Link>

    <Link to="/orderlist" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineTag
          className="mr-2 mt-[3rem] text-green-400 hover:text-green-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-green-100 hover:text-green-300">
          ORDERS RECEIVED
        </span>
      </div>
    </Link>

    <Link to="/user-orders" className="flex relative">
      <div className="flex items-center transition-transform transform hover:translate-x-2">
        <AiOutlineShoppingCart
          className="mr-2 mt-[3rem] text-red-400 hover:text-red-300 text-glow"
          size={26}
        />
        <span className="hidden nav-item-name mt-[3rem] text-red-100 hover:text-red-300">
          MY ORDERS
        </span>
      </div>
    </Link>
  </div>

  <div className="relative mt-auto" ref={dropdownRef}>
    {userInfo && (
      <div className="flex flex-col items-center mb-2">
        <span className="text-purple-100 text-sm font-serif truncate max-w-[90%] text-center">
          {userInfo.firstname || userInfo.email.split('@')[0] || 'Wizard'}
        </span>
      </div>
    )}
    <button
      onClick={toggleDropdown}
      className="flex items-center justify-center w-full p-2 rounded-lg
      text-purple-100 hover:text-purple-300 
      transition-all duration-200 focus:outline-none gap-2
      hover:bg-purple-500/10"
    >
      {userInfo && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-purple-400 transition-transform duration-300 ${
            dropdownOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      )}
    </button>

    {dropdownOpen && userInfo && (
      <ul className="absolute bottom-full left-0 mb-2 w-48 py-2 rounded-lg 
                    bg-[#0c071d]/95 backdrop-blur-xl border border-amber-500/20 
                    shadow-xl shadow-purple-500/20
                    transition-all duration-200 ease-in-out
                    dropdown-enter"
      >
        {userInfo.isAdmin && (
          <>
            <li className="px-1 hover:bg-amber-500/10 rounded-md mx-1">
              <Link
                to="/admin/categorylist"
                className="block px-3 py-2 text-blue-100 hover:text-blue-300 
                         transition-all duration-200 font-serif"
              >
                Category
              </Link>
            </li>
          </>
        )}

        <li className="px-1 hover:bg-purple-500/10 rounded-md mx-1">
          <Link
            to="/profile"
            className="block px-3 py-2 text-purple-100 hover:text-purple-300 
                     transition-all duration-200 font-serif"
          >
            Profile
          </Link>
        </li>

        <li className="px-1 hover:bg-amber-500/10 rounded-md mx-1">
          <Link
            to="/orderlist"
            className="block px-3 py-2 text-amber-100 hover:text-amber-300 
                     transition-all duration-200 font-serif"
          >
            Orders Recieved
          </Link>
        </li>
        <li className="px-1 hover:bg-red-500/10 rounded-md mx-1">
          <button
            onClick={logoutHandler}
            className="w-full px-3 py-2 text-left text-red-300 hover:text-red-200 
                     transition-all duration-200 font-serif"
          >
            Logout
          </button>
        </li>
      </ul>
    )}
    {!userInfo && (
      <ul>
        <li>
          <Link
            to="/login"
            className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
          >
            <AiOutlineLogin
              className=" text-purple-400 hover:text-purple-300"
              size={26}
            />
            <span className="hidden nav-item-name text-purple-100 hover:text-purple-300">
              LOGIN
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
          >
            <AiOutlineUserAdd
              className="text-blue-400 hover:text-blue-300"
              size={26}
            />
            <span className="hidden nav-item-name text-blue-100 hover:text-blue-300">
              REGISTER
            </span>
          </Link>
        </li>
      </ul>
    )}
  </div>
</div>

  );
};

export default Navigation;