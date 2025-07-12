import { m, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Text from "../components/RichText";
import TagSelector from "../components/TagSelector";
interface question {
  title: string;
  description: string;
  tags: string[];
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}
const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !title) return;

    setSubmittingAnswer(true);

    // Optimistic update - create temporary answer
    const tempAnswer: question = {
      title,
      description,
      tags,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tempAnswer),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      addToast("Answer submitted successfully!", "success");
      navigate("/");
    } catch (error) {
      // Remove optimistic answer on error

      addToast("Failed to submit answer. Please try again.", "error");
      console.error("Error submitting answer:", error);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          className="rounded-2xl p-8 shadow-2xl border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmitQuestion} className="space-y-8">
            {/* Title Field */}
            <InputField
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="What's your programming question? Be specific."
              required
            />

            {/* Description Field */}
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Description
                <span className="text-red-400 ml-1">*</span>
              </label>
              <Text
                value={description}
                onChange={setDescription}
                placeholder="Provide all the details. What did you try? What were you expecting? What actually happened?"
              />
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Tags
              </label>
              <TagSelector
                value={tags}
                onChange={setTags}
                placeholder="e.g. javascript, react, node.js (press Enter to add)"
              />
              <p className="text-gray-400 text-sm mt-2">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                disabled={!title.trim() || !description.trim()}
              >
                {submittingAnswer && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {submittingAnswer ? "Submitting..." : "   Submit Question"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AskQuestion;
