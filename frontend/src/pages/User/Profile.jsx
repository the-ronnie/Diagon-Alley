import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Sparkles, Scroll, Wand2, BookOpen, Package, ShoppingBag } from 'lucide-react';
import Loader from "../../components/Loader";
import { useDeleteProfileMutation, useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials, logout } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();
  const navigate = useNavigate();

  useEffect(() => {
    setFirstName(userInfo.firstname || "");
    setLastName(userInfo.lastname || "");
    setEmail(userInfo.email || "");
    setAge(userInfo.age || "");
    setContactNumber(userInfo.contactNumber || "");
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          firstname,
          lastname,
          email,
          age,
          contactNumber,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to vanish your magical profile? This action cannot be undone!')) {
      try {
        await deleteProfile(userInfo._id).unwrap();
        dispatch(logout());
        navigate('/');
        toast.success('Your magical profile has been vanished successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete profile');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative wave pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjMyMCIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDE0NDAgMzIwIj48cGF0aCBmaWxsPSIjMEVBNUU5IiBmaWxsLW9wYWNpdHk9Ii4yIiBkPSJNMTQ0MCAyMzh2ODJIMFYwczQ4MCAyMDAgNzIwIDIwMCA3MjAtMjAwIDcyMCAyMDB2MzhoLTF6Ii8+PC9zdmc+')] bg-repeat-x"></div>
      </div>

      <div className="w-full max-w-4xl relative">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-8 shadow-xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200 rounded-xl blur opacity-50" />
          
          <div className="relative">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative flex items-center gap-2">
                <BookOpen className="text-sky-600 w-6 h-6" />
                <Wand2 className="text-cyan-600 w-6 h-6" />
                <Sparkles className="text-blue-600 w-6 h-6" />
                <Scroll className="text-sky-600 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-serif font-semibold text-sky-950">
                Your Profile
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sky-900 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                               focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                               transition-all duration-300 text-sky-950 placeholder-sky-400"
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-900 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                               focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                               transition-all duration-300 text-sky-950 placeholder-sky-400"
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                             focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                             transition-all duration-300 text-sky-950 placeholder-sky-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sky-900 mb-2">Age</label>
                    <input
                      type="number"
                      min="13"
                      max="150"
                      className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                               focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                               transition-all duration-300 text-sky-950 placeholder-sky-400"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sky-900 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                               focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                               transition-all duration-300 text-sky-950 placeholder-sky-400"
                      value={contactNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setContactNumber(value);
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-900 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                             focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                             transition-all duration-300 text-sky-950 placeholder-sky-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sky-900 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/50 border border-sky-200 rounded-lg 
                             focus:ring-2 focus:ring-sky-300 focus:border-transparent outline-none
                             transition-all duration-300 text-sky-950 placeholder-sky-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loadingUpdateProfile}
                    className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 
                             hover:from-sky-500 hover:to-blue-600 
                             text-white font-medium py-3 px-4 rounded-lg transition-all duration-300
                             flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {loadingUpdateProfile ? (
                      <>
                        <span>Updating...</span>
                        <Loader />
                      </>
                    ) : (
                      <>
                        <span>Update Profile</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                    className="bg-gradient-to-r from-red-400 to-red-500
                             hover:from-red-500 hover:to-red-600
                             text-white font-medium py-3 px-4 rounded-lg transition-all duration-300
                             flex items-center justify-center gap-2 min-w-[120px] shadow-lg shadow-red-500/20"
                  >
                    {isDeleting ? (
                      <>
                        <span>Deleting...</span>
                        <Loader />
                      </>
                    ) : (
                      <>
                        <span>Delete Profile</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                <div className="bg-white/50 border border-sky-200 rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl text-sky-900 mb-4">Quick Links</h2>
                  <div className="space-y-4">
                    <Link
                      to="/user-orders"
                      className="flex items-center gap-3 text-sky-700 hover:text-sky-900 
                               transition-all duration-200 p-3 rounded-lg hover:bg-sky-100"
                    >
                      <Package className="w-5 h-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/allproductslist"
                      className="flex items-center gap-3 text-sky-700 hover:text-sky-900 
                               transition-all duration-200 p-3 rounded-lg hover:bg-sky-100"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>My Items</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;