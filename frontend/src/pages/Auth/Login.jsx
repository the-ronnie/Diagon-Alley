import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Sparkles, Scroll, Wand2, BookOpen } from 'lucide-react';
import Loader from "../../components/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [login, { isLoading }] = useLoginMutation();
  
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
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
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
                    htmlFor="email"
                    className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                  >
                    Wizard's Credential
                  </label>
                  <input
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
  
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-amber-200/80 mb-2 font-serif"
                  >
                    Enchanted Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-[#160c2e]/50 border border-amber-500/30 rounded-lg 
                            focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none
                            transition-all duration-300 text-amber-100 placeholder-amber-100/30
                            hover:border-purple-400/50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    {isLoading ? 'Casting Spell...' : 'Enter The Market'}
                  </span>
                  {isLoading ? <Loader /> : <Sparkles className="w-4 h-4 group-hover:animate-spin" />}
                </button>
              </form>
  
              <div className="mt-6 text-center">
                <p className="text-amber-100/60 font-serif">
                  New Wizard?{' '}
                  <Link
                    to={redirect ? `/register?redirect=${redirect}` : "/register"}
                    className="text-purple-400 hover:text-amber-300 transition-colors duration-200"
                  >
                    Register Your Wand
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;