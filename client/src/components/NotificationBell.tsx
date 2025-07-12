import { motion } from 'framer-motion';
import { useState } from 'react';

const NotificationBell = () => {
  const [hasNotifications] = useState(true);

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <svg 
        className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-5-5v5zM10 3a3 3 0 00-3 3v8l-2 2h10a3 3 0 003-3V6a3 3 0 00-3-3h-3z"
        />
      </svg>
      
      {hasNotifications && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default NotificationBell;