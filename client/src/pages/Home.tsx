import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Filter from '../components/Filter';
import QuestionCard from '../components/QuestionCard';
import Pagination from '../components/Pagination';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  createdAt: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const questionsPerPage = 6;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/dummy_questions.json');
        const data = await response.json();
        // Filter out incomplete questions (some entries in the JSON might be missing required fields)
        const validQuestions = data.filter((q: any) => 
          q.id && q.title && q.description && q.tags && q.userId && q.createdAt
        );
        setQuestions(validQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handleAskQuestion = () => {
    navigate('/ask');
  };

  const handleBrowseQuestions = () => {
    navigate('/questions');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Filter Section - Below Navbar */}
      <Filter />
 
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              StackIt
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Where developers come together to ask questions, share knowledge, and build amazing things.
            </p>
            

          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Questions</h2>
              <p className="text-gray-600">Discover knowledge, share solutions, and connect with the community</p>
            </div>
            <div className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${questions.length} questions`}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="w-12 h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Question Cards Grid */}
              <div className="grid gap-6">
                {currentQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </motion.div>
      </div>

    </div>
  );
};

export default Home;