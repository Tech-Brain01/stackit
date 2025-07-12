import { motion } from 'framer-motion';
import { useState } from 'react';

interface VoteComponentProps {
  initialVotes?: number;
  onVote?: (voteType: 'up' | 'down') => void;
  className?: string;
}

const VoteComponent = ({ initialVotes = 0, onVote, className = '' }: VoteComponentProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (voteType: 'up' | 'down') => {
    if (userVote === voteType) {
      // Remove vote
      setVotes(prev => prev + (voteType === 'up' ? -1 : 1));
      setUserVote(null);
    } else {
      // Add new vote or change vote
      if (userVote) {
        // Changing vote
        setVotes(prev => prev + (voteType === 'up' ? 2 : -2));
      } else {
        // New vote
        setVotes(prev => prev + (voteType === 'up' ? 1 : -1));
      }
      setUserVote(voteType);
    }
    
    onVote?.(voteType);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Upvote Button */}
      <motion.button
        onClick={() => handleVote('up')}
        className={`p-2 rounded-lg transition-all duration-200 ${
          userVote === 'up'
            ? 'text-green-600 bg-green-50'
            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z" />
        </svg>
      </motion.button>

      {/* Vote Count */}
      <span className={`font-semibold text-lg my-2 ${
        votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-700'
      }`}>
        {votes}
      </span>

      {/* Downvote Button */}
      <motion.button
        onClick={() => handleVote('down')}
        className={`p-2 rounded-lg transition-all duration-200 ${
          userVote === 'down'
            ? 'text-red-600 bg-red-50'
            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 20l8-8h-5V4H9v8H4l8 8z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default VoteComponent;
