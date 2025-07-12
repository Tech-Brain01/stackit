import { motion } from 'framer-motion';

const Avatar = () => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center cursor-pointer shadow-lg">
        <span className="text-white font-semibold text-sm">AT</span>
      </div>
      {/* Online indicator */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
    </motion.div>
  );
};

export default Avatar;