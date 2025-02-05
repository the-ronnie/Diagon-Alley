import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Sparkles, Scroll, Wand2, BookOpen } from 'lucide-react';

const Register = () => {
  const [firstname, setFirstName] = useState("");  
  const [lastname, setLastName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/profile";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userData = {
        firstname: firstname.trim(),    // Changed from firstName to firstname
        lastname: lastname.trim(),      // Changed from lastName to lastname
        email: email.trim(),
        password,
        age: parseInt(age),
        contactNumber: contactNumber.trim()
      };

      console.log('Submitting user data:', userData); // Debug log

      const res = await register(userData).unwrap();
      console.log('Registration response:', res); // Debug log
      
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Successfully registered!");
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      toast.error(err?.data?.message || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f2e] relative overflow-hidden flex items-center justify-center p-4">
      {/* Magical floating elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-75" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-75" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-300 rounded-full animate-ping opacity-75" />
        
        {/* Magical runes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-20 text-amber-500/20 text-6xl rotate-45">✦</div>
          <div className="absolute bottom-40 right-20 text-purple-500/20 text-6xl -rotate-12">⚡</div>
          <div className="absolute top-1/2 left-1/3 text-blue-500/20 text-6xl rotate-90">✧</div>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-[#0c071d]/90 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-amber-500/20 relative">
          {/* Magical glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000" />
          
          <div className="relative">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative flex items-center gap-2">
                <BookOpen className="text-amber-400 w-6 h-6" />
                <Wand2 className="text-purple-400 w-6 h-6" />
                <Sparkles className="text-blue-400 w-6 h-6" />
                <Scroll className="text-amber-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl font-serif font-semibold bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Diagon Alley
              </h1>
              <p className="text-amber-100/60 text-sm text-center font-serif">Where Magic Meets Commerce</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                >
                  Wizard's First Name*
                </label>
                <input
                  required
                  type="text"
                  id="firstName"
                  className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                          focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                          transition-all duration-300 text-amber-100 placeholder-amber-100/30
                          hover:border-purple-400/50"
                  placeholder="Albus"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  minLength="2"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                >
                  Wizard's Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                          focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                          transition-all duration-300 text-amber-100 placeholder-amber-100/30
                          hover:border-purple-400/50"
                  placeholder="Dumbledore"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                >
                  Magical Email Address*
                </label>
                <input
                  required
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                          focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                          transition-all duration-300 text-amber-100 placeholder-amber-100/30
                          hover:border-purple-400/50"
                  placeholder="wizard@magical-iiit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                  >
                    Wizard's Age*
                  </label>
                  <input
                    required
                    type="number"
                    id="age"
                    min="13"
                    max="150"
                    className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                            focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                            transition-all duration-300 text-amber-100 placeholder-amber-100/30
                            hover:border-purple-400/50"
                    placeholder="150"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                  >
                    Crystal Ball Number*
                  </label>
                  <input
                    required
                    type="tel"
                    id="contactNumber"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                            focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                            transition-all duration-300 text-amber-100 placeholder-amber-100/30
                            hover:border-purple-400/50"
                    placeholder="10 digit number"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                >
                  Secret Spell (Password)*
                </label>
                <input
                  required
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                          focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                          transition-all duration-300 text-amber-100 placeholder-amber-100/30
                          hover:border-purple-400/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                >
                  Confirm Secret Spell
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                          focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                          transition-all duration-300 text-amber-100 placeholder-amber-100/30
                          hover:border-purple-400/50"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 via-purple-600 to-blue-600 
                         hover:from-amber-500 hover:via-purple-500 hover:to-blue-500 
                         text-white font-serif py-3 px-4 rounded-lg transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                         shadow-lg shadow-purple-500/20 relative group"
              >
                <span className="relative z-10">
                  {isLoading ? 'Casting Registration Spell...' : 'Register Your Wand'}
                </span>
                {isLoading ? <Loader /> : <Sparkles className="w-4 h-4 group-hover:animate-spin" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-amber-100/60 font-serif">
                Already have an account?{' '}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-purple-400 hover:text-amber-300 transition-colors duration-200"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
