import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  createdAt: string;
  votes?: number;
  answers?: number;
  views?: number;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionCard = ({ question, index }: QuestionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/question/${question.id}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "asked just now";
    if (diffInHours < 24) return `asked ${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `asked ${diffInDays} days ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `asked ${diffInMonths} months ago`;
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
    >
      {/* Vote and Stats Section */}
      <div className="flex items-start gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center text-sm text-gray-500 min-w-[60px]">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <span className="font-semibold text-lg text-gray-700">
              {question.votes || Math.floor(Math.random() * 50)}
            </span>
            <span className="text-xs">votes</span>
          </div>

          <div className="flex flex-col items-center p-2 mt-2 bg-blue-50 rounded-lg">
            {/* <span className="font-semibold text-lg text-blue-600">
              {question.answers || Math.floor(Math.random() * 10)}
            </span> */}
            <span className="text-xs text-blue-600">ans</span>
          </div>

          <div className="flex items-center mt-2 text-xs text-gray-400">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {question.views || Math.floor(Math.random() * 500)}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {question.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {question.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author and Time */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {question.userId.charAt(0).toUpperCase()}
              </div>
              <span>User {question.userId.slice(0, 8)}</span>
            </div>

            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTimeAgo(question.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
