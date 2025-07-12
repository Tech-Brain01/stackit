import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <motion.nav
      className="flex items-center space-x-2 text-sm text-gray-500 mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          
          {item.path ? (
            <button
              onClick={() => handleClick(item.path)}
              className="hover:text-blue-600 transition-colors duration-200 cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;
