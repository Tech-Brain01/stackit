import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnim from "../assets/Login.json";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";

// Define the backend URL with protocol detection
const Backend_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

interface LoginResponse {
  error?: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false); // false = Sign Up, true = Login
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || "/";

  const testConnection = async () => {
    try {
      const response = await fetch(`${Backend_URL}/api/health`, {
        method: "GET",
        mode: "cors",
      });
      console.log("Connection test:", response.ok ? "SUCCESS" : "FAILED");
    } catch (error) {
      console.error("Connection test failed:", error);
    }
  };

  // Test connection on component mount
  React.useEffect(() => {
    testConnection();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Username validation for signup
    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters long";
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const url = `${Backend_URL}${endpoint}`;

      // Debug logging
      console.log("Backend URL:", Backend_URL);
      console.log("Full URL:", url);
      console.log("Request payload:", isLogin ? "login" : "signup");

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(
          data.message || `${isLogin ? "Login" : "Sign up"} failed`
        );
      }

      // Handle successful authentication
      if (data.token && data.user) {
        // Use the context login function
        login(data.token, data.user);

        showToast(
          data.message || `${isLogin ? "Login" : "Sign up"} successful!`,
          "success"
        );

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate(from);
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      // console.error(`${isLogin ? "Login" : "Sign up"} error:`, error);

      let errorMessage = `${
        isLogin ? "Login" : "Sign up"
      } failed. Please try again.`;

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        } else if (
          error.message.includes("SSL") ||
          error.message.includes("certificate")
        ) {
          errorMessage =
            "SSL connection error. Please check server configuration.";
        } else {
          errorMessage = error.message;
        }
      }

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => navigate("/")}
      />

      {/* Centered Login Modal */}
      <motion.div
        className="relative z-10 w-[90%] max-w-5xl h-[80vh] bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/20 flex overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Side - Login Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center relative">
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
              onSubmit={handleSubmit}
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
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className={`w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border transition-all duration-300 backdrop-blur-sm ${
                      errors.username
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-blue-400 focus:bg-white/15"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border transition-all duration-300 backdrop-blur-sm ${
                    errors.email
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-blue-400 focus:bg-white/15"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border transition-all duration-300 backdrop-blur-sm ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-blue-400 focus:bg-white/15"
                  }`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field - only for Sign Up */}
              {!isLogin && (
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full bg-white/10 text-white px-6 py-4 rounded-xl placeholder-gray-400 outline-none border transition-all duration-300 backdrop-blur-sm ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-blue-400 focus:bg-white/15"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
                whileHover={
                  !isLoading
                    ? {
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                      }
                    : {}
                }
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                title="Submit"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </motion.button>

              {/* Toggle between Login and Sign Up */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-300 disabled:opacity-50"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Login"}
                </button>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Right Side - Animation */}
        <div className="hidden w-1/2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 md:flex items-center justify-center p-8 relative">
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

      {/* Toast Notification */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 max-w-sm w-full ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-rose-600"
          } text-white px-6 py-4 rounded-xl shadow-lg z-50 backdrop-blur-sm border border-white/20`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-4 text-white/80 hover:text-white transition-colors"
              title="Close notification"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
