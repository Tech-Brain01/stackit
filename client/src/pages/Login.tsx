// src/pages/Login.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnim from "../assets/Login.json";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false); // false = Sign Up, true = Login
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // mock authentication
    console.log(isLogin ? 'Login attempted' : 'Sign up attempted', formData);
    setTimeout(() => {
      navigate(from); 
    }, 500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => navigate('/')} />
      
      {/* Centered Login Modal */}
      <motion.div
        className="relative z-10 w-[90%] max-w-5xl h-[80vh] bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/20 flex overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Left Side - Login Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center relative">
          {/* Gradient Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-l-2xl" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                {isLogin ? "Login to your account" : "Sign up to get started"}
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Username field - only for Sign Up */}
              {!isLogin && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Confirm Password field - only for Sign Up */}
              {!isLogin && (
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border border-white/20 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                    required
                  />
                </div>
              )}
              
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                whileHover={{ boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </motion.button>

              {/* Toggle between Login and Sign Up */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div className="w-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center p-8 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Lottie 
              animationData={loginAnim} 
              loop 
              autoplay 
              className="w-96 h-96 drop-shadow-2xl" 
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
