import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Filter = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    navigate('/ask');
  };

  const filterOptions = [
    { id: 'all', label: 'All', count: null },
    { id: 'newest', label: 'Newest', count: null },
    { id: 'unanswered', label: 'Unanswered', count: 42 }
  ];

  const selectedOption = filterOptions.find(option => option.id === selectedFilter);

  const handleFilterSelect = (filterId: string) => {
    console.log('Selected filter:', filterId); // Debug log
    setSelectedFilter(filterId);
    setIsDropdownOpen(false);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Side - Filter Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAskQuestion}
            >
              Ask New Question
            </motion.button>

            <div className="flex items-center gap-1 ml-4">
              {/* Dropdown Filter */}
              <div className="relative z-50" ref={dropdownRef}>
                <motion.button
                  onClick={handleDropdownClick}
                  className={`px-4 py-2 rounded-lg font-medium shadow-md flex items-center gap-2 min-w-[140px] justify-between transition-all duration-300 ${
                    selectedFilter === 'all' 
                      ? 'bg-gray-800 text-white' 
                      : selectedFilter === 'newest'
                      ? 'bg-blue-600 text-white'
                      : 'bg-orange-600 text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedOption?.label || 'All'}</span>
                    {selectedOption?.count && (
                      <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {selectedOption.count}
                      </span>
                    )}
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filterOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFilterSelect(option.id);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                          selectedFilter === option.id 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.label}</span>
                          {selectedFilter === option.id && (
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {option.count && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Search */}
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-80 px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Search"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;