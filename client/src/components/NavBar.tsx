import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from './Avatar';
import NotificationBell from './NotificationBell';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAskQuestionPage = location.pathname === '/ask';

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <motion.header
      className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 relative"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />

      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        {/* Logo */}
        <motion.div
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={handleHomeClick}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight">
            StackIt
          </h1>
          <motion.div
            className="ml-2 w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Center - User Info (only on ask question page) */}
        {isAskQuestionPage && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 font-medium">Amrendera Tomar</span>
          </div>
        )}

        {/* Right Side - Conditional Content */}
        {isAskQuestionPage ? (
          // Ask Question Page Navigation
          <div className="flex items-center gap-4">
            <motion.button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHomeClick}
            >
              Home
            </motion.button>
            
            <NotificationBell />
            <Avatar />
          </div>
        ) : (
          // Default Navigation (Login Button)
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLoginClick}
          >
            Login
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default NavBar;