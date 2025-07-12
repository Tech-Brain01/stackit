import { motion } from "framer-motion";
import { useState } from "react";

interface VoteComponentProps {
  id: string;
  initialVotes?: number;
  onVote?: (voteType: "UPVOTE" | "DOWNVOTE") => void;
  className?: string;
}

const VoteComponent = ({
  id,
  initialVotes = 0,
  onVote,
  className = "",
}: VoteComponentProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<"UPVOTE" | "DOWNVOTE" | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showNotification = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const sendVoteToAPI = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `http://localhost:8080/api/answers/${id}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            voteType: voteType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Vote API error:", error);
      return false;
    }
  };

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    if (isLoading) return;

    setIsLoading(true);

    // Store previous state for potential rollback
    const prevVotes = votes;
    const prevUserVote = userVote;

    // Optimistic update
    if (userVote === voteType) {
      // Remove vote
      setVotes((prev) => prev + (voteType === "UPVOTE" ? -1 : 1));
      setUserVote(null);
    } else {
      // Add new vote or change vote
      if (userVote) {
        // Changing vote
        setVotes((prev) => prev + (voteType === "UPVOTE" ? 2 : -2));
      } else {
        // New vote
        setVotes((prev) => prev + (voteType === "UPVOTE" ? 1 : -1));
      }
      setUserVote(voteType);
    }

    // Send to API
    const success = await sendVoteToAPI(voteType);

    if (success) {
      showNotification("Vote submitted successfully!");
      onVote?.(voteType);
    } else {
      // Rollback optimistic update
      setVotes(prevVotes);
      setUserVote(prevUserVote);
      showNotification("Failed to submit vote. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className={`flex flex-col items-center ${className}`}>
        {/* Upvote Button */}
        <motion.button
          onClick={() => handleVote("UPVOTE")}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            userVote === "UPVOTE"
              ? "text-green-600 bg-green-50"
              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={!isLoading ? { scale: 1.1 } : {}}
          whileTap={!isLoading ? { scale: 0.9 } : {}}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l-8 8h5v8h6v-8h5l-8-8z" />
          </svg>
        </motion.button>

        {/* Vote Count */}
        <span
          className={`font-semibold text-lg my-2 ${
            votes > 0
              ? "text-green-600"
              : votes < 0
              ? "text-red-600"
              : "text-gray-700"
          }`}
        >
          {votes}
        </span>

        {/* Downvote Button */}
        <motion.button
          onClick={() => handleVote("DOWNVOTE")}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            userVote === "DOWNVOTE"
              ? "text-red-600 bg-red-50"
              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          whileHover={!isLoading ? { scale: 1.1 } : {}}
          whileTap={!isLoading ? { scale: 0.9 } : {}}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 20l8-8h-5V4H9v8H4l8 8z" />
          </svg>
        </motion.button>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            popupMessage.includes("successfully")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center">
            {popupMessage.includes("successfully") ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{popupMessage}</span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default VoteComponent;
