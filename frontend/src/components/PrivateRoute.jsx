import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// PrivateRoute checks if the user is logged in
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get user info from redux store

  // If user is logged in, render protected routes (Outlet). Otherwise, redirect to login page
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
