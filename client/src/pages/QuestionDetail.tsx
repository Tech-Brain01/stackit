import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import VoteComponent from '../components/VoteComponent';
import RichText from '../components/RichText';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  createdAt: string;
}

interface Answer {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  votes: number;
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answerContent, setAnswerContent] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState<{[key: string]: string}>({});
  const [showCommentBox, setShowCommentBox] = useState<{[key: string]: boolean}>({});
  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: '1',
      content: `You can use the CONCAT function in SQL to join two columns. Here's how you can do it:\n\n<code>SELECT CONCAT(first_name, ' ', last_name) AS full_name\nFROM your_table_name;</code>\n\nAlternatively, you can use the || operator (depending on your database):\n\n<code>SELECT first_name || ' ' || last_name AS full_name\nFROM your_table_name;</code>`,
      userId: 'user123',
      createdAt: '2025-07-12T10:30:00',
      votes: 5,
      comments: [
        {
          id: 'c1',
          content: 'Great explanation! This works perfectly for MySQL.',
          userId: 'user789',
          createdAt: '2025-07-12T11:00:00'
        },
        {
          id: 'c2',
          content: 'What about handling NULL values in the columns?',
          userId: 'user456',
          createdAt: '2025-07-12T11:15:00'
        }
      ]
    },
    {
      id: '2',
      content: `Another approach is to use the CONCAT_WS function which handles null values better:\n\n<code>SELECT CONCAT_WS(' ', first_name, last_name) AS full_name\nFROM your_table_name;</code>`,
      userId: 'user456',
      createdAt: '2025-07-12T11:15:00',
      votes: 2,
      comments: []
    }
  ]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/dummy_questions.json');
        const data = await response.json();
        const foundQuestion = data.find((q: Question) => q.id === id);
        setQuestion(foundQuestion || null);
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex gap-6">
                <div className="w-16 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Questions', path: '/' },
    { label: question.title.length > 50 ? question.title.substring(0, 50) + '...' : question.title }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'asked just now';
    if (diffInHours < 24) return `asked ${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `asked ${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `asked ${diffInMonths} months ago`;
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.trim()) {
      console.log('Answer submitted:', answerContent);
      setAnswerContent('');
      // In a real app, you would submit this to your backend
    }
  };

  const handleAddComment = (answerId: string) => {
    const content = commentContent[answerId]?.trim();
    if (content) {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        content,
        userId: 'currentUser',
        createdAt: new Date().toISOString()
      };

      setAnswers(prevAnswers => 
        prevAnswers.map(answer => 
          answer.id === answerId 
            ? { ...answer, comments: [...(answer.comments || []), newComment] }
            : answer
        )
      );

      setCommentContent(prev => ({ ...prev, [answerId]: '' }));
      setShowCommentBox(prev => ({ ...prev, [answerId]: false }));
    }
  };

  const toggleCommentBox = (answerId: string) => {
    setShowCommentBox(prev => ({ ...prev, [answerId]: !prev[answerId] }));
  };

  const handleCommentChange = (answerId: string, content: string) => {
    setCommentContent(prev => ({ ...prev, [answerId]: content }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Question Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex gap-6">
            {/* Vote Component */}
            <VoteComponent 
              initialVotes={Math.floor(Math.random() * 50)} 
              className="flex-shrink-0"
            />

            {/* Question Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {question.title}
              </h1>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {question.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {question.userId.charAt(0).toUpperCase()}
                  </div>
                  <span>Asked by User {question.userId.slice(0, 8)}</span>
                </div>
                <span>{formatTimeAgo(question.createdAt)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Answers Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Answers ({answers.length})
          </h2>

          {answers.map((answer) => (
            <div key={answer.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
              <div className="flex gap-6">
                {/* Vote Component for Answer */}
                <VoteComponent 
                  initialVotes={answer.votes} 
                  className="flex-shrink-0"
                />

                {/* Answer Content */}
                <div className="flex-1">
                  <div 
                    className="prose max-w-none mb-4"
                    dangerouslySetInnerHTML={{ 
                      __html: answer.content.replace(/\n/g, '<br>').replace(/<code>(.*?)<\/code>/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
                    }}
                  />

                  {/* Answer Actions */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <button
                      onClick={() => toggleCommentBox(answer.id)}
                      className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Add Comment
                    </button>
                    {answer.comments && answer.comments.length > 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {answer.comments.length} comment{answer.comments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Comment Box */}
                  {showCommentBox[answer.id] && (
                    <motion.div
                      className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add your comment:
                      </label>
                      <textarea
                        value={commentContent[answer.id] || ''}
                        onChange={(e) => handleCommentChange(answer.id, e.target.value)}
                        placeholder="Share your thoughts on this answer..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAddComment(answer.id)}
                          disabled={!commentContent[answer.id]?.trim()}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            commentContent[answer.id]?.trim()
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Post Comment
                        </button>
                        <button
                          onClick={() => toggleCommentBox(answer.id)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Comments List */}
                  {answer.comments && answer.comments.length > 0 && (
                    <div className="space-y-3 mb-4 ml-2">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        Comments:
                      </div>
                      {answer.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400 shadow-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {comment.userId.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{comment.userId}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Answer Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {answer.userId.charAt(0).toUpperCase()}
                      </div>
                      <span>Answered by {answer.userId}</span>
                    </div>
                    <span>{formatTimeAgo(answer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Submit Answer Section */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Submit Your Answer</h3>
          
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-6">
              <RichText
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here... You can use the formatting tools above to style your response."
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={!answerContent.trim()}
                className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                  answerContent.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={answerContent.trim() ? { scale: 1.05 } : {}}
                whileTap={answerContent.trim() ? { scale: 0.95 } : {}}
              >
                Submit Answer
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionDetail;
