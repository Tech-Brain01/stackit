import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-4 py-2 text-gray-400">...</span>
          ) : (
            <motion.button
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </motion.button>
          )}
        </div>
      ))}

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Pagination;
